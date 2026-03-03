import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { event_type, session_id, event_data, path, user_id } = body;

        if (!event_type || !session_id) {
            return NextResponse.json(
                { error: "event_type and session_id are required" },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Log event to analytics_events table
        const { error } = await supabase
            .from("analytics_events")
            .insert([
                {
                    event_type,
                    session_id,
                    user_id: user_id || null, // Optional
                    event_data: event_data || {},
                    path: path || ""
                }
            ]);

        if (error) {
            console.error("Analytics Error [DB Insert]:", error);
            return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Analytics Error [Server]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
