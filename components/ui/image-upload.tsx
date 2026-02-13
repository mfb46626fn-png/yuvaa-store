"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: (url: string) => void;
    bucketName?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    bucketName = "categories",
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            toast.error("Lütfen geçerli bir resim dosyası seçin.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log("Starting upload...", { bucketName, filePath, fileSize: file.size });

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

            if (uploadError) {
                console.error("Supabase Upload Error:", uploadError);
                throw uploadError;
            }

            console.log("Upload successful:", data);

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            console.log("Public URL:", publicUrl);

            onChange(publicUrl);
            toast.success("Resim yüklendi.");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Resim yüklenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                {value && (
                    <div className="relative h-[200px] w-[200px] overflow-hidden rounded-md border">
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => onRemove(value)}
                                disabled={disabled}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            src={value}
                            alt="Upload"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                {!value && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "relative flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition hover:bg-muted/80",
                            disabled && "cursor-not-allowed opacity-50"
                        )}
                    >
                        <input
                            type="file"
                            accept="image/*"
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
                                    <span>Görsel Yükle</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
