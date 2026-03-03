"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, PackageSearch, X } from "lucide-react";
import Fuse from "fuse.js";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchProduct {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    base_price: number;
    sale_price: number | null;
    images: string[];
}

export function GlobalSearch({ triggerButton }: { triggerButton?: React.ReactNode }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<SearchProduct[]>([]);
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch products once when dialog is opened
    useEffect(() => {
        let isMounted = true;
        if (open && products.length === 0) {
            setIsLoading(true);
            fetch("/api/products/search")
                .then(res => res.json())
                .then(data => {
                    if (isMounted && Array.isArray(data)) {
                        setProducts(data);
                    }
                })
                .catch(err => console.error("Search fetch error", err))
                .finally(() => {
                    if (isMounted) setIsLoading(false);
                });
        }
        return () => { isMounted = false };
    }, [open, products.length]);

    // Handle Fuse.js Search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fuse = new Fuse(products, {
            keys: ["title", "description", "category"],
            threshold: 0.3, // 0.0 is perfect match, 1.0 is match anything
            includeScore: true,
            ignoreLocation: true // Find matches anywhere in the string
        });

        const searchResults = fuse.search(query).map(result => result.item);
        setResults(searchResults.slice(0, 10)); // Max 10 results
    }, [query, products]);


    // Handle global keyboard shortcut CMD+K / CTRL+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = useCallback((slug: string) => {
        setOpen(false);
        setQuery("");
        router.push(`/products/${slug}`);
    }, [router]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button variant="ghost" size="icon" className="hover:text-primary relative" title="Ara (Ctrl/Cmd + K)">
                        <Search size={20} />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 gap-0 border-0 shadow-2xl overflow-hidden [&>button]:hidden">
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                    <Input
                        placeholder="Örn: Fenerbahçe rölyef, veya ahşap tepsi..."
                        className="flex h-12 w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="opacity-50 hover:opacity-100 hover:bg-transparent">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {isLoading && (
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Katalog Yükleniyor...
                        </div>
                    )}

                    {!isLoading && query.length > 0 && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-sm">
                            <PackageSearch className="mb-4 h-10 w-10 text-muted-foreground/50" />
                            <p className="font-semibold text-foreground">Sonuç bulunamadı</p>
                            <p className="text-muted-foreground mt-1">"{query}" için bir eşleşme yok. Farklı kelimelerle deneyin.</p>
                        </div>
                    )}

                    {!isLoading && results.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Ürünler
                            </h3>
                            {results.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelect(product.slug)}
                                    className="flex items-center gap-4 rounded-md p-3 hover:bg-accent hover:text-accent-foreground text-left transition-colors w-full cursor-pointer"
                                >
                                    <div className="h-12 w-12 rounded bg-muted flex-shrink-0 overflow-hidden relative border border-border/50">
                                        <img
                                            src={product.images[0] || "/images/placeholder.png"}
                                            alt={product.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{product.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        {product.sale_price ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground line-through text-xs">₺{product.base_price.toLocaleString("tr-TR")}</span>
                                                <span className="font-semibold text-primary">₺{product.sale_price.toLocaleString("tr-TR")}</span>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">₺{product.base_price.toLocaleString("tr-TR")}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isLoading && query.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-sm text-muted-foreground">Aradığınız ürünü yazmaya başlayın.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
