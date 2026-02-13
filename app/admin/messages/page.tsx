"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Mail, Loader2, Eye } from "lucide-react";

interface ContactMessage {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'archived';
    created_at: string;
}

export default function AdminMessagesPage() {
    const [supabase] = useState(() => createClient());
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
        try {
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error: any) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function markAsRead(id: string) {
        try {
            const { error } = await supabase
                .from("contact_messages")
                .update({ status: 'read' })
                .eq('id', id);

            if (!error) {
                setMessages(prev => prev.map(msg =>
                    msg.id === id ? { ...msg, status: 'read' } : msg
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        if (message.status === 'new') {
            markAsRead(message.id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">İletişim Mesajları</h1>
                    <p className="text-muted-foreground">
                        Müşterilerden gelen iletişim formu mesajları.
                    </p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Durum</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Ad Soyad</TableHead>
                            <TableHead>Konu</TableHead>
                            <TableHead className="text-right">İşlem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Henüz mesaj yok.
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className={msg.status === 'new' ? 'bg-muted/30' : ''}>
                                    <TableCell>
                                        {msg.status === 'new' ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                Yeni
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                Okundu
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(msg.created_at), "d MMM yyyy HH:mm", { locale: tr })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{msg.first_name} {msg.last_name}</span>
                                            <span className="text-xs text-muted-foreground">{msg.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{msg.subject}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewMessage(msg)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Görüntüle
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <SheetContent className="overflow-y-auto w-full sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Mesaj Detayı</SheetTitle>
                        <SheetDescription>
                            Gönderim Tarihi: {selectedMessage && format(new Date(selectedMessage.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedMessage && (
                        <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-semibold">{selectedMessage.first_name} {selectedMessage.last_name}</div>
                                    <div className="text-sm text-muted-foreground">{selectedMessage.email}</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground">Konu</label>
                                <div className="text-base font-medium border-b pb-2">{selectedMessage.subject}</div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground">Mesaj</label>
                                <div className="p-4 bg-muted/20 rounded-md whitespace-pre-wrap text-sm leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
