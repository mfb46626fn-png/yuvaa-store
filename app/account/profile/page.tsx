"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";

const profileSchema = z.object({
    full_name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    phone: z.string().optional(),
    address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { profile, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            address: "",
        },
    });

    // Load initial data
    useEffect(() => {
        if (profile) {
            form.reset({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                address: profile.address || "",
            });
        }
    }, [profile, form]);

    async function onSubmit(data: ProfileFormValues) {
        if (!user) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: data.full_name,
                    phone: data.phone,
                    address: data.address,
                })
                .eq("id", user.id);

            if (error) throw error;

            toast.success("Profil başarıyla güncellendi.");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Profil güncellenemedi.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-semibold mb-6">Profil Bilgilerim</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ad Soyad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Adınız Soyadınız" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                    <Input placeholder="05XX XXX XX XX" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adres</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Kargo teslimat adresi..."
                                        className="resize-none h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Güncelle
                    </Button>
                </form>
            </Form>
        </div>
    );
}
