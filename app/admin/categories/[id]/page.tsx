import { createServerSupabaseClient } from "@/lib/supabase-server";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: category, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !category) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Kategoriyi Düzenle</h1>
                <p className="text-muted-foreground">
                    "{category.title}" kategorisini düzenliyorsunuz.
                </p>
            </div>

            <div className="border p-6 rounded-lg bg-card">
                <CategoryForm initialData={category} />
            </div>
        </div>
    );
}
