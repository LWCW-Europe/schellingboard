import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// FR-005/FR-020: a recorded attendee count is host-only. The enforcement is
// structural — `attendeeCount` is absent from the `Session` type, which the
// event layout serialises into every visitor's browser (docs/dev/adr/0006).
// "Structurally impossible" is a claim a test should hold, not something a
// reviewer has to remember, so this pins both payloads that carry sessions:
// the attendee-facing event layout and the admin session list.

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

const captured: { sessions?: unknown } = {};
vi.mock("@/app/(site)/[eventSlug]/event-provider-wrapper", () => ({
  EventProviderWrapper: ({
    eventContextValue,
  }: {
    eventContextValue: { sessions: unknown };
  }) => {
    captured.sessions = eventContextValue.sessions;
    return "PROVIDER_STUB";
  },
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
import { getRepositories } from "@/db/container";

const HOUR_MS = 60 * 60 * 1000;
const RECORDED_COUNT = 137;

/** Every key anywhere in the payload, however deeply nested. */
function allKeys(value: unknown, into = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) allKeys(item, into);
  } else if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      into.add(key);
      allKeys(nested, into);
    }
  }
  return into;
}

/** Every primitive value anywhere in the payload. */
function allValues(value: unknown, into: unknown[] = []): unknown[] {
  if (Array.isArray(value)) {
    for (const item of value) allValues(item, into);
  } else if (value && typeof value === "object") {
    for (const nested of Object.values(value)) allValues(nested, into);
  } else {
    into.push(value);
  }
  return into;
}

function expectNoCount(payload: unknown): void {
  for (const key of allKeys(payload)) {
    expect(key.toLowerCase()).not.toContain("attendeecount");
    expect(key.toLowerCase()).not.toContain("attendee_count");
  }
  // Belt and braces: the number itself must not appear under some other name.
  // Value by value rather than as a substring of the JSON, where a seeded
  // title or a millisecond stamp can carry the same digits by coincidence.
  for (const value of allValues(payload)) {
    expect(value).not.toBe(RECORDED_COUNT);
    expect(value).not.toBe(String(RECORDED_COUNT));
  }
}

async function seed() {
  const event = await createEvent({ phase: "scheduling" });
  const host = await createGuest({ eventId: event.id });
  const attendee = await createGuest({ eventId: event.id });
  const now = Date.now();
  const session = await createSession(event.id, {
    hostIds: [host.id],
    startTime: new Date(now - 3 * HOUR_MS),
    endTime: new Date(now - HOUR_MS),
  });
  await getRepositories().sessions.setAttendeeCount(session.id, RECORDED_COUNT);
  return { event, host, attendee, session };
}

describe("a recorded attendee count never reaches a session payload", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    captured.sessions = undefined;
  });

  it("is absent from the event layout payload served to a non-host (FR-005)", async () => {
    const { event, attendee } = await seed();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(attendee.id));

    const { EventLayoutContent } =
      await import("@/app/(site)/[eventSlug]/layout-content");
    renderToStaticMarkup(
      await EventLayoutContent({ eventSlug: event.slug, children: null })
    );

    expect(captured.sessions).toBeDefined();
    expectNoCount(captured.sessions);
  });

  it("is absent even from the payload served to the host who recorded it", async () => {
    const { event, host } = await seed();
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));

    const { EventLayoutContent } =
      await import("@/app/(site)/[eventSlug]/layout-content");
    renderToStaticMarkup(
      await EventLayoutContent({ eventSlug: event.slug, children: null })
    );

    // The host reads their count through the server action, never off the
    // shared payload — otherwise the field would exist on `Session` and every
    // other visitor would receive it too.
    expectNoCount(captured.sessions);
  });

  it("is absent from the admin session read surface (FR-020)", async () => {
    const { event } = await seed();

    const page = await getRepositories().sessions.searchByEvent(event.id, {
      limit: 50,
      offset: 0,
    });

    expect(page.rows).toHaveLength(1);
    expectNoCount(page.rows);
  });

  it("is absent from every other session listing", async () => {
    const { event, host } = await seed();
    const { sessions } = getRepositories();

    for (const rows of [
      await sessions.list(),
      await sessions.listByEvent(event.id),
      await sessions.listScheduled(),
      await sessions.listScheduledByEvent(event.id),
      await sessions.listHostedByGuest(host.id),
    ]) {
      expect(rows.length).toBeGreaterThan(0);
      expectNoCount(rows);
    }
  });
});
