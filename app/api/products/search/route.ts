import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        // Sadece arama/listeleme için gerekli ve boyut olarak küçük alanları alıyoruz
        const { data: products, error } = await supabase
            .from("products")
            .select(`
                id,
                title,
                slug,
                description,
                category,
                price,
                sale_price,
                images
            `);

        if (error) {
            console.error("Supabase search fetch error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Global search fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
