import { Day } from "@/db/repositories/interfaces";
import type { Session } from "@/db/repositories/interfaces";
import { DateTime } from "luxon";

export const TIME_FORMAT = "HH:mm";
// Note: if you want to change this to am/pm, the timestamp column in day-grid.tsx,
// needs to be wider (see https://github.com/LWCW-Europe/schellingboard/pull/402/changes)

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const getNumHalfHours = (start: Date, end: Date) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / 30;
};

export const convertParamDateTime = (
  date: string,
  time: string,
  timezone: string
) => {
  return DateTime.fromISO(`${date}T${time}:00`, { zone: timezone }).toJSDate();
};

export const dateOnDay = (date: Date, day: Day) => {
  return (
    date.getTime() >= day.start.getTime() && date.getTime() <= day.end.getTime()
  );
};

/**
 * Slugification is lossy ("My-Event" and "My Event" share a slug), so it
 * cannot be reversed. To resolve a slug back to an event, use
 * `EventsRepository.findBySlug`, which matches by slugifying each name.
 */
export function eventNameToSlug(name: string): string {
  return name.replace(/ /g, "-");
}

/**
 * URL for fetching a guest's votes. Encodes both values: event slugs keep
 * every non-space character of the event name (see eventNameToSlug), so
 * reserved URL characters like "&" would otherwise corrupt the query string.
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
