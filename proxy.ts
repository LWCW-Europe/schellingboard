import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_DISABLED_MESSAGE,
  isAdminEnabled,
  requireAdminAuth,
  requireAuth,
} from "./utils/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page, health check, and auth API routes
  if (
    pathname === "/login" ||
    pathname === "/api/health" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  // Admin routes are independent of site auth: they require only admin
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
    return NextResponse.next();
  }

  // Check authentication for all other routes
  const authResponse = await requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  return NextResponse.next();
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
