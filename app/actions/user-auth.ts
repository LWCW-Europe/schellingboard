"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { getRepositories } from "@/db/container";
import {
  createUserAuthCookie,
  createUserAuthLogoutCookie,
  isUserAuthCookieValidFor,
  userSelectionCookie,
  USER_AUTH_COOKIE_NAME,
} from "@/utils/auth";
import {
  AUTH_CODE_VALID_MINUTES,
  generateAuthCode,
  generateAuthCodeSalt,
  hashAuthCode,
  normalizeAuthCode,
  hashUserPassword,
  verifyUserPassword,
} from "@/utils/user-credentials";
import { isMailerConfigured, sendMail } from "@/utils/mailer";
import { siteUrl } from "@/utils/site-url";
import { authCodeEmail } from "@/emails/auth-code";
import { authSecurityChangedEmail } from "@/emails/auth-security-changed";

const REQUEST_THROTTLE_SECONDS = 60;
const MAX_CODE_ATTEMPTS = 10;

export type UserAuthResult =
  | { ok: true }
  // throttled: a recently emailed code is still valid — the UI may present
  // this as information rather than an error.
  | { ok: false; error: string; throttled?: boolean };
export type SelectUserResult =
  | { ok: true }
  // needsAuth: the guest is protected and the caller must present a
  // password or emailed code (loginAsGuestAction) instead.
  | { ok: false; needsAuth?: boolean; error: string };

async function setAuthenticatedIdentity(guestId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(userSelectionCookie(guestId));
  cookieStore.set(await createUserAuthCookie(guestId));
}

/**
 * Checks `input` against the guest's active emailed code, counting failed
 * attempts so the code dies after too many guesses. The code is multi-use
 * within its validity window: it is a temporary password, and consuming it
 * on first use would break "click the link, then type the same code into
 * the settings form".
 */
async function verifyCode(guestId: string, input: string): Promise<boolean> {
  const { authCodes } = getRepositories();
  const active = await authCodes.findActive(guestId, new Date());
  if (!active || active.attempts >= MAX_CODE_ATTEMPTS) return false;
  if (hashAuthCode(normalizeAuthCode(input), active.salt) === active.codeHash)
    return true;
  await authCodes.recordFailedAttempt(active.id);
  return false;
}

/** Emails the guest a temporary login code (link + typeable code). */
export async function requestAuthCodeAction(
  guestId: string
): Promise<UserAuthResult> {
  if (!isMailerConfigured()) {
    return {
      ok: false,
      error: "This server cannot send email, so codes are unavailable",
    };
  }
  const { guests, authCodes } = getRepositories();
  const guest = await guests.findById(guestId);
  if (!guest) {
    return { ok: false, error: "Unknown user" };
  }

  const now = new Date();
  const existing = await authCodes.findActive(guestId, now);
  if (
    existing &&
    now.getTime() - existing.createdAt.getTime() <
      REQUEST_THROTTLE_SECONDS * 1000
  ) {
    return {
      ok: false,
      throttled: true,
      error:
        "A code was emailed to you moments ago — check your inbox and spam folder",
    };
  }

  const code = generateAuthCode();
  const salt = generateAuthCodeSalt();
  await authCodes.replace({
    guestId,
    salt,
    codeHash: hashAuthCode(code, salt),
    createdAt: now,
    expiresAt: new Date(now.getTime() + AUTH_CODE_VALID_MINUTES * 60 * 1000),
  });

  const loginUrl = `${siteUrl()}/auth/login?guest=${encodeURIComponent(
    guestId
  )}&code=${encodeURIComponent(code)}`;
  try {
    await sendMail({
      to: guest.info.email,
      ...authCodeEmail({
        name: guest.name,
        code,
        loginUrl,
        validMinutes: AUTH_CODE_VALID_MINUTES,
      }),
    });
  } catch (err) {
    console.error("Failed to send auth code email:", err);
    return { ok: false, error: "The email could not be sent — try again" };
  }
  return { ok: true };
}

/**
 * Authenticates as a (protected) guest with either the permanent password
 * or a currently valid emailed code, and makes them the current user.
 */
export async function loginAsGuestAction(
  guestId: string,
  credential: string
): Promise<UserAuthResult> {
  const { guests } = getRepositories();
  const creds = await guests.getAuthCredentials(guestId);
  if (!creds) {
    return { ok: false, error: "Unknown user" };
  }
  const valid =
    (await verifyUserPassword(credential, creds.passwordHash)) ||
    (await verifyCode(guestId, credential));
  if (!valid) {
    return { ok: false, error: "Wrong password or code" };
  }
  await setAuthenticatedIdentity(guestId);
  return { ok: true };
}

