"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type Order = {
    id: string;
    created_at: string;
    status: string;
    total: number;
    tracking_number?: string;
    carrier?: string;
    items?: any[]; // Simplified for list view
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    // Dialog & Return State
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [returnReason, setReturnReason] = useState("");
    const [isReturnSubmitting, setIsReturnSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error("Orders fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user, supabase]);

    const handleReturnSubmit = async () => {
        if (!user || !selectedOrderId || !returnReason) return;

        setIsReturnSubmitting(true);
        try {
            const { error } = await supabase.from("returns").insert({
                user_id: user.id,
                order_id: selectedOrderId,
                reason: returnReason,
                status: "pending",
            });

            if (error) throw error;

            toast.success("İade talebiniz oluşturuldu.");
            setIsDialogOpen(false);
            setReturnReason("");
            setSelectedOrderId(null);
        } catch (error) {
            console.error("Return submit error:", error);
            toast.error("İade talebi oluşturulamadı.");
        } finally {
            setIsReturnSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                    <PackageSearch className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Henüz siparişiniz yok</h3>
                <p className="text-muted-foreground mb-6">
                    Sipariş verdiğinizde burada listelenecektir.
                </p>
                <Button asChild>
                    <Link href="/products">Alışverişe Başla</Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Siparişlerim</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-card gap-4"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">#{order.id.slice(0, 8)}</span>
                                <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                                    {order.status === "delivered"
                                        ? "Teslim Edildi"
                                        : order.status === "shipping"
                                            ? "Kargoda"
                                            : "Hazırlanıyor"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(order.created_at), "d MMMM yyyy HH:mm", {
                                    locale: tr,
                                })}
                            </p>
                            <p className="font-medium">₺{order.total?.toLocaleString("tr-TR")}</p>
                        </div>

                        <div className="space-y-2 w-full md:w-auto">
                            {order.tracking_number && (
                                <div className="text-sm border p-2 rounded bg-muted/50">
                                    <span className="font-medium block text-xs uppercase text-muted-foreground">
                                        Kargo Takip
                                    </span>
                                    {order.carrier && <span className="mr-2 text-primary">{order.carrier}:</span>}
                                    <span className="font-mono">{order.tracking_number}</span>
                                </div>
                            )}

                            {order.status === "delivered" && (
                                <Dialog open={isDialogOpen && selectedOrderId === order.id} onOpenChange={(open) => {
                                    setIsDialogOpen(open);
                                    if (open) setSelectedOrderId(order.id);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full md:w-auto">
                                            İade Talebi Oluştur
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>İade Talebi</DialogTitle>
                                            <DialogDescription>
                                                #{order.id.slice(0, 8)} numaralı siparişiniz için iade nedeninizi belirtin.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Label htmlFor="reason" className="mb-2 block">
                                                İade Nedeni
                                            </Label>
                                            <Textarea
                                                id="reason"
                                                value={returnReason}
                                                onChange={(e) => setReturnReason(e.target.value)}
                                                placeholder="Ürün hasarlı, yanlış ürün geldi vb."
                                                className="resize-none h-32"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                                disabled={isReturnSubmitting}
                                            >
                                                İptal
                                            </Button>
                                            <Button onClick={handleReturnSubmit} disabled={isReturnSubmitting || !returnReason}>
                                                {isReturnSubmitting && (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Talebi Gönder
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
