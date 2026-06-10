import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "@/utils/auth";

describe("safeRedirectPath", () => {
  it("keeps a plain same-origin path", () => {
    expect(safeRedirectPath("/sessions", "/")).toBe("/sessions");
  });

  it("preserves query string and hash", () => {
    expect(safeRedirectPath("/sessions?view=grid#top", "/")).toBe(
      "/sessions?view=grid#top"
    );
  });

  it("returns the fallback for empty/missing values", () => {
    expect(safeRedirectPath("", "/")).toBe("/");
    expect(safeRedirectPath(null, "/admin")).toBe("/admin");
    expect(safeRedirectPath(undefined, "/admin")).toBe("/admin");
  });

  it("rejects absolute URLs", () => {
    expect(safeRedirectPath("https://evil.com", "/")).toBe("/");
  });

  // Open-redirect bypass vectors (see helper doc comment).
  it.each([
    ["//evil.com"],
    ["/\\evil.com"], // backslash → browsers read as "//"
    ["/\t/evil.com"], // tab stripped → "//"
    ["////evil.com"],
    [" //evil.com"],
    ["/..//evil.com"], // path normalization re-introduces "//"
    ["/\\/evil.com"],
    ["/\r//evil.com"],
  ])("neutralizes off-site vector %j", (vector) => {
    const result = safeRedirectPath(vector, "/");
    expect(result.startsWith("//")).toBe(false);
    expect(/^\/\\/.test(result)).toBe(false);
  });

  // Reviewer-reported vector: /login?redirect=/%5Cevil.com.
  // searchParams/formData URL-decode %5C to a backslash before it reaches the
  // action, and the browser reads "/\evil.com" as "//evil.com".
  it("neutralizes the %5C (backslash) vector after URL decoding", () => {
    const decoded = decodeURIComponent("/%5Cevil.com"); // "/\evil.com"
    expect(safeRedirectPath(decoded, "/")).toBe("/");
  });

  // The raw, still-encoded form is harmless: %5C stays in the path, so it is a
  // genuine same-origin path rather than an off-site redirect.
  it("treats a still-encoded %5C as a same-origin path", () => {
    expect(safeRedirectPath("/%5Cevil.com", "/")).toBe("/%5Cevil.com");
  });
});
