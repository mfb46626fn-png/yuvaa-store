"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RecoveryButtonProps {
    sessionId: string;
    email: string;
    alreadySent?: boolean;
}

export function RecoveryButton({ sessionId, email, alreadySent = false }: RecoveryButtonProps) {
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(alreadySent);

    const handleSend = async () => {
        setIsSending(true);
        try {
            const res = await fetch("/api/admin/analytics/recover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId, target_email: email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "E-posta gönderilemedi");
            }

            toast.success("Kurtarma e-postası başarıyla gönderildi!");
            setSent(true);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSending(false);
        }
    };

    if (sent) {
        return (
            <Button size="sm" variant="outline" disabled className="text-xs h-7">
                <Mail className="mr-1.5 h-3 w-3" />
                Gönderildi
            </Button>
        );
    }

    return (
        <Button
            size="sm"
            variant="default"
            className="text-xs h-7"
            onClick={handleSend}
            disabled={isSending}
        >
            {isSending ? (
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : (
                <Mail className="mr-1.5 h-3 w-3" />
            )}
            Kurtarma Maili
        </Button>
    );
}
