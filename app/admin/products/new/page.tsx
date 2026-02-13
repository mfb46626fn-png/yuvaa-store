"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";

export default function NewProductPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        price: "",
        inventory: "",
        category: "",
        images: [] as string[],
        is_personalized: false
    });

    const handleSlugGeneration = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
        setFormData(prev => ({ ...prev, title, slug }));
    };

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.title || !formData.price || !formData.images.length) {
                toast.error("Lütfen zorunlu alanları doldurun (Başlık, Fiyat, Görsel).");
                return;
            }

            const { data, error } = await supabase.from("products").insert([
                {
                    title: formData.title,
                    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
                    description: formData.description,
                    price: parseFloat(formData.price),
                    inventory: parseInt(formData.inventory) || 0,
                    category: formData.category, // Storing static slug
                    images: formData.images,
                    is_personalized: formData.is_personalized
                },
            ]).select();

            if (error) throw error;

            toast.success("Ürün başarıyla oluşturuldu.");
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            console.error("Create error:", error);
            toast.error(`Hata: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yeni Ürün Ekle</h1>
                    <p className="text-muted-foreground">Kataloğunuza yeni bir ürün ekleyin.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ürün Detayları</CardTitle>
                            <CardDescription>Temel ürün bilgileri.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Ürün Başlığı *</Label>
                                <Input
                                    id="title"
                                    placeholder="Örn: El Yapımı Seramik Vazo"
                                    value={formData.title}
                                    onChange={(e) => handleSlugGeneration(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Bağlantısı (Slug)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ürün hikayesi ve detayları..."
                                    className="min-h-[150px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Medya</CardTitle>
                            <CardDescription>Ürün görsellerini yükleyin (En az 1 adet). *</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Main Uploader */}
                                <div className="grid gap-4">
                                    <ImageUpload
                                        value=""
                                        onChange={handleImageUpload}
                                        onRemove={() => { }}
                                        bucketName="products"
                                    />
                                </div>

                                {/* Preview Grid */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border bg-muted">
                                                <img
                                                    src={img}
                                                    alt={`Upload ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                                                        Ana Görsel
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6 w-full max-w-full overflow-hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori & Stok</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategori Seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.slug} value={cat.slug}>
                                                {cat.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Fiyat (₺) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inventory">Stok Adedi</Label>
                                <Input
                                    id="inventory"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={formData.inventory}
                                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Kişiselleştirme</Label>
                                    <p className="text-xs text-muted-foreground">Müşteri notu?</p>
                                </div>
                                <Switch
                                    checked={formData.is_personalized}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_personalized: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                            İptal
                        </Button>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Kaydediliyor..." : "Ürünü Yayınla"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
