"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Attendee } from "@/db/repositories/interfaces";
import { DataTable, useTableParams } from "@/app/admin/data-table";
import { Avatar } from "@/app/(site)/guests/avatar";
import {
  ATTENDEE_SORTS,
  AttendeeSort,
  DEFAULT_ATTENDEE_SORT,
  searchAttendees,
} from "@/utils/attendee-search";
import {
  ATTENDEE_FILTERS,
  parseAttendeeFilters,
  serializeAttendeeFilters,
} from "@/utils/attendee-filters";
import { hasFilledProfile, profileExcerpt } from "@/utils/attendee-profile";
import { formatRelativeTime } from "@/utils/relative-time";

// Everyone on one page: reading through who is coming is what the directory is
// for, and at realistic attendee counts (a few hundred) a pager only gets in
// the way. Above this it falls back to ordinary pagination.
const PAGE_SIZE = 1000;

/** An attendee plus what the list derives from them once, up front. */
type AttendeeCard = Attendee & {
  hasProfile: boolean;
  excerpt: string | null;
  profileUpdated: string | null;
};

function AttendeeRow({
  attendee: {
    id,
    avatarUrl,
    name,
    pronouns,
    basedIn,
    isHost,
    excerpt,
    profileUpdated,
  },
  listQueryString,
}: {
  attendee: AttendeeCard;
  listQueryString: string;
}) {
  const href = listQueryString
    ? // Carries the list's current page/search/filter so the profile page's
      // "Back to attendees" link can return to the same view instead of
      // always resetting to page 1.
      `/guests/${id}?from=${encodeURIComponent(listQueryString)}`
    : `/guests/${id}`;
  // Sorting by recency with no visible dates would be opaque. Narrow screens
  // have no room for it beside the name, so it rides along under the name
  // there and only moves out to the right edge from sm up.
  const updated = profileUpdated && (
    <span className="text-xs text-fg-subtle">updated {profileUpdated}</span>
  );
  return (
    <Link
      href={href}
      className="flex items-start gap-4 hover:bg-surface-sunken rounded-md px-2 py-1"
    >
      <Avatar name={name} size="md" image={avatarUrl ?? undefined} />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Wraps rather than squeezing the name to fit the badge beside it. */}
        <span className="font-medium text-fg flex flex-wrap items-center gap-x-2 gap-y-1">
          {name}
          {isHost && (
            <span className="w-fit rounded-full bg-brand-tint-hover text-brand-fg text-xs font-semibold px-3 py-1">
              Session host
            </span>
          )}
        </span>
        {(pronouns || basedIn || updated) && (
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {(pronouns || basedIn) && (
              <span className="text-sm text-fg-subtle line-clamp-1">
                {[pronouns, basedIn].filter(Boolean).join(" · ")}
              </span>
            )}
            <span className="sm:hidden">{updated}</span>
          </span>
        )}
        {excerpt && (
          <span className="text-sm text-fg-muted line-clamp-2">{excerpt}</span>
        )}
      </div>
      {updated && (
        <span className="hidden shrink-0 self-start sm:block">{updated}</span>
      )}
    </Link>
  );
}

/**
 * The attendee directory. Holds every attendee and does search, filtering,
 * sorting and paging in the browser: the whole point of the directory is
 * reading through it, and a server round trip per toggle would throw away the
 * reader's place in the list each time.
 *
 * `now` comes from the server so the relative update times match what was
 * server-rendered, and so the dev fake clock applies.
 */
