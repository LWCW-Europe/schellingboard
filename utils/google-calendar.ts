import { stripMarkdown } from "./markdown";

export type CalendarEntry = {
  /** Markdown, as the session stores it. */
  description: string;
  end: Date;
  hostNames: string[];
  location?: string;
  start: Date;
  /** The IANA zone the event runs in, so the entry is created in venue time. */
  timezone: string;
  title: string;
  /** Absolute link back to the session, when the caller knows the origin. */
  url?: string;
};

// Google answers 400 once the whole URL passes 16 KiB, and its description
// field holds 8K characters. Percent-encoding can triple a character, so this
// keeps even all-Unicode text inside both; the link back carries the rest.
export const DESCRIPTION_MAX_CHARS = 6000;

// Google's "dates" wants basic-format ISO 8601: 20261002T070000Z.
function utcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

// Counted in code points: cutting a string's UTF-16 units can split an emoji,
// and the lone surrogate left behind encodes as U+FFFD.
function truncate(text: string): string {
  const chars = Array.from(text);
  if (chars.length <= DESCRIPTION_MAX_CHARS) return text;
  return `${chars.slice(0, DESCRIPTION_MAX_CHARS - 1).join("")}…`;
}

function details(entry: CalendarEntry): string {
  const hosts =
    entry.hostNames.length > 0 ? `Hosted by ${entry.hostNames.join(", ")}` : "";
  return [truncate(stripMarkdown(entry.description)), hosts, entry.url ?? ""]
    .filter((part) => part !== "")
    .join("\n\n");
}

/**
 * A link that opens Google Calendar's new-event form pre-filled with the
 * session. Nothing is stored on Google's side until the reader saves, so it
 * needs no account of ours and works behind the site password.
 */
export function googleCalendarUrl(entry: CalendarEntry): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    ctz: entry.timezone,
    dates: `${utcStamp(entry.start)}/${utcStamp(entry.end)}`,
    text: entry.title,
  });
  const text = details(entry);
  if (text) params.set("details", text);
  if (entry.location) params.set("location", entry.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
