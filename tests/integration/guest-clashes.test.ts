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

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { detectGuestClashes } from "@/app/(site)/[eventSlug]/clash-actions";
import { AUTH_COOKIE_NAME, createAuthCookie } from "@/utils/auth";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

// A host's own hosted sessions are public, so a clash may name them; the
// sessions a host merely RSVP'd to are private, so a clash must only report
// that they are "busy" at that time — never which session.
describe("detectGuestClashes", () => {
  beforeAll(() => setupTestDb());
  // Clash detection reports when a host is privately busy, so it needs both
  // site auth and a guest the caller may act as; these tests are about what
  // it then discloses. See action-site-auth.test.ts for the gate itself.
  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    cookieJar.set(AUTH_COOKIE_NAME, (await createAuthCookie()).value);
    cookieJar.set(
      GUEST_COOKIE_NAME,
      openGuestValue((await createGuest({ name: "Organiser" })).id)
    );
  });
  afterEach(() => vi.unstubAllEnvs());

  const T = (h: number, m = 0) => new Date(Date.UTC(2030, 0, 1, h, m, 0));

  it("reports a hosting clash and names the (public) session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest();
    await createSession(event.id, {
      title: "Their talk",
      hostIds: [host.id],
      startTime: T(10),
      endTime: T(11),
    });

    const clashes = await detectGuestClashes({
      eventId: event.id,
      guestIds: [host.id],
      start: T(10, 30).toISOString(),
      end: T(11, 30).toISOString(),
    });

    expect(clashes).toHaveLength(1);
    expect(clashes[0].kind).toBe("hosting");
    expect(clashes[0].title).toBe("Their talk");
  });

  it("reports an RSVP clash as 'busy' without leaking the session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest();
    const secret = await createSession(event.id, {
      title: "Secret RSVP session",
      startTime: T(10),
      endTime: T(11),
    });
    await getRepositories().rsvps.create({
      sessionId: secret.id,
      guestId: host.id,
    });

    const clashes = await detectGuestClashes({
      eventId: event.id,
      guestIds: [host.id],
      start: T(10, 30).toISOString(),
      end: T(11, 30).toISOString(),
    });

    expect(clashes).toHaveLength(1);
    expect(clashes[0].kind).toBe("busy");
    expect(clashes[0].title).toBeNull();
    expect(JSON.stringify(clashes)).not.toContain("Secret RSVP session");
  });

  it("returns nothing when the candidate slot does not overlap", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest();
    await createSession(event.id, {
      title: "Earlier",
      hostIds: [host.id],
      startTime: T(9),
      endTime: T(10),
    });

    const clashes = await detectGuestClashes({
      eventId: event.id,
      guestIds: [host.id],
      start: T(10).toISOString(),
      end: T(11).toISOString(),
    });

    expect(clashes).toEqual([]);
  });

  it("does not clash a session being edited with itself", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest();
    const editing = await createSession(event.id, {
      title: "Editing",
      hostIds: [host.id],
      startTime: T(10),
      endTime: T(11),
    });

    const clashes = await detectGuestClashes({
      eventId: event.id,
      guestIds: [host.id],
      start: T(10).toISOString(),
      end: T(11).toISOString(),
      excludeSessionId: editing.id,
    });

    expect(clashes).toEqual([]);
  });

  // An accepted 1-on-1 occupies the guest just as an RSVP does, and who it is
  // with is nobody else's business -- so it reports busy with no title.
  it("reports an accepted meeting as busy, without naming the other party", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest();
    const other = await createGuest({ name: "Their counterpart" });
    const meeting = await getRepositories().meetings.create({
      eventId: event.id,
      requesterId: other.id,
      recipientId: guest.id,
      slotStart: T(10),
      slotEnd: T(10, 30),
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: T(9),
    });
    await getRepositories().meetings.updateStatus(
      meeting.id,
      "accepted",
      T(9, 30),
      ["pending"]
    );

    const clashes = await detectGuestClashes({
      eventId: event.id,
      guestIds: [guest.id],
      start: T(10).toISOString(),
      end: T(10, 30).toISOString(),
    });

    expect(clashes).toHaveLength(1);
    expect(clashes[0].kind).toBe("busy");
    expect(clashes[0].title).toBeNull();
    expect(JSON.stringify(clashes)).not.toContain("Their counterpart");
  });

  // Only an agreed meeting is a commitment; the other three states are not
  // something the guest has to be anywhere for.
  for (const status of ["pending", "declined", "canceled"] as const) {
    it(`ignores a meeting that is only ${status}`, async () => {
      const event = await createEvent({ phase: "scheduling" });
      const guest = await createGuest();
      const other = await createGuest();
      const repos = getRepositories();
      const meeting = await repos.meetings.create({
        eventId: event.id,
        requesterId: other.id,
        recipientId: guest.id,
        slotStart: T(10),
        slotEnd: T(10, 30),
        meetingPoint: "Coffee bar",
        message: "",
        createdAt: T(9),
      });
      if (status !== "pending") {
        await repos.meetings.updateStatus(meeting.id, status, T(9, 30), [
          "pending",
        ]);
      }

      const clashes = await detectGuestClashes({
        eventId: event.id,
        guestIds: [guest.id],
        start: T(10).toISOString(),
        end: T(10, 30).toISOString(),
      });

      expect(clashes).toEqual([]);
    });
  }

  it("counts a meeting the guest requested, not only ones they received", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest();
    const other = await createGuest();
    const meeting = await getRepositories().meetings.create({
      eventId: event.id,
      requesterId: guest.id,
      recipientId: other.id,
      slotStart: T(10),
      slotEnd: T(10, 30),
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: T(9),
    });
    await getRepositories().meetings.updateStatus(
      meeting.id,
      "accepted",
      T(9, 30),
      ["pending"]
    );

    const clashes = await detectGuestClashes({
      eventId: event.id,
      guestIds: [guest.id],
      start: T(10, 15).toISOString(),
      end: T(10, 45).toISOString(),
    });

    expect(clashes).toHaveLength(1);
    expect(clashes[0].kind).toBe("busy");
  });
});
