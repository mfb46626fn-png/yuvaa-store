import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { product_id, user_name, rating, comment, images } = body;

        if (!product_id || !user_name || !rating) {
            return NextResponse.json(
                { error: "Gerekli alanlar eksik (İsim, Puanleme)." },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Check session (optional, for connecting user_id)
        const { data: { session } } = await supabase.auth.getSession();
        const user_id = session?.user?.id || null;

        const { error } = await supabase
            .from("product_reviews")
            .insert({
                product_id,
                user_id,
                user_name,
                rating: parseInt(rating),
                comment,
                images: images || [],
                is_approved: false // Requires admin approval
            });

        if (error) {
            console.error("Review insertion error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Yorum başarıyla gönderildi, onay sürecindedir." });
    } catch (error: any) {
        console.error("Review POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Get approved reviews for a specific product
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const supabase = await createServerSupabaseClient();

        const { data: reviews, error } = await supabase
            .from("product_reviews")
            .select("*")
            .eq("product_id", productId)
            .eq("is_approved", true)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
