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
  // sticky header off-screen too). Firefox applies wheel deltas
  // asynchronously, so wheel until the toolbar has actually gone rather than a
  // fixed number of times followed by a hopeful settle.
  await page.mouse.move(250, 400);
  await expect(async () => {
    await page.mouse.wheel(0, 100);
    await expect(toolbar).not.toBeInViewport({ timeout: 250 });
  }).toPass();
  await expect(roomHeader).toBeInViewport();
});

const footerLink = (page: import("@playwright/test").Page) =>
  page.getByRole("link", { name: "Report a Bug" }).locator("visible=true");

// Wheels down until the footer is on screen. Firefox applies wheel deltas
// asynchronously, so a fixed number of wheels plus a settle can come up short
// under load; this stops as soon as the end is reached instead. Where the view
// pins the footer to the viewport it returns straight away, which is right —
// there is nothing to scroll past to reach it.
const scrollToEnd = async (page: import("@playwright/test").Page) => {
  await page.mouse.move(250, 400);
  await expect(async () => {
    await page.mouse.wheel(0, 2000);
    await expect(footerLink(page)).toBeInViewport({ timeout: 250 });
  }).toPass();
};

test("the footer ends the schedule content", async ({ page }) => {
  // The footer sits at the end of the schedule content, so wheeling down over
  // the schedule brings it into view.
  await scrollToEnd(page);
  await expect(footerLink(page)).toBeInViewport();
});

// The text and RSVP views follow the rest of the site (the proposals list, for
// one): on a wide screen the footer is pinned to the bottom of the viewport, so
// it stays visible and isn't stranded mid-page when the content is short (a
// handful of RSVPs); on a phone it ends the content instead. The grid view
// never pins it — see "the footer ends the schedule content" above.

for (const view of ["Text", "RSVP'd"]) {
  test.describe("on a wide screen", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test(`the footer stays at the bottom of the viewport in the ${view} view`, async ({
      page,
    }) => {
      await page.getByRole("button", { name: view }).click();
      const footer = footerLink(page);
      const viewportHeight = page.viewportSize()!.height;
      const atViewportBottom = async () => {
        await expect(footer).toBeInViewport();
        const box = (await footer.boundingBox())!;
        expect(box.y + box.height).toBeGreaterThan(viewportHeight - 40);
        expect(box.y + box.height).toBeLessThan(viewportHeight + 5);
      };

      await atViewportBottom();
      // Still there after scrolling the sessions (a pinned footer is already
      // on screen, so this wheels once and returns) …
      await scrollToEnd(page);
      await atViewportBottom();
      // … and when a search leaves almost nothing to show, the case that
      // otherwise leaves the footer stranded mid-page.
      await page
        .getByPlaceholder("Search sessions")
        .fill("zzz no session matches this");
      await atViewportBottom();
    });
  });
}

test("the footer ends the content in the Text view on a phone", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Text" }).click();
  // The search box exists only in this view: wait for the switch before
  // measuring, so the grid's own footer isn't what gets measured.
  await expect(page.getByPlaceholder("Search sessions")).toBeVisible();
  const footer = footerLink(page);
  const viewportHeight = page.viewportSize()!.height;

  // Below the fold — the content ends with it, the viewport doesn't.
  await expect(footer).toBeVisible();
  expect((await footer.boundingBox())!.y).toBeGreaterThan(viewportHeight);

  await scrollToEnd(page);
  await expect(footer).toBeInViewport();
});

test("the footer follows short content in the RSVP'd view on a phone", async ({
  page,
}) => {
  // With no name selected there is nothing to list, so this is the phone
  // counterpart of the wide-screen "short content" case above: the footer
  // ends the content mid-page instead of being pinned to the viewport.
  await page.getByRole("button", { name: "RSVP'd" }).click();
  await expect(page.getByText("No sessions").first()).toBeVisible();
  const footer = footerLink(page);
  const viewportHeight = page.viewportSize()!.height;

  const box = (await footer.boundingBox())!;
  expect(box.y + box.height).toBeLessThan(viewportHeight - 40);
});

// What a room offers (projector, whiteboard, …) lives in its description. The
// room name in the grid header is the way in: a button, so it is reachable by
// tap and by keyboard, not just by hovering a mouse.
const MAIN_HALL_DETAIL = "projector and sound system";

// Session blocks have tooltips of their own, and one of them can already be
// open (the browser reports the cursor over a block as soon as the page
// loads), so pick out the room's panel by its text.
const roomDetails = (page: import("@playwright/test").Page) =>
  page.getByRole("tooltip").filter({ hasText: MAIN_HALL_DETAIL });

// Narrower than the 500px the rest of this file uses, because that is wide
// enough for the panel's full 480px: only on a real phone does the width have
// to give way, so only here does the fix show.
test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("a room's details open on tap and stay on screen", async ({ page }) => {
    const details = roomDetails(page);
    await expect(details).toHaveCount(0);

    await page.getByRole("button", { name: "Main Hall" }).first().click();
    await expect(details).toContainText(MAIN_HALL_DETAIL);

    // The whole panel fits the phone screen — the point of the exercise, since
    // a fixed-width one gets cut off at the edges.
    const box = (await details.boundingBox())!;
    const viewportWidth = page.viewportSize()!.width;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth);

    // Tapping the next room hands the panel over instead of leaving both open.
    await page.getByRole("button", { name: "Workshop Room" }).first().click();
    await expect(details).toHaveCount(0);
    await expect(
      page.getByRole("tooltip").filter({ hasText: "whiteboards" })
    ).toBeVisible();
  });

  test("a room's details open from the keyboard and close on Escape", async ({
    page,
  }) => {
    const details = roomDetails(page);
    const roomName = page.getByRole("button", { name: "Main Hall" }).first();

    await roomName.press("Enter");
    await expect(details).toContainText(MAIN_HALL_DETAIL);

    await roomName.press("Escape");
    await expect(details).toHaveCount(0);
  });
});

test.describe("on a wide screen", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("hovering a room name shows its details", async ({ page }) => {
    const details = roomDetails(page);
    const roomName = page.getByRole("button", { name: "Main Hall" }).first();
    // Hovering once is not enough: under load the mouse can arrive before the
    // grid has hydrated, and a mouseenter nobody is listening for yet is
    // simply lost — the cursor then rests on the name with no panel to show
    // for it. Leave and come back until one lands. Re-hovering is safe; unlike
    // the tap above it doesn't toggle.
    await expect(async () => {
      await page.mouse.move(0, 400);
      await roomName.hover();
      await expect(details).toContainText(MAIN_HALL_DETAIL, { timeout: 1000 });
    }).toPass();

    await page.mouse.move(0, 400);
    await expect(details).toHaveCount(0);
  });
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
