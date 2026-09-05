import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { NextRequest } from "next/server";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createDay } from "../helpers/factories";
import { GUEST_COOKIE_NAME, verifiedGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { GET as candidates } from "@/app/api/meetings/candidates/route";
import type { MeetingCandidates } from "@/utils/meeting-candidates";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

// Well ahead of any real clock: the endpoint refuses a slot that has begun.
const DAY_START = new Date("2099-10-01T09:00:00.000Z");
const DAY_END = new Date("2099-10-01T12:00:00.000Z");
const SLOT = "2099-10-01T10:00:00.000Z";

async function request(
  params: { event?: string; slot?: string },
  guestId?: string
) {
  const url = new URL("http://test/api/meetings/candidates");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  const req = new NextRequest(url);
  if (guestId) {
    req.cookies.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guestId));
  }
  return req;
}

async function scenario() {
  const repos = getRepositories();
  const event = await createEvent({ phase: "scheduling" });
  await repos.events.update(event.id, { meetingsEnabled: true });
  await createDay(event.id, { start: DAY_START, end: DAY_END });
  const viewer = await createGuest({ name: "Ada", eventId: event.id });
  const grace = await createGuest({ name: "Grace", eventId: event.id });
  await repos.meetingAvailability.replaceForGuest(grace.id, event.id, [
    new Date(SLOT),
  ]);
  return { event, viewer, grace };
}

describe("the 1-on-1 candidates endpoint", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("serves the people the caller could ask, for that one slot", async () => {
    const { event, viewer } = await scenario();

    const res = await candidates(
      await request({ event: event.id, slot: SLOT }, viewer.id)
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as MeetingCandidates;
    expect(body.candidates.map((c) => c.name)).toEqual(["Grace"]);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  // Who is free when is as private as an RSVP: there is no id parameter to ask
  // on someone else's behalf, and no answer at all without a name selected.
  it("refuses a caller who has not selected a name", async () => {
    const { event } = await scenario();

    const res = await candidates(
      await request({ event: event.id, slot: SLOT })
    );

    expect(res.status).toBe(403);
  });

  it("needs both an event and a slot", async () => {
    const { event, viewer } = await scenario();

    expect(
      (await candidates(await request({ event: event.id }, viewer.id))).status
    ).toBe(400);
    expect(
      (await candidates(await request({ slot: SLOT }, viewer.id))).status
    ).toBe(400);
  });

  // Nothing to offer is not an empty list: the slot is not one this caller can
  // book at all, and the column says so differently.
  it("answers not-found for a slot the event does not offer", async () => {
    const { event, viewer } = await scenario();

    const res = await candidates(
      await request(
        { event: event.id, slot: "2099-10-01T10:07:00.000Z" },
        viewer.id
      )
    );

    expect(res.status).toBe(404);
  });
});
