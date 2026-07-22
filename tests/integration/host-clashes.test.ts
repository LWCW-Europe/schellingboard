import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { detectHostClashes } from "@/app/(site)/[eventSlug]/clash-actions";

// A host's own hosted sessions are public, so a clash may name them; the
// sessions a host merely RSVP'd to are private, so a clash must only report
// that they are "busy" at that time — never which session.
describe("detectHostClashes", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

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

    const clashes = await detectHostClashes({
      eventId: event.id,
      hostIds: [host.id],
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

    const clashes = await detectHostClashes({
      eventId: event.id,
      hostIds: [host.id],
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

    const clashes = await detectHostClashes({
      eventId: event.id,
      hostIds: [host.id],
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

    const clashes = await detectHostClashes({
      eventId: event.id,
      hostIds: [host.id],
      start: T(10).toISOString(),
      end: T(11).toISOString(),
      excludeSessionId: editing.id,
    });

    expect(clashes).toEqual([]);
  });
});
