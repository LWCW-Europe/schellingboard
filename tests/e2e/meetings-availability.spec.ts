import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { uniqueSuffix } from "./helpers/unique";
import { loginAndGoto } from "./helpers/auth";
import { selectUser } from "./helpers/user";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

async function manage(page: Page, eventName: string) {
  await page
    .getByRole("listitem")
    .filter({ hasText: eventName })
    .getByRole("link", { name: "Manage" })
    .click();
}

// A throwaway event, left on its admin page. Never a seeded one: those come
// with 1-on-1s on, and switching that about would change what other specs see.
async function createEvent(page: Page, eventName: string) {
  await page.goto("/admin");
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Access Admin" }).click();
  await expect(page).toHaveURL(/\/admin\/events$/);

  // The list is server-rendered, so "New event" is clickable a moment before
  // React attaches its handler, and a click in that window is simply dropped.
  const nameField = page.getByLabel("Name *");
  await expect(async () => {
    if (!(await nameField.isVisible())) {
      await page.getByRole("button", { name: "New event" }).click();
    }
    await expect(nameField).toBeVisible({ timeout: 2000 });
  }).toPass();

  await nameField.fill(eventName);
  await page.getByLabel("Start *").fill("2026-10-01");
  await page.getByLabel("End *").fill("2026-10-03");
  await page.getByRole("button", { name: "Create event" }).click();
  await manage(page, eventName);
  // Manage is a client-side navigation; a hard goto while its RSC fetch is
  // still in flight aborts it, and the console guard fails on that.
  await expect(page.getByRole("form", { name: "Meetings" })).toBeVisible();
}

test.describe("attendee meeting availability", () => {
  // Every event this spec creates is a link in the site header, and a header
  // long enough to push the name chip out of reach is what breaks the next
  // spec along -- so they go again afterwards, pass or fail
  // (meetings-request.spec.ts does the same, for the same reason).
  const leftBehind: string[] = [];

  test.afterEach(async ({ page }) => {
    if (leftBehind.length === 0) return;
    // A test may end on an event page with its votes and RSVPs still in
    // flight; a hard goto aborts those, and the console guard fails on it.
    await page.waitForLoadState("networkidle");

    for (const eventName of leftBehind.splice(0)) {
      await page.goto("/admin/events");
      await manage(page, eventName);
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
    await createEvent(page, eventName);

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

    // Now as that attendee, reaching the page the way one would: the event in
    // the header, then the toolbar's 1-on-1s link.
    await loginAndGoto(page, "/guests");
    await selectUser(page, /Alice Test/i);
    await page.getByRole("link", { name: eventName }).click();
    await page.getByRole("link", { name: "1-on-1s" }).click();
    await expect(page).toHaveURL(/\/meetings$/);
    const eventSlug = new URL(page.url()).pathname.split("/")[1];

    const form = page.getByRole("form", { name: "1-on-1 meetings" });
    await expect(form.getByLabel(/open to 1-on-1 meetings/)).not.toBeChecked();

    // Switching it on marks every slot available; you clear what you want kept
    // free rather than building the set up from nothing.
    await form.getByLabel(/open to 1-on-1 meetings/).check();
    await expect(form.getByText("09:00 – 09:30")).toBeVisible();
    const firstSlot = form.getByRole("listitem").first().getByRole("checkbox");
    await expect(firstSlot).toBeChecked();

    await firstSlot.uncheck();
    await form.getByRole("button", { name: "Save availability" }).click();
    await expect(form.getByText("Saved!")).toBeVisible();

    await page.reload();
    await expect(form.getByLabel(/open to 1-on-1 meetings/)).toBeChecked();
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
    await manage(page, eventName);
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

    await page.goto(`/${eventSlug}/meetings`);
    await expect(form.getByRole("listitem")).toHaveCount(2);
    await form.getByRole("button", { name: "Save availability" }).click();
    await expect(form.getByText("Saved!")).toBeVisible();

    // Opting back out clears the declaration entirely.
    await form.getByLabel(/open to 1-on-1 meetings/).uncheck();
    await form.getByRole("button", { name: "Save availability" }).click();
    await expect(form.getByText("Saved!")).toBeVisible();
    await page.reload();
    await expect(form.getByLabel(/open to 1-on-1 meetings/)).not.toBeChecked();
  });

  // The save action refuses a non-attendee, but the page used to render the
  // whole form first -- so the refusal only arrived after ticking boxes.
  test("says so up front when you are not on the event's guest list", async ({
    page,
  }) => {
    const eventName = `E2E Not Attending ${uniqueSuffix()}`;
    leftBehind.push(eventName);
    await createEvent(page, eventName);

    const meetings = page.getByRole("form", { name: "Meetings" });
    await meetings.getByLabel("Enable meetings").check();
    await meetings.getByRole("button", { name: "Save meetings" }).click();
    await expect(meetings.getByText("Saved!")).toBeVisible();

    // Nobody is assigned to this event, so Alice is not attending it.
    const slug = eventName.replace(/ /g, "-");
    await loginAndGoto(page, `/${slug}/meetings`);
    await selectUser(page, /Alice Test/i);
    await page.goto(`/${slug}/meetings`);

    await expect(page.getByText(/not on the guest list/i)).toBeVisible();
    await expect(
      page.getByRole("form", { name: "1-on-1 meetings" })
    ).toBeHidden();
  });

  test("is not offered while the organizer keeps meetings off", async ({
    page,
  }) => {
    const eventName = `E2E No Meetings ${uniqueSuffix()}`;
    leftBehind.push(eventName);
    await createEvent(page, eventName);

    await loginAndGoto(page, `/${eventName.replace(/ /g, "-")}`);

    // Event details is the control: the toolbar rendered, and the 1-on-1s link
    // is what is missing from it.
    await expect(
      page.getByRole("button", { name: "Event details" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "1-on-1s" })).toBeHidden();
  });
});
