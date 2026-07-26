"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { getRepositories } from "@/db/container";
import type { AuthCode, AuthCodePurpose } from "@/db/repositories/interfaces";
import {
  createGuestCookie,
  createGuestLogoutCookie,
  readGuestCookie,
  GUEST_COOKIE_NAME,
} from "@/utils/auth";
import {
  AUTH_CODE_VALID_MINUTES,
  MAX_CODE_ATTEMPTS,
  RESET_TOKEN_VALID_MINUTES,
  generateAuthCode,
  generateAuthCodeSalt,
  generateResetToken,
  hashAuthCode,
  isAuthCodeShaped,
  normalizeAuthCode,
  hashUserPassword,
  verifyUserPassword,
} from "@/utils/user-credentials";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import {
  TOO_MANY_ATTEMPTS_ERROR,
  isLoginBlocked,
  recordLoginFailure,
} from "@/utils/login-rate-limit";
import { isMailerConfigured, sendMail } from "@/utils/mailer";
import { siteUrl } from "@/utils/site-url";
import { authCodeEmail } from "@/emails/auth-code";
import { authPasswordResetEmail } from "@/emails/auth-password-reset";
import { authSecurityChangedEmail } from "@/emails/auth-security-changed";

const REQUEST_THROTTLE_SECONDS = 60;

export type UserAuthResult =
  | { ok: true }
  // throttled: a recently emailed token is still valid — the UI may present
  // this as information rather than an error.
  | { ok: false; error: string; throttled?: boolean };
export type SelectUserResult =
  | { ok: true }
  // needsAuth: the guest is protected and the caller must present a
  // password or emailed code (loginAsGuestAction) instead.
  | { ok: false; needsAuth?: boolean; error: string };

const newPasswordSchema = z
  .string()
  .min(8, { message: "Use at least 8 characters" })
  .max(200);

async function setAuthenticatedIdentity(guestId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(await createGuestCookie(guestId, "verified"));
}

/**
 * Returns the guest's active token of `purpose` if `input` matches it, or null
 * otherwise — counting a failed guess at a login code so it dies after
 * MAX_CODE_ATTEMPTS tries. The caller is responsible for consuming a returned
 * token: matching alone changes nothing, so a match never replays.
 *
 * Login codes are hand-typed, so case and stray whitespace are forgiven; reset
 * tokens travel only inside a link and are matched verbatim.
 */
async function matchToken(
  guestId: string,
  purpose: AuthCodePurpose,
  input: string
): Promise<AuthCode | null> {
  const { authCodes } = getRepositories();
  const active = await authCodes.findActive(guestId, purpose, new Date());
  if (!active || active.attempts >= MAX_CODE_ATTEMPTS) return null;
  const candidate =
    purpose === "login" ? normalizeAuthCode(input) : input.trim();
  if (hashAuthCode(candidate, active.salt) === active.codeHash) return active;
  // Only login codes are metered. A reset token carries 256 bits, so guessing
  // it is infeasible and counting the guesses buys nothing — while retiring it
  // after a bounded number of tries would hand anyone who knows a guest id a
  // way to knock out the link that guest was just emailed.
  if (purpose !== "login") return null;
  // A login code shares one input field with the permanent password, so only
  // input that could have been a code counts as a guess at it — otherwise a
  // guest fumbling their password would burn the code they were emailed.
  if (!isAuthCodeShaped(candidate)) return null;
  await authCodes.recordFailedAttempt(active.id);
  if (active.attempts + 1 === MAX_CODE_ATTEMPTS) {
    console.warn(
      `Login code of guest ${guestId} hit the guess cap — retiring it`
    );
  }
  return null;
}

/**
 * The token of `purpose` emailed within the throttle window, if one is still
 * valid. Null means a fresh one should be emailed.
 *
 * A login code whose guess cap is spent still counts as recently issued:
 * replacing it on demand would let anyone who knows a guest name mint a new
 * code (and a new guess budget, and a new email to that guest) every
 * MAX_CODE_ATTEMPTS tries, which is both an unbounded oracle again and an inbox
 * flood. The guest waits out the window instead, and is told the code is spent
 * rather than sent to their inbox for one that can no longer work.
 */
async function recentlyIssued(
  guestId: string,
  purpose: AuthCodePurpose,
  now: Date
): Promise<AuthCode | null> {
  const existing = await getRepositories().authCodes.findActive(
    guestId,
    purpose,
    now
  );
  if (
    !existing ||
    now.getTime() - existing.createdAt.getTime() >=
      REQUEST_THROTTLE_SECONDS * 1000
  ) {
    return null;
  }
  return existing;
}

/** Whether `token` has no guesses left, so only a replacement can help. */
function isSpent(token: AuthCode): boolean {
  return token.attempts >= MAX_CODE_ATTEMPTS;
}

