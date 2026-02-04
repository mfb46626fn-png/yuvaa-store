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
// import { useRouter } from "next/navigation"; // Not needed for maintenance mode
import { useCart } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { checkoutSchema } from "@/lib/validations/checkout";
import * as z from "zod";

// Create a schema that only validates the address fields present in this form
// We exclude credit card fields since they are likely handled in a next step or different form
const addressFormSchema = checkoutSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    city: true,
    district: true,
    address: true,
    // zipCode is in the main schema but maybe not in UI?  Let's check previous file content.
    // Previous file didn't have zipCode input. I should probably add it or make it optional/omit.
    // The previous file schema didn't have zipCode. The new lib schema has it.
    // To match UI exactly, I'll omit zipCode for now or better, I will ADD the zipCode input to the UI
    // to strictly follow the "use Zod Schema" instruction which mandates it.
    zipCode: true
});

type CheckoutFormValues = z.infer<typeof addressFormSchema>;

export function CheckoutForm() {
    // const router = useRouter();
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

        // Simulate a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // MAINTENANCE MODE LOGIC
        // Instead of backend call, we show this warning
        toast.warning("Ödeme altyapısı şu an bakım aşamasındadır. Lütfen daha sonra tekrar deneyiniz.", {
            duration: 5000, // Show for 5 seconds
            action: {
                label: "Tamam",
                onClick: () => console.log("User acknowledged"),
            },
        });

        setIsLoading(false);
        // Do NOT clear cart
        // Do NOT redirect
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
                            Kontrol Ediliyor...
                        </>
                    ) : (
                        "Ödemeye Geç"
                    )}
                </Button>
            </form>
        </Form>
    );
}
