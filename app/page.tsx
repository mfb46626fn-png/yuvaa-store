import { HeroSection } from "@/components/home/HeroSection";
import { CategoryList } from "@/components/home/CategoryList";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const revalidate = 60; // Revalidate dynamic content every 60 seconds

export default async function Home() {
    const supabase = createServerSupabaseClient();

    let settings = null;
    try {
        const client = await supabase;
        const { data } = await client
            .from("site_settings")
            .select("*")
            .single();
        settings = data;
    } catch (error) {
        console.error("Site settings fetch error (Table might be missing):", error);
        // Fallback to null (uses default props in HeroSection)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={settings?.hero_title}
                description={settings?.hero_description}
                buttonText={settings?.hero_button_text}
                imageUrl={settings?.hero_image_url}
            />

            <div className="flex-1 bg-background">
                {/* Categories - Visual heavy distinct section */}
                <section className="relative z-10 -mt-20 md:-mt-32 pb-10">
                    <div className="rounded-t-[3rem] bg-background pt-16 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <CategoryList />
                    </div>
                </section>

                {/* Featured Products */}
                <FeaturedProducts />
            </div>
        </div>
    );
}
