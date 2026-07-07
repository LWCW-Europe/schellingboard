"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { SelectHosts } from "@/app/select-hosts";
import {
  importGuestsAction,
  type ImportGuestsResult,
} from "@/app/actions/admin-guest-import";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "../../buttons";

type EventOption = { id: string; name: string };

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function UserImportForm({ events }: { events: EventOption[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<EventOption[]>([]);
  const [result, setResult] = useState<ImportGuestsResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    startTransition(async () => {
      const csvText = await file.text();
      setResult(
        await importGuestsAction({
          csvText,
          eventIds: selectedEvents.map((ev) => ev.id),
        })
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="import-csv-file" className="text-sm text-gray-600">
          CSV file
        </label>
        <input
          id="import-csv-file"
          type="file"
          accept=".csv,text/csv"
          required
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setResult(null);
          }}
          className="text-sm text-gray-700 file:mr-3 file:px-3 file:py-2 file:text-sm file:font-medium file:rounded-md file:border-0 file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="import-events" className="text-sm text-gray-600">
          Assign to events
        </label>
        <SelectHosts
          guests={events}
          hosts={selectedEvents}
          setHosts={setSelectedEvents}
          id="import-events"
          selectMany
        />
      </div>

      {result && !result.ok && (
        <div role="alert" className="text-sm text-red-600 space-y-1">
          <p>{result.error}</p>
          {result.lineErrors && (
            <ul className="list-disc pl-5">
              {result.lineErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {result?.ok && (
        <p role="status" className="text-sm text-green-700">
          {plural(result.created, "user")} created,{" "}
          {plural(result.existing, "user")} already existed (skipped, but still
          assigned to the selected events).
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !file}
          className={PRIMARY_BUTTON}
        >
          {isPending ? "Importing..." : "Import"}
        </button>
        <Link href="/admin/users" className={SECONDARY_BUTTON}>
          Back to users
        </Link>
      </div>
    </form>
  );
}
