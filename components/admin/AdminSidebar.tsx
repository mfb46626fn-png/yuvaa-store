"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Ürünler",
        href: "/admin/products",
        icon: <Package className="h-5 w-5" />,
        children: [
            { title: "Tüm Ürünler", href: "/admin/products" },
            { title: "Yeni Ürün Ekle", href: "/admin/products/new" },
        ],
    },
    {
        title: "Kategoriler",
        href: "/admin/categories",
        icon: <FolderTree className="h-5 w-5" />,
    },
    {
        title: "Siparişler",
        href: "/admin/orders",
        icon: <ShoppingCart className="h-5 w-5" />,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-border px-6">
                <Link href="/admin" className="flex items-center gap-2">
                    <span className="font-serif text-xl font-bold text-primary">
                        Yuvaa
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                        Admin
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.children?.some(child => pathname === child.href));

                    return (
                        <div key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>

                            {/* Sub-navigation */}
                            {item.children && isActive && (
                                <div className="ml-8 mt-1 flex flex-col gap-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                                pathname === child.href
                                                    ? "text-primary font-medium"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {child.title === "Yeni Ürün Ekle" && (
                                                <Plus className="h-4 w-4" />
                                            )}
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
                <p className="text-xs text-muted-foreground">
                    © 2026 Yuvaa Store
                </p>
            </div>
        </aside>
    );
}
