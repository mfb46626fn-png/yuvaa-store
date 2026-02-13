import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

        if (profile?.role !== "admin") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const body = await req.json();
        const { status } = body;
        const ticketId = params.id;

        const { error } = await supabase
            .from("support_tickets")
            .update({ status })
            .eq("id", ticketId);

        if (error) {
            return new NextResponse("Error updating status", { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
