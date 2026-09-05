import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createDay,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { meetingCandidatesFor } from "@/utils/meeting-candidates";
import type { Event, Guest } from "@/db/repositories/interfaces";

const DAY_START = new Date("2026-10-01T09:00:00.000Z");
const DAY_END = new Date("2026-10-01T12:00:00.000Z");
const SLOT = "2026-10-01T10:00:00.000Z";
const SLOT_END = new Date("2026-10-01T10:30:00.000Z");
const BEFORE = new Date("2026-09-30T09:00:00.000Z");
const AFTER = new Date("2026-10-02T09:00:00.000Z");

async function bookable(event: Event, name: string, slots = [SLOT]) {
  const guest = await createGuest({ name, eventId: event.id });
  await getRepositories().meetingAvailability.replaceForGuest(
    guest.id,
    event.id,
    slots.map((s) => new Date(s))
  );
  return guest;
}

async function scenario() {
  const repos = getRepositories();
  const event = await createEvent({ phase: "scheduling" });
  await repos.events.update(event.id, { meetingsEnabled: true });
  await createDay(event.id, { start: DAY_START, end: DAY_END });
  const viewer = await createGuest({ name: "Ada", eventId: event.id });
  const grace = await bookable(event, "Grace");
  return { event, viewer, grace };
}

const names = async (event: Event, viewer: Guest, now = BEFORE) =>
  (await meetingCandidatesFor(viewer.id, event.id, SLOT, now))?.candidates.map(
    (c) => c.name
  );

describe("meetingCandidatesFor", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => resetTestDb());

  it("lists everyone who declared that slot, by name", async () => {
    const { event, viewer } = await scenario();
    await bookable(event, "Yuki");

    expect(await names(event, viewer)).toEqual(["Grace", "Yuki"]);
  });

  // The viewer's own availability says who may book them; it has nothing to do
  // with whom they may ask, and booking yourself is not a thing.
  it("leaves the viewer out, however they declared", async () => {
    const { event, viewer } = await scenario();
    await getRepositories().meetingAvailability.replaceForGuest(
      viewer.id,
      event.id,
      [new Date(SLOT)]
    );

    expect(await names(event, viewer)).toEqual(["Grace"]);
  });

  it("leaves out a slot the person never declared", async () => {
    const { event, viewer } = await scenario();
    await bookable(event, "Yuki", ["2026-10-01T11:00:00.000Z"]);

    expect(await names(event, viewer)).toEqual(["Grace"]);
  });

  // Their availability row outlives being taken off the guest list, and the
  // request action refuses a non-attendee anyway.
  it("leaves out someone no longer on the guest list", async () => {
    const { event, viewer, grace } = await scenario();
    await getRepositories().guests.removeFromEvent(event.id, [grace.id]);

    expect(await names(event, viewer)).toEqual([]);
  });

  it("leaves out someone the viewer already has a live 1-on-1 with then", async () => {
    const { event, viewer, grace } = await scenario();
    const meeting = await getRepositories().meetings.create({
      eventId: event.id,
      requesterId: viewer.id,
      recipientId: grace.id,
      slotStart: new Date(SLOT),
      slotEnd: SLOT_END,
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: BEFORE,
    });

    expect(await names(event, viewer)).toEqual([]);

    // Declined, there is nothing left to answer twice: they can be asked again.
    await getRepositories().meetings.updateStatus(
      meeting.id,
      "declined",
      BEFORE,
      ["pending"]
    );
    expect(await names(event, viewer)).toEqual(["Grace"]);
  });

  it("marks a candidate busy without saying what they are doing", async () => {
    const { event, viewer, grace } = await scenario();
    await createSession(event.id, {
      title: "Their talk",
      hostIds: [grace.id],
      startTime: new Date(SLOT),
      endTime: SLOT_END,
    });

    const found = await meetingCandidatesFor(viewer.id, event.id, SLOT, BEFORE);

    expect(found?.candidates[0]).toMatchObject({ name: "Grace", busy: true });
    expect(JSON.stringify(found)).not.toContain("Their talk");
  });

  // Agreed only, the rule clash detection already follows: a request they have
  // not answered is not yet a commitment, and treating it as one would let a
  // stranger's unanswered request make someone look unavailable.
  it("counts an agreed 1-on-1 of theirs as busy, a pending one not", async () => {
    const { event, viewer, grace } = await scenario();
    const third = await createGuest({ name: "Yuki", eventId: event.id });
    const asked = async () =>
      getRepositories().meetings.create({
        eventId: event.id,
        requesterId: third.id,
        recipientId: grace.id,
        slotStart: new Date(SLOT),
        slotEnd: SLOT_END,
        meetingPoint: "Coffee bar",
        message: "",
        createdAt: BEFORE,
      });
    const busyOf = async (name: string) =>
      (
        await meetingCandidatesFor(viewer.id, event.id, SLOT, BEFORE)
      )?.candidates.find((c) => c.name === name)?.busy;

    const pending = await asked();
    expect(await busyOf("Grace")).toBe(false);

    await getRepositories().meetings.updateStatus(
      pending.id,
      "accepted",
      BEFORE,
      ["pending"]
    );
    expect(await busyOf("Grace")).toBe(true);
  });

  // The reader's own commitment is named to them: knowing which of their own
  // sessions they would be missing is the point of the warning.
  it("names the viewer's own clash, once for the whole slot", async () => {
    const { event, viewer } = await scenario();
    await createSession(event.id, {
      title: "My own talk",
      hostIds: [viewer.id],
      startTime: new Date(SLOT),
      endTime: SLOT_END,
    });

    const found = await meetingCandidatesFor(viewer.id, event.id, SLOT, BEFORE);

    expect(found?.yourClashes).toEqual([
      {
        guestName: "Ada",
        kind: "hosting",
        title: "My own talk",
        isViewer: true,
      },
    ]);
  });

  it("carries what the request form needs beside the people", async () => {
    const { event, viewer } = await scenario();
    await getRepositories().meetingPoints.create({
      eventId: event.id,
      name: "Coffee bar",
      description: "By reception",
      sortIndex: 0,
    });

    const found = await meetingCandidatesFor(viewer.id, event.id, SLOT, BEFORE);

    expect(found?.eventName).toBe(event.name);
    expect(found?.meetingPoints.map((p) => p.name)).toEqual(["Coffee bar"]);
    expect(found?.slotLabel).toBe("10:00 – 10:30");
  });

  it("refuses a slot that has already begun", async () => {
    const { event, viewer } = await scenario();

    expect(
      await meetingCandidatesFor(viewer.id, event.id, SLOT, AFTER)
    ).toBeNull();
  });

  it("refuses an instant the event does not offer as a slot", async () => {
    const { event, viewer } = await scenario();

    expect(
      await meetingCandidatesFor(
        viewer.id,
        event.id,
        "2026-10-01T10:07:00.000Z",
        BEFORE
      )
    ).toBeNull();
  });

  it("refuses once the organizer switches meetings off", async () => {
    const { event, viewer } = await scenario();
    await getRepositories().events.update(event.id, {
      meetingsEnabled: false,
    });

    expect(
      await meetingCandidatesFor(viewer.id, event.id, SLOT, BEFORE)
    ).toBeNull();
  });

  it("refuses a viewer who is not attending", async () => {
    const { event, viewer } = await scenario();
    await getRepositories().guests.removeFromEvent(event.id, [viewer.id]);

    expect(
      await meetingCandidatesFor(viewer.id, event.id, SLOT, BEFORE)
    ).toBeNull();
  });
});
