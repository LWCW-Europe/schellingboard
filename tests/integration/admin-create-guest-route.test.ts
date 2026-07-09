import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
    }),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { POST } from "@/app/api/admin/create-guest/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function makeReq(body: unknown): Request {
  return new Request("http://test/api/admin/create-guest", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function readJson(
  res: Response
): Promise<{ id: string; created: boolean }> {
  return (await res.json()) as { id: string; created: boolean };
}

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("POST /api/admin/create-guest", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    cookieJar.clear();
    const res = await POST(makeReq({ name: "Tom", email: "tom@foocorp.com" }));
    expect(res.status).toBe(401);
    expect(
      await getRepositories().guests.findByEmail("tom@foocorp.com")
    ).toBeUndefined();
  });

  it("creates a guest and returns its id", async () => {
    const res = await POST(
      makeReq({ name: "Tom Tailor", email: "tom.tailor@foocorp.com" })
    );
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.created).toBe(true);
    expect(body.id).toBeTruthy();

    const guest = await getRepositories().guests.findByEmail(
      "tom.tailor@foocorp.com"
    );
    expect(guest?.id).toBe(body.id);
    expect(guest?.name).toBe("Tom Tailor");
  });

  it("is idempotent by email: returns the existing id with created=false", async () => {
    const first = await readJson(
      await POST(makeReq({ name: "Tom", email: "tom@foocorp.com" }))
    );
    const res = await POST(
      makeReq({ name: "Tom Different", email: "tom@foocorp.com" })
    );
    const body = await readJson(res);
    expect(body.created).toBe(false);
    expect(body.id).toBe(first.id);
  });

  it("assigns the guest to the event when eventSlug is given", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await POST(
      makeReq({
        name: "Anna Beck",
        email: "anna.beck@foocorp.com",
        eventSlug: event.slug,
      })
    );
    const body = await readJson(res);
    const members = await getRepositories().guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(body.id);
  });

  it("matches existing emails case-insensitively", async () => {
    const first = await readJson(
      await POST(makeReq({ name: "Tom", email: "tom@foocorp.com" }))
    );
    const res = await POST(makeReq({ name: "Tom", email: "Tom@Foocorp.com" }));
    const body = await readJson(res);
    expect(body.created).toBe(false);
    expect(body.id).toBe(first.id);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(
      new Request("http://test/api/admin/create-guest", {
        method: "POST",
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email with 400", async () => {
    const res = await POST(makeReq({ name: "Bad", email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("rejects a missing name with 400", async () => {
    const res = await POST(makeReq({ name: "  ", email: "x@foocorp.com" }));
    expect(res.status).toBe(400);
  });

  it("rejects a non-string name with 400", async () => {
    const res = await POST(makeReq({ name: 123, email: "x@foocorp.com" }));
    expect(res.status).toBe(400);
  });

  it("rejects a non-string email with 400", async () => {
    const res = await POST(makeReq({ name: "Tom", email: 123 }));
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await POST(
      makeReq({
        name: "X",
        email: "x@foocorp.com",
        eventSlug: "does-not-exist",
      })
    );
    expect(res.status).toBe(404);
  });
});
