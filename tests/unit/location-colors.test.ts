import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { LOCATION_COLOR_NAMES } from "@/utils/location-colors";
import {
  GLOBALS_CSS_PATH,
  contrastRatio,
  mixOklab,
  parseColor,
  readTailwindPalette,
  readThemes,
  type Linear,
} from "../helpers/color-math";

const css = readFileSync(GLOBALS_CSS_PATH, "utf8");
const palette = readTailwindPalette();
const THEMES = readThemes(css);

function declaredHues(): string[] {
  return [...css.matchAll(/\.loc-([a-z]+) \{\s*--loc: var\(--color-(\S+)\);/g)]
    .map(([, name, variable]) => {
      expect(variable, `loc-${name} points at the wrong shade`).toBe(
        `${name}-500`
      );
      return name;
    })
    .sort();
}

describe("location hues", () => {
  it("declares one rule per LOCATION_COLOR_NAMES entry, and no others", () => {
    expect(declaredHues()).toEqual([...LOCATION_COLOR_NAMES].sort());
  });

  it("no longer renders palette shades as dynamic classes", () => {
    expect(css).not.toContain("@source inline(");
  });
});

/**
 * Every role in `app/globals.css` derives from the location's hue with
 * `color-mix()`, so its contrast depends on which of the 22 hues a location
 * happens to have. Recomputing all of them here is the only way to know that
 * the pale ones (yellow, lime) read as well as the dark ones — the mistake the
 * old `bg-${color}-500` with white text made.
 */
describe.each(["light", "dark"] as const)(
  "location roles — %s",
  (themeName) => {
    const theme = THEMES[themeName];
    const token = (key: string) => parseColor(theme.get(key)!);
    const share = (key: string) => parseFloat(theme.get(key)!) / 100;

    const surface = token("--surface");
    const fg = token("--fg");
    const fgMuted = token("--fg-muted");

    it.each([...LOCATION_COLOR_NAMES])("%s stays legible", (hue) => {
      const loc = parseColor(palette.get(`--color-${hue}-500`)!);
      const mix = (base: Linear, key: string) =>
        mixOklab(loc, base, share(key));

      const fill = mix(surface, "--loc-fill-mix");
      const dim = mix(surface, "--loc-dim-mix");
      const badge = mix(fg, "--loc-badge-mix");
      const edge = mix(fg, "--loc-edge-mix");
      const tint = mix(surface, "--loc-tint-mix");
      const tagFg = mix(fg, "--loc-fg-mix");

      const checks: [string, Linear, Linear, number][] = [
        ["block title on its fill", fg, fill, 4.5],
        ["dimmed block title on its fill", fgMuted, dim, 4.5],
        ["RSVP count on its badge", surface, badge, 4.5],
        ["location name on its tag", tagFg, tint, 4.5],
        ["block border against the page", edge, surface, 3],
        ["badge against the block it sits on", badge, fill, 3],
      ];

      for (const [what, a, b, min] of checks) {
        expect(
          Number(contrastRatio(a, b).toFixed(2)),
          what
        ).toBeGreaterThanOrEqual(min);
      }
    });
  }
);
