import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import {
  GLOBALS_CSS_PATH,
  contrastRatio,
  parseColor,
  readThemes,
  relativeLuminance,
} from "../helpers/color-math";

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
  ["--fg-inverse-muted", "--surface-inverse", 4.5],
  // A filled brand button keeps white lettering in both themes, so the text on
  // it is its own token rather than `--fg-inverse`, which flips with the theme.
  ["--on-brand", "--brand", 4.5],
  ["--on-brand", "--brand-hover", 4.5],
  ["--on-danger", "--danger", 4.5],
  ["--on-danger", "--danger-hover", 4.5],
  ["--on-info", "--info", 4.5],
  ["--on-vote-chosen", "--vote-chosen", 4.5],
  ["--fg-inverse", "--surface-inverse-hover", 4.5],
  ["--brand-fg", "--surface", 4.5],
  ["--brand-fg", "--surface-raised", 4.5],
  ["--brand-fg", "--surface-muted", 4.5],
  ["--brand-fg", "--brand-tint", 4.5],
  ["--brand-fg", "--brand-tint-hover", 4.5],
  ["--brand-fg-hover", "--surface", 4.5],
  ["--brand-fg-hover", "--surface-raised", 4.5],
  ["--brand-fg-hover", "--surface-muted", 4.5],
  ["--danger-fg", "--surface", 4.5],
  ["--danger-fg", "--surface-raised", 4.5],
  ["--danger-fg", "--surface-sunken", 4.5],
  ["--danger-fg", "--danger-tint", 4.5],
  ["--danger-fg-hover", "--danger-tint", 4.5],
  ["--success-fg", "--surface", 4.5],
  ["--success-fg", "--surface-raised", 4.5],
  ["--warning-fg", "--surface", 4.5],
  ["--warning-fg", "--surface-raised", 4.5],
  ["--warning-fg", "--warning-tint", 4.5],
  ["--link", "--surface", 4.5],
  ["--link", "--surface-raised", 4.5],
  ["--link", "--surface-sunken", 4.5],
  ["--link-hover", "--surface", 4.5],
  ["--link-hover", "--surface-raised", 4.5],
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
  // A filled vote button has to be told apart from the page it sits on, which
  // is the one thing a neutral dark fill failed at in dark mode: `bar` sat
  // 1.06:1 from a near-black page.
  ["--vote-chosen", "--surface", 3],
  ["--vote-chosen", "--surface-raised", 3],
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
      const ratio = contrastRatio(parseColor(fgValue!), parseColor(bgValue!));
      expect(
        Number(ratio.toFixed(2)),
        `${fg} (${fgValue!}) on ${bg} (${bgValue!})`
      ).toBeGreaterThanOrEqual(min);
    }
  );
});

// A colour a component picks for itself escapes the rule above entirely: it
// keeps its light-mode value in dark mode, and no pair here can catch it. Both
// spellings count — an arbitrary `bg-[#f2f2f2]` and a palette shade like
// `bg-gray-100`, which is the one that gets typed by accident.
const HUES = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
// The utilities that take a colour, optionally with the side or axis some of
// them accept (`border-t-`, `divide-x-`). Anchoring on them is what keeps prose
// out: a comment describing a token as "near-white" is not a class name.
const COLOR_UTILITIES = [
  "bg",
  "text",
  "border",
  "divide",
  "outline",
  "ring",
  "ring-offset",
  "shadow",
  "accent",
  "caret",
  "decoration",
  "placeholder",
  "fill",
  "stroke",
  "from",
  "via",
  "to",
];
// `\b` only guards the bare names; after the `]` of an arbitrary value there is
// no word boundary to find.
const LITERAL_COLOR = new RegExp(
  `\\b(?:${COLOR_UTILITIES.join("|")})(?:-[trblxyse])?-(?:\\[#[0-9a-fA-F]{3,8}\\]|(?:(?:${HUES.join("|")})-\\d{2,3}|white|black)\\b)`,
  "g"
);

describe("components", () => {
  const sources = function* (dir: string): Generator<string> {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) yield* sources(full);
      else if (/\.tsx?$/.test(entry.name)) yield full;
    }
  };

  it("tell a class name from prose", () => {
    expect(
      "bg-gray-100 dark:text-white border-t-[#abcdef]".match(LITERAL_COLOR)
    ).toEqual(["bg-gray-100", "text-white", "border-t-[#abcdef]"]);
    expect("a fill that is near-white in dark mode".match(LITERAL_COLOR)).toBe(
      null
    );
  });

  it("name a token rather than a literal colour", () => {
    const root = path.join(__dirname, "../../app");
    const offenders = [...sources(root)].flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(LITERAL_COLOR)].map(
        ([match]) => `${path.relative(root, file)}: ${match}`
      )
    );
    expect(offenders).toEqual([]);
  });
});

describe("dark theme", () => {
  const dark = THEMES.dark;
  const luminance = (token: string) =>
    relativeLuminance(parseColor(dark.get(token)!));

  // A misspelled override would otherwise sit there overriding nothing, and
  // the token it was meant to change would silently stay at its light value.
  it("overrides only tokens the light theme defines", () => {
    expect([...dark.keys()].sort()).toEqual([...THEMES.light.keys()].sort());
  });

  // Pure black with pure white on it is the classic dark-mode mistake: the
  // text blooms into the background at normal reading sizes.
  it("avoids the extremes of the range", () => {
    expect(luminance("--surface")).toBeGreaterThan(0.003);
    expect(luminance("--fg")).toBeLessThan(0.9);
  });

  // Shadows are all but invisible on a dark ground, so a raised surface has to
  // signal its elevation by being lighter than the page instead.
  it("raises overlays by lightness rather than by shadow", () => {
    expect(luminance("--surface-raised")).toBeGreaterThan(
      luminance("--surface")
    );
    expect(luminance("--surface-sunken")).toBeLessThan(luminance("--surface"));
  });
});
