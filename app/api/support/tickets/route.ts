import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { sendTicketCreatedEmail } from "@/lib/resend";

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { subject, message, priority } = body;

        if (!subject || !message) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // 1. Create Ticket
        const { data: ticket, error: ticketError } = await supabase
            .from("support_tickets")
            .insert({
                user_id: session.user.id,
                subject,
                priority: priority || "medium",
                status: "open"
            })
            .select()
            .single();

        if (ticketError) {
            console.error("Ticket creation error:", ticketError);
            return new NextResponse("Error creating ticket", { status: 500 });
        }

        // 2. Create Initial Message
        const { error: messageError } = await supabase
            .from("support_messages")
            .insert({
                ticket_id: ticket.id,
                sender_id: session.user.id,
                message,
                is_admin_reply: false
            });

        if (messageError) {
            console.error("Message creation error:", messageError);
            return new NextResponse("Error creating message", { status: 500 });
        }

        // 3. Send Email Notification
        // Fetch user email for notification
        const { data: user } = await supabase.auth.getUser();
        if (user.user?.email) {
            await sendTicketCreatedEmail(ticket.id, user.user.email, subject, message);
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Internal error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
