import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { meetingViewsFor } from "@/utils/meeting-views";
import type { Event, Guest, Meeting } from "@/db/repositories/interfaces";

const SLOT_START = new Date("2026-10-01T13:00:00.000Z");
const SLOT_END = new Date("2026-10-01T13:30:00.000Z");
const BEFORE = new Date("2026-09-30T09:00:00.000Z");
const AFTER = new Date("2026-10-01T18:00:00.000Z");

async function meetingBetween(
  event: Event,
  requester: Guest,
  recipient: Guest,
  patch?: Partial<Pick<Meeting, "slotStart" | "slotEnd" | "message">>
): Promise<Meeting> {
  return getRepositories().meetings.create({
    eventId: event.id,
    requesterId: requester.id,
    recipientId: recipient.id,
    slotStart: patch?.slotStart ?? SLOT_START,
    slotEnd: patch?.slotEnd ?? SLOT_END,
    meetingPoint: "Coffee bar",
    message: patch?.message ?? "",
    createdAt: BEFORE,
  });
}

async function scenario() {
  const event = await createEvent({ phase: "scheduling" });
  const requester = await createGuest({ name: "Ada", eventId: event.id });
  const recipient = await createGuest({ name: "Grace", eventId: event.id });
  return { event, requester, recipient };
}

describe("meetingViewsFor", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => resetTestDb());

  it("describes a request the viewer received", async () => {
    const { event, requester, recipient } = await scenario();
    const meeting = await meetingBetween(event, requester, recipient, {
      message: "the attendance model",
    });

    const [view] = await meetingViewsFor(recipient.id, event.id, BEFORE);

    expect(view.id).toBe(meeting.id);
    expect(view.role).toBe("recipient");
    expect(view.otherName).toBe("Ada");
    expect(view.status).toBe("pending");
    expect(view.meetingPoint).toBe("Coffee bar");
    expect(view.message).toBe("the attendance model");
    expect(view.timeLabel).toBe("13:00 – 13:30");
  });

  it("describes the same meeting from the requester's side", async () => {
    const { event, requester, recipient } = await scenario();
    await meetingBetween(event, requester, recipient);

    const [view] = await meetingViewsFor(requester.id, event.id, BEFORE);

    expect(view.role).toBe("requester");
    expect(view.otherName).toBe("Grace");
  });

  // Expiry is derived on read rather than swept by a scheduler
  // (issue #392, section 2.4).
  it("reads a pending request whose slot has started as expired", async () => {
    const { event, requester, recipient } = await scenario();
    await meetingBetween(event, requester, recipient);

    const [view] = await meetingViewsFor(recipient.id, event.id, AFTER);

    expect(view.status).toBe("expired");
  });

  it("leaves an answered meeting alone once its slot has passed", async () => {
    const { event, requester, recipient } = await scenario();
    const meeting = await meetingBetween(event, requester, recipient);
    await getRepositories().meetings.updateStatus(
      meeting.id,
      "accepted",
      BEFORE,
      ["pending"]
    );

    const [view] = await meetingViewsFor(recipient.id, event.id, AFTER);

    expect(view.status).toBe("accepted");
  });

  it("names a session either party is hosting in the slot", async () => {
    const { event, requester, recipient } = await scenario();
    const room = await createLocation({ eventId: event.id });
    await createSession(event.id, {
      title: "Microservices for Dummies",
      hostIds: [recipient.id],
      locationIds: [room.id],
      startTime: SLOT_START,
      endTime: SLOT_END,
    });
    await meetingBetween(event, requester, recipient);

    const [view] = await meetingViewsFor(recipient.id, event.id, BEFORE);

    expect(view.clashes).toEqual([
      {
        guestName: "Grace",
        kind: "hosting",
        title: "Microservices for Dummies",
        isViewer: true,
      },
    ]);
  });

  // The same privacy rule the slot picker relies on: an RSVP is reported as
  // "busy" with no title, so one attendee never learns another's plans.
  it("reports the other party's RSVP without naming the session", async () => {
    const { event, requester, recipient } = await scenario();
    const room = await createLocation({ eventId: event.id });
    const session = await createSession(event.id, {
      title: "Secret Session",
      locationIds: [room.id],
      startTime: SLOT_START,
      endTime: SLOT_END,
    });
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: requester.id,
    });
    await meetingBetween(event, requester, recipient);

    const [view] = await meetingViewsFor(recipient.id, event.id, BEFORE);

    expect(view.clashes).toEqual([
      { guestName: "Ada", kind: "busy", title: null, isViewer: false },
    ]);
  });

  // An accepted meeting counts as busy for clash detection, so without this
  // every accepted meeting would warn about itself.
  it("does not report a meeting as clashing with itself", async () => {
    const { event, requester, recipient } = await scenario();
    const meeting = await meetingBetween(event, requester, recipient);
    await getRepositories().meetings.updateStatus(
      meeting.id,
      "accepted",
      BEFORE,
      ["pending"]
    );

    const [view] = await meetingViewsFor(recipient.id, event.id, BEFORE);

    expect(view.clashes).toEqual([]);
  });

  it("returns nothing for a guest with no meetings at the event", async () => {
    const { event, requester, recipient } = await scenario();
    await meetingBetween(event, requester, recipient);
    const bystander = await createGuest({ eventId: event.id });

    expect(await meetingViewsFor(bystander.id, event.id, BEFORE)).toEqual([]);
  });
});
