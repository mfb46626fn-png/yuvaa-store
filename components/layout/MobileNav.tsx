"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    title: string;
    slug: string;
}

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from("categories")
                .select("id, title, slug")
                .order("title");

            setCategories(data || []);
            setLoading(false);
        };

        fetchCategories();
    }, []);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menüyü Aç</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                {/* Header with Logo */}
                <div className="p-6 border-b border-border flex justify-center">
                    <Link href="/" onClick={() => setOpen(false)} className="relative h-10 w-32">
                        <Image
                            src="/logo.png"
                            alt="Yuvaa Store"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="flex flex-col space-y-1">
                        {/* Static Categories */}
                        <div className="px-2 pb-2 mb-2">
                            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Kategoriler
                            </h3>
                            <div className="space-y-1">
                                {loading ? (
                                    <div className="flex justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                ) : categories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        href={`/categories/${category.slug}`}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-muted hover:text-foreground transition-colors",
                                            pathname === `/categories/${category.slug}`
                                                ? "bg-muted text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {category.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Other Pages */}
                        <div className="px-2 pt-4 border-t border-border/50">
                            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Kurumsal
                            </h3>
                            <div className="space-y-1">
                                <Link
                                    href="/about"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-md px-2 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    Hakkımızda
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-md px-2 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    İletişim
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Footer (Optional, removed profile) */}
                <div className="p-4 border-t border-border text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Yuvaa Store
                </div>
            </SheetContent>
        </Sheet>
    );
}
