import { describe, it, expect, afterEach, vi } from "vitest";
import {
  createGuestCookie,
  createGuestLogoutCookie,
  readGuestCookie,
  GUEST_COOKIE_NAME,
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

describe("guest cookie", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("reads back the guest id and level it was issued for", async () => {
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    const verified = await createGuestCookie("guest-1", "verified");
    expect(verified.name).toBe(GUEST_COOKIE_NAME);
    expect(await readGuestCookie(verified.value)).toEqual({
      guestId: "guest-1",
      level: "verified",
    });

    const open = await createGuestCookie("guest-1", "open");
    expect(await readGuestCookie(open.value)).toEqual({
      guestId: "guest-1",
      level: "open",
    });
  });

  it("rejects a tampered or forged verified cookie", async () => {
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    const cookie = await createGuestCookie("guest-1", "verified");
    // Truncated signature.
    expect(await readGuestCookie(cookie.value.slice(0, -2))).toBeNull();
    // A "verified" claim without a real signature can't be forged.
    expect(await readGuestCookie("verified.guest-1.123.notasig")).toBeNull();
    expect(await readGuestCookie(undefined)).toBeNull();
  });

  it("an open cookie is unsigned and needs no secret", async () => {
    // No AUTH_SECRET stubbed on purpose.
    const cookie = await createGuestCookie("guest-1", "open");
    expect(cookie.value).toBe("open.guest-1");
    expect(await readGuestCookie(cookie.value)).toEqual({
      guestId: "guest-1",
      level: "open",
    });
  });

  it("fails closed (never throws) on a forged verified cookie with no secret", async () => {
    // A passwordless site with no protected guests: AUTH_SECRET is unset (the
    // test env otherwise provides one). A client-forged `verified` value with a
    // current timestamp reaches the signature check — which needs a secret it
    // doesn't have. That must be treated as an invalid cookie, not crash.
    vi.stubEnv("AUTH_SECRET", "");
    const forged = `verified.guest-1.${Date.now()}.AAAA`;
    expect(await readGuestCookie(forged)).toBeNull();
  });

  it("is httpOnly and long-lived; the logout cookie expires immediately", async () => {
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    const cookie = await createGuestCookie("guest-1", "verified");
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.maxAge).toBeGreaterThan(0);
    expect(createGuestLogoutCookie().maxAge).toBe(0);
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
