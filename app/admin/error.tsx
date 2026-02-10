"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin Route Error:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-muted/20 p-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Admin Paneli Yüklenemedi</h2>
            <p className="text-muted-foreground max-w-md">
                Bir şeyler ters gitti. ({error.message || "Bilinmeyen Hata"})
                {error.digest && <span className="block text-xs mt-2 text-muted-foreground/50">Hata Kodu: {error.digest}</span>}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()}>Tekrar Dene</Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                    Ana Sayfaya Dön
                </Button>
            </div>
        </div>
    );
}
