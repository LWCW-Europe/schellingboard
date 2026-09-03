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

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { siteAuthenticate } from "../helpers/site-auth";
import { createEvent, createGuest, createDay } from "../helpers/factories";
import { GUEST_COOKIE_NAME, verifiedGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { requestMeetingAction } from "@/app/actions/meetings";
import type { Event, Guest } from "@/db/repositories/interfaces";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

const DAY_START = new Date("2026-10-01T09:00:00.000Z");
const DAY_END = new Date("2026-10-01T17:00:00.000Z");
const SLOT = "2026-10-01T10:00:00.000Z";
const SLOT_2 = "2026-10-01T10:30:00.000Z";

// A day of the same event that has already happened. Multi-day events spend
// most of their run with days on both sides of "now".
const PAST_DAY_START = new Date("2020-10-01T09:00:00.000Z");
const PAST_DAY_END = new Date("2020-10-01T17:00:00.000Z");
const PAST_SLOT = "2020-10-01T10:00:00.000Z";

async function signIn(guestId: string) {
  cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guestId));
}

/** An event with meetings on, a day, and two attendees; the recipient is bookable. */
async function scenario(patch?: Record<string, unknown>) {
  const repos = getRepositories();
  const event = await createEvent();
  await repos.events.update(event.id, {
    meetingsEnabled: true,
    maxOpenMeetingRequests: 5,
    ...patch,
  });
  await createDay(event.id, { start: DAY_START, end: DAY_END });
  const requester = await createGuest({ eventId: event.id });
  const recipient = await createGuest({ eventId: event.id });
  await repos.meetingAvailability.replaceForGuest(recipient.id, event.id, [
    new Date(SLOT),
    new Date(SLOT_2),
  ]);
  await signIn(requester.id);
  const reloaded = (await repos.events.findById(event.id)) as Event;
  return { event: reloaded, requester, recipient };
}

const request = (
  event: Event,
  recipient: Guest,
  patch?: Partial<Parameters<typeof requestMeetingAction>[0]>
) =>
  requestMeetingAction({
    eventId: event.id,
    recipientId: recipient.id,
    slotStart: SLOT,
    meetingPoint: "Coffee bar",
    message: "Would love to talk about the attendance model",
    ...patch,
  });

