import type { Locator, Page } from "@playwright/test";
import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";
import { selectUser } from "./helpers/user";

/**
 * Narrows the directory to the three seeded "… Test" guests, in that order: a
 * name match outranks a bio that happens to mention the word, so Alice, Bob and
 * Charlie are the first three results whatever else matches.
 */
async function searchForTestGuests(page: Page) {
  await page.getByLabel("Search").fill("Test");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/[?&]q=Test/);
}

test("reads a profile over the list and comes back to the same view", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");

  await page.getByRole("button", { name: /Filter by Has profile/ }).click();
  await expect(page).toHaveURL(/[?&]filter=hasProfile/);

  await page.getByRole("link", { name: "Charlie Test" }).click();
  const profile = page.getByRole("dialog");
  await expect(
    profile.getByRole("heading", { level: 1, name: "Charlie Test" })
  ).toBeVisible();
  // The filtered view stays in the URL, so it survives a reload or a share.
  await expect(page).toHaveURL(/\/guests\/[^/?]+\?filter=hasProfile/);

  await profile.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/guests\?filter=hasProfile/);
  await expect(
    page.getByRole("button", { name: /Filter by Has profile \(active\)/ })
  ).toBeVisible();
});

test("moves between profiles without returning to the list", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await searchForTestGuests(page);

  await page.getByRole("link", { name: "Alice Test" }).click();
  const profile = page.getByRole("dialog");
  const heading = profile.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Alice Test");
  // The position names the collection being traversed, so it is never
  // invisible state. It is also announced, with the name in front of it —
  // traversal is otherwise silent about who is now on screen.
  await expect(
    profile.getByText(/^Alice Test, 1 of \d+ attendees$/)
  ).toBeVisible();
  await expect(
    profile.getByRole("button", { name: "Previous attendee" })
  ).toBeDisabled();

  // Profiles differ in length; the controls must not move with them, or they
  // jump out from under the pointer on the way through.
  const next = profile.getByRole("button", { name: "Next attendee" });
  const controlsY = async () => (await next.boundingBox())!.y;
  const y = await controlsY();

  await next.click();
  await expect(heading).toHaveText("Bob Test");
  await expect(
    profile.getByText(/^Bob Test, 2 of \d+ attendees$/)
  ).toBeVisible();
  expect(await controlsY()).toBe(y);

  // The keyboard does the same, which is the point of reading through.
  await page.keyboard.press("ArrowRight");
  await expect(heading).toHaveText("Charlie Test");
  expect(await controlsY()).toBe(y);
  await page.keyboard.press("ArrowLeft");
  await expect(heading).toHaveText("Bob Test");

  // A modified arrow is somebody else's shortcut — browser back, word jump,
  // selection — and must not move on as well.
  await page.keyboard.press("Control+ArrowRight");
  await expect(heading).toHaveText("Bob Test");

  await profile.getByRole("button", { name: "Previous attendee" }).click();
  await expect(heading).toHaveText("Alice Test");

  await profile.getByRole("button", { name: "Close" }).click();
  await expect(page).toHaveURL(/\/guests\?q=Test/);
  await expect(page.getByLabel("Search")).toHaveValue("Test");
});

test("starts each profile at its own top", async ({ page }) => {
  await login(page);
  await page.setViewportSize({ width: 375, height: 500 });
  await page.goto("/guests");
  await searchForTestGuests(page);

  await page.getByRole("link", { name: "Alice Test" }).click();
  const profile = page.getByRole("dialog");
  const heading = profile.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Alice Test");

  // Read to the end of this one…
  await page.mouse.move(187, 300);
  await page.mouse.wheel(0, 2000);
  await expect(heading).not.toBeInViewport();

  // …and the next one starts at its own top, not wherever the last one was
  // left — which is the whole point of reading through.
  await profile.getByRole("button", { name: "Next attendee" }).click();
  await expect(heading).toHaveText("Bob Test");
  await expect(heading).toBeInViewport();
});