/**
 * Switches the current user without credentials. Allowed for unprotected
 * guests, for a protected guest whose signed session cookie is still valid,
 * and for clearing the selection (null). Switching away from a protected
 * guest drops the authenticated session, so switching back requires
 * credentials again.
 */
export async function selectUserAction(
  guestId: string | null
): Promise<SelectUserResult> {
  const cookieStore = await cookies();
  if (guestId === null) {
    cookieStore.set(userSelectionCookie(null));
    cookieStore.set(createUserAuthLogoutCookie());
    return { ok: true };
  }

  const creds = await getRepositories().guests.getAuthCredentials(guestId);
  if (!creds) {
    return { ok: false, error: "Unknown user" };
  }
  if (creds.authProtected) {
    const authCookie = cookieStore.get(USER_AUTH_COOKIE_NAME)?.value;
    if (!(await isUserAuthCookieValidFor(guestId, authCookie))) {
      return {
        ok: false,
        needsAuth: true,
        error: "This name is protected — a password or emailed code is needed",
      };
    }
    cookieStore.set(userSelectionCookie(guestId));
    return { ok: true };
  }

  cookieStore.set(userSelectionCookie(guestId));
  cookieStore.set(createUserAuthLogoutCookie());
  return { ok: true };
}

const authSecuritySchema = z.object({
  credential: z
    .string()
    .trim()
    .min(1, { message: "Enter your password or the emailed code" }),
  protect: z.boolean(),
  newPassword: z
    .string()
    .min(8, { message: "Use at least 8 characters" })
    .max(200)
    .optional(),
});

/** Best-effort heads-up that protection was disabled or the password
 * changed. Never blocks the change it follows: a failed notification here
 * is exactly the SMTP dependency this step exists to remove. */
async function notifySecurityChange(
  guestId: string,
  change: "disabled" | "password-changed"
): Promise<void> {
  try {
    const guest = await getRepositories().guests.findById(guestId);
    if (!guest) return;
    await sendMail({
      to: guest.info.email,
      ...authSecurityChangedEmail({ name: guest.name, change }),
    });
  } catch (err) {
    console.error(
      `Failed to send security-change notification to ${guestId}:`,
      err
    );
  }
}

/**
 * Changes the current user's account security settings: enabling or
 * disabling protection, and setting or changing the password.
 *
 * Enabling protection is code-only, since it's the one operation that must
 * prove control of the address the recovery path depends on. Once a guest
 * is already protected, disabling protection or changing the password also
 * accepts the current permanent password in place of the code, so a broken
 * mailer never leaves protection stuck on — a notification email is sent to
 * the address on file for both, best-effort, so a change made this way
 * doesn't go unnoticed.
 */
export async function updateAuthSecurityAction(
  input: z.input<typeof authSecuritySchema>
): Promise<UserAuthResult>;

export async function updateAuthSecurityAction(
  input: unknown
): Promise<UserAuthResult> {
  const parsed = authSecuritySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const { credential, protect, newPassword } = parsed.data;

  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;
  if (!currentUser) {
    return { ok: false, error: "No user is selected" };
  }
  const { guests } = getRepositories();
  const creds = await guests.getAuthCredentials(currentUser);
  if (!creds) {
    return { ok: false, error: "Unknown user" };
  }
  const wasProtected = creds.authProtected;
  const verified =
    (await verifyCode(currentUser, credential)) ||
    (wasProtected &&
      (await verifyUserPassword(credential, creds.passwordHash)));
  if (!verified) {
    return { ok: false, error: "Wrong password or code" };
  }

  if (protect) {
    const passwordHash = newPassword
      ? await hashUserPassword(newPassword)
      : creds.passwordHash;
    // Sign the session cookie before flipping protection on: if signing
    // fails (e.g. AUTH_SECRET is missing), the guest must not be left
    // protected yet impossible to ever log in as.
    const authCookie = await createUserAuthCookie(currentUser);
    await guests.setAuthProtection(currentUser, {
      authProtected: true,
      passwordHash,
    });
    // The code or password proved control of the account, so this session
    // is authenticated from here on.
    cookieStore.set(userSelectionCookie(currentUser));
    cookieStore.set(authCookie);
    if (wasProtected && newPassword) {
      await notifySecurityChange(currentUser, "password-changed");
    }
  } else {
    await guests.setAuthProtection(currentUser, {
      authProtected: false,
      passwordHash: null,
    });
    cookieStore.set(createUserAuthLogoutCookie());
    if (wasProtected) {
      await notifySecurityChange(currentUser, "disabled");
    }
  }
  return { ok: true };
}
