import { getRepositories } from "@/db/container";
import { readGuestCookie, GUEST_COOKIE_NAME } from "./auth";

// Server-side enforcement for guest account security (issue #370): a request
// acting as an auth-protected guest must carry that guest's signed, verified
// guest cookie. Unprotected guests stay freely impersonable by design.
//
// Kept separate from utils/auth.ts because these helpers hit the database.

/**
 * Whether a request carrying `guestCookieValue` may act as `guestId`.
 * True for unprotected and unknown guests — existence checks and their
 * error responses stay with the caller. A protected guest is honoured only
 * when the cookie is a "verified" proof issued for exactly that guest.
 */
export async function isVerifiedAsGuest(
  guestId: string,
  guestCookieValue: string | undefined
): Promise<boolean> {
  const creds = await getRepositories().guests.getAuthCredentials(guestId);
  if (!creds || !creds.authProtected) return true;
  const parsed = await readGuestCookie(guestCookieValue);
  return parsed?.guestId === guestId && parsed.level === "verified";
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
  return isVerifiedAsGuest(guestId, requestCookie(req, GUEST_COOKIE_NAME));
}

type ReadonlyCookies = {
  get(name: string): { value: string } | undefined;
};

/**
 * The current user id from the guest cookie, for server components and
 * actions — but null when that guest is protected and the cookie isn't a
 * verified proof, so an unauthenticated visitor can't act (or render private
 * state) as a protected guest merely by forging an "open" selection cookie.
 */
export async function verifiedCurrentUser(
  cookieStore: ReadonlyCookies
): Promise<string | null> {
  const value = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  const parsed = await readGuestCookie(value);
  if (!parsed) return null;
  return (await isVerifiedAsGuest(parsed.guestId, value))
    ? parsed.guestId
    : null;
}

/**
 * The selected guest id regardless of verification, or null if none is
 * selected. Use only to tell "no name selected" apart from "a protected name
 * selected but not yet verified" — never to authorize acting as the guest
 * (use verifiedCurrentUser for that).
 */
export async function currentGuestSelection(
  cookieStore: ReadonlyCookies
): Promise<string | null> {
  const parsed = await readGuestCookie(
    cookieStore.get(GUEST_COOKIE_NAME)?.value
  );
  return parsed?.guestId ?? null;
}

/**
 * What to tell a visitor that {@link verifiedCurrentUser} refused. It returns
 * null both when no name is selected and when the selected name is protected
 * without a verified session (protection enabled from another device), and the
 * two need different advice: being told to pick a name you have already picked
 * helps nobody. Kept here, like NAME_PROTECTED_ERROR, so the copy can't drift
 * across the pages that make this check. `task` completes "before …", e.g.
 * "changing your settings".
 */
export async function unverifiedUserMessage(
  cookieStore: ReadonlyCookies,
  task: string
): Promise<string> {
  if (await currentGuestSelection(cookieStore)) {
    return `This name is protected. Switch to it with your password or emailed code — via the name chip in the header — before ${task}.`;
  }
  return `You need to select who you are before ${task}. Pick your name via the “Select your name” chip in the header at the top of the page.`;
}

/**
 * True unless the guest cookie claims a protected guest without a verified
 * proof. Unlike verifiedCurrentUser, an absent cookie doesn't fail this
 * check — there's no protected identity being claimed, so there's nothing to
 * verify. For creation endpoints, which have no existing object to check
 * ownership against.
 */
export async function actingUserIsVerified(
  cookieStore: ReadonlyCookies
): Promise<boolean> {
  const value = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  const parsed = await readGuestCookie(value);
  if (!parsed) return true;
  return isVerifiedAsGuest(parsed.guestId, value);
}
