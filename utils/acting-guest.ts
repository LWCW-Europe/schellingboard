import { getRepositories } from "@/db/container";
import { isUserAuthCookieValidFor, USER_AUTH_COOKIE_NAME } from "./auth";

// Server-side enforcement for guest account security (issue #370): a request
// acting as an auth-protected guest must carry that guest's signed session
// cookie. Unprotected guests stay freely impersonable by design.
//
// Kept separate from utils/auth.ts because these helpers hit the database.

/**
 * Whether a request carrying `authCookieValue` may act as `guestId`.
 * True for unprotected and unknown guests — existence checks and their
 * error responses stay with the caller.
 */
export async function isVerifiedAsGuest(
  guestId: string,
  authCookieValue: string | undefined
): Promise<boolean> {
  const creds = await getRepositories().guests.getAuthCredentials(guestId);
  if (!creds || !creds.authProtected) return true;
  return isUserAuthCookieValidFor(guestId, authCookieValue);
}

// Shared 403 body for writes attempted as a protected guest without a
// verified session, kept in one place so the copy can't drift across routes.
export const NAME_PROTECTED_ERROR =
  "This name is protected — switch to it with your password or emailed code first";

/** 403 response for an unverified write acting as a protected guest. */
export function guestProtectionError(): Response {
  return Response.json({ error: NAME_PROTECTED_ERROR }, { status: 403 });
}

/** Cookie-header parsing that works for plain `Request` route handlers. */
function requestCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq > -1 && part.slice(0, eq) === name) {
      const raw = part.slice(eq + 1);
      // A client-forged cookie can carry malformed percent-encoding; fall
      // back to the raw value rather than throwing (it won't verify anyway).
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return undefined;
}

export async function isRequestVerifiedAsGuest(
  req: Request,
  guestId: string
): Promise<boolean> {
  return isVerifiedAsGuest(guestId, requestCookie(req, USER_AUTH_COOKIE_NAME));
}

type ReadonlyCookies = {
  get(name: string): { value: string } | undefined;
};

/**
 * The current user id from the `user` cookie, for server components and
 * actions — but null when that guest is protected and the session isn't
 * verified, so an unauthenticated visitor can't act (or render private
 * state) as a protected guest merely by setting the plain cookie.
 */
export async function verifiedCurrentUser(
  cookieStore: ReadonlyCookies
): Promise<string | null> {
  const currentUser = cookieStore.get("user")?.value;
  if (!currentUser) return null;
  const verified = await isVerifiedAsGuest(
    currentUser,
    cookieStore.get(USER_AUTH_COOKIE_NAME)?.value
  );
  return verified ? currentUser : null;
}
