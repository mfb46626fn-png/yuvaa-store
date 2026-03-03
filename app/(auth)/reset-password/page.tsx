"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth";
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
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema) as any,
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        // When checking for a session, we rely on the access_token in the URL.
        // Supabase handles the hash extraction automatically on the client.
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                // Not authenticated yet, user either didn't click the link or it expired.
                // We'll let them see the form, but the form will fail if there's no session.
                // Actually, for security, users MUST have a session to reset the password.
                toast.error("Geçersiz veya süresi dolmuş bağlantı.");
                router.push("/forgot-password");
            } else {
                setIsVerifying(false);
            }
        };

        checkSession();
    }, [router, supabase]);

    async function onSubmit(data: ResetPasswordValues) {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.newPassword
            });

            if (error) {
                toast.error("Şifre güncellenemedi: " + error.message);
                return;
            }

            toast.success("Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.");
            await supabase.auth.signOut(); // Sign out the temporary session
            router.push("/login");

        } catch (error) {
            toast.error("Bir hata oluştu.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isVerifying) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Bağlantı doğrulanıyor...</span>
            </div>
        );
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
                        <h1 className="text-2xl font-serif font-semibold tracking-tight">Yeni Şifre Belirle</h1>
                        <p className="text-sm text-muted-foreground">
                            Lütfen hesabınız için yeni bir şifre girin.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Yeni Şifre</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Şifreyi Onayla</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Şifreyi Kaydet
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
