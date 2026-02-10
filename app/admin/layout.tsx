import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    RotateCcw,
    Tags,
    Settings,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminSidebarLogout } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

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

function isRedirectError(error: any) {
    return error?.digest?.startsWith?.('NEXT_REDIRECT');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    try {
        // 1. Server-Side Auth Check
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            redirect("/login");
        }

        // 2. Role Check (Security: Only admins allowed)
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.error("Admin Policy Error:", profileError);
            // If profile is missing, it might be a valid user without a profile row.
            redirect("/");
        }

        if (!profile || profile.role !== "admin") {
            console.warn("Admin Access Denied:", { userId: user.id, role: profile?.role });
            redirect("/");
        }
    } catch (error) {
        // Next.js Redirects throw errors that must be re-thrown
        if (isRedirectError(error)) {
            throw error;
        }
        console.error("Admin Layout Critical Error:", error);
        throw error;
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
            <main className="flex-1 overflow-y-auto flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden border-b border-border bg-card p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <AdminMobileNav />
                        <span className="font-serif text-lg font-bold text-foreground">
                            Yönetim Paneli
                        </span>
                    </div>
                </div>

                <div className="p-4 md:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
