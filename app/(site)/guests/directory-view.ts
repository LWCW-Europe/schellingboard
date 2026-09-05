"use client";

import { useMemo } from "react";
import type { Attendee } from "@/db/repositories/interfaces";
import { useTableParams } from "@/app/admin/data-table";
import {
  ATTENDEE_SORTS,
  AttendeeSort,
  DEFAULT_ATTENDEE_SORT,
  searchAttendees,
} from "@/utils/attendee-search";
import { AttendeeFilter, parseAttendeeFilters } from "@/utils/attendee-filters";
import { hasFilledProfile, profileExcerpt } from "@/utils/attendee-profile";
import { formatRelativeTime } from "@/utils/relative-time";

// Everyone on one page: reading through who is coming is what the directory is
// for, and at realistic attendee counts (a few hundred) a pager only gets in
// the way. Above this it falls back to ordinary pagination.
export const PAGE_SIZE = 1000;

/** An attendee plus what the list derives from them once, up front. */
export type AttendeeCard = Attendee & {
  hasProfile: boolean;
  excerpt: string | null;
  profileUpdated: string | null;
};

export type DirectoryView = ReturnType<typeof useDirectoryView>;

/**
 * What the directory is showing: the active search/filter/sort read off the
 * URL, applied in the browser. The list renders `rows` and the profile modal
 * traverses `matches`, so both agree on what "next" means without either
 * owning the other's state.
 *
 * `now` comes from the server so the relative update times match what was
 * server-rendered, and so the dev fake clock applies.
 */
export function useDirectoryView(attendees: Attendee[], now: Date) {
  const { searchParams, setParams } = useTableParams({ shallow: true });

  const query = (searchParams.get("q") ?? "").trim();
  const filterParam = searchParams.get("filter") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: AttendeeSort =
    ATTENDEE_SORTS.find((s) => s.value === sortParam)?.value ??
    DEFAULT_ATTENDEE_SORT;
  const filters: AttendeeFilter[] = useMemo(
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

  // The canonical ordering, for a profile opened with no list context behind
  // it — or one that the active filters exclude.
  const everyone = useMemo(() => searchAttendees(cards, ""), [cards]);

  const matches = useMemo(() => {
    const scoped = cards.filter(
      (card) =>
        (!filters.includes("isHost") || card.isHost) &&
        (!filters.includes("hasProfile") || card.hasProfile) &&
        (!filters.includes("meetingsOn") || card.meetingsOn)
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

  return {
    query,
    filters,
    sort,
    everyone,
    matches,
    rows,
    page,
    total,
    // The view as a query string, carried onto a profile's URL so closing it —
    // or reloading, or sharing it — comes back to the same list.
    listQuery: searchParams.toString(),
    setParams,
  };
}
