import fs from "node:fs";
import path from "node:path";
import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
  isMailerConfigured: () => true,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
      set: () => {},
    }),
  headers: () => Promise.resolve(new Headers()),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { NOT_AUTHENTICATED_ERROR } from "@/utils/action-auth";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

/** Every file under app/ that Next treats as a server-action module. */
function actionFiles(): string[] {
  const root = path.join(process.cwd(), "app");
  const results: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".ts")) {
        if (fs.readFileSync(full, "utf8").startsWith('"use server"')) {
          results.push(path.relative(root, full));
        }
      }
    }
  }
  walk(root);
  return results.sort();
}

// Admin actions live behind the admin cookie, which is independent of site
// auth by design (see proxy.ts). Each checks isAdminRequest() itself; that
// contract is covered by the admin-* integration tests.
const ADMIN_FILE = /^actions\/admin-(?!auth)/;

// Deliberately reachable before site auth. A login action cannot require
// being logged in, and logout only ever clears the caller's own cookie.
const PRE_AUTH = new Set([
  "actions/auth.ts:loginAction",
  "actions/auth.ts:logoutAction",
  "actions/admin-auth.ts:adminLoginAction",
  "actions/admin-auth.ts:adminLogoutAction",
]);

/**
 * Site-gated actions, each with a call that must be refused when no
 * site-auth cookie is present. The arguments only have to reach the guard —
 * it runs before anything looks at them.
 */
