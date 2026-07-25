import { describe, it, expect, beforeEach } from "vitest";
import {
  clientKeyFromHeaders,
  isLoginBlocked,
  recordLoginFailure,
  resetLoginRateLimiter,
  LOGIN_FAILURE_WINDOW_MS,
  MAX_LOGIN_FAILURES_PER_CLIENT,
  MAX_LOGIN_FAILURES_GLOBAL,
} from "@/utils/login-rate-limit";

const T0 = Date.parse("2026-07-25T12:00:00Z");

describe("login rate limiter", () => {
  beforeEach(() => resetLoginRateLimiter());

  it("allows attempts before any failure", () => {
    expect(isLoginBlocked("site", "1.2.3.4", T0)).toBe(false);
  });

  it("blocks a client after too many failures inside the window", () => {
    for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
      expect(isLoginBlocked("site", "1.2.3.4", T0 + i)).toBe(false);
      recordLoginFailure("site", "1.2.3.4", T0 + i);
    }
    expect(isLoginBlocked("site", "1.2.3.4", T0 + 1000)).toBe(true);
  });

  it("keeps other clients unaffected", () => {
    for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
      recordLoginFailure("site", "1.2.3.4", T0);
    }
    expect(isLoginBlocked("site", "5.6.7.8", T0)).toBe(false);
  });

  it("keeps scopes independent", () => {
    for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
      recordLoginFailure("admin", "1.2.3.4", T0);
    }
    expect(isLoginBlocked("admin", "1.2.3.4", T0)).toBe(true);
    expect(isLoginBlocked("site", "1.2.3.4", T0)).toBe(false);
  });

  it("unblocks once the window has passed", () => {
    for (let i = 0; i < MAX_LOGIN_FAILURES_PER_CLIENT; i++) {
      recordLoginFailure("site", "1.2.3.4", T0);
    }
    expect(isLoginBlocked("site", "1.2.3.4", T0 + 1)).toBe(true);
    expect(
      isLoginBlocked("site", "1.2.3.4", T0 + LOGIN_FAILURE_WINDOW_MS)
    ).toBe(false);
  });

  it("blocks a whole scope when failures spread across many clients", () => {
    for (let i = 0; i < MAX_LOGIN_FAILURES_GLOBAL; i++) {
      recordLoginFailure("admin", `10.0.0.${i}`, T0);
    }
    expect(isLoginBlocked("admin", "never-seen-before", T0 + 1)).toBe(true);
  });
});

describe("clientKeyFromHeaders", () => {
  it("uses the last x-forwarded-for hop (the one the trusted proxy appended)", () => {
    const headers = new Headers({
      "x-forwarded-for": "6.6.6.6, 203.0.113.9",
    });
    expect(clientKeyFromHeaders(headers)).toBe("203.0.113.9");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "203.0.113.9" });
    expect(clientKeyFromHeaders(headers)).toBe("203.0.113.9");
  });

  it("falls back to a fixed key when no header is present", () => {
    expect(clientKeyFromHeaders(new Headers())).toBe("unknown");
  });
});
