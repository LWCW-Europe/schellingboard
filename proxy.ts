import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_DISABLED_MESSAGE,
  ADMIN_VERIFIED_HEADER,
  isAdminEnabled,
  requireAdminAuth,
  requireAdminAuthApi,
  requireAuth,
} from "./utils/auth";
import { requireMediaAuth } from "./utils/media-auth";

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
  // ADMIN_VERIFIED_HEADER instead of re-checking the cookie themselves, but
  // do require its presence — see requireProxyVerifiedAdmin).
  if (pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
    return requireAdminAuthApi(request);
  }

  // Uploaded images are shown to attendees and previewed in the admin UI, so
  // either cookie opens them; the route handlers apply the same rule again.
  if (pathname.startsWith("/media/")) {
    const mediaResponse = await requireMediaAuth(request);
    return mediaResponse ?? forwardWithoutAdminHeader(request);
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
     * Everything except an explicit list of what must stay public:
     * - _next/static — build output, no user data
     * - _next/image  — dead under the custom loader (it 404s, see
     *                  next.config.js), and build assets either way
     * - the three icons app/layout.tsx loads, which the login page needs
     *   before anyone has a cookie
     * - locations/  — the seeded room photos in public/, which the admin UI
     *   renders with the admin cookie alone (uploads live under /media)
     *
     * This deliberately does NOT exempt paths by file extension. It used to,
     * and since media filenames are `<id>.<jpg|png|webp>` that exempted every
     * uploaded avatar, location image and site map from auth entirely — see
     * matcher's own test at tests/unit/proxy-matcher.test.ts.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png|locations/).*)",
  ],
};
