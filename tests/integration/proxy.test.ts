import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ADMIN_VERIFIED_HEADER, createAdminAuthCookie } from "@/utils/auth";
import { throughProxy } from "../helpers/through-proxy";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

describe("proxy: /api/admin/* auth", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", "site-pw");
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("allows a request carrying only the admin cookie (no site cookie) and forwards a trusted header", async () => {
    const admin = await createAdminAuthCookie();
    const result = await throughProxy("/api/admin/create-guest", {}, [admin]);
    if (!result.ok) throw new Error("expected proxy to forward the request");
    expect(result.request.headers.get(ADMIN_VERIFIED_HEADER)).toBe("1");
  });

  it("returns a no-store JSON 401 (not an HTML redirect) when the admin cookie is missing", async () => {
    const result = await throughProxy("/api/admin/create-guest", {}, []);
    if (result.ok) throw new Error("expected proxy to reject the request");
    expect(result.response.status).toBe(401);
    expect(result.response.headers.get("location")).toBeNull();
    expect(result.response.headers.get("cache-control")).toBe("no-store");
    expect(await result.response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns a no-store 404 when the admin feature is disabled, without touching site auth", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    const result = await throughProxy("/api/admin/create-guest", {}, []);
    if (result.ok) throw new Error("expected proxy to reject the request");
    expect(result.response.status).toBe(404);
    expect(result.response.headers.get("cache-control")).toBe("no-store");
  });

  it("also gates the exact /api/admin path (no trailing segment)", async () => {
    const result = await throughProxy("/api/admin", {}, []);
    if (result.ok) throw new Error("expected proxy to reject the request");
    expect(result.response.status).toBe(401);
  });

  it("still requires site auth for non-admin API routes", async () => {
    const admin = await createAdminAuthCookie();
    const result = await throughProxy("/api/votes", {}, [admin]);
    if (result.ok) throw new Error("expected proxy to redirect the request");
    expect(result.response.headers.get("location")).toMatch(/\/login/);
  });

  it("strips a client-forged admin-verified header from every forwarded request", async () => {
    const result = await throughProxy("/api/health", {
      headers: { [ADMIN_VERIFIED_HEADER]: "1" },
    });
    if (!result.ok) throw new Error("expected proxy to forward the request");
    expect(result.request.headers.get(ADMIN_VERIFIED_HEADER)).toBeNull();
  });

  it("rejects a request whose Origin header doesn't match the request's own origin (CSRF)", async () => {
    const admin = await createAdminAuthCookie();
    const result = await throughProxy(
      "/api/admin/create-guest",
      { headers: { origin: "https://evil.example" } },
      [admin]
    );
    if (result.ok) throw new Error("expected proxy to reject the request");
    expect(result.response.status).toBe(403);
    expect(result.response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects a cross-site request flagged by Sec-Fetch-Site even without an Origin header", async () => {
    const admin = await createAdminAuthCookie();
    const result = await throughProxy(
      "/api/admin/create-guest",
      { headers: { "sec-fetch-site": "cross-site" } },
      [admin]
    );
    if (result.ok) throw new Error("expected proxy to reject the request");
    expect(result.response.status).toBe(403);
  });

  it("allows a request with a matching Origin header", async () => {
    const admin = await createAdminAuthCookie();
    const result = await throughProxy(
      "/api/admin/create-guest",
      { headers: { origin: "http://test" } },
      [admin]
    );
    if (!result.ok) throw new Error("expected proxy to forward the request");
  });

  it("allows a script request with neither Origin nor Sec-Fetch-Site header", async () => {
    const admin = await createAdminAuthCookie();
    const result = await throughProxy("/api/admin/create-guest", {}, [admin]);
    if (!result.ok) throw new Error("expected proxy to forward the request");
  });
});
