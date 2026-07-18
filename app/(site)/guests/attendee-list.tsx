"use client";

import { Attendee } from "@/db/repositories/interfaces";
import { DataTable, useTableParams } from "@/app/admin/data-table";
import Link from "next/link";
import { Avatar } from "@/app/(site)/guests/avatar";

// Rows are serialized into the page payload, so only the fields the row
// actually renders may cross the server/client boundary — never the full
// profile (contacts, prompts, …).
export type AttendeeRowData = Pick<
  Attendee,
  "id" | "name" | "avatarUrl" | "pronouns" | "basedIn" | "isHost"
>;

function AttendeeRow({
  attendee: { id, avatarUrl, name, pronouns, basedIn, isHost },
}: {
  attendee: AttendeeRowData;
}) {
  // Fixed row shape (avatar, name, pronouns, based-in) so the list stays
  // consistent regardless of which optional profile fields are filled in.
  return (
    <Link
      href={`/guests/${id}`}
      className="flex items-center gap-4 hover:bg-gray-50 rounded-md px-2"
    >
      <Avatar name={name} size="sm" image={avatarUrl ?? undefined} />
      <div className="flex flex-col gap-1">
        <span className="font-medium text-gray-900 flex flex-row gap-2">
          {name}
          {isHost && (
            <span className="w-fit rounded-full bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1">
              Session host
            </span>
          )}
        </span>
        {(pronouns || basedIn) && (
          <span className="text-sm text-gray-500 line-clamp-1">
            {[pronouns, basedIn].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
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
}) {
  const { setParams } = useTableParams();
  const toolbar = (
    <div className="flex gap-2">
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
          className={`text-sm text-white px-3 py-2 rounded-md transition-colors inline-flex items-center gap-2 ${
            props.filter === f.value
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
          aria-pressed={props.filter === f.value}
          aria-label={`Filter by ${f.label}${props.filter === f.value ? " (active)" : ""}`}
        >
          {f.label}
          {props.filter === f.value && (
            <span className="bg-blue-800 text-white text-xs px-1.5 py-0.5 rounded-full">
              {props.total}
            </span>
          )}
        </button>
      ))}
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
        listItem={(u) => <AttendeeRow attendee={u} />}
      />
    </div>
  );
}
