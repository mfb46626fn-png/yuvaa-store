"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { checkoutSchema } from "@/lib/validations/checkout";
import { z } from "zod";

const addressFormSchema = checkoutSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    city: true,
    district: true,
    address: true,
    zipCode: true,
    termsAccepted: true
});

type CheckoutFormValues = z.infer<typeof addressFormSchema>;

export function CheckoutForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const cart = useCart();

    // Log "begin_checkout" event
    useEffect(() => {
        const trackCheckoutStart = async () => {
            if (cart.items.length === 0) return;

            try {
                // We use cart-store initSession here since we don't expose it directly in use-cart hook,
                // Alternatively we can just read it from localStorage if needed, 
                // but the cleanest way is calling the API.

                // Read from localstorage cart-storage directly for session if use-cart doesn't expose it
                const storageRaw = localStorage.getItem('cart-storage');
                if (storageRaw) {
                    const parsed = JSON.parse(storageRaw);
                    const session = parsed?.state?.sessionId;

                    if (session) {
                        await fetch('/api/analytics/track', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                event_type: 'begin_checkout',
                                session_id: session,
                                event_data: {
                                    cartTotal: cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
                                    items: cart.items.length
                                },
                                path: window.location.pathname
                            })
                        });
                    }
                }
            } catch (e) {
                console.error("Analytics failed", e);
            }
        };

        trackCheckoutStart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            city: "",
            district: "",
            address: "",
            zipCode: "",
            // @ts-ignore - Checkbox needs boolean but we start empty conceptually, default to false
            termsAccepted: false,
        },
    });

    async function onSubmit(data: CheckoutFormValues) {
        if (cart.items.length === 0) {
            toast.error("Sepetiniz boş, ödeme yapamazsınız.");
            return;
        }

        setIsLoading(true);

        try {
            // Call our Backend API
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    items: cart.items,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Ödeme başlatılamadı.");
            }

            if (result.status === "success" && result.iframe_token) {
                // Redirect to Payment Page with Token
                // We use localStorage or URL query. URL query is stateless and fine for token.
                // Or better, we can just use the token in the next page.
                // Wait, PayTR iframe token is sensitive? Not really, it's just for that session.
                router.push(`/checkout/payment?token=${result.iframe_token}`);
            } else {
                throw new Error("PayTR token alınamadı.");
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Adınız" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Soyad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Soyadınız" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-posta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ornek@email.com"
                                        {...field}
                                        onBlur={(e) => {
                                            field.onBlur(); // Standard rhf blur
                                            if (e.target.value && e.target.value.includes('@')) {
                                                const storageRaw = localStorage.getItem('cart-storage');
                                                if (storageRaw) {
                                                    const session = JSON.parse(storageRaw)?.state?.sessionId;
                                                    if (session) {
                                                        fetch('/api/analytics/track', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                event_type: 'checkout_contact_entered',
                                                                session_id: session,
                                                                event_data: { email: e.target.value },
                                                                path: window.location.pathname
                                                            })
                                                        }).catch(err => console.error("Could not log contact", err));
                                                    }
                                                }
                                            }
                                        }}
                                    />
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
                                    <Input placeholder="555 555 55 55" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>İl</FormLabel>
                                <FormControl>
                                    <Input placeholder="İl" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>İlçe</FormLabel>
                                <FormControl>
                                    <Input placeholder="İlçe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Posta Kodu</FormLabel>
                                <FormControl>
                                    <Input placeholder="34000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Açık Adres</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Mahalle, sokak, bina no, daire..."
                                    className="resize-none h-24"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal text-muted-foreground">
                                    <Link href="/pre-information-form" target="_blank" className="text-primary hover:underline">Ön Bilgilendirme Formu</Link>'nu ve <Link href="/sales-agreement" target="_blank" className="text-primary hover:underline">Mesafeli Satış Sözleşmesi</Link>'ni okudum ve onaylıyorum.
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            İşleniyor...
                        </>
                    ) : (
                        "Ödeme Ekranına Git"
                    )}
                </Button>
            </form>
        </Form>
    );
}
