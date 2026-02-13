import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
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
