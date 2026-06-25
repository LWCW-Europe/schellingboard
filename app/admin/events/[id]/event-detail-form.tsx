"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/input";
import type { Event } from "@/db/repositories/interfaces";
import {
  updateEventAction,
  deleteEventAction,
  type EventInput,
} from "@/app/actions/admin-events";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  DANGER_BUTTON,
} from "@/app/admin/buttons";

function toDateInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

// useSyncExternalStore compares snapshots with Object.is, so each getter must
// return a stable reference — otherwise it re-renders forever (React #185).
const EMPTY_TIMEZONES: string[] = [];
let cachedTimezones: string[] | null = null;
function getClientTimezones(): string[] {
  if (cachedTimezones === null) {
    cachedTimezones = Intl.supportedValuesOf("timeZone");
  }
  return cachedTimezones;
}
function getServerTimezones(): string[] {
  return EMPTY_TIMEZONES;
}
const subscribeTimezones = () => () => {};

export function EventDetailForm({ event }: { event: Event }) {
  const router = useRouter();
  const [form, setForm] = useState<EventInput>({
    name: event.name,
    description: event.description,
    website: event.website,
    start: toDateInputValue(event.start),
    end: toDateInputValue(event.end),
    timezone: event.timezone,
    maxSessionDuration: String(event.maxSessionDuration),
    breakMinutes: String(event.breakMinutes),
    icon: event.icon ?? "",
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, startSave] = useTransition();

  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, startDelete] = useTransition();
  const timezones = useSyncExternalStore(
    subscribeTimezones,
    getClientTimezones,
    getServerTimezones
  );

  const set = (key: keyof EventInput, value: string) => {
    setSaveSuccess(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    startSave(async () => {
      const result = await updateEventAction({ id: event.id, ...form });
      if (!result.ok) {
        setSaveError(result.error);
      } else {
        setSaveSuccess(true);
      }
    });
  };

  const handleDelete = () => {
    startDelete(async () => {
      const result = await deleteEventAction({ id: event.id });
      if (!result.ok) {
        setSaveError(result.error);
      } else {
        router.push("/admin/events");
      }
    });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>
        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
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
          <Input
            id="ev-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full h-10"
          />
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
            <Input
              id="ev-timezone"
              list="timezones"
              value={form.timezone}
              onChange={(e) => set("timezone", e.target.value)}
              required
              className="w-full h-10"
            />
            <datalist id="timezones">
              {timezones.map((tz) => (
                <option key={tz} value={tz} />
              ))}
            </datalist>
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
          <div className="flex flex-col gap-1">
            <label htmlFor="ev-break" className="text-sm text-gray-600">
              Break before each session (min)
            </label>
            <Input
              id="ev-break"
              type="number"
              min="0"
              value={form.breakMinutes}
              onChange={(e) => set("breakMinutes", e.target.value)}
              required
              className="w-full h-10"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-icon" className="text-sm text-gray-600">
            Icon
          </label>
          <Input
            id="ev-icon"
            value={form.icon ?? ""}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="e.g. AcademicCapIcon"
            className="w-full h-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          {saveSuccess && (
            <span className="text-sm text-green-600">Saved!</span>
          )}
        </div>
      </form>

      <section
        aria-label="Danger zone"
        className="border-t border-red-200 pt-6 space-y-3"
      >
        <h2 className="text-lg font-semibold text-red-700">Danger zone</h2>
        {!deleteMode ? (
          <button onClick={() => setDeleteMode(true)} className={DANGER_BUTTON}>
            Delete event
          </button>
        ) : (
          <div className="space-y-3 rounded-md border border-red-200 p-4">
            <p className="text-sm text-red-700">
              This will permanently delete the event and all associated days,
              proposals, sessions, RSVPs, and assignments.
            </p>
            <div className="flex flex-col gap-1">
              <label htmlFor="delete-confirm" className="text-sm text-gray-700">
                Type the event name to confirm
              </label>
              <Input
                id="delete-confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={event.name}
                className="w-full h-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirm !== event.name}
                className={DANGER_BUTTON}
              >
                {isDeleting ? "Deleting..." : "Confirm delete"}
              </button>
              <button
                onClick={() => {
                  setDeleteMode(false);
                  setDeleteConfirm("");
                }}
                disabled={isDeleting}
                className={SECONDARY_BUTTON}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
