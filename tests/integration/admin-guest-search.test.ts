import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("guests.searchForEventAssignment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns all guests with an assigned flag for the event", async () => {
    const event = await createEvent();
    const a = await createGuest({ name: "Alice", email: "alice@test.example" });
    await createGuest({ name: "Bob", email: "bob@test.example" });
    const repos = getRepositories();
    await repos.guests.assignToEvent(event.id, [a.id]);

    const { rows, total } = await repos.guests.searchForEventAssignment(
      event.id,
      { limit: 50, offset: 0 }
    );

    expect(total).toBe(2);
    expect(rows.map((r) => [r.name, r.assigned])).toEqual([
      ["Alice", true],
      ["Bob", false],
    ]);
  });

  it("filters by assignment membership", async () => {
    const event = await createEvent();
    const a = await createGuest({ name: "Alice" });
    await createGuest({ name: "Bob" });
    const repos = getRepositories();
    await repos.guests.assignToEvent(event.id, [a.id]);

    const assigned = await repos.guests.searchForEventAssignment(event.id, {
      assigned: true,
      limit: 50,
      offset: 0,
    });
    expect(assigned.total).toBe(1);
    expect(assigned.rows.map((r) => r.name)).toEqual(["Alice"]);

    const notAssigned = await repos.guests.searchForEventAssignment(event.id, {
      assigned: false,
      limit: 50,
      offset: 0,
    });
    expect(notAssigned.total).toBe(1);
    expect(notAssigned.rows.map((r) => r.name)).toEqual(["Bob"]);
  });

  it("searches name and email case-insensitively by substring", async () => {
    const event = await createEvent();
    await createGuest({ name: "Alice Smith", email: "alice@test.example" });
    await createGuest({ name: "Bob Jones", email: "bob@corp.example" });
    const repos = getRepositories();

    const byName = await repos.guests.searchForEventAssignment(event.id, {
      query: "smith",
      limit: 50,
      offset: 0,
    });
    expect(byName.rows.map((r) => r.name)).toEqual(["Alice Smith"]);

    const byEmail = await repos.guests.searchForEventAssignment(event.id, {
      query: "CORP",
      limit: 50,
      offset: 0,
    });
    expect(byEmail.rows.map((r) => r.name)).toEqual(["Bob Jones"]);
  });

  it("paginates via limit/offset while reporting the full total", async () => {
    const event = await createEvent();
    for (const name of ["A", "B", "C", "D", "E"]) {
      await createGuest({ name, email: `${name}@test.example` });
    }
    const repos = getRepositories();

    const firstPage = await repos.guests.searchForEventAssignment(event.id, {
      limit: 2,
      offset: 0,
    });
    expect(firstPage.total).toBe(5);
    expect(firstPage.rows.map((r) => r.name)).toEqual(["A", "B"]);

    const secondPage = await repos.guests.searchForEventAssignment(event.id, {
      limit: 2,
      offset: 2,
    });
    expect(secondPage.total).toBe(5);
    expect(secondPage.rows.map((r) => r.name)).toEqual(["C", "D"]);
  });
});
