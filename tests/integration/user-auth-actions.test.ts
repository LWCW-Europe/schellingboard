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
import { isUserAuthCookieValidFor, USER_AUTH_COOKIE_NAME } from "@/utils/auth";
import { hashUserPassword } from "@/utils/user-credentials";
import {
  loginAsGuestAction,
  requestAuthCodeAction,
  selectUserAction,
  updateAuthSecurityAction,
} from "@/app/actions/user-auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

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

async function userAuthCookieValidFor(guestId: string): Promise<boolean> {
  return isUserAuthCookieValidFor(
    guestId,
    cookieJar.get(USER_AUTH_COOKIE_NAME)?.value
  );
}

describe("user auth actions", () => {
  beforeAll(() => {
    setupTestDb();
  });

  beforeEach(() => {
    resetTestDb();
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

  describe("requestAuthCodeAction", () => {
    it("emails the guest a code and a login link", async () => {
      const guest = await createGuest();
      const result = await requestAuthCodeAction(guest.id);
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
      expect((await requestAuthCodeAction(guest.id)).ok).toBe(true);
      const throttled = await requestAuthCodeAction(guest.id);
      // throttled is a typed flag so the UI can tell "recent code still
      // valid" apart from real errors without matching on the message.
      expect(throttled).toMatchObject({ ok: false, throttled: true });
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(1);
      vi.setSystemTime(new Date("2026-07-18T12:01:01Z"));
      expect((await requestAuthCodeAction(guest.id)).ok).toBe(true);
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(2);
    });

    it("fails for an unknown guest without sending mail", async () => {
      const result = await requestAuthCodeAction("nope");
      expect(result.ok).toBe(false);
      expect(vi.mocked(sendMail)).not.toHaveBeenCalled();
    });

    it("fails when email is not configured", async () => {
      vi.mocked(isMailerConfigured).mockReturnValue(false);
      const guest = await createGuest();
      const result = await requestAuthCodeAction(guest.id);
      expect(result.ok).toBe(false);
      expect(vi.mocked(sendMail)).not.toHaveBeenCalled();
    });
  });

  describe("loginAsGuestAction", () => {
    async function protectedGuestWithCode() {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: null,
      });
      await requestAuthCodeAction(guest.id);
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
      expect(cookieJar.get("user")?.value).toBe(guest.id);
      expect(await userAuthCookieValidFor(guest.id)).toBe(true);
    });

    it("the code stays valid for repeated logins within its window", async () => {
      const { guest, code } = await protectedGuestWithCode();
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(true);
      cookieJar.clear();
      expect((await loginAsGuestAction(guest.id, code)).ok).toBe(true);
    });

    it("rejects a wrong code and never sets cookies", async () => {
      const { guest } = await protectedGuestWithCode();
      const result = await loginAsGuestAction(guest.id, "WRONGONE");
      expect(result.ok).toBe(false);
      expect(cookieJar.get("user")).toBeUndefined();
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

    it("locks the code after too many failed attempts", async () => {
      const { guest, code } = await protectedGuestWithCode();
      for (let i = 0; i < 10; i++) {
        await loginAsGuestAction(guest.id, "WRONGONE");
      }
      const result = await loginAsGuestAction(guest.id, code);
      expect(result.ok).toBe(false);
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
      expect(cookieJar.get("user")?.value).toBe(guest.id);
      expect(await userAuthCookieValidFor(guest.id)).toBe(true);
    });
  });

  describe("selectUserAction", () => {
    it("switches freely to an unprotected guest", async () => {
      const guest = await createGuest();
      const result = await selectUserAction(guest.id);
      expect(result).toEqual({ ok: true });
      expect(cookieJar.get("user")?.value).toBe(guest.id);
    });

    it("refuses a protected guest without credentials", async () => {
      const guest = await createGuest();
      await getRepositories().guests.setAuthProtection(guest.id, {
        authProtected: true,
        passwordHash: null,
      });
      const result = await selectUserAction(guest.id);
      expect(result).toMatchObject({ ok: false, needsAuth: true });
      expect(cookieJar.get("user")).toBeUndefined();
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
      expect(cookieJar.get("user")?.value).toBe(other.id);
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
      expect(cookieJar.get("user")).toBeUndefined();
    });
  });

  describe("updateAuthSecurityAction", () => {
    async function currentGuestWithCode() {
      const guest = await createGuest();
      await selectUserAction(guest.id);
      await requestAuthCodeAction(guest.id);
      const { code } = await lastSentEmail();
      return { guest, code };
    }

    it("enables protection with a valid code and authenticates the session", async () => {
      const { guest, code } = await currentGuestWithCode();
      const result = await updateAuthSecurityAction({
        credential: code,
        protect: true,
      });
      expect(result).toEqual({ ok: true });
      expect(
        await getRepositories().guests.getAuthCredentials(guest.id)
      ).toEqual({ authProtected: true, passwordHash: null });
      expect(await userAuthCookieValidFor(guest.id)).toBe(true);
    });

    it("enables protection with a permanent password usable for login", async () => {
      const { guest, code } = await currentGuestWithCode();
      const result = await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      expect(result).toEqual({ ok: true });
      cookieJar.clear();
      expect(
        (await loginAsGuestAction(guest.id, "correct horse battery")).ok
      ).toBe(true);
    });

    it("leaves the guest unprotected when the auth cookie cannot be signed", async () => {
      const { guest, code } = await currentGuestWithCode();
      // e.g. AUTH_SECRET unset: enabling protection must fail as a whole,
      // not flip the flag and then leave a guest nobody can ever log in as.
      vi.stubEnv("AUTH_SECRET", "");
      await expect(
        updateAuthSecurityAction({ credential: code, protect: true })
      ).rejects.toThrow();
      expect(
        (await getRepositories().guests.getAuthCredentials(guest.id))
          ?.authProtected
      ).toBe(false);
    });

    it("rejects a wrong code and leaves the guest unprotected", async () => {
      const { guest } = await currentGuestWithCode();
      const result = await updateAuthSecurityAction({
        credential: "WRONGONE",
        protect: true,
      });
      expect(result.ok).toBe(false);
      expect(
        await getRepositories().guests.getAuthCredentials(guest.id)
      ).toEqual({ authProtected: false, passwordHash: null });
    });

    it("rejects a password in place of a code when enabling protection", async () => {
      const { guest, code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      // Disabling clears the password, but the guest might still remember
      // it — re-enabling must go through a fresh emailed code regardless,
      // since it's the operation the recovery path depends on.
      await updateAuthSecurityAction({ credential: code, protect: false });
      const result = await updateAuthSecurityAction({
        credential: "correct horse battery",
        protect: true,
      });
      expect(result.ok).toBe(false);
      expect(
        (await getRepositories().guests.getAuthCredentials(guest.id))
          ?.authProtected
      ).toBe(false);
    });

    it("disables protection and clears the password, with a code", async () => {
      const { guest, code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      const result = await updateAuthSecurityAction({
        credential: code,
        protect: false,
      });
      expect(result).toEqual({ ok: true });
      expect(
        await getRepositories().guests.getAuthCredentials(guest.id)
      ).toEqual({ authProtected: false, passwordHash: null });
    });

    it("disables protection with the permanent password", async () => {
      const { guest, code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      const result = await updateAuthSecurityAction({
        credential: "correct horse battery",
        protect: false,
      });
      expect(result).toEqual({ ok: true });
      expect(
        await getRepositories().guests.getAuthCredentials(guest.id)
      ).toEqual({ authProtected: false, passwordHash: null });
    });

    it("changes the password with the current permanent password", async () => {
      const { guest, code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      const result = await updateAuthSecurityAction({
        credential: "correct horse battery",
        protect: true,
        newPassword: "new password entirely",
      });
      expect(result).toEqual({ ok: true });
      cookieJar.clear();
      expect(
        (await loginAsGuestAction(guest.id, "new password entirely")).ok
      ).toBe(true);
    });

    it("rejects a wrong password in place of a code or password", async () => {
      const { guest, code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      const result = await updateAuthSecurityAction({
        credential: "wrong password",
        protect: false,
      });
      expect(result.ok).toBe(false);
      expect(
        (await getRepositories().guests.getAuthCredentials(guest.id))
          ?.authProtected
      ).toBe(true);
    });

    it("rejects a too-short password", async () => {
      const { code } = await currentGuestWithCode();
      const result = await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "short",
      });
      expect(result.ok).toBe(false);
    });

    it("fails when no user is selected", async () => {
      const guest = await createGuest();
      await requestAuthCodeAction(guest.id);
      const { code } = await lastSentEmail();
      cookieJar.clear();
      const result = await updateAuthSecurityAction({
        credential: code,
        protect: true,
      });
      expect(result.ok).toBe(false);
    });

    it("does not notify when protection is enabled for the first time", async () => {
      const { code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      // Only the code request itself sent mail — no notification for a
      // guest's first-ever protection/password.
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(1);
    });

    it("emails a notification when protection is disabled", async () => {
      const { code } = await currentGuestWithCode();
      await updateAuthSecurityAction({ credential: code, protect: true });
      await updateAuthSecurityAction({ credential: code, protect: false });
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(2);
      const email = await lastEmail();
      expect(email.to).toMatch(/@test\.example$/);
      expect(email.subject).toMatch(/protection.*(off|disabled)/i);
    });

    it("emails a notification when the password changes", async () => {
      const { code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      await updateAuthSecurityAction({
        credential: "correct horse battery",
        protect: true,
        newPassword: "new password entirely",
      });
      expect(vi.mocked(sendMail)).toHaveBeenCalledTimes(2);
      const email = await lastEmail();
      expect(email.subject).toMatch(/password/i);
    });

    it("disabling succeeds even if the notification email fails to send", async () => {
      const { guest, code } = await currentGuestWithCode();
      await updateAuthSecurityAction({
        credential: code,
        protect: true,
        newPassword: "correct horse battery",
      });
      vi.mocked(sendMail).mockRejectedValueOnce(new Error("smtp down"));
      const result = await updateAuthSecurityAction({
        credential: "correct horse battery",
        protect: false,
      });
      expect(result).toEqual({ ok: true });
      expect(
        (await getRepositories().guests.getAuthCredentials(guest.id))
          ?.authProtected
      ).toBe(false);
    });
  });
});
