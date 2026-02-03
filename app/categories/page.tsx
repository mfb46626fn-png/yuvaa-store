import { CategoryList } from "@/components/home/CategoryList";

export const metadata = {
    title: "Kategoriler | Yuvaa Store",
    description: "Tüm ürün kategorilerimizi keşfedin.",
};

export default function CategoriesPage() {
    return (
        <div className="bg-background min-h-screen pt-10">
            <CategoryList />
        </div>
    );
}
