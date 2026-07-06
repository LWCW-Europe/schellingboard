import "client-only";

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  destWidth: number,
  destHeight: number
) {
  const sourceAspect = sourceWidth / sourceHeight;
  const destAspect = destWidth / destHeight;

  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceAspect > destAspect) {
    // Source is wider: crop left/right
    sw = sourceHeight * destAspect;
    sx = (sourceWidth - sw) / 2;
  } else {
    // Source is taller: crop top/bottom
    sh = sourceWidth / destAspect;
    sy = (sourceHeight - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, destWidth, destHeight);
}

function toBlob(canvas: HTMLCanvasElement, file: Blob) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      file.type.startsWith("image/") ? file.type : "image/jpeg",
      0.9
    );
  })
    .then((blob) => ({ blob }))
    .catch((e) => {
      console.error(e);
      return { error: "Failed to resize image" };
    });
}

export async function resizeImage(
  canvas: HTMLCanvasElement,
  file: Blob,
  maxSize: number
): Promise<{ blob: Blob } | { error: string }> {
  const bitmap = await createImageBitmap(file);

  canvas.width = maxSize;
  canvas.height = maxSize;

  const ctx = canvas.getContext("2d")!;

  try {
    drawCover(
      ctx,
      bitmap,
      bitmap.width,
      bitmap.height,
      canvas.width,
      canvas.height
    );
  } catch (e) {
    console.error(e);
    return { error: "Failed to draw image" };
  }

  return toBlob(canvas, file);
}
