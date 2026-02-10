import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    RotateCcw,
    Tags,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminSidebarLogout } from "@/components/admin/AdminSidebar";

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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. Server-Side Auth Check
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Role Check (Security: Only admins allowed)
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || !profile) {
        console.error("Admin Access Denied: Profile not found or error", { userId: user.id, error });
        redirect("/");
    }

    if (profile.role !== "admin") {
        console.warn("Admin Access Denied: User is not admin", { userId: user.id, role: profile.role });
        redirect("/");
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
                        // Ideally checking active state server-side is tricky without headers/middleware passing path
                        // For simply sidebar, we can use client component for navigation or just static links
                        // Here keeping it static server component for simplicity, active state might be lost or need a client wrapper
                        // Let's refactor Sidebar navigation to a client component to keep active state logic working!
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon size={18} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <AdminSidebarLogout />
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
