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
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary/5">
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Thumbnails (Below Main Image) */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all",
                                selectedImage === img
                                    ? "ring-2 ring-primary ring-offset-2"
                                    : "opacity-70 hover:opacity-100"
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
        </div>
    );
}
