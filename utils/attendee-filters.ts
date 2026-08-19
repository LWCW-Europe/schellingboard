/**
 * The attendee directory's filter toggles. The active set lives in one
 * comma-separated `filter` search param, so a filtered view stays shareable.
 */
export const ATTENDEE_FILTERS = [
  { value: "isHost", label: "Session host" },
  { value: "hasProfile", label: "Has profile" },
] as const;

export type AttendeeFilter = (typeof ATTENDEE_FILTERS)[number]["value"];

// Canonical order, so the same view is always the same URL however the toggles
// were clicked.
const VALUES: readonly AttendeeFilter[] = ATTENDEE_FILTERS.map((f) => f.value);

/**
 * Active filters from the `filter` param. Unknown values are dropped rather
 * than rejected — a hand-edited or outdated URL should still show a list.
 */
export function parseAttendeeFilters(
  param: string | undefined
): AttendeeFilter[] {
  const requested = new Set((param ?? "").split(","));
  return VALUES.filter((value) => requested.has(value));
}

/** The `filter` param for a set of filters; null when none are active. */
export function serializeAttendeeFilters(
  filters: readonly AttendeeFilter[]
): string | null {
  const canonical = VALUES.filter((value) => filters.includes(value));
  return canonical.length > 0 ? canonical.join(",") : null;
}
