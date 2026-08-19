import { test, expect } from "./helpers/fixtures";
import { login } from "./helpers/auth";

// Charlie Test is seeded with an uploaded photo and no other spec edits their
// profile, so this never races profile.spec.ts, which resets Alice's avatar.
const GUEST = "Charlie Test";

test("shows the photo big enough to recognise someone, without clicking", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await page.getByRole("link", { name: GUEST }).click();
  // Scoped to the profile: the list stays behind it, and its cards carry
  // thumbnails of the same people.
  const profile = page.getByRole("dialog");
  await expect(
    profile.getByRole("heading", { level: 1, name: GUEST })
  ).toBeVisible();

  const photo = profile.getByAltText(`Profile avatar of ${GUEST}`);
  const box = (await photo.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(240);
  // Stored avatars are square crops, so an unsquare box means a stretched face.
  expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);

  // The photo has its own column: the text sits beside it rather than being
  // pushed a screenful down.
  const aboutMe = profile.getByRole("heading", { name: "About me" });
  const aboutMeBox = (await aboutMe.boundingBox())!;
  expect(aboutMeBox.x).toBeGreaterThanOrEqual(box.x + box.width);

  // A narrow laptop or tablet stacks instead: two columns here would leave the
  // prose ~350px to wrap in, narrower than the phone layout gets.
  await page.setViewportSize({ width: 700, height: 800 });
  const tabletPhotoBox = (await photo.boundingBox())!;
  const tabletAboutMeBox = (await aboutMe.boundingBox())!;
  expect(tabletAboutMeBox.y).toBeGreaterThan(
    tabletPhotoBox.y + tabletPhotoBox.height
  );

  // On a phone the columns stack, and the photo must neither overflow the
  // screen nor push About me off the first one.
  const width = 375;
  const height = 667;
  await page.setViewportSize({ width, height });
  const phoneBox = (await photo.boundingBox())!;
  expect(phoneBox.width).toBeGreaterThanOrEqual(200);
  expect(phoneBox.x).toBeGreaterThanOrEqual(0);
  expect(phoneBox.x + phoneBox.width).toBeLessThanOrEqual(width);
  const phoneAboutMeBox = (await aboutMe.boundingBox())!;
  expect(phoneAboutMeBox.y).toBeGreaterThan(phoneBox.y);
  expect(phoneAboutMeBox.y).toBeLessThan(height);
});

test("enlarges a guest's photo in place and shrinks it again", async ({
  page,
}) => {
  await login(page);
  await page.goto("/guests");
  await page.getByRole("link", { name: GUEST }).click();
  const profile = page.getByRole("dialog");
  await expect(
    profile.getByRole("heading", { level: 1, name: GUEST })
  ).toBeVisible();
  const profileUrl = page.url();

  const photo = profile.getByAltText(`Profile avatar of ${GUEST}`);
  const enlarge = profile.getByRole("button", {
    name: `Enlarge photo of ${GUEST}`,
  });
  const shrink = profile.getByRole("button", {
    name: `Shrink photo of ${GUEST}`,
  });
  const photoWidth = async () => (await photo.boundingBox())!.width;

  const normal = await photoWidth();

  // Enlarging swaps the photo's size in place — deliberately not a second
  // modal over the profile, which would mean two Escape keys to unwind.
  await enlarge.click();
  await expect(shrink).toBeVisible();
  expect(await photoWidth()).toBeGreaterThan(normal);
  expect(page.url()).toBe(profileUrl);

  // Escape unwinds the enlarged photo first, leaving the profile open.
  await page.keyboard.press("Escape");
  await expect(enlarge).toBeVisible();
  expect(await photoWidth()).toBe(normal);
  await expect(profile).toBeVisible();

  // Clicking it again shrinks it back.
  await enlarge.click();
  await expect(shrink).toBeVisible();
  await shrink.click();
  await expect(enlarge).toBeVisible();
  expect(await photoWidth()).toBe(normal);

  // The photo is back to normal for a mouse user: the trigger must not be left
  // with a ring drawn around it. Tailwind draws the ring as a box-shadow.
  const ring = () => enlarge.evaluate((el) => getComputedStyle(el).boxShadow);
  await expect.poll(ring).toBe("none");

  // Keyboard: the ring is the only cue to where focus sits, so it must show
  // once the trigger is reached by tabbing.
  await enlarge.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect
    .poll(() => enlarge.evaluate((el) => el === document.activeElement))
    .toBe(true);
  await expect.poll(ring).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(shrink).toBeVisible();

  // On a phone the trigger must still hug the photo: stretched to the row's
  // width it would swallow taps aimed at the space beside it, and the enlarged
  // photo must stay within the screen.
  const width = 375;
  await page.setViewportSize({ width, height: 667 });
  const phonePhoto = (await photo.boundingBox())!;
  const phoneTrigger = (await shrink.boundingBox())!;
  expect(phoneTrigger.width).toBeLessThanOrEqual(phonePhoto.width + 1);
  expect(phonePhoto.x).toBeGreaterThanOrEqual(0);
  expect(phonePhoto.x + phonePhoto.width).toBeLessThanOrEqual(width + 1);
});