describe("requestMeetingAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("creates a pending request", async () => {
    const { event, requester, recipient } = await scenario();

    const result = await request(event, recipient);

    expect(result.ok).toBe(true);
    const [meeting] = await getRepositories().meetings.listByGuestAndEvent(
      requester.id,
      event.id
    );
    expect(meeting.requesterId).toBe(requester.id);
    expect(meeting.recipientId).toBe(recipient.id);
    expect(meeting.status).toBe("pending");
    expect(meeting.meetingPoint).toBe("Coffee bar");
    expect(meeting.slotStart.toISOString()).toBe(SLOT);
    // The slot's length comes from the event, never from the caller.
    expect(meeting.slotEnd.toISOString()).toBe(SLOT_2);
  });

  it("tells the recipient they were asked", async () => {
    const { event, requester, recipient } = await scenario();

    await request(event, recipient);

    const [notification] = await getRepositories().notifications.listByGuest(
      recipient.id
    );
    expect(notification.type).toBe("meetingRequest");
    expect(notification.text).toContain(requester.name);
    const [meeting] = await getRepositories().meetings.listByGuestAndEvent(
      requester.id,
      event.id
    );
    expect(notification.url).toContain(`/meetings?viewMeeting=${meeting.id}`);
  });

  it("requires a meeting point", async () => {
    const { event, recipient } = await scenario();

    const result = await request(event, recipient, { meetingPoint: "   " });

    expect(result.ok).toBe(false);
  });

  it("keeps the message optional", async () => {
    const { event, requester, recipient } = await scenario();

    const result = await request(event, recipient, { message: undefined });

    expect(result.ok).toBe(true);
    const [meeting] = await getRepositories().meetings.listByGuestAndEvent(
      requester.id,
      event.id
    );
    expect(meeting.message).toBe("");
  });

  // Only slots the recipient cleared are a hard no (the design on issue #392);
  // a clash is a warning the requester waves through, so it must not be
  // rejected here.
  it("refuses a slot the recipient did not declare", async () => {
    const { event, recipient } = await scenario();

    const result = await request(event, recipient, {
      slotStart: "2026-10-01T11:00:00.000Z",
    });

    expect(result.ok).toBe(false);
  });

  it("refuses a slot the event does not offer at all", async () => {
    const { event, recipient } = await scenario();

    const result = await request(event, recipient, {
      slotStart: "2026-10-01T10:17:00.000Z",
    });

    expect(result.ok).toBe(false);
  });

  it("refuses booking yourself", async () => {
    const { event, requester } = await scenario();
    await getRepositories().meetingAvailability.replaceForGuest(
      requester.id,
      event.id,
      [new Date(SLOT)]
    );

    const result = await request(event, requester);

    expect(result.ok).toBe(false);
  });

  it("refuses a recipient who is not attending the event", async () => {
    const { event } = await scenario();
    const outsider = await createGuest();

    const result = await request(event, outsider);

    expect(result.ok).toBe(false);
  });

  it("refuses when meetings are off for the event", async () => {
    const { event, recipient } = await scenario({ meetingsEnabled: false });

    const result = await request(event, recipient);

    expect(result.ok).toBe(false);
  });

  it("refuses a second request for the same person and slot", async () => {
    const { event, recipient } = await scenario();
    await request(event, recipient);

    const again = await request(event, recipient);

    expect(again.ok).toBe(false);
  });

  it("stops the requester at the organizer's open-request cap", async () => {
    const { event, requester, recipient } = await scenario({
      maxOpenMeetingRequests: 1,
    });
    await request(event, recipient);

    const second = await request(event, recipient, { slotStart: SLOT_2 });

    expect(second.ok).toBe(false);
    expect(
      await getRepositories().meetings.listByGuestAndEvent(
        requester.id,
        event.id
      )
    ).toHaveLength(1);
  });

  // The cap only counts requests whose slot is still ahead, so a past slot
  // that could be booked would be an unbounded hole in it.
  it("refuses a slot that has already passed", async () => {
    const { event, recipient } = await scenario();
    await createDay(event.id, {
      start: PAST_DAY_START,
      end: PAST_DAY_END,
    });
    await getRepositories().meetingAvailability.replaceForGuest(
      recipient.id,
      event.id,
      [new Date(SLOT), new Date(PAST_SLOT)]
    );

    const result = await request(event, recipient, { slotStart: PAST_SLOT });

    expect(result.ok).toBe(false);
  });

  // A "use server" export is a public endpoint: the declared types are
  // advisory, so a hand-made payload has to come back as a result rather than
  // a 500.
  it("answers a malformed payload instead of throwing", async () => {
    const { event, recipient } = await scenario();

    const result = await request(event, recipient, {
      meetingPoint: 123 as unknown as string,
    });

    expect(result).toEqual({ ok: false, error: "Invalid request" });
  });

  it("refuses a message longer than the field allows", async () => {
    const { event, recipient } = await scenario();

    const result = await request(event, recipient, {
      message: "x".repeat(5000),
    });

    expect(result.ok).toBe(false);
  });

  it("refuses a second request while the first is still accepted", async () => {
    const { event, requester, recipient } = await scenario();
    await request(event, recipient);
    const repos = getRepositories();
    const [meeting] = await repos.meetings.listByGuestAndEvent(
      requester.id,
      event.id
    );
    await repos.meetings.updateStatus(meeting.id, "accepted", new Date(), [
      "pending",
    ]);

    expect((await request(event, recipient)).ok).toBe(false);
  });

  // Once a request is off the table the pair may well agree on that slot after
  // all -- and a requester who cancelled by accident must not be locked out of
  // the time they wanted.
  for (const status of ["declined", "canceled"] as const) {
    it(`lets them ask again after the first was ${status}`, async () => {
      const { event, requester, recipient } = await scenario();
      await request(event, recipient);
      const repos = getRepositories();
      const [meeting] = await repos.meetings.listByGuestAndEvent(
        requester.id,
        event.id
      );
      await repos.meetings.updateStatus(meeting.id, status, new Date(), [
        "pending",
      ]);

      const again = await request(event, recipient);

      expect(again.ok).toBe(true);
    });
  }

  it("refuses when nobody is signed in", async () => {
    const { event, recipient } = await scenario();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);

    const result = await request(event, recipient);

    expect(result.ok).toBe(false);
  });
});
