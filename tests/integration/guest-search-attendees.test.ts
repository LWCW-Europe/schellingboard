import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { DEFAULT_EMAIL_SETTINGS } from "@/db/repositories/interfaces";

describe("guests.listAttendees", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("flags hosts with a real boolean, not a truthy DB value", async () => {
    const host = await createGuest({ name: "Host Person" });
    await createGuest({ name: "Regular Person" });
    const event = await createEvent();
    await createSession(event.id, { hostIds: [host.id] });
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees({});

    const byName = Object.fromEntries(rows.map((r) => [r.name, r.isHost]));
    expect(byName["Host Person"]).toBe(true);
    expect(byName["Regular Person"]).toBe(false);
  });

  it("narrows to hosts only when host filter is set", async () => {
    const host = await createGuest({ name: "Host Person" });
    await createGuest({ name: "Regular Person" });
    const event = await createEvent();
    await createSession(event.id, { hostIds: [host.id] });
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees({ host: true });

    expect(rows.map((r) => r.name)).toEqual(["Host Person"]);
    expect(rows[0].isHost).toBe(true);
  });

  it("orders by name and never exposes the private email", async () => {
    for (const name of ["E", "C", "A", "D", "B"]) {
      await createGuest({ name });
    }
    const repos = getRepositories();

    const rows = await repos.guests.listAttendees({});

    expect(rows.map((r) => r.name)).toEqual(["A", "B", "C", "D", "E"]);
    for (const row of rows) {
      expect(row).not.toHaveProperty("email");
      expect(row).not.toHaveProperty("info");
    }
  });

  it("includes the public profile fields used by search", async () => {
    const guest = await createGuest({ name: "Polyglot" });
    const repos = getRepositories();
    await repos.guests.updateProfile(guest.id, {
      name: guest.name,
      aboutMe: "Hello",
      avatarUrl: null,
      pronouns: "they/them",
      basedIn: "Lisbon",
      prompts: [{ prompt: "Offering", answer: "Sourdough starters" }],
      languages: ["Portuguese"],
      contacts: null,
      emailSettings: DEFAULT_EMAIL_SETTINGS,
    });

    const rows = await repos.guests.listAttendees({});

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: "Polyglot",
      basedIn: "Lisbon",
      languages: ["Portuguese"],
      prompts: [{ prompt: "Offering", answer: "Sourdough starters" }],
    });
  });
});
