import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// The event layout preloads the current guest's RSVP list into the SSR
// payload. That list is private to the guest (see /api/rsvps and
// tests/integration/verified-guest-reads.test.ts), so it must be seeded from
// the *verified* current user — a forgeable plain `user` cookie naming a
// protected guest must not leak their RSVPs into the server-rendered page.

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

// Capture the rsvps handed to the client provider without rendering the heavy
// client tree it wraps.
const captured: { rsvps?: unknown[] } = {};
vi.mock("@/app/(site)/[eventSlug]/event-provider-wrapper", () => ({
  EventProviderWrapper: ({
    eventContextValue,
  }: {
    eventContextValue: { rsvps: unknown[] };
  }) => {
    captured.rsvps = eventContextValue.rsvps;
    return "PROVIDER_STUB";
  },
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest, createEvent, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createUserAuthCookie, USER_AUTH_COOKIE_NAME } from "@/utils/auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

async function renderLayout(eventSlug: string): Promise<void> {
  const { EventLayoutContent } =
    await import("@/app/(site)/[eventSlug]/layout-content");
  renderToStaticMarkup(await EventLayoutContent({ eventSlug, children: null }));
}

describe("event layout seeds RSVPs from the verified guest", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    captured.rsvps = undefined;
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("does not seed a protected guest's RSVPs without a verified session", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const session = await createSession(event.id);
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: guest.id,
    });
    await protectGuest(guest.id);

    // Forged plain cookie only — no verified user-auth cookie.
    cookieJar.set("user", guest.id);

    await renderLayout(event.slug);

    expect(captured.rsvps).toEqual([]);
  });

  it("seeds RSVPs for a verified protected guest", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest({ eventId: event.id });
    const session = await createSession(event.id);
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: guest.id,
    });
    await protectGuest(guest.id);

    cookieJar.set("user", guest.id);
    cookieJar.set(
      USER_AUTH_COOKIE_NAME,
      (await createUserAuthCookie(guest.id)).value
    );

    await renderLayout(event.slug);

    expect(captured.rsvps).toHaveLength(1);
  });
});
