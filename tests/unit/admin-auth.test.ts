import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  verifyAdminPassword,
  createAdminAuthCookie,
  isAdminCookieValid,
  createAuthCookie,
  isAuthCookieValid,
} from "@/utils/auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function withEnv(env: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) vi.stubEnv(k, "");
    else vi.stubEnv(k, v);
  }
}

describe("verifyAdminPassword", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns false when ADMIN_PASSWORD unset (admin disabled)", () => {
    withEnv({ ADMIN_PASSWORD: "" });
    expect(verifyAdminPassword("anything")).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
  });
});

describe("createAdminAuthCookie", () => {
  beforeEach(() => {
    withEnv({ ADMIN_PASSWORD: "pw", AUTH_SECRET: VALID_SECRET });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("produces a value of the form 'admin.timestamp.signature'", async () => {
    const c = await createAdminAuthCookie();
    expect(c.value).toMatch(/^admin\.\d+\.[A-Za-z0-9_-]+$/);
  });

  it("throws if AUTH_SECRET is missing", async () => {
    withEnv({ AUTH_SECRET: "" });
    await expect(createAdminAuthCookie()).rejects.toThrow(/AUTH_SECRET/);
  });
});

describe("isAdminCookieValid", () => {
  beforeEach(() => {
    withEnv({
      SITE_PASSWORD: "site-pw",
      ADMIN_PASSWORD: "admin-pw",
      AUTH_SECRET: VALID_SECRET,
    });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("accepts a freshly created admin cookie", async () => {
    const c = await createAdminAuthCookie();
    expect(await isAdminCookieValid(c.value)).toBe(true);
  });

  it("rejects undefined and empty values", async () => {
    expect(await isAdminCookieValid(undefined)).toBe(false);
    expect(await isAdminCookieValid("")).toBe(false);
  });

  it("rejects everything when admin is disabled", async () => {
    const c = await createAdminAuthCookie();
    withEnv({ ADMIN_PASSWORD: "" });
    expect(await isAdminCookieValid(c.value)).toBe(false);
  });

  it("rejects a tampered value", async () => {
    const c = await createAdminAuthCookie();
    expect(await isAdminCookieValid(c.value + "x")).toBe(false);
    expect(await isAdminCookieValid("admin.123.garbage")).toBe(false);
  });

  it("rejects a site auth cookie (scope separation)", async () => {
    const site = await createAuthCookie();
    expect(await isAdminCookieValid(site.value)).toBe(false);
  });

  it("admin cookie is not valid as a site auth cookie", async () => {
    const admin = await createAdminAuthCookie();
    expect(await isAuthCookieValid(admin.value)).toBe(false);
  });

  it("rejects an expired admin cookie", async () => {
    vi.useFakeTimers();
    try {
      const c = await createAdminAuthCookie();
      vi.advanceTimersByTime(8 * 24 * 60 * 60 * 1000); // 8 days > 7-day max age
      expect(await isAdminCookieValid(c.value)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
