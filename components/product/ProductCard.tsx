"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    title: string;
    price: number;
    sale_price?: number | null;
    images: string[];
    slug: string;
    category?: {
        name: string;
        slug: string;
    }
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Use first image as main, second as hover if available, otherwise fallback to first
    const mainImage = product.images?.[0] || "/images/placeholder.png";
    const hoverImage = product.images?.[1] || mainImage;

    // Calculate discount percentage if sale price exists
    const discountPercentage = product.sale_price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : null;

    return (
        <Link
            href={`/products/${product.slug}`}
            className={cn("group block space-y-3", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/5">
                {/* Main Image */}
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-500 ease-in-out",
                    isHovered && product.images?.length > 1 ? "opacity-0" : "opacity-100"
                )}>
                    <Image
                        src={mainImage}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                    />
                </div>

                {/* Hover Image */}
                {product.images?.length > 1 && (
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-500 ease-in-out",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}>
                        <Image
                            src={hoverImage}
                            alt={`${product.title} - detay`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                )}

                {/* Badges */}
                {discountPercentage && (
                    <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                        %{discountPercentage} İndirim
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-1 text-center">
                <h3 className="font-medium text-foreground transition-colors group-hover:text-primary">
                    {product.title}
                </h3>
                <div className="flex items-center justify-center gap-2">
                    {product.sale_price ? (
                        <>
                            <span className="text-sm text-foreground">
                                ₺{product.sale_price.toLocaleString("tr-TR")}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                                ₺{product.price.toLocaleString("tr-TR")}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-foreground">
                            ₺{product.price.toLocaleString("tr-TR")}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
