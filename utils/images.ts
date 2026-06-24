import { ImageResourceRepository } from "@/db/repositories/interfaces";
import sharp, { FormatEnum, Metadata, Sharp } from "sharp";
import fs from "fs/promises";
import path from "path";

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
export const MIN_IMAGE_WIDTH = 400;

export abstract class BaseImageResourceRepository<
  Id extends string,
> implements ImageResourceRepository<Id> {
  readonly maxImageBytes = MAX_IMAGE_BYTES;
  readonly minImageWidth: number = MIN_IMAGE_WIDTH;
  abstract readonly directory: string;

  get dirPath() {
    return path.join(process.env.UPLOADS_DIR ?? "./uploads", this.directory);
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

    const { width, format } = metadata;

    const ext = FORMAT_EXTENSIONS[format];

    if (!ext) {
      return { error: "Unsupported image format (use JPEG, PNG, or WebP)" };
    }
    if (width < this.minImageWidth) {
      return { error: `Image is too small (min ${this.minImageWidth}px wide)` };
    }

    try {
      // strips EXIF, ICC profiles, XMP, IPTC, GPS data, and other metadata from images
      const newBuffer = await this.decodeImage(
        decodedImage,
        metadata
      ).toBuffer();

      return { ext, buffer: newBuffer };
    } catch {
      return { error: "Unable to decode image" };
    }
  }

  protected decodeImage(image: Sharp, metadata: Metadata): Sharp {
    return image.rotate().toFormat(metadata.format);
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
        .map((name) => fs.unlink(path.join(dir, name)).catch(() => {}))
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
    await fs.writeFile(path.join(dir, filename), buffer);
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

    filename = path.join(this.dirPath, filename);
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

  override decodeImage(image: Sharp, metadata: Metadata): Sharp {
    return super
      .decodeImage(image, metadata)
      .resize(256, 256, { fit: "cover" });
  }
}

export function getImageRepositories() {
  return {
    avatars: new AvatarImageResourceRepository(),
  };
}
