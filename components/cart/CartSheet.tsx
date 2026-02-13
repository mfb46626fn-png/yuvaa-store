"use client";

import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

export function CartSheet() {
    const { items, removeItem, updateQuantity, getCartTotal, getItemCount } = useCart();
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Button variant="ghost" size="icon" className="relative group hover:text-primary">
                <ShoppingBag size={20} />
            </Button>
        );
    }

    const itemCount = getItemCount();
    const total = getCartTotal();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group hover:text-primary">
                    <ShoppingBag size={20} />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-[85vw] flex-col gap-0 p-0 pr-0 sm:max-w-lg rounded-l-2xl border-l overflow-hidden">
                <SheetHeader className="px-4 py-4 border-b bg-muted/20 text-center flex flex-col items-center justify-center space-y-0">
                    <SheetTitle className="text-center font-bold text-lg">Alışveriş Sepeti ({itemCount})</SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col min-h-0 pl-1">

                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-2">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                            <span className="text-lg font-medium text-muted-foreground">
                                Sepetiniz boş
                            </span>
                            <Button
                                variant="link"
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-primary"
                            >
                                Alışverişe Başla
                            </Button>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="flex-1 pr-6">
                                <ul className="grid gap-4 py-4">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-4">
                                            <div className="relative aspect-square h-20 w-20 min-w-20 overflow-hidden rounded-md border bg-muted">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground text-xs">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="grid gap-1">
                                                    <Link
                                                        href={`/products/${item.slug}`}
                                                        className="line-clamp-1 font-medium hover:text-primary transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 rounded-md border bg-card">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-none"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-xs tabular-nums">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-none"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent hover:text-destructive"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                            <div className="space-y-4 pr-6 pt-4 pb-6">
                                <Separator />
                                <div className="flex items-center justify-between text-base font-medium">
                                    <span>Toplam</span>
                                    <span>{total.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                                </div>
                                <Button className="w-full" size="lg" asChild>
                                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                        Sepeti Onayla
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
