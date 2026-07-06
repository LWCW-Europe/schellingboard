import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("guests.search", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("searches name and email case-insensitively by substring", async () => {
    await createGuest({ name: "Alice Smith", email: "alice@test.example" });
    await createGuest({ name: "Bob Jones", email: "bob@corp.example" });
    const repos = getRepositories();

    const byName = await repos.guests.search({
      query: "smith",
      limit: 50,
      offset: 0,
    });
    expect(byName.total).toBe(1);
    expect(byName.rows.map((r) => r.name)).toEqual(["Alice Smith"]);

    const byEmail = await repos.guests.search({
      query: "CORP",
      limit: 50,
      offset: 0,
    });
    expect(byEmail.rows.map((r) => r.name)).toEqual(["Bob Jones"]);
    expect(byEmail.rows[0].info.email).toBe("bob@corp.example");
  });

  it("matches LIKE metacharacters literally", async () => {
    await createGuest({ name: "a_b", email: "underscore@test.example" });
    await createGuest({ name: "axb", email: "plain@test.example" });
    const repos = getRepositories();

    const { rows } = await repos.guests.search({
      query: "a_b",
      limit: 50,
      offset: 0,
    });
    expect(rows.map((r) => r.name)).toEqual(["a_b"]);
  });

  it("paginates by name via limit/offset while reporting the full total", async () => {
    for (const name of ["E", "C", "A", "D", "B"]) {
      await createGuest({ name, email: `${name}@test.example` });
    }
    const repos = getRepositories();

    const firstPage = await repos.guests.search({ limit: 2, offset: 0 });
    expect(firstPage.total).toBe(5);
    expect(firstPage.rows.map((r) => r.name)).toEqual(["A", "B"]);

    const secondPage = await repos.guests.search({ limit: 2, offset: 2 });
    expect(secondPage.total).toBe(5);
    expect(secondPage.rows.map((r) => r.name)).toEqual(["C", "D"]);
  });
});

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

  it("treats % and _ in the query as literal characters, not wildcards", async () => {
    const event = await createEvent();
    await createGuest({ name: "50% Discount", email: "fifty@test.example" });
    await createGuest({
      name: "500 Discount",
      email: "fivehundred@test.example",
    });
    await createGuest({ name: "Underscore", email: "a_1@test.example" });
    await createGuest({ name: "No Underscore", email: "ax1@test.example" });
    const repos = getRepositories();

    const percent = await repos.guests.searchForEventAssignment(event.id, {
      query: "50%",
      limit: 50,
      offset: 0,
    });
    expect(percent.rows.map((r) => r.name)).toEqual(["50% Discount"]);
    expect(percent.total).toBe(1);

    const underscore = await repos.guests.searchForEventAssignment(event.id, {
      query: "a_1",
      limit: 50,
      offset: 0,
    });
    expect(underscore.rows.map((r) => r.name)).toEqual(["Underscore"]);
    expect(underscore.total).toBe(1);
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

  it("orders duplicate names by id so pagination is stable", async () => {
    const event = await createEvent();
    const repos = getRepositories();

    // Create guests sharing a name until insertion order differs from id
    // order, so a name tie cannot accidentally come back id-sorted without
    // an explicit tiebreaker.
    const ids: string[] = [];
    do {
      ids.push((await createGuest({ name: "Dup" })).id);
    } while (
      ids.length < 2 ||
      ids.every((id, i) => i === 0 || ids[i - 1] < id)
    );

    const pagedIds: string[] = [];
    for (let offset = 0; offset < ids.length; offset++) {
      const { rows } = await repos.guests.searchForEventAssignment(event.id, {
        limit: 1,
        offset,
      });
      pagedIds.push(rows[0].id);
    }

    expect(pagedIds).toEqual([...ids].sort());
  });
});
