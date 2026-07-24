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
import { getRepositories } from "@/db/container";
import { callThroughProxy } from "../helpers/through-proxy";
import { POST } from "@/app/api/admin/create-event/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars
const PATH = "/api/admin/create-event";

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
): Promise<{ id: string; slug: string } | { error: string }> {
  return (await res.json()) as { id: string; slug: string } | { error: string };
}

const VALID_BODY = {
  name: "Summer Camp",
  start: "2026-09-01T00:00:00Z",
  end: "2026-09-03T00:00:00Z",
};

describe("POST /api/admin/create-event", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    const res = await postJson(VALID_BODY, { authed: false });
    expect(res.status).toBe(401);
    expect(await getRepositories().events.list()).toEqual([]);
  });

  it("creates an event with defaults and returns id and slug", async () => {
    const res = await postJson(VALID_BODY);
    expect(res.status).toBe(201);
    const body = (await readJson(res)) as { id: string; slug: string };
    expect(body.slug).toBe("Summer-Camp");

    const event = await getRepositories().events.findBySlug("Summer-Camp");
    expect(event?.id).toBe(body.id);
    expect(event?.name).toBe("Summer Camp");
    expect(event?.start).toEqual(new Date("2026-09-01T00:00:00Z"));
    expect(event?.end).toEqual(new Date("2026-09-03T00:00:00Z"));
    expect(event?.timezone).toBe("UTC");
    expect(event?.maxSessionDuration).toBe(120);
    expect(event?.breakMinutes).toBe(10);
    expect(event?.slotIncrementMinutes).toBe(30);
    // Phase-less so admin seeding and RSVPs work immediately.
    expect(event?.schedulingPhaseStart).toBeUndefined();
    expect(event?.schedulingPhaseEnd).toBeUndefined();
  });

  it("adds an https:// scheme to a bare website domain", async () => {
    const res = await postJson({ ...VALID_BODY, website: "example.com" });
    expect(res.status).toBe(201);
    const event = await getRepositories().events.findBySlug("Summer-Camp");
    expect(event?.website).toBe("https://example.com");
  });

  it("keeps an already-schemed website URL unchanged", async () => {
    const res = await postJson({
      ...VALID_BODY,
      website: "https://example.com",
    });
    expect(res.status).toBe(201);
    const event = await getRepositories().events.findBySlug("Summer-Camp");
    expect(event?.website).toBe("https://example.com");
  });

  it("accepts explicit timezone, durations and scheduling phase", async () => {
    const res = await postJson({
      ...VALID_BODY,
      timezone: "Europe/Berlin",
      maxSessionDuration: 90,
      breakMinutes: 0,
      slotIncrementMinutes: 15,
      schedulingPhaseStart: "2026-08-01T00:00:00Z",
      schedulingPhaseEnd: "2026-09-03T00:00:00Z",
    });
    expect(res.status).toBe(201);
    const { id } = (await readJson(res)) as { id: string; slug: string };

    const event = await getRepositories().events.findById(id);
    expect(event?.timezone).toBe("Europe/Berlin");
    expect(event?.maxSessionDuration).toBe(90);
    expect(event?.breakMinutes).toBe(0);
    expect(event?.slotIncrementMinutes).toBe(15);
    expect(event?.schedulingPhaseStart).toEqual(
      new Date("2026-08-01T00:00:00Z")
    );
    expect(event?.schedulingPhaseEnd).toEqual(new Date("2026-09-03T00:00:00Z"));
  });

  it("rejects with 409 when the slug already exists", async () => {
    const first = (await readJson(await postJson(VALID_BODY))) as {
      id: string;
      slug: string;
    };
    const res = await postJson({
      ...VALID_BODY,
      name: "Summer Camp",
      breakMinutes: 42,
    });
    expect(res.status).toBe(409);
    const body = (await readJson(res)) as { error: string };
    expect(body.error).toMatch(/already exists/);
    // The existing event is not updated.
    const event = await getRepositories().events.findById(first.id);
    expect(event?.breakMinutes).toBe(10);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it.each([
    ["missing name", { ...VALID_BODY, name: "  " }],
    ["non-string name", { ...VALID_BODY, name: 123 }],
    ["name without letters or numbers", { ...VALID_BODY, name: "!!!" }],
    ["reserved slug", { ...VALID_BODY, name: "Admin" }],
    ["invalid start", { ...VALID_BODY, start: "not-a-date" }],
    ["end before start", { ...VALID_BODY, end: "2026-08-31T00:00:00Z" }],
    ["invalid timezone", { ...VALID_BODY, timezone: "Mars/Olympus" }],
    [
      "non-positive maxSessionDuration",
      { ...VALID_BODY, maxSessionDuration: 0 },
    ],
    ["negative breakMinutes", { ...VALID_BODY, breakMinutes: -1 }],
    ["invalid slot increment", { ...VALID_BODY, slotIncrementMinutes: 20 }],
    [
      "scheduling phase end before start",
      {
        ...VALID_BODY,
        schedulingPhaseStart: "2026-09-01T00:00:00Z",
        schedulingPhaseEnd: "2026-08-01T00:00:00Z",
      },
    ],
  ])("rejects %s with 400", async (_label, body) => {
    const res = await postJson(body);
    expect(res.status).toBe(400);
    expect(await getRepositories().events.list()).toEqual([]);
  });
});
