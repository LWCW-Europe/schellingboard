"use client";

import { Participant } from "@/db/repositories/interfaces";
import { DataTable, useTableParams } from "@/app/admin/data-table";
import Link from "next/link";
import { Avatar } from "@/app/(site)/guests/avatar";
import { stripMarkdown } from "@/utils/markdown";

function ParticipantRow({
  participant: { id, avatarUrl, name, aboutMe, isHost },
}: {
  participant: Participant;
}) {
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
        <span className="text-sm text-gray-500 line-clamp-1">
          {stripMarkdown(aboutMe)}
        </span>
      </div>
    </Link>
  );
}

export function ParticipantList(props: {
  rows: Participant[];
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
        searchPlaceholder="Search attendees…"
        emptyMessage="No attendees match."
        listItem={(u) => <ParticipantRow participant={u} />}
      />
    </div>
  );
}
