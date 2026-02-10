"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, AlertTriangle, RotateCcw, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardStats = {
    totalSales: number;
    pendingOrders: number;
    lowStockProducts: number;
    pendingReturns: number;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        pendingReturns: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Sales
                const { data: salesData } = await supabase
                    .from("orders")
                    .select("total");

                const totalSales = salesData?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

                // 2. Pending Orders
                const { count: pendingOrders } = await supabase
                    .from("orders")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "pending");

                // 3. Low Stock
                const { count: lowStock } = await supabase
                    .from("products")
                    .select("*", { count: "exact", head: true })
                    .lt("inventory", 5);

                // 4. Pending Returns
                const { count: pendingReturns } = await supabase
                    .from("returns")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "pending");

                setStats({
                    totalSales: totalSales,
                    pendingOrders: pendingOrders || 0,
                    lowStockProducts: lowStock || 0,
                    pendingReturns: pendingReturns || 0,
                });
            } catch (error) {
                console.error("Dashboard stats error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [supabase]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Sales */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Satış</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">
                                ₺{stats.totalSales.toLocaleString("tr-TR")}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Genel ciro
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bekleyen Siparişler</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-10" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Kargolanmayı bekleyen
                        </p>
                    </CardContent>
                </Card>

                {/* Low Stock */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kritik Stok</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-10" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            5 adetten az kalanlar
                        </p>
                    </CardContent>
                </Card>

                {/* Returns */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">İade Talepleri</CardTitle>
                        <RotateCcw className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-10" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.pendingReturns}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Onay bekleyenler
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Future: Charts or Recent Sales */}
            </div>
        </div>
    );
}
