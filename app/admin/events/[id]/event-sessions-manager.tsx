"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/input";
import {
  adminCreateSessionAction,
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
import { SelectHosts } from "@/app/select-hosts";
import { utcToZonedInput, zonedInputToUtc } from "@/utils/admin-datetime";

export type SessionRow = {
  id: string;
  title: string;
  description: string;
  startTime: string | null;
  endTime: string | null;
  capacity: number;
  adminManaged: boolean;
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
  if (session.adminManaged) flags.push("admin-managed");
  return flags;
}

// datetime-local values are edited in the event timezone; the server expects
// UTC ISO. Empty means "not scheduled".
function toIsoOrNull(value: string, timezone: string): string | null {
  const utc = zonedInputToUtc(value, timezone);
  return utc === "" ? null : `${utc}Z`;
}

type SessionFormValues = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: string;
  adminManaged: boolean;
  blocker: boolean;
  closed: boolean;
  hostIds: string[];
  locationIds: string[];
};

// Shared shape of the create/update action payloads (everything but the ids).
function toActionInput(values: SessionFormValues, timezone: string) {
  return {
    title: values.title,
    description: values.description,
    startTime: toIsoOrNull(values.startTime, timezone),
    endTime: toIsoOrNull(values.endTime, timezone),
    // Empty means 0; anything else passes through (NaN included) so the
    // server's capacity validation rejects it instead of saving a silent 0.
    capacity: values.capacity === "" ? 0 : Number(values.capacity),
    adminManaged: values.adminManaged,
    blocker: values.blocker,
    closed: values.closed,
    hostIds: values.hostIds,
    locationIds: values.locationIds,
  };
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

function SessionForm({
  initial,
  idPrefix,
  timezone,
  slotIncrementMinutes,
  hostCandidates,
  locationCandidates,
  submitLabel,
  pendingLabel,
  isPending,
  onSubmit,
  onCancel,
}: {
  initial: SessionFormValues;
  idPrefix: string;
  timezone: string;
  slotIncrementMinutes: number;
  hostCandidates: EventGuest[];
  locationCandidates: EventLocation[];
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onSubmit: (values: SessionFormValues) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [startTime, setStartTime] = useState(initial.startTime);
  const [endTime, setEndTime] = useState(initial.endTime);
  const [capacity, setCapacity] = useState(initial.capacity);
  const [adminManaged, setAdminManaged] = useState(initial.adminManaged);
  const [blocker, setBlocker] = useState(initial.blocker);
  const [closed, setClosed] = useState(initial.closed);
  const [hosts, setHosts] = useState<EventGuest[]>(
    initial.hostIds.flatMap(
      (id) => hostCandidates.find((g) => g.id === id) ?? []
    )
  );
  const [locationIds, setLocationIds] = useState<string[]>(initial.locationIds);

  const toggleLocation = (id: string) =>
    setLocationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      startTime,
      endTime,
      capacity,
      adminManaged,
      blocker,
      closed,
      hostIds: hosts.map((h) => h.id),
      locationIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-title`} className="text-sm text-gray-600">
          Title *
        </label>
        <Input
          id={`${idPrefix}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full h-10"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-desc`} className="text-sm text-gray-600">
          Description
        </label>
        <textarea
          id={`${idPrefix}-desc`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-y h-24 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`${idPrefix}-start`}
            className="text-sm text-gray-600"
          >
            Start ({timezone}) — leave empty if not scheduled
          </label>
          <Input
            id={`${idPrefix}-start`}
            type="datetime-local"
            step={slotIncrementMinutes * 60}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-end`} className="text-sm text-gray-600">
            End ({timezone})
          </label>
          <Input
            id={`${idPrefix}-end`}
            type="datetime-local"
            step={slotIncrementMinutes * 60}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${idPrefix}-capacity`}
          className="text-sm text-gray-600"
        >
          Capacity
        </label>
        <Input
          id={`${idPrefix}-capacity`}
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
            checked={adminManaged}
            onChange={(e) => setAdminManaged(e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Admin-managed
        </label>
      </fieldset>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-hosts`} className="text-sm text-gray-600">
          Hosts
        </label>
        {hostCandidates.length === 0 ? (
          <p className="text-sm text-gray-500">
            No guests assigned to this event yet.
          </p>
        ) : (
          <SelectHosts
            guests={hostCandidates}
            hosts={hosts}
            setHosts={setHosts}
            id={`${idPrefix}-hosts`}
            selectMany
          />
        )}
      </div>
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
                onChange={() => toggleLocation(l.id)}
                aria-label={`Location ${l.name}`}
                className="h-4 w-4 cursor-pointer"
              />
              {l.name}
            </label>
          ))
        )}
      </fieldset>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
          {isPending ? pendingLabel : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className={SECONDARY_BUTTON}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SessionItem({
  session,
  eventGuests,
  eventLocations,
  timezone,
  slotIncrementMinutes,
  onError,
}: {
  session: SessionRow;
  eventGuests: EventGuest[];
  eventLocations: EventLocation[];
  timezone: string;
  slotIncrementMinutes: number;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
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

  const handleSave = (values: SessionFormValues) => {
    startSave(async () => {
      try {
        const result = await adminUpdateSessionAction({
          id: session.id,
          ...toActionInput(values, timezone),
        });
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
  };

  const handleDelete = () => {
    startDelete(async () => {
      try {
        const result = await adminDeleteSessionAction({ id: session.id });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          router.refresh();
        }
      } catch {
        onError("Request failed");
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
    <SessionForm
      initial={{
        title: session.title,
        description: session.description,
        startTime: utcToZonedInput(session.startTime, timezone),
        endTime: utcToZonedInput(session.endTime, timezone),
        capacity: String(session.capacity),
        adminManaged: session.adminManaged,
        blocker: session.blocker,
        closed: session.closed,
        hostIds: session.hosts.map((h) => h.id),
        locationIds: session.locations.map((l) => l.id),
      }}
      idPrefix={`sess-${session.id}`}
      timezone={timezone}
      slotIncrementMinutes={slotIncrementMinutes}
      hostCandidates={hostCandidates}
      locationCandidates={locationCandidates}
      submitLabel="Save"
      pendingLabel="Saving..."
      isPending={isSaving}
      onSubmit={handleSave}
      onCancel={() => {
        setEditMode(false);
        onError(null);
      }}
    />
  );
}

// Sessions created by an admin are admin-managed by default: they stay under
// admin control instead of being editable by their hosts.
const EMPTY_SESSION: SessionFormValues = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  capacity: "0",
  adminManaged: true,
  blocker: false,
  closed: false,
  hostIds: [],
  locationIds: [],
};

function AddSession({
  eventId,
  eventGuests,
  eventLocations,
  timezone,
  slotIncrementMinutes,
  onError,
}: {
  eventId: string;
  eventGuests: EventGuest[];
  eventLocations: EventLocation[];
  timezone: string;
  slotIncrementMinutes: number;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCreating, startCreate] = useTransition();

  const handleCreate = (values: SessionFormValues) => {
    startCreate(async () => {
      try {
        const result = await adminCreateSessionAction({
          eventId,
          ...toActionInput(values, timezone),
        });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          setOpen(false);
          router.refresh();
        }
      } catch {
        onError("Request failed");
      }
    });
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={PRIMARY_BUTTON}>
        Add session
      </button>
    );
  }

  return (
    <div className="space-y-3 border border-gray-200 rounded-md p-4">
      <h3 className="font-medium text-gray-900">New session</h3>
      <SessionForm
        initial={EMPTY_SESSION}
        idPrefix="sess-new"
        timezone={timezone}
        slotIncrementMinutes={slotIncrementMinutes}
        hostCandidates={eventGuests}
        locationCandidates={eventLocations}
        submitLabel="Create"
        pendingLabel="Creating..."
        isPending={isCreating}
        onSubmit={handleCreate}
        onCancel={() => {
          setOpen(false);
          onError(null);
        }}
      />
    </div>
  );
}

export function EventSessionsManager({
  eventId,
  sessions,
  eventGuests,
  eventLocations,
  timezone,
  slotIncrementMinutes,
  total,
  page,
  pageSize,
  query,
}: {
  eventId: string;
  sessions: SessionRow[];
  eventGuests: EventGuest[];
  eventLocations: EventLocation[];
  timezone: string;
  slotIncrementMinutes: number;
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

      <AddSession
        eventId={eventId}
        eventGuests={eventGuests}
        eventLocations={eventLocations}
        timezone={timezone}
        slotIncrementMinutes={slotIncrementMinutes}
        onError={setError}
      />

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
            slotIncrementMinutes={slotIncrementMinutes}
            onError={setError}
          />
        )}
      />
    </section>
  );
}
