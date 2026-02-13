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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authSchema, type AuthFormValues } from "@/lib/validations/auth";

interface AuthFormProps {
    type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
            phone: "",
        },
    });

    async function onSubmit(data: AuthFormValues) {
        setIsLoading(true);
        try {
            if (type === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

                if (error) {
                    toast.error("Giriş başarısız: " + error.message);
                    return;
                }

                toast.success("Giriş başarılı!");
                router.push("/"); // Redirect to home (middleware will handle admin/account)
                router.refresh();
            } else {
                // REGISTER
                if (!data.fullName) {
                    form.setError("fullName", { message: "Ad Soyad gereklidir" });
                    return;
                }
                if (!data.phone) {
                    form.setError("phone", { message: "Telefon numarası gereklidir" });
                    return;
                }

                const { error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: data.fullName,
                            phone: data.phone,
                        },
                    },
                });

                if (error) {
                    toast.error("Kayıt başarısız: " + error.message);
                    return;
                }

                toast.success("Kayıt başarılı! Lütfen e-postanızı kontrol edin.");
                // Depending on email confirmation settings, might auto-login or wait.
                // Assuming email confirm OFF for dev, or generic message.
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {type === "register" && (
                        <FormField
                            control={form.control}
                            name="fullName"
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
                    )}

                    {type === "register" && (
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefon Numarası</FormLabel>
                                    <FormControl>
                                        <Input placeholder="05XXXXXXXXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-posta</FormLabel>
                                <FormControl>
                                    <Input placeholder="ornek@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Şifre</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {type === "login" ? "Giriş Yap" : "Kayıt Ol"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
