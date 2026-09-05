import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("guests.listAttendees", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("flags hosts with a real boolean, not a truthy DB value", async () => {
    const host = await createGuest({ name: "Host Person" });
    await createGuest({ name: "Regular Person" });
    const event = await createEvent();
    await createSession(event.id, { hostIds: [host.id] });
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees();

    const byName = Object.fromEntries(rows.map((r) => [r.name, r.isHost]));
    expect(byName["Host Person"]).toBe(true);
    expect(byName["Regular Person"]).toBe(false);
  });

  // The directory's "Open to 1-on-1s" filter is global, not scoped to one
  // event, so the flag lives on the attendee rather than being worked out per
  // event by the caller.
  it("flags anyone bookable at any event where 1-on-1s are on", async () => {
    const repos = getRepositories();
    const open = await createGuest({ name: "Open Person" });
    const stale = await createGuest({ name: "Stale Person" });
    await createGuest({ name: "Regular Person" });
    const on = await createEvent();
    const off = await createEvent({ name: "Meetings Off" });
    await repos.events.update(on.id, { meetingsEnabled: true });
    const slot = [new Date("2026-10-01T09:00:00.000Z")];
    await repos.meetingAvailability.replaceForGuest(open.id, on.id, slot);
    // Declared while it was on, and the organizer has since switched it off.
    await repos.meetingAvailability.replaceForGuest(stale.id, off.id, slot);

    const rows = await repos.guests.listAttendees();

    const byName = Object.fromEntries(rows.map((r) => [r.name, r.meetingsOn]));
    expect(byName["Open Person"]).toBe(true);
    expect(byName["Stale Person"]).toBe(false);
    expect(byName["Regular Person"]).toBe(false);
  });

  it("orders by name and never exposes the private email", async () => {
    for (const name of ["E", "C", "A", "D", "B"]) {
      await createGuest({ name });
    }
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees();

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

    const rows = await repos.guests.listAttendees();

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

    const rows = await repos.guests.listAttendees();

    const byName = Object.fromEntries(
      rows.map((r) => [r.name, r.profileUpdatedAt])
    );
    expect(byName["Active"]).toEqual(updatedAt);
    expect(byName["Never Edited"]).toBeNull();
  });
});
