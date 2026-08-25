import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { render } from "@react-email/render";

type CookieRecord = {
  name: string;
  value: string;
  maxAge?: number;
  httpOnly?: boolean;
};
const cookieJar = new Map<string, CookieRecord>();

function setJarCookie(cookie: CookieRecord) {
  if (cookie.maxAge === 0) cookieJar.delete(cookie.name);
  else cookieJar.set(cookie.name, cookie);
}

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const cookie = cookieJar.get(name);
        return cookie === undefined ? undefined : { name, value: cookie.value };
      },
      set: (cookie: CookieRecord) => setJarCookie(cookie),
    }),
}));

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
  isMailerConfigured: vi.fn(() => true),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { sendMail, isMailerConfigured } from "@/utils/mailer";
import { readGuestCookie, GUEST_COOKIE_NAME } from "@/utils/auth";
import { MAX_CODE_ATTEMPTS, hashUserPassword } from "@/utils/user-credentials";
import {
  MAX_LOGIN_FAILURES_PER_CLIENT,
  resetLoginRateLimiter,
} from "@/utils/login-rate-limit";
import {
  changePasswordAction,
  disableProtectionAction,
  loginAsGuestAction,
  requestLoginCodeAction,
  requestPasswordLinkAction,
  selectUserAction,
  setPasswordWithTokenAction,
} from "@/app/actions/user-auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

// A wrong login code that is nonetheless a well-formed one: right length, and
// only alphabet characters (no I, O, 0 or 1). Guesses that *can't* be codes
// are deliberately not counted as attempts against one.
const CODE_SHAPED_JUNK = "ABCDEFGH";

async function lastEmail(): Promise<{
  to: string;
  subject: string;
  html: string;
}> {
  const call = vi.mocked(sendMail).mock.calls.at(-1)?.[0];
  if (!call) throw new Error("No email was sent");
  const html = await render(call.body);
  return { to: call.to, subject: call.subject, html };
}

async function lastSentEmail(): Promise<{
  to: string;
  subject: string;
  html: string;
  code: string;
}> {
  const email = await lastEmail();
  const code = email.html.match(/>([A-HJ-NP-Z2-9]{8})</)?.[1];
  if (!code) throw new Error(`No code found in email: ${email.html}`);
  return { ...email, code };
}

/** The reset token carried in the most recent password-link email. */
async function lastResetToken(): Promise<string> {
  const email = await lastEmail();
  const token = email.html.match(/token=([A-Za-z0-9_-]+)/)?.[1];
  if (!token) throw new Error(`No reset token in email: ${email.html}`);
  return token;
}

/** The selected guest id from the single guest cookie, or null if none. */
async function currentUserId(): Promise<string | null> {
  const parsed = await readGuestCookie(cookieJar.get(GUEST_COOKIE_NAME)?.value);
  return parsed?.guestId ?? null;
}

/** Whether the guest cookie is a verified proof issued for `guestId`. */
async function userAuthCookieValidFor(guestId: string): Promise<boolean> {
  const parsed = await readGuestCookie(cookieJar.get(GUEST_COOKIE_NAME)?.value);
  return parsed?.guestId === guestId && parsed.level === "verified";
}

