import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CategoryTable } from "@/components/admin/CategoryTable";

export default async function AdminCategoriesPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch categories with product count if possible, or just categories
    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("title", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return <div>Kategoriler yüklenirken hata oluştu.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kategoriler</h1>
                    <p className="text-muted-foreground">
                        Mağazanızdaki ürün kategorilerini yönetin.
                    </p>
                </div>
                <Link href="/admin/categories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kategori
                    </Button>
                </Link>
            </div>

            <CategoryTable categories={categories || []} />
        </div>
    );
}
