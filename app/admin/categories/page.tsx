"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

type Category = {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    description?: string;
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New Category Form
    const [newCategory, setNewCategory] = useState({
        title: "",
        slug: "",
        image_url: "",
        description: "",
    });

    const supabase = createClient();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Categories fetch error:", error);
            toast.error("Kategoriler yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

        try {
            const { error } = await supabase
                .from("categories")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setCategories(categories.filter(c => c.id !== id));
            toast.success("Kategori silindi.");
        } catch (error) {
            toast.error("Silme işlemi başarısız.");
        }
    };

    const handleCreate = async () => {
        if (!newCategory.title || !newCategory.slug) {
            toast.error("Lütfen başlık ve slug girin.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from("categories")
                .insert([newCategory])
                .select()
                .single();

            if (error) throw error;

            setCategories([data, ...categories]);
            toast.success("Kategori oluşturuldu.");
            setIsDialogOpen(false);
            setNewCategory({ title: "", slug: "", image_url: "", description: "" });
        } catch (error) {
            console.error(error);
            toast.error("Oluşturma başarısız. Slug benzersiz olmalı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Kategori
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Başlık</Label>
                                <Input
                                    id="title"
                                    value={newCategory.title}
                                    onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') })}
                                    placeholder="Örn: Duvar Tabloları"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                    placeholder="duvar-tablolari"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Görsel</Label>
                                <ImageUpload
                                    value={newCategory.image_url}
                                    onChange={(url) => setNewCategory({ ...newCategory, image_url: url })}
                                    onRemove={() => setNewCategory({ ...newCategory, image_url: "" })}
                                    bucketName="categories"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Görsel</TableHead>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                                        {category.image_url ? (
                                            <Image
                                                src={category.image_url}
                                                alt={category.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                                                No IMG
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{category.title}</TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{category.slug}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
