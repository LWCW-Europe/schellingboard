import { ImageResourceRepository } from "@/db/repositories/interfaces";
import sharp, { FormatEnum, Metadata, Sharp } from "sharp";
import fs from "fs/promises";
import path from "path";
import {
  ASPECT_RATIO_TOLERANCE,
  MIN_IMAGE_WIDTH,
  REQUIRED_ASPECT_RATIO,
} from "@/utils/location-image-constraints";
import {
  AVATAR_MAX_SIZE,
  MIN_AVATAR_WIDTH,
  coverSquareSize,
} from "@/utils/avatar-image-constraints";
import { uploadsDir } from "@/utils/uploads-dir";

// Images are stored on the filesystem under SB_UPLOADS_DIR
// (a persistent volume in production), not in public/,
// because public/ is baked into the build and lost on redeploy.

// Avatar images are uploaded through the /guests/edit UI
// They are served by app/media/avatar/[filename]/route.ts.

const FORMAT_EXTENSIONS: Partial<Record<keyof FormatEnum, string>> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export abstract class BaseImageResourceRepository<
  Id extends string,
> implements ImageResourceRepository<Id> {
  readonly maxImageBytes = MAX_IMAGE_BYTES;
  abstract readonly minImageWidth: number;
  abstract readonly directory: string;

  get dirPath() {
    // These paths point at a runtime uploads volume, not build assets. The
    // fs calls below carry /*turbopackIgnore: true*/ so the standalone build's
    // file tracer doesn't sweep the whole project into the bundle.
    return path.join(/*turbopackIgnore: true*/ uploadsDir(), this.directory);
  }

  protected abstract getEndpoint(filename: string): string;

  /**
   * Validates format and size
   * Returns the canonical file extension on success, or an error message.
   */
  async validate(
    buffer: Buffer
  ): Promise<{ ext: string; buffer: Buffer } | { error: string }> {
    if (buffer.byteLength > this.maxImageBytes) {
      const mb = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }).format(this.maxImageBytes / 1_000_000);
      return {
        error: `Image is too large (max ${mb} MB)`,
      };
    }

    let decodedImage: Sharp;
    let metadata: Metadata;
    try {
      decodedImage = sharp(buffer);
      metadata = await decodedImage.metadata();
    } catch {
      return { error: "File is not a valid image" };
    }

    if (metadata.orientation !== undefined && metadata.orientation >= 5) {
      [metadata.width, metadata.height] = [metadata.height, metadata.width];
    }

    const { width, format } = metadata;

    const ext = FORMAT_EXTENSIONS[format];

    if (!ext) {
      return { error: "Unsupported image format (use JPEG, PNG, or WebP)" };
    }
    if (width < this.minImageWidth) {
      return { error: `Image is too small (min ${this.minImageWidth}px wide)` };
    }

    try {
      const imageResult = this.decodeImage(decodedImage, metadata);

      if ("error" in imageResult) {
        return { error: imageResult.error };
      }

      // strips EXIF, ICC profiles, XMP, IPTC, GPS data, and other metadata from images
      const newBuffer = await imageResult.ok.toBuffer();

      return { ext, buffer: newBuffer };
    } catch {
      return { error: "Unable to decode image" };
    }
  }

  protected decodeImage(
    image: Sharp,
    metadata: Metadata
  ): { ok: Sharp } | { error: string } {
    return { ok: image.rotate().toFormat(metadata.format) };
  }

  /** Removes all stored image files for the ID, if any. */
  async delete(id: Id): Promise<void> {
    const dir = this.dirPath;
    let entries: string[];
    try {
      entries = await fs.readdir(dir);
    } catch {
      return;
    }
    await Promise.all(
      entries
        .filter((name) => name.startsWith(`${id}.`))
        .map((name) =>
          fs
            .unlink(path.join(/*turbopackIgnore: true*/ dir, name))
            .catch(() => {})
        )
    );
  }

  /**
   * Stores the image as <ID>.<ext>, replacing any previous image for
   * the ID. Returns the public URL (with a cache-busting version).
   */
  async save(id: Id, buffer: Buffer, ext: string): Promise<string> {
    const dir = this.dirPath;
    await fs.mkdir(dir, { recursive: true });
    await this.delete(id);
    const filename = `${id}.${ext}`;
    await fs.writeFile(
      path.join(/*turbopackIgnore: true*/ dir, filename),
      buffer
    );
    return `${this.getEndpoint(filename)}?v=${Date.now()}`;
  }

  /**
   * Resolves a requested filename to a stored image, guarding against path
   * traversal. Returns undefined for invalid or missing files.
   */
  async read(
    filename: string
  ): Promise<{ data: Buffer; contentType: string } | undefined> {
    if (!SAFE_FILENAME.test(filename)) return undefined;
    return this.readStored(filename);
  }

  /**
   * {@link read} without the SAFE_FILENAME check, for names this class builds
   * itself. Renditions are `<id>.<width>.<ext>`, which SAFE_FILENAME rejects
   * (it allows no dot in the stem) — reading them through `read` silently
   * missed the cache on every request.
   */
  private async readStored(
    filename: string
  ): Promise<{ data: Buffer; contentType: string } | undefined> {
    const target = path.join(/*turbopackIgnore: true*/ this.dirPath, filename);
    try {
      const data = await fs.readFile(target);
      const ext = target.split(".").pop()!;
      return { data, contentType: CONTENT_TYPES[ext] };
    } catch {
      return undefined;
    }
  }

  /**
   * {@link read}, downscaled to `width`. Does the job next/image's optimizer
   * would, because it can't reach these files once /media needs a cookie
   * (see utils/image-loader.js).
   *
   * The rendition is cached beside the original as `<id>.<width>.<ext>`, so
   * replacing an image drops its renditions too — {@link delete} already
   * removes everything starting with `<id>.`.
   */
  async readSized(
    filename: string,
    width: number
  ): Promise<{ data: Buffer; contentType: string } | undefined> {
    if (!SAFE_FILENAME.test(filename)) return undefined;

    const [base, ext] = splitExtension(filename);
    const rendition = `${base}.${width}.${ext}`;
    const cached = await this.readStored(rendition);
    if (cached) return cached;

    const original = await this.read(filename);
    if (!original) return undefined;

    let resized: Buffer;
    try {
      const image = sharp(original.data);
      const { width: sourceWidth } = await image.metadata();
      // Upscaling invents no detail and only costs bytes.
      if (sourceWidth <= width) return original;
      resized = await image
        .resize(width, null, { withoutEnlargement: true })
        .toBuffer();
    } catch {
      // A stored file sharp can't read is still servable as-is.
      return original;
    }

    await this.writeRendition(rendition, resized);
    return { data: resized, contentType: original.contentType };
  }

  /**
   * Writes via a unique temporary name and renames into place, so a second
   * request for the same rendition can never read a half-written file.
   */
  private async writeRendition(name: string, data: Buffer): Promise<void> {
    const dir = this.dirPath;
    const target = path.join(/*turbopackIgnore: true*/ dir, name);
    const temp = `${target}.${crypto.randomUUID()}.tmp`;
    try {
      await fs.writeFile(temp, data);
      await fs.rename(temp, target);
    } catch {
      // A failed cache write costs a resize next time, nothing more.
      await fs.unlink(temp).catch(() => {});
    }
  }
}

