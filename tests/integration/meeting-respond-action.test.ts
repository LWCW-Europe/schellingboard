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

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { siteAuthenticate } from "../helpers/site-auth";
import { createEvent, createGuest } from "../helpers/factories";
import { GUEST_COOKIE_NAME, verifiedGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { sendMail } from "@/utils/mailer";
import {
  cancelMeetingAction,
  respondToMeetingAction,
} from "@/app/actions/meetings";
import type { Event, Guest, Meeting } from "@/db/repositories/interfaces";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

const FUTURE_SLOT = new Date("2099-10-01T10:00:00.000Z");
const PAST_SLOT = new Date("2020-10-01T10:00:00.000Z");

async function signIn(guestId: string) {
  cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guestId));
}

/** A pending request from one attendee to another, with the recipient signed in. */
async function scenario(opts?: { slotStart?: Date }): Promise<{
  event: Event;
  requester: Guest;
  recipient: Guest;
  meeting: Meeting;
}> {
  const repos = getRepositories();
  const event = await createEvent();
  await repos.events.update(event.id, { meetingsEnabled: true });
  const requester = await createGuest({ eventId: event.id });
  const recipient = await createGuest({ eventId: event.id });
  const slotStart = opts?.slotStart ?? FUTURE_SLOT;
  const meeting = await repos.meetings.create({
    eventId: event.id,
    requesterId: requester.id,
    recipientId: recipient.id,
    slotStart,
    slotEnd: new Date(slotStart.getTime() + 30 * 60 * 1000),
    meetingPoint: "Coffee bar",
    message: "Would love to talk about the attendance model",
    createdAt: new Date(),
  });
  await signIn(recipient.id);
  return {
    event: (await repos.events.findById(event.id)) as Event,
    requester,
    recipient,
    meeting,
  };
}

describe("respondToMeetingAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("accepts a pending request", async () => {
    const { meeting } = await scenario();

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "accept",
    });

    expect(result.ok).toBe(true);
    const after = await getRepositories().meetings.findById(meeting.id);
    expect(after?.status).toBe("accepted");
    expect(after?.respondedAt).toBeDefined();
  });

  it("declines a pending request", async () => {
    const { meeting } = await scenario();

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "decline",
    });

    expect(result.ok).toBe(true);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("declined");
  });

  it("tells the requester what was answered", async () => {
    const { requester, meeting } = await scenario();

    await respondToMeetingAction({ meetingId: meeting.id, response: "accept" });

    const [notification] = await getRepositories().notifications.listByGuest(
      requester.id
    );
    expect(notification.type).toBe("meetingResponse");
    expect(notification.text).toMatch(/accepted/);
    expect(notification.url).toContain(`/meetings?viewMeeting=${meeting.id}`);
  });

  it("refuses an answer from anyone but the recipient", async () => {
    const { requester, meeting } = await scenario();
    await signIn(requester.id);

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "accept",
    });

    expect(result.ok).toBe(false);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("pending");
  });

  // Someone answering in a second tab, or a requester who cancelled meanwhile:
  // the first answer stands rather than being overwritten.
  it("refuses to answer a request twice", async () => {
    const { meeting } = await scenario();
    await respondToMeetingAction({ meetingId: meeting.id, response: "accept" });

    const again = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "decline",
    });

    expect(again.ok).toBe(false);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("accepted");
  });

  // The pair are left holding a request either way, so the switch stops new
  // ones rather than stranding the ones already made; the meetings page
  // renders the modal for the same reason.
  it("answers a request after the organizer switched meetings off", async () => {
    const { event, meeting } = await scenario();
    await getRepositories().events.update(event.id, {
      meetingsEnabled: false,
    });

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "accept",
    });

    expect(result.ok).toBe(true);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("accepted");
  });

  it("refuses a request whose slot has already started", async () => {
    const { meeting } = await scenario({ slotStart: PAST_SLOT });

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "accept",
    });

    expect(result.ok).toBe(false);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("pending");
  });

  it("refuses when nobody is signed in", async () => {
    const { meeting } = await scenario();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "accept",
    });

    expect(result.ok).toBe(false);
  });

  it("refuses an unknown meeting", async () => {
    await scenario();

    const result = await respondToMeetingAction({
      meetingId: "no-such-meeting",
      response: "accept",
    });

    expect(result.ok).toBe(false);
  });

  // A "use server" export is a public endpoint: the declared types are
  // advisory, so a hand-made payload has to come back as a result, not a 500.
  it("answers a malformed payload instead of throwing", async () => {
    const { meeting } = await scenario();

    const result = await respondToMeetingAction({
      meetingId: meeting.id,
      response: "maybe" as unknown as "accept",
    });

    expect(result).toEqual({ ok: false, error: "Invalid request" });
  });
});

