import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function CategoryList() {
    const supabase = await createServerSupabaseClient();
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("title")
        .limit(4);

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
                        className="group relative flex flex-col gap-3"
                    >
                        <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted/20">
                            <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                                {category.image_url ? (
                                    <Image
                                        src={category.image_url}
                                        alt={category.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                                        No IMG
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {category.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
                <Link href="/categories">
                    <Button variant="outline" className="w-full">
                        Tüm Koleksiyonları Gör
                    </Button>
                </Link>
            </div>
        </section>
    );
}
