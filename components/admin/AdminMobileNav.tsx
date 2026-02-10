"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    RotateCcw,
    Tags,
    LogOut,
    Settings
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

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
    {
        title: "Site Ayarları",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminMobileNav() {
    const [open, setOpen] = useState(false);
    const { signOut } = useAuth();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full bg-card">
                    <div className="p-6 border-b border-border">
                        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Yuvaa Admin
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon size={20} />
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border mt-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                                setOpen(false);
                                signOut();
                            }}
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Çıkış Yap
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
