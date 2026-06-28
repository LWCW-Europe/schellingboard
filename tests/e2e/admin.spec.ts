import { Page } from "@playwright/test";
import sharp from "sharp";
import { test, expect } from "./helpers/fixtures";
import { loginAndGoto } from "./helpers/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

async function adminLogin(page: Page) {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Admin Access" })
  ).toBeVisible();
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Access Admin" }).click();
  // /admin redirects to the events list, which is the admin landing page.
  await expect(page).toHaveURL(/\/admin\/events$/);
  await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();
}

async function gotoUsers(page: Page) {
  await page
    .getByRole("navigation", { name: "Admin" })
    .getByRole("link", { name: "Users" })
    .click();
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
}

async function gotoLocations(page: Page) {
  await page
    .getByRole("navigation", { name: "Admin" })
    .getByRole("link", { name: "Locations" })
    .click();
  await expect(page.getByRole("heading", { name: "Locations" })).toBeVisible();
}

test.describe("Admin UI", () => {
  // Note: no site login here. The admin UI is independent of the normal
  // user UI and must be reachable with only the admin password.

  test("redirects to the admin login when not admin-authenticated", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Admin Access" })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("shows only admin chrome and can log out", async ({ page }) => {
    await adminLogin(page);

    // Only the admin nav is present, not the site nav, and only the admin
    // logout button (no site logout)
    await expect(page.getByRole("navigation", { name: "Admin" })).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Logout", exact: true })
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Admin logout" }).click();
    await expect(
      page.getByRole("heading", { name: "Admin Access" })
    ).toBeVisible();
  });

  test("header title links back to the admin home", async ({ page }) => {
    await adminLogin(page);

    // Navigate away, then click the title to return home (→ events list).
    await gotoUsers(page);
    await page
      .getByRole("link", { name: /Admin$/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/admin\/events$/);
    await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();
  });

  test("collapses nav and logout into a hamburger on mobile", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.setViewportSize({ width: 375, height: 800 });

    // On a narrow viewport the nav links and logout are behind the menu, so
    // nothing wraps onto a second header row.
    await expect(page.getByRole("link", { name: "Users" })).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Admin logout" })
    ).toBeHidden();

    // Opening the menu reveals the nav links and the logout button.
    await page.getByRole("button", { name: "Open admin menu" }).click();
    const nav = page.getByRole("navigation", { name: "Admin" });
    await expect(nav.getByRole("link", { name: "Users" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Admin logout" })
    ).toBeVisible();
  });

  test("redirects /admin to the events list and has no dashboard nav", async ({
    page,
  }) => {
    await adminLogin(page);

    // /admin is no longer a dashboard; it redirects to the events list.
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/events$/);
    await expect(page.getByText("Conference Alpha")).toBeVisible();

    // The nav links straight to the sections; there is no "Dashboard" entry.
    const nav = page.getByRole("navigation", { name: "Admin" });
    await expect(nav.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
    await gotoUsers(page);
    await gotoLocations(page);
  });

  test("guards new admin routes when not authenticated", async ({ page }) => {
    for (const path of ["/admin/users", "/admin/locations", "/admin/events"]) {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { name: "Admin Access" })
      ).toBeVisible();
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });

  test("rejects a wrong admin password", async ({ page }) => {
    await page.goto("/admin");
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Access Admin" }).click();
    await expect(page.getByText("Invalid password")).toBeVisible();
    // Stays on the login page; the admin UI is not reached.
    await expect(
      page.getByRole("heading", { name: "Admin Access" })
    ).toBeVisible();
  });

  test("can create, edit, and delete a user", async ({ page }) => {
    await adminLogin(page);
    await gotoUsers(page);

    const unique = Date.now();
    const email = `e2e-admin-${unique}@test.example`;
    const name = `E2E Admin User ${unique}`;
    const renamed = `${name} Renamed`;

    // Create
    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Add user" }).click();
    const row = page.getByRole("listitem").filter({ hasText: email });
    await expect(row).toBeVisible();
    await expect(row.getByText(name)).toBeVisible();

    // Edit (in edit mode the row shows inputs, so locate it via its Save button)
    await row.getByRole("button", { name: "Edit" }).click();
    const editRow = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "Save" }) });
    await editRow.getByLabel("Name").fill(renamed);
    await editRow.getByRole("button", { name: "Save" }).click();
    await expect(row.getByText(renamed)).toBeVisible();

    // Delete requires confirmation and can be cancelled
    await row.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row.getByText("Delete this user?")).toBeVisible();
    await row.getByRole("button", { name: "Cancel" }).click();
    await expect(row.getByText(renamed)).toBeVisible();

    // Delete for real
    await row.getByRole("button", { name: "Delete", exact: true }).click();
    await row.getByRole("button", { name: "Confirm delete" }).click();
    await expect(
      page.getByRole("listitem").filter({ hasText: email })
    ).toHaveCount(0);
  });
});

