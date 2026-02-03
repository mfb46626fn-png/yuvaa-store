"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

interface ImageDropzoneProps {
    onImagesChange: (urls: string[]) => void;
    existingImages?: string[];
}

interface UploadedImage {
    file?: File;
    url: string;
    uploading?: boolean;
}

export function ImageDropzone({ onImagesChange, existingImages = [] }: ImageDropzoneProps) {
    const [images, setImages] = useState<UploadedImage[]>(
        existingImages.map(url => ({ url }))
    );
    const [error, setError] = useState<string | null>(null);

    const uploadToSupabase = async (file: File): Promise<string | null> => {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
            .from("products")
            .upload(filePath, file);

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError(null);

        // Add files with uploading state
        const newImages: UploadedImage[] = acceptedFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
            uploading: true,
        }));

        setImages(prev => [...prev, ...newImages]);

        // Upload each file
        const uploadPromises = acceptedFiles.map(async (file, index) => {
            const url = await uploadToSupabase(file);
            return { index, url };
        });

        const results = await Promise.all(uploadPromises);

        setImages(prev => {
            const updated = [...prev];
            results.forEach(({ index, url }) => {
                const imgIndex = prev.length - newImages.length + index;
                if (url) {
                    updated[imgIndex] = { url, uploading: false };
                } else {
                    // Mark failed upload
                    updated[imgIndex] = { ...updated[imgIndex], uploading: false };
                    setError("Bazı resimler yüklenemedi. Lütfen tekrar deneyin.");
                }
            });
            return updated;
        });

        // Update parent with successful URLs
        const successfulUrls = results
            .map(r => r.url)
            .filter((url): url is string => url !== null);

        onImagesChange([...existingImages, ...successfulUrls]);
    }, [existingImages, onImagesChange]);

    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
        const newUrls = images
            .filter((_, index) => index !== indexToRemove)
            .map(img => img.url);
        onImagesChange(newUrls);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50 hover:bg-accent/50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload className={cn(
                        "h-10 w-10",
                        isDragActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className="text-sm font-medium text-foreground">
                        {isDragActive
                            ? "Resimleri buraya bırakın..."
                            : "Resimleri sürükleyin veya tıklayın"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        JPEG, PNG, WebP (Maks. 5MB)
                    </p>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Image previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((image, index) => (
                        <div
                            key={image.url}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                        >
                            {image.uploading ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={image.url}
                                        alt={`Ürün resmi ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                            Ana Resim
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state hint */}
            {images.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>İlk yüklenen resim ana resim olarak kullanılacak</span>
                </div>
            )}
        </div>
    );
}
