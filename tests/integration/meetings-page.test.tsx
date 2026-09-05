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
import type { ReactNode } from "react";

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

// Both are client components — one reads router search params, the other a
// form's own state. This test only cares which of them the page renders.
vi.mock("@/app/(site)/[eventSlug]/meetings/availability-form", () => ({
  AvailabilityForm: () => "AVAILABILITY_FORM_STUB",
}));
vi.mock("@/app/(site)/[eventSlug]/meeting-modal", () => ({
  MeetingModalFromUrl: () => "MEETING_MODAL_STUB",
}));
// The modal reads the viewer's meetings from this provider, so where the page
// renders it says whether it can load one at all.
vi.mock("@/app/(site)/[eventSlug]/use-meetings", () => ({
  MeetingsProvider: ({
    children,
    evenIfMeetingsAreOff,
  }: {
    children: ReactNode;
    evenIfMeetingsAreOff?: boolean;
  }) => (
    <div data-provider-off={String(Boolean(evenIfMeetingsAreOff))}>
      {children}
    </div>
  ),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createDay } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { GUEST_COOKIE_NAME, verifiedGuestValue } from "../helpers/guest-cookie";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function renderPage(
  eventSlug: string,
  searchParams: { viewMeeting?: string } = {}
): Promise<string> {
  const { default: MeetingsPage } =
    await import("@/app/(site)/[eventSlug]/meetings/page");
  return renderToStaticMarkup(
    await MeetingsPage({
      params: Promise.resolve({ eventSlug }),
      searchParams: Promise.resolve(searchParams),
    })
  );
}

describe("the meetings page", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  async function scenario(meetingsEnabled: boolean) {
    const event = await createEvent({ phase: "scheduling" });
    await createDay(event.id);
    const guest = await createGuest({ name: "Ada", eventId: event.id });
    await getRepositories().events.update(event.id, { meetingsEnabled });
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));
    return { event, guest };
  }

  it("offers the availability form while the organizer offers meetings", async () => {
    const { event } = await scenario(true);

    expect(await renderPage(event.slug)).toMatch(/AVAILABILITY_FORM_STUB/);
  });

  // A request outlives the switch: it is neither canceled nor deleted when the
  // organizer turns meetings off, and its notification points here forever.
  it("still opens a meeting once the organizer has switched meetings off", async () => {
    const { event } = await scenario(false);

    const html = await renderPage(event.slug, { viewMeeting: "any-id" });

    // Inside the provider, and told to fetch even though the event no longer
    // offers meetings: outside one, or gated on the switch, the modal has
    // nothing to show but "Loading...".
    expect(html).toMatch(
      /<div data-provider-off="true">MEETING_MODAL_STUB<\/div>/
    );
    expect(html).not.toMatch(/AVAILABILITY_FORM_STUB/);
  });

  it("is gone with the feature when there is no meeting to open", async () => {
    const { event } = await scenario(false);

    await expect(renderPage(event.slug)).rejects.toThrow();
  });
});
