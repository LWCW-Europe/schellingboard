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
import { createEvent } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { callThroughProxy } from "../helpers/through-proxy";
import { POST } from "@/app/api/admin/create-guest/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars
const PATH = "/api/admin/create-guest";

function post(rawBody: string, opts?: { authed?: boolean }): Promise<Response> {
  return callThroughProxy(POST, PATH, { method: "POST", body: rawBody }, opts);
}

function postJson(
  body: unknown,
  opts?: { authed?: boolean }
): Promise<Response> {
  return post(JSON.stringify(body), opts);
}

async function readJson(
  res: Response
): Promise<{ id: string; created: boolean }> {
  return (await res.json()) as { id: string; created: boolean };
}

describe("POST /api/admin/create-guest", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    const res = await postJson(
      { name: "Tom", email: "tom@foocorp.com" },
      { authed: false }
    );
    expect(res.status).toBe(401);
    expect(
      await getRepositories().guests.findByEmail("tom@foocorp.com")
    ).toBeUndefined();
  });

  it("creates a guest and returns its id", async () => {
    const res = await postJson({
      name: "Tom Tailor",
      email: "tom.tailor@foocorp.com",
    });
    expect(res.status).toBe(201);
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
      await postJson({ name: "Tom", email: "tom@foocorp.com" })
    );
    const res = await postJson({
      name: "Tom Different",
      email: "tom@foocorp.com",
    });
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.created).toBe(false);
    expect(body.id).toBe(first.id);
  });

  it("assigns the guest to the event when eventSlug is given", async () => {
    const event = await createEvent({ phase: "voting" });
    const res = await postJson({
      name: "Anna Beck",
      email: "anna.beck@foocorp.com",
      eventSlug: event.slug,
    });
    const body = await readJson(res);
    const members = await getRepositories().guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(body.id);
  });

  it("matches existing emails case-insensitively", async () => {
    const first = await readJson(
      await postJson({ name: "Tom", email: "tom@foocorp.com" })
    );
    const res = await postJson({ name: "Tom", email: "Tom@Foocorp.com" });
    const body = await readJson(res);
    expect(body.created).toBe(false);
    expect(body.id).toBe(first.id);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email with 400", async () => {
    const res = await postJson({ name: "Bad", email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("rejects a missing name with 400", async () => {
    const res = await postJson({ name: "  ", email: "x@foocorp.com" });
    expect(res.status).toBe(400);
  });

  it("rejects a non-string name with 400", async () => {
    const res = await postJson({ name: 123, email: "x@foocorp.com" });
    expect(res.status).toBe(400);
  });

  it("rejects a non-string email with 400", async () => {
    const res = await postJson({ name: "Tom", email: 123 });
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await postJson({
      name: "X",
      email: "x@foocorp.com",
      eventSlug: "does-not-exist",
    });
    expect(res.status).toBe(404);
  });
});
