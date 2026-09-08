import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createDay } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { availabilityFormsFor } from "@/utils/meeting-availability-form";

const NOW = new Date("2026-10-01T08:00:00.000Z");
const DAY = {
  start: new Date("2026-10-02T09:00:00.000Z"),
  end: new Date("2026-10-02T11:00:00.000Z"),
};

async function offering(opts?: { name?: string; meetingsEnabled?: boolean }) {
  const event = await createEvent({
    name: opts?.name,
    slotIncrementMinutes: 30,
  });
  await getRepositories().events.update(event.id, {
    meetingsEnabled: opts?.meetingsEnabled ?? true,
  });
  return event;
}

describe("availabilityFormsFor", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("lists an event you attend that offers 1-on-1s, with its slots and what you declared", async () => {
    const event = await offering({ name: "Autumn Camp" });
    await createDay(event.id, DAY);
    const guest = await createGuest({ eventId: event.id });
    await getRepositories().meetingAvailability.replaceForGuest(
      guest.id,
      event.id,
      [new Date("2026-10-02T09:30:00.000Z")]
    );

    const forms = await availabilityFormsFor(guest.id, NOW);

    expect(forms).toHaveLength(1);
    expect(forms[0]).toMatchObject({
      eventId: event.id,
      eventName: "Autumn Camp",
      timezone: "UTC",
      declared: ["2026-10-02T09:30:00.000Z"],
    });
    expect(forms[0].days).toHaveLength(1);
    expect(forms[0].days[0].label).toBe("Fri 2 Oct");
    expect(forms[0].days[0].slots.map((s) => s.label)).toEqual([
      "09:00 – 09:30",
      "09:30 – 10:00",
      "10:00 – 10:30",
      "10:30 – 11:00",
    ]);
  });

  it("leaves out events you are not attending, and ones not offering 1-on-1s", async () => {
    const notAttended = await offering();
    await createDay(notAttended.id, DAY);
    const notOffering = await offering({ meetingsEnabled: false });
    await createDay(notOffering.id, DAY);
    const guest = await createGuest({ eventId: notOffering.id });

    expect(await availabilityFormsFor(guest.id, NOW)).toEqual([]);
  });

  // Nothing is left to be booked into once every day has passed. An event
  // with no days yet is different: the organizer may still add some.
  it("leaves out an event whose days are all over, but not one with no days yet", async () => {
    const over = await offering({ name: "Last Year" });
    await createDay(over.id, {
      start: new Date("2026-09-01T09:00:00.000Z"),
      end: new Date("2026-09-01T11:00:00.000Z"),
    });
    const notYet = await offering({ name: "Not Planned" });
    const guest = await createGuest({ eventId: over.id });
    await getRepositories().guests.assignToEvent(notYet.id, [guest.id]);

    const forms = await availabilityFormsFor(guest.id, NOW);

    expect(forms.map((f) => f.eventName)).toEqual(["Not Planned"]);
    expect(forms[0].days).toEqual([]);
  });

  // A day shortened after someone declared leaves rows for slots the form no
  // longer renders, and the save action refuses any it isn't offering -- so
  // passing them through would leave a form that cannot be saved and nothing
  // to untick.
  it("keeps only the declared slots the event still offers", async () => {
    const event = await offering();
    await createDay(event.id, DAY);
    const guest = await createGuest({ eventId: event.id });
    await getRepositories().meetingAvailability.replaceForGuest(
      guest.id,
      event.id,
      [
        new Date("2026-10-02T09:30:00.000Z"),
        new Date("2026-10-02T12:00:00.000Z"),
      ]
    );

    const [form] = await availabilityFormsFor(guest.id, NOW);

    expect(form.declared).toEqual(["2026-10-02T09:30:00.000Z"]);
  });

  // Days only have to not overlap, so one date may hold a morning and an
  // afternoon: the date alone is not a heading that tells them apart.
  it("labels two days on one date by their hours", async () => {
    const event = await offering();
    await createDay(event.id, DAY);
    await createDay(event.id, {
      start: new Date("2026-10-02T14:00:00.000Z"),
      end: new Date("2026-10-02T16:00:00.000Z"),
    });
    const guest = await createGuest({ eventId: event.id });

    const [form] = await availabilityFormsFor(guest.id, NOW);

    expect(form.days.map((d) => d.label)).toEqual([
      "Fri 2 Oct, 09:00–11:00",
      "Fri 2 Oct, 14:00–16:00",
    ]);
  });
});
