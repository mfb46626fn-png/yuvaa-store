"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Edit, MoreHorizontal, Plus, AlertTriangle, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

import { getCategoryTitle } from "@/lib/constants";

type Product = {
    id: string;
    title: string;
    price: number;
    inventory: number;
    category: string; // Changed from category_id
    images: string[];
    slug: string;
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Products fetch error:", error);
            toast.error("Ürünler yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ürün Ekle
                    </Button>
                </Link>
            </div>

            <div className="flex items-center py-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Ürün ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Görsel</TableHead>
                            <TableHead>Ürün Adı</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead className="text-right">Fiyat</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                                        {product.images?.[0] && (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{product.title}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{product.slug}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{getCategoryTitle(product.category)}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {product.inventory < 5 && (
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                        )}
                                        <Badge variant={product.inventory < 5 ? "destructive" : "secondary"}>
                                            {product.inventory}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    ₺{product.price.toLocaleString("tr-TR")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Menü</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/products/edit/${product.id}`}> {/* Assuming edit page logic exists or will be added, reusing new likely */}
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Düzenle
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => window.open(`/products/${product.slug}`, '_blank')}>
                                                Sitede Gör
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
