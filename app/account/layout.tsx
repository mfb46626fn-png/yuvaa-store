import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, Package, RotateCcw } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminSidebarLogout } from "@/components/admin/AdminSidebar"; // Reusing logout button logic

const sidebarItems = [
    {
        title: "Profilim",
        href: "/account/profile",
        icon: User,
    },
    {
        title: "Siparişlerim",
        href: "/account/orders",
        icon: Package,
    },
    {
        title: "İade Talepleri",
        href: "/account/returns",
        icon: RotateCcw,
    },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <nav className="space-y-2">
                            {/* Note: Active state highlighting removed for server component simplicity in this quick fix. 
                                 Can be added back with a client wrapper later. */}
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <item.icon size={18} />
                                    {item.title}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <AdminSidebarLogout />
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-card border border-border rounded-lg p-6 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
