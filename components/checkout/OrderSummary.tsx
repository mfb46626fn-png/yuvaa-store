"use client";

import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export function OrderSummary() {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const subtotal = cart.items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0);

    // Free shipping threshold: 1000 TL
    const isFreeShipping = subtotal >= 1000;
    const shippingCost = isFreeShipping ? 0 : 50;
    const total = subtotal + shippingCost;

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Sipariş Özeti</h2>

            {cart.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Sepetiniz boş.</p>
            ) : (
                <>
                    <ScrollArea className="h-[300px] pr-4">
                        <ul className="space-y-4">
                            {cart.items.map((item) => (
                                <li key={`${item.id}-${item.custom_note}`} className="flex gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium">{item.title}</h4>
                                        {item.custom_note && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                Not: {item.custom_note}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                                            <span className="text-sm font-medium">
                                                ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>

                    <Separator className="my-6" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ara Toplam</span>
                            <span>₺{subtotal.toLocaleString("tr-TR")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Kargo</span>
                            {isFreeShipping ? (
                                <span className="text-green-600 font-medium">Ücretsiz</span>
                            ) : (
                                <span>₺{shippingCost.toLocaleString("tr-TR")}</span>
                            )}
                        </div>
                        {!isFreeShipping && (
                            <p className="text-xs text-muted-foreground mt-1">
                                *1.000 TL ve üzeri kargo bedava
                            </p>
                        )}

                        <Separator className="my-2" />

                        <div className="flex justify-between text-lg font-semibold">
                            <span>Genel Toplam</span>
                            <span>₺{total.toLocaleString("tr-TR")}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
