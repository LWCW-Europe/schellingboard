import type { Attendee } from "@/db/repositories/interfaces";
import { stripMarkdown } from "./markdown";

/**
 * Longest excerpt shipped per card. Only two clamped lines are ever visible, so
 * anything beyond this is payload the browser pays for and nobody reads — and
 * the whole directory is one page.
 */
const EXCERPT_MAX_CHARS = 300;

function filled(value: string | null | undefined): boolean {
  return (value ?? "").trim() !== "";
}

/**
 * Whether the guest has entered anything about themselves. `name` and email are
 * what the CSV importer writes, so they say nothing about the guest having been
 * here; everything else is self-entered.
 */
export function hasFilledProfile(attendee: Attendee): boolean {
  return (
    filled(attendee.aboutMe) ||
    filled(attendee.pronouns) ||
    filled(attendee.basedIn) ||
    filled(attendee.avatarUrl) ||
    (attendee.languages ?? []).some(filled) ||
    (attendee.prompts ?? []).some((p) => filled(p.answer)) ||
    (attendee.contacts ?? []).some((c) => filled(c.value))
  );
}

function truncate(text: string): string {
  if (text.length <= EXCERPT_MAX_CHARS) return text;
  const cut = text.slice(0, EXCERPT_MAX_CHARS);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * The line or two of a profile the directory shows without opening it — the
 * bio, or the first answered prompt when there is no bio, so a filled-in
 * profile never looks as empty as an untouched one. Null when there is nothing
 * to say.
 */
export function profileExcerpt(attendee: Attendee): string | null {
  const aboutMe = stripMarkdown(attendee.aboutMe).replace(/\s+/g, " ").trim();
  if (aboutMe) return truncate(aboutMe);

  const prompt = (attendee.prompts ?? []).find((p) => filled(p.answer));
  if (!prompt) return null;
  const answer = stripMarkdown(prompt.answer).replace(/\s+/g, " ").trim();
  return truncate(`${prompt.prompt} — ${answer}`);
}
