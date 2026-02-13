import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Metadata } from "next";
import { CATEGORIES } from "@/lib/constants";
import { MobileStickyBar } from "@/components/product/MobileStickyBar";

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
        .select("*")
        .eq("slug", slug)
        .single();

    if (!product) {
        notFound();
    }

    // Find category from static constants
    const category = CATEGORIES.find(c => c.slug === product.category);

    const formattedProduct = {
        ...product,
        // Ensure category matches what components expect (string for slug)
        category: product.category || "ev-dekorasyon",
        categories: category || { name: "Ev Dekorasyon", slug: "ev-dekorasyon" }
    };

    return (
        <div className="bg-background min-h-screen pb-20 pt-4 md:pt-10">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
                    {/* Left: Gallery (55% on desktop ideally, but 50/50 is standard grid. We can use col-span if needed) */}
                    <div className="w-full">
                        <ProductGallery
                            images={formattedProduct.images || ["/images/placeholder.png"]}
                            title={formattedProduct.title}
                        />
                    </div>

                    {/* Right: Info (Sticky on desktop for better UX) */}
                    <div className="md:sticky md:top-24">
                        <ProductInfo product={formattedProduct} />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bar */}
            <MobileStickyBar product={{
                id: formattedProduct.id,
                title: formattedProduct.title,
                price: formattedProduct.price,
                sale_price: formattedProduct.sale_price,
                stock_quantity: formattedProduct.stock_quantity,
                image: formattedProduct.images?.[0] || "/images/placeholder.png",
                slug: formattedProduct.slug
            }} />
        </div>
    );
}
