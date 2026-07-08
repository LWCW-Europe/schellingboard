"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  assignLocationsToEventAction,
  removeLocationsFromEventAction,
} from "@/app/actions/admin-location-events";
import {
  BulkActionsBar,
  DataTable,
  useTableParams,
  type Column,
  type Selection,
} from "../../data-table";

export type LocationRow = {
  id: string;
  name: string;
  capacity: number;
  assigned: boolean;
};

export type LocationFilter = "all" | "assigned" | "not-assigned";

const FILTERS: { value: LocationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "not-assigned", label: "Not assigned" },
];

export function EventLocationsManager({
  locations,
  eventId,
  total,
  page,
  pageSize,
  query,
  filter,
}: {
  locations: LocationRow[];
  eventId: string;
  total: number;
  page: number;
  pageSize: number;
  query: string;
  filter: LocationFilter;
}) {
  const router = useRouter();
  const { setParams } = useTableParams();
  // Tracks which location IDs have a pending toggle so we can disable the box.
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  // Rows selected for bulk assign/remove. Persists across pages of the same
  // list, but is reset when the search/filter changes so a bulk action can
  // never hit rows that are no longer visible under the new criteria.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const listKey = `${eventId} ${query} ${filter}`;
  const [prevListKey, setPrevListKey] = useState(listKey);
  if (listKey !== prevListKey) {
    setPrevListKey(listKey);
    setSelectedIds(new Set());
  }
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleRow = (locationId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(locationId)) next.delete(locationId);
      else next.add(locationId);
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
    const locationIds = [...selectedIds];
    if (locationIds.length === 0) return;
    setError(null);

    startTransition(async () => {
      const action = assign
        ? assignLocationsToEventAction
        : removeLocationsFromEventAction;
      try {
        const result = await action({ eventId, locationIds });
        if (!result.ok) {
          setError(result.error);
        } else {
          setSelectedIds(new Set());
          router.refresh();
        }
      } catch {
        setError("Request failed");
      }
    });
  };

  const selection: Selection<LocationRow> = {
    selectedKeys: selectedIds,
    onToggleRow: toggleRow,
    onToggleAllOnPage: toggleAllOnPage,
    rowLabel: (l) => l.name,
  };

  const bulkBar = (
    <BulkActionsBar
      selectedCount={selectedIds.size}
      isPending={isPending}
      onAssign={() => handleBulk(true)}
      onRemove={() => handleBulk(false)}
      onClear={() => setSelectedIds(new Set())}
    />
  );

  const handleToggle = (locationId: string, currentlyAssigned: boolean) => {
    setPendingIds((prev) => new Set([...prev, locationId]));
    setError(null);

    startTransition(async () => {
      const action = currentlyAssigned
        ? removeLocationsFromEventAction
        : assignLocationsToEventAction;
      try {
        const result = await action({ eventId, locationIds: [locationId] });
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
          next.delete(locationId);
          return next;
        });
      }
    });
  };

  const assignedCheckbox = (l: LocationRow) => (
    <input
      type="checkbox"
      checked={l.assigned}
      disabled={pendingIds.has(l.id) || isPending}
      aria-label={`Assign ${l.name}`}
      onChange={() => handleToggle(l.id, l.assigned)}
      className="h-4 w-4 cursor-pointer"
    />
  );

  const columns: Column<LocationRow>[] = [
    { header: "Name", cell: (l) => l.name },
    {
      header: "Capacity",
      cell: (l) => l.capacity,
      cellClassName: "text-gray-500",
    },
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
    <section aria-label="Locations" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <DataTable
        rows={locations}
        columns={columns}
        rowKey={(l) => l.id}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={query}
        searchPlaceholder="Search name…"
        toolbar={toolbar}
        bulkBar={bulkBar}
        selection={selection}
        emptyMessage="No locations match."
        mobileCard={(l) => (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900">{l.name}</p>
              <p className="text-gray-500">Capacity: {l.capacity}</p>
            </div>
            {assignedCheckbox(l)}
          </div>
        )}
      />
    </section>
  );
}
