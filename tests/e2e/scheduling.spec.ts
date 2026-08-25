import { Page } from "@playwright/test";
import { DateTime } from "luxon";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import { dismissToast, toast } from "./helpers/toast";

// All tests run in Conference Gamma (scheduling phase). Each test creates its
// own uniquely-titled session on the LAST event day at a fixed location and
// start time, so parallel tests (including add-session.spec.ts, which takes
// the first free "+" slot on day 1) never compete for the same slot.

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
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await dismissToast(page);
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
  await expect(toast(page)).toContainText(
    /Your session .* has been updated successfully/i
  );
  await dismissToast(page);
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
  await expect(toast(page)).toContainText(
    /Your session .* has been deleted successfully/i
  );
  await dismissToast(page);
  await expect(page.getByRole("button", { name: "Grid" })).toBeVisible();
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);

  // Still gone after a full reload
  await page.reload();
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

test("a session booked after midnight lands on the next calendar date", async ({
  page,
}) => {
  await login(page);
  const title = `E2E Late Night Session ${Date.now()}`;

  // Gamma's last day runs 09:00 → 03:00 the next morning (see the seed), so
  // 01:10 is bookable under that day and belongs to the following date.
  await createSessionViaForm(page, title, /Main Hall/, "01:10");

  // The text view labels a session with the weekday of its actual start.
  // Gamma runs today+14 … today+16, so the last night's 01:10 is today+17.
  const afterMidnight = DateTime.now()
    .setZone("Europe/Berlin")
    .plus({ days: 17 });
  await page.getByRole("button", { name: "Text" }).click();
  await page.getByPlaceholder("Search sessions").fill(title);
  await expect(
    page.getByText(`${afterMidnight.toFormat("EEEE")}, 01:10`)
  ).toBeVisible();
});

test("a day running past midnight says so, and its late slots name the day", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await page.getByRole("link", { name: "Add session" }).first().click();
  await expect(
    page.getByRole("heading", { name: /Add a session/i })
  ).toBeVisible();

  // Gamma's last day runs 09:00 → 03:00; the earlier ones end at 18:00.
  await expect(dayRadios(page).first()).toHaveAccessibleName(
    /^[A-Z][a-z]+, [A-Z][a-z]+ \d+$/
  );
  await expect(dayRadios(page).last()).toHaveAccessibleName(
    /\(until 03:00 [A-Z][a-z]{2}\)$/
  );

  await dayRadios(page).last().check();
  await listboxButton(page, /^Start Time/).click();
  // Times before midnight stand alone; the ones after it carry their weekday,
  // so "01:10" can't be read as an hour earlier in the day than "23:10".
  await expect(
    page.getByRole("option", { name: "23:10", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: /^[A-Z][a-z]{2} 01:10$/ })
  ).toBeVisible();
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
