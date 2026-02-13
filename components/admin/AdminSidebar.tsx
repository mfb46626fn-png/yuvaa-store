"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingBag, Package, RotateCcw, Tags, LogOut, MessagesSquare, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    {
        title: "Panel",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Siparişler",
        href: "/admin/orders",
        icon: Package,
    },
    {
        title: "Ürünler",
        href: "/admin/products",
        icon: ShoppingBag,
    },
    {
        title: "Kategoriler",
        href: "/admin/categories",
        icon: Tags,
    },
    {
        title: "İadeler",
        href: "/admin/returns",
        icon: RotateCcw,
    },
    {
        title: "Destek",
        href: "/admin/support",
        icon: MessagesSquare,
    },
    {
        title: "İletişim Mesajları",
        href: "/admin/messages",
        icon: Mail,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <nav className="space-y-2">
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon size={18} />
                        {item.title}
                    </Link>
                );
            })}
            <div className="pt-4 mt-4 border-t border-border">
                <AdminSidebarLogout />
            </div>
        </nav>
    );
}

export function AdminSidebarLogout() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Çıkış yapılırken hata oluştu");
        } else {
            toast.success("Başarıyla çıkış yapıldı");
            router.push("/login"); // Or home
            router.refresh();
        }
    };

    return (
        <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
        >
            <LogOut size={18} />
            Çıkış Yap
        </Button>
    );
}
