import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createLocation } from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("locations.listVisibleByEvent", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns only visible locations assigned to the event", async () => {
    const { locations } = getRepositories();
    const eventA = await createEvent();
    const eventB = await createEvent();

    const assigned = await createLocation({ name: "Assigned Room" });
    const otherEvent = await createLocation({ name: "Other Event Room" });

    await locations.setEventIds(assigned.id, [eventA.id]);
    await locations.setEventIds(otherEvent.id, [eventB.id]);

    const result = await locations.listVisibleByEvent(eventA.id);
    expect(result.map((l) => l.id)).toEqual([assigned.id]);
  });

  it("excludes hidden locations even when assigned", async () => {
    const { locations } = getRepositories();
    const event = await createEvent();

    const hidden = await createLocation({ name: "Hidden Room", hidden: true });
    await locations.setEventIds(hidden.id, [event.id]);

    const result = await locations.listVisibleByEvent(event.id);
    expect(result).toEqual([]);
  });

  it("orders locations by sortIndex", async () => {
    const { locations } = getRepositories();
    const event = await createEvent();

    const second = await createLocation({ name: "Second", sortIndex: 5 });
    const first = await createLocation({ name: "First", sortIndex: 1 });
    await locations.setEventIds(second.id, [event.id]);
    await locations.setEventIds(first.id, [event.id]);

    const result = await locations.listVisibleByEvent(event.id);
    expect(result.map((l) => l.id)).toEqual([first.id, second.id]);
  });
});

describe("locations.listBookableByEvent", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("returns only bookable, visible locations assigned to the event", async () => {
    const { locations } = getRepositories();
    const event = await createEvent();
    const otherEvent = await createEvent();

    const bookable = await createLocation({
      name: "Bookable Room",
      eventId: event.id,
    });
    await createLocation({
      name: "Other Event Room",
      eventId: otherEvent.id,
    });
    await createLocation({ name: "Unassigned Room" });
    await createLocation({
      name: "Hidden Room",
      hidden: true,
      eventId: event.id,
    });
    await createLocation({
      name: "Not Bookable Room",
      bookable: false,
      eventId: event.id,
    });

    const result = await locations.listBookableByEvent(event.id);
    expect(result.map((l) => l.id)).toEqual([bookable.id]);
  });

  it("orders locations by sortIndex", async () => {
    const { locations } = getRepositories();
    const event = await createEvent();

    const second = await createLocation({
      name: "Second",
      sortIndex: 5,
      eventId: event.id,
    });
    const first = await createLocation({
      name: "First",
      sortIndex: 1,
      eventId: event.id,
    });

    const result = await locations.listBookableByEvent(event.id);
    expect(result.map((l) => l.id)).toEqual([first.id, second.id]);
  });
});
