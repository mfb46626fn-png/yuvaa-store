import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        // Verify admin access
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check admin role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch all profiles using server client (bypasses RLS for service role, or uses admin's session)
        const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, email, full_name, phone, created_at")
            .order("created_at", { ascending: false });

        if (profilesError) {
            console.error("Profiles fetch error:", profilesError);
            return NextResponse.json({ error: profilesError.message }, { status: 500 });
        }

        // Fetch order summaries
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("user_id, total");

        if (ordersError) {
            console.error("Orders fetch error:", ordersError);
        }

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

        const enrichedCustomers = (profiles || []).map((p) => ({
            ...p,
            order_count: orderMap.get(p.id)?.count || 0,
            total_spent: orderMap.get(p.id)?.total || 0,
        }));

        return NextResponse.json(enrichedCustomers);
    } catch (error) {
        console.error("Customers API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
