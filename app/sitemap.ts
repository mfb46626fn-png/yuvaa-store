import { MetadataRoute } from "next";
import { createStaticSupabaseClient } from "@/lib/supabase-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticSupabaseClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yuvaa-store.vercel.app";

    // Static Base Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }
    ];

    // Dynamic Category Routes (From Supabase Database)
    let categoryRoutes: MetadataRoute.Sitemap = [];

    try {
        const { data: categories } = await supabase
            .from('categories')
            .select('slug, updated_at');

        if (categories && categories.length > 0) {
            categoryRoutes = categories.map((category) => ({
                url: `${baseUrl}/categories/${category.slug}`,
                lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error("Sitemap: Failed to fetch categories", error);
    }

    // Dynamic Product Routes (From Supabase Database)
    let productRoutes: MetadataRoute.Sitemap = [];

    try {
        const { data: products } = await supabase
            .from('products')
            .select('slug, updated_at');

        if (products && products.length > 0) {
            productRoutes = products.map((product) => ({
                url: `${baseUrl}/products/${product.slug}`,
                lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error("Sitemap: Failed to fetch products", error);
    }

    // Combine all routes and return
    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
