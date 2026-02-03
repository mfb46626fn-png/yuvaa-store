import { AddToCartButton } from "./AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
        categories: {
            name: string;
            slug: string;
        } | null;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const discountPercentage = product.sale_price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : null;

    const inStock = product.stock_quantity > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                {product.categories && (
                    <span className="text-sm font-medium text-primary">
                        {product.categories.name}
                    </span>
                )}
                <h1 className="text-3xl font-serif font-medium text-foreground sm:text-4xl">
                    {product.title}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-2xl font-semibold">
                                    ₺{product.sale_price.toLocaleString("tr-TR")}
                                </span>
                                <span className="text-lg text-muted-foreground line-through">
                                    ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-semibold">
                                ₺{product.price.toLocaleString("tr-TR")}
                            </span>
                        )}
                    </div>

                    {discountPercentage && (
                        <Badge variant="destructive">
                            %{discountPercentage} İndirim
                        </Badge>
                    )}
                </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="prose prose-sm text-muted-foreground whitespace-pre-wrap">
                <p>{product.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Malzeme</span>
                    <p className="text-sm text-muted-foreground">{product.material || "Belirtilmemiş"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Boyutlar</span>
                    <p className="text-sm text-muted-foreground">{product.dimensions || "Belirtilmemiş"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Stok Durumu</span>
                    {inStock ? (
                        <p className="text-sm text-green-600 font-medium">Stokta Var ({product.stock_quantity} adet)</p>
                    ) : (
                        <p className="text-sm text-destructive font-medium">Tükendi</p>
                    )}
                </div>
            </div>

            <Separator />

            {/* Actions */}
            <AddToCartButton product={{
                id: product.id,
                title: product.title,
                price: product.sale_price || product.price,
                image: product.images[0] || "/images/placeholder.png",
                slug: product.slug,
                stock_quantity: product.stock_quantity
            }} />
        </div>
    );
}
