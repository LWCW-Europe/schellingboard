"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  assignLocationsToEventAction,
  removeLocationsFromEventAction,
} from "@/app/actions/admin-location-events";

export type LocationRow = {
  id: string;
  name: string;
  capacity: number;
  assigned: boolean;
};

type Filter = "all" | "assigned" | "not-assigned";

const FILTER_LABEL: Record<Filter, string> = {
  all: "All",
  assigned: "Assigned",
  "not-assigned": "Not assigned",
};

export function EventLocationsManager({
  locations,
  eventId,
}: {
  locations: LocationRow[];
  eventId: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  // Tracks which location IDs have a pending toggle so we can disable the box.
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleToggle = (locationId: string, currentlyAssigned: boolean) => {
    setPendingIds((prev) => new Set([...prev, locationId]));
    setError(null);

    startTransition(async () => {
      const action = currentlyAssigned
        ? removeLocationsFromEventAction
        : assignLocationsToEventAction;
      const result = await action({ eventId, locationIds: [locationId] });
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(locationId);
        return next;
      });
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const visible = locations.filter((l) => {
    if (filter === "assigned") return l.assigned;
    if (filter === "not-assigned") return !l.assigned;
    return true;
  });

  return (
    <section aria-label="Locations" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        {(["all", "assigned", "not-assigned"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded-md border ${
              filter === f
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {FILTER_LABEL[f]}
          </button>
        ))}
      </div>

      {locations.length === 0 ? (
        <p className="text-sm text-gray-500">No locations yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Capacity</th>
              <th className="py-2 font-medium">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => (
              <tr key={l.id} className="border-b border-gray-100">
                <td className="py-2 pr-4">{l.name}</td>
                <td className="py-2 pr-4 text-gray-500">{l.capacity}</td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={l.assigned}
                    disabled={pendingIds.has(l.id)}
                    aria-label={`Assign ${l.name}`}
                    onChange={() => handleToggle(l.id, l.assigned)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
