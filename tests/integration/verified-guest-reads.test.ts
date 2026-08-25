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

// Guards step 6 of docs/dev/design/auth-improvements-plan.md: server components
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

// These pages render heavy client components (a file-upload form, a directory
// that reads router search params) that need a browser-like environment this
// test file doesn't set up. Stubbed out: this test only cares which branch
// the page takes, not those components' own behavior (covered elsewhere). The
// directory stub echoes the guest it was handed, since that is the branch.
vi.mock("@/app/(site)/guests/edit/profile-form", () => ({
  ProfileForm: () => "PROFILE_FORM_STUB",
}));
vi.mock("@/app/(site)/guests/directory", () => ({
  AttendeeDirectory: ({ currentUserId }: { currentUserId: string | null }) =>
    `CURRENT_USER:${currentUserId ?? "none"}`,
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";

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
      cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

      const html = renderToStaticMarkup(await EditProfilePage());
      expect(html).not.toMatch(/PROFILE_FORM_STUB/);
      // Told to log in, not to pick a name they have already picked.
      expect(html).toMatch(/this name is protected/i);
    });

    it("renders the edit form for a verified protected guest", async () => {
      const { default: EditProfilePage } =
        await import("@/app/(site)/guests/edit/page");
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));

      const html = renderToStaticMarkup(await EditProfilePage());
      expect(html).toMatch(/PROFILE_FORM_STUB/);
    });
  });

  // One layout serves both /guests and /guests/<id>: it resolves the acting
  // guest once and hands it down, which is what decides whether "Edit profile"
  // shows beside the list and on the reader's own profile.
  describe("attendee directory layout", () => {
    const renderLayout = async () => {
      const { default: DirectoryLayout } =
        await import("@/app/(site)/guests/(directory)/layout");
      return renderToStaticMarkup(await DirectoryLayout({ children: null }));
    };

    it("treats an unverified protected guest as logged out", async () => {
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

      expect(await renderLayout()).toContain("CURRENT_USER:none");
    });

    it("passes on a verified protected guest", async () => {
      const guest = await createGuest();
      await protectGuest(guest.id);
      cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));

      expect(await renderLayout()).toContain(`CURRENT_USER:${guest.id}`);
    });
  });
});
