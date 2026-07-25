import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

type CookieRecord = { name: string; value: string; maxAge?: number };
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
  headers: () => Promise.resolve(new Headers()),
}));

import { loginAction, logoutAction } from "@/app/actions/auth";
import { AUTH_COOKIE_NAME, GUEST_COOKIE_NAME } from "@/utils/auth";
import {
  MAX_LOGIN_FAILURES_PER_CLIENT,
  resetLoginRateLimiter,
} from "@/utils/login-rate-limit";

function loginForm(password: string): FormData {
  const form = new FormData();
  form.set("site-password", password);
  return form;
}

describe("loginAction", () => {
  beforeEach(() => {
    cookieJar.clear();
    resetLoginRateLimiter();
    vi.stubEnv("SITE_PASSWORD", "site-pw");
    vi.stubEnv("AUTH_SECRET", "0123456789abcdef0123456789abcdef");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("throttles repeated failed logins, even with the right password", async () => {
    for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
      const res = await loginAction(null, loginForm("wrong"));
      expect(res).toMatchObject({ error: "Invalid password" });
    }
    const res = await loginAction(null, loginForm("site-pw"));
    expect(res.error).toMatch(/too many/i);
    expect(cookieJar.has(AUTH_COOKIE_NAME)).toBe(false);
  });
});

describe("logoutAction", () => {
  beforeEach(() => {
    cookieJar.clear();
    cookieJar.set(AUTH_COOKIE_NAME, {
      name: AUTH_COOKIE_NAME,
      value: "site-session",
    });
    cookieJar.set(GUEST_COOKIE_NAME, {
      name: GUEST_COOKIE_NAME,
      value: "verified.guest-1.123.sig",
    });
  });

  it("clears the site login and the guest identity together", async () => {
    await logoutAction();
    expect(cookieJar.has(AUTH_COOKIE_NAME)).toBe(false);
    expect(cookieJar.has(GUEST_COOKIE_NAME)).toBe(false);
  });
});
