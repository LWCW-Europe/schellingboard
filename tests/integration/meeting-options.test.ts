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

import { setupTestDb, resetTestDb } from "../helpers/db";
import { siteAuthenticate } from "../helpers/site-auth";
import {
  createEvent,
  createGuest,
  createDay,
  createSession,
} from "../helpers/factories";
import { GUEST_COOKIE_NAME, verifiedGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import { meetingOptionsFor } from "@/utils/meeting-options";
import { verifiedCurrentUser } from "@/utils/acting-guest";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

const DAY_START = new Date("2026-10-01T09:00:00.000Z");
const DAY_END = new Date("2026-10-01T12:00:00.000Z");
const SLOT_A = "2026-10-01T09:00:00.000Z";
const SLOT_B = "2026-10-01T09:30:00.000Z";
const SLOT_C = "2026-10-01T10:00:00.000Z";

async function signIn(guestId: string) {
  cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guestId));
}

async function scenario(opts?: {
  declared?: string[];
  eventPatch?: Record<string, unknown>;
}) {
  const repos = getRepositories();
  const event = await createEvent({ phase: "scheduling" });
  await repos.events.update(event.id, {
    meetingsEnabled: true,
    ...opts?.eventPatch,
  });
  await createDay(event.id, { start: DAY_START, end: DAY_END });
  const viewer = await createGuest({ eventId: event.id });
  const other = await createGuest({ name: "Yuki", eventId: event.id });
  await repos.meetingAvailability.replaceForGuest(
    other.id,
    event.id,
    (opts?.declared ?? [SLOT_A, SLOT_B, SLOT_C]).map((s) => new Date(s))
  );
  await signIn(viewer.id);
  return { event, viewer, other };
}

type Option = Awaited<ReturnType<typeof meetingOptionsFor>>[number];

// The profile resolves the viewer from their cookie before calling, so the
// signed-out case stays a real one.
const listMeetingOptions = async (recipientId: string): Promise<Option[]> =>
  meetingOptionsFor(
    await verifiedCurrentUser(await cookies()),
    recipientId,
    await getRepositories().events.list()
  );

const allSlots = (option: Option) => option.days.flatMap((d) => d.slots);

const slotAt = (option: Option, start: string) =>
  allSlots(option).find((s) => s.start === start)!;

