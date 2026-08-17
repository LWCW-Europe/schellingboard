"use client";

import { useState, useTransition } from "react";
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
import { TimezoneSelect } from "@/app/admin/timezone-select";
import { IconPicker } from "@/app/admin/icon-picker";
import { normalizeEventIconName } from "@/app/event-icons";
import { SLOT_INCREMENT_OPTIONS } from "@/utils/slots";
import { MarkdownHint } from "@/app/(site)/markdown";
import { MarkdownTextarea } from "@/app/components/markdown-textarea";

function toDateInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

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
    slotIncrementMinutes: String(event.slotIncrementMinutes),
    rsvpCapacityHardLimit: event.rsvpCapacityHardLimit,
    icon: normalizeEventIconName(event.icon),
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, startSave] = useTransition();

  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, startDelete] = useTransition();

  const set = <K extends keyof EventInput>(key: K, value: EventInput[K]) => {
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
        <h2 className="text-lg font-semibold text-fg">Basic info</h2>
        {saveError && <p className="text-sm text-danger-fg">{saveError}</p>}
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-name" className="text-sm text-fg-muted">
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
          <label htmlFor="ev-description" className="text-sm text-fg-muted">
            Description
          </label>
          <MarkdownTextarea
            id="ev-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            wrapperClassName="w-full"
          />
          <MarkdownHint />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ev-website" className="text-sm text-fg-muted">
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
            <label htmlFor="ev-start" className="text-sm text-fg-muted">
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
            <label htmlFor="ev-end" className="text-sm text-fg-muted">
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
            <label htmlFor="ev-timezone" className="text-sm text-fg-muted">
              Timezone *
            </label>
            <TimezoneSelect
              id="ev-timezone"
              value={form.timezone}
              onChange={(v) => set("timezone", v)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="ev-duration" className="text-sm text-fg-muted">
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
            <label htmlFor="ev-break" className="text-sm text-fg-muted">
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
          <div className="flex flex-col gap-1">
            <label htmlFor="ev-increment" className="text-sm text-fg-muted">
              Schedule increment (min)
            </label>
            <select
              id="ev-increment"
              value={form.slotIncrementMinutes}
              onChange={(e) => set("slotIncrementMinutes", e.target.value)}
              className="w-full h-10 rounded-md border border-line bg-surface-raised px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              {SLOT_INCREMENT_OPTIONS.map((opt) => (
                <option key={opt} value={String(opt)}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <input
            id="ev-rsvp-hard-limit"
            type="checkbox"
            checked={form.rsvpCapacityHardLimit ?? false}
            onChange={(e) => set("rsvpCapacityHardLimit", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line text-brand-fg focus:ring-brand-accent"
          />
          <label htmlFor="ev-rsvp-hard-limit" className="text-sm text-fg-muted">
            Enforce session capacity as a hard limit — reject RSVPs once a
            session is full (capacity 0 means unlimited)
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-fg-muted">Icon</span>
          <IconPicker
            label="Icon"
            value={form.icon ?? ""}
            onChange={(v) => set("icon", v)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          {saveSuccess && (
            <span className="text-sm text-success-fg">Saved!</span>
          )}
        </div>
      </form>

      <section
        aria-label="Danger zone"
        className="border-t border-danger-border pt-6 space-y-3"
      >
        <h2 className="text-lg font-semibold text-danger-fg">Danger zone</h2>
        {!deleteMode ? (
          <button onClick={() => setDeleteMode(true)} className={DANGER_BUTTON}>
            Delete event
          </button>
        ) : (
          <div className="space-y-3 rounded-md border border-danger-border p-4">
            <p className="text-sm text-danger-fg">
              This will permanently delete the event and all associated days,
              proposals, sessions, RSVPs, and assignments.
            </p>
            <div className="flex flex-col gap-1">
              <label htmlFor="delete-confirm" className="text-sm text-fg-muted">
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
