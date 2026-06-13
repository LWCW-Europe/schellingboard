import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { MAX_IMAGE_BYTES } from "@/utils/location-image-constraints";
import { validateLocationImage } from "@/utils/location-images";

async function makeImage(
  width: number,
  height: number,
  format: "png" | "jpeg" | "webp" = "png"
): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 120, g: 80, b: 200 },
    },
  })
    [format]()
    .toBuffer();
}

describe("validateLocationImage", () => {
  it("accepts a 4:3 PNG and returns the png extension", async () => {
    const result = await validateLocationImage(await makeImage(800, 600));
    expect(result).toEqual({ ext: "png" });
  });

  it("accepts JPEG and WebP with their canonical extensions", async () => {
    expect(
      await validateLocationImage(await makeImage(800, 600, "jpeg"))
    ).toEqual({ ext: "jpg" });
    expect(
      await validateLocationImage(await makeImage(800, 600, "webp"))
    ).toEqual({ ext: "webp" });
  });

  it("accepts a slight deviation from 4:3 within tolerance", async () => {
    // 799x600 is ~0.1% off the 4:3 ratio
    const result = await validateLocationImage(await makeImage(799, 600));
    expect(result).toEqual({ ext: "png" });
  });

  it("rejects an image that is not 4:3", async () => {
    const result = await validateLocationImage(await makeImage(800, 800));
    expect(result).toHaveProperty("error");
    expect((result as { error: string }).error).toMatch(/4:3/);
  });

  it("rejects an image that is too narrow", async () => {
    const result = await validateLocationImage(await makeImage(200, 150));
    expect((result as { error: string }).error).toMatch(/too small/);
  });

  it("rejects oversized files without parsing them", async () => {
    const result = await validateLocationImage(
      Buffer.alloc(MAX_IMAGE_BYTES + 1)
    );
    expect((result as { error: string }).error).toMatch(/too large/);
  });

  it("rejects data that is not an image", async () => {
    const result = await validateLocationImage(Buffer.from("hello world"));
    expect((result as { error: string }).error).toMatch(/not a valid image/);
  });

  it("rejects unsupported formats such as GIF", async () => {
    const gif = await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .gif()
      .toBuffer();
    const result = await validateLocationImage(gif);
    expect((result as { error: string }).error).toMatch(/Unsupported/);
  });
});
