"use client";

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
import { Truck, ShieldCheck, Undo2 } from "lucide-react";
import { getCategoryTitle } from "@/lib/constants";

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
        category: string; // Changed from object to string to match static data
        categories?: any; // Fallback for safety
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const discountPercentage = product.sale_price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : null;

    const inStock = product.stock_quantity > 0;
    const categorySlug = product.category || (product.categories?.slug) || "ev-dekorasyon";
    const categoryTitle = getCategoryTitle(categorySlug);

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

            {/* Add to Cart & Actions */}
            <div className="pt-2">
                <AddToCartButton product={{
                    id: product.id,
                    title: product.title,
                    price: product.sale_price || product.price,
                    image: product.images[0] || "/images/placeholder.png",
                    slug: product.slug,
                    stock_quantity: product.stock_quantity
                }} />
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
