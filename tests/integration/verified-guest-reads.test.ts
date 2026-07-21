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

// Guards step 6 of docs/design/auth-improvements-plan.md: server components
// that read the current guest must use verifiedCurrentUser, not the raw
// `user` cookie, so a protected guest without a verified session isn't
// treated as logged in.

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

// These pages render heavy client components (a file-upload form, a table
// that reads router search params) that need a browser-like environment this
// test file doesn't set up. Stubbed out: this test only cares which branch
// the page takes, not those components' own behavior (covered elsewhere).
vi.mock("@/app/(site)/guests/edit/profile-form", () => ({
  ProfileForm: () => "PROFILE_FORM_STUB",
}));
vi.mock("@/app/(site)/guests/attendee-list", () => ({
  AttendeeList: () => "ATTENDEE_LIST_STUB",
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createUserAuthCookie, USER_AUTH_COOKIE_NAME } from "@/utils/auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

describe("server components read the verified guest, not the raw cookie", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("guests/edit page", () => {
    it("treats an unverified protected guest as logged out", async () => {
      const { default: EditProfilePage } =
        await import("@/app/(site)/guests/edit/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);

      const html = renderToStaticMarkup(await EditProfilePage());
      expect(html).toMatch(/select who you are/i);
    });

    it("renders the edit form for a verified protected guest", async () => {
      const { default: EditProfilePage } =
        await import("@/app/(site)/guests/edit/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);
      cookieJar.set(
        USER_AUTH_COOKIE_NAME,
        (await createUserAuthCookie(guest.id)).value
      );

      const html = renderToStaticMarkup(await EditProfilePage());
      expect(html).not.toMatch(/select who you are/i);
    });
  });

  describe("guests/[guestId] page", () => {
    it("doesn't show 'Edit profile' to an unverified protected guest viewing their own page", async () => {
      const { default: GuestProfilePage } =
        await import("@/app/(site)/guests/[guestId]/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);

      const html = renderToStaticMarkup(
        await GuestProfilePage({
          params: Promise.resolve({ guestId: guest.id }),
          searchParams: Promise.resolve({}),
        })
      );
      expect(html).not.toMatch(/edit profile/i);
    });

    it("shows 'Edit profile' to a verified protected guest viewing their own page", async () => {
      const { default: GuestProfilePage } =
        await import("@/app/(site)/guests/[guestId]/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);
      cookieJar.set(
        USER_AUTH_COOKIE_NAME,
        (await createUserAuthCookie(guest.id)).value
      );

      const html = renderToStaticMarkup(
        await GuestProfilePage({
          params: Promise.resolve({ guestId: guest.id }),
          searchParams: Promise.resolve({}),
        })
      );
      expect(html).toMatch(/edit profile/i);
    });
  });

  describe("guests page", () => {
    it("doesn't show 'Edit profile' for an unverified protected guest", async () => {
      const { default: GuestsPage } = await import("@/app/(site)/guests/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);

      const html = renderToStaticMarkup(
        await GuestsPage({ searchParams: Promise.resolve({}) })
      );
      expect(html).not.toMatch(/edit profile/i);
    });

    it("shows 'Edit profile' for a verified protected guest", async () => {
      const { default: GuestsPage } = await import("@/app/(site)/guests/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set("user", guest.id);
      cookieJar.set(
        USER_AUTH_COOKIE_NAME,
        (await createUserAuthCookie(guest.id)).value
      );

      const html = renderToStaticMarkup(
        await GuestsPage({ searchParams: Promise.resolve({}) })
      );
      expect(html).toMatch(/edit profile/i);
    });
  });
});
