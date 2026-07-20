"use server";

import {
  verifyPassword,
  createAuthCookie,
  createLogoutCookie,
  createUserAuthLogoutCookie,
  userSelectionCookie,
  isPasswordProtectionEnabled,
  safeRedirectPath,
} from "@/utils/auth";
import { cookies } from "next/headers";

// Deliberately does not redirect(): see logoutAction below for why a
// server-action redirect is unsafe here — the (site) layout persists across
// it, so the destination can render from stale client-side state. The
// caller does a hard reload to `redirectTo` instead.
export async function loginAction(
  prevState: { error?: string; redirectTo?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  const redirectTo = safeRedirectPath(formData.get("redirect") as string, "/");

  if (!isPasswordProtectionEnabled()) {
    return { redirectTo };
  }

  if (!password) {
    return { error: "Password is required" };
  }

  if (verifyPassword(password)) {
    (await cookies()).set(await createAuthCookie());
    return { redirectTo };
  }

  return { error: "Invalid password" };
}

// The only identity exit: clears the site login and the guest identity
// (selection + verified session) together, so a shared device never hands
// off the previous person's name. Switching name is logout-then-select.
//
// Deliberately does not redirect(): a server-action redirect is a soft
// client-side transition, and the (site) layout that renders the header
// stays mounted across it, so Next can serve the "/" segment from its
// router cache instead of re-fetching — the page would still look
// authenticated (same events, same guests) until some later, unrelated
// navigation finally re-checks the cookie and bounces to /login. The
// caller forces a hard reload instead, which re-runs the site gate for
// real.
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set(createLogoutCookie());
  cookieStore.set(userSelectionCookie(null));
  cookieStore.set(createUserAuthLogoutCookie());
}
