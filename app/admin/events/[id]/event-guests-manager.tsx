"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  assignGuestsToEventAction,
  removeGuestsFromEventAction,
} from "@/app/actions/admin-guest-events";

export type GuestRow = {
  id: string;
  name: string;
  email: string;
  assigned: boolean;
};

type Filter = "all" | "assigned" | "not-assigned";

const FILTER_LABEL: Record<Filter, string> = {
  all: "All",
  assigned: "Assigned",
  "not-assigned": "Not assigned",
};

export function EventGuestsManager({
  guests,
  eventId,
}: {
  guests: GuestRow[];
  eventId: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
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

  const visible = guests.filter((g) => {
    if (filter === "assigned") return g.assigned;
    if (filter === "not-assigned") return !g.assigned;
    return true;
  });

  return (
    <section aria-label="Guests" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Guests</h2>
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

      {guests.length === 0 ? (
        <p className="text-sm text-gray-500">No users yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 font-medium">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((g) => (
              <tr key={g.id} className="border-b border-gray-100">
                <td className="py-2 pr-4">{g.name}</td>
                <td className="py-2 pr-4 text-gray-500">{g.email}</td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={g.assigned}
                    disabled={pendingIds.has(g.id)}
                    aria-label={`Assign ${g.name}`}
                    onChange={() => handleToggle(g.id, g.assigned)}
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
