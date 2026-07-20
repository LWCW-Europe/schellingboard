import { describe, it, expect, beforeEach, vi } from "vitest";

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
}));

import { logoutAction } from "@/app/actions/auth";
import { AUTH_COOKIE_NAME, USER_AUTH_COOKIE_NAME } from "@/utils/auth";

describe("logoutAction", () => {
  beforeEach(() => {
    cookieJar.clear();
    cookieJar.set(AUTH_COOKIE_NAME, {
      name: AUTH_COOKIE_NAME,
      value: "site-session",
    });
    cookieJar.set("user", { name: "user", value: "guest-1" });
    cookieJar.set(USER_AUTH_COOKIE_NAME, {
      name: USER_AUTH_COOKIE_NAME,
      value: "user.guest-1.session",
    });
  });

  it("clears the site login and the guest identity together", async () => {
    await logoutAction();
    expect(cookieJar.has(AUTH_COOKIE_NAME)).toBe(false);
    expect(cookieJar.has("user")).toBe(false);
    expect(cookieJar.has(USER_AUTH_COOKIE_NAME)).toBe(false);
  });
});
