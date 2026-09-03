import { Day } from "@/db/repositories/interfaces";
import type { Session } from "@/db/repositories/interfaces";
import { DateTime } from "luxon";

export const TIME_FORMAT = "HH:mm";
// Note: if you want to change this to am/pm, the timestamp column in day-grid.tsx,
// needs to be wider (see https://github.com/LWCW-Europe/schellingboard/pull/402/changes)

export const DATETIME_FORMAT = `${TIME_FORMAT} - dd MMM`;

export function formatInLocalZone(
  date: Date,
  eventZone: string,
  localZone: string | null
): string {
  const shown = DateTime.fromJSDate(date).setZone(localZone ?? eventZone);
  const atEvent = DateTime.fromJSDate(date).setZone(eventZone);
  return shown.toFormat(
    shown.offset === atEvent.offset
      ? DATETIME_FORMAT
      : `${DATETIME_FORMAT} ZZZZ`
  );
}

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const convertParamDateTime = (
  date: string,
  time: string,
  timezone: string
) => {
  return DateTime.fromISO(`${date}T${time}:00`, { zone: timezone }).toJSDate();
};

/**
 * How a day is named where one has to be picked: "Friday, June 13", and for a
 * day whose window runs past midnight the hour it ends — "Friday, June 13
 * (until 03:00 Sat)". Without that suffix nothing tells a host which of two
 * adjacent days owns 01:00.
 */
export function formatDayLabel(day: Day, timezone: string): string {
  const start = DateTime.fromJSDate(day.start).setZone(timezone);
  const end = DateTime.fromJSDate(day.end).setZone(timezone);
  const label = start.toFormat("EEEE, MMMM d");
  // Strictly past midnight, not merely a different date: a day ending at
  // exactly 00:00 has no hours on the next date to explain.
  const spillsOver = end > start.startOf("day").plus({ days: 1 });
  return spillsOver
    ? `${label} (until ${end.toFormat(TIME_FORMAT)} ${end.toFormat("EEE")})`
    : label;
}

/**
 * How a start time is offered: the clock time alone, or "Sat 01:10" once the
 * slot has crossed into the next date — on a day running past midnight the
 * times restart from 00:00, which otherwise reads as an earlier slot.
 */
export function formatSlotLabel(
  slot: Date,
  dayStart: Date,
  timezone: string
): string {
  const dt = DateTime.fromJSDate(slot).setZone(timezone);
  const start = DateTime.fromJSDate(dayStart).setZone(timezone);
  const time = dt.toFormat(TIME_FORMAT);
  return dt.hasSame(start, "day") ? time : `${dt.toFormat("EEE")} ${time}`;
}

export const dateOnDay = (date: Date, day: Day) => {
  return (
    date.getTime() >= day.start.getTime() && date.getTime() <= day.end.getTime()
  );
};

/**
 * Derives the URL slug for a new event from its name. Only used at event
 * creation: the slug is stored on the event and stays stable across renames,
 * so for anything else read `event.slug` / `EventsRepository.findBySlug`
 * instead of re-deriving it (slugification is lossy and cannot be reversed).
 *
 * The slug must be safe as a single URL path segment (`/[eventSlug]`), so
 * anything other than letters, numbers, and hyphens is replaced with a
 * hyphen; runs are collapsed and edge hyphens trimmed. Can return "" when
 * the name has no safe characters — callers must reject that.
 */
export function eventNameToSlug(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes an admin-entered website value into a URL with a scheme, so it
 * can be used directly as a link href. Admins may enter a bare domain
 * ("example.com") or a full URL ("https://example.com"); prefixing a scheme
 * unconditionally would turn the latter into "https://https://example.com".
 */
export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Top-level route segments served by this app (see app/); an event slug
// matching one of these would shadow or be shadowed by that route.
export const RESERVED_EVENT_SLUGS = new Set([
  "admin",
  "api",
  "guests",
  "login",
  "media",
  "notifications",
  "settings",
]);

/**
 * URL for fetching a guest's votes. Encodes both values so reserved URL
 * characters (e.g. in legacy slugs stored before sanitization, like "&")
 * cannot corrupt the query string.
 */
export function votesApiUrl(user: string, eventSlug: string): string {
  const params = new URLSearchParams({ user, event: eventSlug });
  return `/api/votes?${params.toString()}`;
}

/**
 * Default per-event break length, used when an event's value is unavailable
 * (e.g. before context has loaded). Mirrors the events schema default.
 */
export const DEFAULT_BREAK_MINUTES = 10;

/**
 * Effective working duration of a slot once its fixed break is removed.
 * The break is a single per-event value; clamps at 0 so absurd configs
 * (break ≥ duration) never produce a negative label.
 */
export function durationMinusBreak(
  durationMinutes: number,
  breakMinutes: number
): number {
  return Math.max(0, durationMinutes - breakMinutes);
}

/**
 * Format duration minutes into a string (e.g., "25m", "1h 20m", "2 hours 50 minutes")
 */
export function formatDuration(
  minutes: number,
  longFormat: boolean = false
): string {
  const minuteString = longFormat ? " minutes" : "m";
  if (minutes < 60) return `${minutes}${minuteString}`;
  const hours = Math.floor(minutes / 60);
  const hourString = longFormat ? (hours === 1 ? " hour" : " hours") : "h";
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}${hourString} ${remainingMinutes}${minuteString}`
    : `${hours}${hourString}`;
}

/**
 * The displayed start time of a session: the break sits at the START of the
 * slot, so the session is shown starting `breakMinutes` after its stored start.
 *
 * Note: This is only used for DISPLAY purposes on existing sessions.
 */
export function getStartTimePlusBreak(
  session: Session,
  breakMinutes: number
): DateTime {
  return DateTime.fromJSDate(session.startTime ?? new Date(0)).plus({
    minutes: breakMinutes,
  });
}

/**
 * Trims, transforms to lowercase and removes accents from a string. Applied to
 * both sides of a search comparison, so "jose" finds "José" and vice versa.
 *
 * `normalizeForSearch("äùàÆåñ") === "auaæan"`
 *
 * Accent stripping from https://stackoverflow.com/a/37511463/1181553
 */
export function normalizeForSearch(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Like `String.includes`, but ignoring case and diacritics
 *
 * @param haystack The string to search in
 * @param needle The string to search for
 */
export function containsIgnoringAccents(
  haystack: string,
  needle: string
): boolean {
  return normalizeForSearch(haystack).includes(normalizeForSearch(needle));
}

/** Like `===`, but ignoring case and diacritics */
export function equalsIgnoringAccents(a: string, b: string): boolean {
  return normalizeForSearch(a) === normalizeForSearch(b);
}
