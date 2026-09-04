import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { openNameSwitcher, selectUser, tapUntilOpen } from "./helpers/user";
import {
  getMessage,
  newestBySubjectTo,
  skipWithoutMailpit,
} from "../helpers/mailpit";

// Priya Sharma is used by no other spec, so her protection settings can be
// mutated without racing parallel test files.
const PRIYA_EMAIL = "priya.sharma@example.com";
const PRIYA_PASSWORD = "priya-e2e-password";
const PRIYA_NEW_PASSWORD = "priya-e2e-password-2";

// Ahmad Karimi, likewise, for his protection settings. His profile is another
// matter: profile.spec.ts asserts the directory order between him and Alice, so
// nothing may edit it. Protecting a name doesn't — profileUpdatedAt is stamped
// only by a profile save.
const AHMAD_EMAIL = "ahmad.karimi@example.com";
const AHMAD_PASSWORD = "ahmad-e2e-password";
const AHMAD_NEW_PASSWORD = "ahmad-e2e-password-2";

// Thabo Ndlovu is used by no other spec, likewise, and is seeded unprotected.
const THABO_EMAIL = "thabo.ndlovu@example.com";
const THABO_PASSWORD = "thabo-e2e-password";

// Nadia Haddad, likewise: protected from a second browser, never from hers.
const NADIA_EMAIL = "nadia.haddad@example.com";
const NADIA_PASSWORD = "nadia-e2e-password";

const LOGIN_SUBJECT = "Your temporary login code";
const RESET_SUBJECT = "Set your password";

// Mailpit keeps mail from earlier runs and from earlier steps of this test, and
// these subjects are shared by all of them, so the mail a test just triggered
// is told from the rest by identity: callers take `mailOnTop` before the send
// and we wait for a different message to reach the top.
const mailOnTop = async (subject: string, email: string) =>
  (await newestBySubjectTo(subject, email))?.ID;

async function newestMessageHtml(
  subject: string,
  email: string,
  before: string | undefined
): Promise<string> {
  await expect
    // Rendering the mail, delivering it over SMTP and mailpit indexing it are
    // all outside the test's control and stretch under parallel load, so the
    // budget is generous; the poll exits as soon as the mail is there.
    .poll(() => mailOnTop(subject, email), { timeout: 15000 })
    .not.toBe(before);
  const newest = await newestBySubjectTo(subject, email);
  expect(
    newest,
    `a "${subject}" mail should have reached ${email}`
  ).toBeDefined();
  return (await getMessage(newest!.ID)).HTML;
}

async function newestLoginCode(
  email: string,
  before: string | undefined
): Promise<string> {
  const html = await newestMessageHtml(LOGIN_SUBJECT, email, before);
  // The code must be clearly visible so it can be typed on another device
  // (alphabet has no I/O/0/1).
  const code = html.match(/>([A-HJ-NP-Z2-9]{8})</)?.[1];
  expect(code, "email should show the 8-character code").toBeTruthy();
  return code!;
}

async function newestResetLink(
  email: string,
  before: string | undefined
): Promise<string> {
  const html = await newestMessageHtml(RESET_SUBJECT, email, before);
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

test("the name switcher focuses its search, and clearing it keeps the modal open", async ({
  page,
}) => {
  await login(page);
  await page.goto("/");

  // Not openNameSwitcher: that helper clicks the search box, which would
  // focus it and hide the very thing under test. Opening by hand still needs
  // tapUntilOpen for the hydration race.
  const nameBox = page.getByLabel("My name is:");
  await tapUntilOpen(
    page.getByRole("button", { name: "Your name", exact: true }),
    nameBox
  );
  await expect(nameBox).toBeFocused();

  await nameBox.pressSequentially("Bob");
  await expect(page.getByRole("option", { name: /Bob Test/i })).toBeVisible();
  await nameBox.press("Backspace");
  await nameBox.press("Backspace");
  await nameBox.press("Backspace");
  await expect(nameBox).toHaveValue("");

  // Emptying the search is not a deselection: the modal is still there and
  // still picks a name. A deselection reaches the server (selectUserAction)
  // before it closes the modal, so let that round trip drain first —
  // asserting straight after the last Backspace passes even when the bug is
  // there.
  await page.waitForLoadState("networkidle");
  await expect(nameBox).toBeVisible();
  await page.getByRole("option", { name: /Bob Test/i }).click();
  await expect(headerChip(page, "Bob Test")).toBeVisible();
});

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
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see docs/dev/testing.md § Running tests)"
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
  const resetBefore = await mailOnTop(RESET_SUBJECT, PRIYA_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  await expect(page.getByText(/check your email/i)).toBeVisible();
  const resetLink = await newestResetLink(PRIYA_EMAIL, resetBefore);

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
  // The credential field says whose credential it wants.
  await expect(page.getByLabel("Logging in as")).toHaveValue("Priya Sharma");
  await logInAs(page, "not-the-password");
  await expect(page.getByText(/wrong password or code/i)).toBeVisible();
  await logInAs(page, PRIYA_PASSWORD);
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // Log in with a single-use emailed code.
  await selectUser(page, /Bob Test/i);
  await openFilteredNameSwitcher(page, "Priya");
  await priyaOption.click();
  const codeBefore = await mailOnTop(LOGIN_SUBJECT, PRIYA_EMAIL);
  await page.getByRole("button", { name: /email me a code/i }).click();
  const code = await newestLoginCode(PRIYA_EMAIL, codeBefore);
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
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see docs/dev/testing.md § Running tests)"
  );
  test.slow();

  await login(page);
  await page.goto("/");
  await pickName(page, "Ahmad Karimi");

  // Protect Ahmad and set the first password via the emailed link.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  const before1 = await mailOnTop(RESET_SUBJECT, AHMAD_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  const link1 = await newestResetLink(AHMAD_EMAIL, before1);
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
  const before2 = await mailOnTop(RESET_SUBJECT, AHMAD_EMAIL);
  await page.getByRole("button", { name: /forgot your password/i }).click();
  await expect(
    page.getByText(/reset link sent|emailed to you moments ago/i)
  ).toBeVisible();
  const link2 = await newestResetLink(AHMAD_EMAIL, before2);
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

