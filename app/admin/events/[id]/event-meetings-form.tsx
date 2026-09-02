"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/input";
import type { Event, MeetingPoint } from "@/db/repositories/interfaces";
import type { AdminActionResult } from "@/app/actions/admin-guests";
import {
  updateEventMeetingsAction,
  createMeetingPointAction,
  updateMeetingPointAction,
  deleteMeetingPointAction,
  type EventMeetingsInput,
} from "@/app/actions/admin-meetings";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  DANGER_BUTTON,
} from "@/app/admin/buttons";

type MeetingsForm = Omit<EventMeetingsInput, "id">;

// The meeting-point controls sit inside the settings form, where a nested
// <form> would be invalid HTML — so they are ordinary buttons, and Enter is
// handled here rather than falling through and saving the settings.
function submitOnEnter(submit: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    submit();
  };
}

function PointRow({
  point,
  eventId,
  onError,
}: {
  point: MeetingPoint;
  eventId: string;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [name, setName] = useState(point.name);
  const [description, setDescription] = useState(point.description);
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<AdminActionResult>) =>
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          setEditMode(false);
          router.refresh();
        }
      } catch {
        onError("Request failed");
      }
    });

  const handleSave = () =>
    run(() =>
      updateMeetingPointAction({ id: point.id, eventId, name, description })
    );

  if (editMode) {
    return (
      <li className="p-3 space-y-2 sm:flex sm:items-start sm:gap-3 sm:space-y-0">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={submitOnEnter(handleSave)}
          aria-label={`Name of ${point.name}`}
          className="w-full h-10 sm:w-1/3"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={submitOnEnter(handleSave)}
          aria-label={`Description of ${point.name}`}
          className="w-full h-10 sm:flex-1"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={PRIMARY_BUTTON}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setName(point.name);
              setDescription(point.description);
              setEditMode(false);
              onError(null);
            }}
            disabled={isPending}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="p-3 flex items-start justify-between gap-3">
      <div className="min-w-0 sm:flex sm:gap-3 sm:flex-1">
        <p className="text-sm font-medium text-fg sm:w-1/3 break-words">
          {point.name}
        </p>
        {point.description && (
          <p className="text-sm text-fg-subtle sm:flex-1 break-words">
            {point.description}
          </p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditMode(true)}
          disabled={isPending}
          className={SECONDARY_BUTTON}
        >
          Edit
        </button>
        {deleteMode ? (
          <>
            <button
              type="button"
              onClick={() =>
                run(() => deleteMeetingPointAction({ id: point.id, eventId }))
              }
              disabled={isPending}
              aria-label={`Confirm delete ${point.name}`}
              className={DANGER_BUTTON}
            >
              {isPending ? "Deleting..." : "Confirm delete"}
            </button>
            <button
              type="button"
              onClick={() => setDeleteMode(false)}
              disabled={isPending}
              className={SECONDARY_BUTTON}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setDeleteMode(true)}
            disabled={isPending}
            aria-label={`Delete ${point.name}`}
            className={DANGER_BUTTON}
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}

function AddPointForm({
  eventId,
  onError,
}: {
  eventId: string;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = () =>
    startTransition(async () => {
      try {
        const result = await createMeetingPointAction({
          eventId,
          name,
          description,
        });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          setName("");
          setDescription("");
          setOpen(false);
          router.refresh();
        }
      } catch {
        onError("Request failed");
      }
    });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={SECONDARY_BUTTON}
      >
        + Add meeting point
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-line-subtle p-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="mp-name" className="text-sm text-fg-muted">
            Name *
          </label>
          <Input
            id="mp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={submitOnEnter(handleAdd)}
            placeholder="Coffee bar"
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="mp-description" className="text-sm text-fg-muted">
            Description
          </label>
          <Input
            id="mp-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={submitOnEnter(handleAdd)}
            placeholder="Ground floor, next to reception"
            className="w-full h-10"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending}
          className={PRIMARY_BUTTON}
        >
          {isPending ? "Adding..." : "Add meeting point"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName("");
            setDescription("");
            onError(null);
          }}
          disabled={isPending}
          className={SECONDARY_BUTTON}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function EventMeetingsForm({
  event,
  points,
}: {
  event: Event;
  points: MeetingPoint[];
}) {
  const [form, setForm] = useState<MeetingsForm>({
    meetingsEnabled: event.meetingsEnabled,
    maxOpenMeetingRequests: String(event.maxOpenMeetingRequests),
  });
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, startSave] = useTransition();

  const set = <K extends keyof MeetingsForm>(
    key: K,
    value: MeetingsForm[K]
  ) => {
    setSaveSuccess(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        const result = await updateEventMeetingsAction({
          id: event.id,
          ...form,
        });
        if (!result.ok) setError(result.error);
        else setSaveSuccess(true);
      } catch {
        setError("Request failed");
      }
    });
  };

  return (
    <form aria-label="Meetings" onSubmit={handleSave} className="space-y-4">
      <h2 className="text-lg font-semibold text-fg">Meetings</h2>
      <p className="text-sm text-fg-subtle">
        Lets attendees book short 1-on-1s with each other in the gaps between
        sessions.
      </p>
      {error && <p className="text-sm text-danger-fg">{error}</p>}

      <div className="rounded-md border border-line-subtle p-4">
        <div className="flex items-start gap-2">
          <input
            id="ev-meetings-enabled"
            type="checkbox"
            checked={form.meetingsEnabled}
            onChange={(e) => set("meetingsEnabled", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line text-brand-fg focus:ring-brand-accent"
          />
          <div>
            <label
              htmlFor="ev-meetings-enabled"
              className="text-sm font-medium text-fg"
            >
              Enable meetings
            </label>
            <p className="text-sm text-fg-subtle">
              Attendees choose their own availability once this is on.
            </p>
          </div>
        </div>
      </div>

      {form.meetingsEnabled && (
        <>
          <section aria-label="Suggested meeting points" className="space-y-2">
            <h3 className="text-sm font-medium text-fg-muted">
              Suggested meeting points
            </h3>
            <p className="text-sm text-fg-subtle">
              Presets attendees can pick when booking. Nothing is reserved —
              several pairs can use the same spot at the same time.
            </p>
            {points.length > 0 && (
              <ul className="rounded-md border border-line-subtle divide-y divide-line-subtle">
                {points.map((point) => (
                  <PointRow
                    key={point.id}
                    point={point}
                    eventId={event.id}
                    onError={setError}
                  />
                ))}
              </ul>
            )}
            <AddPointForm eventId={event.id} onError={setError} />
          </section>

          <div className="flex flex-col gap-1 sm:max-w-xs">
            <label
              htmlFor="ev-meeting-cap"
              className="text-sm font-medium text-fg-muted"
            >
              Maximum open requests per attendee
            </label>
            <Input
              id="ev-meeting-cap"
              type="number"
              min="1"
              value={form.maxOpenMeetingRequests}
              onChange={(e) => set("maxOpenMeetingRequests", e.target.value)}
              required
              className="w-full h-10"
            />
            <p className="text-sm text-fg-subtle">
              How many unanswered requests one person can have outstanding at
              once. It caps what they send, never what they receive.
            </p>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
          {isSaving ? "Saving..." : "Save meetings"}
        </button>
        {saveSuccess && <span className="text-sm text-success-fg">Saved!</span>}
      </div>
    </form>
  );
}
