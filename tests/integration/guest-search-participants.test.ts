import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("guests.searchForParticipants", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("flags hosts with a real boolean, not a truthy DB value", async () => {
    const host = await createGuest({ name: "Host Person" });
    await createGuest({ name: "Regular Person" });
    const event = await createEvent();
    await createSession(event.id, { hostIds: [host.id] });
    const repos = getRepositories();

    const { rows } = await repos.guests.searchForParticipants({
      limit: 50,
      offset: 0,
    });

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

    const { rows, total } = await repos.guests.searchForParticipants({
      host: true,
      limit: 50,
      offset: 0,
    });

    expect(total).toBe(1);
    expect(rows.map((r) => r.name)).toEqual(["Host Person"]);
    expect(rows[0].isHost).toBe(true);
  });

  it("matches name only, not email", async () => {
    await createGuest({ name: "Alice Smith", email: "findme@test.example" });
    const repos = getRepositories();

    const { rows } = await repos.guests.searchForParticipants({
      query: "findme",
      limit: 50,
      offset: 0,
    });

    expect(rows).toEqual([]);
  });

  it("paginates by name via limit/offset while reporting the full total", async () => {
    for (const name of ["E", "C", "A", "D", "B"]) {
      await createGuest({ name });
    }
    const repos = getRepositories();

    const firstPage = await repos.guests.searchForParticipants({
      limit: 2,
      offset: 0,
    });
    expect(firstPage.total).toBe(5);
    expect(firstPage.rows.map((r) => r.name)).toEqual(["A", "B"]);

    const secondPage = await repos.guests.searchForParticipants({
      limit: 2,
      offset: 2,
    });
    expect(secondPage.total).toBe(5);
    expect(secondPage.rows.map((r) => r.name)).toEqual(["C", "D"]);
  });
});
