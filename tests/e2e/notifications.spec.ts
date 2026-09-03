import type { Page } from "@playwright/test";
import { expect, test } from "./helpers/fixtures";
import { login } from "./helpers/auth";
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

  await actAs(page, /Isabella Rossi/i);
  await expect(bell(page)).toHaveAccessibleName(/1 unread/);

  await bell(page).click();
  await expect(
    page.getByRole("heading", { name: "Notifications" })
  ).toBeVisible();
  const notification = page.getByRole("button", {
    name: /Anna Kowalska commented on your profile/,
  });
  await expect(notification).toBeVisible();

  // Opening it marks it read and lands on the profile it is about.
  await notification.click();
  await expect(
    page.getByRole("dialog", { name: "Isabella Rossi" })
  ).toBeVisible();
  await expect(bell(page)).toHaveAccessibleName("Notifications");
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
