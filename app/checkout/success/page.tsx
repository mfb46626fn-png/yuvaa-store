import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Sipariş Alındı | Yuvaa Store",
};

export default async function CheckoutSuccessPage() {
    // Generate a simulated order number
    const orderNumber = Math.floor(10000 + Math.random() * 90000).toString();

    return (
        <div className="bg-background min-h-screen py-20 flex items-center justify-center">
            <div className="container px-4 max-w-md w-full">
                <div className="bg-card border border-border rounded-xl shadow-lg p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 p-4 text-green-600">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold font-serif text-foreground">Siparişiniz Alındı!</h1>
                        <p className="text-muted-foreground">
                            Siparişiniz başarıyla oluşturuldu ve işleme alındı.
                        </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Sipariş Numarası
                        </p>
                        <p className="text-2xl font-mono font-bold text-foreground mt-1">
                            {`#${orderNumber}`}
                        </p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Sipariş detaylarını içeren bir e-postayı <span className="font-medium text-foreground">kayıtlı e-posta adresinize</span> gönderdik. Kargo takibini bu numara ile yapabilirsiniz.
                    </div>

                    <div className="pt-4">
                        <Button asChild className="w-full h-12 text-base" size="lg">
                            <Link href="/">
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Alışverişe Devam Et
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
