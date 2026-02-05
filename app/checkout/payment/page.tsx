"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // PayTR iframe resizing logic often requires their script or just robust CSS.
        // Usually: <iframe src="https://www.paytr.com/odeme/guvenli/TOKEN" ... />
        // Wait, standard PayTR integration:
        // "Adım 2: Oluşan token ve iframe url kullanılarak... oluşturulur."
        // URL: https://www.paytr.com/odeme/guvenli/{token}
    }, [token]);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Geçersiz Ödeme Token'ı</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 bg-primary text-white text-center">
                    <h1 className="text-xl font-bold">Güvenli Ödeme</h1>
                </div>

                <div className="w-full" style={{ minHeight: "600px" }}>
                    <iframe
                        ref={iframeRef}
                        src={`https://www.paytr.com/odeme/guvenli/${token}`}
                        id="paytriframe"
                        frameBorder="0"
                        scrolling="no"
                        style={{ width: "100%", height: "800px" }} // Fixed height for now, usually needs resizing script
                    ></iframe>
                </div>
            </div>

            {/* PayTR Resizing Script (Official) */}
            <Script id="paytr-resizer" strategy="lazyOnload">
                {`
                   // PayTR frame resizing logic (if documented publicly, usually it's just 'iframeResizer' lib or similar)
                   // For now, fixed height 800px is safe for most credit card forms.
                   // If responsive behavior is critical, verify PayTR docs for specific js snippet.
                `}
            </Script>
        </div>
    );
}
