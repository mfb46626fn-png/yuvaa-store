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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

type ReturnRequest = {
    id: string;
    created_at: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
    admin_note?: string;
    order_id: string;
    user_id: string;
};

export default function AdminReturnsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Resolve Dialog State
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [supabase] = useState(() => createClient());

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("returns")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReturns(data || []);
        } catch (error) {
            console.error("Returns fetch error:", error);
            toast.error("İade talepleri yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    };

    const openActionDialog = (ret: ReturnRequest, type: "approve" | "reject") => {
        setSelectedReturn(ret);
        setActionType(type);
        setAdminNote(""); // Clear previous note
        setIsDialogOpen(true);
    };

    const handleActionSubmit = async () => {
        if (!selectedReturn || !actionType) return;

        try {
            const newStatus = actionType === "approve" ? "approved" : "rejected";
            const { error } = await supabase
                .from("returns")
                .update({
                    status: newStatus,
                    admin_note: adminNote,
                })
                .eq("id", selectedReturn.id);

            if (error) throw error;

            toast.success(`İade talebi ${newStatus === "approved" ? "onaylandı" : "reddedildi"}.`);

            // Refresh local state
            setReturns(returns.map(r => r.id === selectedReturn.id ? { ...r, status: newStatus, admin_note: adminNote } : r));
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">İade Yönetimi</h1>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Talep Tarihi</TableHead>
                            <TableHead>Sipariş ID</TableHead>
                            <TableHead className="w-[300px]">Sebep</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {returns.map((ret) => (
                            <TableRow key={ret.id}>
                                <TableCell>
                                    {format(new Date(ret.created_at), "d MMM yyyy HH:mm", { locale: tr })}
                                </TableCell>
                                <TableCell className="font-mono">#{ret.order_id.slice(0, 8)}</TableCell>
                                <TableCell>
                                    <p className="text-sm line-clamp-2" title={ret.reason}>
                                        {ret.reason}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        ret.status === "approved" ? "default" :
                                            ret.status === "rejected" ? "destructive" : "secondary"
                                    }>
                                        {ret.status === "approved" ? "Onaylandı" :
                                            ret.status === "rejected" ? "Reddedildi" : "Bekliyor"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {ret.status === "pending" && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => openActionDialog(ret, "approve")}
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Onayla
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => openActionDialog(ret, "reject")}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reddet
                                            </Button>
                                        </div>
                                    )}
                                    {ret.status !== "pending" && (
                                        <span className="text-sm text-muted-foreground">İşlem tamamlandı</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "approve" ? "İadeyi Onayla" : "İadeyi Reddet"}
                        </DialogTitle>
                        <DialogDescription>
                            Bu işlem geri alınamaz. Müşteriye bildirim gönderilecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Müşteriye iletilecek not (Opsiyonel)"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            className="resize-none h-32"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                        <Button
                            variant={actionType === "reject" ? "destructive" : "default"}
                            onClick={handleActionSubmit}
                        >
                            {actionType === "approve" ? "Onayla ve İade Et" : "Reddet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
