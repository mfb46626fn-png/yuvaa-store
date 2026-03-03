"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendOrderStatusEmail } from "@/lib/resend";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createServerSupabaseClient();

    // 1. Get the order to find the user_id
    const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("user_id, status")
        .eq("id", orderId)
        .single();

    if (fetchError || !order) {
        throw new Error("Sipariş bulunamadı");
    }

    // 2. Update the status
    const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (updateError) {
        throw new Error("Sipariş güncellenemedi");
    }

    // 3. Get user email and send notification
    if (order.user_id) {
        // Need to get email from auth.users or profiles (if email is stored there).
        // Since admin might not have access to auth.users easily without service role, 
        // we assume profiles table might have it, or we use a secure RPC.
        // For simplicity in this demo, if you have user's email accessible:

        // As a workaround, we can fetch the profile email
        const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", order.user_id)
            .single();

        if (profile?.email) {
            await sendOrderStatusEmail(orderId, profile.email, newStatus);
        }
    }

    return { success: true };
}

export async function updateOrderShipping(
    orderId: string,
    trackingNumber: string,
    carrier: string
) {
    const supabase = await createServerSupabaseClient();

    const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .single();

    if (fetchError || !order) throw new Error("Sipariş bulunamadı");

    const { error: updateError } = await supabase
        .from("orders")
        .update({
            status: "shipped",
            tracking_number: trackingNumber,
            carrier: carrier,
        })
        .eq("id", orderId);

    if (updateError) throw new Error("Kargo güncellenemedi");

    if (order.user_id) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", order.user_id)
            .single();

        if (profile?.email) {
            await sendOrderStatusEmail(orderId, profile.email, "shipped");
        }
    }

    return { success: true };
}
