"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Loader2, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type ReturnRequest = {
    id: string;
    order_id: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
    admin_note?: string;
    created_at: string;
};

export default function ReturnsPage() {
    const { user } = useAuth();
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        const fetchReturns = async () => {
            try {
                const { data, error } = await supabase
                    .from("returns")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setReturns(data || []);
            } catch (error) {
                console.error("Returns fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReturns();
    }, [user, supabase]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (returns.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                    <RotateCcw className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">İade talebiniz bulunmuyor</h3>
                <p className="text-muted-foreground">
                    Oluşturduğunuz iade talepleri burada listelenir.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">İade Taleplerim</h2>
            <div className="space-y-4">
                {returns.map((ret) => (
                    <div
                        key={ret.id}
                        className="p-4 border rounded-lg bg-card space-y-3"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">Sipariş: #{ret.order_id.slice(0, 8)}</span>
                                    <Badge
                                        variant={
                                            ret.status === "approved"
                                                ? "default"
                                                : ret.status === "rejected"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {ret.status === "approved"
                                            ? "Onaylandı"
                                            : ret.status === "rejected"
                                                ? "Reddedildi"
                                                : "İnceleniyor"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(ret.created_at), "d MMMM yyyy HH:mm", {
                                        locale: tr,
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded text-sm">
                            <span className="font-medium text-foreground block mb-1">İade Nedeni:</span>
                            {ret.reason}
                        </div>

                        {ret.admin_note && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded text-sm border border-blue-100 dark:border-blue-900/30">
                                <span className="font-medium text-blue-700 dark:text-blue-400 block mb-1">
                                    Mağaza Yanıtı:
                                </span>
                                {ret.admin_note}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
