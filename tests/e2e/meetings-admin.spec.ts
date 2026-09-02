import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { uniqueSuffix } from "./helpers/unique";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

async function adminLogin(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Access Admin" }).click();
  await expect(page).toHaveURL(/\/admin\/events$/);
}

// One event, one lifecycle: the section's rules are covered by
// tests/integration/admin-meetings.test.ts, so the browser is here for what
// only it can show -- that the controls persist and the list updates.
test("configures the meetings section and keeps it across a reload", async ({
  page,
}) => {
  await adminLogin(page);
  const eventName = `E2E Meetings ${uniqueSuffix()}`;

  await page.getByRole("button", { name: "New event" }).click();
  await page.getByLabel("Name *").fill(eventName);
  await page.getByLabel("Start *").fill("2026-10-01");
  await page.getByLabel("End *").fill("2026-10-03");
  await page.getByRole("button", { name: "Create event" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: eventName })
    .getByRole("link", { name: "Manage" })
    .click();
  await expect(page.getByRole("heading", { name: eventName })).toBeVisible();

  const meetings = page.getByRole("form", { name: "Meetings" });

  // Off by default, and nothing below the switch until it is on.
  await expect(meetings.getByLabel("Enable meetings")).not.toBeChecked();
  await expect(
    meetings.getByLabel("Maximum open requests per attendee")
  ).toBeHidden();

  await meetings.getByLabel("Enable meetings").check();
  await meetings.getByLabel("Maximum open requests per attendee").fill("3");

  await meetings.getByRole("button", { name: /add meeting point/i }).click();
  await meetings.getByLabel("Name *").fill("Coffee bar");
  await meetings.getByLabel("Description").fill("Ground floor, by reception");
  await meetings.getByRole("button", { name: /add meeting point/i }).click();
  await expect(meetings.getByText("Ground floor, by reception")).toBeVisible();

  await meetings.getByRole("button", { name: "Save meetings" }).click();
  await expect(meetings.getByText("Saved!")).toBeVisible();

  await page.reload();
  await expect(meetings.getByLabel("Enable meetings")).toBeChecked();
  await expect(
    meetings.getByLabel("Maximum open requests per attendee")
  ).toHaveValue("3");
  await expect(meetings.getByText("Coffee bar")).toBeVisible();

  // Deleting a point takes two clicks, as deleting a day does.
  await meetings.getByRole("button", { name: "Delete Coffee bar" }).click();
  await meetings
    .getByRole("button", { name: "Confirm delete Coffee bar" })
    .click();
  await expect(meetings.getByText("Coffee bar")).toBeHidden();

  await page.getByRole("button", { name: "Delete event" }).click();
  await page.getByLabel("Type the event name to confirm").fill(eventName);
  await page.getByRole("button", { name: "Confirm delete" }).click();
  await expect(page).toHaveURL(/\/admin\/events$/);
});
