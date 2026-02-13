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
import { useAuth } from "@/components/providers/AuthProvider";
import { LogOut, User, ShoppingBag, LayoutDashboard } from "lucide-react";

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
    const { user, profile, signOut } = useAuth();

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

                {/* Auth Section */}
                <div className="p-4 border-t border-border bg-muted/20">
                    {user ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 px-2 mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{profile?.full_name || "Kullanıcı"}</span>
                                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {profile?.role === "admin" && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Yönetim Paneli
                                    </Link>
                                )}
                                <Link
                                    href="/account/orders"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Siparişlerim
                                </Link>
                                <Link
                                    href="/account/profile"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Profilim
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setOpen(false);
                                    }}
                                    className="w-full flex items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    Giriş Yap
                                </Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/register" onClick={() => setOpen(false)}>
                                    Kayıt Ol
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer (Optional, removed profile) */}
                <div className="p-4 border-t border-border text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Yuvaa Store
                </div>
            </SheetContent>
        </Sheet>
    );
}