export function AttendeeList({
  attendees,
  now,
  canEditProfile,
}: {
  attendees: Attendee[];
  now: Date;
  canEditProfile: boolean;
}) {
  const { searchParams, setParams } = useTableParams({ shallow: true });

  const query = (searchParams.get("q") ?? "").trim();
  const filterParam = searchParams.get("filter") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: AttendeeSort =
    ATTENDEE_SORTS.find((s) => s.value === sortParam)?.value ??
    DEFAULT_ATTENDEE_SORT;
  const filters = useMemo(
    () => parseAttendeeFilters(filterParam),
    [filterParam]
  );

  // Fixed for the life of the page: keyed on the attendees so the markdown
  // parsing behind the excerpt isn't repeated on every filter or sort change.
  const cards: AttendeeCard[] = useMemo(
    () =>
      attendees.map((attendee) => ({
        ...attendee,
        hasProfile: hasFilledProfile(attendee),
        excerpt: profileExcerpt(attendee),
        profileUpdated: attendee.profileUpdatedAt
          ? formatRelativeTime(attendee.profileUpdatedAt, now)
          : null,
      })),
    [attendees, now]
  );

  const matches = useMemo(() => {
    const scoped = cards.filter(
      (card) =>
        (!filters.includes("isHost") || card.isHost) &&
        (!filters.includes("hasProfile") || card.hasProfile)
    );
    return searchAttendees(scoped, query, sort);
  }, [cards, filters, query, sort]);

  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // A stale or hand-edited `page` shows the last real page rather than an
  // empty list; nothing rewrites the URL, since at this page size the param
  // only ever appears when someone typed it.
  const requestedPage = Number(searchParams.get("page"));
  const page = Math.min(
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    totalPages
  );
  const rows = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // The raw query string (no leading "/guests?"), forwarded as `from` on
  // each row link so the profile page can rebuild "/guests?<from>".
  const listQueryString = searchParams.toString();
  // A search is ranked by relevance, which an explicit sort would throw away.
  const sortDisabled = query !== "";
  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      {ATTENDEE_FILTERS.map((f) => {
        const active = filters.includes(f.value);
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setParams({
                filter: serializeAttendeeFilters(
                  active
                    ? filters.filter((v) => v !== f.value)
                    : [...filters, f.value]
                ),
                page: null,
              });
            }}
            className={`text-sm px-3 py-2 rounded-md transition-colors ${
              active
                ? "bg-info text-on-info hover:bg-info-hover"
                : "bg-surface-muted text-fg-muted hover:bg-surface-hover"
            }`}
            aria-pressed={active}
            aria-label={`Filter by ${f.label}${active ? " (active)" : ""}`}
          >
            {f.label}
          </button>
        );
      })}
      <label
        className="flex items-center gap-2 text-sm text-fg-muted"
        // On the label, not the select: browsers suppress pointer events on a
        // disabled control, so a title there would never show a tooltip.
        title={
          sortDisabled ? "Search results are sorted by relevance" : undefined
        }
      >
        Sort by
        <select
          value={sort}
          disabled={sortDisabled}
          onChange={(e) => {
            setParams({
              sort:
                e.target.value === DEFAULT_ATTENDEE_SORT
                  ? null
                  : e.target.value,
              page: null,
            });
          }}
          // pr-9 clears the chevron the forms plugin paints in the right
          // padding; a plain px-2 would let the longest option run under it.
          className="pl-2 pr-9 py-1.5 text-sm rounded-md border border-line bg-surface-raised disabled:bg-surface-muted disabled:text-fg-subtle"
        >
          {ATTENDEE_SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      {/* With everyone on one page there is no pager to say how many there
          are, and a filter that quietly removes people needs a number. */}
      {total > 0 && (
        <span className="text-sm text-fg-subtle">
          {total} attendee{total === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
  // Nobody at all with a profile is a state the reader can fix, so it asks
  // rather than just reporting. A search or a second filter on top is the
  // likelier reason for an empty list — "no host has" is not "nobody has" —
  // and then the plain message is the honest one.
  const onlyHasProfile =
    filters.length === 1 && filters[0] === "hasProfile" && query === "";
  const emptyMessage = onlyHasProfile ? (
    <>
      Nobody has filled in a profile yet.
      {canEditProfile && (
        <>
          {" "}
          <Link
            href="/guests/edit"
            className="font-semibold text-brand-fg hover:text-brand-fg-hover"
          >
            Be the first!
          </Link>
        </>
      )}
    </>
  ) : (
    "No attendees match."
  );
  return (
    <div className="pb-8">
      <DataTable
        toolbar={toolbar}
        rows={rows}
        rowKey={(u) => u.id}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        searchQuery={query}
        searchPlaceholder="Search names, languages, interests…"
        emptyMessage={emptyMessage}
        paginationFooter="when-paginated"
        shallow
        listItem={(u) => (
          <AttendeeRow attendee={u} listQueryString={listQueryString} />
        )}
      />
    </div>
  );
}
