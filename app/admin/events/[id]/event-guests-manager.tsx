"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  assignGuestsToEventAction,
  removeGuestsFromEventAction,
} from "@/app/actions/admin-guest-events";
import {
  DataTable,
  useTableParams,
  type Column,
  type Selection,
} from "../../data-table";

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
  // Rows selected for bulk assign/remove (persists across pages until applied).
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleRow = (guestId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(guestId)) next.delete(guestId);
      else next.add(guestId);
      return next;
    });
  };

  const toggleAllOnPage = (pageKeys: string[], shouldSelectAll: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const key of pageKeys) {
        if (shouldSelectAll) next.add(key);
        else next.delete(key);
      }
      return next;
    });
  };

  const handleBulk = (assign: boolean) => {
    const guestIds = [...selectedIds];
    if (guestIds.length === 0) return;
    setError(null);

    startTransition(async () => {
      const action = assign
        ? assignGuestsToEventAction
        : removeGuestsFromEventAction;
      const result = await action({ eventId, guestIds });
      if (!result.ok) {
        setError(result.error);
      } else {
        setSelectedIds(new Set());
        router.refresh();
      }
    });
  };

  const selection: Selection<GuestRow> = {
    selectedKeys: selectedIds,
    onToggleRow: toggleRow,
    onToggleAllOnPage: toggleAllOnPage,
    rowLabel: (g) => g.name,
  };

  const bulkBar =
    selectedIds.size === 0 ? null : (
      <div
        role="region"
        aria-label="Bulk actions"
        className="flex flex-wrap items-center gap-3 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
      >
        <span className="font-medium text-gray-700">
          {selectedIds.size} selected
        </span>
        <button
          type="button"
          onClick={() => handleBulk(true)}
          disabled={isPending}
          className="px-3 py-1 rounded-md border border-gray-900 bg-gray-900 text-white disabled:opacity-50 hover:bg-gray-700"
        >
          Assign selected
        </button>
        <button
          type="button"
          onClick={() => handleBulk(false)}
          disabled={isPending}
          className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
        >
          Remove selected
        </button>
        <button
          type="button"
          onClick={() => setSelectedIds(new Set())}
          className="px-3 py-1 rounded-md text-gray-600 hover:text-gray-900"
        >
          Clear
        </button>
      </div>
    );

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
        bulkBar={bulkBar}
        selection={selection}
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
