"use client";

import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Truck, ShieldCheck, Undo2, Upload, Type, Image as ImageIcon, Loader2, X } from "lucide-react";
import { getCategoryTitle } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ProductInfoProps {
    product: {
        id: string;
        title: string;
        description: string;
        price: number;
        sale_price?: number | null;
        stock_quantity: number;
        material: string;
        dimensions: string;
        images: string[];
        slug: string;
        category: string;
        categories?: any;
        is_personalized?: boolean;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [personalizationEnabled, setPersonalizationEnabled] = useState(false);
    const [personalizationType, setPersonalizationType] = useState<"text" | "image">("text");
    const [personalizationText, setPersonalizationText] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const discountPercentage = product.sale_price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : null;

    const inStock = product.stock_quantity > 0;
    const categorySlug = product.category || (product.categories?.slug) || "ev-dekorasyon";
    const categoryTitle = getCategoryTitle(categorySlug);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset previous upload
        setUploadedImageUrl(null);
        setIsUploading(true);

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('order-uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('order-uploads')
                .getPublicUrl(filePath);

            setUploadedImageUrl(publicUrl);
            toast.success("Görsel başarıyla yüklendi!");
        } catch (error) {
            console.error(error);
            toast.error("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    const getPersonalizationData = () => {
        if (!personalizationEnabled) return undefined;

        if (personalizationType === "text") {
            if (!personalizationText.trim()) return undefined;
            return { type: "text" as const, value: personalizationText };
        } else {
            if (!uploadedImageUrl) return undefined;
            return { type: "image" as const, value: uploadedImageUrl };
        }
    };

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/categories/${categorySlug}`}>{categoryTitle}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{product.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Title & Price Header */}
            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground font-medium leading-tight">
                    {product.title}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-3">
                        {product.sale_price ? (
                            <>
                                <span className="text-3xl font-semibold text-primary">
                                    ₺{product.sale_price.toLocaleString("tr-TR")}
                                </span>
                                <span className="text-xl text-muted-foreground line-through decoration-1">
                                    ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-semibold text-primary">
                                ₺{product.price.toLocaleString("tr-TR")}
                            </span>
                        )}
                    </div>

                    {discountPercentage && (
                        <Badge variant="destructive" className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700">
                            %{discountPercentage} İndirim
                        </Badge>
                    )}
                </div>
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                {product.description}
            </p>

            {/* Personalization Section */}
            {product.is_personalized && (
                <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="personalize-mode" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                            <Type className="w-4 h-4" />
                            Ürünü Kişiselleştir
                        </Label>
                        <Switch
                            id="personalize-mode"
                            checked={personalizationEnabled}
                            onCheckedChange={setPersonalizationEnabled}
                        />
                    </div>

                    {personalizationEnabled && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <Tabs value={personalizationType} onValueChange={(v: string) => setPersonalizationType(v as "text" | "image")}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="text" className="flex items-center gap-2">
                                        <Type className="w-4 h-4" /> Yazı Yaz
                                    </TabsTrigger>
                                    <TabsTrigger value="image" className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" /> Görsel Yükle
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="text" className="space-y-3 pt-2">
                                    <Label>Ürün üzerine yazılacak metin:</Label>
                                    <Textarea
                                        placeholder="Örn: İsim, Tarih veya özel bir not..."
                                        maxLength={100}
                                        value={personalizationText}
                                        onChange={(e) => setPersonalizationText(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">{personalizationText.length}/100</p>
                                </TabsContent>
                                <TabsContent value="image" className="space-y-3 pt-2">
                                    <Label>Ürün üzerine basılacak görsel:</Label>
                                    {!uploadedImageUrl ? (
                                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer relative">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                            />
                                            {isUploading ? (
                                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-muted-foreground" />
                                            )}
                                            <span className="text-sm text-muted-foreground font-medium">Görsel seçmek için tıklayın</span>
                                            <span className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</span>
                                        </div>
                                    ) : (
                                        <div className="relative border rounded-lg overflow-hidden group">
                                            <img src={uploadedImageUrl} alt="Uploaded" className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setUploadedImageUrl(null)}
                                                >
                                                    <X className="w-4 h-4 mr-2" /> Görseli Kaldır
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
            )}

            {/* Add to Cart & Actions */}
            <div className="pt-2">
                <AddToCartButton product={{
                    id: product.id,
                    title: product.title,
                    price: product.sale_price || product.price,
                    image: product.images[0] || "/images/placeholder.png",
                    slug: product.slug,
                    stock_quantity: product.stock_quantity
                }}
                    personalization={getPersonalizationData()}
                    isPersonalizationRequired={personalizationEnabled}
                />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                <div className="flex flex-col items-center text-center gap-2">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Hızlı Kargo &<br />Özenli Paketleme</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 border-l border-border/50 pl-4">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Güvenli Ödeme<br />(PayTR)</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 border-l border-border/50 pl-4">
                    <Undo2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Kolay İade<br />Garantisi</span>
                </div>
            </div>

            {/* Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                    <AccordionTrigger className="text-base font-medium">Ürün Açıklaması & Hikayesi</AccordionTrigger>
                    <AccordionContent>
                        <div className="prose prose-sm text-muted-foreground whitespace-pre-wrap">
                            {product.description}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="details">
                    <AccordionTrigger className="text-base font-medium">Malzeme ve Boyutlar</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block font-semibold text-foreground mb-1">Malzeme</span>
                                <span className="text-muted-foreground">{product.material || "Doğal Malzeme"}</span>
                            </div>
                            <div>
                                <span className="block font-semibold text-foreground mb-1">Boyutlar</span>
                                <span className="text-muted-foreground">{product.dimensions || "Standart"}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                    <AccordionTrigger className="text-base font-medium">Bakım ve Kullanım</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                            Nemli bir bezle silerek temizleyiniz. Doğrudan güneş ışığından ve aşırı nemden koruyunuz.
                            Doğal malzemeler zamanla renk değiştirebilir, bu ürünün doğallığının bir parçasıdır.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
