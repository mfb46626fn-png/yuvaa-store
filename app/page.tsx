import { HeroSection } from "@/components/home/HeroSection";
import { CategoryList } from "@/components/home/CategoryList";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />

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
