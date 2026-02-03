import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
    title: "İletişim | Yuvaa Store",
};

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="font-serif text-4xl font-medium text-foreground text-center mb-12">İletişim</h1>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-semibold mb-2">Adres</h3>
                        <p className="text-muted-foreground text-sm">
                            Bağdat Caddesi No:123<br />
                            Suadiye, Kadıköy<br />
                            İstanbul, Türkiye
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-semibold mb-2">E-posta</h3>
                        <p className="text-muted-foreground text-sm">
                            info@yuvaastore.com
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                            support@yuvaastore.com
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                            <Phone size={24} />
                        </div>
                        <h3 className="font-semibold mb-2">Telefon</h3>
                        <p className="text-muted-foreground text-sm">
                            +90 (216) 555 00 00
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                            Hafta içi: 09:00 - 18:00
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
