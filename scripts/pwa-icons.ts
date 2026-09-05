#!/usr/bin/env bun
/**
 * Regenerates the PWA icons in public/ from docs/logo/icon.svg.
 *
 * Two cuts, because Android masks the icon it puts on the home screen: the
 * plain one fills the canvas the way apple-touch-icon.png does, while the
 * maskable one sits well inside it — anything outside the central 80% circle
 * can be cropped away by whatever shape the launcher imposes.
 */
import sharp from "sharp";

const SOURCE = "docs/logo/icon.svg";
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Matches apple-touch-icon.png's 148-in-180.
const PLAIN_MARK = 148 / 180;
const MASKABLE_MARK = 0.6;

async function render(
  size: number,
  markFraction: number,
  out: string
): Promise<void> {
  const mark = Math.round(size * markFraction);
  const drawn = await sharp(SOURCE, { density: 900 })
    .resize(mark, mark, { fit: "contain", background: TRANSPARENT })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: WHITE },
  })
    .composite([{ input: drawn, gravity: "centre" }])
    .png()
    .toFile(out);

  console.log(`  ✅ ${out} (${size}×${size})`);
}

await render(192, PLAIN_MARK, "public/icon-192.png");
await render(512, PLAIN_MARK, "public/icon-512.png");
await render(512, MASKABLE_MARK, "public/icon-maskable-512.png");
