"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

interface FilterGroups {
    orientations: string[];
    tones: string[];
    sizeCategories: string[];
}

export function CategoryFilters({ availableFilters }: { availableFilters: FilterGroups }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper to toggle array filters in URL
    const toggleFilter = useCallback((key: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        // Split existing values
        const existingValues = current.get(key)?.split(',') || [];

        if (existingValues.includes(value)) {
            // Remove value
            const newValues = existingValues.filter(v => v !== value);
            if (newValues.length > 0) {
                current.set(key, newValues.join(','));
            } else {
                current.delete(key);
            }
        } else {
            // Add value
            existingValues.push(value);
            current.set(key, existingValues.join(','));
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const isChecked = (key: string, value: string) => {
        const existingValues = searchParams.get(key)?.split(',') || [];
        return existingValues.includes(value);
    };

    const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
    };

    const FilterContent = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Filtreler</h3>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 lg:px-3">
                        Temizle
                    </Button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["orientation", "frame", "size", "tone"]} className="w-full">

                {/* Size Filter */}
                {availableFilters.sizeCategories.length > 0 && (
                    <AccordionItem value="size">
                        <AccordionTrigger className="text-sm">Boyut</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {availableFilters.sizeCategories.map(size => (
                                    <div key={size} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`size-${size}`}
                                            checked={isChecked('size', size)}
                                            onCheckedChange={() => toggleFilter('size', size)}
                                        />
                                        <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {size}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Orientation Filter */}
                {availableFilters.orientations.length > 0 && (
                    <AccordionItem value="orientation">
                        <AccordionTrigger className="text-sm">Yön</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {availableFilters.orientations.map(ori => (
                                    <div key={ori} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`ori-${ori}`}
                                            checked={isChecked('orientation', ori)}
                                            onCheckedChange={() => toggleFilter('orientation', ori)}
                                        />
                                        <Label htmlFor={`ori-${ori}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {ori}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Frame Filter */}
                <AccordionItem value="frame">
                    <AccordionTrigger className="text-sm">Çerçeve</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="frame-true"
                                    checked={isChecked('frame', 'true')}
                                    onCheckedChange={() => toggleFilter('frame', 'true')}
                                />
                                <Label htmlFor="frame-true" className="text-sm font-normal cursor-pointer leading-none">
                                    Çerçeveli
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="frame-false"
                                    checked={isChecked('frame', 'false')}
                                    onCheckedChange={() => toggleFilter('frame', 'false')}
                                />
                                <Label htmlFor="frame-false" className="text-sm font-normal cursor-pointer leading-none">
                                    Çerçevesiz
                                </Label>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Tone Filter */}
                {availableFilters.tones.length > 0 && (
                    <AccordionItem value="tone">
                        <AccordionTrigger className="text-sm">Renk / Ton</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {availableFilters.tones.map(tone => (
                                    <div key={tone} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`tone-${tone}`}
                                            checked={isChecked('tone', tone)}
                                            onCheckedChange={() => toggleFilter('tone', tone)}
                                        />
                                        <Label htmlFor={`tone-${tone}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {tone}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

            </Accordion>
        </div>
    );

    return (
        <>
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 shrink-0 pr-8">
                <FilterContent />
            </div>

            {/* Mobile Filters Trigger & Sheet */}
            <div className="lg:hidden w-full mb-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <SlidersHorizontal size={16} />
                            Filtrele {hasActiveFilters && "(Aktif)"}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] pt-10">
                        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                        <div className="overflow-y-auto h-full pr-4 pb-20">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
