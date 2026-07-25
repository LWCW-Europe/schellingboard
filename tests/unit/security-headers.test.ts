import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config.js";

// The app serves cookie-authenticated pages, so every response must deny
// framing (clickjacking) and MIME sniffing, and avoid leaking full URLs in
// the Referer header.
describe("security headers", () => {
  it("applies clickjacking, sniffing, and referrer protections to all routes", async () => {
    const rules = await nextConfig.headers!();
    const all = rules.find((r) => r.source === "/(.*)");
    expect(all).toBeDefined();
    const byKey = Object.fromEntries(
      all!.headers.map((h) => [h.key.toLowerCase(), h.value])
    );
    expect(byKey["x-frame-options"]).toBe("DENY");
    expect(byKey["x-content-type-options"]).toBe("nosniff");
    expect(byKey["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
