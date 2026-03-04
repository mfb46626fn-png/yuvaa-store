import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

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

import { CategoryFilters } from "@/components/category/CategoryFilters";

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

    // 2. Build Products Query
    let query = supabase
        .from("products")
        .select("*")
        .eq("category", slug)
        .eq("is_published", true); // Only published ones

    // Apply Filters from URL
    const orientation = resolvedSearchParams.orientation as string;
    if (orientation) query = query.in("orientation", orientation.split(','));

    const size = resolvedSearchParams.size as string;
    if (size) query = query.in("size_category", size.split(','));

    const tone = resolvedSearchParams.tone as string;
    if (tone) query = query.in("tone", tone.split(','));

    const frame = resolvedSearchParams.frame as string;
    if (frame) {
        // Handle boolean parsing. If URL has 'true,false', ignore filtering.
        const frames = frame.split(',');
        if (frames.length === 1) {
            query = query.eq("has_frame", frames[0] === 'true');
        }
    }

    const { data: products } = await query.order("created_at", { ascending: false });

    // 3. Extract unique available filters for this category's ACTIVE products
    const { data: allCategoryProducts } = await supabase
        .from("products")
        .select("orientation, tone, size_category")
        .eq("category", slug)
        .eq("is_published", true);

    const availableFilters = {
        orientations: Array.from(new Set((allCategoryProducts || []).map(p => p.orientation).filter(Boolean))),
        tones: Array.from(new Set((allCategoryProducts || []).map(p => p.tone).filter(Boolean))),
        sizeCategories: Array.from(new Set((allCategoryProducts || []).map(p => p.size_category).filter(Boolean))),
    };

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

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row items-start relative">
                    <CategoryFilters availableFilters={availableFilters} />

                    <div className="flex-1 w-full">
                        {/* Product Grid */}
                        {formattedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
                                    Arama kriterlerinize uygun ürün bulunamadı.
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Filtreleri temizleyerek daha fazla ürüne ulaşabilirsiniz.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
