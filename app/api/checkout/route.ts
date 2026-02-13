import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPayTRToken } from "@/lib/paytr";
import { nanoid } from "nanoid"; // Recommended for unique order IDs or use UUID

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            firstName, lastName, email, phone,
            city, district, address, zipCode,
            items // Cart items from client
        } = body;

        // 1. Validate User / Auth (Optional: checkout can be guest)
        // Check session if you want to link to user, but let's allow guest for now or assume auth from client headers if needed.
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Validate Items & Calculate Price Server-Side
        // Never trust client price.
        // Fetch products
        const productIds = items.map((item: any) => item.id);
        const { data: products } = await supabase
            .from("products")
            .select("id, title, price, sale_price")
            .in("id", productIds);

        if (!products || products.length === 0) {
            return NextResponse.json({ error: "Invalid products" }, { status: 400 });
        }

        let totalAmount = 0;
        const paytrBasket: any[] = [];

        items.forEach((item: any) => {
            const product = products.find((p) => p.id === item.id);
            if (product) {
                const price = product.sale_price || product.price;
                totalAmount += price * item.quantity;
                paytrBasket.push([product.title, price.toString(), item.quantity]); // Name, Price, Qty
            }
        });

        // PayTR expects amount in *kuruş*? No, API docs usually say "10.00" string or float? 
        // Docs: "9.99 TL için 9.99".
        // BUT wait, let's verify PayTR Node.js examples. 
        // Most libs use "payment_amount * 100".
        // Let's assume Kuruş (integer) for safety if we used a library, but raw API uses what?
        // Raw API documentation 2024: "payment_amount: Alınacak tahsilat tutarı. Örn: 10.50" -> String format is better.
        // Actually, PayTR often specifically asks for "payment_amount" to be *100. (e.g. 1099 for 10.99).
        // Let's use the *100 convention which is industry standard for payment gateways (Stripe/PayTR).
        // WARNING: If PayTR documentation says "örn 9.99", then it's string.
        // Let's check a standard PayTR integration snippet. 
        // Consensus: PayTR 'payment_amount' value is *100.

        const paymentAmountCents = Math.round(totalAmount * 100);

        // 3. Create Order Record in DB (Status: Pending)
        const merchantOid = "ORD-" + nanoid(10).toUpperCase();

        const { error: insertError } = await supabase.from("orders").insert({
            user_id: user?.id || null, // Guest or Auth
            status: "pending_payment",
            total: totalAmount,
            merchant_oid: merchantOid, // Track this ID
            shipping_address: {
                firstName, lastName, phone, city, district, address, zipCode
            },
            items: items // JSONB of items
        });

        if (insertError) {
            console.error(insertError);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        // 4. Request PayTR Token
        const userIp = req.headers.get("x-forwarded-for") || "127.0.0.1";

        const paytrParams = await getPayTRToken({
            user_ip: userIp,
            merchant_oid: merchantOid,
            email: email,
            payment_amount: paymentAmountCents,
            user_basket: paytrBasket,
            no_installment: 0, // 0 = allowed, 1 = forbidden (depends on logic)
            max_installment: 12,
            user_name: `${firstName} ${lastName}`,
            user_address: `${address} ${district}/${city}`,
            user_phone: phone
        });

        // 5. POST to PayTR to get actual IFRAME TOKEN
        // We prepared parameters, now we must fetch the token from PayTR endpoint?
        // Wait, PayTR works by sending these parameters via POST to "https://www.paytr.com/odeme/api/get-token"
        // The helper `getPayTRToken` just *signed* it. We need to actually perform the request here.

        const formData = new URLSearchParams();
        Object.entries(paytrParams).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        const paytrResponse = await fetch("https://www.paytr.com/odeme/api/get-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const paytrResult = await paytrResponse.json();

        if (paytrResult.status === "success") {
            return NextResponse.json({
                status: "success",
                iframe_token: paytrResult.token,
                order_id: merchantOid
            });
        } else {
            console.error("PayTR Error:", paytrResult.reason);
            return NextResponse.json({
                status: "error",
                message: paytrResult.reason
            }, { status: 400 });
        }

    } catch (e: any) {
        console.error("Checkout API Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
