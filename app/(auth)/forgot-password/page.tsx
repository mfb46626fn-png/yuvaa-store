"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";
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

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const supabase = createClient();

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema) as any,
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordValues) {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                toast.error("İşlem başarısız: " + error.message);
                return;
            }

            setIsSubmitted(true);
            toast.success("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
        } catch (error) {
            toast.error("Bir hata oluştu.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            {/* Left: Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col relative bg-[#FDFCF8] border-r border-border/40">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_100%)]" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center space-y-8">
                    <div className="relative w-48 h-16">
                        <Image
                            src="/logo.png"
                            alt="Yuvaa Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <blockquote className="space-y-2 max-w-lg">
                        <p className="text-xl font-serif italic text-muted-foreground">
                            "Evinizin ruhunu yansıtan dokunuşlar."
                        </p>
                    </blockquote>
                </div>

                {/* Decoration/Footer if needed */}
                <div className="relative z-10 p-8 mt-auto text-sm text-muted-foreground/50 text-center">
                    &copy; {new Date().getFullYear()} Yuvaa Store. Tüm hakları saklıdır.
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="mx-auto w-full max-w-[350px] space-y-8">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-serif font-semibold tracking-tight">Şifremi Unuttum</h1>
                        <p className="text-sm text-muted-foreground">
                            Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center space-y-4">
                            <div className="bg-primary/10 text-primary p-4 rounded-md text-sm border border-primary/20">
                                E-posta adresinize bir şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
                            </div>
                            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                                Tekrar Gönder
                            </Button>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Sıfırlama Bağlantısı Gönder
                                </Button>
                            </form>
                        </Form>
                    )}

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
                            Giriş Ekranına Dön
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
