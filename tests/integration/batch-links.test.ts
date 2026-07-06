import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("locations.listEventIdsByLocations", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns event ids grouped per location in one call", async () => {
    const eventA = await createEvent();
    const eventB = await createEvent();
    const l1 = await createLocation();
    const l2 = await createLocation();
    const l3 = await createLocation();
    const repos = getRepositories();
    await repos.locations.setEventIds(l1.id, [eventA.id, eventB.id]);
    await repos.locations.setEventIds(l2.id, [eventB.id]);

    const result = await repos.locations.listEventIdsByLocations([
      l1.id,
      l2.id,
      l3.id,
    ]);

    expect(result.get(l1.id)?.sort()).toEqual([eventA.id, eventB.id].sort());
    expect(result.get(l2.id)).toEqual([eventB.id]);
    expect(result.get(l3.id)).toEqual([]);
  });

  it("returns an empty map for no locations", async () => {
    const result = await getRepositories().locations.listEventIdsByLocations(
      []
    );
    expect(result.size).toBe(0);
  });
});

describe("locations.countSessionLinksByLocations", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns session-link counts per location in one call", async () => {
    const event = await createEvent();
    const l1 = await createLocation();
    const l2 = await createLocation();
    await createSession(event.id, { locationIds: [l1.id] });
    await createSession(event.id, { locationIds: [l1.id] });

    const repos = getRepositories();
    const result = await repos.locations.countSessionLinksByLocations([
      l1.id,
      l2.id,
    ]);

    expect(result.get(l1.id)).toBe(2);
    expect(result.get(l2.id)).toBe(0);
  });

  it("returns an empty map for no locations", async () => {
    const result =
      await getRepositories().locations.countSessionLinksByLocations([]);
    expect(result.size).toBe(0);
  });
});

describe("guests.listEventsByGuests", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns events grouped per guest, ordered by event name", async () => {
    const eventB = await createEvent({ name: "Beta" });
    const eventA = await createEvent({ name: "Alpha" });
    const g1 = await createGuest();
    const g2 = await createGuest();
    const g3 = await createGuest();
    const repos = getRepositories();
    await repos.guests.assignToEvent(eventA.id, [g1.id]);
    await repos.guests.assignToEvent(eventB.id, [g1.id, g2.id]);

    const result = await repos.guests.listEventsByGuests([g1.id, g2.id, g3.id]);

    expect(result.get(g1.id)).toEqual([
      { id: eventA.id, name: "Alpha" },
      { id: eventB.id, name: "Beta" },
    ]);
    expect(result.get(g2.id)).toEqual([{ id: eventB.id, name: "Beta" }]);
    expect(result.get(g3.id)).toEqual([]);
  });

  it("returns an empty map for no guests", async () => {
    const result = await getRepositories().guests.listEventsByGuests([]);
    expect(result.size).toBe(0);
  });
});

describe("rsvps.listBySessions", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns RSVPs grouped per session in one call", async () => {
    const event = await createEvent();
    const g1 = await createGuest();
    const g2 = await createGuest();
    const s1 = await createSession(event.id);
    const s2 = await createSession(event.id);
    const s3 = await createSession(event.id);
    const repos = getRepositories();
    await repos.rsvps.create({ sessionId: s1.id, guestId: g1.id });
    await repos.rsvps.create({ sessionId: s1.id, guestId: g2.id });
    await repos.rsvps.create({ sessionId: s2.id, guestId: g1.id });

    const result = await repos.rsvps.listBySessions([s1.id, s2.id, s3.id]);

    expect(
      result
        .get(s1.id)
        ?.map((r) => r.guestId)
        .sort()
    ).toEqual([g1.id, g2.id].sort());
    expect(result.get(s2.id)?.map((r) => r.guestId)).toEqual([g1.id]);
    expect(result.get(s3.id)).toEqual([]);
  });

  it("returns an empty map for no sessions", async () => {
    const result = await getRepositories().rsvps.listBySessions([]);
    expect(result.size).toBe(0);
  });
});
