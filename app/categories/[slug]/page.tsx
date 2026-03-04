import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";
import { CategorySorter } from "@/components/category/CategoryFilters";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: category } = await supabase
        .from("categories")
        .select("title")
        .eq("slug", slug)
        .single();

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

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const supabase = await createServerSupabaseClient();

    // 1. Get Category from DB
    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!category) {
        notFound();
    }

    // 2. Build Products Query with sorting
    const sort = resolvedSearchParams.sort as string;
    let orderColumn = "created_at";
    let ascending = false;

    if (sort === "price_asc") {
        orderColumn = "price";
        ascending = true;
    } else if (sort === "price_desc") {
        orderColumn = "price";
        ascending = false;
    }

    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("category", slug)
        .order(orderColumn, { ascending });

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
                <div className="mb-8 text-center">
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">
                        Koleksiyon
                    </span>
                    <h1 className="mt-2 font-serif text-4xl font-medium text-foreground md:text-5xl">
                        {category.title}
                    </h1>
                </div>

                {/* Sort Bar */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <p className="text-sm text-muted-foreground">
                        {formattedProducts.length} ürün
                    </p>
                    <CategorySorter />
                </div>

                {/* Product Grid */}
                {formattedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
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
                    </div>
                )}
            </div>
        </div>
    );
}
