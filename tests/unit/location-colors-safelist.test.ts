import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { LOCATION_COLOR_NAMES } from "@/utils/location-colors";

const GLOBALS_CSS_PATH = path.join(__dirname, "../../app/globals.css");

function extractSafelistedColors(css: string, prefix: string): string[] {
  const match = css.match(new RegExp(`${prefix}-\\{([^}]+)\\}`));
  if (!match) return [];
  return match[1].split(",").map((name) => name.trim());
}

describe("Tailwind safelist for location colors", () => {
  const css = readFileSync(GLOBALS_CSS_PATH, "utf8");
  const expected = [...LOCATION_COLOR_NAMES].sort();

  it.each(["bg", "border", "text", "focus:ring"])(
    "safelists every LOCATION_COLOR_NAMES entry for %s-*",
    (prefix) => {
      const safelisted = extractSafelistedColors(css, prefix).sort();
      expect(safelisted).toEqual(expected);
    }
  );
});
