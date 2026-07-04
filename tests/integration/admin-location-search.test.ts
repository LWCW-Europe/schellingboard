import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createLocation } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("locations.searchForEventAssignment", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns all locations with an assigned flag for the event", async () => {
    const event = await createEvent();
    const a = await createLocation({ name: "Auditorium", capacity: 100 });
    await createLocation({ name: "Boardroom", capacity: 10 });
    const repos = getRepositories();
    await repos.locations.assignToEvent(event.id, [a.id]);

    const { rows, total } = await repos.locations.searchForEventAssignment(
      event.id,
      { limit: 50, offset: 0 }
    );

    expect(total).toBe(2);
    expect(rows.map((r) => [r.name, r.capacity, r.assigned])).toEqual([
      ["Auditorium", 100, true],
      ["Boardroom", 10, false],
    ]);
  });

  it("filters by assignment membership", async () => {
    const event = await createEvent();
    const a = await createLocation({ name: "Auditorium" });
    await createLocation({ name: "Boardroom" });
    const repos = getRepositories();
    await repos.locations.assignToEvent(event.id, [a.id]);

    const assigned = await repos.locations.searchForEventAssignment(event.id, {
      assigned: true,
      limit: 50,
      offset: 0,
    });
    expect(assigned.total).toBe(1);
    expect(assigned.rows.map((r) => r.name)).toEqual(["Auditorium"]);

    const notAssigned = await repos.locations.searchForEventAssignment(
      event.id,
      { assigned: false, limit: 50, offset: 0 }
    );
    expect(notAssigned.total).toBe(1);
    expect(notAssigned.rows.map((r) => r.name)).toEqual(["Boardroom"]);
  });

  it("searches name case-insensitively by substring", async () => {
    const event = await createEvent();
    await createLocation({ name: "Main Hall" });
    await createLocation({ name: "Workshop Room" });
    const repos = getRepositories();

    const { rows } = await repos.locations.searchForEventAssignment(event.id, {
      query: "hall",
      limit: 50,
      offset: 0,
    });
    expect(rows.map((r) => r.name)).toEqual(["Main Hall"]);
  });

  it("treats % and _ in the query as literal characters, not wildcards", async () => {
    const event = await createEvent();
    await createLocation({ name: "50% Off Room" });
    await createLocation({ name: "500 Off Room" });
    await createLocation({ name: "Room A_1" });
    await createLocation({ name: "Room AX1" });
    const repos = getRepositories();

    const percent = await repos.locations.searchForEventAssignment(event.id, {
      query: "50%",
      limit: 50,
      offset: 0,
    });
    expect(percent.rows.map((r) => r.name)).toEqual(["50% Off Room"]);
    expect(percent.total).toBe(1);

    const underscore = await repos.locations.searchForEventAssignment(
      event.id,
      { query: "A_1", limit: 50, offset: 0 }
    );
    expect(underscore.rows.map((r) => r.name)).toEqual(["Room A_1"]);
    expect(underscore.total).toBe(1);
  });

  it("paginates via limit/offset while reporting the full total", async () => {
    const event = await createEvent();
    for (const name of ["A", "B", "C", "D", "E"]) {
      await createLocation({ name });
    }
    const repos = getRepositories();

    const firstPage = await repos.locations.searchForEventAssignment(event.id, {
      limit: 2,
      offset: 0,
    });
    expect(firstPage.total).toBe(5);
    expect(firstPage.rows.map((r) => r.name)).toEqual(["A", "B"]);

    const secondPage = await repos.locations.searchForEventAssignment(
      event.id,
      { limit: 2, offset: 2 }
    );
    expect(secondPage.total).toBe(5);
    expect(secondPage.rows.map((r) => r.name)).toEqual(["C", "D"]);
  });

  it("orders duplicate names by id so pagination is stable", async () => {
    const event = await createEvent();
    const repos = getRepositories();

    // Create locations sharing a name until insertion order differs from id
    // order, so a name tie cannot accidentally come back id-sorted without
    // an explicit tiebreaker.
    const ids: string[] = [];
    do {
      ids.push((await createLocation({ name: "Dup" })).id);
    } while (
      ids.length < 2 ||
      ids.every((id, i) => i === 0 || ids[i - 1] < id)
    );

    const pagedIds: string[] = [];
    for (let offset = 0; offset < ids.length; offset++) {
      const { rows } = await repos.locations.searchForEventAssignment(
        event.id,
        { limit: 1, offset }
      );
      pagedIds.push(rows[0].id);
    }

    expect(pagedIds).toEqual([...ids].sort());
  });
});
