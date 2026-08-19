"use client";

import Link from "next/link";
import { DataTable } from "@/app/admin/data-table";
import { Avatar } from "@/app/(site)/guests/avatar";
import {
  AttendeeCard,
  DirectoryView,
  PAGE_SIZE,
} from "@/app/(site)/guests/directory-view";
import { openProfileLink } from "@/app/(site)/guests/profile-nav";
import { ATTENDEE_SORTS, DEFAULT_ATTENDEE_SORT } from "@/utils/attendee-search";
import {
  ATTENDEE_FILTERS,
  serializeAttendeeFilters,
} from "@/utils/attendee-filters";

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
  listQuery,
}: {
  attendee: AttendeeCard;
  listQuery: string;
}) {
  // Sorting by recency with no visible dates would be opaque. Narrow screens
  // have no room for it beside the name, so it rides along under the name
  // there and only moves out to the right edge from sm up.
  const updated = profileUpdated && (
    <span className="text-xs text-fg-subtle">updated {profileUpdated}</span>
  );
  return (
    <Link
      {...openProfileLink(id, listQuery)}
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

export function AttendeeList({
  view,
  canEditProfile,
}: {
  view: DirectoryView;
  canEditProfile: boolean;
}) {
  const { query, filters, sort, rows, page, total, listQuery, setParams } =
    view;
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
        listItem={(u) => <AttendeeRow attendee={u} listQuery={listQuery} />}
      />
    </div>
  );
}