const SITE_GUARDED: Record<string, () => Promise<unknown>> = {
  "(site)/guests/profile-activity.ts:listProfileActivity": async () => {
    const { listProfileActivity } =
      await import("@/app/(site)/guests/profile-activity");
    return listProfileActivity("some-guest");
  },
  "(site)/[eventSlug]/clash-actions.ts:detectHostClashes": async () => {
    const { detectHostClashes } =
      await import("@/app/(site)/[eventSlug]/clash-actions");
    return detectHostClashes({
      eventId: "e",
      hostIds: ["g"],
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    });
  },
  "(site)/[eventSlug]/session-actions.ts:revalidateEvent": async () => {
    const { revalidateEvent } =
      await import("@/app/(site)/[eventSlug]/session-actions");
    return revalidateEvent("some-event");
  },
  "(site)/[eventSlug]/proposals/actions.ts:createProposal": async () => {
    const { createProposal } =
      await import("@/app/(site)/[eventSlug]/proposals/actions");
    return createProposal({ eventId: "e", eventSlug: "s", title: "T" });
  },
  "(site)/[eventSlug]/proposals/actions.ts:updateProposal": async () => {
    const { updateProposal } =
      await import("@/app/(site)/[eventSlug]/proposals/actions");
    return updateProposal("p", { eventSlug: "s", title: "T" });
  },
  "(site)/[eventSlug]/proposals/actions.ts:deleteProposal": async () => {
    const { deleteProposal } =
      await import("@/app/(site)/[eventSlug]/proposals/actions");
    return deleteProposal("p", "s");
  },
  "(site)/[eventSlug]/comment-actions.ts:createProposalComment": async () => {
    const { createProposalComment } =
      await import("@/app/(site)/[eventSlug]/comment-actions");
    return createProposalComment({
      proposalId: "p",
      eventSlug: "s",
      body: "b",
    });
  },
  "(site)/[eventSlug]/comment-actions.ts:createSessionComment": async () => {
    const { createSessionComment } =
      await import("@/app/(site)/[eventSlug]/comment-actions");
    return createSessionComment({ sessionId: "s", body: "b" });
  },
  "(site)/[eventSlug]/comment-actions.ts:createProfileComment": async () => {
    const { createProfileComment } =
      await import("@/app/(site)/[eventSlug]/comment-actions");
    return createProfileComment({ profileId: "g", body: "b" });
  },
  "(site)/[eventSlug]/comment-actions.ts:updateComment": async () => {
    const { updateComment } =
      await import("@/app/(site)/[eventSlug]/comment-actions");
    return updateComment({ commentId: "c", eventSlug: "s", body: "b" });
  },
  "(site)/[eventSlug]/comment-actions.ts:toggleCommentLike": async () => {
    const { toggleCommentLike } =
      await import("@/app/(site)/[eventSlug]/comment-actions");
    return toggleCommentLike({ commentId: "c", eventSlug: "s" });
  },
  "(site)/[eventSlug]/comment-actions.ts:deleteComment": async () => {
    const { deleteComment } =
      await import("@/app/(site)/[eventSlug]/comment-actions");
    return deleteComment({ commentId: "c", eventSlug: "s" });
  },
  "actions/profile.ts:updateProfileAction": async () => {
    const { updateProfileAction } = await import("@/app/actions/profile");
    return updateProfileAction({ name: "N" });
  },
  "actions/settings.ts:updateEmailSettingsAction": async () => {
    const { updateEmailSettingsAction } =
      await import("@/app/actions/settings");
    return updateEmailSettingsAction({
      rsvpChange: true,
      hostChange: true,
      cohostAdd: true,
      proposalComment: true,
      sessionComment: true,
      profileComment: true,
      commentThread: true,
    });
  },
  "actions/user-auth.ts:requestLoginCodeAction": async () => {
    const { requestLoginCodeAction } = await import("@/app/actions/user-auth");
    return requestLoginCodeAction("g");
  },
  "actions/user-auth.ts:requestPasswordLinkAction": async () => {
    const { requestPasswordLinkAction } =
      await import("@/app/actions/user-auth");
    return requestPasswordLinkAction("g");
  },
  "actions/user-auth.ts:loginAsGuestAction": async () => {
    const { loginAsGuestAction } = await import("@/app/actions/user-auth");
    return loginAsGuestAction("g", "pw");
  },
  "actions/user-auth.ts:setPasswordWithTokenAction": async () => {
    const { setPasswordWithTokenAction } =
      await import("@/app/actions/user-auth");
    return setPasswordWithTokenAction("g", "t", "password123");
  },
  "actions/user-auth.ts:changePasswordAction": async () => {
    const { changePasswordAction } = await import("@/app/actions/user-auth");
    return changePasswordAction("old", "password123");
  },
  "actions/user-auth.ts:disableProtectionAction": async () => {
    const { disableProtectionAction } = await import("@/app/actions/user-auth");
    return disableProtectionAction("pw");
  },
  "actions/user-auth.ts:currentVerifiedUserAction": async () => {
    const { currentVerifiedUserAction } =
      await import("@/app/actions/user-auth");
    return currentVerifiedUserAction();
  },
  "actions/user-auth.ts:selectUserAction": async () => {
    const { selectUserAction } = await import("@/app/actions/user-auth");
    return selectUserAction("g");
  },
};

describe("server-action auth guard", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("SITE_PASSWORD", "site-pw");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("every 'use server' export is classified", async () => {
    const unclassified: string[] = [];
    for (const file of actionFiles()) {
      if (ADMIN_FILE.test(file)) continue;
      const mod = (await import(
        /* @vite-ignore */ path.join(process.cwd(), "app", file)
      )) as Record<string, unknown>;
      for (const name of Object.keys(mod)) {
        const key = `${file}:${name}`;
        if (!PRE_AUTH.has(key) && !(key in SITE_GUARDED)) {
          unclassified.push(key);
        }
      }
    }
    expect(
      unclassified,
      "a new server action needs an entry in PRE_AUTH or SITE_GUARDED in " +
        "tests/integration/action-auth-guard.test.ts"
    ).toEqual([]);
  });

  for (const [key, call] of Object.entries(SITE_GUARDED)) {
    it(`${key} refuses a caller with no site-auth cookie`, async () => {
      await expect(call()).rejects.toThrow(NOT_AUTHENTICATED_ERROR);
    });
  }
});
