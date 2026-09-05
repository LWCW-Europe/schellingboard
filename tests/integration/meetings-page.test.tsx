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

// Both throw for real, to abandon the render; the messages are what the
// tests read.
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT;${url}`);
  },
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// A client component that reads router search params; the page only decides
// whether to render it.
vi.mock("@/app/(site)/[eventSlug]/meeting-modal", () => ({
  MeetingModalFromUrl: () => "MEETING_MODAL_STUB",
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

  async function scenario(opts: {
    phase: "proposal" | "scheduling";
    meetingsEnabled: boolean;
  }) {
    const event = await createEvent({ phase: opts.phase });
    await createDay(event.id);
    const guest = await createGuest({ name: "Ada", eventId: event.id });
    await getRepositories().events.update(event.id, {
      meetingsEnabled: opts.meetingsEnabled,
    });
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));
    return { event, guest };
  }

  // Availability is set under Settings now; nothing else lived here.
  it("sends you to the schedule when there is no meeting to open", async () => {
    const { event } = await scenario({
      phase: "scheduling",
      meetingsEnabled: true,
    });

    await expect(renderPage(event.slug)).rejects.toThrow(
      new RegExp(`NEXT_REDIRECT;/${event.slug}$`)
    );
  });

  // Where a meeting notification lands: on the schedule, where the meeting
  // sits in its slot next to whatever it clashes with.
  it("opens a meeting on top of the schedule once scheduling has begun", async () => {
    const { event } = await scenario({
      phase: "scheduling",
      meetingsEnabled: true,
    });

    await expect(
      renderPage(event.slug, { viewMeeting: "any-id" })
    ).rejects.toThrow(`NEXT_REDIRECT;/${event.slug}?viewMeeting=any-id`);
  });

  // Before then the schedule redirects to the proposals, and the meeting
  // would be lost on the way.
  it("opens a meeting here before scheduling starts", async () => {
    const { event } = await scenario({
      phase: "proposal",
      meetingsEnabled: true,
    });

    expect(await renderPage(event.slug, { viewMeeting: "any-id" })).toMatch(
      /MEETING_MODAL_STUB/
    );
  });

  // A request outlives the switch: it is neither canceled nor deleted when the
  // organizer turns meetings off, and its notification points here forever.
  it("still opens a meeting once the organizer has switched meetings off", async () => {
    const { event } = await scenario({
      phase: "proposal",
      meetingsEnabled: false,
    });

    expect(await renderPage(event.slug, { viewMeeting: "any-id" })).toMatch(
      /MEETING_MODAL_STUB/
    );
  });
});
