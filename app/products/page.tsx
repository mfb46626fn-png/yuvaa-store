import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tüm Ürünler | Yuvaa Store",
    description: "Yuvaa Store'un eşsiz ev dekorasyon koleksiyonunu keşfedin.",
};

export default async function ProductsPage() {
    const supabase = await createServerSupabaseClient();

    const { data: products } = await supabase
        .from("products")
        .select(`
            *
        `)
        .order("created_at", { ascending: false });

    // Format products for ProductCard
    const formattedProducts = (products || []).map(p => ({
        ...p,
        category: {
            name: p.category,
            slug: p.category
        }
    }));

    return (
        <div className="bg-background min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">
                        Koleksiyon
                    </span>
                    <h1 className="mt-2 font-serif text-4xl font-medium text-foreground md:text-5xl">
                        Tüm Ürünler
                    </h1>
                </div>

                {/* Product Grid */}
                {formattedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {formattedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg border-dashed">
                        <p className="text-lg text-muted-foreground">
                            Henüz ürün bulunmuyor.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
