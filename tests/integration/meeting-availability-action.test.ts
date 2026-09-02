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
import { siteAuthenticate } from "../helpers/site-auth";
import { createEvent, createGuest, createDay } from "../helpers/factories";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { saveMeetingAvailabilityAction } from "@/app/actions/meetings";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

// 09:00-17:00 UTC, so with 30-minute slots the day offers 16 of them.
const DAY_START = new Date("2026-10-01T09:00:00.000Z");
const DAY_END = new Date("2026-10-01T17:00:00.000Z");
const SLOT_1 = "2026-10-01T09:00:00.000Z";
const SLOT_2 = "2026-10-01T09:30:00.000Z";
const SLOT_3 = "2026-10-01T10:00:00.000Z";

async function meetingsEvent(patch?: Record<string, unknown>) {
  const event = await createEvent();
  await getRepositories().events.update(event.id, {
    meetingsEnabled: true,
    ...patch,
  });
  await createDay(event.id, { start: DAY_START, end: DAY_END });
  return event;
}

async function signIn(guestId: string) {
  cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guestId));
}

describe("saveMeetingAvailabilityAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("stores the slots the guest declared", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1, SLOT_3],
    });

    expect(result).toEqual({ ok: true });
    const saved =
      await getRepositories().meetingAvailability.listByGuestAndEvent(
        guest.id,
        event.id
      );
    expect(saved.map((d) => d.toISOString())).toEqual([SLOT_1, SLOT_3]);
  });

  it("replaces the previous set rather than adding to it", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);
    await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1, SLOT_2],
    });

    await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_3],
    });

    const saved =
      await getRepositories().meetingAvailability.listByGuestAndEvent(
        guest.id,
        event.id
      );
    expect(saved.map((d) => d.toISOString())).toEqual([SLOT_3]);
  });

  // Switching the "I'm open to meetings" switch off is an empty save: no rows
  // is exactly the state of someone who never turned it on.
  it("accepts an empty set, which is how someone opts out", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);
    await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [],
    });

    expect(result).toEqual({ ok: true });
    expect(
      await getRepositories().meetingAvailability.listByGuestAndEvent(
        guest.id,
        event.id
      )
    ).toEqual([]);
  });

  // The client sends slot starts back; a hand-made payload must not be able to
  // declare a guest free at an instant the event never offered.
  it("refuses a slot the event does not offer", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);

    const offGrid = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: ["2026-10-01T09:17:00.000Z"],
    });
    const outsideDay = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: ["2026-10-02T09:00:00.000Z"],
    });

    expect(offGrid.ok).toBe(false);
    expect(outsideDay.ok).toBe(false);
    expect(
      await getRepositories().meetingAvailability.listByGuestAndEvent(
        guest.id,
        event.id
      )
    ).toEqual([]);
  });

  // Slots are the event's schedule increment, so a 09:30 start exists on a
  // 30-minute grid and not on a 60-minute one.
  it("offers slots at the event's schedule increment", async () => {
    const event = await meetingsEvent({ slotIncrementMinutes: 60 });
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);

    const onGrid = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });
    const offGrid = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_2],
    });

    expect(onGrid).toEqual({ ok: true });
    expect(offGrid.ok).toBe(false);
  });

  it("refuses when the organizer has not enabled meetings", async () => {
    const event = await meetingsEvent({ meetingsEnabled: false });
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    expect(result.ok).toBe(false);
  });

  it("refuses a guest who is not attending the event", async () => {
    const event = await meetingsEvent();
    const outsider = await createGuest();
    await signIn(outsider.id);

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    expect(result.ok).toBe(false);
  });

  // Picking a name is enough for an unprotected guest, exactly as it is for an
  // RSVP -- declaring your own availability is no more sensitive than that.
  it("lets an unprotected guest declare from an open name selection", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    expect(result).toEqual({ ok: true });
  });

  it("refuses an open name selection for a protected guest", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    await getRepositories().guests.setAuthProtection(guest.id, {
      authProtected: true,
      passwordHash: null,
    });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    expect(result.ok).toBe(false);
    expect(
      await getRepositories().meetingAvailability.listByGuestAndEvent(
        guest.id,
        event.id
      )
    ).toEqual([]);
  });

  it("refuses when nobody is signed in", async () => {
    const event = await meetingsEvent();

    const result = await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    expect(result.ok).toBe(false);
  });

  it("reports an unknown event", async () => {
    const event = await meetingsEvent();
    const guest = await createGuest({ eventId: event.id });
    await signIn(guest.id);

    const result = await saveMeetingAvailabilityAction({
      eventId: "no-such-event",
      slotStarts: [],
    });

    expect(result).toEqual({ ok: false, error: "Event not found" });
  });

  it("keeps one guest's declaration out of another's", async () => {
    const event = await meetingsEvent();
    const alice = await createGuest({ eventId: event.id });
    const bob = await createGuest({ eventId: event.id });
    await signIn(alice.id);
    await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_1],
    });

    await signIn(bob.id);
    await saveMeetingAvailabilityAction({
      eventId: event.id,
      slotStarts: [SLOT_3],
    });

    const { meetingAvailability } = getRepositories();
    expect(
      (await meetingAvailability.listByGuestAndEvent(alice.id, event.id)).map(
        (d) => d.toISOString()
      )
    ).toEqual([SLOT_1]);
    expect(
      (await meetingAvailability.listByGuestAndEvent(bob.id, event.id)).map(
        (d) => d.toISOString()
      )
    ).toEqual([SLOT_3]);
  });
});
