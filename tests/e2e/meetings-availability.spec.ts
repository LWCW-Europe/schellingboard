import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { uniqueSuffix } from "./helpers/unique";
import { loginAndGoto } from "./helpers/auth";
import { selectUser } from "./helpers/user";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

// Settings holds one collapsed panel per event that offers 1-on-1s, except
// that a lone one starts open -- so look before clicking its summary.
async function openAvailability(page: Page, eventName: string) {
  const form = page.getByRole("form", { name: `1-on-1s at ${eventName}` });
  const panels = page.getByRole("region", { name: "1-on-1s" });
  await expect(panels).toBeVisible();
  if (!(await form.isVisible())) {
    await panels.getByText(eventName, { exact: true }).click();
  }
  await expect(form).toBeVisible();
  return form;
}

test.describe("attendee meeting availability", () => {
  // Every event this spec creates is a link in the site header, and a header
  // long enough to push the name chip out of reach is what breaks the next
  // spec along -- so they go again afterwards, pass or fail
  // (meetings-request.spec.ts does the same, for the same reason).
  const leftBehind: string[] = [];

  test.afterEach(async ({ page }) => {
    for (const eventName of leftBehind.splice(0)) {
      await page.goto("/admin/events");
      await page
        .getByRole("listitem")
        .filter({ hasText: eventName })
        .getByRole("link", { name: "Manage" })
        .click();
      await page.getByRole("button", { name: "Delete event" }).click();
      await page.getByLabel("Type the event name to confirm").fill(eventName);
      await page.getByRole("button", { name: "Confirm delete" }).click();
      await expect(page).toHaveURL(/\/admin\/events$/);
    }
  });

  test("declares availability, clears a slot, and opts back out", async ({
    page,
  }) => {
    const eventName = `E2E Availability ${uniqueSuffix()}`;
    leftBehind.push(eventName);

    // A throwaway event of its own, so switching meetings on here can't change
    // what the other specs see on the seeded ones.
    await page.goto("/admin");
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Access Admin" }).click();
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

    const meetings = page.getByRole("form", { name: "Meetings" });
    await meetings.getByLabel("Enable meetings").check();
    await meetings.getByRole("button", { name: "Save meetings" }).click();
    await expect(meetings.getByText("Saved!")).toBeVisible();

    // One day, so the slot list is short and predictable.
    await page.getByRole("button", { name: "Add day" }).click();
    await page.getByLabel("Start *").last().fill("2026-10-01T09:00");
    await page.getByLabel("End *").last().fill("2026-10-01T11:00");
    await page.getByLabel("Bookings open *").fill("2026-10-01T09:00");
    await page.getByLabel("Bookings close *").fill("2026-10-01T11:00");
    await page.getByRole("button", { name: "Add day" }).last().click();
    await expect(page.getByText("2026-10-01T09:00")).toBeVisible();

    // Availability is only for people attending, so assign a seeded guest.
    await page.getByRole("link", { name: "Guests" }).click();
    const guests = page.getByRole("region", { name: "Guests" });
    const alice = guests
      .getByRole("row")
      .filter({ hasText: "Alice Test" })
      .getByRole("checkbox", { name: /^Assign / });
    await alice.click();
    await expect(alice).toBeChecked();

    // Now as that attendee, reaching the form the way one would: Settings,
    // from the name menu.
    await loginAndGoto(page, "/guests");
    await selectUser(page, /Alice Test/i);
    await page.getByRole("button", { name: /your name/i }).click();
    await page.getByRole("menuitem", { name: /settings/i }).click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    let form = await openAvailability(page, eventName);
    await expect(form.getByLabel(/open to 1-on-1s/)).not.toBeChecked();

    // Switching it on marks every slot available; you clear what you want kept
    // free rather than building the set up from nothing.
    await form.getByLabel(/open to 1-on-1s/).check();
    await expect(form.getByText("09:00 – 09:30")).toBeVisible();
    const firstSlot = form.getByRole("listitem").first().getByRole("checkbox");
    await expect(firstSlot).toBeChecked();

    await firstSlot.uncheck();
    await form.getByRole("button", { name: "Save availability" }).click();
    await expect(form.getByText("Saved!")).toBeVisible();

    await page.reload();
    form = await openAvailability(page, eventName);
    await expect(form.getByLabel(/open to 1-on-1s/)).toBeChecked();
    await expect(
      form.getByRole("listitem").first().getByRole("checkbox")
    ).not.toBeChecked();
    await expect(
      form.getByRole("listitem").nth(1).getByRole("checkbox")
    ).toBeChecked();
    // 09:00-11:00 in 30-minute slots.
    await expect(form.getByRole("listitem")).toHaveCount(4);

    // A day the organizer later shortens drops slots the guest had declared.
    // Those must not linger in the form's selection, or every later save is
    // refused for slots it never renders and the guest cannot untick.
    await page.goto("/admin/events");
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();
    // Scoped to Days: the event's own "End *" date sits on this page too.
    const days = page.getByRole("region", { name: "Days" });
    await days.getByRole("button", { name: /^Edit day / }).click();
    await days.getByLabel("End *").fill("2026-10-01T10:00");
    // The bookings window has to stay inside the day's own.
    await days.getByLabel("Bookings close *").fill("2026-10-01T10:00");
    await days.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      page.getByText(/2026-10-01T09:00 – 2026-10-01T10:00/)
    ).toBeVisible();

    await page.goto("/settings");
    form = await openAvailability(page, eventName);
    await expect(form.getByRole("listitem")).toHaveCount(2);
    await form.getByRole("button", { name: "Save availability" }).click();
    await expect(form.getByText("Saved!")).toBeVisible();

    // Opting back out clears the declaration entirely.
    await form.getByLabel(/open to 1-on-1s/).uncheck();
    await form.getByRole("button", { name: "Save availability" }).click();
    await expect(form.getByText("Saved!")).toBeVisible();
    await page.reload();
    form = await openAvailability(page, eventName);
    await expect(form.getByLabel(/open to 1-on-1s/)).not.toBeChecked();
  });

  // Only events the attendee can actually be booked at get a panel; the rest
  // of Settings is for everyone, so the section is never missing, only empty.
  test("lists only the events you attend that offer 1-on-1s", async ({
    page,
  }) => {
    const eventName = `E2E Listed ${uniqueSuffix()}`;
    leftBehind.push(eventName);

    await page.goto("/admin");
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Access Admin" }).click();
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

    const meetings = page.getByRole("form", { name: "Meetings" });
    await meetings.getByLabel("Enable meetings").check();
    await meetings.getByRole("button", { name: "Save meetings" }).click();
    await expect(meetings.getByText("Saved!")).toBeVisible();

    // Nobody is assigned yet, so Alice is not attending it.
    await loginAndGoto(page, "/guests");
    await selectUser(page, /Alice Test/i);
    await page.goto("/settings");
    const panels = page.getByRole("region", { name: "1-on-1s" });
    await expect(panels).toBeVisible();
    await expect(panels.getByText(eventName, { exact: true })).toBeHidden();

    await page.goto("/admin/events");
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();
    await page.getByRole("link", { name: "Guests" }).click();
    const alice = page
      .getByRole("region", { name: "Guests" })
      .getByRole("row")
      .filter({ hasText: "Alice Test" })
      .getByRole("checkbox", { name: /^Assign / });
    await alice.click();
    await expect(alice).toBeChecked();

    await page.goto("/settings");
    await expect(panels.getByText(eventName, { exact: true })).toBeVisible();

    // Switching 1-on-1s off takes the panel away again.
    await page.goto("/admin/events");
    await page
      .getByRole("listitem")
      .filter({ hasText: eventName })
      .getByRole("link", { name: "Manage" })
      .click();
    await meetings.getByLabel("Enable meetings").uncheck();
    await meetings.getByRole("button", { name: "Save meetings" }).click();
    await expect(meetings.getByText("Saved!")).toBeVisible();

    await page.goto("/settings");
    await expect(panels.getByText(eventName, { exact: true })).toBeHidden();
  });
});
