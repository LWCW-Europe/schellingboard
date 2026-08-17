import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const GLOBALS_CSS_PATH = path.join(__dirname, "../../app/globals.css");

/** The text between the braces of the rule opened by `marker`. */
function ruleBody(css: string, marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`No \`${marker}\` in globals.css`);
  let depth = 0;
  for (let i = start + marker.length - 1; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) {
      return css.slice(start + marker.length, i);
    }
  }
  throw new Error(`Unterminated \`${marker}\` in globals.css`);
}

/**
 * Reads the tokens out of one block, rejecting anything that is not a plain
 * hex colour — a token written as `oklch()` or `var()` would otherwise drop
 * out of the contract silently rather than failing here.
 */
function tokensIn(block: string): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const [, name, value] of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    if (
      !/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?$/.test(value)
    ) {
      throw new Error(`${name}: expected a hex colour, got \`${value}\``);
    }
    tokens.set(name, value);
  }
  return tokens;
}

/**
 * The theme tokens live in the stylesheet rather than in TypeScript so there is
 * exactly one place to change a colour, which is why this parses them back out.
 * The dark block overrides a subset of the light one, so reading it the way the
 * cascade does — light first, dark on top — is what the browser ends up with.
 */
function readThemes(css: string): {
  light: Map<string, string>;
  dark: Map<string, string>;
} {
  const root = ruleBody(css, ":root {");
  const overrides = ruleBody(root, "@variant dark {");
  const light = tokensIn(root.replace(overrides, ""));
  return {
    light,
    dark: new Map([...light, ...tokensIn(overrides)]),
  };
}

function channels(hex: string): [number, number, number] {
  const h = hex.slice(1);
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
}

// The pairs that actually occur in the UI, each with the ratio WCAG 2.2 asks
// of it. Body copy aims past the 4.5 minimum at the 7.0 of AAA, since dark
// mode is where "technically passing" text starts to feel thin.
//
// `line-subtle` and the surface tints are deliberately absent: a row divider
// or a hover fill is neither text nor a control, so 1.4.11 does not reach
// them, and forcing 3.0 on them would mean drawing boxes everywhere.
//
// The grounds each token is listed against are the ones it may be used on.
// `--fg-subtle` and `--line` clear the three page grounds but not the two
// filled ones (`--surface-muted`, `--surface-hover`), so a badge or an input
// on a filled panel takes `--fg-muted` and `--line-strong` instead.
const TEXT_PAIRS: [fg: string, bg: string, min: number][] = [
  ["--fg", "--surface", 7],
  ["--fg", "--surface-raised", 7],
  ["--fg", "--surface-sunken", 7],
  ["--fg", "--surface-muted", 7],
  ["--fg", "--surface-hover", 7],
  ["--fg-muted", "--surface", 4.5],
  ["--fg-muted", "--surface-raised", 4.5],
  ["--fg-muted", "--surface-sunken", 4.5],
  ["--fg-muted", "--surface-muted", 4.5],
  ["--fg-muted", "--surface-hover", 4.5],
  ["--fg-subtle", "--surface", 4.5],
  ["--fg-subtle", "--surface-raised", 4.5],
  ["--fg-subtle", "--surface-sunken", 4.5],
  ["--fg-inverse", "--surface-inverse", 4.5],
  // A filled brand button keeps white lettering in both themes, so the text on
  // it is its own token rather than `--fg-inverse`, which flips with the theme.
  ["--on-brand", "--brand", 4.5],
  ["--on-brand", "--brand-hover", 4.5],
  ["--on-danger", "--danger", 4.5],
  ["--on-info", "--info", 4.5],
  ["--brand-fg", "--surface", 4.5],
  ["--brand-fg", "--surface-raised", 4.5],
  ["--brand-fg", "--brand-tint", 4.5],
  ["--brand-fg", "--brand-tint-hover", 4.5],
  ["--danger-fg", "--surface", 4.5],
  ["--danger-fg", "--surface-raised", 4.5],
  ["--danger-fg", "--surface-sunken", 4.5],
  ["--danger-fg", "--danger-tint", 4.5],
  ["--success-fg", "--surface", 4.5],
  ["--success-fg", "--surface-raised", 4.5],
  ["--warning-fg", "--surface", 4.5],
  ["--warning-fg", "--surface-raised", 4.5],
  ["--warning-fg", "--warning-tint", 4.5],
  ["--link", "--surface", 4.5],
  ["--link", "--surface-raised", 4.5],
  ["--link", "--surface-sunken", 4.5],
  ["--bar-fg", "--bar", 7],
  ["--bar-fg-subtle", "--bar", 4.5],
];

// WCAG 2.2 1.4.11: the boundary of a control, and anything that distinguishes
// one of its states, has to reach 3.0 against what it sits on. `--line` is
// here because it draws text inputs and select boxes.
const NON_TEXT_PAIRS: [fg: string, bg: string, min: number][] = [
  ["--line", "--surface", 3],
  ["--line", "--surface-raised", 3],
  ["--line", "--surface-sunken", 3],
  ["--line-strong", "--surface", 3],
  ["--line-strong", "--surface-raised", 3],
  ["--brand-accent", "--surface", 3],
  ["--brand-accent", "--surface-raised", 3],
  ["--brand-accent", "--surface-sunken", 3],
  ["--danger", "--surface", 3],
  ["--danger", "--surface-raised", 3],
];

const THEMES = readThemes(readFileSync(GLOBALS_CSS_PATH, "utf8"));

describe.each(["light", "dark"] as const)("theme tokens — %s", (theme) => {
  const tokens = THEMES[theme];

  it.each([...TEXT_PAIRS, ...NON_TEXT_PAIRS])(
    "%s on %s reaches %s:1",
    (fg, bg, min) => {
      const fgValue = tokens.get(fg);
      const bgValue = tokens.get(bg);
      expect(fgValue, `${fg} is undefined`).toBeDefined();
      expect(bgValue, `${bg} is undefined`).toBeDefined();
      const ratio = contrastRatio(fgValue!, bgValue!);
      expect(
        Number(ratio.toFixed(2)),
        `${fg} (${fgValue!}) on ${bg} (${bgValue!})`
      ).toBeGreaterThanOrEqual(min);
    }
  );
});

describe("dark theme", () => {
  const dark = THEMES.dark;

  // A misspelled override would otherwise sit there overriding nothing, and
  // the token it was meant to change would silently stay at its light value.
  it("overrides only tokens the light theme defines", () => {
    expect([...dark.keys()].sort()).toEqual([...THEMES.light.keys()].sort());
  });

  // Pure black with pure white on it is the classic dark-mode mistake: the
  // text blooms into the background at normal reading sizes.
  it("avoids the extremes of the range", () => {
    expect(relativeLuminance(dark.get("--surface")!)).toBeGreaterThan(0.003);
    expect(relativeLuminance(dark.get("--fg")!)).toBeLessThan(0.9);
  });

  // Shadows are all but invisible on a dark ground, so a raised surface has to
  // signal its elevation by being lighter than the page instead.
  it("raises overlays by lightness rather than by shadow", () => {
    expect(relativeLuminance(dark.get("--surface-raised")!)).toBeGreaterThan(
      relativeLuminance(dark.get("--surface")!)
    );
    expect(relativeLuminance(dark.get("--surface-sunken")!)).toBeLessThan(
      relativeLuminance(dark.get("--surface")!)
    );
  });
});
