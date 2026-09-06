import { Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { uniqueSuffix } from "./helpers/unique";
import { loginAndGoto } from "./helpers/auth";
import { selectUser } from "./helpers/user";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admintest";

/**
 * The event runs a month out. Relative to the run rather than a fixed date:
 * the picker only offers slots that are still ahead, so a hard-coded October
 * would quietly stop offering anything once October passed.
 */
const isoDay = (offsetDays: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
const EVENT_START = isoDay(30);
const EVENT_END = isoDay(32);

/** How the picker heads that day's slots: luxon's "EEE d LLL". */
const DAY_HEADING = new RegExp(
  new Date(`${EVENT_START}T09:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
);

/**
 * Two throwaway attendees. Never the shared seeded guests: assigning those to
 * a meetings-enabled event leaves them bookable for the rest of the run, which
 * other specs then trip over -- admin.spec.ts warns about exactly this kind of
 * global guest state.
 */
async function adminLogin(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Access Admin" }).click();
  await expect(page).toHaveURL(/\/admin\/events$/);
}

async function createGuests(page: Page, names: string[]) {
  await adminLogin(page);
  await page.goto("/admin/users");
  for (const name of names) {
    await page.getByLabel("Name").fill(name);
    await page
      .getByLabel("Email")
      .fill(`${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}@test.example`);
    await page.getByRole("button", { name: "Add user" }).click();
    // The users table is paginated, so the new row isn't on screen; the form
    // clearing itself is what says the create landed.
    await expect(page.getByLabel("Name")).toHaveValue("");
  }
}

/**
 * An event with meetings on, one short day, a meeting point, and the two
 * attendees — set up the way an organizer would, through the admin UI.
 */
async function meetingsEvent(page: Page, eventName: string, names: string[]) {
  await page.goto("/admin/events");

  // The list is server-rendered, so its buttons are clickable a moment before
  // React attaches their handlers, and a click in that window is silently
  // dropped. Re-checking first keeps a retry from acting twice.
  // (helpers/user.ts hits the same hazard in the header.)
  const nameField = page.getByLabel("Name *");
  await expect(async () => {
    if (!(await nameField.isVisible())) {
      await page.getByRole("button", { name: "New event" }).click();
    }
    await expect(nameField).toBeVisible({ timeout: 2000 });
  }).toPass();

  await nameField.fill(eventName);
  await page.getByLabel("Start *").fill(EVENT_START);
  await page.getByLabel("End *").fill(EVENT_END);

  const row = page.getByRole("listitem").filter({ hasText: eventName });
  await expect(async () => {
    // The form closes on success, which is what stops a retry re-submitting.
    if (await nameField.isVisible()) {
      await page.getByRole("button", { name: "Create event" }).click();
    }
    await expect(row).toBeVisible({ timeout: 3000 });
  }).toPass();

  await row.getByRole("link", { name: "Manage" }).click();

  const meetings = page.getByRole("form", { name: "Meetings" });
  await meetings.getByLabel("Enable meetings").check();
  await meetings.getByRole("button", { name: /add meeting point/i }).click();
  await meetings.getByLabel("Name *").fill("Coffee bar");
  await meetings.getByRole("button", { name: /add meeting point/i }).click();
  await meetings.getByRole("button", { name: "Save meetings" }).click();
  await expect(meetings.getByText("Saved!")).toBeVisible();

  // The 1-on-1s column lives on the schedule, which only exists once the
  // event is in its scheduling phase.
  const scheduling = page.getByRole("group", { name: "Scheduling phase" });
  await scheduling.getByLabel("Start").fill("2026-01-01T00:00");
  await scheduling.getByLabel("End").fill("2027-01-01T00:00");
  await page.getByRole("button", { name: "Save phases" }).click();
  await expect(page.getByText("Saved!").last()).toBeVisible();

  await page.getByRole("button", { name: "Add day" }).click();
  await page.getByLabel("Start *").last().fill(`${EVENT_START}T09:00`);
  await page.getByLabel("End *").last().fill(`${EVENT_START}T10:00`);
  await page.getByLabel("Bookings open *").fill(`${EVENT_START}T09:00`);
  await page.getByLabel("Bookings close *").fill(`${EVENT_START}T10:00`);
  await page.getByRole("button", { name: "Add day" }).last().click();
  await expect(page.getByText(`${EVENT_START}T09:00`)).toBeVisible();

  await page.getByRole("link", { name: "Guests" }).click();
  const guests = page.getByRole("region", { name: "Guests" });
  for (const name of names) {
    // The list is paginated, and a just-created guest is rarely on page one.
    await guests.getByPlaceholder("Search name or email…").fill(name);
    const assign = guests
      .getByRole("row")
      .filter({ hasText: name })
      .getByRole("checkbox", { name: /^Assign / });
    await assign.click();
    await expect(assign).toBeChecked();
  }
}

// selectUser logs out and back in; navigating before that settles aborts the
// request and drops the selection. Same helper the comment specs use.
async function actAs(page: Page, name: RegExp) {
  await selectUser(page, name);
  await expect(page.getByRole("button", { name: /^Your name:/ })).toBeVisible();
}

/**
 * Answering a request refreshes the page behind the modal, and a hard
 * navigation started while that refresh's RSC fetch is in flight aborts it --
 * whereupon Next logs the abort and forces a full load back to the page it was
 * refreshing, which cancels the navigation that aborted it. Leaving by the
 * header link is a React transition instead, so it supersedes the pending
 * refresh rather than aborting it; rsvp.spec.ts leaves a saved admin form the
 * same way.
 *
 * waitForLoadState("networkidle") is no substitute: Playwright arms
 * networkidle once per document *load*, and the modal is reached by an in-app
 * navigation -- so the event had long since fired, and the wait returned in a
 * millisecond without waiting for anything at all.
 */
async function leaveForAttendees(page: Page) {
  await page.getByRole("link", { name: "Attendees" }).click();
  await expect(page.getByRole("heading", { name: "Attendees" })).toBeVisible();
}

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

// Each directory row is a link whose name is the whole row, so the name alone
// never matches exactly.
async function openProfile(page: Page, name: string) {
  await page.goto("/guests");
  await page
    .getByPlaceholder(/search/i)
    .first()
    .fill(name);
  await page
    .getByRole("link", { name: new RegExp(name) })
    .first()
    .click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

test.describe("1-on-1 meetings", () => {
  // Torn down in afterEach rather than at the end of the test body. Every
  // event is a link in the site header, and a header long enough to push the
  // name chip out of reach breaks every later spec that picks a user -- so an
  // assertion failing halfway through must not leave one behind. The guests go
  // too: they stop being bookable with the event, but they would otherwise
  // pile up in the directory run after run.
  const leftBehind: { events: string[]; guests: string[] } = {
    events: [],
    guests: [],
  };

  test.afterEach(async ({ page }) => {
    for (const eventName of leftBehind.events.splice(0)) {
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

    for (const name of leftBehind.guests.splice(0)) {
      await page.goto("/admin/users");
      // The table is paginated, so a guest created mid-run is rarely on page one.
      await page.getByPlaceholder("Search name or email…").fill(name);
      const row = page.getByRole("listitem").filter({ hasText: name });
      await row.getByRole("button", { name: "Delete" }).click();
      await row.getByRole("button", { name: "Confirm delete" }).click();
      await expect(row).toBeHidden();
    }
  });

  test("books a slot the other attendee declared, and gets an answer", async ({
    page,
  }) => {
    // One journey through the whole feature, and it drives the admin UI to set
    // the event up first: it lands within a few seconds of the 30s default on
    // an idle machine, so it goes over the moment the suite runs it alongside
    // anything else.
    test.slow();

    const unique = uniqueSuffix();
    const eventName = `E2E Request ${unique}`;
    const asker = `Asker ${unique}`;
    const askee = `Askee ${unique}`;
    await createGuests(page, [asker, askee]);
    leftBehind.guests.push(asker, askee);
    await meetingsEvent(page, eventName, [asker, askee]);
    leftBehind.events.push(eventName);
    const slug = eventName.replace(/ /g, "-");

    // Nobody is bookable yet, so the profile offers nothing.
    await loginAndGoto(page, "/guests");
    await actAs(page, new RegExp(asker));
    await openProfile(page, askee);
    await expect(
      page.getByRole("button", { name: /schedule a 1-on-1/i })
    ).toBeHidden();

    // The askee declares they are open to 1-on-1s, under Settings. The goto
    // first: the profile modal is still up, over the header actAs needs.
    await page.goto("/settings");
    await actAs(page, new RegExp(askee));
    await page.goto("/settings");
    const availability = await openAvailability(page, eventName);
    await availability.getByLabel(/open to 1-on-1s/).check();
    await availability
      .getByRole("button", { name: "Save availability" })
      .click();
    await expect(availability.getByText("Saved!")).toBeVisible();

    // Alice books him from his profile.
    await actAs(page, new RegExp(asker));
    await openProfile(page, askee);

    const schedule = page.getByRole("button", { name: /schedule a 1-on-1/i });
    await expect(schedule).toBeVisible();
    await schedule.click();

    // Where to meet first: picking a slot can insert a busy warning above
    // this row, and clicking into a shifting layout is what Playwright
    // reports as "element is not stable".
    const send = page.getByRole("button", { name: "Send request" });
    await expect(send).toBeVisible();
    await page.getByRole("button", { name: "Coffee bar" }).click();

    // Every day has an 09:00, so the slot has to be found within its own day.
    const dayRegion = page.getByRole("region", { name: DAY_HEADING }).first();
    await dayRegion.getByRole("button", { name: /^09:00/ }).click();

    await send.click();

    await expect(page.getByText(new RegExp(`Asked ${askee}`))).toBeVisible();

    // The askee is told, and answers from the notification.
    await page.goto("/guests");
    await actAs(page, new RegExp(askee));
    await page.getByRole("link", { name: /^Notifications/ }).click();
    await page
      .getByRole("button", {
        name: new RegExp(`${asker} asked you for a 1-on-1`),
      })
      .click();

    const meeting = page.getByRole("dialog", { name: "1-on-1 details" });
    await expect(meeting).toBeVisible();
    await expect(meeting.getByText("Coffee bar")).toBeVisible();
    await meeting.getByRole("button", { name: "Accept" }).click();
    await expect(meeting.getByText(/Confirmed/)).toBeVisible();

    // Closing it is a history replaceState rather than a navigation, which on
    // this server-rendered page is the only thing that takes the modal away.
    await meeting.getByRole("button", { name: "Close" }).click();
    await expect(meeting).toBeHidden();

    // It is on their schedule too, in a column only they can see. Left by a
    // link first, so answering's refresh is superseded rather than raced by
    // the navigation that follows it (see leaveForAttendees).
    await leaveForAttendees(page);
    await page.getByRole("link", { name: eventName }).click();
    const column = page.getByRole("link", { name: new RegExp(asker) });
    await expect(column).toBeVisible();
    await expect(page.getByText("Coffee bar").first()).toBeVisible();

    // And the asker hears back, then asks for the day's other slot.
    await leaveForAttendees(page);
    await actAs(page, new RegExp(asker));
    await page.getByRole("link", { name: /^Notifications/ }).click();
    await expect(
      page.getByRole("button", {
        name: new RegExp(`${askee} accepted your 1-on-1`),
      })
    ).toBeVisible();

    await openProfile(page, askee);
    await page.getByRole("button", { name: /schedule a 1-on-1/i }).click();
    const sendAgain = page.getByRole("button", { name: "Send request" });
    await expect(sendAgain).toBeVisible();
    await page.getByRole("button", { name: "Coffee bar" }).click();
    await page
      .getByRole("region", { name: DAY_HEADING })
      .first()
      .getByRole("button", { name: /^09:30/ })
      .click();
    await sendAgain.click();
    await expect(page.getByText(new RegExp(`Asked ${askee}`))).toBeVisible();

    // Declining takes no explanation, and says so in the reader's own words.
    await page.goto("/guests");
    await actAs(page, new RegExp(askee));
    await page.getByRole("link", { name: /^Notifications/ }).click();
    await page
      .getByRole("button", {
        name: new RegExp(`${asker} asked you for a 1-on-1`),
      })
      .first()
      .click();
    await expect(meeting).toBeVisible();
    await meeting.getByRole("button", { name: "Decline" }).click();
    await expect(meeting.getByText("You declined this.")).toBeVisible();
    await meeting.getByRole("button", { name: "Close" }).click();
    await expect(meeting).toBeHidden();

    await leaveForAttendees(page);
    await actAs(page, new RegExp(asker));
    await page.getByRole("link", { name: /^Notifications/ }).click();
    await expect(
      page.getByRole("button", {
        name: new RegExp(`${askee} declined your 1-on-1`),
      })
    ).toBeVisible();

    // Opening one from the schedule arms "dismiss by going back" (modal-nav.ts,
    // anchor MnpjIo7Y). A meeting reached from a notification afterwards must
    // not inherit it, or closing that one would pop back to the list.
    await page.goto(`/${slug}`);
    await page.getByRole("link", { name: new RegExp(askee) }).click();
    await expect(
      page.getByRole("dialog", { name: "1-on-1 details" })
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await page.goto("/notifications");
    await page
      .getByRole("button", {
        name: new RegExp(`${askee} accepted your 1-on-1`),
      })
      .click();
    const fromNotification = page.getByRole("dialog", {
      name: "1-on-1 details",
    });
    await expect(fromNotification).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("heading", { name: "Notifications" })
    ).toBeHidden();

    // Either of them can call it off from the block on the schedule.
    await page.goto(`/${slug}`);
    await page.getByRole("link", { name: new RegExp(askee) }).click();
    const confirmed = page.getByRole("dialog", { name: "1-on-1 details" });
    await confirmed.getByRole("button", { name: "Cancel 1-on-1" }).click();
    await confirmed.getByRole("button", { name: "Yes, cancel it" }).click();
    await expect(confirmed.getByText(/was canceled/)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("link", { name: new RegExp(askee) })
    ).toBeHidden();

    // Escape rewrites the URL and cancelling refreshes the schedule behind the
    // modal, and afterEach navigates the moment this returns -- so wait for the
    // rewrite, then leave by a link rather than letting the teardown's goto
    // abort the refresh (see leaveForAttendees).
    await expect(page).not.toHaveURL(/viewMeeting=/);
    await leaveForAttendees(page);
  });
});
