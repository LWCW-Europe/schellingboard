import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import {
  MAILPIT_API_URL,
  getMessage,
  searchBySubject,
} from "../helpers/mailpit";

// Form idioms shared with scheduling.spec.ts: the form's labels are not wired
// to their inputs, so locate each listbox through its labelled section.
function listboxButton(page: Page, section: RegExp) {
  return page
    .locator("div")
    .filter({ hasText: section })
    .first()
    .getByRole("button")
    .first();
}

const dayRadios = (page: Page) =>
  page.getByRole("radio", {
    name: /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
  });

test("updating a session emails the RSVP'd guest and the added co-host", async ({
  page,
}) => {
  expect(
    MAILPIT_API_URL,
    "MAILPIT_API_URL must be set: this test needs Mailpit (make mailpit) and fails rather than skips without it"
  ).toBeTruthy();

  await login(page);
  // The title doubles as the unique token for finding this test's emails
  // (both notification emails carry it in the subject), so leftover
  // mailbox contents from other tests or runs never match.
  const title = `E2E Email Session ${Date.now()}`;

  // Charlie creates a session on the last event day (Garden Terrace 15:10 —
  // a slot no other spec claims; see the note in scheduling.spec.ts).
  await page.goto("/Conference-Gamma");
  await selectUser(page, /Charlie Test/i);
  await page.getByRole("link", { name: "Add session" }).first().click();
  await expect(
    page.getByRole("heading", { name: /Add a session/i })
  ).toBeVisible();
  await page.getByRole("textbox").first().fill(title);
  // Hosts are prefilled with the selected user (Charlie).
  await dayRadios(page).last().check();
  await listboxButton(page, /^Location/).click();
  await page.getByRole("option", { name: /Garden Terrace/ }).click();
  await listboxButton(page, /^Start Time/).click();
  await page.getByRole("option", { name: "15:10" }).click();
  const submit = page.getByRole("button", { name: "Submit" });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(
    page.getByRole("heading", { name: /Session added/i })
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to schedule/i }).click();

  // Bob RSVPs to it.
  await selectUser(page, /Bob Test/i);
  await page.getByRole("link", { name: title }).click();
  const dialog = page.getByRole("dialog", { name: "Session details" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "RSVP", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();

  // Charlie moves the session and adds Alice as a co-host.
  await page.goto("/Conference-Gamma");
  await selectUser(page, /Charlie Test/i);
  await page.getByRole("link", { name: title }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Edit" }).click();
  await expect(
    page.getByRole("heading", { name: /Edit session/i })
  ).toBeVisible();
  await listboxButton(page, /^Start Time/).click();
  await page.getByRole("option", { name: "14:40" }).click();
  const hostsSection = page
    .locator("div")
    .filter({ hasText: /^Hosts/ })
    .first();
  // Don't click the section's first button, as add-session.spec.ts does:
  // with a host already present that's the host chip's "Remove" button, not
  // the dropdown opener. Type into the combobox itself instead.
  const hostsCombobox = hostsSection.getByRole("combobox");
  await hostsCombobox.click();
  await hostsCombobox.pressSequentially("Alice Test");
  await page.getByRole("option", { name: /Alice Test/i }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByRole("heading", { name: /Session updated/i })
  ).toBeVisible();

  // Three emails arrive: Bob is told as an attendee, Alice both that she is
  // a co-host now and, as a host, that the session changed. Charlie made the
  // change, so he hears nothing.
  await expect
    .poll(() => searchBySubject(title), { timeout: 1000 /* milliseconds */ })
    .toHaveLength(3);
  const messages = await searchBySubject(title);
  const to = (address: string) =>
    messages.filter((m) => m.To.some((t) => t.Address === address));
  expect(to("bob@test.com")).toHaveLength(1);
  expect(to("alice@test.com")).toHaveLength(2);
  expect(to("charlie@test.com")).toHaveLength(0);

  // Every link in every email resolves on the site. The browser parses the
  // email html for us, so hrefs come out entity-decoded. page.request shares
  // the browser's cookies, so the site-password gate doesn't redirect to
  // /login.
  for (const summary of messages) {
    const message = await getMessage(summary.ID);
    await page.setContent(message.HTML);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")!));
    expect(
      links.length,
      `email "${summary.Subject}" should link to the session`
    ).toBeGreaterThan(0);
    for (const link of links) {
      // Mail clients have no base URL, so a relative link is always broken.
      expect(link, `relative link in "${summary.Subject}"`).toMatch(
        /^https?:\/\//
      );
      const response = await page.request.get(link);
      expect(response.ok(), `broken link ${link} in "${summary.Subject}"`).toBe(
        true
      );
      expect(response.url()).not.toContain("/login");
    }
  }
});
