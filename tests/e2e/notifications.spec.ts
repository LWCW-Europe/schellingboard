import type { Page } from "@playwright/test";
import { DateTime } from "luxon";
import { expect, test } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { setDevClock } from "./helpers/dev-clock";
import { selectUser } from "./helpers/user";

// The suite shares one database, so each test notifies a different guest:
// two tests watching the same person's badge would see each other's counts.

// selectUser logs out and back in; navigating before that settles aborts the
// request and drops the selection.
async function actAs(page: Page, name: RegExp) {
  await selectUser(page, name);
  await expect(page.getByRole("button", { name: /^Your name:/ })).toBeVisible();
}

async function commentOnProfile(page: Page, name: string, body: string) {
  await page.getByRole("link", { name }).click();
  const profile = page.getByRole("dialog", { name });
  await expect(profile).toBeVisible();
  await profile.getByPlaceholder("Add a comment").fill(body);
  await profile.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(profile.getByText(body).first()).toBeVisible();
  // The modal covers the header, and switching names goes through the header.
  await page.keyboard.press("Escape");
  await expect(profile).toBeHidden();
}

function bell(page: Page) {
  return page.getByRole("link", { name: /^Notifications/ });
}

test("a comment on your profile becomes a notification you can open", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");

  await actAs(page, /Anna Kowalska/i);
  await commentOnProfile(page, "Isabella Rossi", "great to meet you");

  // Isabella hosts a session other specs comment on, so this test reads its
  // own row rather than the badge's count: unread is not hers alone.
  await actAs(page, /Isabella Rossi/i);
  await expect(bell(page)).toHaveAccessibleName(/unread/);

  await bell(page).click();
  await expect(
    page.getByRole("heading", { name: "Notifications" })
  ).toBeVisible();
  // .first(): a retry of this test comments a second time, and the earlier
  // notification is still in the shared database.
  const notification = page
    .getByRole("button", { name: /Anna Kowalska commented on your profile/ })
    .first();
  await expect(notification).toBeVisible();
  const row = page
    .getByRole("listitem")
    .filter({ hasText: "Anna Kowalska commented on your profile" })
    .first();

  // Opening it marks it read and lands on the profile it is about.
  await notification.click();
  await expect(
    page.getByRole("dialog", { name: "Isabella Rossi" })
  ).toBeVisible();
  await expect(row.getByRole("button", { name: "Mark as read" })).toHaveCount(
    0
  );
});

test("marks a notification read without opening it", async ({ page }) => {
  await login(page);
  await page.goto("/guests");

  await actAs(page, /Anna Kowalska/i);
  await commentOnProfile(page, "Hana Kobayashi", "hello from Anna");

  // Hana hosts proposals other specs comment on, so this test reads its own
  // row rather than the badge: the count is not hers alone.
  await actAs(page, /Hana Kobayashi/i);
  await bell(page).click();
  const row = page
    .getByRole("listitem")
    .filter({ hasText: "Anna Kowalska commented on your profile" })
    .first();
  await expect(row).toBeVisible();

  await row.getByRole("button", { name: "Mark as read" }).click();

  await expect(row.getByRole("button", { name: "Mark as read" })).toHaveCount(
    0
  );
  await expect(row).toBeVisible();
});

// Freya Nielsen is nobody else's subject, so her whole list is this test's.
test("acts on the ticked notifications and nothing else", async ({ page }) => {
  await login(page);
  await page.goto("/guests");

  // Two different commenters, so the two rows read differently and can be
  // told apart by name rather than by position.
  await actAs(page, /Anna Kowalska/i);
  await commentOnProfile(page, "Freya Nielsen", "Anna says hello");
  await actAs(page, /Isabella Rossi/i);
  await commentOnProfile(page, "Freya Nielsen", "Isabella says hello");

  await actAs(page, /Freya Nielsen/i);
  await bell(page).click();
  const actions = page.getByRole("group", { name: "Notification actions" });

  // With nothing ticked the buttons do nothing rather than everything.
  await expect(
    actions.getByRole("button", { name: "Mark as read" })
  ).toBeDisabled();
  await expect(actions.getByRole("button", { name: "Delete" })).toBeDisabled();

  await page
    .getByRole("checkbox", {
      name: "Select Anna Kowalska commented on your profile",
    })
    .check();
  await actions.getByRole("button", { name: "Mark as read" }).click();

  // Only the ticked one was read; the other is still waiting.
  await expect(bell(page)).toHaveAccessibleName(/1 unread/);

  await actions.getByRole("checkbox", { name: "Select all" }).check();
  await actions.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(page.getByText(/Nothing yet/)).toBeVisible();
  await expect(bell(page)).toHaveAccessibleName("Notifications");
});

// Conference Gamma is in the scheduling phase, so only its schedule has
// sessions. Carlos Silva hosts this one and no other spec touches either, so
// his badge and its comment thread are this test's alone.
const GREEN_SESSION =
  /Sustainable Software Development: Green Coding Practices/;

