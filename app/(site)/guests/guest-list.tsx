"use client";

import { Guest } from "@/db/repositories/interfaces";
import { DataTable } from "@/app/admin/data-table";
import Link from "next/link";
import { Avatar } from "@/app/(site)/guests/avatar";

function GuestRow({
  guest: { id, avatarUrl, name, aboutMe },
}: {
  guest: Guest;
}) {
  return (
    <Link
      href={`/guests/${id}`}
      className="flex items-center gap-4 hover:bg-gray-50 rounded-md px-2"
    >
      <Avatar name={name} size="sm" image={avatarUrl ?? undefined} />
      <div className="flex flex-col gap-1">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-sm text-gray-500 line-clamp-1">{aboutMe}</span>
      </div>
    </Link>
  );
}

export function GuestList(props: {
  rows: Guest[];
  total: number;
  page: number;
  pageSize: number;
  searchQuery: string;
}) {
  return (
    <div className="pb-8">
      <DataTable
        rows={props.rows}
        rowKey={(u) => u.id}
        total={props.total}
        page={props.page}
        pageSize={props.pageSize}
        searchQuery={props.searchQuery}
        searchPlaceholder="Search attendees…"
        emptyMessage="No attendees match."
        listItem={(u) => <GuestRow guest={u} />}
      />
    </div>
  );
}