// Regression test for #805. The header chip is client state, seeded once when
// the layout mounts and kept across client-side navigations — so the browser
// that enables protection on its own selected name (its "open" cookie stops
// being honoured the moment the password is set) used to go on showing that
// name, offering a menu whose "Edit profile" and "Settings" then insisted no
// name was selected, with no picker in sight to fix it.
test("setting a password drops the selection the same browser was holding", async ({
  page,
}) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see docs/dev/testing.md § Running tests)"
  );
  test.slow();

  await login(page);
  await page.goto("/");
  await pickName(page, "Thabo Ndlovu");
  await expect(headerChip(page, "Thabo Ndlovu")).toBeVisible();

  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  const resetBefore = await mailOnTop(RESET_SUBJECT, THABO_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  await expect(page.getByText(/check your email/i)).toBeVisible();
  const resetLink = await newestResetLink(THABO_EMAIL, resetBefore);

  // Unlike the test above, the link is opened in the browser that still holds
  // the selection — the case the bug was reported for.
  await page.goto(resetLink);
  await page.getByLabel(/new password/i).fill(THABO_PASSWORD);
  await page.getByRole("button", { name: "Set password" }).click();
  await expect(page.getByText(/password set/i)).toBeVisible();

  // Setting the password logs this browser out, and the header says so right
  // away — no navigation and no reload in between.
  await expect(
    page.getByRole("button", { name: "Your name", exact: true })
  ).toBeVisible();

  await page.getByRole("link", { name: /go to sign in/i }).click();
  await expect(
    page.getByRole("button", { name: "Your name", exact: true })
  ).toBeVisible();

  // And the name is reachable again, now behind the password just set.
  await openFilteredNameSwitcher(page, "Thabo");
  await page.getByRole("option", { name: /Thabo Ndlovu/i }).click();
  await logInAs(page, THABO_PASSWORD);
  await expect(headerChip(page, "Thabo Ndlovu")).toBeVisible();
});

// The cross-device sibling of #805: this browser's own selection is dropped
// when it sets the password, but a browser that was holding the name while
// another device protected it keeps an "open" cookie the server has stopped
// honouring. Nothing links to Settings without a selected name, so the page
// is reached the way a real attendee reaches it — a bookmark or the back
// button — and must then say what is actually wrong.
test("a name protected from another device asks this browser to log in, not to pick a name", async ({
  page,
  browser,
}) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see docs/dev/testing.md § Running tests)"
  );
  test.slow();

  await login(page);
  await page.goto("/");
  await pickName(page, "Nadia Haddad");
  await expect(headerChip(page, "Nadia Haddad")).toBeVisible();

  // Her phone protects the name. A second context, not a second page: pages
  // share the identity cookie.
  const phoneContext = await browser.newContext();
  const phone = await phoneContext.newPage();
  await login(phone);
  await phone.goto("/");
  await pickName(phone, "Nadia Haddad");
  await phone.getByRole("button", { name: /your name/i }).click();
  await phone.getByRole("menuitem", { name: /settings/i }).click();
  const resetBefore = await mailOnTop(RESET_SUBJECT, NADIA_EMAIL);
  await phone.getByRole("button", { name: "Enable protection" }).click();
  await expect(phone.getByText(/check your email/i)).toBeVisible();
  await phone.goto(await newestResetLink(NADIA_EMAIL, resetBefore));
  await phone.getByLabel(/new password/i).fill(NADIA_PASSWORD);
  await phone.getByRole("button", { name: "Set password" }).click();
  await expect(phone.getByText(/password set/i)).toBeVisible();
  await phoneContext.close();

  await page.goto("/settings");
  await expect(page.getByText(/this name is protected/i)).toBeVisible();
  await expect(page.getByText(/select who you are/i)).toHaveCount(0);

  await page.goto("/guests/edit");
  await expect(page.getByText(/this name is protected/i)).toBeVisible();
  await expect(page.getByText(/select who you are/i)).toHaveCount(0);
});
