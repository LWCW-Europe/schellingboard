import { Locator, expect } from "@playwright/test";

/**
 * Asserts the image actually decoded, not merely that its element is on the
 * page: a 401 or 404 leaves a broken <img> that still has a box, so
 * `toBeVisible()` passes for an image nobody can see.
 */
export async function expectImageLoaded(image: Locator): Promise<void> {
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
}
