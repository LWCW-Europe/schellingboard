import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

// All tests run in Conference Gamma (scheduling phase). Each test creates its
// own uniquely-titled session on the LAST event day at a fixed location and
// start time, so parallel tests (including add-session.spec.ts, which takes
// the first free "+" slot on day 1) never compete for the same slot.

async function selectUser(page: Page, name: RegExp) {
  await page.getByLabel("My name is:").click();
  await page.getByRole("option", { name }).click();
}

// The form's labels are not wired to their inputs, so locate each listbox
// through its labelled section (same approach as the hosts combobox in
// add-session.spec.ts).
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

// Start-time options are labelled with the *displayed* start (slot start plus
// the event's 10-minute break), so slots are ":10"/":40", not ":00"/":30".
async function createSessionViaForm(
  page: Page,
  title: string,
  location: RegExp,
  startTime: string
) {
  await page.goto("/Conference-Gamma");
  await selectUser(page, /Alice Test/i);

  // Reach the form the way a real user does: click a free "+" slot, then
  // adjust day/location/time inside the form.
  await page.getByRole("link", { name: "Add session" }).first().click();
  await expect(
    page.getByRole("heading", { name: /Add a session/i })
  ).toBeVisible();

  await page.getByRole("textbox").first().fill(title);
  // Hosts are prefilled with the selected user (Alice), so only the slot
  // needs adjusting.
  await dayRadios(page).last().check();
  await listboxButton(page, /^Location/).click();
  await page.getByRole("option", { name: location }).click();
  await listboxButton(page, /^Start Time/).click();
  await page.getByRole("option", { name: startTime }).click();

  const submit = page.getByRole("button", { name: "Submit" });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(
    page.getByRole("heading", { name: /Session added/i })
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to schedule/i }).click();
  await expect(page.getByRole("link", { name: title })).toBeVisible();
}

async function openEditForm(page: Page, title: string) {
  await page.getByRole("link", { name: title }).click();
  const dialog = page.getByRole("dialog", { name: "Session details" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Edit" }).click();
  await expect(
    page.getByRole("heading", { name: /Edit session/i })
  ).toBeVisible();
}

test("a host can edit a session's title and the change persists", async ({
  page,
}) => {
  await login(page);
  const unique = Date.now();
  const title = `E2E Editable Session ${unique}`;
  const renamed = `E2E Renamed Session ${unique}`;

  await createSessionViaForm(page, title, /Workshop Room/, "15:10");

  await openEditForm(page, title);
  await page.getByRole("textbox").first().fill(renamed);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByRole("heading", { name: /Session updated/i })
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to schedule/i }).click();
  await expect(page.getByRole("link", { name: renamed })).toBeVisible();

  // The rename must survive a full reload
  await page.reload();
  await expect(page.getByRole("link", { name: renamed })).toBeVisible();
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

test("a host can delete a session and it disappears from the grid", async ({
  page,
}) => {
  await login(page);
  const title = `E2E Doomed Session ${Date.now()}`;

  await createSessionViaForm(page, title, /Garden Terrace/, "16:10");

  await openEditForm(page, title);
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText("Delete session?")).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(
    page.getByRole("heading", { name: /Session deleted/i })
  ).toBeVisible();

  await page.getByRole("link", { name: /Back to schedule/i }).click();
  await expect(
    page.getByRole("heading", { name: /Conference Gamma Schedule/ })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);

  // Still gone after a full reload
  await page.reload();
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

test("occupied start times are not offered in the same location but are in others", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await page.getByRole("link", { name: "Add session" }).first().click();
  await expect(
    page.getByRole("heading", { name: /Add a session/i })
  ).toBeVisible();

  // Day 1 hosts the seeded Opening Keynote (09:00–10:30, Main Hall) and the
  // Lunch Break blocker (12:30–14:00, all rooms). Option labels show the
  // displayed start (slot + 10-minute break), so 09:00 appears as "09:10".
  await dayRadios(page).first().check();
  await listboxButton(page, /^Location/).click();
  await page.getByRole("option", { name: /Main Hall/ }).click();

  await listboxButton(page, /^Start Time/).click();
  // Overlapping the keynote in the same location is not offered...
  await expect(page.getByRole("option", { name: "09:10" })).toHaveAttribute(
    "aria-disabled",
    "true"
  );
  // ...nor is the blocker slot...
  await expect(page.getByRole("option", { name: "12:40" })).toHaveAttribute(
    "aria-disabled",
    "true"
  );
  // ...while a free slot in the same location is.
  await expect(page.getByRole("option", { name: "16:10" })).not.toHaveAttribute(
    "aria-disabled",
    "true"
  );
  await page.keyboard.press("Escape");

  // The keynote's slot IS offered in a different location.
  await listboxButton(page, /^Location/).click();
  await page.getByRole("option", { name: /Garden Terrace/ }).click();
  await listboxButton(page, /^Start Time/).click();
  await expect(page.getByRole("option", { name: "09:10" })).not.toHaveAttribute(
    "aria-disabled",
    "true"
  );
});
