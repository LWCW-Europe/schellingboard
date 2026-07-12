import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

async function selectUser(page: Page, name: RegExp) {
  await page.getByLabel("My name is:").click();
  await page.getByRole("option", { name }).click();
}

// The add-session form's labels are not wired to their inputs, so locate each
// listbox through its labelled section (same approach as scheduling.spec.ts).
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

test("RSVP to a session persists across reloads and can be removed again", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");

  // Bob is not a host of the seeded keynote, so he gets an RSVP button
  await page.getByLabel("My name is:").click();
  await page.getByRole("option", { name: /Bob Test/i }).click();

  await page
    .getByRole("link", { name: /Opening Keynote/ })
    .first()
    .click();
  const dialog = page.getByRole("dialog", { name: "Session details" });
  await expect(dialog).toBeVisible();

  // RSVP. The button label only flips once the server confirmed the RSVP.
  await dialog.getByRole("button", { name: "RSVP", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();

  // Reload (the session stays open via the URL): the RSVP must persist and
  // Bob must be listed as an attendee
  await page.reload();
  await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();
  await expect(dialog.getByText(/Bob Test/)).toBeVisible();

  // Un-RSVP and reload: gone again
  await dialog.getByRole("button", { name: "Un-RSVP" }).click();
  await expect(
    dialog.getByRole("button", { name: "RSVP", exact: true })
  ).toBeVisible();

  await page.reload();
  await expect(
    dialog.getByRole("button", { name: "RSVP", exact: true })
  ).toBeVisible();
  await expect(dialog.getByText(/Bob Test/)).toHaveCount(0);
});

test("a full session blocks further RSVPs when the event enforces capacity", async ({
  page,
}) => {
  // Admin: enable the capacity hard limit on Conference Gamma.
  await page.goto("/admin");
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Access Admin" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Conference Gamma" })
    .getByRole("link", { name: "Manage" })
    .click();
  const hardLimit = page.getByLabel(/Enforce session capacity as a hard/);
  await hardLimit.check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Saved!")).toBeVisible();

  // Site: Alice hosts a fresh session, so it deterministically has no RSVPs.
  await login(page);
  await page.goto("/Conference-Gamma");
  await selectUser(page, /Alice Test/i);
  const sessionTitle = "Tiny Room Tasting";
  await page.getByRole("link", { name: "Add session" }).first().click();
  await expect(
    page.getByRole("heading", { name: /Add a session/i })
  ).toBeVisible();
  await page.getByRole("textbox").first().fill(sessionTitle);
  // Hosts are prefilled with the selected user (Alice). Pick a fixed slot on
  // the last day that no other spec relies on, so parallel tests (e.g.
  // scheduling.spec.ts asserting free slots on day 1) never compete for it.
  await dayRadios(page).last().check();
  await listboxButton(page, /^Location/).click();
  await page.getByRole("option", { name: /Workshop Room/ }).click();
  await listboxButton(page, /^Start Time/).click();
  await page.getByRole("option", { name: "16:10" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByRole("heading", { name: /Session added/i })
  ).toBeVisible();

  // Admin: shrink the new session to a single seat.
  await page.goto("/admin/events");
  await page
    .getByRole("listitem")
    .filter({ hasText: "Conference Gamma" })
    .getByRole("link", { name: "Manage" })
    .click();
  await page
    .getByRole("navigation", { name: "Event sections" })
    .getByRole("link", { name: "Sessions" })
    .click();
  await page.getByRole("searchbox").fill(sessionTitle);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("button", { name: `Edit ${sessionTitle}` }).click();
  await page.getByLabel("Capacity").fill("1");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("button", { name: `Edit ${sessionTitle}` })
  ).toBeVisible();
  // Saving triggers a router.refresh; navigating away while its RSC fetch is
  // in flight aborts it and trips the console-error guard.
  await page.waitForLoadState("networkidle");

  // Bob takes the only seat.
  await page.goto("/Conference-Gamma");
  const dialog = page.getByRole("dialog", { name: "Session details" });
  const openSession = async () => {
    await page.getByRole("link", { name: sessionTitle }).click();
    await expect(dialog).toBeVisible();
  };
  const closeSession = async () => {
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
  };

  await selectUser(page, /Bob Test/i);
  await openSession();
  await dialog.getByRole("button", { name: "RSVP", exact: true }).click();
  // Bob may hold a seeded RSVP that overlaps the new session's slot, in
  // which case a clash warning must be confirmed first.
  const clashConfirm = page.getByRole("button", { name: "Yes" });
  await expect(
    dialog.getByRole("button", { name: "Un-RSVP" }).or(clashConfirm)
  ).toBeVisible();
  if (await clashConfirm.isVisible()) {
    await clashConfirm.click();
  }
  await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();
  await closeSession();

  // Charlie finds the session full: the RSVP button is disabled.
  await selectUser(page, /Charlie Test/i);
  await openSession();
  const fullButton = dialog.getByRole("button", { name: "Session full" });
  await expect(fullButton).toBeVisible();
  await expect(fullButton).toBeDisabled();
  await closeSession();

  // Bob can still give up his seat, which reopens the session for Charlie.
  await selectUser(page, /Bob Test/i);
  await openSession();
  await dialog.getByRole("button", { name: "Un-RSVP" }).click();
  await expect(
    dialog.getByRole("button", { name: "RSVP", exact: true })
  ).toBeVisible();
  await closeSession();

  await selectUser(page, /Charlie Test/i);
  await openSession();
  await expect(
    dialog.getByRole("button", { name: "RSVP", exact: true })
  ).toBeVisible();
});
