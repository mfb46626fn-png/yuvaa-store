import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: category } = await supabase
        .from("categories")
        .select("name")
        .eq("slug", slug)
        .single();

    if (!category) {
        return {
            title: "Kategori Bulunamadı | Yuvaa Store",
        };
    }

    return {
        title: `${category.name} | Yuvaa Store`,
        description: `${category.name} kategorisindeki benzersiz ürünleri keşfedin.`,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    // 1. Get Category ID
    const { data: category } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", slug)
        .single();

    if (!category) {
        notFound();
    }

    // 2. Get Products by Category ID
    const { data: products } = await supabase
        .from("products")
        .select(`
            *,
            categories (
                name,
                slug
            )
        `)
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });

    // Format products for ProductCard
    const formattedProducts = (products || []).map(p => ({
        ...p,
        categories: p.categories
            ? Array.isArray(p.categories)
                ? p.categories[0]
                : p.categories
            : null
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
                        {category.name}
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
                            Bu kategoride henüz ürün bulunmuyor.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Yakında eklenecek yeni parçalar için takipte kalın.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
