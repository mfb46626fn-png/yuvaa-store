import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendAbandonedCartEmail } from "@/lib/resend";

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();

        // 1. Verify Admin Access
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Parse Body
        const { session_id, target_email } = await request.json();

        if (!session_id || !target_email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 3. Get Cart Items for this session
        const { data: cartEvents } = await supabase
            .from("analytics_events")
            .select("event_data")
            .eq("session_id", session_id)
            .eq("event_type", "begin_checkout")
            .order("created_at", { ascending: false })
            .limit(1);

        if (!cartEvents || cartEvents.length === 0) {
            return NextResponse.json({ error: "Cart not found for this session" }, { status: 404 });
        }

        const cartTotal = cartEvents[0].event_data?.cartTotal || 0;
        const itemCount = cartEvents[0].event_data?.items || 0;

        // Note: For a fully detailed cart, we'd need to either save the full items array in 'begin_checkout'
        // or query 'add_to_cart' events. Since we only save total in begin_checkout right now, 
        // we will generate a simplified HTML or we can fetch the 'add_to_cart' products.

        const { data: itemEvents } = await supabase
            .from("analytics_events")
            .select("event_data")
            .eq("session_id", session_id)
            .eq("event_type", "add_to_cart");

        let itemsHtml = `<p>Sepetinizde <b>${itemCount} adet</b> ürün bulunuyor. Toplam Tutar: <b>${cartTotal}₺</b></p>`;

        if (itemEvents && itemEvents.length > 0) {
            itemsHtml += `<ul style="list-style: none; padding: 0;">`;
            // Deduplicate items just in case
            const seenItems = new Set();

            itemEvents.forEach(ev => {
                const product = ev.event_data?.product;
                if (product && !seenItems.has(product.id)) {
                    seenItems.add(product.id);
                    itemsHtml += `
                    <li style="margin-bottom: 10px; display: flex; align-items: center; gap: 15px;">
                        <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                        <span>${product.title} - ${product.price}₺</span>
                    </li>`;
                }
            });
            itemsHtml += `</ul>`;
        }

        // 4. Send Email via Resend
        await sendAbandonedCartEmail(target_email, itemsHtml);

        // 5. Log that recovery was sent (Optional but good practice)
        await supabase
            .from("analytics_events")
            .insert([
                {
                    event_type: 'recovery_email_sent',
                    session_id: session_id,
                    event_data: { target_email }
                }
            ]);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Recovery API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
