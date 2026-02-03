import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        // SAFETY CHECK: If env vars are missing, just pass through.
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            // Only log in development to keep logs clean in prod if desirable, or warn
            return response;
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

        // This call is vital for refreshing auth tokens
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // 1. Protect /account routes
        if (request.nextUrl.pathname.startsWith("/account")) {
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // 2. Protect /admin routes
        if (request.nextUrl.pathname.startsWith("/admin")) {
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
            // Skipping role check for now in middleware to reduce complexity/DB calls on edge
            // Role check is also done in the page component/layout securely.
            // But we can keep it if stable. Let's keep it simple first.
        }

        return response;
    } catch (e) {
        console.error("Middleware Error:", e);
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
