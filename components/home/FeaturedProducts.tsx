import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getFeaturedProducts() {
    const supabase = await createServerSupabaseClient();

    // Fetch products from 'Doğal & Bohem' category or just latest 4 products
    // For now, let's fetch latest 4 active products
    const { data: products } = await supabase
        .from("products")
        .select(`
            id,
            title,
            price,
            sale_price,
            images,
            slug,
            categories (
                name,
                slug
            )
        `)
        .order('created_at', { ascending: false })
        .limit(4);

    return products || [];
}

export async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    if (!products.length) {
        return null;
    }

    // Transform data to match Product interface
    const formattedProducts = products.map(p => ({
        ...p,
        category: p.categories ? Array.isArray(p.categories) ? p.categories[0] : p.categories : undefined
    }));

    return (
        <section className="bg-secondary/10 py-20">
            <div className="container mx-auto">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                            Öne Çıkanlar
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Doğal ve bohem yaşamın en sevilen parçaları
                        </p>
                    </div>
                    <Link href="/products?category=dogal-bohem" className="hidden sm:block">
                        <Button variant="link" className="text-foreground hover:text-primary p-0 h-auto font-normal">
                            Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                    {formattedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/products">
                        <Button variant="outline" className="w-full">
                            Tüm Ürünleri Gör
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
