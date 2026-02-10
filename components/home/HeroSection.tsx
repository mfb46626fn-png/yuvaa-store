"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    imageUrl?: string;
}

export function HeroSection({
    title = "Evinizin Ruhu: Yuvaa",
    description = "El yapımı detaylar, doğal dokular ve bohem esintilerle yaşam alanınıza sıcaklık katın.",
    buttonText = "Koleksiyonu Keşfet",
    imageUrl = "/images/hero-bg.png"
}: HeroSectionProps) {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('${imageUrl}')`,
                }}
            >
                {/* Overlay layer for better text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="space-y-6 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="font-serif text-5xl font-medium tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-md">
                        {title}
                    </h1>
                    <p className="mx-auto max-w-lg text-lg text-white/90 md:text-xl drop-shadow-sm font-light">
                        {description}
                    </p>
                    <div className="pt-4">
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="h-14 bg-white px-8 text-lg text-primary hover:bg-white/90 hover:text-primary/90 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                {buttonText}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
