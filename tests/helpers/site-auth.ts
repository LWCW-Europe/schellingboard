import { AUTH_COOKIE_NAME, createAuthCookie } from "@/utils/auth";

/**
 * Seeds a test's cookie jar with a valid site-auth cookie.
 *
 * Every server action that isn't deliberately pre-auth calls requireSiteAuth
 * (utils/action-auth.ts), and the test env sets SITE_PASSWORD, so a jar
 * without this fails the guard before the action under test ever runs.
 * Requires AUTH_SECRET to be stubbed first.
 */
export async function siteAuthenticate(
  jar: Map<string, string>
): Promise<void> {
  jar.set(AUTH_COOKIE_NAME, (await createAuthCookie()).value);
}
