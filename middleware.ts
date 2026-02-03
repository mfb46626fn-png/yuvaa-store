import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // TEMPORARY DEBUG: Disable all logic to test if site loads
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
