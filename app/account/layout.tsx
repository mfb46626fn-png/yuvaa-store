"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Package, RotateCcw, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";

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
        title: "İade Taleplerim",
        href: "/account/returns",
        icon: RotateCcw,
    },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {item.title}
                                    </Link>
                                );
                            })}
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 px-4 py-3 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 mt-4"
                                onClick={signOut}
                            >
                                <LogOut size={18} />
                                Çıkış Yap
                            </Button>
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