/** Emails the guest a single-use login code (link + typeable code). */
export async function requestLoginCodeAction(
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
  const recent = await recentlyIssued(guestId, "login", now);
  if (recent) {
    // A spent code is not `throttled`: nothing usable is waiting in the inbox,
    // so this is a plain failure rather than reassurance.
    return isSpent(recent)
      ? {
          ok: false,
          error:
            "Too many wrong codes were entered, so the one you were emailed is used up — ask for a new one in a minute",
        }
      : {
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
    purpose: "login",
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
    console.error("Failed to send login code email:", err);
    return { ok: false, error: "The email could not be sent — try again" };
  }
  return { ok: true };
}

/**
 * Emails the guest a single-use link to set a new password. Used both to enable
 * protection (set the first password) and to recover a forgotten one — either
 * way, clicking it proves control of the address on file, which is what stops
 * anyone else from claiming a name. The link grants no session on its own.
 */
export async function requestPasswordLinkAction(
  guestId: string
): Promise<UserAuthResult> {
  if (!isMailerConfigured()) {
    return {
      ok: false,
      error: "This server cannot send email, so password links are unavailable",
    };
  }
  const { guests, authCodes } = getRepositories();
  const guest = await guests.findById(guestId);
  if (!guest) {
    return { ok: false, error: "Unknown user" };
  }

  const now = new Date();
  if (await recentlyIssued(guestId, "reset", now)) {
    return {
      ok: false,
      throttled: true,
      error:
        "A link was emailed to you moments ago — check your inbox and spam folder",
    };
  }

  const token = generateResetToken();
  const salt = generateAuthCodeSalt();
  await authCodes.replace({
    guestId,
    purpose: "reset",
    salt,
    codeHash: hashAuthCode(token, salt),
    createdAt: now,
    expiresAt: new Date(now.getTime() + RESET_TOKEN_VALID_MINUTES * 60 * 1000),
  });

  const resetUrl = `${siteUrl()}/auth/reset?guest=${encodeURIComponent(
    guestId
  )}&token=${encodeURIComponent(token)}`;
  try {
    await sendMail({
      to: guest.info.email,
      ...authPasswordResetEmail({
        name: guest.name,
        resetUrl,
        validMinutes: RESET_TOKEN_VALID_MINUTES,
      }),
    });
  } catch (err) {
    console.error("Failed to send password link email:", err);
    return { ok: false, error: "The email could not be sent — try again" };
  }
  return { ok: true };
}

/**
 * Authenticates as a (protected) guest with either the permanent password or a
 * currently valid emailed login code, and makes them the current user. A code
 * is consumed on success, so it can never be replayed — it grants a session but
 * never changes credentials.
 *
 * The password path is rate limited per guest: after too many failures the
 * password is refused for a while even if right. The emailed-code path stays
 * open, so an attacker hammering someone's password can't lock the real person
 * out — they get in by proving inbox access. Guessing at the code instead costs
 * its owner only a wait, since a spent code is replaced once the request
 * throttle lapses (see MAX_CODE_ATTEMPTS and recentlyIssued) — not nothing,
 * though: an attacker willing to keep spending 100 guesses a minute can hold
 * the code path shut for as long as they keep it up. Countering that needs
 * defences this app doesn't have (a CAPTCHA, a real IP reputation store); the
 * reset link, which is never metered, stays open meanwhile. Both escape hatches
 * need a configured mailer; without one the password lockout is the whole
 * story.
 */
export async function loginAsGuestAction(
  guestId: string,
  credential: string
): Promise<UserAuthResult> {
  const { guests, authCodes } = getRepositories();
  const creds = await guests.getAuthCredentials(guestId);
  if (!creds) {
    return { ok: false, error: "Unknown user" };
  }
  const passwordBlocked = isLoginBlocked("guest", guestId);
  if (
    !passwordBlocked &&
    (await verifyUserPassword(credential, creds.passwordHash))
  ) {
    await setAuthenticatedIdentity(guestId);
    return { ok: true };
  }
  const matched = await matchToken(guestId, "login", credential);
  if (matched) {
    await authCodes.consume(matched.id);
    await setAuthenticatedIdentity(guestId);
    return { ok: true };
  }
  recordLoginFailure("guest", guestId);
  if (!passwordBlocked) {
    return { ok: false, error: "Wrong password or code" };
  }
  // The generic lockout message would be a lie here: only the *password* is
  // refused, and an emailed code gets in throughout — which is the whole point
  // of the lockout not being an account lockout. Say so, unless this server
  // can't send the mail that would make it true.
  return {
    ok: false,
    error: isMailerConfigured()
      ? "Too many failed attempts — the password won't work for a few minutes, but a code emailed to you still will"
      : TOO_MANY_ATTEMPTS_ERROR,
  };
}

/**
 * Sets a new password from a valid reset link and turns protection on. Proves
 * nothing but control of the emailed link, so it deliberately does NOT create a
 * session: the guest logs in with the new password afterwards. Consumes the
 * token so the link works once. If the guest was already protected this is a
 * password reset, which sends a best-effort heads-up to the address on file.
 */
export async function setPasswordWithTokenAction(
  guestId: string,
  token: string,
  newPassword: string
): Promise<UserAuthResult> {
  const parsed = newPasswordSchema.safeParse(newPassword);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const { guests, authCodes } = getRepositories();
  const matched = await matchToken(guestId, "reset", token);
  if (!matched) {
    return { ok: false, error: "This link is invalid or has expired" };
  }
  const creds = await guests.getAuthCredentials(guestId);
  const wasProtected = creds?.authProtected ?? false;
  await guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: await hashUserPassword(parsed.data),
  });
  await authCodes.consume(matched.id);
  if (wasProtected) {
    await notifySecurityChange(guestId, "password-changed");
  }
  return { ok: true };
}