test("a profile taller than the window scrolls", async ({ page }) => {
  await login(page);
  // Wide enough for the dialog layout rather than the phone sheet, short
  // enough that a filled-in profile runs past the bottom of it.
  await page.setViewportSize({ width: 1024, height: 400 });
  await page.goto("/guests");
  await searchForTestGuests(page);

  await page.getByRole("link", { name: "Alice Test" }).click();
  const profile = page.getByRole("dialog");
  await expect(
    profile.getByRole("heading", { level: 1, name: "Alice Test" })
  ).toBeVisible();

  // Standing in for the bottom of the profile: Hosting and Proposals arrive
  // later and only if there are any, so Contact is the last section that is
  // reliably there.
  const contact = profile.getByRole("heading", { name: "Contact" });
  await expect(contact).not.toBeInViewport();

  await page.mouse.move(512, 250);
  await page.mouse.wheel(0, 2000);
  await expect(contact).toBeInViewport();
});

test("slides the next profile in from beside this one, not from further out", async ({
  page,
}) => {
  await login(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guests");
  await searchForTestGuests(page);

  await page.getByRole("link", { name: "Alice Test" }).click();
  const profile = page.getByRole("dialog");
  const heading = profile.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Alice Test");

  // Where each profile is, frame by frame, for the length of the slide: the
  // travel is the whole point of it and only its endpoints survive to be
  // asserted afterwards. Installed before the press, so no frame is missed.
  await page.evaluate(() => {
    const samples: [string, number][] = [];
    Object.assign(window, { samples });
    const until = performance.now() + 600;
    const tick = () => {
      for (const h of document.querySelectorAll('[role="dialog"] h1'))
        samples.push([h.textContent ?? "", h.getBoundingClientRect().x]);
      if (performance.now() < until) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  await page.getByRole("button", { name: "Next attendee" }).click();
  await expect(heading).toHaveText("Bob Test");
  await page.waitForTimeout(600);

  const samples = await page.evaluate(
    () => (window as unknown as { samples: [string, number][] }).samples
  );
  const seen = (name: string) =>
    samples.filter(([n]) => n === name).map(([, x]) => x);
  const alice = seen("Alice Test");
  const bob = seen("Bob Test");

  // Bob crosses the screen rather than appearing on it, which is the whole of
  // "slides instead of jumping"…
  const arrived = bob[bob.length - 1];
  expect(Math.max(...bob) - arrived).toBeGreaterThan(300);
  // …from one width out and no further: a card that leaps a width the wrong
  // way first and then slides twice as far back arrives all the same, with a
  // lurch in the middle of it. Alice, going the other way, never moves right.
  expect(Math.max(...bob) - arrived).toBeLessThanOrEqual(391);
  expect(Math.max(...alice)).toBeLessThanOrEqual(alice[0]);
});

test("a press during a slide reads on rather than waiting for it", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await searchForTestGuests(page);

  await page.getByRole("link", { name: "Alice Test" }).click();
  const profile = page.getByRole("dialog");
  const heading = profile.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Alice Test");

  // Two presses inside the length of one slide: reading through is quicker
  // than the animation, and a press swallowed by the slide it interrupts loses
  // a profile every time it happens. Long enough after the first that the slide
  // is under way, well short of the end of it.
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(80);
  await page.keyboard.press("ArrowRight");
  await expect(heading).toHaveText("Charlie Test");
  await expect(page).toHaveURL(/\/guests\/[^/?]+\?q=Test/);
});

test("escape closes the profile, and back retraces the ones read", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await searchForTestGuests(page);

  await page.getByRole("link", { name: "Alice Test" }).click();
  const profile = page.getByRole("dialog");
  const heading = profile.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Alice Test");
  await page.keyboard.press("ArrowRight");
  await expect(heading).toHaveText("Bob Test");

  await page.goBack();
  await expect(heading).toHaveText("Alice Test");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/guests\?q=Test/);
});

test.describe("on a touchscreen", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  /**
   * A finger, in the only terms Playwright leaves for one: touch events on the
   * element under it. Dispatched one round trip at a time so the browser lays
   * out and paints between them, the way it would under a real thumb.
   */
  async function swipe(
    target: Locator,
    { by, down = 0, startX }: { by: number; down?: number; startX?: number }
  ) {
    const box = (await target.boundingBox())!;
    const x0 = startX ?? box.x + box.width / 2;
    const y0 = box.y + box.height / 2;
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const type =
        i === 0 ? "touchstart" : i === steps ? "touchend" : "touchmove";
      await target.page().evaluate(
        ({ type, x, y, x0, y0 }) => {
          // Whatever is under the finger, as a real touchscreen would have it:
          // the gesture is handled somewhere up the tree from there, and the
          // whole sequence goes to the element the finger landed on.
          const node = document.elementFromPoint(x0, y0);
          if (!node) throw new Error("nothing under the finger");
          const point = new Touch({
            identifier: 1,
            target: node,
            clientX: x,
            clientY: y,
          });
          const held = type === "touchend" ? [] : [point];
          node.dispatchEvent(
            new TouchEvent(type, {
              bubbles: true,
              cancelable: true,
              touches: held,
              targetTouches: held,
              changedTouches: [point],
            })
          );
        },
        { type, x: x0 + (by * i) / steps, y: y0 + (down * i) / steps, x0, y0 }
      );
    }
  }

  test("reads on with a swipe, and stops at the end of the collection", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/guests");
    await searchForTestGuests(page);

    await page.getByRole("link", { name: "Alice Test" }).click();
    const profile = page.getByRole("dialog");
    const heading = profile.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Alice Test");

    await swipe(profile, { by: -220 });
    await expect(heading).toHaveText("Bob Test");

    await swipe(profile, { by: 220 });
    await expect(heading).toHaveText("Alice Test");

    // Nothing to drag in before the first profile, so it comes back.
    await swipe(profile, { by: 220 });
    await page.waitForTimeout(500);
    await expect(heading).toHaveText("Alice Test");
    await expect(
      profile.getByText(/^Alice Test, 1 of \d+ attendees$/)
    ).toBeVisible();
  });

  test("a swipe is spent where it lands, and does not fire again", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/guests");
    await searchForTestGuests(page);

    await page.getByRole("link", { name: "Alice Test" }).click();
    const profile = page.getByRole("dialog");
    const heading = profile.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Alice Test");

    await swipe(profile, { by: -220 });
    await expect(heading).toHaveText("Bob Test");

    // Going back the other way by any other means must stay gone back.
    await profile.getByRole("button", { name: "Previous attendee" }).click();
    await page.waitForTimeout(500);
    await expect(heading).toHaveText("Alice Test");
  });

  test("leaves scrolling and the browser's own edge gesture alone", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/guests");
    await searchForTestGuests(page);

    await page.getByRole("link", { name: "Alice Test" }).click();
    const profile = page.getByRole("dialog");
    const heading = profile.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Alice Test");

    // A scroll that drifts sideways is still a scroll.
    await swipe(profile, { by: -220, down: -300 });
    await page.waitForTimeout(500);
    await expect(heading).toHaveText("Alice Test");

    // From the left edge, the swipe belongs to the browser's back gesture.
    await swipe(profile, { by: 220, startX: 5 });
    await page.waitForTimeout(500);
    await expect(heading).toHaveText("Alice Test");
  });
});

test("a profile opened from outside the directory can still be read through", async ({
  page,
}) => {
  await login(page);
  await page.goto("/Conference-Alpha/proposals");
  await selectUser(page, /Bob Test/i);

  // Hiding the way onwards here would make it undiscoverable to exactly the
  // people who arrive from a session or a comment. With no list behind it, the
  // collection is everyone.
  await page.getByRole("button", { name: /your name/i }).click();
  await page.getByRole("menuitem", { name: /my profile/i }).click();
  const profile = page.getByRole("dialog");
  await expect(
    profile.getByRole("heading", { level: 1, name: "Bob Test" })
  ).toBeVisible();
  await expect(
    profile.getByText(/^Bob Test, \d+ of \d+ attendees$/)
  ).toBeVisible();
  await expect(
    profile.getByRole("button", { name: "Next attendee" })
  ).toBeEnabled();
});
