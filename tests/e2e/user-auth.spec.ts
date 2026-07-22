import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { openNameSwitcher, selectUser } from "./helpers/user";
import {
  getMessage,
  searchBySubject,
  skipWithoutMailpit,
} from "../helpers/mailpit";

// Priya Sharma is used by no other spec, so her protection settings can be
// mutated without racing parallel test files.
const PRIYA_EMAIL = "priya.sharma@example.com";
const PRIYA_PASSWORD = "priya-e2e-password";
const PRIYA_NEW_PASSWORD = "priya-e2e-password-2";

// Ahmad Karimi is used by no other spec, likewise.
const AHMAD_EMAIL = "ahmad.karimi@example.com";
const AHMAD_PASSWORD = "ahmad-e2e-password";
const AHMAD_NEW_PASSWORD = "ahmad-e2e-password-2";

const LOGIN_SUBJECT = "Your temporary login code";
const RESET_SUBJECT = "Set your password";

async function emailCount(subject: string, email: string): Promise<number> {
  const messages = await searchBySubject(subject);
  return messages.filter((m) => m.To.some((t) => t.Address === email)).length;
}

// Mailpit keeps emails from earlier runs, so callers pass the count they expect
// after a fresh send and we poll until it is reached, then read the newest
// message (Mailpit sorts newest first).
async function newestMessageHtml(
  subject: string,
  email: string,
  expectedCount: number
): Promise<string> {
  await expect
    .poll(() => emailCount(subject, email), { timeout: 5000 })
    .toBeGreaterThanOrEqual(expectedCount);
  const messages = (await searchBySubject(subject)).filter((m) =>
    m.To.some((t) => t.Address === email)
  );
  return (await getMessage(messages[0].ID)).HTML;
}

async function newestLoginCode(
  email: string,
  expectedCount: number
): Promise<string> {
  const html = await newestMessageHtml(LOGIN_SUBJECT, email, expectedCount);
  // The code must be clearly visible so it can be typed on another device
  // (alphabet has no I/O/0/1).
  const code = html.match(/>([A-HJ-NP-Z2-9]{8})</)?.[1];
  expect(code, "email should show the 8-character code").toBeTruthy();
  return code!;
}

async function newestResetLink(
  email: string,
  expectedCount: number
): Promise<string> {
  const html = await newestMessageHtml(RESET_SUBJECT, email, expectedCount);
  const link = html.match(/href="([^"]+)"/)?.[1]?.replace(/&amp;/g, "&");
  expect(link, "email should contain a reset link").toMatch(
    /^https?:\/\/.*\/auth\/reset\?/
  );
  return link!;
}

// Opens the header name-switcher modal and filters it (same navigation as
// selectUser, but the option list shows only the first 20 names, so names late
// in the alphabet must be typed to appear), without picking an option so the
// credential prompt can be asserted on.
async function openFilteredNameSwitcher(page: Page, filter: string) {
  const nameBox = await openNameSwitcher(page);
  await nameBox.pressSequentially(filter);
}

async function pickName(page: Page, name: string) {
  await openFilteredNameSwitcher(page, name.slice(0, 5));
  await page.getByRole("option", { name }).click();
}

const headerChip = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`Your name: ${name}`, "i") });

// Fills the credential prompt for a protected name and submits.
async function logInAs(page: Page, credential: string) {
  await page.getByLabel("Password or emailed code").fill(credential);
  await page.getByRole("button", { name: "Log in" }).click();
}

test("logging out from the chip menu clears the selected name", async ({
  page,
}) => {
  await login(page);
  await page.goto("/");
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();

  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  // Logout clears the site login too, so a password-protected site re-prompts
  // before landing on the anonymous state. Wait for the actual hard-reload
  // navigation rather than the chip's optimistic "Select your name" text.
  await page.waitForURL((url) => url.pathname === "/login");
  await login(page);
  await expect(
    page.getByRole("button", { name: "Your name", exact: true })
  ).toBeVisible();
  await pickName(page, "Bob Test");
  await expect(headerChip(page, "Bob Test")).toBeVisible();
});

