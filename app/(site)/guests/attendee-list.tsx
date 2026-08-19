"use client";

import { Attendee } from "@/db/repositories/interfaces";
import { DataTable, useTableParams } from "@/app/admin/data-table";
import Link from "next/link";
import { Avatar } from "@/app/(site)/guests/avatar";
import {
  ATTENDEE_SORTS,
  AttendeeSort,
  DEFAULT_ATTENDEE_SORT,
} from "@/utils/attendee-search";
import { Markdown } from "@/app/(site)/markdown";

// Rows are serialized into the page payload, so only the fields the row
// actually renders may cross the server/client boundary — never the full
// profile (contacts, prompts, …).
export type AttendeeRowData = Pick<
  Attendee,
  "id" | "name" | "avatarUrl" | "pronouns" | "basedIn" | "isHost" | "aboutMe"
> & {
  // Already rendered ("3 days ago"), not a date: see the note in page.tsx.
  profileUpdated: string | null;
};

function AttendeeRow({
  attendee: {
    id,
    avatarUrl,
    name,
    aboutMe,
    pronouns,
    basedIn,
    isHost,
    profileUpdated,
  },
  listQueryString,
}: {
  attendee: AttendeeRowData;
  listQueryString: string;
}) {
  // Fixed row shape (avatar, name, pronouns, based-in) so the list stays
  // consistent regardless of which optional profile fields are filled in.
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
      className="flex items-center gap-4 hover:bg-surface-sunken rounded-xl border border-line p-4"
    >
      <Avatar name={name} size="sm" image={avatarUrl ?? undefined} />
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
          <span className="flex flex-wrap text-sm items-baseline gap-x-2 gap-y-1">
            {(pronouns || basedIn) && (
              <span className="text-sm text-fg-subtle line-clamp-1">
                {[pronouns, basedIn].filter(Boolean).join(" · ")}
              </span>
            )}
            <span className="sm:hidden">{updated}</span>
          </span>
        )}
        {aboutMe && (
          <div className="text-fg text-sm line-clamp-2">
            <Markdown>{aboutMe}</Markdown>
          </div>
        )}
      </div>
      {updated && (
        <span className="hidden shrink-0 self-start sm:block">{updated}</span>
      )}
    </Link>
  );
}

export function AttendeeList(props: {
  rows: AttendeeRowData[];
  total: number;
  page: number;
  pageSize: number;
  searchQuery: string;
  filter?: string;
  filters: { value: string; label: string }[];
  sort: AttendeeSort;
}) {
  const { searchParams, setParams } = useTableParams();
  // The raw query string (no leading "/guests?"), forwarded as `from` on
  // each row link so the profile page can rebuild "/guests?<from>".
  const listQueryString = searchParams.toString();
  // A search is ranked by relevance, which an explicit sort would throw away.
  const sortDisabled = props.searchQuery !== "";
  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      {props.filters.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => {
            setParams({
              filter: props.filter === f.value ? null : f.value,
              page: null,
            });
          }}
          className={`text-sm px-3 py-2 rounded-md transition-colors inline-flex items-center gap-2 ${
            props.filter === f.value
              ? "bg-info text-on-info hover:bg-info-hover"
              : "bg-surface-muted text-fg-muted hover:bg-surface-hover"
          }`}
          aria-pressed={props.filter === f.value}
          aria-label={`Filter by ${f.label}${props.filter === f.value ? " (active)" : ""}`}
        >
          {f.label}
          {props.filter === f.value && (
            <span className="bg-info-hover text-on-info text-xs px-1.5 py-0.5 rounded-full">
              {props.total}
            </span>
          )}
        </button>
      ))}
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
          value={props.sort}
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
    </div>
  );
  return (
    <div className="pb-8">
      <DataTable
        toolbar={toolbar}
        rows={props.rows}
        rowKey={(u) => u.id}
        total={props.total}
        page={props.page}
        pageSize={props.pageSize}
        searchQuery={props.searchQuery}
        searchPlaceholder="Search names, languages, interests…"
        emptyMessage="No attendees match."
        listItem={(u) => (
          <AttendeeRow attendee={u} listQueryString={listQueryString} />
        )}
        style={{ separator: false }}
      />
    </div>
  );
}
