import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const nonce = crypto.randomUUID();

    // CSP: Allow Self, Supabase, PayTR, Vercel
    // Note: 'unsafe-inline' and 'unsafe-eval' are often required for Next.js hydration and dev mode.
    // We prioritize functionality while restricting domains.
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.vercel-scripts.com https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.vercel.app;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co https://*.paytr.com https://vitals.vercel-insights.com;
    frame-src 'self' https://*.paytr.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
        .replace(/\s{2,}/g, " ")
        .trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspHeader);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Security Headers
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Frame-Options", "DENY"); // Clickjacking protection
    response.headers.set("X-Content-Type-Options", "nosniff"); // MIME sniffing protection
    response.headers.set("Referrer-Policy", "origin-when-cross-origin"); // Privacy
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()"); // Feature restrictions

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes, though headers are good there too, let's include API)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: "/((?!_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
