import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_DISABLED_MESSAGE,
  ADMIN_VERIFIED_HEADER,
  isAdminEnabled,
  requireAdminAuth,
  requireAdminAuthApi,
  requireAuth,
} from "./utils/auth";

// Only requireAdminAuthApi may grant ADMIN_VERIFIED_HEADER (and only ever
// sets it to "1"); every other forwarded request must have any
// client-supplied copy of it removed so a route added outside /api/admin/*
// can never be tricked into trusting a forged value.
function forwardWithoutAdminHeader(request: NextRequest): NextResponse {
  const headers = new Headers(request.headers);
  headers.delete(ADMIN_VERIFIED_HEADER);
  return NextResponse.next({ request: { headers } });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page, health check, and auth API routes
  if (
    pathname === "/login" ||
    pathname === "/api/health" ||
    pathname.startsWith("/api/auth/")
  ) {
    return forwardWithoutAdminHeader(request);
  }

  // Admin UI routes are independent of site auth: they require only admin
  // authentication (and return 404 when the admin UI is disabled)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdminEnabled()) {
      return new NextResponse(ADMIN_DISABLED_MESSAGE, { status: 404 });
    }
    if (pathname !== "/admin/login") {
      const adminResponse = await requireAdminAuth(request);
      if (adminResponse) {
        return adminResponse;
      }
    }
    return forwardWithoutAdminHeader(request);
  }

  // Admin API routes are likewise independent of site auth: they require
  // only the admin cookie, checked here (route handlers trust the resulting
  // ADMIN_VERIFIED_HEADER instead of re-checking the cookie themselves).
  if (pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
    return requireAdminAuthApi(request);
  }

  // Check authentication for all other routes
  const authResponse = await requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  return forwardWithoutAdminHeader(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)",
  ],
};