describe("cancelMeetingAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  afterEach(() => vi.unstubAllEnvs());

  async function accepted() {
    const scene = await scenario();
    await respondToMeetingAction({
      meetingId: scene.meeting.id,
      response: "accept",
    });
    return scene;
  }

  it("lets the requester take back a request nobody has answered", async () => {
    const { requester, recipient, meeting } = await scenario();
    await signIn(requester.id);

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    expect(result.ok).toBe(true);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("canceled");
    const [notification] = await getRepositories().notifications.listByGuest(
      recipient.id
    );
    expect(notification.text).toMatch(/canceled/);
  });

  it("lets either party call off a confirmed meeting", async () => {
    const { requester, meeting } = await accepted();

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    expect(result.ok).toBe(true);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("canceled");
    // The one who cancelled is the recipient here, so the requester is told.
    const [notification] = await getRepositories().notifications.listByGuest(
      requester.id
    );
    expect(notification.text).toMatch(/canceled/);
  });

  // Calling a meeting off is the one point in the feature where a word of
  // explanation is worth something, so the note rides with the status change.
  it("keeps the note the canceller left, trimmed", async () => {
    const { requester, meeting } = await scenario();
    await signIn(requester.id);

    const result = await cancelMeetingAction({
      meetingId: meeting.id,
      note: "  sorry, my session moved  ",
    });

    expect(result.ok).toBe(true);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.cancelNote
    ).toBe("sorry, my session moved");
  });

  it("takes no note at all, as it always could", async () => {
    const { requester, meeting } = await scenario();
    await signIn(requester.id);

    await cancelMeetingAction({ meetingId: meeting.id });

    expect(
      (await getRepositories().meetings.findById(meeting.id))?.cancelNote
    ).toBe("");
  });

  // The note is part of the cancellation, not a message of its own: a refused
  // cancel leaves the meeting exactly as it was.
  it("writes no note when there is nothing left to cancel", async () => {
    const { requester, meeting } = await scenario();
    await signIn(requester.id);
    await cancelMeetingAction({ meetingId: meeting.id, note: "first" });

    const again = await cancelMeetingAction({
      meetingId: meeting.id,
      note: "second",
    });

    expect(again.ok).toBe(false);
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.cancelNote
    ).toBe("first");
  });

  // What guests write to each other stays in the app, the same call the
  // request's line of context already makes (emails/meeting.tsx).
  it("keeps the note out of the notification and the mail", async () => {
    const { requester, recipient, meeting } = await scenario();
    await signIn(requester.id);

    await cancelMeetingAction({
      meetingId: meeting.id,
      note: "my session moved",
    });

    const [notification] = await getRepositories().notifications.listByGuest(
      recipient.id
    );
    expect(notification.text).toMatch(/canceled/);
    expect(notification.text).not.toMatch(/my session moved/);
    expect(JSON.stringify(vi.mocked(sendMail).mock.calls)).not.toContain(
      "my session moved"
    );
  });

  // While it is pending, the person asked has Decline: cancelling it on the
  // requester's behalf would tell them something else happened.
  it("refuses the recipient a pending request", async () => {
    const { meeting } = await scenario();

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    // Not "nothing left to cancel": there is, and the real answer is which
    // button to use.
    expect(result).toEqual({
      ok: false,
      error: "You were the one asked — decline it instead",
    });
    expect(
      (await getRepositories().meetings.findById(meeting.id))?.status
    ).toBe("pending");
  });

  it("refuses anyone who is not part of the meeting", async () => {
    const { event, meeting } = await accepted();
    const bystander = await createGuest({ eventId: event.id });
    await signIn(bystander.id);

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    expect(result.ok).toBe(false);
  });

  it("refuses a meeting that is already declined", async () => {
    const { requester, meeting } = await scenario();
    await respondToMeetingAction({
      meetingId: meeting.id,
      response: "decline",
    });
    await signIn(requester.id);

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    expect(result.ok).toBe(false);
  });

  it("refuses a meeting whose slot has already started", async () => {
    const { requester, meeting } = await scenario({ slotStart: PAST_SLOT });
    await signIn(requester.id);

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    expect(result.ok).toBe(false);
  });

  it("refuses when nobody is signed in", async () => {
    const { meeting } = await accepted();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);

    const result = await cancelMeetingAction({ meetingId: meeting.id });

    expect(result.ok).toBe(false);
  });

  it("answers a malformed payload instead of throwing", async () => {
    await accepted();

    const result = await cancelMeetingAction({
      meetingId: 42 as unknown as string,
    });

    expect(result).toEqual({ ok: false, error: "Invalid request" });
  });
});
