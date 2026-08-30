import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { DEFAULT_EMAIL_SETTINGS } from "@/db/repositories/interfaces";

const SLOT_A = new Date("2026-09-12T10:00:00.000Z");
const SLOT_B = new Date("2026-09-12T10:30:00.000Z");
const SLOT_C = new Date("2026-09-12T11:00:00.000Z");
// Before every slot above, so a pending request counts as open unless a test
// says otherwise.
const BEFORE_SLOTS = new Date("2026-09-12T09:00:00.000Z");
const AFTER_SLOTS = new Date("2026-09-12T23:00:00.000Z");

describe("event meeting settings", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("defaults to meetings off, 30-minute slots and no meeting-hours window", async () => {
    const event = await createEvent();

    expect(event.meetingsEnabled).toBe(false);
    expect(event.meetingSlotMinutes).toBe(30);
    expect(event.meetingDayStart).toBeUndefined();
    expect(event.meetingDayEnd).toBeUndefined();
    expect(event.maxOpenMeetingRequests).toBe(5);
  });

  it("round-trips the meeting settings through an update", async () => {
    const { events } = getRepositories();
    const event = await createEvent();

    await events.update(event.id, {
      meetingsEnabled: true,
      meetingSlotMinutes: 15,
      meetingDayStart: "10:00",
      meetingDayEnd: "18:00",
      maxOpenMeetingRequests: 3,
    });

    const reloaded = await events.findById(event.id);
    expect(reloaded?.meetingsEnabled).toBe(true);
    expect(reloaded?.meetingSlotMinutes).toBe(15);
    expect(reloaded?.meetingDayStart).toBe("10:00");
    expect(reloaded?.meetingDayEnd).toBe("18:00");
    expect(reloaded?.maxOpenMeetingRequests).toBe(3);
  });

  it("clears a meeting-hours window back to the whole day", async () => {
    const { events } = getRepositories();
    const event = await createEvent();
    await events.update(event.id, {
      meetingDayStart: "10:00",
      meetingDayEnd: "18:00",
    });

    await events.update(event.id, {
      meetingDayStart: undefined,
      meetingDayEnd: undefined,
    });

    const reloaded = await events.findById(event.id);
    expect(reloaded?.meetingDayStart).toBeUndefined();
    expect(reloaded?.meetingDayEnd).toBeUndefined();
  });
});

describe("meeting points", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("lists an event's points in sort order", async () => {
    const { meetingPoints } = getRepositories();
    const event = await createEvent();
    await meetingPoints.create({
      eventId: event.id,
      name: "Library corner",
      description: "Quiet, two armchairs",
      sortIndex: 2,
    });
    await meetingPoints.create({
      eventId: event.id,
      name: "Coffee bar",
      description: "",
      sortIndex: 1,
    });

    const points = await meetingPoints.listByEvent(event.id);
    expect(points.map((p) => p.name)).toEqual(["Coffee bar", "Library corner"]);
    expect(points[1].description).toBe("Quiet, two armchairs");
  });

  it("keeps each event's points to itself", async () => {
    const { meetingPoints } = getRepositories();
    const [one, two] = [await createEvent(), await createEvent()];
    await meetingPoints.create({
      eventId: one.id,
      name: "Coffee bar",
      description: "",
      sortIndex: 0,
    });

    expect(await meetingPoints.listByEvent(two.id)).toEqual([]);
  });

  it("updates and deletes a point", async () => {
    const { meetingPoints } = getRepositories();
    const event = await createEvent();
    const point = await meetingPoints.create({
      eventId: event.id,
      name: "Coffee bar",
      description: "",
      sortIndex: 0,
    });

    const updated = await meetingPoints.update(point.id, { name: "Café" });
    expect(updated?.name).toBe("Café");

    await meetingPoints.delete(point.id);
    expect(await meetingPoints.listByEvent(event.id)).toEqual([]);
  });

  it("drops an event's points when the event goes", async () => {
    const { meetingPoints, events } = getRepositories();
    const event = await createEvent();
    await meetingPoints.create({
      eventId: event.id,
      name: "Coffee bar",
      description: "",
      sortIndex: 0,
    });

    await events.delete(event.id);

    expect(await meetingPoints.listByEvent(event.id)).toEqual([]);
  });
});

