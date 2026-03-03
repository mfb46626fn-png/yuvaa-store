"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cookie } from "lucide-react";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "accepted");
        // Here you would typically initialize your analytics (e.g., Google Analytics, Meta Pixel)
        // window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookieConsent", "declined");
        // Here you would ensure analytics are not tracking
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t p-4 sm:p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] translate-y-0 animate-in slide-in-from-bottom-full duration-500">
            <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Cookie className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="font-semibold text-foreground">Gizliliğinize Önem Veriyoruz</p>
                        <p className="text-muted-foreground leading-relaxed">
                            Sizlere daha iyi bir alışveriş deneyimi sunabilmek, sitemizin performansını ölçmek ve ilgi alanlarınıza yönelik reklamlar gösterebilmek için çerezler kullanıyoruz.
                            Detaylı bilgi için <Link href="/kvkk" className="text-primary hover:underline font-medium">KVKK Aydınlatma Metni</Link>'ni inceleyebilirsiniz.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button variant="outline" onClick={declineCookies} className="flex-1 sm:flex-none">
                        Sadece Zorunlular
                    </Button>
                    <Button onClick={acceptCookies} className="flex-1 sm:flex-none">
                        Tümünü Kabul Et
                    </Button>
                </div>
            </div>
        </div>
    );
}
