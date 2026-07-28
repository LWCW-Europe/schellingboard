// Client-safe constraints for avatar images. Validation itself lives in
// images.ts, which is server-only (it uses sharp and fs).

export const MIN_AVATAR_WIDTH = 256;

// Avatars are stored at one size and downscaled on the fly by next/image for
// the small round thumbnails, so this only has to satisfy the largest use:
// the enlarged view, at AVATAR_ENLARGED_MAX_CSS_PX on a 2x screen.
export const AVATAR_MAX_SIZE = 1024;

/**
 * Widest the enlarged view displays an avatar, in CSS pixels. Half of
 * {@link AVATAR_MAX_SIZE}, so a 2x screen fills exactly the stored pixels and
 * anything wider would start upscaling them. Change one and the other follows.
 */
export const AVATAR_ENLARGED_MAX_CSS_PX = AVATAR_MAX_SIZE / 2;

/**
 * Side length of a square cover-crop that never upscales the source: a crop
 * can't be wider than the shorter side of what it is cut from.
 */
export function coverSquareSize(
  maxSize: number,
  width: number,
  height: number
): number {
  return Math.min(maxSize, width, height);
}
