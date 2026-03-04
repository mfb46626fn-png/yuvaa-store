"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    onRemove: (url: string) => void;
    bucketName?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value = [],
    onChange,
    onRemove,
    bucketName = "categories",
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validation for each file
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error(`"${file.name}" geçerli bir resim dosyası değil.`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error(`"${file.name}" dosya boyutu 5MB'dan küçük olmalıdır.`);
                return;
            }
        }

        setIsUploading(true);
        const newUploadedUrls: string[] = [];

        try {
            await Promise.all(files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                // Create a promise that rejects after 30 seconds
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error("Upload timed out after 30 seconds")), 30000);
                });

                const uploadPromise = supabase.storage
                    .from(bucketName)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                const result = await Promise.race([uploadPromise, timeoutPromise]) as any;
                const { data, error: uploadError } = result;

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                newUploadedUrls.push(publicUrl);
            }));

            // Append new ones to existing
            onChange([...value, ...newUploadedUrls]);
            toast.success("Resim(ler) yüklendi.");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Resim(ler) yüklenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleMoveLeft = (index: number) => {
        if (index === 0) return;
        const newArr = [...value];
        const temp = newArr[index - 1];
        newArr[index - 1] = newArr[index];
        newArr[index] = temp;
        onChange(newArr);
    };

    const handleMoveRight = (index: number) => {
        if (index === value.length - 1) return;
        const newArr = [...value];
        const temp = newArr[index + 1];
        newArr[index + 1] = newArr[index];
        newArr[index] = temp;
        onChange(newArr);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {value.map((url, index) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-md border group">
                        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => handleMoveLeft(index)}
                                    disabled={disabled}
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                </Button>
                            )}
                            {index < value.length - 1 && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => handleMoveRight(index)}
                                    disabled={disabled}
                                >
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => onRemove(url)}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt="Upload preview"
                            fill
                            className="object-cover"
                        />
                        {index === 0 && (
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] text-center py-1 font-semibold z-10">
                                Ana Görsel
                            </div>
                        )}
                    </div>
                ))}

                {/* Upload Trigger */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition hover:bg-muted/80",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple // MUST be multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onUpload}
                        disabled={disabled || isUploading}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span>Yükleniyor...</span>
                            </>
                        ) : (
                            <>
                                <ImagePlus className="h-8 w-8" />
                                <span>Çoklu Görsel Seç</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
