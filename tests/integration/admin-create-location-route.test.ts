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
import { DEFAULT_LOCATION_COLOR } from "@/utils/location-colors";
import { POST } from "@/app/api/admin/create-location/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function makeReq(body: unknown): Request {
  return new Request("http://test/api/admin/create-location", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function readJson(res: Response): Promise<{ id: string }> {
  return (await res.json()) as { id: string };
}

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

describe("POST /api/admin/create-location", () => {
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
    const res = await POST(makeReq({ name: "Main Hall" }));
    expect(res.status).toBe(401);
    expect(await getRepositories().locations.list()).toEqual([]);
  });

  it("creates a location with defaults and returns its id", async () => {
    const res = await POST(makeReq({ name: "Main Hall" }));
    expect(res.status).toBe(200);
    const body = await readJson(res);

    const location = await getRepositories().locations.findById(body.id);
    expect(location?.name).toBe("Main Hall");
    expect(location?.capacity).toBe(0);
    expect(location?.color).toBe(DEFAULT_LOCATION_COLOR);
    expect(location?.hidden).toBe(false);
    expect(location?.bookable).toBe(false);
    expect(location?.sortIndex).toBe(0);
  });

  it("accepts explicit fields and auto-increments sortIndex", async () => {
    await POST(makeReq({ name: "Main Hall" }));
    const res = await POST(
      makeReq({
        name: "Workshop Room",
        description: "First floor",
        areaDescription: "North wing",
        capacity: 25,
        color: "blue",
        hidden: true,
        bookable: true,
      })
    );
    const { id } = await readJson(res);

    const location = await getRepositories().locations.findById(id);
    expect(location?.description).toBe("First floor");
    expect(location?.areaDescription).toBe("North wing");
    expect(location?.capacity).toBe(25);
    expect(location?.color).toBe("blue");
    expect(location?.hidden).toBe(true);
    expect(location?.bookable).toBe(true);
    expect(location?.sortIndex).toBe(1);
  });

  it("creates a new location even when the name matches an existing one", async () => {
    const first = await readJson(
      await POST(makeReq({ name: "Main Hall", capacity: 100 }))
    );
    const res = await POST(makeReq({ name: "main hall", capacity: 5 }));
    const body = await readJson(res);
    expect(body.id).not.toBe(first.id);

    const all = await getRepositories().locations.list();
    expect(all.map((l) => l.name)).toEqual(["Main Hall", "main hall"]);
    expect(all.map((l) => l.capacity)).toEqual([100, 5]);
  });

  it("assigns the location to the event when eventSlug is given", async () => {
    const event = await createEvent();
    const res = await POST(
      makeReq({ name: "Main Hall", eventSlug: event.slug })
    );
    const { id } = await readJson(res);

    const assigned = await getRepositories().locations.listLocationIdsByEvent(
      event.id
    );
    expect(assigned).toContain(id);
  });

  it("creates a new location and assigns it to the event, even when the name matches an existing location", async () => {
    const first = await readJson(await POST(makeReq({ name: "Main Hall" })));
    const event = await createEvent();
    const res = await POST(
      makeReq({ name: "Main Hall", eventSlug: event.slug })
    );
    const body = await readJson(res);
    expect(body.id).not.toBe(first.id);

    const assigned = await getRepositories().locations.listLocationIdsByEvent(
      event.id
    );
    expect(assigned).toEqual([body.id]);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await POST(
      makeReq({ name: "Main Hall", eventSlug: "does-not-exist" })
    );
    expect(res.status).toBe(404);
    expect(await getRepositories().locations.list()).toEqual([]);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(
      new Request("http://test/api/admin/create-location", {
        method: "POST",
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it.each([
    ["missing name", { name: "  " }],
    ["negative capacity", { name: "Main Hall", capacity: -1 }],
    ["non-integer capacity", { name: "Main Hall", capacity: 1.5 }],
    ["non-string name", { name: 123 }],
    ["non-string description", { name: "Main Hall", description: 123 }],
    ["non-string areaDescription", { name: "Main Hall", areaDescription: 123 }],
    ["non-string color", { name: "Main Hall", color: 123 }],
    ["non-string eventSlug", { name: "Main Hall", eventSlug: 123 }],
  ])("rejects %s with 400", async (_label, body) => {
    const res = await POST(makeReq(body));
    expect(res.status).toBe(400);
    expect(await getRepositories().locations.list()).toEqual([]);
  });
});
