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
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

type Customer = {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    created_at: string;
    order_count?: number;
    total_spent?: number;
};

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            // Fetch profiles
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("id, email, full_name, phone, created_at")
                .order("created_at", { ascending: false });

            if (profilesError) throw profilesError;

            // Fetch order summaries per user
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("user_id, total");

            if (ordersError) throw ordersError;

            // Aggregate orders per user
            const orderMap = new Map<string, { count: number; total: number }>();
            (orders || []).forEach((order) => {
                if (!order.user_id) return;
                const existing = orderMap.get(order.user_id) || { count: 0, total: 0 };
                orderMap.set(order.user_id, {
                    count: existing.count + 1,
                    total: existing.total + (order.total || 0),
                });
            });

            const enrichedCustomers: Customer[] = (profiles || []).map((profile) => ({
                ...profile,
                order_count: orderMap.get(profile.id)?.count || 0,
                total_spent: orderMap.get(profile.id)?.total || 0,
            }));

            setCustomers(enrichedCustomers);
        } catch (error) {
            console.error("Customers fetch error:", error);
            toast.error("Müşteriler yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCustomers = customers.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
            (c.full_name || "").toLowerCase().includes(q) ||
            (c.email || "").toLowerCase().includes(q) ||
            (c.phone || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Müşteriler</h1>
                <Badge variant="secondary" className="text-sm">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {customers.length} kayıtlı müşteri
                </Badge>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="İsim, e-posta veya telefon ara..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>E-posta</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead className="text-center">Sipariş</TableHead>
                            <TableHead className="text-right">Toplam Harcama</TableHead>
                            <TableHead className="text-right">Kayıt Tarihi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Yükleniyor...
                                </TableCell>
                            </TableRow>
                        ) : filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    {searchQuery ? "Aramanızla eşleşen müşteri bulunamadı." : "Henüz kayıtlı müşteri yok."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        {customer.full_name || <span className="text-muted-foreground italic">İsimsiz</span>}
                                    </TableCell>
                                    <TableCell className="text-sm">{customer.email}</TableCell>
                                    <TableCell className="text-sm">
                                        {customer.phone || <span className="text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{customer.order_count}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ₺{(customer.total_spent || 0).toLocaleString("tr-TR")}
                                    </TableCell>
                                    <TableCell className="text-right text-sm text-muted-foreground">
                                        {format(new Date(customer.created_at), "d MMM yyyy", { locale: tr })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
