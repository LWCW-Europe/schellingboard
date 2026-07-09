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
import { createAdminAuthCookie } from "@/utils/auth";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  updateEventPhasesAction,
} from "@/app/actions/admin-events";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

const VALID_EVENT_INPUT = {
  name: "Test Event",
  description: "A description",
  website: "https://example.com",
  start: "2026-09-01",
  end: "2026-09-03",
  timezone: "Europe/Berlin",
  maxSessionDuration: "60",
  breakMinutes: "10",
};

describe("events repo", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
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

  describe("slug", () => {
    it("stores the slugified name on create", async () => {
      const event = await createEvent({ name: "My-Event 2026" });
      expect(event.slug).toBe("My-Event-2026");
      const fetched = await getRepositories().events.findById(event.id);
      expect(fetched?.slug).toBe("My-Event-2026");
    });

    it("rejects a second event whose name slugifies to the same slug", async () => {
      await createEvent({ name: "My Event" });
      await expect(createEvent({ name: "My-Event" })).rejects.toThrow(
        /unique/i
      );
    });

    it("keeps the slug when the event is renamed", async () => {
      const event = await createEvent({ name: "Old Name" });
      await getRepositories().events.update(event.id, { name: "New Name" });
      const found = await getRepositories().events.findBySlug("Old-Name");
      expect(found?.id).toBe(event.id);
      expect(found?.name).toBe("New Name");
    });
  });

  describe("findBySlug", () => {
    it("finds an event by its slugified name", async () => {
      const event = await createEvent({ name: "Test Event" });
      const found = await getRepositories().events.findBySlug("Test-Event");
      expect(found?.id).toBe(event.id);
    });

    it("finds an event whose name contains hyphens", async () => {
      const event = await createEvent({ name: "My-Event 2026" });
      const found = await getRepositories().events.findBySlug("My-Event-2026");
      expect(found?.id).toBe(event.id);
    });

    it("returns undefined for an unknown slug", async () => {
      await createEvent({ name: "Test Event" });
      expect(
        await getRepositories().events.findBySlug("No-Such")
      ).toBeUndefined();
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

describe("event actions", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await loginAsAdmin();
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("authorization", () => {
    it("rejects createEventAction without admin cookie", async () => {
      cookieJar.clear();
      const result = await createEventAction(VALID_EVENT_INPUT);
      expect(!result.ok && result.error).toBe("Unauthorized");
    });

    it("rejects updateEventAction without admin cookie", async () => {
      cookieJar.clear();
      const event = await createEvent();
      const result = await updateEventAction({
        id: event.id,
        ...VALID_EVENT_INPUT,
      });
      expect(!result.ok && result.error).toBe("Unauthorized");
    });

    it("rejects deleteEventAction without admin cookie", async () => {
      cookieJar.clear();
      const event = await createEvent();
      const result = await deleteEventAction({ id: event.id });
      expect(!result.ok && result.error).toBe("Unauthorized");
      expect(await getRepositories().events.findById(event.id)).toBeDefined();
    });
  });

  describe("createEventAction", () => {
    it("creates an event", async () => {
      const result = await createEventAction(VALID_EVENT_INPUT);
      expect(result.ok).toBe(true);
      const event = await getRepositories().events.findByName("Test Event");
      expect(event).toMatchObject({
        name: "Test Event",
        timezone: "Europe/Berlin",
      });
    });

    it("rejects a duplicate event name", async () => {
      await createEventAction(VALID_EVENT_INPUT);
      const result = await createEventAction(VALID_EVENT_INPUT);
      expect(!result.ok && result.error).toMatch(/already exists/i);
    });

    it("rejects a name that collides with an existing event's slug", async () => {
      await createEventAction(VALID_EVENT_INPUT); // "Test Event"
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        name: "Test-Event",
      });
      expect(!result.ok && result.error).toMatch(/already exists/i);
    });

    it("requires a name", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        name: "  ",
      });
      expect(!result.ok && result.error).toBe("Name is required");
    });

    it("requires valid dates", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        start: "not-a-date",
      });
      expect(!result.ok && result.error).toMatch(/invalid/i);
    });

    it("requires end after start", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        start: "2026-09-05",
        end: "2026-09-01",
      });
      expect(!result.ok && result.error).toMatch(
        /end.*after.*start|start.*before.*end/i
      );
    });

    it("persists the configured break", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        breakMinutes: "7",
      });
      expect(result.ok).toBe(true);
      const event = await getRepositories().events.findByName("Test Event");
      expect(event?.breakMinutes).toBe(7);
    });

    it("allows a zero break", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        breakMinutes: "0",
      });
      expect(result.ok).toBe(true);
      const event = await getRepositories().events.findByName("Test Event");
      expect(event?.breakMinutes).toBe(0);
    });

    it("rejects a negative break", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        breakMinutes: "-5",
      });
      expect(!result.ok && result.error).toMatch(/break/i);
    });

    it("sanitizes unsafe characters out of the stored slug", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        name: "A/B Workshop",
      });
      expect(result.ok).toBe(true);
      const event = await getRepositories().events.findBySlug("A-B-Workshop");
      expect(event?.name).toBe("A/B Workshop");
    });

    it("rejects a name whose slug would collide with a reserved route", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        name: "admin",
      });
      expect(!result.ok && result.error).toMatch(/reserved/i);
    });

    it("rejects reserved routes case-insensitively", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        name: "API",
      });
      expect(!result.ok && result.error).toMatch(/reserved/i);
    });

    it("returns a friendly error when a concurrent create wins the slug race", async () => {
      // Simulate a concurrent request inserting the same slug after this
      // request's findBySlug pre-check passes but before its insert runs,
      // so the loser hits the DB unique constraint instead of the pre-check.
      const events = getRepositories().events;
      const originalFindBySlug = events.findBySlug.bind(events);
      const spy = vi
        .spyOn(events, "findBySlug")
        .mockImplementationOnce(async (slug) => {
          const found = await originalFindBySlug(slug);
          await createEvent({ name: VALID_EVENT_INPUT.name });
          return found;
        });
      try {
        const result = await createEventAction(VALID_EVENT_INPUT);
        expect(!result.ok && result.error).toMatch(/already exists/i);
      } finally {
        spy.mockRestore();
      }
    });

    it("rejects a name with no URL-safe characters", async () => {
      const result = await createEventAction({
        ...VALID_EVENT_INPUT,
        name: "///",
      });
      expect(!result.ok && result.error).toMatch(/letter or number/i);
    });
  });

  describe("updateEventAction", () => {
    it("updates an event", async () => {
      const event = await createEvent({ name: "Old Name" });
      const result = await updateEventAction({
        id: event.id,
        ...VALID_EVENT_INPUT,
        name: "New Name",
      });
      expect(result.ok).toBe(true);
      expect((await getRepositories().events.findById(event.id))?.name).toBe(
        "New Name"
      );
    });

    it("errors for unknown id", async () => {
      const result = await updateEventAction({
        id: "no-such-id",
        ...VALID_EVENT_INPUT,
      });
      expect(!result.ok && result.error).toBe("Event not found");
    });

    it("updates the break", async () => {
      const event = await createEvent({ name: "Breaky" });
      const result = await updateEventAction({
        id: event.id,
        ...VALID_EVENT_INPUT,
        breakMinutes: "15",
      });
      expect(result.ok).toBe(true);
      expect(
        (await getRepositories().events.findById(event.id))?.breakMinutes
      ).toBe(15);
    });
  });

  describe("deleteEventAction", () => {
    it("deletes an event", async () => {
      const event = await createEvent();
      const result = await deleteEventAction({ id: event.id });
      expect(result.ok).toBe(true);
      expect(await getRepositories().events.findById(event.id)).toBeUndefined();
    });

    it("errors for unknown id", async () => {
      const result = await deleteEventAction({ id: "no-such-id" });
      expect(!result.ok && result.error).toBe("Event not found");
    });
  });

  describe("updateEventPhasesAction validation", () => {
    it("rejects when phase end is before its start", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-15T18:00",
        proposalPhaseEnd: "2026-09-01T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /proposal.*end.*after.*start/i
      );
    });

    it("rejects when voting phase end is before its start", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        votingPhaseStart: "2026-09-15T18:00",
        votingPhaseEnd: "2026-09-01T08:00",
      });
      expect(!result.ok && result.error).toMatch(/voting.*end.*after.*start/i);
    });

    it("rejects when scheduling phase end is before its start", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        schedulingPhaseStart: "2026-09-15T18:00",
        schedulingPhaseEnd: "2026-09-01T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /scheduling.*end.*after.*start/i
      );
    });

    it("rejects when voting start is before proposal end", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-01T08:00",
        proposalPhaseEnd: "2026-09-20T18:00",
        votingPhaseStart: "2026-09-10T08:00",
        votingPhaseEnd: "2026-09-25T18:00",
      });
      expect(!result.ok && result.error).toMatch(
        /voting.*not.*start.*before.*proposal/i
      );
    });

    it("rejects when scheduling start is before voting end", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        votingPhaseStart: "2026-09-01T08:00",
        votingPhaseEnd: "2026-09-20T18:00",
        schedulingPhaseStart: "2026-09-10T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /scheduling.*not.*start.*before.*voting/i
      );
    });

    it("allows phases without an end date", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-01T08:00",
      });
      expect(result.ok).toBe(true);
    });

    it("allows an open-ended proposal phase with a later voting start", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-01T08:00",
        votingPhaseStart: "2026-09-10T08:00",
      });
      expect(result.ok).toBe(true);
    });

    it("rejects when voting starts before proposal starts", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-10T08:00",
        votingPhaseStart: "2026-09-01T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /voting.*not.*start.*before.*proposal/i
      );
    });

    it("rejects when scheduling starts before voting starts", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        votingPhaseStart: "2026-09-10T08:00",
        schedulingPhaseStart: "2026-09-01T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /scheduling.*not.*start.*before.*voting/i
      );
    });

    it("rejects when scheduling starts before proposal ends and voting is unset", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-01T08:00",
        proposalPhaseEnd: "2026-09-20T18:00",
        schedulingPhaseStart: "2026-09-10T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /scheduling.*not.*start.*before.*proposal/i
      );
    });

    it("rejects when scheduling starts before proposal starts and voting is unset", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-10T08:00",
        schedulingPhaseStart: "2026-09-01T08:00",
      });
      expect(!result.ok && result.error).toMatch(
        /scheduling.*not.*start.*before.*proposal/i
      );
    });
  });

  describe("updateEventPhasesAction", () => {
    it("sets phase dates", async () => {
      const event = await createEvent();
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "2026-09-01T08:00",
        proposalPhaseEnd: "2026-09-15T18:00",
        votingPhaseStart: "2026-09-15T18:00",
        votingPhaseEnd: "2026-09-30T18:00",
      });
      expect(result.ok).toBe(true);
      const updated = await getRepositories().events.findById(event.id);
      expect(updated?.proposalPhaseStart?.toISOString()).toBe(
        "2026-09-01T08:00:00.000Z"
      );
      expect(updated?.proposalPhaseEnd?.toISOString()).toBe(
        "2026-09-15T18:00:00.000Z"
      );
      expect(updated?.votingPhaseStart?.toISOString()).toBe(
        "2026-09-15T18:00:00.000Z"
      );
      expect(updated?.votingPhaseEnd?.toISOString()).toBe(
        "2026-09-30T18:00:00.000Z"
      );
    });

    it("clears phase dates when empty strings provided", async () => {
      const event = await createEvent({
        proposalPhaseStart: new Date("2026-09-01T08:00:00Z"),
        proposalPhaseEnd: new Date("2026-09-15T18:00:00Z"),
      });
      const result = await updateEventPhasesAction({
        id: event.id,
        proposalPhaseStart: "",
        proposalPhaseEnd: "",
      });
      expect(result.ok).toBe(true);
      const updated = await getRepositories().events.findById(event.id);
      expect(updated?.proposalPhaseStart).toBeUndefined();
      expect(updated?.proposalPhaseEnd).toBeUndefined();
    });

    it("rejects without admin cookie", async () => {
      cookieJar.clear();
      const event = await createEvent();
      const result = await updateEventPhasesAction({ id: event.id });
      expect(!result.ok && result.error).toBe("Unauthorized");
    });

    it("errors for unknown id", async () => {
      const result = await updateEventPhasesAction({ id: "no-such-id" });
      expect(!result.ok && result.error).toBe("Event not found");
    });
  });
});
