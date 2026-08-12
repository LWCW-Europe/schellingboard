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

export const ATTENDEE_SORTS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "updated", label: "Recently updated" },
] as const;

export type AttendeeSort = (typeof ATTENDEE_SORTS)[number]["value"];

export const DEFAULT_ATTENDEE_SORT: AttendeeSort = "name";

/**
 * In-memory search over the full attendee list. Case-insensitive substring
 * matching, ranked by tier (name > declared language > free text), ties by
 * name. An empty query returns everyone in `sort` order. Pagination is the
 * caller's job (slice the result).
 *
 * A query overrides `sort`: relevance ranking is the more useful answer to a
 * search, and an explicit sort would discard it.
 */
export function searchAttendees<A extends Attendee>(
  attendees: A[],
  query: string,
  sort: AttendeeSort = DEFAULT_ATTENDEE_SORT
): A[] {
  const byName = (a: A, b: A) =>
    a.name.localeCompare(b.name) || a.id.localeCompare(b.id);

  // Profiles never updated have no place on a recency axis, so they keep the
  // default ordering at the end of the list rather than at an arbitrary date.
  const byRecency = (a: A, b: A) => {
    const at = a.profileUpdatedAt?.getTime() ?? null;
    const bt = b.profileUpdatedAt?.getTime() ?? null;
    if (at === bt) return byName(a, b);
    if (at === null) return 1;
    if (bt === null) return -1;
    return bt - at;
  };

  const q = query.trim();
  if (!q) return [...attendees].sort(sort === "updated" ? byRecency : byName);

  return attendees
    .map((attendee) => ({ attendee, rank: rank(attendee, q) }))
    .filter((r) => r.rank > 0)
    .sort((x, y) => y.rank - x.rank || byName(x.attendee, y.attendee))
    .map((r) => r.attendee);
}
