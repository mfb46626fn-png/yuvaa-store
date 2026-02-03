import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // 1. Initialize response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 2. Wrap everything in try-catch to prevent 500 crashes
    try {
        // Safe check for env vars
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn("Middleware: Missing Supabase Environment Variables");
            return response;
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // 3. Auth Check
        // Using getUser() which validates the auth token against the database
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            // If auth error (e.g. invalid token), just ignore and proceed as logged out
            // Do not throw!
            // console.warn("Supabase Auth Error:", error.message);
        }

        const path = request.nextUrl.pathname;

        // 4. Protected Routes
        if (path.startsWith("/account")) {
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        if (path.startsWith("/admin")) {
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }

            // Check Profile/Role
            // We do this inside try-catch. If it fails, user might access admin blindly
            // but Page-level RLS will stop them anyway.
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile?.role !== "admin") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

    } catch (e) {
        // CRITICAL: Catch any other runtime error and log it, but DO NOT CRASH.
        console.error("Middleware Runtime Error:", e);
        // Fallback: Allow request to proceed (Fail Open) or Redirect to error page?
        // Proceeding is safer for the main site availability.
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
