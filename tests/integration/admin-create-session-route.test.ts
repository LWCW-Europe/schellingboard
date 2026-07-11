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
import {
  createEvent,
  createGuest,
  createLocation,
  createDay,
} from "../helpers/factories";
import type { Event, Guest, Location } from "@/db/repositories/interfaces";
import { getRepositories } from "@/db/container";
import { callThroughProxy } from "../helpers/through-proxy";
import { POST } from "@/app/api/admin/create-session/route";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars
const PATH = "/api/admin/create-session";

function post(rawBody: string, opts?: { authed?: boolean }): Promise<Response> {
  return callThroughProxy(POST, PATH, { method: "POST", body: rawBody }, opts);
}

function postJson(
  body: unknown,
  opts?: { authed?: boolean }
): Promise<Response> {
  return post(JSON.stringify(body), opts);
}

async function readJson(res: Response): Promise<{ id: string }> {
  return (await res.json()) as { id: string };
}

describe("POST /api/admin/create-session", () => {
  beforeAll(() => setupTestDb());

  let event: Event;
  let host: Guest;
  let room: Location;

  beforeEach(async () => {
    resetTestDb();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    event = await createEvent();
    host = await createGuest();
    room = await createLocation({ capacity: 12 });
  });

  afterEach(() => vi.unstubAllEnvs());

  function validBody() {
    return {
      eventSlug: event.slug,
      title: "Intro to Juggling",
      description: "Bring three balls",
      startTime: "2026-09-01T10:00:00Z",
      endTime: "2026-09-01T11:00:00Z",
      hostIds: [host.id],
      locationIds: [room.id],
    };
  }

  it("rejects the request without an admin cookie", async () => {
    const res = await postJson(validBody(), { authed: false });
    expect(res.status).toBe(401);
    expect(await getRepositories().sessions.listByEvent(event.id)).toEqual([]);
  });

  it("creates a session and returns its id", async () => {
    const res = await postJson(validBody());
    expect(res.status).toBe(201);
    const body = await readJson(res);

    const session = await getRepositories().sessions.findById(body.id);
    expect(session?.title).toBe("Intro to Juggling");
    expect(session?.description).toBe("Bring three balls");
    expect(session?.startTime).toEqual(new Date("2026-09-01T10:00:00Z"));
    expect(session?.endTime).toEqual(new Date("2026-09-01T11:00:00Z"));
    expect(session?.eventId).toBe(event.id);
    expect(session?.hosts.map((h) => h.id)).toEqual([host.id]);
    expect(session?.locations.map((l) => l.id)).toEqual([room.id]);
    // adminManaged is opt-in via the request; omitting it defaults to false.
    expect(session?.adminManaged).toBe(false);
    expect(session?.blocker).toBe(false);
    expect(session?.closed).toBe(false);
    // Capacity defaults to the first location's capacity.
    expect(session?.capacity).toBe(12);
  });

  it("assigns hosts and locations to the event", async () => {
    await postJson(validBody());
    const repos = getRepositories();
    const members = await repos.guests.listByEvent(event.id);
    expect(members.map((g) => g.id)).toContain(host.id);
    const rooms = await repos.locations.listLocationIdsByEvent(event.id);
    expect(rooms).toContain(room.id);
  });

  it("accepts explicit capacity, adminManaged and closed", async () => {
    const res = await postJson({
      ...validBody(),
      capacity: 5,
      adminManaged: true,
      closed: true,
    });
    const { id } = await readJson(res);
    const session = await getRepositories().sessions.findById(id);
    expect(session?.capacity).toBe(5);
    expect(session?.adminManaged).toBe(true);
    expect(session?.closed).toBe(true);
  });

  it("defaults capacity to 0 without a location", async () => {
    const res = await postJson({ ...validBody(), locationIds: [] });
    const { id } = await readJson(res);
    const session = await getRepositories().sessions.findById(id);
    expect(session?.capacity).toBe(0);
  });

  it("creates a new session even when title and start time match an existing one in a different location", async () => {
    const first = await readJson(await postJson(validBody()));
    const otherRoom = await createLocation({ capacity: 20 });
    const res = await postJson({
      ...validBody(),
      locationIds: [otherRoom.id],
    });
    expect(res.status).toBe(201);
    const body = await readJson(res);
    expect(body.id).not.toBe(first.id);
    expect(await getRepositories().sessions.listByEvent(event.id)).toHaveLength(
      2
    );
  });

  it("rejects an overlapping session in the same location with 409", async () => {
    await postJson(validBody());
    const res = await postJson({
      ...validBody(),
      title: "Advanced Juggling",
      startTime: "2026-09-01T10:30:00Z",
      endTime: "2026-09-01T11:30:00Z",
    });
    expect(res.status).toBe(409);
    expect(await getRepositories().sessions.listByEvent(event.id)).toHaveLength(
      1
    );
  });

  it("rejects a repeated identical request with 409 instead of silently reusing it", async () => {
    await postJson(validBody());
    const res = await postJson(validBody());
    expect(res.status).toBe(409);
    expect(await getRepositories().sessions.listByEvent(event.id)).toHaveLength(
      1
    );
  });

  it("rejects times misaligned with the event's slot grid", async () => {
    await createDay(event.id, {
      start: new Date("2026-09-01T08:00:00Z"),
      end: new Date("2026-09-01T18:00:00Z"),
      startBookings: new Date("2026-09-01T09:00:00Z"),
      endBookings: new Date("2026-09-01T17:00:00Z"),
    });
    const res = await postJson({
      ...validBody(),
      startTime: "2026-09-01T10:07:00Z",
      endTime: "2026-09-01T11:00:00Z",
    });
    expect(res.status).toBe(400);
    expect(await getRepositories().sessions.listByEvent(event.id)).toEqual([]);
  });

  it("returns 404 for an unknown eventSlug", async () => {
    const res = await postJson({
      ...validBody(),
      eventSlug: "does-not-exist",
    });
    expect(res.status).toBe(404);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it.each([
    ["missing title", (b: Record<string, unknown>) => ({ ...b, title: " " })],
    [
      "invalid startTime",
      (b: Record<string, unknown>) => ({ ...b, startTime: "nope" }),
    ],
    [
      "missing endTime",
      (b: Record<string, unknown>) => ({ ...b, endTime: undefined }),
    ],
    [
      "end before start",
      (b: Record<string, unknown>) => ({
        ...b,
        endTime: "2026-09-01T09:00:00Z",
      }),
    ],
    [
      "negative capacity",
      (b: Record<string, unknown>) => ({ ...b, capacity: -1 }),
    ],
    [
      "unknown hostId",
      (b: Record<string, unknown>) => ({ ...b, hostIds: ["nope"] }),
    ],
    [
      "unknown locationId",
      (b: Record<string, unknown>) => ({ ...b, locationIds: ["nope"] }),
    ],
    ["non-string title", (b: Record<string, unknown>) => ({ ...b, title: 5 })],
    [
      "non-string description",
      (b: Record<string, unknown>) => ({ ...b, description: 5 }),
    ],
    [
      "non-string eventSlug",
      (b: Record<string, unknown>) => ({ ...b, eventSlug: 5 }),
    ],
    [
      "non-array hostIds",
      (b: Record<string, unknown>) => ({ ...b, hostIds: "nope" }),
    ],
    [
      "non-array locationIds",
      (b: Record<string, unknown>) => ({ ...b, locationIds: "nope" }),
    ],
  ])("rejects %s with 400", async (_label, mutate) => {
    const res = await postJson(mutate(validBody()));
    expect(res.status).toBe(400);
    expect(await getRepositories().sessions.listByEvent(event.id)).toEqual([]);
  });
});
