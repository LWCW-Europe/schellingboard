import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

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
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import {
  getAttendeeCountAction,
  setAttendeeCountAction,
} from "@/app/actions/attendee-count";

const HOUR_MS = 60 * 60 * 1000;

function actAs(guestId: string): void {
  cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guestId));
}

/** A session that ended an hour ago, so the entry gate is open. */
async function finishedSession(eventId: string, hostIds: string[]) {
  const now = Date.now();
  return createSession(eventId, {
    hostIds,
    startTime: new Date(now - 3 * HOUR_MS),
    endTime: new Date(now - HOUR_MS),
  });
}

describe("attendee count server action", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);
  });

  it("records a count a host can read back", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);
    actAs(host.id);

    expect(await setAttendeeCountAction(session.id, "12")).toEqual({
      ok: true,
      count: 12,
    });
    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: 12,
    });
  });

  it("lets a co-host read and change the same value (FR-003)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const cohost = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id, cohost.id]);

    actAs(host.id);
    await setAttendeeCountAction(session.id, "12");

    actAs(cohost.id);
    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: 12,
    });
    expect(await setAttendeeCountAction(session.id, "15")).toEqual({
      ok: true,
      count: 15,
    });

    actAs(host.id);
    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: 15,
    });
  });

  it("keeps 0 as a recorded value and a blank field as 'not recorded' (FR-001)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);
    actAs(host.id);

    expect(await setAttendeeCountAction(session.id, "0")).toEqual({
      ok: true,
      count: 0,
    });
    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: 0,
    });

    expect(await setAttendeeCountAction(session.id, "")).toEqual({
      ok: true,
      count: null,
    });
    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: null,
    });
  });

  it("refuses a non-host rather than reporting no count (FR-005)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const stranger = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);

    actAs(host.id);
    await setAttendeeCountAction(session.id, "12");

    actAs(stranger.id);
    const read = await getAttendeeCountAction(session.id);
    // Not { ok: true, count: null }: that would let a prober tell "no count
    // recorded" apart from "not your session".
    expect(read.ok).toBe(false);
    const write = await setAttendeeCountAction(session.id, "99");
    expect(write.ok).toBe(false);

    actAs(host.id);
    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: 12,
    });
  });

  it("refuses a host whose session has not finished yet (FR-002)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const now = Date.now();
    const session = await createSession(event.id, {
      hostIds: [host.id],
      startTime: new Date(now + HOUR_MS),
      endTime: new Date(now + 2 * HOUR_MS),
    });
    actAs(host.id);

    expect((await setAttendeeCountAction(session.id, "12")).ok).toBe(false);
    expect((await getAttendeeCountAction(session.id)).ok).toBe(false);
  });

  it("rejects out-of-range and non-whole values with a field-level issue (FR-004)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);
    actAs(host.id);

    for (const bad of ["-1", "1.5", "1001"]) {
      const result = await setAttendeeCountAction(session.id, bad);
      expect(result.ok).toBe(false);
      // An array of Zod issues, not a bare string: the message has to attach
      // to the input (ADR 0003).
      expect(Array.isArray(result.ok === false && result.error)).toBe(true);
    }

    expect(await getAttendeeCountAction(session.id)).toEqual({
      ok: true,
      count: null,
    });
    // The boundaries themselves are accepted.
    expect(await setAttendeeCountAction(session.id, "1000")).toEqual({
      ok: true,
      count: 1000,
    });
  });

  it("lets a host record on an admin-managed session (FR-007)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);
    await getRepositories().sessions.update(session.id, {
      adminManaged: true,
    });
    actAs(host.id);

    expect(await setAttendeeCountAction(session.id, "7")).toEqual({
      ok: true,
      count: 7,
    });
  });

  it("converges on one stored value when two saves overlap (SC-007)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);
    actAs(host.id);

    const [first, second] = await Promise.all([
      setAttendeeCountAction(session.id, "12"),
      setAttendeeCountAction(session.id, "15"),
    ]);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);

    // One value survives, not two, and it is one of the two submitted.
    const stored = await getAttendeeCountAction(session.id);
    expect(stored.ok).toBe(true);
    expect([12, 15]).toContain(stored.ok === true && stored.count);
  });

  it("discards the count when the session is deleted (FR-019)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);
    actAs(host.id);
    await setAttendeeCountAction(session.id, "12");

    const { sessions } = getRepositories();
    await sessions.delete(session.id);

    expect(await sessions.findById(session.id)).toBeUndefined();
    expect(await sessions.getAttendeeCount(session.id)).toBeNull();
    expect((await getAttendeeCountAction(session.id)).ok).toBe(false);
  });

  it("refuses when no user is selected", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const session = await finishedSession(event.id, [host.id]);

    expect((await setAttendeeCountAction(session.id, "12")).ok).toBe(false);
    expect((await getAttendeeCountAction(session.id)).ok).toBe(false);
  });
});
