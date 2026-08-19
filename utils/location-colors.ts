// A location's `color` is one of Tailwind's palette *names*, not an arbitrary
// hex value: the schedule renders it as a `loc-${color}` class, and everything
// it draws is mixed from that hue in `app/globals.css`.
// tests/unit/location-colors.test.ts keeps the two lists in sync.

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