describe("meeting availability", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("stores the slots a guest declared, in chronological order", async () => {
    const { meetingAvailability } = getRepositories();
    const event = await createEvent();
    const guest = await createGuest({ eventId: event.id });

    await meetingAvailability.replaceForGuest(guest.id, event.id, [
      SLOT_C,
      SLOT_A,
    ]);

    expect(
      await meetingAvailability.listByGuestAndEvent(guest.id, event.id)
    ).toEqual([SLOT_A, SLOT_C]);
  });

  it("replaces the whole set rather than adding to it", async () => {
    const { meetingAvailability } = getRepositories();
    const event = await createEvent();
    const guest = await createGuest({ eventId: event.id });
    await meetingAvailability.replaceForGuest(guest.id, event.id, [
      SLOT_A,
      SLOT_B,
    ]);

    await meetingAvailability.replaceForGuest(guest.id, event.id, [SLOT_C]);

    expect(
      await meetingAvailability.listByGuestAndEvent(guest.id, event.id)
    ).toEqual([SLOT_C]);
  });

  it("treats a guest with no declared slots as not bookable", async () => {
    const { meetingAvailability } = getRepositories();
    const event = await createEvent();
    const guest = await createGuest({ eventId: event.id });

    expect(
      await meetingAvailability.listByGuestAndEvent(guest.id, event.id)
    ).toEqual([]);
  });

  it("keeps one guest's availability out of another's", async () => {
    const { meetingAvailability } = getRepositories();
    const event = await createEvent();
    const [one, two] = [
      await createGuest({ eventId: event.id }),
      await createGuest({ eventId: event.id }),
    ];
    await meetingAvailability.replaceForGuest(one.id, event.id, [SLOT_A]);

    expect(
      await meetingAvailability.listByGuestAndEvent(two.id, event.id)
    ).toEqual([]);
  });
});

