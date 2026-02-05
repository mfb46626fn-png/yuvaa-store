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
import { useState } from "react";
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
    zipCode: true
});

type CheckoutFormValues = z.infer<typeof addressFormSchema>;

export function CheckoutForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const cart = useCart();

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
                                    <Input placeholder="ornek@email.com" {...field} />
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
