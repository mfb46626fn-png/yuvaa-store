import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface CategoryListProps {
    limit?: number;
}

export async function CategoryList({ limit }: CategoryListProps) {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("categories").select("*").order("title");

    if (limit) {
        query = query.limit(limit);
    }

    const { data: categories } = await query;

    return (
        <section className="container mx-auto py-16 px-4 md:px-6">
            <div className="mb-10 flex items-end justify-between">
                <h2 className="font-serif text-3xl text-foreground">
                    Kategorileri Keşfet
                </h2>
                <Link href="/categories" className="hidden sm:block">
                    <Button variant="link" className="text-foreground hover:text-primary p-0 h-auto font-normal">
                        Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {categories?.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group relative flex items-center justify-center p-6 sm:p-8 aspect-square overflow-hidden rounded-[2rem] border border-border/50 bg-muted/30 hover:bg-primary/5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
                    >
                        {/* Soft decorative background glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="text-center relative z-10 px-2">
                            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors font-medium">
                                {category.title}
                            </h3>
                            <div className="mt-4 h-0.5 w-8 bg-primary/20 mx-auto group-hover:w-16 group-hover:bg-primary/50 transition-all duration-500 rounded-full"></div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
                <Link href="/categories">
                    <Button variant="outline" className="w-full">
                        Tüm Kategorileri Gör
                    </Button>
                </Link>
            </div>
        </section>
    );
}
