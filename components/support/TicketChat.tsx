"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    message: string;
    created_at: string;
    sender_id: string;
    is_admin_reply: boolean;
}

interface TicketChatProps {
    ticketId: string;
    isAdminView?: boolean;
    ticketStatus: string;
}

export function TicketChat({ ticketId, isAdminView = false, ticketStatus }: TicketChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const supabase = createClient();
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("support_messages")
                .select("*")
                .eq("ticket_id", ticketId)
                .order("created_at", { ascending: true });

            setMessages(data || []);
            setIsLoading(false);
        };

        fetchMessages();

        // Realtime subscription
        const channel = supabase
            .channel(`ticket_chat_${ticketId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "support_messages",
                    filter: `ticket_id=eq.${ticketId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const response = await fetch(`/api/support/tickets/${ticketId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: newMessage }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setNewMessage("");
            router.refresh();
        } catch (error) {
            toast.error("Mesaj gönderilemedi");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-background">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => {
                    const isMe = isAdminView ? msg.is_admin_reply : !msg.is_admin_reply;

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-2 max-w-[80%]",
                                isMe ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className={cn(
                                    "text-xs",
                                    msg.is_admin_reply ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    {msg.is_admin_reply ? "A" : "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "rounded-lg p-3 text-sm",
                                isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                            )}>
                                <p>{msg.message}</p>
                                <p className={cn(
                                    "text-[10px] mt-1 opacity-70",
                                    isMe ? "text-primary-foreground" : "text-muted-foreground"
                                )}>
                                    {format(new Date(msg.created_at), "HH:mm", { locale: tr })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/10">
                {ticketStatus === "closed" ? (
                    <div className="text-center text-muted-foreground py-2 text-sm bg-muted/20 rounded">
                        Bu destek talebi kapatılmıştır. Yeni bir mesaj gönderemezsiniz.
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Mesajınızı yazın..."
                            className="min-h-[50px] max-h-[150px]"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={isSending || !newMessage.trim()}
                            className="h-auto"
                        >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
