import { test, expect } from "./helpers/fixtures";
import type { Page } from "@playwright/test";
import { login, loginAndGoto } from "./helpers/auth";
import { selectUser } from "./helpers/user";
import { openGammaScheduleDuringEvent } from "./helpers/dev-clock";

// The agenda view: a beta behind its own toolbar button, the grid staying the
// default everywhere.

const KEYNOTE = /Opening Keynote - Conference Gamma/;

const viewButton = (page: Page, name: string) =>
  page.getByRole("button", { name });

// The toggle is server-rendered, so a click can land before React has attached
// its handler and be dropped — retry until the view has actually switched
// (docs/dev/testing.md § E2E conventions).
const switchToView = async (page: Page, name: string) => {
  await expect(async () => {
    await viewButton(page, name).click();
    await expect(viewButton(page, name)).toHaveAttribute(
      "aria-pressed",
      "true",
      { timeout: 2000 }
    );
  }).toPass();
};

test.describe("on a phone-sized screen", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the agenda lists each time's sessions with their room and end", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/Conference-Gamma");
    await expect(viewButton(page, "Grid")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await switchToView(page, "Agenda");
    const keynote = page.getByRole("link", { name: KEYNOTE });
    await expect(keynote).toBeVisible();
    await expect(keynote).toContainText("Main Hall");
    await expect(keynote).toContainText("until 10:30");

    // Lunch blocks every room at once, and is listed once, not once per room.
    const lunchSlot = page.getByRole("region", { name: "12:30" }).first();
    await expect(lunchSlot.getByText("Lunch Break")).toHaveCount(1);
  });
});

test("the agenda groups sessions by start time and opens their details", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  await switchToView(page, "Agenda");
  // The keynote's slot starts at 09:00; the heading shows when the session
  // itself starts, after the event's 10-minute break — as its details do.
  const nineOClock = page.getByRole("region", { name: "09:10" }).first();
  await nineOClock.getByRole("link", { name: KEYNOTE }).click();
  await expect(
    page.getByRole("dialog", { name: "Session details" })
  ).toBeVisible();
});

// Zanele's first Gamma morning holds seeded 1-on-1s at 10:00, a slot no
// session starts in (see meetings-column.spec.ts). They are hers alone: the
// grid gives her a column for them, the agenda a time of their own.
test("the viewer's own 1-on-1s are listed at their time", async ({ page }) => {
  await loginAndGoto(page, "/guests");
  await selectUser(page, "Zanele Khumalo");
  await page.getByRole("link", { name: "Conference Gamma" }).first().click();
  await switchToView(page, "Agenda");

  const tenOClock = page.getByRole("region", { name: "10:00" }).first();
  await tenOClock
    .getByRole("link", { name: /1-on-1 with Leilani Kahale/ })
    .click();
  const details = page.getByRole("dialog", { name: "1-on-1 details" });
  await expect(
    details.getByRole("heading", { name: "1-on-1 with Leilani Kahale" })
  ).toBeVisible();
});

test.describe("while the event is running", () => {
  // At 16:00 the marker sits after day one's last group, only a few rows down
  // the list; a short viewport keeps it off screen until Now is pressed.
  test.use({
    timezoneId: "Europe/Berlin",
    viewport: { width: 1280, height: 500 },
  });

  test("the agenda marks the current time and Now jumps to it", async ({
    page,
  }) => {
    await openGammaScheduleDuringEvent(page, "/Conference-Gamma");
    await switchToView(page, "Agenda");

    const nowLine = page.getByTestId("now-line");
    await expect(nowLine).toBeAttached();
    await expect(nowLine).not.toBeInViewport();

    await page.getByRole("button", { name: "Now" }).click();
    await expect(nowLine).toBeInViewport();

    // 16:00 falls inside the seeded 15:30–16:30 session and after the keynote.
    await expect(
      page.getByRole("link", { name: /API Design: RESTful vs GraphQL/ })
    ).toContainText("Now");
    await expect(page.getByRole("link", { name: KEYNOTE })).not.toContainText(
      "Now"
    );
  });
});
