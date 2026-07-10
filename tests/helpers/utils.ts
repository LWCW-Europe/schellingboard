import sharp, { Sharp } from "sharp";

export async function createImageFile(
  width: number,
  height: number,
  name: string,
  opts: {
    preprocess?: (image: Sharp) => Sharp;
  } = {}
): Promise<File> {
  const { preprocess = (image) => image.png() } = opts;

  const image = sharp({
    create: { width, height, channels: 3, background: { r: 1, g: 2, b: 3 } },
  });
  const buffer = await preprocess(image).toBuffer();
  return new File([new Uint8Array(buffer)], name, { type: "image/png" });
}
