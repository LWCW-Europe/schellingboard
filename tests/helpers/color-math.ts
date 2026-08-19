import { readFileSync } from "fs";
import path from "path";

export const GLOBALS_CSS_PATH = path.join(__dirname, "../../app/globals.css");

/**
 * Colours are carried as linear-light sRGB: WCAG luminance is defined on it,
 * and it is the halfway point between the two notations `app/globals.css`
 * uses — our own hex tokens and Tailwind's `oklch()` palette.
 */
export type Linear = [number, number, number];

export type Theme = "light" | "dark";

/** The text between the braces of the rule opened by `marker`. */
function ruleBody(css: string, marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`No \`${marker}\` in the stylesheet`);
  let depth = 0;
  for (let i = start + marker.length - 1; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) {
      return css.slice(start + marker.length, i);
    }
  }
  throw new Error(`Unterminated \`${marker}\` in the stylesheet`);
}

/**
 * Reads the tokens out of one block, rejecting anything that is neither a plain
 * hex colour nor one of the `color-mix()` shares — a colour written as
 * `oklch()` or `var()` would otherwise drop out of the contract silently rather
 * than failing here.
 */
function tokensIn(block: string): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const [, name, raw] of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    const value = raw.trim();
    if (
      !/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?$/.test(value) &&
      !/^\d+(?:\.\d+)?%$/.test(value)
    ) {
      throw new Error(`${name}: expected a hex colour, got \`${value}\``);
    }
    tokens.set(name, value);
  }
  return tokens;
}

/**
 * Pulls the theme tokens out of a stylesheet. They are the contract these tests
 * check, and they live in the stylesheet rather than in TypeScript so there is
 * exactly one place to change a colour. The dark block overrides a subset of
 * the light one, so reading it the way the cascade does — light first, the
 * overrides on top — is what the browser ends up with.
 */
export function readThemes(css: string): Record<Theme, Map<string, string>> {
  const root = ruleBody(css, ":root {");
  const overrides = ruleBody(root, "@variant dark {");
  const light = tokensIn(root.replace(overrides, ""));
  return { light, dark: new Map([...light, ...tokensIn(overrides)]) };
}

function srgbToLinear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function fromHex(hex: string): Linear {
  const h = hex.slice(1);
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [0, 2, 4].map((i) =>
    srgbToLinear(parseInt(full.slice(i, i + 2), 16) / 255)
  ) as Linear;
}

function oklabToLinear([L, a, b]: Linear): Linear {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  // Browsers gamut-map rather than clip, but every value we mix stays close
  // enough to sRGB that the difference is far below the margins asserted.
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, c))) as Linear;
}

function linearToOklab([r, g, b]: Linear): Linear {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** Accepts the two notations that occur in the stylesheets: hex and `oklch()`. */
export function parseColor(value: string): Linear {
  const trimmed = value.trim();
  if (trimmed.startsWith("#")) return fromHex(trimmed);
  // The grays are written `oklch(55.6% 0 none)`: with no chroma there is no
  // hue angle to state.
  const oklch = trimmed.match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+|none)\s*\)$/
  );
  if (!oklch) throw new Error(`Unsupported colour notation: ${value}`);
  const [L, C, h] = oklch.slice(1).map((part) => Number(part) || 0);
  const rad = (h * Math.PI) / 180;
  return oklabToLinear([L / 100, C * Math.cos(rad), C * Math.sin(rad)]);
}

/** The equivalent of `color-mix(in oklab, a <share>, b)`. */
export function mixOklab(a: Linear, b: Linear, share: number): Linear {
  const [oa, ob] = [linearToOklab(a), linearToOklab(b)];
  return oklabToLinear(
    oa.map((c, i) => c * share + ob[i] * (1 - share)) as Linear
  );
}

export function relativeLuminance([r, g, b]: Linear): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: Linear, b: Linear): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Tailwind's own palette, which the `loc-*` rules point at. Read from the
 * package rather than copied so a Tailwind upgrade that restyles a hue shows
 * up as a contrast failure instead of silently drifting.
 */
export function readTailwindPalette(): Map<string, string> {
  const css = readFileSync(
    path.join(__dirname, "../../node_modules/tailwindcss/theme.css"),
    "utf8"
  );
  const palette = new Map<string, string>();
  for (const [, name, value] of css.matchAll(
    /(--color-[a-z]+-\d+):\s*([^;]+);/g
  )) {
    palette.set(name, value.trim());
  }
  return palette;
}
