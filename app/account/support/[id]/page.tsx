"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { TicketChat } from "@/components/support/TicketChat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
}

export default function TicketDetailPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
                    <Link href="/account/support">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-xl font-bold">{ticket.subject}</h2>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(ticket.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                        {ticket.status}
                    </Badge>
                </div>
            </div>

            <TicketChat ticketId={ticket.id} isAdminView={false} ticketStatus={ticket.status} />
        </div>
    );
}