describe("meeting options on a profile", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    await siteAuthenticate(cookieJar);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("offers the event, its meeting points and their declared slots", async () => {
    const { event, other } = await scenario({ declared: [SLOT_A, SLOT_C] });
    await getRepositories().meetingPoints.create({
      eventId: event.id,
      name: "Coffee bar",
      description: "By reception",
      sortIndex: 0,
    });

    const [option] = await listMeetingOptions(other.id);

    expect(option.eventName).toBe(event.name);
    expect(option.meetingPoints.map((p) => p.name)).toEqual(["Coffee bar"]);
    expect(slotAt(option, SLOT_A).state).toBe("available");
    expect(slotAt(option, SLOT_C).state).toBe("available");
  });

  // A slot they cleared reads as their decision, not a clash, and is the only
  // state the picker refuses to select.
  it("marks a slot they cleared unavailable", async () => {
    const { other } = await scenario({ declared: [SLOT_A] });

    const [option] = await listMeetingOptions(other.id);

    expect(slotAt(option, SLOT_B).state).toBe("unavailable");
  });

  it("marks a slot busy when they are hosting, and names the session", async () => {
    const { event, other } = await scenario();
    await createSession(event.id, {
      title: "Their talk",
      hostIds: [other.id],
      startTime: new Date(SLOT_A),
      endTime: new Date(SLOT_B),
    });

    const [option] = await listMeetingOptions(other.id);

    const slot = slotAt(option, SLOT_A);
    expect(slot.state).toBe("busy");
    expect(slot.clashes[0].kind).toBe("hosting");
    expect(slot.clashes[0].title).toBe("Their talk");
  });

  it("never names a session they only RSVP'd to", async () => {
    const { event, other } = await scenario();
    const secret = await createSession(event.id, {
      title: "Secret RSVP session",
      startTime: new Date(SLOT_A),
      endTime: new Date(SLOT_B),
    });
    await getRepositories().rsvps.create({
      sessionId: secret.id,
      guestId: other.id,
    });

    const [option] = await listMeetingOptions(other.id);

    const slot = slotAt(option, SLOT_A);
    expect(slot.state).toBe("busy");
    expect(slot.clashes[0].title).toBeNull();
    expect(JSON.stringify(option)).not.toContain("Secret RSVP session");
  });

  // The warning covers either party: your own clash matters to you too.
  it("marks a slot busy when the viewer is the one with the clash", async () => {
    const { event, viewer, other } = await scenario();
    await createSession(event.id, {
      title: "My own talk",
      hostIds: [viewer.id],
      startTime: new Date(SLOT_A),
      endTime: new Date(SLOT_B),
    });

    const [option] = await listMeetingOptions(other.id);

    const slot = slotAt(option, SLOT_A);
    expect(slot.state).toBe("busy");
    // Marked so the warning can say "You are hosting", not name the reader
    // back to themselves in the third person.
    expect(slot.clashes[0].isViewer).toBe(true);
  });

  it("does not mark the other party's clash as the viewer's own", async () => {
    const { event, other } = await scenario();
    await createSession(event.id, {
      title: "Their talk",
      hostIds: [other.id],
      startTime: new Date(SLOT_A),
      endTime: new Date(SLOT_B),
    });

    const [option] = await listMeetingOptions(other.id);

    expect(slotAt(option, SLOT_A).clashes[0].isViewer).toBe(false);
  });

  it("says nothing when they are open to no slots at all", async () => {
    const { other } = await scenario({ declared: [] });

    expect(await listMeetingOptions(other.id)).toEqual([]);
  });

  it("says nothing when the organizer has meetings off", async () => {
    const { other } = await scenario({
      eventPatch: { meetingsEnabled: false },
    });

    expect(await listMeetingOptions(other.id)).toEqual([]);
  });

  it("says nothing about your own profile", async () => {
    const { viewer } = await scenario();

    expect(await listMeetingOptions(viewer.id)).toEqual([]);
  });

  it("says nothing when nobody is signed in", async () => {
    const { other } = await scenario();
    cookieJar.clear();
    await siteAuthenticate(cookieJar);

    expect(await listMeetingOptions(other.id)).toEqual([]);
  });

  it("says nothing about an event only one of you attends", async () => {
    const { other } = await scenario();
    const outsider = await createGuest();
    await signIn(outsider.id);

    expect(await listMeetingOptions(other.id)).toEqual([]);
  });

  // Day one of a three-day event must stop being bookable on day three.
  it("leaves out slots that have already passed", async () => {
    const { event, other } = await scenario();
    const repos = getRepositories();
    await createDay(event.id, {
      start: new Date("2020-10-01T09:00:00.000Z"),
      end: new Date("2020-10-01T12:00:00.000Z"),
    });
    await repos.meetingAvailability.replaceForGuest(other.id, event.id, [
      new Date(SLOT_A),
      new Date("2020-10-01T09:00:00.000Z"),
    ]);

    const [option] = await listMeetingOptions(other.id);

    expect(allSlots(option).every((s) => s.start > "2021")).toBe(true);
  });

  it("offers one option per shared event that has meetings on", async () => {
    const { event, viewer, other } = await scenario();
    const repos = getRepositories();
    const second = await createEvent({ phase: "scheduling", name: "Second" });
    await repos.events.update(second.id, {
      meetingsEnabled: true,
    });
    await createDay(second.id, { start: DAY_START, end: DAY_END });
    await repos.guests.assignToEvent(second.id, [viewer.id, other.id]);
    await repos.meetingAvailability.replaceForGuest(other.id, second.id, [
      new Date(SLOT_A),
    ]);

    const options = await listMeetingOptions(other.id);

    expect(options.map((o) => o.eventName).sort()).toEqual(
      [event.name, second.name].sort()
    );
  });
});
