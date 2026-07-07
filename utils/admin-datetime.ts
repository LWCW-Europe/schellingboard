import { DateTime } from "luxon";

// Admin forms edit times in the event's timezone, but the server actions and
// the database speak UTC. These helpers convert between the two at the client
// boundary. An unrecognized timezone falls back to UTC in BOTH directions so
// values always round-trip without shifting.

const INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

/**
 * UTC ISO string → `datetime-local` input value ("yyyy-MM-ddTHH:mm") in the
 * given IANA timezone. Returns "" for null/empty/unparseable input.
 */
export function utcToZonedInput(
  utcIso: string | null | undefined,
  timezone: string
): string {
  if (!utcIso) return "";
  const dt = DateTime.fromISO(utcIso, { zone: "utc" });
  if (!dt.isValid) return "";
  const zoned = dt.setZone(timezone);
  return (zoned.isValid ? zoned : dt).toFormat(INPUT_FORMAT);
}

/**
 * `datetime-local` input value in the given IANA timezone → UTC
 * "yyyy-MM-ddTHH:mm" (the wire format the admin actions expect). Returns ""
 * for empty/unparseable input.
 */
export function zonedInputToUtc(value: string, timezone: string): string {
  if (!value.trim()) return "";
  let dt = DateTime.fromISO(value, { zone: timezone });
  if (!dt.isValid) dt = DateTime.fromISO(value, { zone: "utc" });
  if (!dt.isValid) return "";
  return dt.toUTC().toFormat(INPUT_FORMAT);
}
