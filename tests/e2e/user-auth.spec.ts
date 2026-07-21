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

// Ahmad Karimi is used by no other spec, likewise.
const AHMAD_EMAIL = "ahmad.karimi@example.com";
const AHMAD_PASSWORD = "ahmad-e2e-password";

async function authCodeEmailCount(email: string): Promise<number> {
  const messages = await searchBySubject("Your temporary login code");
  return messages.filter((m) => m.To.some((t) => t.Address === email)).length;
}

// Mailpit keeps emails from earlier runs, so callers pass the count they
// expect after a fresh send and we poll until it is reached, then read the
// newest message (Mailpit sorts newest first).
async function newestAuthCode(
  email: string,
  expectedCount: number
): Promise<{ code: string; link: string }> {
  await expect
    .poll(() => authCodeEmailCount(email), { timeout: 5000 })
    .toBeGreaterThanOrEqual(expectedCount);
  const messages = (await searchBySubject("Your temporary login code")).filter(
    (m) => m.To.some((t) => t.Address === email)
  );
  const message = await getMessage(messages[0].ID);
  // The code must be clearly visible in the email so it can be typed on
  // another device (alphabet has no I/O/0/1).
  const code = message.HTML.match(/>([A-HJ-NP-Z2-9]{8})</)?.[1];
  expect(code, "email should show the 8-character code").toBeTruthy();
  const link = message.HTML.match(/href="([^"]+)"/)?.[1]?.replace(
    /&amp;/g,
    "&"
  );
  expect(link, "email should contain a login link").toMatch(
    /^https?:\/\/.*\/auth\/login\?/
  );
  return { code: code!, link: link! };
}

// Opens the header name-switcher modal and filters it (same navigation as
// selectUser, but the option list shows only the first 20 names, so names
// late in the alphabet — like Priya's — must be typed to appear), without
// picking an option so the credential prompt can be asserted on.
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

test("logging out from the chip menu clears the selected name", async ({
  page,
}) => {
  await login(page);
  await page.goto("/");
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();

  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  // Logout clears the site login too, so a password-protected site
  // re-prompts before landing on the anonymous state. Wait for the actual
  // hard-reload navigation rather than the chip's optimistic "Select your
  // name" text, which appears instantly on the old page before the reload
  // lands (see openNameSwitcher).
  await page.waitForURL((url) => url.pathname === "/login");
  await login(page);
  await expect(
    page.getByRole("button", { name: "Your name", exact: true })
  ).toBeVisible();
  await pickName(page, "Bob Test");
  await expect(headerChip(page, "Bob Test")).toBeVisible();
});

