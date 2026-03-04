import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Metadata } from "next";
import { MobileStickyBar } from "@/components/product/MobileStickyBar";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yuvaa-store.vercel.app";

    const { data: product } = await supabase
        .from("products")
        .select("title, description, short_description, seo_title, meta_description, tags, images")
        .eq("slug", slug)
        .single();

    if (!product) {
        return {
            title: "Ürün Bulunamadı | Yuvaa Store",
            description: "Aradığınız ürün sitemizde bulunmuyor.",
        };
    }

    // Clean description for better SEO snippet mapping (remove markdown)
    const rawDescription = product.description || "";
    // Extremely basic markdown stripper (removes bold, italic, lists) for SEO text
    const cleanDescription = rawDescription
        .replace(/(\*\*|__|\*|_|#|>|- )/g, '')
        .replace(/\n+/g, ' ')
        .substring(0, 160)
        .trim();

    const seoTitle = product.seo_title || `${product.title} | Yuvaa Store`;
    const metaDescription = product.meta_description || product.short_description || cleanDescription || `${product.title} detayları, fiyatı ve yorumları Yuvaa Store'da.`;
    const canonicalUrl = `${baseUrl}/products/${slug}`;
    const ogImage = product.images?.[0] || `${baseUrl}/images/placeholder.png`;

    let keywords = [];
    try {
        if (product.tags) {
            keywords = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
        }
    } catch (e) { }

    return {
        title: seoTitle,
        description: metaDescription,
        keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: seoTitle,
            description: metaDescription,
            url: canonicalUrl,
            siteName: "Yuvaa Store",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
            locale: "tr_TR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: metaDescription,
            images: [ogImage],
        }
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

    // 2. Fetch Category from DB instead of constants
    let category = null;
    if (product.category) {
        const { data: catData } = await supabase
            .from("categories")
            .select("title, slug")
            .eq("slug", product.category)
            .single();
        category = catData;
    }

    const formattedProduct = {
        ...product,
        // Map database 'inventory' column to component 'stock_quantity' prop
        stock_quantity: product.inventory,
        // Ensure category matches what components expect (string for slug)
        category: product.category || "ev-dekorasyon",
        categories: category || { title: "Tüm Ürünler", name: "Tüm Ürünler", slug: "tum-urunler" }
    };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yuvaa-store.vercel.app";
    const canonicalUrl = `${baseUrl}/products/${slug}`;
    const rawDescription = formattedProduct.description || "";
    const cleanDescription = rawDescription
        .replace(/(\*\*|__|\*|_|#|>|- )/g, '')
        .replace(/\n+/g, ' ')
        .substring(0, 160)
        .trim();

    const activePrice = formattedProduct.sale_price || formattedProduct.price;
    const availability = formattedProduct.stock_quantity > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: formattedProduct.title,
        description: cleanDescription || `${formattedProduct.title} detayları, fiyatı ve yorumları Yuvaa Store'da.`,
        image: formattedProduct.images || [],
        url: canonicalUrl,
        brand: {
            "@type": "Brand",
            name: "Yuvaa Store"
        },
        offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            price: activePrice,
            availability: availability,
            url: canonicalUrl,
            seller: {
                "@type": "Organization",
                name: "Yuvaa Store"
            }
        }
    };

    return (
        <div className="bg-background min-h-screen pb-20 pt-4 md:pt-10">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
