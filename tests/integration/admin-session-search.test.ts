import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("sessions.searchByEvent", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns enriched sessions for the event only, ordered by title", async () => {
    const event = await createEvent();
    const other = await createEvent();
    const host = await createGuest({ name: "Alice" });
    await createSession(event.id, { title: "Zebra Talk", hostIds: [host.id] });
    await createSession(event.id, { title: "Agile Workshop" });
    await createSession(other.id, { title: "Other Event Talk" });
    const repos = getRepositories();

    const { rows, total } = await repos.sessions.searchByEvent(event.id, {
      limit: 50,
      offset: 0,
    });

    expect(total).toBe(2);
    expect(rows.map((r) => r.title)).toEqual(["Agile Workshop", "Zebra Talk"]);
    expect(rows[1].hosts.map((h) => h.name)).toEqual(["Alice"]);
  });

  it("scopes hosts, locations and rsvp counts to each session without leaking across sessions or events", async () => {
    const event = await createEvent();
    const other = await createEvent();
    const repos = getRepositories();

    const alice = await createGuest({ name: "Alice" });
    const bob = await createGuest({ name: "Bob" });
    const roomA = await createLocation({ name: "Room A" });
    const roomB = await createLocation({ name: "Room B" });

    const first = await createSession(event.id, {
      title: "First",
      hostIds: [alice.id],
      locationIds: [roomA.id],
    });
    const second = await createSession(event.id, {
      title: "Second",
      hostIds: [bob.id],
      locationIds: [roomB.id],
    });

    // Another event's session carries its own hosts/locations/rsvps that must
    // never bleed into this event's page.
    const outsider = await createSession(other.id, {
      title: "Outsider",
      hostIds: [alice.id],
      locationIds: [roomA.id],
    });

    // Distinct rsvp counts per session: 2 for First, 1 for Second, 3 elsewhere.
    for (let i = 0; i < 2; i++) {
      const g = await createGuest({ name: `first-rsvp-${i}` });
      await repos.rsvps.create({ sessionId: first.id, guestId: g.id });
    }
    const g = await createGuest({ name: "second-rsvp" });
    await repos.rsvps.create({ sessionId: second.id, guestId: g.id });
    for (let i = 0; i < 3; i++) {
      const og = await createGuest({ name: `outsider-rsvp-${i}` });
      await repos.rsvps.create({ sessionId: outsider.id, guestId: og.id });
    }

    const { rows, total } = await repos.sessions.searchByEvent(event.id, {
      limit: 50,
      offset: 0,
    });

    expect(total).toBe(2);
    const byTitle = new Map(rows.map((r) => [r.title, r]));

    const firstRow = byTitle.get("First")!;
    expect(firstRow.hosts.map((h) => h.name)).toEqual(["Alice"]);
    expect(firstRow.locations.map((l) => l.name)).toEqual(["Room A"]);
    expect(firstRow.numRsvps).toBe(2);

    const secondRow = byTitle.get("Second")!;
    expect(secondRow.hosts.map((h) => h.name)).toEqual(["Bob"]);
    expect(secondRow.locations.map((l) => l.name)).toEqual(["Room B"]);
    expect(secondRow.numRsvps).toBe(1);
  });

  it("searches title case-insensitively by substring", async () => {
    const event = await createEvent();
    await createSession(event.id, { title: "Intro to Rust" });
    await createSession(event.id, { title: "Advanced Python" });
    const repos = getRepositories();

    const { rows, total } = await repos.sessions.searchByEvent(event.id, {
      query: "rust",
      limit: 50,
      offset: 0,
    });

    expect(total).toBe(1);
    expect(rows.map((r) => r.title)).toEqual(["Intro to Rust"]);
  });

  it("matches sessions by host name", async () => {
    const event = await createEvent();
    const alice = await createGuest({ name: "Alice Smith" });
    const bob = await createGuest({ name: "Bob Jones" });
    await createSession(event.id, { title: "First", hostIds: [alice.id] });
    await createSession(event.id, { title: "Second", hostIds: [bob.id] });
    await createSession(event.id, { title: "Hostless" });
    const repos = getRepositories();

    const { rows, total } = await repos.sessions.searchByEvent(event.id, {
      query: "smith",
      limit: 50,
      offset: 0,
    });

    expect(total).toBe(1);
    expect(rows.map((r) => r.title)).toEqual(["First"]);
  });

  it("paginates via limit/offset while reporting the full total", async () => {
    const event = await createEvent();
    for (const title of ["A", "B", "C", "D", "E"]) {
      await createSession(event.id, { title });
    }
    const repos = getRepositories();

    const firstPage = await repos.sessions.searchByEvent(event.id, {
      limit: 2,
      offset: 0,
    });
    expect(firstPage.total).toBe(5);
    expect(firstPage.rows.map((r) => r.title)).toEqual(["A", "B"]);

    const secondPage = await repos.sessions.searchByEvent(event.id, {
      limit: 2,
      offset: 2,
    });
    expect(secondPage.total).toBe(5);
    expect(secondPage.rows.map((r) => r.title)).toEqual(["C", "D"]);
  });

  it("orders duplicate titles by id so pagination is stable", async () => {
    const event = await createEvent();
    const repos = getRepositories();

    // Create sessions sharing a title until insertion order differs from id
    // order, so a title tie cannot accidentally come back id-sorted without
    // an explicit tiebreaker.
    const ids: string[] = [];
    do {
      ids.push((await createSession(event.id, { title: "Dup" })).id);
    } while (
      ids.length < 2 ||
      ids.every((id, i) => i === 0 || ids[i - 1] < id)
    );

    const pagedIds: string[] = [];
    for (let offset = 0; offset < ids.length; offset++) {
      const { rows } = await repos.sessions.searchByEvent(event.id, {
        limit: 1,
        offset,
      });
      pagedIds.push(rows[0].id);
    }

    expect(pagedIds).toEqual([...ids].sort());
  });
});
