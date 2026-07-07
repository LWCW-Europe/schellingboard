"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/input";
import {
  adminUpdateSessionAction,
  adminDeleteSessionAction,
} from "@/app/actions/admin-sessions";
import { adminRemoveRsvpAction } from "@/app/actions/admin-rsvps";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  DANGER_BUTTON,
} from "@/app/admin/buttons";
import { DataTable } from "../../data-table";
import { utcToZonedInput, zonedInputToUtc } from "@/utils/admin-datetime";

export type SessionRow = {
  id: string;
  title: string;
  description: string;
  startTime: string | null;
  endTime: string | null;
  capacity: number;
  attendeeScheduled: boolean;
  blocker: boolean;
  closed: boolean;
  hosts: { id: string; name: string }[];
  locations: { id: string; name: string }[];
  numRsvps: number;
  rsvps: { guestId: string; name: string }[];
};

export type EventGuest = { id: string; name: string };
export type EventLocation = { id: string; name: string };

function joinNames(items: { name: string }[]): string {
  return items.length > 0 ? items.map((i) => i.name).join(", ") : "—";
}

function timeLabel(session: SessionRow, timezone: string): string {
  if (!session.startTime || !session.endTime) return "Not scheduled";
  return `${utcToZonedInput(session.startTime, timezone)} – ${utcToZonedInput(
    session.endTime,
    timezone
  )} (${timezone})`;
}

function flagLabels(session: SessionRow): string[] {
  const flags: string[] = [];
  if (session.blocker) flags.push("blocker");
  if (session.closed) flags.push("closed");
  if (session.attendeeScheduled) flags.push("attendee-scheduled");
  return flags;
}

// datetime-local values are edited in the event timezone; the server expects
// UTC ISO. Empty means "not scheduled".
function toIsoOrNull(value: string, timezone: string): string | null {
  const utc = zonedInputToUtc(value, timezone);
  return utc === "" ? null : `${utc}Z`;
}

