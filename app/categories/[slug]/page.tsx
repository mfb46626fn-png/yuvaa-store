import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";
import { CATEGORIES, getCategoryTitle } from "@/lib/constants";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = CATEGORIES.find(c => c.slug === slug);

    if (!category) {
        return {
            title: "Kategori Bulunamadı | Yuvaa Store",
        };
    }

    return {
        title: `${category.title} | Yuvaa Store`,
        description: `${category.title} kategorisindeki benzersiz ürünleri keşfedin.`,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    // 1. Get Category from Static Data
    const category = CATEGORIES.find(c => c.slug === slug);

    if (!category) {
        notFound();
    }

    // 2. Get Products by Category Slug (Text column)
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("category", slug) // Match against text column
        .order("created_at", { ascending: false });

    // Format products for ProductCard
    const formattedProducts = (products || []).map(p => ({
        ...p,
        category: {
            name: category.title,
            slug: category.slug
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
                        {category.title}
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