test("guest protects their name; switching to it then needs a password or emailed code", async ({
  page,
}) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see CONTRIBUTING.md § Running tests)"
  );
  // Many identity switches, each now a real logout-then-login round trip
  // (see logoutAction), add up to just over the 30s default once parallel
  // workers compete for the server.
  test.slow();

  await login(page);
  await page.goto("/");
  await pickName(page, "Priya Sharma");

  // Enable protection from the settings page; the code arrives by email.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  await expect(
    page.getByText(/anyone can currently act under your name/i)
  ).toBeVisible();
  const countBefore = await authCodeEmailCount(PRIYA_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  const { code, link } = await newestAuthCode(PRIYA_EMAIL, countBefore + 1);
  await page.getByLabel("Emailed code").fill(code);
  await page.getByLabel(/password \(optional/i).fill(PRIYA_PASSWORD);
  await page.getByRole("button", { name: "Enable protection" }).click();
  await expect(page.getByText("Protection enabled")).toBeVisible();

  // Switching away is free; Priya's entry now carries a lock, and switching
  // back demands credentials — a wrong one is rejected.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await openFilteredNameSwitcher(page, "Priya");
  const priyaOption = page.getByRole("option", { name: /Priya Sharma/i });
  await expect(
    priyaOption.getByRole("img", { name: /protected/i })
  ).toBeVisible();
  await priyaOption.click();
  await expect(page.getByText(/has protected their account/i)).toBeVisible();
  await page.getByLabel("Password or emailed code").fill("not-the-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText(/wrong password or code/i)).toBeVisible();

  // The emailed code is a temporary password: still valid here.
  await page.getByLabel("Password or emailed code").fill(code);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // The permanent password works too.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await openFilteredNameSwitcher(page, "Priya");
  await priyaOption.click();
  await page.getByLabel("Password or emailed code").fill(PRIYA_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // The email's link lands on a confirmation page with the code prefilled
  // (e.g. for a device where the email was opened), and logs in from there.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await page.goto(link);
  await expect(
    page.getByRole("heading", { name: /log in as Priya Sharma/i })
  ).toBeVisible();
  await expect(page.getByLabel("Password or emailed code")).toHaveValue(code);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();

  // Turning protection off is also confirmed by emailed code. Entering the
  // form requests a fresh code, unless the previous one is recent enough to
  // still be the active one (60s throttle).
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  await expect(page.getByText(/your name is protected/i)).toBeVisible();
  const countBeforeDisable = await authCodeEmailCount(PRIYA_EMAIL);
  await page.getByRole("button", { name: "Turn off protection" }).click();
  const codeInfo = page.getByText(/Code sent|recently emailed code/);
  await expect(codeInfo).toBeVisible();
  const freshCodeSent = (await codeInfo.textContent())!.startsWith("Code sent");
  const { code: disableCode } = await newestAuthCode(
    PRIYA_EMAIL,
    freshCodeSent ? countBeforeDisable + 1 : countBeforeDisable
  );
  await page.getByLabel("Password or emailed code").fill(disableCode);
  await page.getByRole("button", { name: "Turn off protection" }).click();
  await expect(page.getByText("Protection turned off")).toBeVisible();

  // Anyone can switch to Priya again without credentials.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await pickName(page, "Priya Sharma");
  await expect(headerChip(page, "Priya Sharma")).toBeVisible();
});

test("emailed login link offers to set a password when none is set yet", async ({
  page,
}) => {
  test.skip(
    skipWithoutMailpit(),
    "mail env vars unset — start Mailpit (make mailpit) and set them in .env.test.local to run this test (see CONTRIBUTING.md § Running tests)"
  );

  await login(page);
  await page.goto("/");
  await pickName(page, "Ahmad Karimi");

  // Start "Enable protection" from Settings just to get a code emailed —
  // don't submit that form. The emailed link is a separate path to the same
  // outcome.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /settings/i }).click();
  const countBefore = await authCodeEmailCount(AHMAD_EMAIL);
  await page.getByRole("button", { name: "Enable protection" }).click();
  const { code, link } = await newestAuthCode(AHMAD_EMAIL, countBefore + 1);

  // Follow the emailed link like on a fresh device.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await page.goto(link);
  await expect(
    page.getByRole("heading", { name: /log in as Ahmad Karimi/i })
  ).toBeVisible();
  await expect(page.getByLabel("Password or emailed code")).toHaveValue(code);
  await page.getByRole("button", { name: "Log in" }).click();

  // No password set yet, so the same code can be reused inline to set one —
  // no second trip to Settings, no retyping the code.
  await expect(page.getByText(/set a password/i)).toBeVisible();
  await page.getByLabel(/password/i).fill(AHMAD_PASSWORD);
  await page.getByRole("button", { name: "Set password" }).click();
  await expect(headerChip(page, "Ahmad Karimi")).toBeVisible();

  // Protection is now on and the new password works from a fresh switch.
  await selectUser(page, /Bob Test/i);
  await expect(headerChip(page, "Bob Test")).toBeVisible();
  await openFilteredNameSwitcher(page, "Ahmad");
  await page.getByRole("option", { name: /Ahmad Karimi/i }).click();
  await page.getByLabel("Password or emailed code").fill(AHMAD_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(headerChip(page, "Ahmad Karimi")).toBeVisible();
});
