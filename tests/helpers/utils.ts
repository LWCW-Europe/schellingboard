import sharp from "sharp";

export async function createImageFile(
  width: number,
  height: number,
  name: string
): Promise<File> {
  const buffer = await sharp({
    create: { width, height, channels: 3, background: { r: 1, g: 2, b: 3 } },
  })
    .png()
    .toBuffer();
  return new File([new Uint8Array(buffer)], name, { type: "image/png" });
}
