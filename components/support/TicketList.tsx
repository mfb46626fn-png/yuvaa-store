"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

interface Ticket {
    id: string;
    subject: string;
    status: "open" | "in_progress" | "closed";
    priority: "low" | "medium" | "high";
    created_at: string;
}

export function TicketList({ isAdmin = false }: { isAdmin?: boolean }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchTickets = async () => {
            const { data, error } = await supabase
                .from("support_tickets")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) {
                setTickets(data || []);
            }
            setIsLoading(false);
        };

        fetchTickets();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open": return "default"; // Black/White
            case "in_progress": return "secondary"; // Gray
            case "closed": return "outline"; // White/Border
            default: return "default";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "destructive"; // Red
            case "medium": return "secondary"; // Gray
            case "low": return "outline";
            default: return "outline";
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (tickets.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground mb-4">Henüz bir destek talebi bulunmuyor.</p>
                {!isAdmin && (
                    <Button asChild>
                        <Link href="/account/support/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Talep Oluştur
                        </Link>
                    </Button>
                )}
            </div>
        );
    }

    const linkPrefix = isAdmin ? "/admin/support" : "/account/support";

    return (
        <div className="space-y-4">
            {!isAdmin && (
                <div className="flex justify-end">
                    <Button asChild>
                        <Link href="/account/support/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Talep
                        </Link>
                    </Button>
                </div>
            )}

            <div className="grid gap-4">
                {tickets.map((ticket) => (
                    <Link key={ticket.id} href={`${linkPrefix}/${ticket.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold">{ticket.subject}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(ticket.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusColor(ticket.status) as any}>
                                        {ticket.status === "open" ? "Açık" : ticket.status === "in_progress" ? "İşlemde" : "Kapalı"}
                                    </Badge>
                                    <Badge variant={getPriorityColor(ticket.priority) as any}>
                                        {ticket.priority === "high" ? "Yüksek" : ticket.priority === "medium" ? "Orta" : "Düşük"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
