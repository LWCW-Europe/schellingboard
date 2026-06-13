import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Location images are uploaded through the admin UI and stored on the
// filesystem under UPLOADS_DIR (a persistent volume in production), not in
// public/, because public/ is baked into the build and lost on redeploy.
// They are served by app/uploads/locations/[filename]/route.ts.

import {
  ASPECT_RATIO_TOLERANCE,
  MAX_IMAGE_BYTES,
  MIN_IMAGE_WIDTH,
  REQUIRED_ASPECT_RATIO,
} from "./location-image-constraints";

const FORMAT_EXTENSIONS: Record<string, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

function locationImagesDir(): string {
  return path.join(process.env.UPLOADS_DIR ?? "./uploads", "locations");
}

/**
 * Validates format, size, and 4:3 aspect ratio.
 * Returns the canonical file extension on success, or an error message.
 */
export async function validateLocationImage(
  buffer: Buffer
): Promise<{ ext: string } | { error: string }> {
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    return { error: "Image is too large (max 5 MB)" };
  }

  let width: number;
  let height: number;
  let format: string | undefined;
  try {
    const metadata = await sharp(buffer).metadata();
    width = metadata.width;
    height = metadata.height;
    format = metadata.format;
  } catch {
    return { error: "File is not a valid image" };
  }

  const ext = format ? FORMAT_EXTENSIONS[format] : undefined;
  if (!ext) {
    return { error: "Unsupported image format (use JPEG, PNG, or WebP)" };
  }
  if (width < MIN_IMAGE_WIDTH) {
    return { error: `Image is too small (min ${MIN_IMAGE_WIDTH}px wide)` };
  }

  const ratio = width / height;
  const deviation = Math.abs(ratio - REQUIRED_ASPECT_RATIO);
  if (deviation > REQUIRED_ASPECT_RATIO * ASPECT_RATIO_TOLERANCE) {
    return {
      error: `Image must have a 4:3 aspect ratio (got ${width}×${height})`,
    };
  }

  return { ext };
}

/**
 * Stores the image as <locationId>.<ext>, replacing any previous image for
 * the location. Returns the public URL (with a cache-busting version).
 */
export async function saveLocationImage(
  locationId: string,
  buffer: Buffer,
  ext: string
): Promise<string> {
  const dir = locationImagesDir();
  await fs.mkdir(dir, { recursive: true });
  await deleteLocationImage(locationId);
  const filename = `${locationId}.${ext}`;
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/locations/${filename}?v=${Date.now()}`;
}

/** Removes all stored image files for the location, if any. */
export async function deleteLocationImage(locationId: string): Promise<void> {
  const dir = locationImagesDir();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return;
  }
  await Promise.all(
    entries
      .filter((name) => name.startsWith(`${locationId}.`))
      .map((name) => fs.unlink(path.join(dir, name)).catch(() => {}))
  );
}

const SAFE_FILENAME = /^[A-Za-z0-9_-]+\.(jpg|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Resolves a requested filename to a stored image, guarding against path
 * traversal. Returns undefined for invalid or missing files.
 */
export async function readLocationImage(
  filename: string
): Promise<{ data: Buffer; contentType: string } | undefined> {
  if (!SAFE_FILENAME.test(filename)) return undefined;
  try {
    const data = await fs.readFile(path.join(locationImagesDir(), filename));
    const ext = filename.split(".").pop()!;
    return { data, contentType: CONTENT_TYPES[ext] };
  } catch {
    return undefined;
  }
}
