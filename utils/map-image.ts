import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// The site map is uploaded through the admin UI and stored on the filesystem
// under SB_UPLOADS_DIR (a persistent volume in production), not in public/, because
// public/ is baked into the build and lost on redeploy. It is served by
// app/media/site/[filename]/route.ts.
//
// Unlike location images (utils/location-images.ts), a map may have any aspect
// ratio, so we validate only format and size.

import { MAX_MAP_BYTES } from "./map-image-constraints";

const FORMAT_EXTENSIONS: Record<string, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

function mapDir(): string {
  return path.join(process.env.SB_UPLOADS_DIR ?? "./uploads", "site");
}

/**
 * Validates format and size. Returns the canonical file extension on success,
 * or an error message.
 */
export async function validateMapImage(
  buffer: Buffer
): Promise<{ ext: string } | { error: string }> {
  if (buffer.byteLength > MAX_MAP_BYTES) {
    return { error: "Image is too large (max 5 MB)" };
  }

  let format: string | undefined;
  try {
    format = (await sharp(buffer).metadata()).format;
  } catch {
    return { error: "File is not a valid image" };
  }

  const ext = format ? FORMAT_EXTENSIONS[format] : undefined;
  if (!ext) {
    return { error: "Unsupported image format (use JPEG, PNG, or WebP)" };
  }

  return { ext };
}

/**
 * Stores the map as map.<ext>, replacing any previous map. Returns the public
 * URL (with a cache-busting version).
 */
export async function saveMapImage(
  buffer: Buffer,
  ext: string
): Promise<string> {
  const dir = mapDir();
  await fs.mkdir(dir, { recursive: true });
  await deleteMapImage();
  const filename = `map.${ext}`;
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/media/site/${filename}?v=${Date.now()}`;
}

/** Removes any stored map image file. */
export async function deleteMapImage(): Promise<void> {
  const dir = mapDir();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return;
  }
  await Promise.all(
    entries
      .filter((name) => name.startsWith("map."))
      .map((name) => fs.unlink(path.join(dir, name)).catch(() => {}))
  );
}

const SAFE_FILENAME = /^map\.(jpg|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Resolves a requested filename to the stored map image, guarding against path
 * traversal. Returns undefined for invalid or missing files.
 */
export async function readMapImage(
  filename: string
): Promise<{ data: Buffer; contentType: string } | undefined> {
  if (!SAFE_FILENAME.test(filename)) return undefined;
  try {
    const data = await fs.readFile(path.join(mapDir(), filename));
    const ext = filename.split(".").pop()!;
    return { data, contentType: CONTENT_TYPES[ext] };
  } catch {
    return undefined;
  }
}