function SessionRsvps({
  session,
  onError,
}: {
  session: SessionRow;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const remove = (guestId: string) => {
    setPendingId(guestId);
    startTransition(async () => {
      try {
        const result = await adminRemoveRsvpAction({
          sessionId: session.id,
          guestId,
        });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          router.refresh();
        }
      } catch {
        onError("Request failed");
      } finally {
        setPendingId(null);
        setConfirmingId(null);
      }
    });
  };

  return (
    <details className="text-sm">
      <summary className="cursor-pointer text-gray-600">
        RSVPs ({session.rsvps.length})
      </summary>
      {session.rsvps.length === 0 ? (
        <p className="mt-2 text-gray-500">No RSVPs.</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {session.rsvps.map((r) => (
            <li
              key={r.guestId}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-gray-700">{r.name}</span>
              {confirmingId === r.guestId ? (
                <span className="flex items-center gap-2">
                  <span className="text-red-700">Remove?</span>
                  <button
                    onClick={() => remove(r.guestId)}
                    disabled={pendingId === r.guestId}
                    className="text-red-600 hover:underline"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    disabled={pendingId === r.guestId}
                    className="text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmingId(r.guestId)}
                  className="text-red-600 hover:underline"
                  aria-label={`Remove RSVP ${r.name}`}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

function SessionItem({
  session,
  eventGuests,
  eventLocations,
  timezone,
  onError,
}: {
  session: SessionRow;
  eventGuests: EventGuest[];
  eventLocations: EventLocation[];
  timezone: string;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(session.title);
  const [description, setDescription] = useState(session.description);
  const [startTime, setStartTime] = useState(
    utcToZonedInput(session.startTime, timezone)
  );
  const [endTime, setEndTime] = useState(
    utcToZonedInput(session.endTime, timezone)
  );
  const [capacity, setCapacity] = useState(String(session.capacity));
  const [attendeeScheduled, setAttendeeScheduled] = useState(
    session.attendeeScheduled
  );
  const [blocker, setBlocker] = useState(session.blocker);
  const [closed, setClosed] = useState(session.closed);
  const [hostIds, setHostIds] = useState<string[]>(
    session.hosts.map((h) => h.id)
  );
  const [locationIds, setLocationIds] = useState<string[]>(
    session.locations.map((l) => l.id)
  );
  const [isSaving, startSave] = useTransition();
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, startDelete] = useTransition();

  // Offer event-assigned guests as hosts, plus any current host that is not
  // (or no longer) assigned to the event so existing hosts are never dropped.
  const hostCandidates: EventGuest[] = [
    ...eventGuests,
    ...session.hosts.filter((h) => !eventGuests.some((g) => g.id === h.id)),
  ];
  const locationCandidates: EventLocation[] = [
    ...eventLocations,
    ...session.locations.filter(
      (l) => !eventLocations.some((e) => e.id === l.id)
    ),
  ];

  const reset = () => {
    setTitle(session.title);
    setDescription(session.description);
    setStartTime(utcToZonedInput(session.startTime, timezone));
    setEndTime(utcToZonedInput(session.endTime, timezone));
    setCapacity(String(session.capacity));
    setAttendeeScheduled(session.attendeeScheduled);
    setBlocker(session.blocker);
    setClosed(session.closed);
    setHostIds(session.hosts.map((h) => h.id));
    setLocationIds(session.locations.map((l) => l.id));
  };

  const toggle = (
    set: React.Dispatch<React.SetStateAction<string[]>>,
    id: string
  ) =>
    set((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startSave(async () => {
      const result = await adminUpdateSessionAction({
        id: session.id,
        title,
        description,
        startTime: toIsoOrNull(startTime, timezone),
        endTime: toIsoOrNull(endTime, timezone),
        capacity: Number(capacity) || 0,
        attendeeScheduled,
        blocker,
        closed,
        hostIds,
        locationIds,
      });
      if (!result.ok) {
        onError(result.error);
      } else {
        onError(null);
        setEditMode(false);
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    startDelete(async () => {
      const result = await adminDeleteSessionAction({ id: session.id });
      if (!result.ok) {
        onError(result.error);
      } else {
        onError(null);
        router.refresh();
      }
    });
  };

  if (deleteMode) {
    return (
      <div className="space-y-2">
        <p className="font-medium text-gray-900">{session.title}</p>
        <p className="text-sm text-red-700">
          This will permanently delete the session and its {session.numRsvps}{" "}
          {session.numRsvps === 1 ? "RSVP" : "RSVPs"}. Host and location links
          are removed; the guests and locations themselves are kept.
        </p>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`sess-delete-${session.id}`}
            className="text-sm text-gray-700"
          >
            Type the session title to confirm
          </label>
          <Input
            id={`sess-delete-${session.id}`}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={session.title}
            className="w-full h-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting || deleteConfirm !== session.title}
            className={DANGER_BUTTON}
          >
            {isDeleting ? "Deleting..." : "Confirm delete"}
          </button>
          <button
            onClick={() => {
              setDeleteMode(false);
              setDeleteConfirm("");
              onError(null);
            }}
            disabled={isDeleting}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!editMode) {
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{session.title}</p>
            <p className="text-sm text-gray-500">
              {timeLabel(session, timezone)} · {joinNames(session.locations)}
            </p>
            <p className="text-sm text-gray-500">
              Hosts: {joinNames(session.hosts)} · {session.numRsvps} RSVPs
              {flagLabels(session).length > 0
                ? ` · ${flagLabels(session).join(", ")}`
                : ""}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setEditMode(true)}
              className={SECONDARY_BUTTON}
              aria-label={`Edit ${session.title}`}
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteMode(true)}
              className={DANGER_BUTTON}
              aria-label={`Delete ${session.title}`}
            >
              Delete
            </button>
          </div>
        </div>
        <SessionRsvps session={session} onError={onError} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`sess-title-${session.id}`}
          className="text-sm text-gray-600"
        >
          Title *
        </label>
        <Input
          id={`sess-title-${session.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full h-10"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`sess-desc-${session.id}`}
          className="text-sm text-gray-600"
        >
          Description
        </label>
        <textarea
          id={`sess-desc-${session.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-y h-24 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`sess-start-${session.id}`}
            className="text-sm text-gray-600"
          >
            Start ({timezone}) — leave empty if not scheduled
          </label>
          <Input
            id={`sess-start-${session.id}`}
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`sess-end-${session.id}`}
            className="text-sm text-gray-600"
          >
            End ({timezone})
          </label>
          <Input
            id={`sess-end-${session.id}`}
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`sess-capacity-${session.id}`}
          className="text-sm text-gray-600"
        >
          Capacity
        </label>
        <Input
          id={`sess-capacity-${session.id}`}
          type="number"
          min="0"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full h-10"
        />
      </div>
      <fieldset className="flex flex-col gap-1">
        <legend className="text-sm text-gray-600">Flags</legend>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={blocker}
            onChange={(e) => setBlocker(e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Blocker
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={closed}
            onChange={(e) => setClosed(e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Closed
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={attendeeScheduled}
            onChange={(e) => setAttendeeScheduled(e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Attendee-scheduled
        </label>
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className="text-sm text-gray-600">Hosts</legend>
        {hostCandidates.length === 0 ? (
          <p className="text-sm text-gray-500">
            No guests assigned to this event yet.
          </p>
        ) : (
          hostCandidates.map((g) => (
            <label
              key={g.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={hostIds.includes(g.id)}
                onChange={() => toggle(setHostIds, g.id)}
                aria-label={`Host ${g.name}`}
                className="h-4 w-4 cursor-pointer"
              />
              {g.name}
            </label>
          ))
        )}
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className="text-sm text-gray-600">Locations</legend>
        {locationCandidates.length === 0 ? (
          <p className="text-sm text-gray-500">
            No locations assigned to this event yet.
          </p>
        ) : (
          locationCandidates.map((l) => (
            <label
              key={l.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={locationIds.includes(l.id)}
                onChange={() => toggle(setLocationIds, l.id)}
                aria-label={`Location ${l.name}`}
                className="h-4 w-4 cursor-pointer"
              />
              {l.name}
            </label>
          ))
        )}
      </fieldset>
      <div className="flex gap-2">
        <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setEditMode(false);
            onError(null);
          }}
          disabled={isSaving}
          className={SECONDARY_BUTTON}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function EventSessionsManager({
  sessions,
  eventGuests,
  eventLocations,
  timezone,
  total,
  page,
  pageSize,
  query,
}: {
  sessions: SessionRow[];
  eventGuests: EventGuest[];
  eventLocations: EventLocation[];
  timezone: string;
  total: number;
  page: number;
  pageSize: number;
  query: string;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <section aria-label="Sessions" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
      <p className="text-sm text-gray-500">
        All times are in the event timezone ({timezone}).
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <DataTable
        rows={sessions}
        rowKey={(s) => s.id}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={query}
        searchPlaceholder="Search title or host…"
        emptyMessage="No sessions match."
        listItem={(s) => (
          <SessionItem
            session={s}
            eventGuests={eventGuests}
            eventLocations={eventLocations}
            timezone={timezone}
            onError={setError}
          />
        )}
      />
    </section>
  );
}
