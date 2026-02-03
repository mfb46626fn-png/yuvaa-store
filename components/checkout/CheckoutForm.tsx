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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed now (or we'll simulate toast)
// If sonner failed, we'll use window.alert fallback, but better to use simple console log for now if imports fail

// Validation Schema
const checkoutSchema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
    city: z.string().min(2, "İl seçiniz/giriniz"),
    district: z.string().min(2, "İlçe seçiniz/giriniz"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const cart = useCart();
    // sonner toast
    const notify = (msg: string) => {
        try {
            toast(msg);
        } catch {
            alert(msg);
        }
    };

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            district: "",
        },
    });

    async function onSubmit(data: CheckoutFormValues) {
        if (cart.items.length === 0) {
            notify("Sepetiniz boş, ödeme yapamazsınız.");
            return;
        }

        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock API call
        console.group("Ödeme İşlemi");
        console.log("Müşteri:", data);
        console.log("Sepet:", cart.items);
        console.groupEnd();

        notify("Siparişiniz başarıyla alındı! (Simülasyon)");

        cart.clearCart();
        setIsLoading(false);
        router.push("/checkout/success");
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
                                    <Input placeholder="0555 555 55 55" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        "Ödemeye Geç"
                    )}
                </Button>
            </form>
        </Form>
    );
}