/** Splits "a1.webp" into ["a1", "webp"]; the name is SAFE_FILENAME-checked. */
function splitExtension(filename: string): [string, string] {
  const dot = filename.lastIndexOf(".");
  return [filename.slice(0, dot), filename.slice(dot + 1)];
}

// The widths next/image can ask for: its default imageSizes and deviceSizes.
// An open width parameter would be a CPU-burn oracle — every distinct value
// misses the rendition cache and costs a full decode plus resize.
const ALLOWED_WIDTHS = new Set([
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
]);

/**
 * The width a media request asks for: null when it asks for none (serve the
 * original), or false when the value isn't one we generate renditions for.
 */
export function requestedWidth(params: URLSearchParams): number | null | false {
  const raw = params.get("w");
  if (raw === null) return null;
  const width = Number(raw);
  return ALLOWED_WIDTHS.has(width) ? width : false;
}

const SAFE_FILENAME = /^[A-Za-z0-9_-]+\.(jpg|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export class AvatarImageResourceRepository extends BaseImageResourceRepository<string> {
  override directory = "avatars";

  override minImageWidth = MIN_AVATAR_WIDTH;

  protected override getEndpoint(filename: string): string {
    return `/media/avatars/${filename}`;
  }

  override decodeImage(
    image: Sharp,
    metadata: Metadata
  ): { ok: Sharp } | { error: string } {
    const decodeResult = super.decodeImage(image, metadata);

    if ("error" in decodeResult) {
      return decodeResult;
    }

    // Crop to a square without ever enlarging: upscaling invents no detail and
    // only costs bytes, so a small upload stays at its own size.
    const size = coverSquareSize(
      AVATAR_MAX_SIZE,
      metadata.width,
      metadata.height
    );

    // The base check only looks at the width, which a flat panorama passes
    // while its square crop lands well under the minimum.
    if (size < MIN_AVATAR_WIDTH) {
      return {
        error: `Image is too small (min ${MIN_AVATAR_WIDTH}×${MIN_AVATAR_WIDTH}px)`,
      };
    }

    return { ok: decodeResult.ok.resize(size, size, { fit: "cover" }) };
  }
}

export class LocationImageResourceRepository extends BaseImageResourceRepository<string> {
  override directory = "locations";

  override minImageWidth = MIN_IMAGE_WIDTH;

  override decodeImage(
    image: Sharp,
    metadata: Metadata
  ): { ok: Sharp } | { error: string } {
    const decodeResult = super.decodeImage(image, metadata);

    if ("error" in decodeResult) {
      return decodeResult;
    }

    const { width, height } = metadata;
    const ratio = width / height;
    const deviation = Math.abs(ratio - REQUIRED_ASPECT_RATIO);
    if (deviation > REQUIRED_ASPECT_RATIO * ASPECT_RATIO_TOLERANCE) {
      return {
        error: `Image must have a 4:3 aspect ratio (got ${width}×${height})`,
      };
    }

    return decodeResult;
  }

  protected override getEndpoint(filename: string): string {
    return `/media/locations/${filename}`;
  }
}

export function getImageRepositories() {
  return {
    avatars: new AvatarImageResourceRepository(),
    locations: new LocationImageResourceRepository(),
  };
}
