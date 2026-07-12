"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/app/input";
import type { Event } from "@/db/repositories/interfaces";
import { createEventAction, type EventInput } from "@/app/actions/admin-events";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/app/admin/buttons";
import { TimezoneSelect } from "@/app/admin/timezone-select";
import { MarkdownHint } from "@/app/(site)/markdown";

// Event start/end are date-only values stored as UTC midnight; format them in
// UTC so browsers west of Greenwich don't show the previous day.
function formatEventDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

const DEFAULT_FORM: EventInput = {
  name: "",
  description: "",
  website: "",
  start: "",
  end: "",
  timezone: "UTC",
  maxSessionDuration: "60",
  breakMinutes: "10",
  slotIncrementMinutes: "30",
};

function AddEventForm({
  onError,
}: {
  onError: (error: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EventInput>(DEFAULT_FORM);
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof EventInput, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createEventAction(form);
      if (!result.ok) {
        onError(result.error);
      } else {
        onError(null);
        setForm(DEFAULT_FORM);
        setOpen(false);
      }
    });
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={PRIMARY_BUTTON}>
        New event
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border border-gray-200 rounded-md p-4 max-w-2xl"
    >
      <h2 className="font-medium text-gray-900">New event</h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="ev-name" className="text-sm text-gray-600">
          Name *
        </label>
        <Input
          id="ev-name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
          className="w-full h-10"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="ev-description" className="text-sm text-gray-600">
          Description
        </label>
        <textarea
          id="ev-description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <MarkdownHint />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="ev-website" className="text-sm text-gray-600">
          Website
        </label>
        <Input
          id="ev-website"
          value={form.website}
          onChange={(e) => set("website", e.target.value)}
          className="w-full h-10"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-start" className="text-sm text-gray-600">
            Start *
          </label>
          <Input
            id="ev-start"
            type="date"
            value={form.start}
            onChange={(e) => set("start", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-end" className="text-sm text-gray-600">
            End *
          </label>
          <Input
            id="ev-end"
            type="date"
            value={form.end}
            onChange={(e) => set("end", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-timezone" className="text-sm text-gray-600">
            Timezone *
          </label>
          <TimezoneSelect
            id="ev-timezone"
            value={form.timezone}
            onChange={(v) => set("timezone", v)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-duration" className="text-sm text-gray-600">
            Max session duration (min)
          </label>
          <Input
            id="ev-duration"
            type="number"
            min="1"
            value={form.maxSessionDuration}
            onChange={(e) => set("maxSessionDuration", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
          {isPending ? "Creating..." : "Create event"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onError(null);
          }}
          disabled={isPending}
          className={SECONDARY_BUTTON}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function EventsManager({ events }: { events: Event[] }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <AddEventForm onError={setError} />

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">No events yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {events.map((event) => (
            <li
              key={event.id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {event.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatEventDate(event.start)} – {formatEventDate(event.end)}
                  {" · "}
                  {event.timezone}
                </p>
              </div>
              <Link
                href={`/admin/events/${event.id}`}
                className={SECONDARY_BUTTON}
              >
                Manage
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
