"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Truck, Eye } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

type Order = {
    id: string;
    created_at: string;
    status: string; // 'pending', 'processing', 'shipping', 'delivered', 'cancelled'
    total: number;
    tracking_number?: string;
    carrier?: string;
    full_name?: string; // from profiles join or metadata
    user_id?: string;
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    // Shipping Update State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [carrier, setCarrier] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            // Fetch orders. In real app, join with profiles to get name.
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Orders fetch error:", error);
            toast.error("Siparişler yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const updateData: any = { status: newStatus };

            // Allow basic status changes directly. For 'shipping', we use the sheet.
            const { error } = await supabase
                .from("orders")
                .update(updateData)
                .eq("id", orderId);

            if (error) throw error;

            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Sipariş durumu güncellendi: ${newStatus}`);
        } catch (error) {
            toast.error("Güncelleme başarısız.");
        }
    };

    const handleShippingSubmit = async () => {
        if (!selectedOrder) return;

        try {
            const { error } = await supabase
                .from("orders")
                .update({
                    status: "shipping",
                    tracking_number: trackingNumber,
                    carrier: carrier,
                })
                .eq("id", selectedOrder.id);

            if (error) throw error;

            toast.success("Sipariş kargoya verildi olarak işaretlendi.");
            fetchOrders(); // Refresh to show new data
            setIsSheetOpen(false);
            setTrackingNumber("");
            setCarrier("");
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    const openShippingSheet = (order: Order) => {
        setSelectedOrder(order);
        setTrackingNumber(order.tracking_number || "");
        setCarrier(order.carrier || "");
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sipariş Yönetimi</h1>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sipariş ID</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">Tutar</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono">#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                    {format(new Date(order.created_at), "d MMM yyyy HH:mm", { locale: tr })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        order.status === "delivered" ? "default" :
                                            order.status === "shipping" ? "secondary" :
                                                order.status === "cancelled" ? "destructive" : "outline"
                                    }>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    ₺{order.total?.toLocaleString("tr-TR")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Menü</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                                                ID Kopyala
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "processing")}>
                                                Hazırlanıyor
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openShippingSheet(order)}>
                                                <Truck className="mr-2 h-4 w-4" />
                                                Kargola
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "delivered")}>
                                                Teslim Edildi
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleStatusUpdate(order.id, "cancelled")}>
                                                İptal Et
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Shipping Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Kargo Girişi</SheetTitle>
                        <SheetDescription>
                            Sipariş #{selectedOrder?.id.slice(0, 8)} için kargo bilgilerini girin.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="carrier">Kargo Firması</Label>
                            <Input
                                id="carrier"
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                placeholder="Yurtiçi Kargo, Aras..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tracking">Takip Numarası</Label>
                            <Input
                                id="tracking"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="1234567890"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>İptal</Button>
                        <Button onClick={handleShippingSubmit}>Kaydet ve Kargola</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
