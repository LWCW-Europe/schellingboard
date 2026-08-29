import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isAdminAuthenticated,
  isAuthCookieValid,
} from "./auth";

/**
 * The /media gate, applied twice: once in the proxy and again in each route
 * handler. The second check is what mirrors {@link requireProxyVerifiedAdmin}
 * for /api/admin — it makes these routes fail *closed* if the proxy ever stops
 * covering them: a matcher edit, a route moved, a middleware-bypass bug in
 * Next. All three of those went wrong at once before: the matcher exempted any
 * path ending in an image extension, media filenames are `<id>.<jpg|png|webp>`,
 * and the handlers had no check of their own — so every uploaded avatar,
 * location photo and site map was served without auth.
 *
 * Either cookie opens media: attendees hold the site cookie, and the admin UI
 * — which is independent of site auth (see proxy.ts) — previews the very
 * images it uploads. Unlike the admin API contract this re-reads the cookies
 * rather than trusting a proxy-set header, since attendees carry the site
 * cookie themselves and there is nothing cheaper to check.
 *
 * Answers 401 rather than redirecting to /login: an <img> that follows a
 * redirect to an HTML page renders a broken image either way, and a status the
 * browser reports is easier to diagnose. Returns null to let the request
 * through.
 */
export async function requireMediaAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (await isAuthCookieValid(cookie)) return null;
  if (await isAdminAuthenticated(request)) return null;

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "Cache-Control": "no-store" },
  });
}

// Uploads are immutable at a given URL: every save mints a fresh ?v=. Private
// so a shared cache can't hand one attendee's avatar to an unauthenticated
// stranger — the whole point of the gate above.
export const MEDIA_CACHE_CONTROL = "private, max-age=31536000, immutable";
