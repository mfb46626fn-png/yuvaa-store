"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Create Supabase server client
async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Handle read-only cookie store
                    }
                },
            },
        }
    );
}

// Generate slug from title
function generateSlug(title: string): string {
    const turkishMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };

    return title
        .split('')
        .map(char => turkishMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export interface ProductVariant {
    name: string;
    price: number;
    stock: number;
}

export interface ProductFormData {
    title: string;
    description: string;
    price: number;
    sale_price?: number | null;
    stock_quantity: number;
    category_id: string | null;
    images: string[];
    is_personalized: boolean;
    variants?: ProductVariant[];
    material?: string;
    dimensions?: string;
    care_instructions?: string;
    orientation?: string;
    tone?: string;
    has_frame?: boolean;
    size_category?: string;
}

export async function createProduct(data: ProductFormData) {
    const supabase = await createServerSupabaseClient();

    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (profile?.role !== "admin") return { success: false, error: "Forbidden" };

    const slug = generateSlug(data.title);

    const { data: product, error } = await supabase
        .from("products")
        .insert({
            title: data.title,
            description: data.description,
            price: data.price,
            sale_price: data.sale_price || null,
            stock_quantity: data.stock_quantity,
            category_id: data.category_id || null,
            images: data.images,
            is_personalized: data.is_personalized,
            variants: data.variants || [],
            slug,
            material: data.material,
            dimensions: data.dimensions,
            care_instructions: data.care_instructions,
            orientation: data.orientation || null,
            tone: data.tone || null,
            has_frame: data.has_frame || false,
            size_category: data.size_category || null
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating product:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true, product };
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export async function getCategories(): Promise<Category[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data || [];
}

export async function deleteProduct(productId: string) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        console.error("Error deleting product:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true };
}
