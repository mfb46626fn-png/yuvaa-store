import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Yeni Kategori Ekle</h1>
                <p className="text-muted-foreground">
                    Mağazanıza yeni bir ürün kategorisi ekleyin.
                </p>
            </div>

            <div className="border p-6 rounded-lg bg-card">
                <CategoryForm />
            </div>
        </div>
    );
}
