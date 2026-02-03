"use client";

import { ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();

    // Hydration hatasını önlemek için
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const total = cart.items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag size={20} className="text-foreground" />
                    {cart.items.length > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                            {cart.items.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle>Alışveriş Sepeti ({cart.items.length})</SheetTitle>
                </SheetHeader>

                {cart.items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center space-y-2">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-muted-foreground">
                            Sepetiniz boş
                        </span>
                        <SheetClose asChild>
                            <Button variant="link" className="text-primary hover:text-primary/80">
                                Hemen alışverişe başlayın
                            </Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-6">
                            <ul className="space-y-4 py-4">
                                {cart.items.map((item) => (
                                    <li key={`${item.id}-${item.custom_note || ''}`} className="flex space-x-4">
                                        <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between space-x-2">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-medium leading-none">
                                                        {item.title}
                                                    </h4>
                                                    {item.custom_note && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Not: {item.custom_note}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Adet: {item.quantity}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => cart.removeItem(item.id, item.custom_note)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                        <div className="space-y-4 pr-6 pb-6">
                            <Separator />
                            <div className="space-y-1.5">
                                <div className="flex font-medium justify-between">
                                    <span>Ara Toplam</span>
                                    <span>₺{total.toLocaleString("tr-TR")}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Kargo ve vergiler ödeme adımında hesaplanacaktır.
                                </p>
                            </div>
                            <Button className="w-full" asChild>
                                <Link href="/checkout">Ödemeye Geç</Link>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