/**
 * Changes the current (protected) user's password. Gated on knowing the current
 * password — a bare session never suffices — so no email is sent to start; a
 * best-effort "your password was changed" heads-up follows. The session stays
 * authenticated.
 */
export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<UserAuthResult> {
  const parsed = newPasswordSchema.safeParse(newPassword);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const guestId = await verifiedCurrentUser(await cookies());
  if (!guestId) {
    return { ok: false, error: "No user is selected" };
  }
  const { guests } = getRepositories();
  const creds = await guests.getAuthCredentials(guestId);
  if (!creds || !creds.authProtected) {
    return { ok: false, error: "Your name isn't protected" };
  }
  // Shares the login limiter: a stolen session must not be able to guess the
  // current password (and so take the account over) at unlimited speed.
  if (isLoginBlocked("guest", guestId)) {
    return { ok: false, error: TOO_MANY_ATTEMPTS_ERROR };
  }
  if (!(await verifyUserPassword(currentPassword, creds.passwordHash))) {
    recordLoginFailure("guest", guestId);
    return { ok: false, error: "Wrong password" };
  }
  await guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: await hashUserPassword(parsed.data),
  });
  await notifySecurityChange(guestId, "password-changed");
  return { ok: true };
}

/**
 * Turns protection off for the current user. Gated on the current password (if
 * forgotten, reset it first). Drops the now-moot authenticated session and
 * sends a best-effort heads-up.
 */
export async function disableProtectionAction(
  currentPassword: string
): Promise<UserAuthResult> {
  const cookieStore = await cookies();
  const guestId = await verifiedCurrentUser(cookieStore);
  if (!guestId) {
    return { ok: false, error: "No user is selected" };
  }
  const { guests } = getRepositories();
  const creds = await guests.getAuthCredentials(guestId);
  if (!creds || !creds.authProtected) {
    return { ok: false, error: "Your name isn't protected" };
  }
  // Same reasoning as changePasswordAction: gate the guess rate.
  if (isLoginBlocked("guest", guestId)) {
    return { ok: false, error: TOO_MANY_ATTEMPTS_ERROR };
  }
  if (!(await verifyUserPassword(currentPassword, creds.passwordHash))) {
    recordLoginFailure("guest", guestId);
    return { ok: false, error: "Wrong password" };
  }
  await guests.setAuthProtection(guestId, {
    authProtected: false,
    passwordHash: null,
  });
  // Drop the now-moot verified proof but keep the guest selected: the name is
  // unprotected now, so an "open" cookie is all it needs (and re-enabling
  // protection later will correctly require a fresh login).
  cookieStore.set(await createGuestCookie(guestId, "open"));
  await notifySecurityChange(guestId, "disabled");
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
    cookieStore.set(createGuestLogoutCookie());
    return { ok: true };
  }

  const creds = await getRepositories().guests.getAuthCredentials(guestId);
  if (!creds) {
    return { ok: false, error: "Unknown user" };
  }
  if (creds.authProtected) {
    const parsed = await readGuestCookie(
      cookieStore.get(GUEST_COOKIE_NAME)?.value
    );
    if (parsed?.guestId !== guestId || parsed.level !== "verified") {
      return {
        ok: false,
        needsAuth: true,
        error: "This name is protected — a password or emailed code is needed",
      };
    }
    // Already verified for this guest — refresh the cookie to keep them
    // selected (and extend its lifetime).
    cookieStore.set(await createGuestCookie(guestId, "verified"));
    return { ok: true };
  }

  cookieStore.set(await createGuestCookie(guestId, "open"));
  return { ok: true };
}

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
