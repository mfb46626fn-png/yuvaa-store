"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
    {
        id: "wall-decor",
        title: "Duvar Dekoru",
        slug: "duvar-dekoru",
        image: "/images/cat-wall-decor.png",
    },
    {
        id: "table-top",
        title: "Masa Üstü",
        slug: "masa-ustu",
        image: "/images/cat-table-top.png",
    },
    {
        id: "natural-bohem",
        title: "Doğal & Bohem",
        slug: "dogal-bohem",
        image: "/images/cat-natural-bohem.png",
    },
    {
        id: "gift",
        title: "Hediyelik",
        slug: "hediyelik",
        image: "/images/cat-gift.png",
    },
    {
        id: "art",
        title: "Sanat",
        slug: "sanat",
        image: "/images/cat-art.png",
    },
];

export function CategoryList() {
    return (
        <section className="container mx-auto py-16">
            <h2 className="mb-10 text-center font-serif text-3xl text-foreground">
                Koleksiyonları Keşfet
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-6 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group relative flex-shrink-0 w-[200px] sm:w-auto"
                    >
                        <div className="aspect-square overflow-hidden rounded-full border border-border bg-muted/20">
                            <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {category.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
