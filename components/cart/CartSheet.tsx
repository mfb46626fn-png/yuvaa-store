"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, ShoppingBag, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export function CartSheet() {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Hydration fix
    }

    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <Sheet open={cart.isOpen} onOpenChange={(open) => open ? cart.onOpen() : cart.onClose()}>
            <SheetTrigger asChild>
                <div className="relative">
                    <Button variant="ghost" size="icon" className="group relative">
                        <ShoppingBag size={20} className="group-hover:text-primary transition-colors" />
                        <span className="sr-only">Sepeti Aç</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground pointer-events-none border border-background">
                                {itemCount}
                            </span>
                        )}
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0 border-l">
                <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle className="flex items-center gap-2 text-xl font-serif">
                        Sepetim <span className="text-muted-foreground text-base font-sans font-normal">({itemCount} Ürün)</span>
                    </SheetTitle>
                </SheetHeader>

                {cart.items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center bg-muted/10">
                        <div className="h-24 w-24 rounded-full bg-secondary/20 flex items-center justify-center text-muted-foreground mb-2">
                            <ShoppingCart size={40} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1 max-w-xs">
                            <h3 className="font-medium text-lg">Sepetiniz şu an boş.</h3>
                            <p className="text-muted-foreground text-sm">Eviniz için harika parçalarımız var, keşfetmeye ne dersiniz?</p>
                        </div>
                        <Button
                            onClick={cart.onClose}
                            className="mt-6 px-8"
                            variant="outline"
                        >
                            Alışverişe Başla
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Scrollable Body */}
                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-6">
                                {cart.items.map((item) => (
                                    <div key={`${item.id}-${item.custom_note}`} className="flex gap-4 group">
                                        <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-secondary/10 border shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between gap-3">
                                                <div className="space-y-1">
                                                    <h4 className="font-medium line-clamp-2 text-sm leading-tight hover:text-primary transition-colors">
                                                        <Link href={`/products/${item.slug}`} onClick={cart.onClose}>
                                                            {item.title}
                                                        </Link>
                                                    </h4>
                                                    {item.custom_note && (
                                                        <p className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded w-fit line-clamp-1 italic">
                                                            Not: {item.custom_note}
                                                        </p>
                                                    )}
                                                    <div className="text-sm font-medium text-muted-foreground">
                                                        ₺{item.price.toLocaleString("tr-TR")}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => cart.removeItem(item.id, item.custom_note)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors h-fit p-1 -mr-2"
                                                    aria-label="Ürünü sil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border rounded-md h-8 text-sm shadow-sm bg-background">
                                                    <button
                                                        onClick={() => item.quantity > 1 ? cart.updateQuantity(item.id, item.quantity - 1, item.custom_note) : cart.removeItem(item.id, item.custom_note)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1, item.custom_note)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                <p className="font-bold text-base tabular-nums">
                                                    ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Sticky Footer */}
                        <div className="border-t p-6 bg-background space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-base">
                                    <span className="text-muted-foreground">Ara Toplam</span>
                                    <span className="font-bold text-xl tabular-nums">₺{subtotal.toLocaleString("tr-TR")}</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Kargo ve vergiler ödeme adımında hesaplanır.
                                </p>
                            </div>
                            <Button className="w-full text-base h-12 shadow-lg hover:shadow-xl transition-all" size="lg" asChild onClick={cart.onClose}>
                                <Link href="/checkout">
                                    Güvenle Öde
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
