import { describe, it, expect, afterEach, vi } from "vitest";
import {
  createUserAuthCookie,
  createUserAuthLogoutCookie,
  isUserAuthCookieValidFor,
  USER_AUTH_COOKIE_NAME,
} from "@/utils/auth";
import {
  AUTH_CODE_LENGTH,
  generateAuthCode,
  generateAuthCodeSalt,
  generateResetToken,
  hashAuthCode,
  normalizeAuthCode,
  hashUserPassword,
  verifyUserPassword,
} from "@/utils/user-credentials";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

describe("user auth cookie", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("validates only for the guest it was issued for", async () => {
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    const cookie = await createUserAuthCookie("guest-1");
    expect(cookie.name).toBe(USER_AUTH_COOKIE_NAME);
    expect(await isUserAuthCookieValidFor("guest-1", cookie.value)).toBe(true);
    expect(await isUserAuthCookieValidFor("guest-2", cookie.value)).toBe(false);
    expect(await isUserAuthCookieValidFor("guest-1", undefined)).toBe(false);
    expect(
      await isUserAuthCookieValidFor("guest-1", cookie.value.slice(0, -2))
    ).toBe(false);
  });

  it("is httpOnly and long-lived; the logout cookie expires immediately", async () => {
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    const cookie = await createUserAuthCookie("guest-1");
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.maxAge).toBeGreaterThan(0);
    expect(createUserAuthLogoutCookie().maxAge).toBe(0);
  });
});

describe("auth codes", () => {
  it("generates 8-character codes from the unambiguous alphabet", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateAuthCode();
      expect(code).toHaveLength(AUTH_CODE_LENGTH);
      expect(code).toMatch(/^[A-HJ-NP-Z2-9]+$/);
    }
  });

  it("normalizes user input (case, whitespace)", () => {
    expect(normalizeAuthCode(" ab cd\tefgh ")).toBe("ABCDEFGH");
  });

  it("hashes deterministically for the same code and salt, and never returns the code itself", () => {
    const code = generateAuthCode();
    const salt = generateAuthCodeSalt();
    expect(hashAuthCode(code, salt)).toBe(hashAuthCode(code, salt));
    expect(hashAuthCode(code, salt)).not.toContain(code);
    expect(hashAuthCode(code, salt)).not.toBe(
      hashAuthCode(generateAuthCode(), salt)
    );
  });

  it("salts hashes (same code, different salt gives a different hash)", () => {
    const code = generateAuthCode();
    expect(hashAuthCode(code, generateAuthCodeSalt())).not.toBe(
      hashAuthCode(code, generateAuthCodeSalt())
    );
  });

  it("generates random, non-empty salts", () => {
    expect(generateAuthCodeSalt()).not.toBe(generateAuthCodeSalt());
    expect(generateAuthCodeSalt().length).toBeGreaterThan(0);
  });
});

describe("reset tokens", () => {
  it("generates random, high-entropy, URL-safe tokens", () => {
    const token = generateResetToken();
    // base64url of 32 bytes → 43 chars, only URL-safe characters.
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(generateResetToken()).not.toBe(generateResetToken());
  });
});

describe("user passwords", () => {
  it("verifies the right password and rejects the wrong one", async () => {
    const hash = await hashUserPassword("correct horse");
    expect(await verifyUserPassword("correct horse", hash)).toBe(true);
    expect(await verifyUserPassword("wrong", hash)).toBe(false);
    expect(await verifyUserPassword("correct horse", null)).toBe(false);
  });

  it("salts hashes (same password, different hash)", async () => {
    // Long enough that the hash accidentally containing the password by
    // chance is negligible (~1e-11), unlike a short password such as "pw".
    const password = "correct horse battery staple";
    const a = await hashUserPassword(password);
    const b = await hashUserPassword(password);
    expect(a).not.toBe(b);
    expect(a).not.toContain(password);
  });
});
