"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  assignGuestsToEventAction,
  removeGuestsFromEventAction,
} from "@/app/actions/admin-guest-events";
import { DataTable, useTableParams, type Column } from "../../data-table";

export type GuestRow = {
  id: string;
  name: string;
  email: string;
  assigned: boolean;
};

export type GuestFilter = "all" | "assigned" | "not-assigned";

const FILTERS: { value: GuestFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "not-assigned", label: "Not assigned" },
];

export function EventGuestsManager({
  guests,
  eventId,
  total,
  page,
  pageSize,
  query,
  filter,
}: {
  guests: GuestRow[];
  eventId: string;
  total: number;
  page: number;
  pageSize: number;
  query: string;
  filter: GuestFilter;
}) {
  const router = useRouter();
  const { setParams } = useTableParams();
  // Tracks which guest IDs have a pending toggle so we can disable the checkbox.
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleToggle = (guestId: string, currentlyAssigned: boolean) => {
    setPendingIds((prev) => new Set([...prev, guestId]));
    setError(null);

    startTransition(async () => {
      const action = currentlyAssigned
        ? removeGuestsFromEventAction
        : assignGuestsToEventAction;
      try {
        const result = await action({ eventId, guestIds: [guestId] });
        if (!result.ok) {
          setError(result.error);
        } else {
          router.refresh();
        }
      } catch {
        setError("Request failed");
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(guestId);
          return next;
        });
      }
    });
  };

  const assignedCheckbox = (g: GuestRow) => (
    <input
      type="checkbox"
      checked={g.assigned}
      disabled={pendingIds.has(g.id)}
      aria-label={`Assign ${g.name}`}
      onChange={() => handleToggle(g.id, g.assigned)}
      className="h-4 w-4 cursor-pointer"
    />
  );

  const columns: Column<GuestRow>[] = [
    { header: "Name", cell: (g) => g.name },
    { header: "Email", cell: (g) => g.email, cellClassName: "text-gray-500" },
    { header: "Assigned", cell: assignedCheckbox },
  ];

  const toolbar = (
    <div className="flex gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() =>
            setParams({
              filter: f.value === "all" ? null : f.value,
              page: null,
            })
          }
          className={`px-3 py-1 text-sm rounded-md border ${
            filter === f.value
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  return (
    <section aria-label="Guests" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Guests</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <DataTable
        rows={guests}
        columns={columns}
        rowKey={(g) => g.id}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={query}
        searchPlaceholder="Search name or email…"
        toolbar={toolbar}
        emptyMessage="No users match."
        mobileCard={(g) => (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900">{g.name}</p>
              <p className="truncate text-gray-500">{g.email}</p>
            </div>
            {assignedCheckbox(g)}
          </div>
        )}
      />
    </section>
  );
}
