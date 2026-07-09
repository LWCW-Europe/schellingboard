import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { setupTestDb, resetTestDb } from "../helpers/db";
import { POST } from "@/app/api/auth/login/route";
import {
  isAuthCookieValid,
  isAdminCookieValid,
  AUTH_COOKIE_NAME,
  ADMIN_COOKIE_NAME,
} from "@/utils/auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function makeReq(body: unknown): Request {
  return new Request("http://test/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("SITE_PASSWORD", "site-pw");
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("sets a valid site cookie for the correct site password", async () => {
    const res = await POST(makeReq({ password: "site-pw" }));
    expect(res.status).toBe(200);
    const cookie = res.cookies.get(AUTH_COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(await isAuthCookieValid(cookie!.value)).toBe(true);
  });

  it("rejects a wrong site password with 401 and no cookie", async () => {
    const res = await POST(makeReq({ password: "nope" }));
    expect(res.status).toBe(401);
    expect(res.cookies.get(AUTH_COOKIE_NAME)).toBeUndefined();
  });

  it("sets a valid admin cookie for scope=admin with the correct password", async () => {
    const res = await POST(makeReq({ password: "admin-pw", scope: "admin" }));
    expect(res.status).toBe(200);
    const cookie = res.cookies.get(ADMIN_COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(await isAdminCookieValid(cookie!.value)).toBe(true);
  });

  it("rejects a wrong admin password with 401", async () => {
    const res = await POST(makeReq({ password: "nope", scope: "admin" }));
    expect(res.status).toBe(401);
    expect(res.cookies.get(ADMIN_COOKIE_NAME)).toBeUndefined();
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(
      new Request("http://test/api/auth/login", {
        method: "POST",
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a null JSON body with 400", async () => {
    const res = await POST(makeReq(null));
    expect(res.status).toBe(400);
  });

  it("rejects an unknown scope with 400", async () => {
    const res = await POST(makeReq({ password: "site-pw", scope: "Admin" }));
    expect(res.status).toBe(400);
  });

  it("returns 403 for scope=admin when admin is disabled", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    const res = await POST(makeReq({ password: "whatever", scope: "admin" }));
    expect(res.status).toBe(403);
  });
});
