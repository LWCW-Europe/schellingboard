"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/input";
import {
  createDayAction,
  updateDayAction,
  deleteDayAction,
  type DayInput,
} from "@/app/actions/admin-days";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  DANGER_BUTTON,
} from "@/app/admin/buttons";
import { utcToZonedInput, zonedInputToUtc } from "@/utils/admin-datetime";

// Dates are pre-serialized to ISO strings in the server component to avoid
// any RSC Date serialization ambiguity (Day.start is Date on server, but
// string after the RSC wire-format round-trip in some Next.js versions).
export type SerializedDay = {
  id: string;
  eventId?: string | null;
  start: string;
  end: string;
  startBookings: string;
  endBookings: string;
  // Titles of scheduled sessions overlapping this day's window — i.e. the
  // sessions that deleting the day will also delete.
  affectedSessionTitles: string[];
};

const EMPTY_FORM: Omit<DayInput, "eventId"> = {
  start: "",
  end: "",
  startBookings: "",
  endBookings: "",
};

// Converts every field of a day form from the event timezone to the UTC wire
// format the day actions expect.
function toUtcForm(
  form: Omit<DayInput, "eventId">,
  timezone: string
): Omit<DayInput, "eventId"> {
  return {
    start: zonedInputToUtc(form.start, timezone),
    end: zonedInputToUtc(form.end, timezone),
    startBookings: zonedInputToUtc(form.startBookings, timezone),
    endBookings: zonedInputToUtc(form.endBookings, timezone),
  };
}

function AddDayForm({
  eventId,
  timezone,
  onError,
}: {
  eventId: string;
  timezone: string;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setFormState] = useState<Omit<DayInput, "eventId">>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof typeof EMPTY_FORM, value: string) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await createDayAction({
          eventId,
          ...toUtcForm(form, timezone),
        });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          setFormState(EMPTY_FORM);
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
        Add day
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border border-gray-200 rounded-md p-4"
    >
      <h3 className="font-medium text-gray-900">New day</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="day-start" className="text-sm text-gray-600">
            Start *
          </label>
          <Input
            id="day-start"
            type="datetime-local"
            value={form.start}
            onChange={(e) => set("start", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="day-end" className="text-sm text-gray-600">
            End *
          </label>
          <Input
            id="day-end"
            type="datetime-local"
            value={form.end}
            onChange={(e) => set("end", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="day-sb" className="text-sm text-gray-600">
            Bookings open *
          </label>
          <Input
            id="day-sb"
            type="datetime-local"
            value={form.startBookings}
            onChange={(e) => set("startBookings", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="day-eb" className="text-sm text-gray-600">
            Bookings close *
          </label>
          <Input
            id="day-eb"
            type="datetime-local"
            value={form.endBookings}
            onChange={(e) => set("endBookings", e.target.value)}
            required
            className="w-full h-10"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
          {isPending ? "Adding..." : "Add day"}
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

function DayRow({
  day,
  eventId,
  timezone,
  onError,
}: {
  day: SerializedDay;
  eventId: string;
  timezone: string;
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [form, setFormState] = useState<Omit<DayInput, "eventId">>({
    start: utcToZonedInput(day.start, timezone),
    end: utcToZonedInput(day.end, timezone),
    startBookings: utcToZonedInput(day.startBookings, timezone),
    endBookings: utcToZonedInput(day.endBookings, timezone),
  });
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const set = (key: keyof Omit<DayInput, "eventId">, value: string) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startSave(async () => {
      try {
        const result = await updateDayAction({
          id: day.id,
          eventId,
          ...toUtcForm(form, timezone),
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
        const result = await deleteDayAction({ id: day.id, eventId });
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

  const label = `${utcToZonedInput(day.start, timezone)} – ${utcToZonedInput(
    day.end,
    timezone
  )} (${timezone})`;

  if (deleteMode) {
    const affected = day.affectedSessionTitles;
    return (
      <li className="py-3 space-y-2">
        <p className="text-sm text-gray-700">{label}</p>
        <p className="text-sm text-red-700">
          {affected.length === 0
            ? "Delete this day? No scheduled sessions fall within its time window."
            : `Delete this day? The following ${
                affected.length === 1
                  ? "session"
                  : `${affected.length} sessions`
              } scheduled within its time window will also be deleted:`}
        </p>
        {affected.length > 0 && (
          <ul className="list-disc list-inside text-sm text-red-700">
            {affected.map((title, i) => (
              <li key={`${title}-${i}`}>{title}</li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={DANGER_BUTTON}
          >
            {isDeleting ? "Deleting..." : "Confirm delete"}
          </button>
          <button
            onClick={() => setDeleteMode(false)}
            disabled={isDeleting}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  if (editMode) {
    return (
      <li className="py-3">
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`day-start-${day.id}`}
                className="text-sm text-gray-600"
              >
                Start *
              </label>
              <Input
                id={`day-start-${day.id}`}
                type="datetime-local"
                value={form.start}
                onChange={(e) => set("start", e.target.value)}
                required
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`day-end-${day.id}`}
                className="text-sm text-gray-600"
              >
                End *
              </label>
              <Input
                id={`day-end-${day.id}`}
                type="datetime-local"
                value={form.end}
                onChange={(e) => set("end", e.target.value)}
                required
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`day-sb-${day.id}`}
                className="text-sm text-gray-600"
              >
                Bookings open *
              </label>
              <Input
                id={`day-sb-${day.id}`}
                type="datetime-local"
                value={form.startBookings}
                onChange={(e) => set("startBookings", e.target.value)}
                required
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`day-eb-${day.id}`}
                className="text-sm text-gray-600"
              >
                Bookings close *
              </label>
              <Input
                id={`day-eb-${day.id}`}
                type="datetime-local"
                value={form.endBookings}
                onChange={(e) => set("endBookings", e.target.value)}
                required
                className="w-full h-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className={PRIMARY_BUTTON}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              disabled={isSaving}
              className={SECONDARY_BUTTON}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="py-3 flex items-center justify-between gap-3">
      <p className="text-sm text-gray-700">{label}</p>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setEditMode(true)}
          className={SECONDARY_BUTTON}
          aria-label={`Edit day ${label}`}
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteMode(true)}
          className={DANGER_BUTTON}
          aria-label={`Delete day ${label}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export function EventDaysManager({
  days,
  eventId,
  timezone,
}: {
  days: SerializedDay[];
  eventId: string;
  timezone: string;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <section aria-label="Days" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Days</h2>
      <p className="text-sm text-gray-500">
        All times are in the event timezone ({timezone}).
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {days.length > 0 && (
        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {days.map((day) => (
            <DayRow
              key={day.id}
              day={day}
              eventId={eventId}
              timezone={timezone}
              onError={setError}
            />
          ))}
        </ul>
      )}

      <AddDayForm eventId={eventId} timezone={timezone} onError={setError} />
    </section>
  );
}
