import { createGuestCookie, GUEST_COOKIE_NAME } from "@/utils/auth";

// Test helpers for building the single `guest` cookie value that the app sets
// for the current guest. See utils/auth.ts for the format.

/** Raw value for an unverified "open" name selection (unsigned, no secret). */
export function openGuestValue(guestId: string): string {
  return `open.${guestId}`;
}

/** Raw value for a verified (signed) session. Requires AUTH_SECRET to be set. */
export async function verifiedGuestValue(guestId: string): Promise<string> {
  return (await createGuestCookie(guestId, "verified")).value;
}

export { GUEST_COOKIE_NAME };
