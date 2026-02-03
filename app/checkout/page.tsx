import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Ödeme | Yuvaa Store",
};

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-secondary/5 pb-20 pt-10">
            <div className="container mx-auto px-4">
                <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Alışverişe Dön
                </Link>

                <h1 className="font-serif text-3xl font-bold mb-10">Ödeme</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Side: Form (2/3 width) */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-background rounded-lg border p-6 md:p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Teslimat Bilgileri</h2>
                                <p className="text-sm text-muted-foreground">
                                    Lütfen kargonuzun teslim edileceği adresi giriniz.
                                </p>
                            </div>
                            <CheckoutForm />
                        </div>
                    </div>

                    {/* Right Side: Summary (1/3 width) */}
                    <div>
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
