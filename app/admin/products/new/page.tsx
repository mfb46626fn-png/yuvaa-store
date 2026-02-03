"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { createProduct, getCategories, type Category } from "../actions";

interface FormErrors {
    title?: string;
    price?: string;
    stock_quantity?: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("0");
    const [categoryId, setCategoryId] = useState<string>("");
    const [material, setMaterial] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        async function loadCategories() {
            const cats = await getCategories();
            setCategories(cats);
        }
        loadCategories();
    }, []);

    function validateForm(): boolean {
        const errors: FormErrors = {};

        if (title.length < 3) {
            errors.title = "Ürün adı en az 3 karakter olmalıdır";
        }

        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            errors.price = "Fiyat 0'dan büyük olmalıdır";
        }

        if (isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) {
            errors.stock_quantity = "Stok negatif olamaz";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await createProduct({
                title,
                description,
                price: Number(price),
                sale_price: salePrice ? Number(salePrice) : null,
                stock_quantity: Number(stockQuantity),
                category_id: categoryId || null,
                images,
                material,
                dimensions,
                is_personalized: isPersonalized,
            });

            if (result.success) {
                router.push("/admin/products");
            } else {
                setError(result.error || "Ürün oluşturulurken bir hata oluştu");
            }
        } catch {
            setError("Beklenmeyen bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-serif text-2xl font-bold text-foreground">
                        Yeni Ürün Ekle
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Mağazanıza yeni bir ürün ekleyin
                    </p>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main content - 2 columns */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ürün Bilgileri</CardTitle>
                                <CardDescription>
                                    Temel ürün bilgilerini girin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Ürün Adı *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Örn: El Yapımı Makrome Duvar Süsü"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    {formErrors.title && (
                                        <p className="text-sm text-destructive">{formErrors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Açıklama</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Ürün hakkında detaylı bilgi..."
                                        className="min-h-[120px] resize-y"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="material">Malzeme</Label>
                                        <Input
                                            id="material"
                                            placeholder="Örn: Pamuk, Ahşap, Seramik"
                                            value={material}
                                            onChange={(e) => setMaterial(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Ürünün yapıldığı malzeme
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dimensions">Boyutlar</Label>
                                        <Input
                                            id="dimensions"
                                            placeholder="Örn: 30x40 cm"
                                            value={dimensions}
                                            onChange={(e) => setDimensions(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Ürün boyutları (en x boy x yükseklik)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ürün Görselleri</CardTitle>
                                <CardDescription>
                                    Ürünün görsellerini yükleyin. İlk görsel ana görsel olarak kullanılır.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageDropzone
                                    onImagesChange={setImages}
                                    existingImages={images}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Pricing & Stock */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Fiyat & Stok</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Fiyat (₺) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    {formErrors.price && (
                                        <p className="text-sm text-destructive">{formErrors.price}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sale_price">İndirimli Fiyat (₺)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={salePrice}
                                        onChange={(e) => setSalePrice(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Boş bırakırsanız indirim uygulanmaz
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok Miktarı *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value)}
                                    />
                                    {formErrors.stock_quantity && (
                                        <p className="text-sm text-destructive">{formErrors.stock_quantity}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kategori</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>Kategori Seçin</Label>
                                    <Select
                                        value={categoryId}
                                        onValueChange={setCategoryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori seçin..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personalization */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kişiselleştirme</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">
                                            Kişiselleştirilebilir
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Bu ürün müşteri isteğiyle özelleştirilebilir
                                        </p>
                                    </div>
                                    <Switch
                                        checked={isPersonalized}
                                        onCheckedChange={setIsPersonalized}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Ürünü Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
