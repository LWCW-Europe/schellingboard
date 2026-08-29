import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, isAuthCookieValid } from "./auth";
import { unverifiedUserMessage, verifiedCurrentUser } from "./acting-guest";

// The action-layer analogue of requireAuth (utils/auth.ts), which takes a
// NextRequest and so can't be reached from a server action. Kept out of
// utils/auth.ts so the proxy's bundle doesn't pull in next/headers.
//
// Server actions are dispatched per route, so an action defined on a
// protected page is already unreachable without site auth — but that is a
// Next implementation detail, not a control this codebase owns. These
// helpers make every non-login action fail closed on its own.

export const NOT_AUTHENTICATED_ERROR = "Not authenticated";

/**
 * Throws unless the caller carries a valid site-auth cookie. Throws rather
 * than returning a result an action could forget to check: an unauthenticated
 * caller is never a state the UI renders, so there is nothing to report.
 */
export async function requireSiteAuth(): Promise<void> {
  const value = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!(await isAuthCookieValid(value))) {
    throw new Error(NOT_AUTHENTICATED_ERROR);
  }
}

/**
 * Site auth plus a guest the caller may actually act as, returning that
 * guest's id. For actions that disclose one guest's data to another:
 * SITE_PASSWORD is one secret shared with every attendee, so it separates the
 * event from the open web and nothing finer.
 */
export async function requireVerifiedGuest(task: string): Promise<string> {
  await requireSiteAuth();
  const cookieStore = await cookies();
  const guestId = await verifiedCurrentUser(cookieStore);
  if (!guestId) {
    throw new Error(await unverifiedUserMessage(cookieStore, task));
  }
  return guestId;
}
