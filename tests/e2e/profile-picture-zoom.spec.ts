import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

// Charlie Test is seeded with an uploaded photo and no other spec edits their
// profile, so this never races profile.spec.ts, which resets Alice's avatar.
const GUEST = "Charlie Test";

test("enlarges and dismisses a guest's profile picture on their detail page", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await page.getByRole("link", { name: GUEST }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: GUEST })
  ).toBeVisible();
  const profileUrl = page.url();

  const trigger = page.getByRole("button", {
    name: `Enlarge photo of ${GUEST}`,
  });
  const enlarged = page.getByAltText(`Enlarged profile picture of ${GUEST}`);

  // Closed by default.
  await expect(enlarged).toHaveCount(0);

  // Click the photo → the enlarged view opens.
  await trigger.click();
  await expect(enlarged).toBeVisible();

  // Escape closes it, and we stay on the same detail page.
  await page.keyboard.press("Escape");
  await expect(enlarged).toBeHidden();
  expect(page.url()).toBe(profileUrl);

  // The visible Close control closes it.
  await trigger.click();
  await expect(enlarged).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(enlarged).toBeHidden();

  // Clicking outside the image (top-left corner) closes it.
  await trigger.click();
  await expect(enlarged).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(enlarged).toBeHidden();

  // The photo is back to normal for a mouse user: closing restores focus to
  // the trigger, which must not leave a ring drawn around the avatar.
  // Tailwind draws the ring as a box-shadow, and the restore is async.
  const ring = () => trigger.evaluate((el) => getComputedStyle(el).boxShadow);
  await expect.poll(ring).toBe("none");

  // Keyboard: closing put focus back on the trigger, but in mouse modality, so
  // step off it and back to land there the way a keyboard user would —
  // tabbing, unlike a programmatic focus(), counts as keyboard interaction.
  // Now the ring must show: it is the only cue to where focus sits.
  const isFocused = () =>
    trigger.evaluate((el) => el === document.activeElement);
  await expect.poll(isFocused).toBe(true);
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect.poll(isFocused).toBe(true);
  await expect.poll(ring).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(enlarged).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(enlarged).toBeHidden();

  // On a phone the header stacks vertically. The trigger must still hug the
  // photo: stretched to the row's width it would swallow taps aimed at the
  // empty space beside the avatar and draw a full-width focus ring.
  const width = 375;
  const height = 667;
  await page.setViewportSize({ width, height });
  const photo = page.getByAltText(`Profile avatar of ${GUEST}`);
  const photoBox = await photo.boundingBox();
  const triggerBox = await trigger.boundingBox();
  expect(triggerBox!.width).toBeLessThanOrEqual(photoBox!.width + 1);

  // The enlarged image stays fully within a phone screen.
  await trigger.click();
  await expect(enlarged).toBeVisible();
  const box = await enlarged.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(height + 1);
});
