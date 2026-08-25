import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "./auth";

// The admin gate for server actions and server components — the counterpart to
// utils/acting-guest.ts. Kept out of utils/auth.ts because the proxy imports
// that module, and next/headers isn't available there; the proxy's own
// equivalent is isAdminAuthenticated(request).

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}
