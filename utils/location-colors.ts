// The schedule renders location colours as Tailwind palette classes
// (`bg-${color}-500`, `border-${color}-600`, …), so a location's `color` must
// be one of Tailwind's palette *names* — not an arbitrary hex value. The full
// set of shade classes for every name below is safelisted via `@source
// inline(...)` in `app/globals.css` so the production build keeps them.
// tests/unit/location-colors-safelist.test.ts keeps the two lists in sync.

export const LOCATION_COLOR_NAMES = [
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
] as const;

export type LocationColorName = (typeof LOCATION_COLOR_NAMES)[number];

export const DEFAULT_LOCATION_COLOR: LocationColorName = "slate";

const NAMES = new Set<string>(LOCATION_COLOR_NAMES);

export function isLocationColorName(value: string): value is LocationColorName {
  return NAMES.has(value);
}

/** Coerces stored/submitted input to a valid palette name, defaulting safely. */
export function normalizeLocationColor(value: string): LocationColorName {
  const trimmed = value.trim();
  return isLocationColorName(trimmed) ? trimmed : DEFAULT_LOCATION_COLOR;
}
