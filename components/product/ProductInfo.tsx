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
import { ProductReviews } from "./ProductReviews";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Check, ShieldCheck, Truck, Undo2, X, AlertTriangle, Info, Upload, Type, Image as ImageIcon, Loader2, Clock, Smartphone, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
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
        images: string[];
        slug: string;
        category: string;
        categories?: any;
        is_personalized?: boolean;
        variants?: { name: string; price: number; stock: number; }[];
        material?: string;
        dimensions?: string;
        care_instructions?: string;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [personalizationEnabled, setPersonalizationEnabled] = useState(false);
    const [personalizationType, setPersonalizationType] = useState<"text" | "image">("text");
    const [personalizationText, setPersonalizationText] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Default to the first variant if variants exist
    const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(
        product.variants && product.variants.length > 0 ? 0 : null
    );

    const currentPrice = selectedVariantIndex !== null && product.variants
        ? product.variants[selectedVariantIndex].price
        : product.price;

    const currentSalePrice = selectedVariantIndex !== null && product.variants
        ? null // Variants don't support sale_price by default in this implementation
        : product.sale_price;

    const currentStock = selectedVariantIndex !== null && product.variants
        ? product.variants[selectedVariantIndex].stock
        : product.stock_quantity;

    const discountPercentage = currentSalePrice
        ? Math.round(((currentPrice - currentSalePrice) / currentPrice) * 100)
        : null;

    const inStock = currentStock > 0;
    const categorySlug = product.category || (product.categories?.slug);
    const categoryTitle = product.categories?.title || product.categories?.name || "Tüm Ürünler";
    const categoryLink = categorySlug ? `/categories/${categorySlug}` : "/products";

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
                        <BreadcrumbLink href={categoryLink}>{categoryTitle}</BreadcrumbLink>
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
                        {currentSalePrice ? (
                            <>
                                <span className="text-3xl font-semibold text-primary">
                                    ₺{currentSalePrice.toLocaleString("tr-TR")}
                                </span>
                                <span className="text-xl text-muted-foreground line-through decoration-1">
                                    ₺{currentPrice.toLocaleString("tr-TR")}
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-semibold text-primary">
                                ₺{currentPrice.toLocaleString("tr-TR")}
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

            {/* Options / Variants */}
            {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    <Label className="text-base font-semibold">Seçenekler</Label>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant, index) => (
                            <Button
                                key={index}
                                type="button"
                                variant={selectedVariantIndex === index ? "default" : "outline"}
                                className={cn(
                                    "rounded-full px-6 transition-all",
                                    selectedVariantIndex === index && "ring-2 ring-primary ring-offset-2"
                                )}
                                onClick={() => setSelectedVariantIndex(index)}
                                disabled={variant.stock <= 0}
                            >
                                {variant.name}
                                {variant.stock <= 0 ? " (Tükendi)" : ""}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

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
                    price: currentSalePrice || currentPrice,
                    image: product.images[0] || "/images/placeholder.png",
                    slug: product.slug,
                    stock_quantity: currentStock
                }}
                    personalization={getPersonalizationData()}
                    isPersonalizationRequired={personalizationEnabled}
                    variant_name={selectedVariantIndex !== null && product.variants ? product.variants[selectedVariantIndex].name : undefined}
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
            <Accordion type="single" collapsible className="w-full bg-card rounded-xl border overflow-hidden shadow-sm">
                <AccordionItem value="description" className="border-b-0">
                    <AccordionTrigger className="text-base font-semibold px-5 hover:bg-muted/50 transition-colors">
                        Ürün Açıklaması & Hikayesi
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2">
                        <div className="prose prose-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                            {product.description}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="details" className="border-t border-b-0">
                    <AccordionTrigger className="text-base font-semibold px-5 hover:bg-muted/50 transition-colors">
                        Malzeme ve Boyutlar
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2">
                        {(product.material || product.dimensions) && (
                            <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg">
                                {product.material && (
                                    <div className="space-y-1.5">
                                        <span className="block text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Malzeme</span>
                                        <span className="text-sm font-medium text-foreground">{product.material}</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="space-y-1.5">
                                        <span className="block text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Boyutlar</span>
                                        <span className="text-sm font-medium text-foreground">{product.dimensions}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!product.dimensions && (
                            <div className="mt-4 bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-start gap-3">
                                <div className="text-primary mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">
                                    <span className="font-semibold block mb-0.5">Ölçü/Ton Teyidi</span>
                                    Ölçüsü net belirtilmeyen (doğal formlu) ürünlerimizde, siparişiniz sonrasında ekibimiz sizinle WhatsApp üzerinden iletişime geçerek ölçü, renk tonu ve form teyidi alacaktır.
                                </p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                {product.care_instructions && (
                    <AccordionItem value="care" className="border-t border-b-0">
                        <AccordionTrigger className="text-base font-semibold px-5 hover:bg-muted/50 transition-colors">
                            Bakım ve Kullanım
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5 pt-2">
                            <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {product.care_instructions}
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                <AccordionItem value="delivery" className="border-t border-b-0">
                    <AccordionTrigger className="text-base font-semibold px-5 hover:bg-muted/50 transition-colors">
                        Teslimat ve Hasar İşlemleri
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2">
                        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="text-orange-600 dark:text-orange-400 mt-0.5 shrink-0">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
                                <p>
                                    <strong className="text-foreground font-semibold">Kargonuzu teslim alırken dikkat etmeniz gerekenler:</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li>Lütfen paketinizde kargo kaynaklı bir yırtık, ezilme veya ıslanma olup olmadığını kurye yanındayken kontrol ediniz.</li>
                                    <li>Pakette dışarıdan belli olan bir hasar varsa kuryeye <strong>"Hasar Tespit Tutanağı"</strong> tutturarak paketi teslim almayınız.</li>
                                    <li>Paketi açtıktan sonra üründe onarılamaz bir hasar fark ederseniz vakit kaybetmeden <strong>WhatsApp destek hattımızdan</strong> (+90 505 254 77 86) fotoğraflarıyla birlikte bize ulaşınız.</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-2">Tüm gönderilerimiz kırılma ve darbelere karşı ekstra korumalı olarak özenle paketlenmektedir.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="process" className="border-t border-b border-b-border/30">
                    <AccordionTrigger className="text-base font-semibold px-5 hover:bg-muted/50 transition-colors">
                        Sipariş ve Onay Süreci
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2">
                        <div className="space-y-4">
                            <p className="text-sm text-foreground/80 mb-2">
                                Tüm siparişleriniz kalite standartlarımız gereği özenli bir onay sürecinden geçmektedir:
                            </p>

                            <div className="relative pl-6 border-l-2 border-primary/20 space-y-5">
                                {/* Step 1 */}
                                <div className="relative">
                                    <div className="absolute -left-[33px] top-0.5 bg-background p-1 border-2 border-primary rounded-full">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm">1. Sipariş Alınması</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Siparişiniz sistemimize başarıyla düşer ve hazırlık kuyruğuna alınır.
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div className="relative">
                                    <div className="absolute -left-[33px] top-0.5 bg-background p-1 border-2 border-primary rounded-full">
                                        <Smartphone className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm">2. WhatsApp Üzerinden Teyit</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Ekibimiz seçtiğiniz ürünün ölçüsü, renk tonu veya kişiselleştirmeleri hakkında netlik sağlamak için sizinle WhatsApp üzerinden iletişime geçer.
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div className="relative">
                                    <div className="absolute -left-[33px] top-0.5 bg-background p-1 border-2 border-primary rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm">3. Üretim ve Onay</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Sizden alınan teyit sonrası ürününüzün tedarik ve/veya kişiselleştirme aşamasına geçilir.
                                    </p>
                                </div>

                                {/* Step 4 */}
                                <div className="relative">
                                    <div className="absolute -left-[33px] top-0.5 bg-background p-1 border-2 border-primary rounded-full">
                                        <Truck className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm">4. Tedarik ve Kargo</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Son kontrolleri yapılan ürününüz özenle paketlenir ve kargoya teslim edilerek takip numarası SMS/Mail ile paylaşılır.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Product Reviews */}
            <ProductReviews productId={product.id} />
        </div>
    );
}
