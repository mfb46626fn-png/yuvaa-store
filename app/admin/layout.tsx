import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerSupabaseClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Role Check (Security: Only admins allowed)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="container max-w-7xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Mobile Header & Sidebar Trigger */}
                <div className="md:hidden flex items-center justify-between bg-card border border-border rounded-lg p-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">Yönetim Paneli</h2>
                        <p className="text-xs text-muted-foreground">Mağaza Kontrolü</p>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menüyü Aç</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
                            <div className="h-full flex flex-col py-6 px-4">
                                <div className="mb-6 px-4">
                                    <SheetTitle className="text-lg font-semibold tracking-tight">Yönetim Paneli</SheetTitle>
                                    <p className="text-sm text-muted-foreground">Mağaza Kontrolü</p>
                                </div>
                                <AdminSidebar isMobile />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                        <div className="mb-6 px-4">
                            <h2 className="text-lg font-semibold tracking-tight">Yönetim Paneli</h2>
                            <p className="text-sm text-muted-foreground">Mağaza Kontrolü</p>
                        </div>
                        <AdminSidebar />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="bg-card border border-border rounded-lg p-6 min-h-[500px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
