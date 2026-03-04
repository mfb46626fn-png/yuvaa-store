import { createClient } from "@supabase/supabase-js";

/**
 * A cookie-free Supabase client for build-time contexts like sitemap generation
 * and generateStaticParams. This client does NOT use next/headers cookies(),
 * so it won't hang during `next build`.
 *
 * ⚠️ Only use this for PUBLIC data reads (e.g., fetching published products/categories).
 * Do NOT use for authenticated operations.
 */
export function createStaticSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
