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
import type { Event } from "@/db/repositories/interfaces";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import { POST } from "@/app/api/admin/create-day/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

function makeReq(body: unknown): Request {
  return new Request("http://test/api/admin/create-day", {
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

function validBody(event: Event) {
  return {
    eventSlug: event.slug,
    start: "2026-09-01T08:00:00Z",
    end: "2026-09-01T18:00:00Z",
    startBookings: "2026-09-01T09:00:00Z",
    endBookings: "2026-09-01T17:00:00Z",
  };
}

describe("POST /api/admin/create-day", () => {
  beforeAll(() => setupTestDb());

  let event: Event;

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
    event = await createEvent();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects the request without an admin cookie", async () => {
    cookieJar.clear();
    const res = await POST(makeReq(validBody(event)));
    expect(res.status).toBe(401);
    expect(await getRepositories().days.listByEvent(event.id)).toEqual([]);
  });

  it("creates a day and returns its id", async () => {
    const res = await POST(makeReq(validBody(event)));
    expect(res.status).toBe(200);
    const body = await readJson(res);

    const days = await getRepositories().days.listByEvent(event.id);
    expect(days).toHaveLength(1);
    expect(days[0].id).toBe(body.id);
    expect(days[0].start).toEqual(new Date("2026-09-01T08:00:00Z"));
    expect(days[0].end).toEqual(new Date("2026-09-01T18:00:00Z"));
    expect(days[0].startBookings).toEqual(new Date("2026-09-01T09:00:00Z"));
    expect(days[0].endBookings).toEqual(new Date("2026-09-01T17:00:00Z"));
  });

  it("allows creating multiple non-overlapping days, same as the admin UI", async () => {
    await POST(makeReq(validBody(event)));
    const res = await POST(
      makeReq({
        ...validBody(event),
        start: "2026-09-02T08:00:00Z",
        end: "2026-09-02T18:00:00Z",
        startBookings: "2026-09-02T09:00:00Z",
        endBookings: "2026-09-02T17:00:00Z",
      })
    );
    expect(res.status).toBe(200);
    expect(await getRepositories().days.listByEvent(event.id)).toHaveLength(2);
  });

  it("rejects a day identical to an existing one with 409, same as the admin UI", async () => {
    await POST(makeReq(validBody(event)));
    const res = await POST(makeReq(validBody(event)));
    expect(res.status).toBe(409);
    expect(await getRepositories().days.listByEvent(event.id)).toHaveLength(1);
  });

  it("rejects an overlapping non-identical day with 409", async () => {
    await POST(makeReq(validBody(event)));
    const res = await POST(
      makeReq({
        ...validBody(event),
        start: "2026-09-01T09:00:00Z",
        startBookings: "2026-09-01T09:00:00Z",
      })
    );
    expect(res.status).toBe(409);
    expect(await getRepositories().days.listByEvent(event.id)).toHaveLength(1);
  });

  it("rejects a day misaligned to the event's slot increment with 400", async () => {
    // The factory event uses 30-minute slots; 18:10 is not on a boundary.
    const res = await POST(
      makeReq({ ...validBody(event), end: "2026-09-01T18:10:00Z" })
    );
    expect(res.status).toBe(400);
    expect(await getRepositories().days.listByEvent(event.id)).toEqual([]);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await POST(
      makeReq({ ...validBody(event), eventSlug: "does-not-exist" })
    );
    expect(res.status).toBe(404);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(
      new Request("http://test/api/admin/create-day", {
        method: "POST",
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
  });

  it.each([
    [
      "missing eventSlug",
      (b: ReturnType<typeof validBody>) => ({ ...b, eventSlug: "" }),
    ],
    [
      "invalid start",
      (b: ReturnType<typeof validBody>) => ({ ...b, start: "nope" }),
    ],
    [
      "end before start",
      (b: ReturnType<typeof validBody>) => ({
        ...b,
        end: "2026-09-01T07:00:00Z",
      }),
    ],
    [
      "bookings end before bookings start",
      (b: ReturnType<typeof validBody>) => ({
        ...b,
        endBookings: "2026-09-01T08:30:00Z",
      }),
    ],
    [
      "bookings outside the day window",
      (b: ReturnType<typeof validBody>) => ({
        ...b,
        startBookings: "2026-09-01T07:00:00Z",
      }),
    ],
    [
      "a non-string start (e.g. epoch millis, bypassing date parsing)",
      (b: ReturnType<typeof validBody>) => ({
        ...b,
        start: Date.parse(b.start) as unknown as string,
      }),
    ],
  ])("rejects %s with 400", async (_label, mutate) => {
    const res = await POST(makeReq(mutate(validBody(event))));
    expect(res.status).toBe(400);
    expect(await getRepositories().days.listByEvent(event.id)).toEqual([]);
  });
});
