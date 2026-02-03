"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || "/images/placeholder.png");

    return (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 md:flex-col md:w-20 md:pb-0 scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden transition-all",
                                selectedImage === img ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${title} - Görsel ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 aspect-square md:aspect-[4/5] overflow-hidden rounded-lg border bg-secondary/5">
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </div>
    );
}
