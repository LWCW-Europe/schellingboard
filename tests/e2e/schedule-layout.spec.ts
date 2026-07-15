import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

// The grid view is an "app frame": below the nav bar a single scroll
// container owns the viewport, with a slim toolbar as its first row. The
// container is the only thing that scrolls (both axes), the toolbar scrolls
// away with the content while the room headers stay pinned, the site footer
// sits at the bottom of the schedule content, and empty grid areas can be
// dragged to pan. A narrow viewport makes the grid overflow horizontally
// (3 locations × 240px + gutter ≈ 760px) and exercises the mobile layout.

test.use({ viewport: { width: 500, height: 800 } });

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto("/Conference-Gamma");
  // The event name lives in the site header now; the schedule toolbar's view
  // toggle is the readiness signal that the grid has rendered.
  await expect(page.getByRole("button", { name: "Grid" })).toBeVisible();
});

test("event details open in a popup and the proposals link navigates", async ({
  page,
}) => {
  // The description (here: its "Venue map" link) is hidden until the popup opens.
  const venueMapLink = page.getByRole("link", { name: "Venue map" });
  await expect(venueMapLink).not.toBeVisible();
  await page.getByRole("button", { name: "Event details" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "Venue map" })).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(venueMapLink).not.toBeVisible();

  // The Proposals link sits next to the view toggle and navigates.
  await page.getByRole("link", { name: "Proposals" }).click();
  await expect(
    page.getByRole("heading", { name: /Conference Gamma: Session Proposals/ })
  ).toBeVisible();
});

test("the toolbar scrolls out of view while the room headers stay pinned", async ({
  page,
}) => {
  // The toolbar (view toggle) scrolls with the content; the room headers are
  // sticky and stay pinned to the top of the scroll surface.
  const toolbar = page.getByRole("button", { name: "Grid" });
  const roomHeader = page.getByRole("heading", { name: "Main Hall" }).first();
  await expect(toolbar).toBeInViewport();
  await expect(roomHeader).toBeInViewport();

  // Wheel down just enough to push the slim toolbar past the top edge while
  // staying within the first day (scrolling a full day's height would carry its
  // sticky header off-screen too). Wheel scrolling is applied asynchronously, so
  // scroll in steps and let it settle before asserting.
  await page.mouse.move(250, 400);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(300);

  await expect(toolbar).not.toBeInViewport();
  await expect(roomHeader).toBeInViewport();
});

test("the footer ends the schedule content", async ({ page }) => {
  // Wheel all the way down over the schedule.
  await page.mouse.move(250, 400);
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(500);

  // The footer sits at the end of the schedule content.
  await expect(
    page.getByRole("link", { name: "Report a Bug" }).locator("visible=true")
  ).toBeInViewport();
});

test("dragging the schedule pans it sideways", async ({ page }) => {
  // The last location's header starts beyond the right edge of the viewport.
  // (Each day repeats the header row — the first one is the visible one.)
  const lastLocation = page
    .getByRole("heading", { name: "Garden Terrace" })
    .first();
  await expect(lastLocation).not.toBeInViewport();

  const scroller = page.getByTestId("schedule-scroll");
  const box = (await scroller.boundingBox())!;
  // Drag on the toolbar row's empty right-hand end: always visible and not a
  // control.
  const y = box.y + 12;
  await page.mouse.move(box.x + box.width - 40, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 40, y, { steps: 8 });
  await page.mouse.up();

  await expect(lastLocation).toBeInViewport();
  // The toolbar's controls stick to the visible area (like the fold bars and
  // the footer) instead of scrolling out with the wide grid.
  await expect(page.getByRole("button", { name: "Grid" })).toBeInViewport();
});
