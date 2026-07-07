import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createProposal } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("sessionProposals.searchByEvent", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns enriched proposals for the event only, ordered by title", async () => {
    const event = await createEvent();
    const other = await createEvent();
    const host = await createGuest({ name: "Alice" });
    await createProposal(event.id, [host.id], { title: "Zebra Talk" });
    await createProposal(event.id, [], { title: "Agile Workshop" });
    await createProposal(other.id, [], { title: "Other Event Talk" });
    const repos = getRepositories();

    const { rows, total } = await repos.sessionProposals.searchByEvent(
      event.id,
      { limit: 50, offset: 0 }
    );

    expect(total).toBe(2);
    expect(rows.map((r) => r.title)).toEqual(["Agile Workshop", "Zebra Talk"]);
    expect(rows[1].hosts.map((h) => h.name)).toEqual(["Alice"]);
  });

  it("searches title case-insensitively by substring", async () => {
    const event = await createEvent();
    await createProposal(event.id, [], { title: "Intro to Rust" });
    await createProposal(event.id, [], { title: "Advanced Python" });
    const repos = getRepositories();

    const { rows, total } = await repos.sessionProposals.searchByEvent(
      event.id,
      { query: "rust", limit: 50, offset: 0 }
    );

    expect(total).toBe(1);
    expect(rows.map((r) => r.title)).toEqual(["Intro to Rust"]);
  });

  it("matches proposals by host name", async () => {
    const event = await createEvent();
    const alice = await createGuest({ name: "Alice Smith" });
    const bob = await createGuest({ name: "Bob Jones" });
    await createProposal(event.id, [alice.id], { title: "First" });
    await createProposal(event.id, [bob.id], { title: "Second" });
    await createProposal(event.id, [], { title: "Hostless" });
    const repos = getRepositories();

    const { rows, total } = await repos.sessionProposals.searchByEvent(
      event.id,
      { query: "smith", limit: 50, offset: 0 }
    );

    expect(total).toBe(1);
    expect(rows.map((r) => r.title)).toEqual(["First"]);
  });

  it("treats % and _ in the query as literal characters, not wildcards", async () => {
    const event = await createEvent();
    await createProposal(event.id, [], { title: "50% Faster Builds" });
    await createProposal(event.id, [], { title: "500 Faster Builds" });
    await createProposal(event.id, [], { title: "Track A_1" });
    await createProposal(event.id, [], { title: "Track AX1" });
    const percentHost = await createGuest({ name: "Mr 10% Smith" });
    const plainHost = await createGuest({ name: "Mr 100 Smith" });
    await createProposal(event.id, [percentHost.id], { title: "Hosted A" });
    await createProposal(event.id, [plainHost.id], { title: "Hosted B" });
    const repos = getRepositories();

    const percent = await repos.sessionProposals.searchByEvent(event.id, {
      query: "50%",
      limit: 50,
      offset: 0,
    });
    expect(percent.rows.map((r) => r.title)).toEqual(["50% Faster Builds"]);
    expect(percent.total).toBe(1);

    const underscore = await repos.sessionProposals.searchByEvent(event.id, {
      query: "A_1",
      limit: 50,
      offset: 0,
    });
    expect(underscore.rows.map((r) => r.title)).toEqual(["Track A_1"]);
    expect(underscore.total).toBe(1);

    const hostMatch = await repos.sessionProposals.searchByEvent(event.id, {
      query: "10%",
      limit: 50,
      offset: 0,
    });
    expect(hostMatch.rows.map((r) => r.title)).toEqual(["Hosted A"]);
    expect(hostMatch.total).toBe(1);
  });

  it("paginates via limit/offset while reporting the full total", async () => {
    const event = await createEvent();
    for (const title of ["A", "B", "C", "D", "E"]) {
      await createProposal(event.id, [], { title });
    }
    const repos = getRepositories();

    const firstPage = await repos.sessionProposals.searchByEvent(event.id, {
      limit: 2,
      offset: 0,
    });
    expect(firstPage.total).toBe(5);
    expect(firstPage.rows.map((r) => r.title)).toEqual(["A", "B"]);

    const secondPage = await repos.sessionProposals.searchByEvent(event.id, {
      limit: 2,
      offset: 2,
    });
    expect(secondPage.total).toBe(5);
    expect(secondPage.rows.map((r) => r.title)).toEqual(["C", "D"]);
  });

  it("orders duplicate titles by id so pagination is stable", async () => {
    const event = await createEvent();
    const repos = getRepositories();

    // Create proposals sharing a title until insertion order differs from id
    // order, so a title tie cannot accidentally come back id-sorted without
    // an explicit tiebreaker.
    const ids: string[] = [];
    do {
      ids.push((await createProposal(event.id, [], { title: "Dup" })).id);
    } while (
      ids.length < 2 ||
      ids.every((id, i) => i === 0 || ids[i - 1] < id)
    );

    const pagedIds: string[] = [];
    for (let offset = 0; offset < ids.length; offset++) {
      const { rows } = await repos.sessionProposals.searchByEvent(event.id, {
        limit: 1,
        offset,
      });
      pagedIds.push(rows[0].id);
    }

    expect(pagedIds).toEqual([...ids].sort());
  });
});
