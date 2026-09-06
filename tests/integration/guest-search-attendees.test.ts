import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date("2026-06-15T12:00:00.000Z");
const lastWeek = new Date(now.getTime() - 7 * DAY_MS);
const nextWeek = new Date(now.getTime() + 7 * DAY_MS);

describe("guests.listAttendees", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("flags hosts with a real boolean, not a truthy DB value", async () => {
    const host = await createGuest({ name: "Host Person" });
    await createGuest({ name: "Regular Person" });
    const event = await createEvent();
    await createSession(event.id, { hostIds: [host.id] });
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees(now);

    const byName = Object.fromEntries(rows.map((r) => [r.name, r.isHost]));
    expect(byName["Host Person"]).toBe(true);
    expect(byName["Regular Person"]).toBe(false);
  });

  it("flags anyone bookable at any event where 1-on-1s are on", async () => {
    const repos = getRepositories();
    const on = await createEvent();
    const off = await createEvent({ name: "Meetings Off" });
    await repos.events.update(on.id, { meetingsEnabled: true });
    const open = await createGuest({ name: "Open Person", eventId: on.id });
    const stale = await createGuest({ name: "Stale Person", eventId: off.id });
    await createGuest({ name: "Regular Person", eventId: on.id });
    const slot = [nextWeek];
    await repos.meetingAvailability.replaceForGuest(open.id, on.id, slot);
    // Declared while it was on, and the organizer has since switched it off.
    await repos.meetingAvailability.replaceForGuest(stale.id, off.id, slot);

    const rows = await repos.guests.listAttendees(now);

    const byName = Object.fromEntries(
      rows.map((r) => [r.name, r.openToMeetings])
    );
    expect(byName["Open Person"]).toBe(true);
    expect(byName["Stale Person"]).toBe(false);
    expect(byName["Regular Person"]).toBe(false);
  });

  it("stops flagging someone whose declared slots have all passed", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    await repos.events.update(event.id, { meetingsEnabled: true });
    const over = await createGuest({ name: "Over Person", eventId: event.id });
    const ahead = await createGuest({
      name: "Ahead Person",
      eventId: event.id,
    });
    await repos.meetingAvailability.replaceForGuest(over.id, event.id, [
      lastWeek,
    ]);
    await repos.meetingAvailability.replaceForGuest(ahead.id, event.id, [
      lastWeek,
      nextWeek,
    ]);

    const rows = await repos.guests.listAttendees(now);

    const byName = Object.fromEntries(
      rows.map((r) => [r.name, r.openToMeetings])
    );
    expect(byName["Over Person"]).toBe(false);
    expect(byName["Ahead Person"]).toBe(true);
  });

  it("stops flagging someone taken off the event they declared for", async () => {
    const repos = getRepositories();
    const event = await createEvent();
    await repos.events.update(event.id, { meetingsEnabled: true });
    const dropped = await createGuest({
      name: "Dropped Person",
      eventId: event.id,
    });
    await repos.meetingAvailability.replaceForGuest(dropped.id, event.id, [
      nextWeek,
    ]);
    await repos.guests.removeFromEvent(event.id, [dropped.id]);

    const rows = await repos.guests.listAttendees(now);

    expect(rows.find((r) => r.name === "Dropped Person")?.openToMeetings).toBe(
      false
    );
  });

  it("orders by name and never exposes the private email", async () => {
    for (const name of ["E", "C", "A", "D", "B"]) {
      await createGuest({ name });
    }
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees(now);

    expect(rows.map((r) => r.name)).toEqual(["A", "B", "C", "D", "E"]);
    for (const row of rows) {
      expect(row).not.toHaveProperty("email");
      expect(row).not.toHaveProperty("info");
    }
  });

  it("includes the public profile fields used by search", async () => {
    const guest = await createGuest({ name: "Polyglot" });
    const repos = getRepositories();
    await repos.guests.updateProfile(
      guest.id,
      {
        name: guest.name,
        aboutMe: "Hello",
        avatarUrl: null,
        pronouns: "they/them",
        basedIn: "Lisbon",
        prompts: [{ prompt: "Offering", answer: "Sourdough starters" }],
        languages: ["Portuguese"],
        contacts: null,
      },
      new Date()
    );

    const rows = await repos.guests.listAttendees(now);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: "Polyglot",
      basedIn: "Lisbon",
      languages: ["Portuguese"],
      prompts: [{ prompt: "Offering", answer: "Sourdough starters" }],
    });
  });

  it("exposes when each profile was last updated, so the list can sort by it", async () => {
    const updatedAt = new Date("2026-04-10T08:00:00Z");
    const active = await createGuest({ name: "Active" });
    await createGuest({ name: "Never Edited" });
    const repos = getRepositories();
    await repos.guests.updateProfile(
      active.id,
      {
        name: active.name,
        aboutMe: "Hello",
        avatarUrl: null,
        pronouns: null,
        basedIn: null,
        prompts: null,
        languages: null,
        contacts: null,
      },
      updatedAt
    );

    const rows = await repos.guests.listAttendees(now);

    const byName = Object.fromEntries(
      rows.map((r) => [r.name, r.profileUpdatedAt])
    );
    expect(byName["Active"]).toEqual(updatedAt);
    expect(byName["Never Edited"]).toBeNull();
  });
});
