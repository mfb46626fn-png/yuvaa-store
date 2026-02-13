"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            first_name: formData.get("name") as string,
            last_name: formData.get("surname") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        try {
            const { error } = await supabase
                .from("contact_messages")
                .insert([data]);

            if (error) throw error;

            toast.success("Mesajınız iletildi! En kısa sürede dönüş yapacağız.");
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            console.error("Error submitting contact form:", error);
            toast.error("Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Header / Hero Section (Optional, keeping it simple as requested) */}
            <div className="bg-secondary/5 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">İletişim</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Sorularınız, önerileriniz veya iş birlikleri için bize ulaşın.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

                    {/* LEFT SIDE: Contact Info */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="font-serif text-3xl font-medium mb-6">Bize Ulaşın</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Yuvaa Store deneyimi hakkında her türlü sorunuz için buradayız.
                                Aşağıdaki iletişim kanallarından veya formu doldurarak bize ulaşabilirsiniz.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Address */}
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Adres</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Bağdat Caddesi No:123<br />
                                        Suadiye, Kadıköy<br />
                                        İstanbul, 34740
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                                    <p className="text-muted-foreground mb-1">
                                        <a href="tel:08505550000" className="hover:text-primary transition-colors">
                                            0850 555 00 00
                                        </a>
                                    </p>
                                    <p className="text-xs text-muted-foreground">Hafta içi: 09:00 - 18:00</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">E-Posta</h3>
                                    <p className="text-muted-foreground">
                                        <a href="mailto:destek@yuvaastore.com" className="hover:text-primary transition-colors">
                                            destek@yuvaastore.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Contact Form */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="font-serif text-2xl font-medium mb-6">Mesaj Gönderin</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Adınız</label>
                                    <Input id="name" name="name" placeholder="Adınız" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="surname" className="text-sm font-medium">Soyadınız</label>
                                    <Input id="surname" name="surname" placeholder="Soyadınız" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">E-posta</label>
                                <Input id="email" name="email" type="email" placeholder="ornek@email.com" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">Konu</label>
                                <Input id="subject" name="subject" placeholder="Mesajınızın konusu" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Mesajınız</label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Size nasıl yardımcı olabiliriz?"
                                    className="min-h-[120px] resize-none"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full text-lg h-12" disabled={isSubmitting}>
                                {isSubmitting ? "Gönderiliyor..." : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Mesajı Gönder
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
