"use client";

import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/customers");
            if (!res.ok) {
                throw new Error(`Sunucu hatası: ${res.status}`);
            }
            const data = await res.json();
            setCustomers(data);
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
