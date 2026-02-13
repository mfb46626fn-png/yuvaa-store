"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface AddToCartButtonProps {
    product: {
        id: string;
        title: string;
        price: number;
        image: string;
        slug: string;
        stock_quantity: number;
    };
    personalization?: {
        type: "text" | "image";
        value: string;
    };
    isPersonalizationRequired?: boolean;
}

export function AddToCartButton({ product, personalization, isPersonalizationRequired }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const cart = useCart();

    const increaseQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(prev => prev + 1);
        } else {
            toast.error("Stok limitine ulaştınız");
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (isPersonalizationRequired && !personalization) {
            toast.error("Lütfen kişiselleştirme bilgilerini giriniz.");
            return;
        }

        cart.addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity,
            slug: product.slug,
            personalization: personalization
        });

        toast.success("Ürün sepete eklendi");
        setQuantity(1);
    };

    const isOutOfStock = product.stock_quantity <= 0;

    if (isOutOfStock) {
        return (
            <Button disabled className="w-full" size="lg">
                Stokta Yok
            </Button>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-md h-12">
                    <button
                        onClick={decreaseQuantity}
                        className="w-10 h-full flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <div className="w-12 text-center font-medium">
                        {quantity}
                    </div>
                    <button
                        onClick={increaseQuantity}
                        className="w-10 h-full flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-50"
                        disabled={quantity >= product.stock_quantity}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Add Button */}
                <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 text-base"
                    size="lg"
                >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Sepete Ekle
                </Button>
            </div>
        </div>
    );
}
