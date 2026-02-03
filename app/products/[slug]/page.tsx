import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: product } = await supabase
        .from("products")
        .select("title, description, images")
        .eq("slug", slug)
        .single();

    if (!product) {
        return {
            title: "Ürün Bulunamadı | Yuvaa Store",
        };
    }

    return {
        title: `${product.title} | Yuvaa Store`,
        description: product.description || `${product.title} detayları ve fiyatı.`,
        openGraph: {
            images: product.images?.[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: product } = await supabase
        .from("products")
        .select(`
            *,
            categories (
                name,
                slug
            )
        `)
        .eq("slug", slug)
        .single();

    if (!product) {
        notFound();
    }

    // Adapt category structure if it's an array
    const formattedProduct = {
        ...product,
        categories: product.categories
            ? Array.isArray(product.categories)
                ? product.categories[0]
                : product.categories
            : null
    };

    return (
        <div className="bg-background min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: Gallery */}
                    <div>
                        <ProductGallery
                            images={formattedProduct.images || ["/images/placeholder.png"]}
                            title={formattedProduct.title}
                        />
                    </div>

                    {/* Right: Info */}
                    <div>
                        <ProductInfo product={formattedProduct} />
                    </div>
                </div>
            </div>
        </div>
    );
}
