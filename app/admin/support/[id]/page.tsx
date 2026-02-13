"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { TicketChat } from "@/components/support/TicketChat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, Ban } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    user_id: string;
}

export default function AdminTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchTicket = async () => {
            if (!params?.id) return;

            const { data } = await supabase
                .from("support_tickets")
                .select("*")
                .eq("id", params.id)
                .single();

            setTicket(data);
            setIsLoading(false);
        };

        fetchTicket();
    }, [params]);

    const handleUpdateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/support/tickets/${ticket?.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Status update failed");

            setTicket(prev => prev ? { ...prev, status: newStatus } : null);
            toast.success("Durum güncellendi.");
        } catch (error) {
            toast.error("Durum güncellenemedi.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (!ticket) {
        return <div>Talep bulunamadı.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/support">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-xl font-bold">{ticket.subject}</h2>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(ticket.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
                    </p>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                    <Select
                        value={ticket.status}
                        onValueChange={handleUpdateStatus}
                        disabled={isUpdating}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Durum" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Açık</SelectItem>
                            <SelectItem value="in_progress">İşlemde</SelectItem>
                            <SelectItem value="closed">Kapalı</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-4 p-4 border rounded-lg bg-muted/20">
                <div className="text-sm">
                    <span className="font-semibold block text-muted-foreground">Müşteri ID</span>
                    <span className="font-mono">{ticket.user_id}</span>
                </div>
                <div className="text-sm">
                    <span className="font-semibold block text-muted-foreground">Öncelik</span>
                    <Badge variant="outline">{ticket.priority}</Badge>
                </div>
            </div>

            <TicketChat ticketId={ticket.id} isAdminView={true} ticketStatus={ticket.status} />
        </div>
    );
}
