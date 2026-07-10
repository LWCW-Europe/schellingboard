import { ImageResourceRepository } from "@/db/repositories/interfaces";
import sharp, { FormatEnum, Metadata, Sharp } from "sharp";
import fs from "fs/promises";
import path from "path";
import {
  ASPECT_RATIO_TOLERANCE,
  MIN_IMAGE_WIDTH,
  REQUIRED_ASPECT_RATIO,
} from "@/utils/location-image-constraints";

// Images are stored on the filesystem under UPLOADS_DIR
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
    // turbopackIgnore: paths point at a runtime uploads volume, not build
    // assets; without it Turbopack traces the whole project into the bundle.
    return path.join(
      /*turbopackIgnore: true*/ process.env.UPLOADS_DIR ?? "./uploads",
      this.directory
    );
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

    filename = path.join(/*turbopackIgnore: true*/ this.dirPath, filename);
    try {
      const data = await fs.readFile(filename);
      const ext = filename.split(".").pop()!;
      return { data, contentType: CONTENT_TYPES[ext] };
    } catch {
      return undefined;
    }
  }
}

const SAFE_FILENAME = /^[A-Za-z0-9_-]+\.(jpg|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export class AvatarImageResourceRepository extends BaseImageResourceRepository<string> {
  override directory = "avatars";

  override minImageWidth = 256;

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

    return { ok: decodeResult.ok.resize(256, 256, { fit: "cover" }) };
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
