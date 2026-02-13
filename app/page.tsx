import { HeroSection } from "@/components/home/HeroSection";
import { CategoryList } from "@/components/home/CategoryList";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 60;

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={SITE_CONFIG.hero.title}
                description={SITE_CONFIG.hero.description}
                buttonText={SITE_CONFIG.hero.buttonText}
                imageUrl={SITE_CONFIG.hero.imageUrl}
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
