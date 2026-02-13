"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Form Schema
const formSchema = z.object({
    title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
    slug: z.string().min(2, "Slug en az 2 karakter olmalıdır"),
    image_url: z.string().optional(),
});

interface CategoryFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        image_url: string | null;
    } | null;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            image_url: initialData?.image_url || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            if (initialData) {
                // Update
                const { error } = await supabase
                    .from("categories")
                    .update({
                        title: values.title,
                        slug: values.slug,
                        image_url: values.image_url || null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", initialData.id);

                if (error) throw error;
                toast.success("Kategori güncellendi");
            } else {
                // Create
                const { error } = await supabase
                    .from("categories")
                    .insert({
                        title: values.title,
                        slug: values.slug,
                        image_url: values.image_url || null,
                    });

                if (error) throw error;
                toast.success("Kategori oluşturuldu");
            }

            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue("title", title);

        // Only auto-generate if not editing existing slug or if we want to force it
        // Usually good UX is to auto-fill slug only if it was empty or untouched
        if (!initialData) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "") // remove special chars
                .replace(/\s+/g, "-"); // replace spaces with dashes
            form.setValue("slug", slug);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori Adı</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Örn: Ev Dekorasyon"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleTitleChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Bağlantısı (Slug)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="orn-ev-dekorasyon" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-8">
                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori Görseli</FormLabel>
                                    <FormControl>
                                        <ImageDropzone
                                            onImagesChange={(urls) => field.onChange(urls[0])}
                                            existingImages={field.value ? [field.value] : []}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        İptal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Güncelle" : "Oluştur"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