test.describe("Admin UI events", () => {
  test("lists existing events and can create a new one", async ({ page }) => {
    await adminLogin(page);

    await page
      .getByRole("navigation", { name: "Admin" })
      .getByRole("link", { name: "Events" })
      .click();
    await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();

    // Seeded events are listed
    await expect(page.getByText("Conference Alpha")).toBeVisible();

    // Create a new event
    const unique = Date.now();
    const eventName = `E2E Event ${unique}`;
    await page.getByRole("button", { name: "New event" }).click();
    await page.getByLabel("Name *").fill(eventName);
    await page.getByLabel("Start *").fill("2026-10-01");
    await page.getByLabel("End *").fill("2026-10-03");
    await page.getByRole("button", { name: "Create event" }).click();

    // New event appears in the list
    const row = page.getByRole("listitem").filter({ hasText: eventName });
    await expect(row).toBeVisible();

    // Manage link navigates to the event detail page
    await row.getByRole("link", { name: "Manage" }).click();
    await expect(page).toHaveURL(/\/admin\/events\//);
  });

  test("shows validation error when end is before start", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");
    await page.getByRole("button", { name: "New event" }).click();
    await page.getByLabel("Name *").fill("Bad Dates Event");
    await page.getByLabel("Start *").fill("2026-10-05");
    await page.getByLabel("End *").fill("2026-10-01");
    await page.getByRole("button", { name: "Create event" }).click();
    await expect(
      page.getByText(/end date must be after start date/i)
    ).toBeVisible();
  });

  test("can edit event basic info on detail page", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Create a throwaway event so we never touch the shared seeded events
    const unique = Date.now();
    const original = `E2E Edit ${unique}`;
    const renamed = `E2E Edit Updated ${unique}`;
    await page.getByRole("button", { name: "New event" }).click();
    await page.getByLabel("Name *").fill(original);
    await page.getByLabel("Start *").fill("2026-10-01");
    await page.getByLabel("End *").fill("2026-10-03");
    await page.getByRole("button", { name: "Create event" }).click();
    await page
      .getByRole("listitem")
      .filter({ hasText: original })
      .getByRole("link", { name: "Manage" })
      .click();
    await expect(page.getByRole("heading", { name: original })).toBeVisible();

    // Rename and verify via fresh navigation (waits for "Saved!" to confirm the
    // action completed before navigating away). Use the back link (soft
    // navigation), not page.goto: a hard navigation aborts the action's
    // still-streaming revalidation response, which Firefox reports as an
    // uncaught "TypeError: Error in input stream".
    const nameInput = page.getByLabel("Name *");
    await expect(nameInput).toHaveValue(original);
    await nameInput.fill(renamed);
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Saved!")).toBeVisible();
    await page.getByRole("link", { name: "← Events" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
    await expect(
      page.getByRole("listitem").filter({ hasText: renamed })
    ).toBeVisible();

    // Clean up: delete the throwaway event
    await page
      .getByRole("listitem")
      .filter({ hasText: renamed })
      .getByRole("link", { name: "Manage" })
      .click();
    await page.getByRole("button", { name: "Delete event" }).click();
    await page.getByLabel("Type the event name to confirm").fill(renamed);
    await page.getByRole("button", { name: "Confirm delete" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
  });

  test("can delete an event via named confirm on detail page", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Create a throwaway event
    const unique = Date.now();
    const eventName = `Delete Me ${unique}`;
    await page.getByRole("button", { name: "New event" }).click();
    await page.getByLabel("Name *").fill(eventName);
    await page.getByLabel("Start *").fill("2026-11-01");
    await page.getByLabel("End *").fill("2026-11-03");
    await page.getByRole("button", { name: "Create event" }).click();
    const row = page.getByRole("listitem").filter({ hasText: eventName });
    await row.getByRole("link", { name: "Manage" }).click();

    // Delete with named confirm
    await page.getByRole("button", { name: "Delete event" }).click();
    const confirmInput = page.getByLabel("Type the event name to confirm");
    await expect(confirmInput).toBeVisible();
    const confirmBtn = page.getByRole("button", { name: "Confirm delete" });
    await expect(confirmBtn).toBeDisabled();
    await confirmInput.fill(eventName);
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    // Redirected back to events list; event is gone
    await expect(page).toHaveURL(/\/admin\/events$/);
    await expect(page.getByText(eventName)).not.toBeVisible();
  });

  test("can set and clear phase dates on the detail page", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Create a throwaway event with no phases initially
    const unique = Date.now();
    const eventName = `E2E Phases ${unique}`;
    await page.getByRole("button", { name: "New event" }).click();
    await page.getByLabel("Name *").fill(eventName);
    await page.getByLabel("Start *").fill("2026-10-01");
    await page.getByLabel("End *").fill("2026-10-31");
    await page.getByRole("button", { name: "Create event" }).click();
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();

    // Set proposal phase start and end
    const proposalGroup = page.getByRole("group", { name: "Proposal phase" });
    await proposalGroup.getByLabel("Start").fill("2026-09-01T09:00");
    await proposalGroup.getByLabel("End").fill("2026-09-15T17:00");
    await page.getByRole("button", { name: "Save phases" }).click();
    await expect(page.getByText("Saved!")).toBeVisible();

    // Navigate away and back to confirm persistence. Click the back link
    // (soft navigation) instead of page.goto: a hard navigation right after
    // the save aborts the server action's still-streaming revalidation
    // response, which Firefox reports as an uncaught "TypeError: Error in
    // input stream".
    await page.getByRole("link", { name: "← Events" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();
    await expect(
      page.getByRole("group", { name: "Proposal phase" }).getByLabel("Start")
    ).toHaveValue("2026-09-01T09:00");
    await expect(
      page.getByRole("group", { name: "Proposal phase" }).getByLabel("End")
    ).toHaveValue("2026-09-15T17:00");

    // Validation: end before start shows an error
    await page
      .getByRole("group", { name: "Proposal phase" })
      .getByLabel("Start")
      .fill("2026-09-20T09:00");
    await page
      .getByRole("group", { name: "Proposal phase" })
      .getByLabel("End")
      .fill("2026-09-01T09:00");
    await page.getByRole("button", { name: "Save phases" }).click();
    await expect(
      page.getByText(/proposal phase end must be after its start/i)
    ).toBeVisible();

    // Clear the phase dates
    await page
      .getByRole("group", { name: "Proposal phase" })
      .getByLabel("Start")
      .fill("");
    await page
      .getByRole("group", { name: "Proposal phase" })
      .getByLabel("End")
      .fill("");
    await page.getByRole("button", { name: "Save phases" }).click();
    await expect(page.getByText("Saved!")).toBeVisible();

    // Clean up
    await page.getByRole("button", { name: "Delete event" }).click();
    await page.getByLabel("Type the event name to confirm").fill(eventName);
    await page.getByRole("button", { name: "Confirm delete" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
  });
});

test.describe("Admin UI days", () => {
  test("can add, edit, and delete days on an event detail page", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Create a throwaway event so we never touch seeded events
    const unique = Date.now();
    const eventName = `E2E Days ${unique}`;
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

    const daysSection = page.getByRole("region", { name: "Days" });

    // Add a day
    await daysSection.getByRole("button", { name: "Add day" }).click();
    await daysSection.getByLabel("Start *").fill("2026-10-01T09:00");
    await daysSection.getByLabel("End *").fill("2026-10-01T18:00");
    await daysSection.getByLabel("Bookings open *").fill("2026-10-01T09:00");
    await daysSection.getByLabel("Bookings close *").fill("2026-10-01T17:30");
    await daysSection.getByRole("button", { name: "Add day" }).click();

    // router.refresh() re-fetches the server component — wait for the day
    // to appear in the refreshed list
    await expect(
      page.getByRole("region", { name: "Days" }).getByRole("listitem")
    ).toHaveCount(1);

    // Edit the day — router.refresh() also happens after save
    await page
      .getByRole("region", { name: "Days" })
      .getByRole("button", { name: /Edit day/ })
      .click();
    await page
      .getByRole("region", { name: "Days" })
      .getByLabel("End *")
      .fill("2026-10-01T20:00");
    await page
      .getByRole("region", { name: "Days" })
      .getByRole("button", { name: "Save" })
      .click();
    // Server component refreshes; wait for Days section to re-appear
    await expect(
      page.getByRole("region", { name: "Days" }).getByRole("listitem")
    ).toHaveCount(1);

    // Delete the day
    await page
      .getByRole("region", { name: "Days" })
      .getByRole("button", { name: /Delete day/ })
      .click();
    await page
      .getByRole("region", { name: "Days" })
      .getByRole("button", { name: "Confirm delete" })
      .click();
    // Server component refreshes; list should be empty
    await expect(
      page.getByRole("region", { name: "Days" }).getByRole("listitem")
    ).toHaveCount(0);

    // Validation: end before start shows error (no reload — action returns error)
    await page
      .getByRole("region", { name: "Days" })
      .getByRole("button", { name: "Add day" })
      .click();
    await page
      .getByRole("region", { name: "Days" })
      .getByLabel("Start *")
      .fill("2026-10-01T18:00");
    await page
      .getByRole("region", { name: "Days" })
      .getByLabel("End *")
      .fill("2026-10-01T09:00");
    await page
      .getByRole("region", { name: "Days" })
      .getByLabel("Bookings open *")
      .fill("2026-10-01T09:00");
    await page
      .getByRole("region", { name: "Days" })
      .getByLabel("Bookings close *")
      .fill("2026-10-01T17:30");
    await page
      .getByRole("region", { name: "Days" })
      .getByRole("button", { name: "Add day" })
      .click();
    await expect(page.getByText(/day end must be after start/i)).toBeVisible();

    // Clean up
    await page.getByRole("button", { name: "Delete event" }).click();
    await page.getByLabel("Type the event name to confirm").fill(eventName);
    await page.getByRole("button", { name: "Confirm delete" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
  });
});

test.describe("Admin UI guest assignment", () => {
  test("can assign and remove guests from an event", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Create a throwaway event
    const unique = Date.now();
    const eventName = `E2E Guests ${unique}`;
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

    const guests = page.getByRole("region", { name: "Guests" });
    await expect(guests).toBeVisible();

    // Work with fixed seeded guests. Other tests running in parallel may
    // create or delete guests, so never assert on global row counts here.
    const aliceRow = guests.getByRole("row").filter({ hasText: "Alice Test" });
    await expect(aliceRow.getByRole("checkbox")).not.toBeChecked();

    // Assign Alice — click and wait for server-driven state update
    await aliceRow.getByRole("checkbox").click();
    await expect(aliceRow.getByRole("checkbox")).toBeChecked();

    // Navigate away and back — assignment must persist. Soft navigation via
    // the back link avoids aborting the assignment action's revalidation
    // stream (Firefox: "TypeError: Error in input stream").
    await page.getByRole("link", { name: "← Events" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();
    await expect(
      page
        .getByRole("region", { name: "Guests" })
        .getByRole("checkbox", { checked: true })
    ).toHaveCount(1);

    // Filter: "Assigned" shows only Alice (assignments are event-scoped, so
    // parallel tests cannot add rows here); "Not assigned" hides Alice but
    // still shows other seeded guests
    const g2 = page.getByRole("region", { name: "Guests" });
    await g2.getByRole("button", { name: "Assigned", exact: true }).click();
    await expect(
      g2.getByRole("row").filter({ has: page.getByRole("checkbox") })
    ).toHaveCount(1);
    await expect(
      g2.getByRole("row").filter({ hasText: "Alice Test" })
    ).toBeVisible();

    await g2.getByRole("button", { name: "Not assigned", exact: true }).click();
    await expect(
      g2.getByRole("row").filter({ hasText: "Alice Test" })
    ).toHaveCount(0);
    await expect(
      g2.getByRole("row").filter({ hasText: "Bob Test" })
    ).toBeVisible();

    // Switch back to All and remove the assignment
    await g2.getByRole("button", { name: "All", exact: true }).click();
    await g2.getByRole("checkbox", { checked: true }).click();
    await expect(g2.getByRole("checkbox", { checked: true })).toHaveCount(0);

    // Clean up
    await page.getByRole("button", { name: "Delete event" }).click();
    await page.getByLabel("Type the event name to confirm").fill(eventName);
    await page.getByRole("button", { name: "Confirm delete" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
  });
});

test.describe("Admin UI location assignment", () => {
  test("can assign and remove locations from an event", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Create a throwaway event (seeded locations are linked to seeded events
    // only, so a fresh event starts with none assigned)
    const unique = Date.now();
    const eventName = `E2E Locations ${unique}`;
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

    const locations = page.getByRole("region", { name: "Locations" });
    await expect(locations).toBeVisible();

    // Work with fixed seeded locations. The "Admin UI locations" tests create
    // and delete locations concurrently in other workers, so never assert on
    // global row counts here.
    const mainHallRow = locations
      .getByRole("row")
      .filter({ hasText: "Main Hall" });
    await expect(mainHallRow.getByRole("checkbox")).not.toBeChecked();

    // Assign Main Hall
    await mainHallRow.getByRole("checkbox").click();
    await expect(mainHallRow.getByRole("checkbox")).toBeChecked();

    // Navigate away and back — assignment must persist. Soft navigation via
    // the back link avoids aborting the assignment action's revalidation
    // stream (Firefox: "TypeError: Error in input stream").
    await page.getByRole("link", { name: "← Events" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();
    await expect(
      page
        .getByRole("region", { name: "Locations" })
        .getByRole("checkbox", { checked: true })
    ).toHaveCount(1);

    // Filter: "Assigned" shows only Main Hall (assignments are event-scoped,
    // so parallel tests cannot add rows here); "Not assigned" hides Main Hall
    // but still shows other seeded locations
    const l2 = page.getByRole("region", { name: "Locations" });
    await l2.getByRole("button", { name: "Assigned", exact: true }).click();
    await expect(
      l2.getByRole("row").filter({ has: page.getByRole("checkbox") })
    ).toHaveCount(1);
    await expect(
      l2.getByRole("row").filter({ hasText: "Main Hall" })
    ).toBeVisible();

    await l2.getByRole("button", { name: "Not assigned", exact: true }).click();
    await expect(
      l2.getByRole("row").filter({ hasText: "Main Hall" })
    ).toHaveCount(0);
    await expect(
      l2.getByRole("row").filter({ hasText: "Workshop Room" })
    ).toBeVisible();

    // Switch back to All and remove the assignment
    await l2.getByRole("button", { name: "All", exact: true }).click();
    await l2.getByRole("checkbox", { checked: true }).click();
    await expect(l2.getByRole("checkbox", { checked: true })).toHaveCount(0);

    // Clean up
    await page.getByRole("button", { name: "Delete event" }).click();
    await page.getByLabel("Type the event name to confirm").fill(eventName);
    await page.getByRole("button", { name: "Confirm delete" }).click();
    await expect(page).toHaveURL(/\/admin\/events$/);
  });
});

test.describe("Admin UI proposals", () => {
  test("lists proposals with hosts on the event detail page", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Conference Alpha is seeded with proposals; open its detail page
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Alpha" })
      .getByRole("link", { name: "Manage" })
      .click();

    const proposals = page.getByRole("region", { name: "Proposals" });
    await expect(proposals).toBeVisible();

    // A known seeded, event-specific proposal with a known host
    const row = proposals.getByRole("listitem").filter({
      hasText: "Conference Alpha Lightning Talks: Community Showcase",
    });
    await expect(row).toBeVisible();
    await expect(row).toContainText("Alice Test");
  });

  test("can edit a proposal's title and hosts on the event detail page", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/events");
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Alpha" })
      .getByRole("link", { name: "Manage" })
      .click();

    const proposals = page.getByRole("region", { name: "Proposals" });
    // Use the seeded Panel proposal (not asserted by the list test) and revert
    // at the end so the shared seed data stays intact.
    const original =
      "Conference Alpha Panel: Industry Leaders Share Their Insights";
    const unique = Date.now();
    const edited = `Panel EDITED ${unique}`;

    await proposals
      .getByRole("listitem")
      .filter({ hasText: original })
      .getByRole("button", { name: /^Edit/ })
      .click();

    // Host checkboxes for the event's assigned guests are shown
    await expect(proposals.getByLabel("Host Charlie Test")).toBeVisible();

    await proposals.getByLabel("Title *").fill(edited);
    await proposals.getByRole("button", { name: "Save", exact: true }).click();

    // Server refreshes; the renamed proposal is shown
    await expect(
      proposals.getByRole("listitem").filter({ hasText: edited })
    ).toBeVisible();

    // Revert the title to keep the seed data clean for other tests
    await proposals
      .getByRole("listitem")
      .filter({ hasText: edited })
      .getByRole("button", { name: /^Edit/ })
      .click();
    await proposals.getByLabel("Title *").fill(original);
    await proposals.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      proposals.getByRole("listitem").filter({ hasText: original })
    ).toBeVisible();
  });

  test("deletes a proposal via named confirm", async ({ page }) => {
    // Create a fresh proposal so we never permanently delete seeded data
    await loginAndGoto(page, "/Conference-Alpha/proposals/new");
    const title = `E2E Delete Test ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await Promise.all([
      page.waitForURL(/\/Conference-Alpha\/proposals$/),
      page.getByRole("button", { name: "Submit" }).click(),
    ]);

    // Switch to admin and delete the proposal we just created
    await adminLogin(page);
    await page.goto("/admin/events");
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Alpha" })
      .getByRole("link", { name: "Manage" })
      .click();

    const proposals = page.getByRole("region", { name: "Proposals" });
    const row = proposals.getByRole("listitem").filter({ hasText: title });
    await expect(row).toBeVisible();

    await row.getByRole("button", { name: /^Delete/ }).click();

    // Named confirm: the button is gated on typing the exact title
    const confirmBtn = proposals.getByRole("button", {
      name: "Confirm delete",
    });
    await expect(confirmBtn).toBeDisabled();
    await proposals
      .getByLabel("Type the proposal title to confirm")
      .fill(title);
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    // The proposal is gone after the server refresh
    await expect(
      proposals.getByRole("listitem").filter({ hasText: title })
    ).toHaveCount(0);
  });
});

test.describe("Admin UI sessions", () => {
  test("lists sessions with host, time and location on the event detail page", async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto("/admin/events");

    // Conference Gamma is seeded with an opening keynote (read-only assertion).
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Gamma" })
      .getByRole("link", { name: "Manage" })
      .click();

    const sessions = page.getByRole("region", { name: "Sessions" });
    await expect(sessions).toBeVisible();

    const row = sessions.getByRole("listitem").filter({
      hasText: "Opening Keynote - Conference Gamma",
    });
    await expect(row).toBeVisible();
    // Keynote is hosted by a seeded guest and placed in the first location
    await expect(row).toContainText("Test");
  });

  test("can edit a session on the event detail page", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");
    // Conference Alpha's keynote is not asserted by other specs; edit + revert.
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Alpha" })
      .getByRole("link", { name: "Manage" })
      .click();

    const sessions = page.getByRole("region", { name: "Sessions" });
    const original = "Opening Keynote - Conference Alpha";
    const edited = `Keynote EDITED ${Date.now()}`;

    await sessions
      .getByRole("listitem")
      .filter({ hasText: original })
      .getByRole("button", { name: /^Edit/ })
      .click();

    await sessions.getByLabel("Title *").fill(edited);
    await sessions.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      sessions.getByRole("listitem").filter({ hasText: edited })
    ).toBeVisible();

    // Revert to keep the shared seed data intact
    await sessions
      .getByRole("listitem")
      .filter({ hasText: edited })
      .getByRole("button", { name: /^Edit/ })
      .click();
    await sessions.getByLabel("Title *").fill(original);
    await sessions.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      sessions.getByRole("listitem").filter({ hasText: original })
    ).toBeVisible();
  });

  test("deletes a session via named confirm", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/events");
    // Conference Beta's keynote is not referenced by other specs, so it is
    // safe to permanently delete from the shared seed.
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Beta" })
      .getByRole("link", { name: "Manage" })
      .click();

    const sessions = page.getByRole("region", { name: "Sessions" });
    const title = "Opening Keynote - Conference Beta";
    const row = sessions.getByRole("listitem").filter({ hasText: title });
    await expect(row).toBeVisible();

    await row.getByRole("button", { name: /^Delete/ }).click();

    const confirmBtn = sessions.getByRole("button", { name: "Confirm delete" });
    await expect(confirmBtn).toBeDisabled();
    await sessions.getByLabel("Type the session title to confirm").fill(title);
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    await expect(
      sessions.getByRole("listitem").filter({ hasText: title })
    ).toHaveCount(0);
  });

  test("removes an RSVP from a session via standard confirm", async ({
    page,
  }) => {
    // Create the RSVP to remove through the public UI first. Yuki Tanaka is
    // guaranteed a clean "no prior RSVP" state on the keynote by the seed and
    // is used by no other spec (Bob Test's keynote slot belongs to
    // rsvp.spec.ts).
    await loginAndGoto(page, "/Conference-Gamma");
    await page.getByLabel("My name is:").click();
    await page.keyboard.type("Yuki Tanaka");
    await page.getByRole("option", { name: /Yuki Tanaka/i }).click();
    await page
      .getByRole("link", { name: /Opening Keynote/ })
      .first()
      .click();
    const dialog = page.getByRole("dialog", { name: "Session details" });
    await dialog.getByRole("button", { name: "RSVP", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Un-RSVP" })).toBeVisible();

    // Remove it again as admin
    await adminLogin(page);
    await page.goto("/admin/events");
    await page
      .getByRole("listitem")
      .filter({ hasText: "Conference Gamma" })
      .getByRole("link", { name: "Manage" })
      .click();

    const sessions = page.getByRole("region", { name: "Sessions" });
    const row = sessions
      .getByRole("listitem")
      .filter({ hasText: "Opening Keynote - Conference Gamma" });
    await expect(row).toBeVisible();

    // Expand the RSVPs disclosure and remove Yuki Tanaka
    await row.getByText(/^RSVPs \(/).click();
    await expect(row.getByText("Yuki Tanaka")).toBeVisible();
    await row.getByRole("button", { name: "Remove RSVP Yuki Tanaka" }).click();
    await row.getByRole("button", { name: "Confirm" }).click();

    await expect(row.getByText("Yuki Tanaka")).toHaveCount(0);
  });
});

async function makeImage(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: { r: 90, g: 60, b: 30 } },
  })
    .png()
    .toBuffer();
}

async function deleteLocation(page: Page, name: string) {
  const region = page.getByRole("region", { name: "Locations" });
  const row = region.getByRole("listitem").filter({ hasText: name });
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await row.getByLabel("Location name confirmation").fill(name);
  await row.getByRole("button", { name: "Confirm delete" }).click();
  await expect(row).toHaveCount(0);
}

test.describe("Admin UI locations", () => {
  // These tests share the locations table and affect each other's sortIndex
  // calculations, so they must run serially.
  test.describe.configure({ mode: "serial" });

  test("can create, edit, reorder, and delete locations", async ({ page }) => {
    await adminLogin(page);
    await gotoLocations(page);
    const region = page.getByRole("region", { name: "Locations" });

    const unique = Date.now();
    const nameA = `E2E Room A ${unique}`;
    const nameB = `E2E Room B ${unique}`;

    // Create a location with details and an event assignment
    await region.getByRole("button", { name: "New location" }).click();
    await region.getByLabel("Name", { exact: true }).fill(nameA);
    await region.getByLabel("Capacity").fill("25");
    await region.getByLabel("Bookable").check();
    await region.getByLabel("Conference Alpha").check();
    await region.getByRole("button", { name: "Add location" }).click();

    const rowA = region.getByRole("listitem").filter({ hasText: nameA });
    await expect(rowA).toBeVisible();
    await expect(
      rowA.getByText("max 25 · bookable · Conference Alpha")
    ).toBeVisible();

    // Create a second location; new locations are appended at the end
    await region.getByRole("button", { name: "New location" }).click();
    await region.getByLabel("Name", { exact: true }).fill(nameB);
    await region.getByRole("button", { name: "Add location" }).click();
    const myRows = region
      .getByRole("listitem")
      .filter({ hasText: `${unique}` });
    await expect(myRows).toHaveCount(2);
    await expect(myRows.first()).toContainText(nameA);

    // Reorder: move B above A
    await region.getByRole("button", { name: `Move ${nameB} up` }).click();
    await expect(myRows.first()).toContainText(nameB);

    // Edit A
    const renamed = `${nameA} Renamed`;
    await rowA.getByRole("button", { name: "Edit" }).click();
    const editForm = region
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "Save" }) });
    await editForm.getByLabel("Name", { exact: true }).fill(renamed);
    await editForm.getByRole("button", { name: "Save" }).click();
    await expect(
      region.getByRole("listitem").filter({ hasText: renamed })
    ).toBeVisible();

    // Deleting requires typing the location name
    const rowRenamed = region
      .getByRole("listitem")
      .filter({ hasText: renamed });
    await rowRenamed
      .getByRole("button", { name: "Delete", exact: true })
      .click();
    await expect(rowRenamed.getByText(/Type the location name/)).toBeVisible();
    const confirmButton = rowRenamed.getByRole("button", {
      name: "Confirm delete",
    });
    await expect(confirmButton).toBeDisabled();
    await rowRenamed
      .getByLabel("Location name confirmation")
      .fill("wrong name");
    await expect(confirmButton).toBeDisabled();
    await rowRenamed.getByLabel("Location name confirmation").fill(renamed);
    await confirmButton.click();
    await expect(rowRenamed).toHaveCount(0);

    await deleteLocation(page, nameB);
  });

  test("uploads a location image and rejects invalid ones", async ({
    page,
  }) => {
    await adminLogin(page);
    await gotoLocations(page);
    const region = page.getByRole("region", { name: "Locations" });

    const name = `E2E Photo Room ${Date.now()}`;
    await region.getByRole("button", { name: "New location" }).click();
    await region.getByLabel("Name", { exact: true }).fill(name);

    // An image without the 4:3 aspect ratio is rejected
    await region.getByLabel("Image").setInputFiles({
      name: "square.png",
      mimeType: "image/png",
      buffer: await makeImage(800, 800),
    });
    await region.getByRole("button", { name: "Add location" }).click();
    await expect(
      page.getByText("Image must have a 4:3 aspect ratio (got 800×800)")
    ).toBeVisible();

    // A valid 4:3 image is accepted and shown in the list
    await region.getByLabel("Image").setInputFiles({
      name: "room.png",
      mimeType: "image/png",
      buffer: await makeImage(800, 600),
    });
    await region.getByRole("button", { name: "Add location" }).click();
    const row = region.getByRole("listitem").filter({ hasText: name });
    await expect(row).toBeVisible();
    await expect(row.getByRole("img", { name })).toBeVisible();

    await deleteLocation(page, name);
  });
});
