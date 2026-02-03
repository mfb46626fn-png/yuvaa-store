"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    RotateCcw,
    Tags,
    LogOut,
    Settings,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Siparişler",
        href: "/admin/orders",
        icon: ShoppingBag,
    },
    {
        title: "Ürünler",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Kategoriler",
        href: "/admin/categories",
        icon: Tags,
    },
    {
        title: "İade Talepleri",
        href: "/admin/returns",
        icon: RotateCcw,
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, profile, isLoading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (profile?.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, profile, isLoading, router]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;
    }

    if (!user || profile?.role !== "admin") {
        return null;
    }

    return (
        <div className="flex h-screen bg-muted/10">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Yuvaa Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon size={18} className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={signOut}
                    >
                        <LogOut size={18} />
                        Çıkış Yap
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