test("protect a name via emailed link, then log in with password and single-use code", async ({
  page,
}) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see CONTRIBUTING.md § Running tests)"
  );
  // Many identity switches, each a real logout-then-login round trip, add up
  // to just over the 30s default once parallel workers compete for the server.
  test.slow();

  await login(page);
  await page.goto("/");
  await pickName(page, "Priya Sharma");

  // Enable protection: this emails a link to set the first password.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  await expect(
    page.getByText(/anyone can currently act under your name/i)
  ).toBeVisible();
  const resetBefore = await emailCount(RESET_SUBJECT, PRIYA_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  await expect(page.getByText(/check your email/i)).toBeVisible();
  const resetLink = await newestResetLink(PRIYA_EMAIL, resetBefore + 1);

  // Open the link as if on a fresh device — it must not log us in.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await page.goto(resetLink);
  await expect(
    page.getByRole("heading", { name: /set a password for Priya Sharma/i })
  ).toBeVisible();
  await page.getByLabel(/new password/i).fill(PRIYA_PASSWORD);
  await page.getByRole("button", { name: "Set password" }).click();
  await expect(page.getByText(/password set/i)).toBeVisible();
  await page.getByRole("link", { name: /go to sign in/i }).click();
  // Still Bob: the reset granted no session.
  await expect(headerChip(page, "Bob Test")).toBeVisible();

  // Switching to Priya now demands the password; a wrong one is rejected.
  const priyaOption = page.getByRole("option", { name: /Priya Sharma/i });
  await openFilteredNameSwitcher(page, "Priya");
  await expect(
    priyaOption.getByRole("img", { name: /protected/i })
  ).toBeVisible();
  await priyaOption.click();
  await expect(page.getByText(/has protected their account/i)).toBeVisible();
  await logInAs(page, "not-the-password");
  await expect(page.getByText(/wrong password or code/i)).toBeVisible();
  await logInAs(page, PRIYA_PASSWORD);
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // Log in with a single-use emailed code.
  await selectUser(page, /Bob Test/i);
  await openFilteredNameSwitcher(page, "Priya");
  await priyaOption.click();
  const codeBefore = await emailCount(LOGIN_SUBJECT, PRIYA_EMAIL);
  await page.getByRole("button", { name: /email me a code/i }).click();
  const code = await newestLoginCode(PRIYA_EMAIL, codeBefore + 1);
  await logInAs(page, code);
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // That code is single-use: it no longer works. The password still does.
  await selectUser(page, /Bob Test/i);
  await openFilteredNameSwitcher(page, "Priya");
  await priyaOption.click();
  await logInAs(page, code);
  await expect(page.getByText(/wrong password or code/i)).toBeVisible();
  await logInAs(page, PRIYA_PASSWORD);
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // Change the password from settings using the current one.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  await page.getByRole("button", { name: "Change password" }).click();
  await page.getByLabel("Current password").fill(PRIYA_PASSWORD);
  await page.getByLabel(/new password/i).fill(PRIYA_NEW_PASSWORD);
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByText("Password changed")).toBeVisible();

  // The new password works from a fresh switch.
  await selectUser(page, /Bob Test/i);
  await openFilteredNameSwitcher(page, "Priya");
  await priyaOption.click();
  await logInAs(page, PRIYA_NEW_PASSWORD);
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // Turn protection off with the current password; anyone can switch again.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  await page.getByRole("button", { name: "Turn off protection" }).click();
  await page.getByLabel("Current password").fill(PRIYA_NEW_PASSWORD);
  await page.getByRole("button", { name: "Turn off protection" }).click();
  await expect(page.getByText("Protection turned off")).toBeVisible();

  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await pickName(page, "Priya Sharma");
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();
});

test("forgot password: reset it via an emailed link", async ({ page }) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see CONTRIBUTING.md § Running tests)"
  );
  test.slow();

  await login(page);
  await page.goto("/");
  await pickName(page, "Ahmad Karimi");

  // Protect Ahmad and set the first password via the emailed link.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  const before1 = await emailCount(RESET_SUBJECT, AHMAD_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  const link1 = await newestResetLink(AHMAD_EMAIL, before1 + 1);
  // Wait for the switch to settle before navigating: a goto racing the
  // logout-then-select reload aborts an in-flight request (console error).
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await page.goto(link1);
  await page.getByLabel(/new password/i).fill(AHMAD_PASSWORD);
  await page.getByRole("button", { name: "Set password" }).click();
  await expect(page.getByText(/password set/i)).toBeVisible();
  await page.getByRole("link", { name: /go to sign in/i }).click();

  // Forgotten the password: request a reset from the login prompt.
  const ahmadOption = page.getByRole("option", { name: /Ahmad Karimi/i });
  await openFilteredNameSwitcher(page, "Ahmad");
  await ahmadOption.click();
  const before2 = await emailCount(RESET_SUBJECT, AHMAD_EMAIL);
  await page.getByRole("button", { name: /forgot your password/i }).click();
  await expect(page.getByText(/reset link sent|still valid/i)).toBeVisible();
  const link2 = await newestResetLink(AHMAD_EMAIL, before2 + 1);
  await page.goto(link2);
  await page.getByLabel(/new password/i).fill(AHMAD_NEW_PASSWORD);
  await page.getByRole("button", { name: "Set password" }).click();
  await expect(page.getByText(/password set/i)).toBeVisible();
  await page.getByRole("link", { name: /go to sign in/i }).click();

  // The new password works.
  await openFilteredNameSwitcher(page, "Ahmad");
  await ahmadOption.click();
  await logInAs(page, AHMAD_NEW_PASSWORD);
  await expect(headerChip(page, "Ahmad Karimi")).toBeVisible();
});
