"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Show button after a small delay or instantly
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Hide on admin pages
    if (!isVisible || pathname.startsWith("/admin")) return null;

    const { whatsapp_number, whatsapp_message } = SITE_CONFIG.footer.socials;

    // Fallback if no number is configured
    if (!whatsapp_number) return null;

    const encodedMessage = encodeURIComponent(whatsapp_message);
    const whatsappUrl = `https://wa.me/${whatsapp_number}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in zoom-in"
            aria-label="WhatsApp ile İletişime Geçin"
        >
            <MessageCircle className="w-8 h-8" />
            <span className="absolute flex h-3 w-3 top-0 right-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#128C7E] border-2 border-white"></span>
            </span>
        </a>
    );
}
