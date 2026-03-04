"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export function CategorySorter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "newest";

    const handleSortChange = useCallback((value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (value === "newest") {
            current.delete("sort");
        } else {
            current.set("sort", value);
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return (
        <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px] h-9 text-sm">
                    <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="price_asc">Fiyat: Düşükten Yükseğe</SelectItem>
                    <SelectItem value="price_desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
