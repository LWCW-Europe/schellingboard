import type { Attendee } from "@/db/repositories/interfaces";
import { CONTACT_TYPE_LABELS } from "@/model/guest";
import { containsIgnoringAccents, equalsIgnoringAccents } from "./utils";

// Rank tiers, higher wins. Exact declared-language matches must beat
// incidental free-text mentions ("Italian" the speaker vs. "Italian food"
// in a bio); a name match beats both.
const NAME = 3;
const STRUCTURED = 2;
const FREE_TEXT = 1;

function rank(attendee: Attendee, query: string): number {
  if (containsIgnoringAccents(attendee.name, query)) return NAME;

  const languages = attendee.languages ?? [];
  if (languages.some((l) => equalsIgnoringAccents(l, query))) return STRUCTURED;

  // Every public profile field, including contacts — someone who knows a
  // handle should find its owner. The private system email is not part of
  // Attendee and so can never be matched here.
  const freeText = [
    attendee.basedIn,
    attendee.pronouns,
    attendee.aboutMe,
    ...languages,
    ...(attendee.prompts ?? []).flatMap((p) => [p.prompt, p.answer]),
    ...(attendee.contacts ?? []).flatMap((c) => [
      // The label the profile prints: stored only for "other" contacts, the
      // type's name for the rest.
      (c.type === "other" && c.label) || CONTACT_TYPE_LABELS[c.type],
      c.value,
    ]),
  ];
  if (freeText.some((t) => t && containsIgnoringAccents(t, query)))
    return FREE_TEXT;

  return 0;
}

/**
 * In-memory search over the full attendee list. Case-insensitive substring
 * matching, ranked by tier (name > declared language > free text), ties by
 * name. An empty query returns everyone in name order. Pagination is the
 * caller's job (slice the result).
 */
export function searchAttendees<A extends Attendee>(
  attendees: A[],
  query: string
): A[] {
  const byName = (a: A, b: A) =>
    a.name.localeCompare(b.name) || a.id.localeCompare(b.id);

  const q = query.trim();
  if (!q) return [...attendees].sort(byName);

  return attendees
    .map((attendee) => ({ attendee, rank: rank(attendee, q) }))
    .filter((r) => r.rank > 0)
    .sort((x, y) => y.rank - x.rank || byName(x.attendee, y.attendee))
    .map((r) => r.attendee);
}
