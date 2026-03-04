"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Loader2, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";

interface Category {
    id: string;
    title: string;
    slug: string;
}

interface ProductFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        description: string;
        price: number;
        inventory: number;
        category: string;
        images: string[];
        is_personalized: boolean;
        variants?: { name: string; price: number; stock: number }[];
        material?: string;
        dimensions?: string;
        care_instructions?: string;
        orientation?: string;
        tone?: string;
        has_frame?: boolean;
        size_category?: string;
        short_description?: string;
        seo_title?: string;
        meta_description?: string;
        tags?: string;
    };
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [supabase] = useState(() => createClient());
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        price: initialData?.price?.toString() || "",
        inventory: initialData?.inventory?.toString() || "",
        category: initialData?.category || "",
        images: initialData?.images || [] as string[],
        is_personalized: initialData?.is_personalized || false,
        variants: initialData?.variants || [] as { name: string; price: number; stock: number }[],
        material: initialData?.material || "",
        dimensions: initialData?.dimensions || "",
        care_instructions: initialData?.care_instructions || "[]",
        orientation: initialData?.orientation || "",
        tone: initialData?.tone || "",
        has_frame: initialData?.has_frame || false,
        size_category: initialData?.size_category || "",
        short_description: initialData?.short_description || "",
        seo_title: initialData?.seo_title || "",
        meta_description: initialData?.meta_description || "",
        tags: initialData?.tags || "[]",
    });

    const [careInstructionsList, setCareInstructionsList] = useState<string[]>(() => {
        try {
            return JSON.parse(initialData?.care_instructions || "[]");
        } catch {
            return initialData?.care_instructions ? [initialData.care_instructions] : [];
        }
    });

    const [tagsList, setTagsList] = useState<string[]>(() => {
        try {
            return JSON.parse(initialData?.tags || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("id, title, slug")
                .order("title");

            if (error) {
                console.error("Error fetching categories:", error);
                toast.error("Kategoriler yüklenemedi");
            } else {
                setCategories(data || []);
            }
        };

        fetchCategories();
    }, []);

    const handleSlugGeneration = (title: string) => {
        // Only auto-generate slug if we are creating a new product OR if the user hasn't manually edited the slug yet (simplification)
        // Better: Only auto-generate if it's a new product. Editing titles of existing products shouldn't automatically change URLs as that breaks SEO.
        if (!initialData) {
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
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    const handleImageUpload = (urls: string[]) => {
        setFormData(prev => ({ ...prev, images: urls }));
    };

    const handleRemoveImage = (urlToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((url) => url !== urlToRemove)
        }));
    };

    const handleAddVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: "", price: 0, stock: 0 }]
        }));
    };

    const handleRemoveVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index: number, field: string, value: string | number) => {
        setFormData(prev => {
            const newVariants = [...prev.variants];
            newVariants[index] = { ...newVariants[index], [field]: value };
            return { ...prev, variants: newVariants };
        });
    };

    const handleAddCareInstruction = () => {
        setCareInstructionsList(prev => [...prev, ""]);
    };

    const handleCareInstructionChange = (index: number, value: string) => {
        setCareInstructionsList(prev => {
            const newList = [...prev];
            newList[index] = value;
            return newList;
        });
    };

    const handleRemoveCareInstruction = (index: number) => {
        setCareInstructionsList(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !tagsList.includes(value)) {
                setTagsList(prev => [...prev, value]);
            }
            e.currentTarget.value = "";
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTagsList(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.title || !formData.price || !formData.images.length) {
                toast.error("Lütfen zorunlu alanları doldurun (Başlık, Fiyat, Görsel).");
                return;
            }

            const payload = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
                description: formData.description,
                short_description: formData.short_description,
                price: parseFloat(formData.price),
                inventory: parseInt(formData.inventory) || 0,
                category: formData.category,
                images: formData.images,
                is_personalized: formData.is_personalized,
                is_published: true,
                variants: formData.variants,
                material: formData.material,
                dimensions: formData.dimensions,
                care_instructions: JSON.stringify(careInstructionsList),
                orientation: formData.orientation,
                tone: formData.tone,
                has_frame: formData.has_frame,
                size_category: formData.size_category,
                seo_title: formData.seo_title,
                meta_description: formData.meta_description,
                tags: JSON.stringify(tagsList)
            };

            if (initialData) {
                // Update
                const { error } = await supabase
                    .from("products")
                    .update(payload)
                    .eq("id", initialData.id);

                if (error) throw error;
                toast.success("Ürün güncellendi.");
            } else {
                // Insert
                const { error } = await supabase
                    .from("products")
                    .insert([payload]);

                if (error) throw error;
                toast.success("Ürün oluşturuldu.");
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            console.error("Submit error:", error);
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
                    <h1 className="text-3xl font-bold tracking-tight">
                        {initialData ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                    </h1>
                    <p className="text-muted-foreground">
                        {initialData ? "Ürün detaylarını güncelleyin." : "Kataloğunuza yeni bir ürün ekleyin."}
                    </p>
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
                                {initialData && (
                                    <p className="text-[10px] text-muted-foreground">
                                        Dikkat: URL'i değiştirmek SEO açısından riskli olabilir.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">Kısa Açıklama</Label>
                                <Textarea
                                    id="short_description"
                                    placeholder="Ürün sayfasının başında görünecek özet bilgi..."
                                    className="min-h-[80px]"
                                    value={formData.short_description}
                                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Uzun Açıklama (Ürün Hikayesi) *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detaylı ürün hikayesi ve açıklamalar..."
                                    className="min-h-[200px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="material">Malzeme</Label>
                                <Input
                                    id="material"
                                    placeholder="Örn: %100 Pamuk, Seramik, Ahşap..."
                                    value={formData.material}
                                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dimensions">Boyutlar</Label>
                                <Input
                                    id="dimensions"
                                    placeholder="Örn: 50x70 cm, Çap: 20cm..."
                                    value={formData.dimensions}
                                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Bakım ve Kullanım Talimatları</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddCareInstruction}>
                                        <Plus className="h-4 w-4 mr-2" /> Madde Ekle
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {careInstructionsList.map((instruction, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={instruction}
                                                onChange={(e) => handleCareInstructionChange(index, e.target.value)}
                                                placeholder="Örn: Nemli bir bezle silin."
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveCareInstruction(index)}
                                            >
                                                <X className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    {careInstructionsList.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">Henüz bir madde eklenmedi.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Medya</CardTitle>
                            <CardDescription>Ürün görsellerini yükleyin. (En az 1 adet). *</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ImageUpload
                                    value={formData.images}
                                    onChange={handleImageUpload}
                                    onRemove={handleRemoveImage}
                                    bucketName="products"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6 w-full max-w-full overflow-hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle>Filtreler & Özellikler</CardTitle>
                            <CardDescription>Kategori sayfalarında filtreleme için kullanılacak değerler.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Yön (Oryantasyon)</Label>
                                <Select
                                    value={formData.orientation}
                                    onValueChange={(val) => setFormData({ ...formData, orientation: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Belirtilmemiş" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Belirtilmemiş</SelectItem>
                                        <SelectItem value="Yatay">Yatay</SelectItem>
                                        <SelectItem value="Dikey">Dikey</SelectItem>
                                        <SelectItem value="Kare">Kare</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Dimensions Selection */}
                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base">Boyutlandırma</Label>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Boyut Kategorisi</Label>
                                    <Input
                                        placeholder="Örn: 50x70 cm, Küçük, Standart Orta..."
                                        value={formData.size_category}
                                        onChange={(e) => setFormData({ ...formData, size_category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tone">Renk / Ton</Label>
                                <Input
                                    id="tone"
                                    placeholder="Örn: Açık Ton, Ceviz, Siyah..."
                                    value={formData.tone}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label className="text-sm">Çerçeveli mi?</Label>
                                </div>
                                <Switch
                                    checked={formData.has_frame}
                                    onCheckedChange={(checked) => setFormData({ ...formData, has_frame: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori Seçimi *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategori Seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
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

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Varyantlar (İsteğe Bağlı)</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                                        <Plus className="h-4 w-4 mr-1" /> Ekle
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Boyut, renk gibi seçenekler ekleyerek özel fiyatlandırabilirsiniz.</p>

                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end border p-3 rounded-lg bg-muted/20">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] mx-1">Seçenek Adı</Label>
                                            <Input
                                                placeholder="Örn: 50x70cm"
                                                value={variant.name}
                                                onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1 w-20">
                                            <Label className="text-[10px] mx-1">Fiyat (₺)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={variant.price || ''}
                                                onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-1 w-16">
                                            <Label className="text-[10px] mx-1">Stok</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={variant.stock || ''}
                                                onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleRemoveVariant(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
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
                            {isLoading ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Ürünü Yayınla")}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
