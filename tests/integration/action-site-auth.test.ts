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

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => {
    revalidatePath(...args);
  },
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createDay,
  slotStart,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import { AUTH_COOKIE_NAME, createAuthCookie } from "@/utils/auth";
import { listProfileActivity } from "@/app/(site)/guests/profile-activity";
import { detectHostClashes } from "@/app/(site)/[eventSlug]/clash-actions";
import { revalidateEvent } from "@/app/(site)/[eventSlug]/session-actions";
import { createProposal } from "@/app/(site)/[eventSlug]/proposals/actions";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function siteAuthenticate(): Promise<void> {
  cookieJar.set(AUTH_COOKIE_NAME, (await createAuthCookie()).value);
}

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

const T = (h: number) => new Date(Date.UTC(2030, 0, 1, h, 0, 0));

describe("server actions require site auth", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    revalidatePath.mockClear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("SITE_PASSWORD", "site-pw");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("listProfileActivity refuses a caller with no site-auth cookie", async () => {
    const guest = await createGuest();
    await expect(listProfileActivity(guest.id)).rejects.toThrow();
  });

  it("listProfileActivity answers a site-authenticated caller", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    await createSession(event.id, {
      title: "Their talk",
      hostIds: [guest.id],
      startTime: T(10),
      endTime: T(11),
    });
    await siteAuthenticate();

    const activity = await listProfileActivity(guest.id);
    expect(activity.hosting.map((s) => s.title)).toEqual(["Their talk"]);
  });

  it("revalidateEvent refuses a caller with no site-auth cookie", async () => {
    await expect(revalidateEvent("some-event")).rejects.toThrow();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidateEvent works for a site-authenticated caller", async () => {
    await siteAuthenticate();
    await revalidateEvent("some-event");
    expect(revalidatePath).toHaveBeenCalledWith("/some-event", "layout");
  });

  it("detectHostClashes refuses a caller with no site-auth cookie", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    await expect(
      detectHostClashes({
        eventId: event.id,
        hostIds: [host.id],
        start: T(10).toISOString(),
        end: T(11).toISOString(),
      })
    ).rejects.toThrow();
  });

  // The `busy` clash kind exists to keep a host's private RSVPs off the
  // client, so site auth alone is too weak a gate: it is shared with every
  // attendee. The caller must be acting as a guest in their own right.
  it("detectHostClashes refuses a site-authenticated caller with no name selected", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    await siteAuthenticate();

    await expect(
      detectHostClashes({
        eventId: event.id,
        hostIds: [host.id],
        start: T(10).toISOString(),
        end: T(11).toISOString(),
      })
    ).rejects.toThrow();
  });

  it("detectHostClashes refuses a caller claiming a protected guest without a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const caller = await createGuest({ eventId: event.id });
    await protectGuest(caller.id);
    await siteAuthenticate();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(caller.id));

    await expect(
      detectHostClashes({
        eventId: event.id,
        hostIds: [host.id],
        start: T(10).toISOString(),
        end: T(11).toISOString(),
      })
    ).rejects.toThrow();
  });

  it("detectHostClashes answers a verified guest", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ eventId: event.id });
    const caller = await createGuest({ eventId: event.id });
    await createSession(event.id, {
      title: "Their talk",
      hostIds: [host.id],
      startTime: T(10),
      endTime: T(11),
    });
    await siteAuthenticate();
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(caller.id));

    const clashes = await detectHostClashes({
      eventId: event.id,
      hostIds: [host.id],
      start: T(10).toISOString(),
      end: T(11).toISOString(),
    });
    expect(clashes).toHaveLength(1);
    expect(clashes[0].kind).toBe("hosting");
  });
});

// Creation only checked that the guest cookie wasn't falsely claiming a
// protected name, which an absent cookie passes — nothing is claimed, so
// nothing is verified. Creating now requires a name to actually be selected.
describe("creation requires a selected name", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("SITE_PASSWORD", "site-pw");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("createProposal refuses a caller with no name selected", async () => {
    const event = await createEvent({ phase: "proposal" });
    const guest = await createGuest({ eventId: event.id });
    await siteAuthenticate();

    const result = await createProposal({
      eventId: event.id,
      eventSlug: "test-event",
      title: "T",
      hostIds: [guest.id],
    });

    expect(result).toHaveProperty("error");
    expect(
      await getRepositories().sessionProposals.listByHost(guest.id)
    ).toEqual([]);
  });

  it("createProposal accepts a caller with a name selected", async () => {
    const event = await createEvent({ phase: "proposal" });
    const guest = await createGuest({ eventId: event.id });
    await siteAuthenticate();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

    const result = await createProposal({
      eventId: event.id,
      eventSlug: "test-event",
      title: "T",
      hostIds: [guest.id],
    });

    expect(result).toEqual({ success: true });
  });

  it("add-session refuses a caller with no name selected", async () => {
    const { POST } = await import("@/app/api/add-session/route");
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const location = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    const res = await POST(
      new NextRequest("http://test/api/add-session", {
        method: "POST",
        body: JSON.stringify({
          title: "T",
          description: "",
          closed: false,
          hosts: [guest],
          location,
          dayId: day.id,
          startTime: slotStart(day, 60),
          duration: 60,
        }),
      })
    );

    expect(res.status).toBe(403);
    expect(
      await getRepositories().sessions.listHostedByGuest(guest.id)
    ).toEqual([]);
  });
});
