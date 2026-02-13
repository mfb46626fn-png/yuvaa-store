"use client";

import { AddToCartButton } from "./AddToCartButton";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileStickyBarProps {
    product: {
        id: string;
        title: string;
        price: number;
        sale_price?: number | null;
        stock_quantity: number;
        image: string;
        slug: string;
    };
}

export function MobileStickyBar({ product }: MobileStickyBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling past the main image or a certain threshold
            const threshold = 300;
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4 pb-8 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 transform translate-y-0",
            !isVisible && "translate-y-full"
        )}>
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase">Toplam</span>
                    <div className="flex items-baseline gap-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-xl font-bold text-primary">
                                    ₺{product.sale_price.toLocaleString("tr-TR")}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-primary">
                                ₺{product.price.toLocaleString("tr-TR")}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    {/* We reuse AddToCartButton but disable note/quantity for compact view if needed. 
                        However, AddToCartButton has built-in UI. We might mask it or use it as is.
                        Let's render a simplified version or just the button loop.
                        Actually, reusing the component is best for logic, but visually it might be too big.
                        Let's wrap it nicely.
                    */}
                    <div className="[&_input]:hidden [&_label]:hidden [&_div.flex-1]:h-10 [&_button.h-12]:h-10 [&_div.border]:hidden">
                        {/* Hacking styles to hide quantity/note for the sticky bar version. 
                             Ideally we pass a 'compact' prop, but let's stick to CSS for quickness or minimal changes.
                             Actually, AddToCartButton has quantity selector. Sticky bar usually just has "Add".
                             Let's assume standard behavior.
                         */}
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
