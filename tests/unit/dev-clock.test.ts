import { describe, it, expect, afterEach, vi } from "vitest";
import {
  parseTimeOffset,
  nowWithOffset,
  requestNow,
  readTimeOffsetCookie,
  TIME_OFFSET_COOKIE,
} from "@/utils/dev-clock";

function withDevTools<T>(enabled: boolean, fn: () => T): T {
  const prev = process.env.SB_ENABLE_DEV_TOOLS;
  process.env.SB_ENABLE_DEV_TOOLS = enabled ? "1" : "";
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.SB_ENABLE_DEV_TOOLS;
    else process.env.SB_ENABLE_DEV_TOOLS = prev;
  }
}

function reqWithCookie(cookie: string): Request {
  return new Request("https://example.test/", { headers: { cookie } });
}

describe("parseTimeOffset", () => {
  it("returns 0 when dev tools are disabled, even with a valid cookie", () => {
    withDevTools(false, () => {
      expect(parseTimeOffset("86400000")).toBe(0);
    });
  });

  it("returns the numeric offset when dev tools are enabled", () => {
    withDevTools(true, () => {
      expect(parseTimeOffset("86400000")).toBe(86_400_000);
      expect(parseTimeOffset("-3600000")).toBe(-3_600_000);
    });
  });

  it("returns 0 for absent or non-numeric values", () => {
    withDevTools(true, () => {
      expect(parseTimeOffset(undefined)).toBe(0);
      expect(parseTimeOffset(null)).toBe(0);
      expect(parseTimeOffset("")).toBe(0);
      expect(parseTimeOffset("not-a-number")).toBe(0);
    });
  });
});

describe("nowWithOffset", () => {
  afterEach(() => vi.useRealTimers());

  it("applies the offset to the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    expect(nowWithOffset(86_400_000).toISOString()).toBe(
      "2026-01-02T00:00:00.000Z"
    );
  });
});

describe("readTimeOffsetCookie", () => {
  it("extracts the override value among other cookies", () => {
    const req = reqWithCookie(`site-auth=abc; ${TIME_OFFSET_COOKIE}=123; x=y`);
    expect(readTimeOffsetCookie(req)).toBe("123");
  });

  it("returns undefined when the cookie is absent", () => {
    expect(
      readTimeOffsetCookie(reqWithCookie("site-auth=abc"))
    ).toBeUndefined();
  });
});

describe("requestNow", () => {
  afterEach(() => vi.useRealTimers());

  it("shifts now by the request's override offset", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    withDevTools(true, () => {
      const req = reqWithCookie(`${TIME_OFFSET_COOKIE}=86400000`);
      expect(requestNow(req).toISOString()).toBe("2026-01-02T00:00:00.000Z");
    });
  });

  it("ignores the override when dev tools are disabled", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    withDevTools(false, () => {
      const req = reqWithCookie(`${TIME_OFFSET_COOKIE}=86400000`);
      expect(requestNow(req).toISOString()).toBe("2026-01-01T00:00:00.000Z");
    });
  });
});