describe("user auth actions", () => {
  beforeAll(() => {
    setupTestDb();
  });

  beforeEach(() => {
    resetTestDb();
    resetLoginRateLimiter();
    cookieJar.clear();
    vi.mocked(sendMail).mockReset();
    vi.mocked(isMailerConfigured).mockReturnValue(true);
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("SITE_URL", "https://sessions.test.example");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  describe("requestLoginCodeAction", () => {
    it("emails the guest a code and a login link", async () => {
      const guest = await createGuest();
      const result = await requestLoginCodeAction(guest.id);
      expect(result).toEqual({ ok: true });
      const email = await lastSentEmail();
      expect(email.to).toMatch(/@test\.example$/);
      // & is HTML-escaped in the rendered body.
      expect(email.html).toContain(
        `https://sessions.test.example/auth/login?guest=${guest.id}&amp;code=${email.code}`
      );
    });

    it("throttles repeated requests, allowing a new one after a minute", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
      const guest = await createGuest();
      expect((await requestLoginCodeAction(guest.id)).ok).toBe(true);
      const throttled = await requestLoginCodeAction(guest.id);
      // throttled is a typed flag so the UI can tell "recent code still
      // valid" apart from real errors without matching on the message.
      expect(throttled).toMatchObject({ ok: false, throttled: true });
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(1);
      vi.setSystemTime(new Date("2026-07-18T12:01:01Z"));
      expect((await requestLoginCodeAction(guest.id)).ok).toBe(true);
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(2);
    });

    it("fails for an unknown guest without sending mail", async () => {
      const result = await requestLoginCodeAction("nope");
      expect(result.ok).toBe(false);
      expect(vi.mocked(sendMail)).not.toHaveBeenCalled();
    });

    it("fails when email is not configured", async () => {
      vi.mocked(isMailerConfigured).mockReturnValue(false);
      const guest = await createGuest();
      const result = await requestLoginCodeAction(guest.id);
      expect(result.ok).toBe(false);
      expect(vi.mocked(sendMail)).not.toHaveBeenCalled();
    });
  });

  describe("requestPasswordLinkAction", () => {
    it("emails the guest a single-use reset link", async () => {
      const guest = await createGuest();
      const result = await requestPasswordLinkAction(guest.id);
      expect(result).toEqual({ ok: true });
      const email = await lastEmail();
      expect(email.to).toMatch(/@test\.example$/);
      expect(email.subject).toMatch(/password/i);
      expect(email.html).toContain(
        `https://sessions.test.example/auth/reset?guest=${guest.id}&amp;token=`
      );
    });

    it("throttles repeated requests, allowing a new one after a minute", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
      const guest = await createGuest();
      expect((await requestPasswordLinkAction(guest.id)).ok).toBe(true);
      const throttled = await requestPasswordLinkAction(guest.id);
      expect(throttled).toMatchObject({ ok: false, throttled: true });
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(1);
      vi.setSystemTime(new Date("2026-07-18T12:01:01Z"));
      expect((await requestPasswordLinkAction(guest.id)).ok).toBe(true);
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(2);
    });

    it("a login code and a reset link are issued independently", async () => {
      // Requesting one must not throttle or clobber the other.
      const guest = await createGuest();
      expect((await requestLoginCodeAction(guest.id)).ok).toBe(true);
      expect((await requestPasswordLinkAction(guest.id)).ok).toBe(true);
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(2);
    });

    it("fails for an unknown guest without sending mail", async () => {
      const result = await requestPasswordLinkAction("nope");
      expect(result.ok).toBe(false);
      expect(vi.mocked(sendMail)).not.toHaveBeenCalled();
    });
  });

  describe("loginAsGuestAction", () => {
    async function protectedGuestWithCode() {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("existing password ok"),
      });
      await requestLoginCodeAction(guest.id);
      const { code } = await lastSentEmail();
      return { guest, code };
    }

    it("logs in with a valid emailed code, tolerating sloppy typing", async () => {
      const { guest, code } = await protectedGuestWithCode();
      const result = await loginAsGuestAction(
        guest.id,
        ` ${code.toLowerCase()} `
      );
      expect(result).toEqual({ ok: true });
      expect(await currentUserId()).toBe(guest.id);
      expect(await userAuthCookieValidFor(guest.id)).toBe(true);
    });

    it("the code is single-use: a second login with it fails", async () => {
      const { guest, code } = await protectedGuestWithCode();
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(true);
      cookieJar.clear();
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(false);
    });

    it("rejects a wrong code and never sets cookies", async () => {
      const { guest } = await protectedGuestWithCode();
      const result = await loginAsGuestAction(guest.id, "WRONGONE");
      expect(result.ok).toBe(false);
      expect(await currentUserId()).toBeNull();
      expect(await userAuthCookieValidFor(guest.id)).toBe(false);
    });

    it("rejects an expired code", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
      const { guest, code } = await protectedGuestWithCode();
      vi.setSystemTime(new Date("2026-07-18T12:10:01Z"));
      const result = await loginAsGuestAction(guest.id, code);
      expect(result.ok).toBe(false);
    });

    it("an outstanding code survives a burst of wrong guesses", async () => {
      // Wrong guesses must not cheaply cost the person holding the code their
      // way in: anyone who knows a guest name can submit junk, so retiring the
      // code after a handful handed them a lockout of the one path meant to
      // always work.
      const { guest, code } = await protectedGuestWithCode();
      for (let i = 0; i < MAX_CODE_ATTEMPTS - 1; i++) {
        expect((await loginAsGuestAction(guest.id, CODE_SHAPED_JUNK)).ok).toBe(
          false
        );
      }
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(true);
      expect(await currentUserId()).toBe(guest.id);
    });

    it("retires the code once the guess cap is reached", async () => {
      // Guessing still has to be bounded: without a cap the code is an
      // unlimited online oracle, and ~40 bits is not enough for that.
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { guest, code } = await protectedGuestWithCode();
      for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
        await loginAsGuestAction(guest.id, CODE_SHAPED_JUNK);
      }
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(false);
      // Worth noticing in the log, once.
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });

    it("a used-up code can be replaced, and says so meanwhile", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { guest } = await protectedGuestWithCode();
      for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
        await loginAsGuestAction(guest.id, CODE_SHAPED_JUNK);
      }
      // Within the throttle window the guest is told the code is spent rather
      // than being sent to their inbox for a code that no longer works. Not
      // `throttled`: that flag means "a valid code is already in your inbox",
      // which the UI shows as reassurance — this is a plain failure.
      const spent = await requestLoginCodeAction(guest.id);
      expect(spent.ok).toBe(false);
      if (!spent.ok) {
        expect(spent.throttled).toBeFalsy();
        expect(spent.error).toMatch(/used up|wrong/i);
      }
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(1);
      // ...and a minute later a fresh code arrives and works.
      vi.setSystemTime(new Date("2026-07-18T12:01:01Z"));
      expect((await requestLoginCodeAction(guest.id)).ok).toBe(true);
      const { code: fresh } = await lastSentEmail();
      expect((await loginAsGuestAction(guest.id, fresh)).ok).toBe(true);
      warn.mockRestore();
    });

    it("counts code guesses, not wrong passwords, as attempts", async () => {
      const { guest, code } = await protectedGuestWithCode();
      const { authCodes } = getRepositories();
      const attempts = async () =>
        (await authCodes.findActive(guest.id, "login", new Date()))?.attempts;

      for (let i = 0; i < 3; i++) {
        await loginAsGuestAction(guest.id, "not the password");
      }
      expect(await attempts()).toBe(0);
      await loginAsGuestAction(guest.id, CODE_SHAPED_JUNK);
      expect(await attempts()).toBe(1);
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(true);
    });

    it("logs in with the permanent password", async () => {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("hunter2 forever"),
      });
      expect((await loginAsGuestAction(guest.id, "wrong")).ok).toBe(false);
      const result = await loginAsGuestAction(guest.id, "hunter2 forever");
      expect(result).toEqual({ ok: true });
      expect(await currentUserId()).toBe(guest.id);
      expect(await userAuthCookieValidFor(guest.id)).toBe(true);
    });

    it("locks the password after too many failed attempts, but a fresh emailed code still works", async () => {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("hunter2 forever"),
      });
      for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
        expect((await loginAsGuestAction(guest.id, "wrong")).ok).toBe(false);
      }
      // The right password no longer gets in...
      const blocked = await loginAsGuestAction(guest.id, "hunter2 forever");
      expect(blocked.ok).toBe(false);
      expect(await currentUserId()).toBeNull();
      // ...but proving inbox access still does, so the lockout can't shut
      // the real person out.
      await requestLoginCodeAction(guest.id);
      const { code } = await lastSentEmail();
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(true);
      expect(await currentUserId()).toBe(guest.id);
    });

    it("the lockout message points at the code path it leaves open", async () => {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("hunter2 forever"),
      });
      for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
        await loginAsGuestAction(guest.id, "wrong");
      }
      const blocked = await loginAsGuestAction(guest.id, "hunter2 forever");
      expect(blocked.ok).toBe(false);
      if (!blocked.ok) expect(blocked.error).toMatch(/code/i);
    });

    it("does not promise a code in the lockout message without a mailer", async () => {
      vi.mocked(isMailerConfigured).mockReturnValue(false);
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("hunter2 forever"),
      });
      for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
        await loginAsGuestAction(guest.id, "wrong");
      }
      const blocked = await loginAsGuestAction(guest.id, "hunter2 forever");
      expect(blocked.ok).toBe(false);
      if (!blocked.ok) expect(blocked.error).not.toMatch(/code/i);
    });

    it("a lockout for one guest does not affect another", async () => {
      const locked = await createGuest();
      const other = await createGuest();
      for (const g of [locked, other]) {
        await getRepositories().guests.setAuthProtection(g.id, {
          authProtected: true,
          passwordHash: await hashUserPassword("hunter2 forever"),
        });
      }
      for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
        await loginAsGuestAction(locked.id, "wrong");
      }
      expect((await loginAsGuestAction(other.id, "hunter2 forever")).ok).toBe(
        true
      );
    });
  });

  describe("selectUserAction", () => {
    it("switches freely to an unprotected guest", async () => {
      const guest = await createGuest();
      const result = await selectUserAction(guest.id);
      expect(result).toEqual({ ok: true });
      expect(await currentUserId()).toBe(guest.id);
    });

    it("refuses a protected guest without credentials", async () => {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: null,
      });
      const result = await selectUserAction(guest.id);
      expect(result).toMatchObject({ ok: false, needsAuth: true });
      expect(await currentUserId()).toBeNull();
    });

    it("switching away from a protected guest drops the authenticated session", async () => {
      const protectedGuest = await createGuest();
      const other = await createGuest();
      await getRepositories().guests.setAuthProtection(protectedGuest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("hunter2 forever"),
      });
      await loginAsGuestAction(protectedGuest.id, "hunter2 forever");

      await selectUserAction(other.id);
      expect(await currentUserId()).toBe(other.id);
      expect(await userAuthCookieValidFor(protectedGuest.id)).toBe(false);
      // Switching back now needs credentials again.
      expect(await selectUserAction(protectedGuest.id)).toMatchObject({
        ok: false,
        needsAuth: true,
      });
    });

    it("clears the identity when passed null", async () => {
      const guest = await createGuest();
      await selectUserAction(guest.id);
      await selectUserAction(null);
      expect(await currentUserId()).toBeNull();
    });
  });

  describe("setPasswordWithTokenAction", () => {
    async function guestWithResetToken() {
      const guest = await createGuest();
      await requestPasswordLinkAction(guest.id);
      const token = await lastResetToken();
      return { guest, token };
    }

    it("sets the password, turns protection on, and grants no session", async () => {
      const { guest, token } = await guestWithResetToken();
      const result = await setPasswordWithTokenAction(
        guest.id,
        token,
        "correct horse battery"
      );
      expect(result).toEqual({ ok: true });
      const creds = await getRepositories().guests.getAuthCredentials(guest.id);
      expect(creds?.authProtected).toBe(true);
      expect(creds?.passwordHash).toBeTruthy();
      // No session: the guest logs in with the new password afterwards.
      expect(await currentUserId()).toBeNull();
      expect(await userAuthCookieValidFor(guest.id)).toBe(false);
      expect(
        (await loginAsGuestAction(guest.id, "correct horse battery")).ok
      ).toBe(true);
    });

    it("logs out the browser that was holding this name", async () => {
      // #805: the open cookie stops being honoured the moment protection is
      // turned on, so leaving it in place keeps a selection the server no
      // longer accepts — every page then insists no name is selected.
      const { guest, token } = await guestWithResetToken();
      await selectUserAction(guest.id);
      expect(await currentUserId()).toBe(guest.id);
      expect(
        (await setPasswordWithTokenAction(guest.id, token, "correct horse")).ok
      ).toBe(true);
      expect(await currentUserId()).toBeNull();
    });

    it("ends the verified session of a guest resetting their password", async () => {
      const { guest, token } = await guestWithResetToken();
      await setPasswordWithTokenAction(guest.id, token, "correct horse");
      await loginAsGuestAction(guest.id, "correct horse");
      expect(await userAuthCookieValidFor(guest.id)).toBe(true);

      await requestPasswordLinkAction(guest.id);
      await setPasswordWithTokenAction(
        guest.id,
        await lastResetToken(),
        "battery staple horse"
      );
      expect(await currentUserId()).toBeNull();
    });

    it("leaves another guest's selection alone", async () => {
      const { guest, token } = await guestWithResetToken();
      const other = await createGuest();
      await selectUserAction(other.id);
      await setPasswordWithTokenAction(guest.id, token, "correct horse");
      expect(await currentUserId()).toBe(other.id);
    });

    it("is single-use: the same token cannot set a password twice", async () => {
      const { guest, token } = await guestWithResetToken();
      expect(
        (
          await setPasswordWithTokenAction(
            guest.id,
            token,
            "correct horse battery"
          )
        ).ok
      ).toBe(true);
      const again = await setPasswordWithTokenAction(
        guest.id,
        token,
        "another password here"
      );
      expect(again.ok).toBe(false);
    });

    it("rejects a wrong or expired token", async () => {
      const { guest } = await guestWithResetToken();
      expect(
        (
          await setPasswordWithTokenAction(
            guest.id,
            "not-the-token",
            "long enough"
          )
        ).ok
      ).toBe(false);
    });

    it("a reset link survives any number of wrong tokens", async () => {
      // A reset token carries 256 bits, so guessing it is infeasible and
      // counting the guesses buys nothing — while retiring it after a bounded
      // number of tries would hand anyone who knows a guest id a way to knock
      // out the link that guest was just emailed.
      const { guest, token } = await guestWithResetToken();
      for (let i = 0; i < MAX_CODE_ATTEMPTS + 1; i++) {
        expect(
          (await setPasswordWithTokenAction(guest.id, "nope", "long enough")).ok
        ).toBe(false);
      }
      expect(
        (
          await setPasswordWithTokenAction(
            guest.id,
            token,
            "correct horse battery"
          )
        ).ok
      ).toBe(true);
    });

    it("rejects a too-short password without consuming the token", async () => {
      const { guest, token } = await guestWithResetToken();
      expect(
        (await setPasswordWithTokenAction(guest.id, token, "short")).ok
      ).toBe(false);
      // The token survives a rejected weak password, so a valid retry works.
      expect(
        (
          await setPasswordWithTokenAction(
            guest.id,
            token,
            "correct horse battery"
          )
        ).ok
      ).toBe(true);
    });

    it("notifies only when the guest was already protected (a reset)", async () => {
      // First set: enabling protection, no notification.
      const { guest, token } = await guestWithResetToken();
      await setPasswordWithTokenAction(
        guest.id,
        token,
        "correct horse battery"
      );
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(1); // just the link

      // Second set on an already-protected guest: a reset — notify.
      await requestPasswordLinkAction(guest.id);
      const token2 = await lastResetToken();
      await setPasswordWithTokenAction(
        guest.id,
        token2,
        "new password entirely"
      );
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(3); // link + notification
      const email = await lastEmail();
      expect(email.subject).toMatch(/password/i);
    });
  });

  describe("changePasswordAction", () => {
    async function loggedInProtectedGuest() {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("correct horse battery"),
      });
      await loginAsGuestAction(guest.id, "correct horse battery");
      return guest;
    }

    it("changes the password given the current one, and notifies", async () => {
      const guest = await loggedInProtectedGuest();
      const result = await changePasswordAction(
        "correct horse battery",
        "new password entirely"
      );
      expect(result).toEqual({ ok: true });
      const email = await lastEmail();
      expect(email.subject).toMatch(/password/i);
      cookieJar.clear();
      expect(
        (await loginAsGuestAction(guest.id, "new password entirely")).ok
      ).toBe(true);
    });

    it("rejects a wrong current password and leaves it unchanged", async () => {
      const guest = await loggedInProtectedGuest();
      const result = await changePasswordAction(
        "wrong",
        "new password entirely"
      );
      expect(result.ok).toBe(false);
      cookieJar.clear();
      expect(
        (await loginAsGuestAction(guest.id, "correct horse battery")).ok
      ).toBe(true);
    });

    it("rejects a too-short new password", async () => {
      await loggedInProtectedGuest();
      expect(
        (await changePasswordAction("correct horse battery", "short")).ok
      ).toBe(false);
    });

    it("fails when no user is selected", async () => {
      await loggedInProtectedGuest();
      cookieJar.clear();
      expect(
        (
          await changePasswordAction(
            "correct horse battery",
            "new password entirely"
          )
        ).ok
      ).toBe(false);
    });
  });

  describe("disableProtectionAction", () => {
    async function loggedInProtectedGuest() {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: await hashUserPassword("correct horse battery"),
      });
      await loginAsGuestAction(guest.id, "correct horse battery");
      return guest;
    }

    it("turns protection off, clears the password and session, and notifies", async () => {
      const guest = await loggedInProtectedGuest();
      const result = await disableProtectionAction("correct horse battery");
      expect(result).toEqual({ ok: true });
      expect(
        await getRepositories().guests.getAuthCredentials(guest.id)
      ).toEqual({ authProtected: false, passwordHash: null });
      expect(await userAuthCookieValidFor(guest.id)).toBe(false);
      const email = await lastEmail();
      expect(email.subject).toMatch(/protection.*(off|disabled)/i);
    });

    it("rejects a wrong password and stays protected", async () => {
      const guest = await loggedInProtectedGuest();
      const result = await disableProtectionAction("wrong");
      expect(result.ok).toBe(false);
      expect(
        (await getRepositories().guests.getAuthCredentials(guest.id))
          ?.authProtected
      ).toBe(true);
    });

    it("succeeds even if the notification email fails to send", async () => {
      const guest = await loggedInProtectedGuest();
      vi.mocked(sendMail).mockRejectedValueOnce(new Error("smtp down"));
      const result = await disableProtectionAction("correct horse battery");
      expect(result).toEqual({ ok: true });
      expect(
        (await getRepositories().guests.getAuthCredentials(guest.id))
          ?.authProtected
      ).toBe(false);
    });
  });
});
