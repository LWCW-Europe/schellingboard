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
import { createEvent, createGuest } from "../helpers/factories";
import { GUEST_COOKIE_NAME, verifiedGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { GET as meetings } from "@/app/api/meetings/route";
import type { MeetingView } from "@/utils/meeting-views";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

const SLOT_START = new Date("2099-10-01T13:00:00.000Z");

async function asGuest(eventId: string, guestId?: string) {
  const url = `http://test/api/meetings?event=${eventId}`;
  if (!guestId) return new NextRequest(url);
  const request = new NextRequest(url);
  request.cookies.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guestId));
  return request;
}

describe("the meetings endpoint", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  async function withPendingRequest() {
    const event = await createEvent({ phase: "scheduling" });
    const requester = await createGuest({ name: "Ada", eventId: event.id });
    const recipient = await createGuest({ name: "Grace", eventId: event.id });
    await getRepositories().meetings.create({
      eventId: event.id,
      requesterId: requester.id,
      recipientId: recipient.id,
      slotStart: SLOT_START,
      slotEnd: new Date(SLOT_START.getTime() + 30 * 60 * 1000),
      meetingPoint: "Coffee bar",
      message: "",
      createdAt: new Date(),
    });
    return { event, requester, recipient };
  }

  it("serves the caller their own meetings", async () => {
    const { event, recipient } = await withPendingRequest();

    const res = await meetings(await asGuest(event.id, recipient.id));

    expect(res.status).toBe(200);
    const views = (await res.json()) as MeetingView[];
    expect(views).toHaveLength(1);
    expect(views[0].otherName).toBe("Ada");
    expect(views[0].role).toBe("recipient");
  });

  // Meetings are as private as RSVPs, so there is no way to ask about
  // somebody else's — not even by naming them.
  it("refuses a caller who has not selected a name", async () => {
    const { event } = await withPendingRequest();

    const res = await meetings(await asGuest(event.id));

    expect(res.status).toBe(403);
  });

  it("needs an event", async () => {
    const res = await meetings(new NextRequest("http://test/api/meetings"));

    expect(res.status).toBe(400);
  });
});
