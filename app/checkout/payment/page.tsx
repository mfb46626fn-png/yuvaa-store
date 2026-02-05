"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Loader2 } from "lucide-react";

function PaymentContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // PayTR resizing logic if needed
    }, [token]);

    if (!token) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500 font-medium">Geçersiz Ödeme Token'ı</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden animate-in fade-in duration-500">
            <div className="p-4 bg-primary text-white text-center">
                <h1 className="text-xl font-bold">Güvenli Ödeme</h1>
            </div>

            <div className="w-full relative" style={{ minHeight: "600px" }}>
                <iframe
                    ref={iframeRef}
                    src={`https://www.paytr.com/odeme/guvenli/${token}`}
                    id="paytriframe"
                    frameBorder="0"
                    scrolling="no"
                    style={{ width: "100%", height: "800px" }}
                ></iframe>
            </div>

            <Script id="paytr-resizer" strategy="lazyOnload">
                {`
                   // PayTR frame resizing logic
                `}
            </Script>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            <Suspense
                fallback={
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-4">
                        <Loader2 className="animate-spin" size={48} />
                        <p>Ödeme Ekranı Yükleniyor...</p>
                    </div>
                }
            >
                <PaymentContent />
            </Suspense>
        </div>
    );
}
