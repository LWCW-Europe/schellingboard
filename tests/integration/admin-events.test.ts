import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
    }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createDay,
  createGuest,
  createLocation,
  createProposal,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/db/repositories/interfaces";

describe("events repo", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", "0123456789abcdef0123456789abcdef");
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("update", () => {
    it("updates event fields", async () => {
      const event = await createEvent({ name: "Original" });
      const updated = await getRepositories().events.update(event.id, {
        name: "Updated",
        description: "New description",
      });
      expect(updated).toMatchObject({
        id: event.id,
        name: "Updated",
        description: "New description",
      });
      const fetched = await getRepositories().events.findById(event.id);
      expect(fetched?.name).toBe("Updated");
    });

    it("returns undefined for unknown id", async () => {
      const result = await getRepositories().events.update("no-such-id", {
        name: "X",
      });
      expect(result).toBeUndefined();
    });

    it("preserves unpatched fields", async () => {
      const event = await createEvent({ name: "Keep" });
      await getRepositories().events.update(event.id, {
        description: "Patched",
      });
      const fetched = await getRepositories().events.findById(event.id);
      expect(fetched?.name).toBe("Keep");
    });
  });

  describe("delete", () => {
    it("deletes the event", async () => {
      const event = await createEvent();
      await getRepositories().events.delete(event.id);
      expect(await getRepositories().events.findById(event.id)).toBeUndefined();
    });

    it("cascade-deletes days, proposals, sessions, and all child records", async () => {
      const repos = getRepositories();
      const event = await createEvent();
      const guest = await createGuest();
      const location = await createLocation();

      await createDay(event.id);

      const proposal = await createProposal(event.id, [guest.id]);
      await repos.votes.create({
        proposalId: proposal.id,
        guestId: guest.id,
        choice: VoteChoice.interested,
      });

      const session = await createSession(event.id, {
        hostIds: [guest.id],
        locationIds: [location.id],
      });
      await repos.rsvps.create({ sessionId: session.id, guestId: guest.id });

      await repos.events.delete(event.id);

      expect(await repos.events.findById(event.id)).toBeUndefined();
      expect(await repos.days.listByEvent(event.id)).toEqual([]);
      expect(await repos.sessionProposals.listByEvent(event.id)).toEqual([]);
      expect(await repos.sessions.listByEvent(event.id)).toEqual([]);
      expect(await repos.votes.listByGuestAndEvent(guest.id, event.id)).toEqual(
        []
      );
      expect(await repos.rsvps.listByGuest(guest.id)).toEqual([]);

      // Guest and location themselves are untouched
      expect(await repos.guests.findById(guest.id)).toBeDefined();
      expect(await repos.locations.findById(location.id)).toBeDefined();
    });

    it("sessions derived from the event's proposals are also deleted (not kept)", async () => {
      const repos = getRepositories();
      const event = await createEvent();
      const guest = await createGuest();
      const proposal = await createProposal(event.id, [guest.id]);
      const session = await createSession(event.id, { hostIds: [guest.id] });
      // link session to proposal
      await repos.sessions.update(session.id, { proposalId: proposal.id });

      await repos.events.delete(event.id);

      expect(await repos.sessions.findById(session.id)).toBeUndefined();
    });
  });
});