async function openSession(page: Page, title: RegExp) {
  await page.getByRole("link", { name: title }).click();
  const modal = page.getByRole("dialog", { name: "Session details" });
  await expect(modal).toBeVisible();
  return modal;
}

test("closing a session opened from a notification stays on the schedule", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");

  await actAs(page, /Anna Kowalska/i);
  const commented = await openSession(page, GREEN_SESSION);
  await commented.getByPlaceholder("Add a comment").fill("count me in");
  await commented.getByRole("button", { name: "Comment", exact: true }).click();
  await expect(
    commented.getByRole("heading", { name: /1 comment/ })
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(commented).toBeHidden();

  await actAs(page, /Carlos Silva/i);

  // Opening a session from the schedule arms "dismiss by going back" (see
  // modal-nav.ts, anchor MnpjIo7Y). That must not still be armed for the modal
  // the notification opens, whose own history entry is the notification list.
  const fromSchedule = await openSession(page, GREEN_SESSION);
  await page.keyboard.press("Escape");
  await expect(fromSchedule).toBeHidden();

  await bell(page).click();
  await page
    .getByRole("button", { name: /Anna Kowalska commented on/ })
    .click();

  const fromNotification = page.getByRole("dialog", {
    name: "Session details",
  });
  await expect(fromNotification).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(fromNotification).toBeHidden();

  // Closing it leaves the reader on the schedule the session is on, not back
  // on the list they came from.
  await expect(
    page.getByRole("heading", { name: "Notifications" })
  ).toBeHidden();
  await expect(page.getByRole("link", { name: GREEN_SESSION })).toBeVisible();
});

// The attendee-count reminder reaches its host in the app, whatever the state
// of the instance's mail configuration. Only a browser shows the rest: that it
// lands in the notification list unread, is counted by the nav badge, and
// opens the session with the count field ready to type into.
//
// Charlie Test hosts exactly two Gamma sessions that have finished by 17:00 on
// day 1 — the opening keynote (day 0) and the React talk (day 1) — so they are
// owed two follow-ups and no heads-up, which is dropped once a session has
// ended.
test.describe("attendee-count reminders", () => {
  test.use({ timezoneId: "Europe/Berlin" });

  // Gamma's days run 09:00–18:00 Berlin from today+14; 17:00 on day 1 is after
  // both sessions and before the day folds shut.
  const lateOnGammaDay = (day: number) =>
    DateTime.now()
      .setZone("Europe/Berlin")
      .plus({ days: 14 + day })
      .set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

  const KEYNOTE = /Opening Keynote/;
  const REACT = /Building Scalable Web Applications/;

  const noticeFor = (page: Page, title: RegExp) =>
    page.getByRole("button", { name: title });

  test("a host finds the reminder in their notification list and records the count", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Gamma?dev=1");
    await selectUser(page, "Charlie Test");
    await setDevClock(page, lateOnGammaDay(1));
    await page.reload();

    // The scheduler is off in E2E (REMINDER_DISPATCH_INTERVAL_MS=0, see
    // docs/dev/testing.md), so the dev toolbar's button stands in for the tick
    // a real deployment runs.
    await page.getByRole("button", { name: "Send due reminders" }).click();
    await expect(page.getByText(/sent \d+ reminders/)).toBeVisible();

    await expect(bell(page)).toHaveAccessibleName(/unread/);
    await bell(page).click();
    await expect(
      page.getByRole("heading", { name: "Notifications" })
    ).toBeVisible();
    await expect(noticeFor(page, KEYNOTE)).toBeVisible();
    await expect(noticeFor(page, REACT)).toBeVisible();

    // Opening it lands on the session with the cursor already in the field:
    // one interaction to record.
    await noticeFor(page, KEYNOTE).click();
    const dialog = page.getByRole("dialog", { name: "Session details" });
    await expect(dialog).toBeVisible();
    const countInput = page.getByLabel("How many people attended?");
    await expect(countInput).toBeFocused();
    await countInput.fill("40");
    await page.getByRole("button", { name: "Save attendee count" }).click();
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();

    // FR-023: recording a count settles nothing in the notification list. The
    // reminder for the *other* session is still there, and still unread —
    // nothing retracts, edits or auto-reads a notification after the fact.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // The follow-up's auto-focus belongs to the session it arrived for. Left
    // in the query it rides along into every session opened from the schedule
    // afterwards (modal-nav copies the current params), stealing the scroll
    // position and popping the keyboard open on a phone.
    await page.getByRole("link", { name: REACT }).first().click();
    await expect(dialog).toBeVisible();
    await expect(countInput).not.toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await bell(page).click();
    const outstanding = page
      .getByRole("listitem")
      .filter({ has: noticeFor(page, REACT) });
    await expect(outstanding).toBeVisible();
    await expect(
      outstanding.getByRole("button", { name: "Mark as read" })
    ).toBeVisible();
  });
});