describe("meetings", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  async function pair() {
    const event = await createEvent();
    const requester = await createGuest({ eventId: event.id });
    const recipient = await createGuest({ eventId: event.id });
    return { event, requester, recipient };
  }

  it("creates a request as pending, with no response recorded yet", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();

    const meeting = await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "Would love to talk about the attendance model.",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });

    expect(meeting.status).toBe("pending");
    expect(meeting.respondedAt).toBeUndefined();
    expect(meeting.meetingPoint).toBe("Coffee bar");
  });

  it("lists a guest's meetings in both directions", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });
    await meetings.create({
      eventId: event.id,
      requesterId: recipient.id,
      recipientId: requester.id,
      slotStart: SLOT_B,
      slotEnd: SLOT_C,
      meetingPoint: "Lawn",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });

    const mine = await meetings.listByGuestAndEvent(requester.id, event.id);
    expect(mine).toHaveLength(2);
    expect(mine.map((m) => m.slotStart)).toEqual([SLOT_A, SLOT_B]);
  });

  it("records who answered and when, on accept", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    const meeting = await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });
    const respondedAt = new Date("2026-09-01T09:00:00.000Z");

    const accepted = await meetings.updateStatus(
      meeting.id,
      "accepted",
      respondedAt,
      ["pending"]
    );

    expect(accepted?.status).toBe("accepted");
    expect(accepted?.respondedAt).toEqual(respondedAt);
  });

  it("counts only a requester's still-open requests, for the cap", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    const other = await createGuest({ eventId: event.id });

    const open = await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });
    const answered = await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: other.id,
      slotStart: SLOT_B,
      slotEnd: SLOT_C,
      meetingPoint: "Lawn",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });
    await meetings.updateStatus(answered.id, "declined", new Date(), [
      "pending",
    ]);
    // Someone else's pending request must not count against this requester.
    await meetings.create({
      eventId: event.id,
      requesterId: other.id,
      recipientId: requester.id,
      slotStart: SLOT_B,
      slotEnd: SLOT_C,
      meetingPoint: "Lawn",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });

    expect(
      await meetings.countOpenByRequester(requester.id, event.id, BEFORE_SLOTS)
    ).toBe(1);
    expect(open.status).toBe("pending");
  });

  // A request whose slot has passed is expired by definition (it is never
  // stored as a status), so it is not "outstanding" and must not hold a slot
  // in the requester's cap for the rest of the event.
  it("stops counting a pending request once its slot has passed", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });

    expect(
      await meetings.countOpenByRequester(requester.id, event.id, BEFORE_SLOTS)
    ).toBe(1);
    expect(
      await meetings.countOpenByRequester(requester.id, event.id, AFTER_SLOTS)
    ).toBe(0);
  });

  it("refuses a status change from a state the caller did not expect", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    const meeting = await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });
    await meetings.updateStatus(meeting.id, "canceled", new Date(), [
      "pending",
    ]);

    // The recipient's accept, in flight while the requester cancelled.
    const accepted = await meetings.updateStatus(
      meeting.id,
      "accepted",
      new Date(),
      ["pending"]
    );

    expect(accepted).toBeUndefined();
    expect((await meetings.findById(meeting.id))?.status).toBe("canceled");
  });

  // The cap check and the insert have to be one step: two awaits leave a
  // window where a double submit puts the requester over the cap.
  it("creates under the cap and refuses at it, in one step", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    const request = (slotStart: Date, slotEnd: Date) => ({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart,
      slotEnd,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });

    const first = await meetings.createIfUnderCap(
      request(SLOT_A, SLOT_B),
      1,
      BEFORE_SLOTS
    );
    const second = await meetings.createIfUnderCap(
      request(SLOT_B, SLOT_C),
      1,
      BEFORE_SLOTS
    );

    expect(first?.status).toBe("pending");
    expect(second).toBeNull();
    expect(
      await meetings.listByGuestAndEvent(requester.id, event.id)
    ).toHaveLength(1);
  });

  it("counts only unanswered requests against the cap it enforces", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    const request = (slotStart: Date, slotEnd: Date) => ({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart,
      slotEnd,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });
    const first = await meetings.createIfUnderCap(
      request(SLOT_A, SLOT_B),
      1,
      BEFORE_SLOTS
    );
    await meetings.updateStatus(first!.id, "declined", new Date(), ["pending"]);

    const second = await meetings.createIfUnderCap(
      request(SLOT_B, SLOT_C),
      1,
      BEFORE_SLOTS
    );

    expect(second?.status).toBe("pending");
  });

  // Asking the same person twice for the same slot is a double submit, not a
  // second option: two identical requests they would have to answer separately.
  it("rejects a second request to the same person for the same slot", async () => {
    const { meetings } = getRepositories();
    const { event, requester, recipient } = await pair();
    const request = {
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    };
    await meetings.create(request);

    await expect(meetings.create(request)).rejects.toThrow();
  });

  it("drops a guest's meetings when the guest goes", async () => {
    const { meetings, guests } = getRepositories();
    const { event, requester, recipient } = await pair();
    await meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_A,
      slotEnd: SLOT_B,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date("2026-09-01T08:00:00.000Z"),
    });

    await guests.delete(recipient.id);

    expect(await meetings.listByGuestAndEvent(requester.id, event.id)).toEqual(
      []
    );
  });
});

describe("meeting email settings", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  // The schema's column defaults and DEFAULT_EMAIL_SETTINGS declare the same
  // thing in two places; this is where they are compared, for every key rather
  // than only the two added here.
  it("gives a new guest exactly the documented defaults", async () => {
    const { guests } = getRepositories();
    const guest = await createGuest();

    const reloaded = await guests.findById(guest.id);
    expect(reloaded?.info.emailSettings).toEqual(DEFAULT_EMAIL_SETTINGS);
  });

  it("defaults both meeting emails to on", async () => {
    const { guests } = getRepositories();
    const guest = await createGuest();

    const reloaded = await guests.findById(guest.id);
    expect(reloaded?.info.emailSettings.meetingRequest).toBe(true);
    expect(reloaded?.info.emailSettings.meetingResponse).toBe(true);
  });

  it("round-trips a guest switching meeting emails off", async () => {
    const { guests } = getRepositories();
    const guest = await createGuest({
      emailSettings: { meetingRequest: false },
    });

    const reloaded = await guests.findById(guest.id);
    expect(reloaded?.info.emailSettings.meetingRequest).toBe(false);
    expect(reloaded?.info.emailSettings.meetingResponse).toBe(true);
  });
});
