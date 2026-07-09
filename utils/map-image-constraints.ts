// Client-safe constraints for the site map image. Validation itself lives in
// map-image.ts, which is server-only (it uses sharp and fs).

export const MAX_MAP_BYTES = 5 * 1024 * 1024;

export const MAP_REQUIREMENTS_HINT = "JPEG, PNG, or WebP, max 5 MB.";
