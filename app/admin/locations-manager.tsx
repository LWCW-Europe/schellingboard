"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Input } from "@/app/input";
import type { Location } from "@/db/repositories/interfaces";
import { IMAGE_REQUIREMENTS_HINT } from "@/utils/location-image-constraints";
import {
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
  moveLocationAction,
} from "../actions/admin-locations";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, DANGER_BUTTON } from "./buttons";
import {
  LOCATION_COLOR_NAMES,
  DEFAULT_LOCATION_COLOR,
  isLocationColorName,
} from "@/utils/location-colors";

export type AdminLocation = {
  location: Location;
  eventIds: string[];
  sessionLinkCount: number;
};

export type EventOption = { id: string; name: string };

function LocationForm({
  location,
  eventIds,
  events,
  submitLabel,
  pendingLabel,
  onSubmit,
  onCancel,
}: {
  location?: Location;
  eventIds: string[];
  events: EventOption[];
  submitLabel: string;
  pendingLabel: string;
  onSubmit: (formData: FormData) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const idPrefix = location ? `loc-${location.id}` : "loc-new";
  const [color, setColor] = useState<string>(
    location && isLocationColorName(location.color)
      ? location.color
      : DEFAULT_LOCATION_COLOR
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const ok = await onSubmit(formData);
      if (ok) formRef.current?.reset();
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-3 rounded-md border border-gray-200 p-4"
    >
      {location && <input type="hidden" name="id" value={location.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-name`} className="text-sm text-gray-600">
            Name
          </label>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            defaultValue={location?.name ?? ""}
            required
            className="w-full h-10"
          />
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
            name="capacity"
            type="number"
            min={0}
            step={1}
            defaultValue={location?.capacity ?? 0}
            required
            className="w-full h-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${idPrefix}-description`}
          className="text-sm text-gray-600"
        >
          Description
        </label>
        <textarea
          id={`${idPrefix}-description`}
          name="description"
          defaultValue={location?.description ?? ""}
          rows={2}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-area`} className="text-sm text-gray-600">
            Area description
          </label>
          <Input
            id={`${idPrefix}-area`}
            name="areaDescription"
            defaultValue={location?.areaDescription ?? ""}
            className="w-full h-10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`${idPrefix}-color`}
            className="text-sm text-gray-600"
          >
            Color
          </label>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={clsx(
                "h-10 w-10 shrink-0 rounded-md border border-gray-300",
                `bg-${color}-500`
              )}
            />
            <select
              id={`${idPrefix}-color`}
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 flex-1 rounded-md border border-gray-300 bg-white px-2 capitalize shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-0"
            >
              {LOCATION_COLOR_NAMES.map((name) => (
                <option key={name} value={name} className="capitalize">
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="hidden"
            defaultChecked={location?.hidden ?? false}
            className="rounded border-gray-300 text-rose-600 focus:ring-rose-400"
          />
          Hidden
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="bookable"
            defaultChecked={location?.bookable ?? false}
            className="rounded border-gray-300 text-rose-600 focus:ring-rose-400"
          />
          Bookable
        </label>
      </div>

      {events.length > 0 && (
        <fieldset className="space-y-1">
          <legend className="text-sm text-gray-600">Events</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {events.map((event) => (
              <label
                key={event.id}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  name="eventIds"
                  value={event.id}
                  defaultChecked={eventIds.includes(event.id)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-400"
                />
                {event.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-image`} className="text-sm text-gray-600">
          Image
        </label>
        {location?.imageUrl && (
          <Image
            src={location.imageUrl}
            alt={`Current image of ${location.name}`}
            width={160}
            height={120}
            className="rounded border border-gray-200"
          />
        )}
        <input
          id={`${idPrefix}-image`}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
        <p className="text-xs text-gray-500">{IMAGE_REQUIREMENTS_HINT}</p>
      </div>

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

function DeleteConfirmation({
  adminLocation,
  onError,
  onCancel,
}: {
  adminLocation: AdminLocation;
  onError: (error: string | null) => void;
  onCancel: () => void;
}) {
  const { location, eventIds, sessionLinkCount } = adminLocation;
  const [typedName, setTypedName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteLocationAction({ id: location.id });
      onError(result.ok ? null : result.error);
    });
  };

  return (
    <div className="space-y-2 rounded-md border border-red-200 bg-red-50/50 p-3">
      <p className="text-sm text-red-700">
        Deleting “{location.name}” removes it from {sessionLinkCount}{" "}
        {sessionLinkCount === 1 ? "session" : "sessions"} and {eventIds.length}{" "}
        {eventIds.length === 1 ? "event" : "events"}. This cannot be undone.
        Type the location name to confirm.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          aria-label="Location name confirmation"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder={location.name}
          className="flex-1 h-10"
        />
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending || typedName !== location.name}
            className={DANGER_BUTTON}
          >
            {isPending ? "Deleting..." : "Confirm delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={isPending}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function LocationRow({
  adminLocation,
  events,
  isFirst,
  isLast,
  onError,
}: {
  adminLocation: AdminLocation;
  events: EventOption[];
  isFirst: boolean;
  isLast: boolean;
  onError: (error: string | null) => void;
}) {
  const { location, eventIds } = adminLocation;
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [isMovePending, startMoveTransition] = useTransition();

  const handleMove = (direction: "up" | "down") => {
    startMoveTransition(async () => {
      const result = await moveLocationAction({ id: location.id, direction });
      onError(result.ok ? null : result.error);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    const result = await updateLocationAction(formData);
    if (!result.ok) {
      onError(result.error);
      return false;
    }
    onError(null);
    setMode("view");
    return true;
  };

  if (mode === "edit") {
    return (
      <li className="py-3">
        <LocationForm
          location={location}
          eventIds={eventIds}
          events={events}
          submitLabel="Save"
          pendingLabel="Saving..."
          onSubmit={handleUpdate}
          onCancel={() => {
            onError(null);
            setMode("view");
          }}
        />
      </li>
    );
  }

  return (
    <li className="py-3 space-y-2">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {location.imageUrl && (
          <Image
            src={location.imageUrl}
            alt={location.name}
            width={80}
            height={60}
            className="rounded border border-gray-200 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate flex items-center gap-2">
            {isLocationColorName(location.color) && (
              <span
                aria-hidden
                className={clsx(
                  "inline-block w-3 h-3 rounded-full border border-gray-300 shrink-0",
                  `bg-${location.color}-500`
                )}
              />
            )}
            {location.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {[
              location.capacity ? `max ${location.capacity}` : null,
              location.hidden ? "hidden" : null,
              location.bookable ? "bookable" : null,
              events
                .filter((e) => eventIds.includes(e.id))
                .map((e) => e.name)
                .join(", ") || null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            aria-label={`Move ${location.name} up`}
            onClick={() => handleMove("up")}
            disabled={isFirst || isMovePending}
            className={SECONDARY_BUTTON}
          >
            ↑
          </button>
          <button
            aria-label={`Move ${location.name} down`}
            onClick={() => handleMove("down")}
            disabled={isLast || isMovePending}
            className={SECONDARY_BUTTON}
          >
            ↓
          </button>
          <button
            onClick={() => {
              onError(null);
              setMode("edit");
            }}
            className={SECONDARY_BUTTON}
          >
            Edit
          </button>
          <button
            onClick={() => {
              onError(null);
              setMode("delete");
            }}
            className={clsx(
              SECONDARY_BUTTON,
              "text-red-700 hover:bg-red-50 bg-red-50/50"
            )}
          >
            Delete
          </button>
        </div>
      </div>
      {mode === "delete" && (
        <DeleteConfirmation
          adminLocation={adminLocation}
          onError={onError}
          onCancel={() => setMode("view")}
        />
      )}
    </li>
  );
}

export function LocationsManager({
  locations,
  events,
}: {
  locations: AdminLocation[];
  events: EventOption[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = async (formData: FormData) => {
    const result = await createLocationAction(formData);
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    setError(null);
    setShowAddForm(false);
    return true;
  };

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {showAddForm ? (
        <LocationForm
          eventIds={[]}
          events={events}
          submitLabel="Add location"
          pendingLabel="Adding..."
          onSubmit={handleCreate}
          onCancel={() => {
            setError(null);
            setShowAddForm(false);
          }}
        />
      ) : (
        <button onClick={() => setShowAddForm(true)} className={PRIMARY_BUTTON}>
          New location
        </button>
      )}

      {locations.length === 0 ? (
        <p className="text-sm text-gray-500">No locations yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {locations.map((adminLocation, index) => (
            <LocationRow
              key={adminLocation.location.id}
              adminLocation={adminLocation}
              events={events}
              isFirst={index === 0}
              isLast={index === locations.length - 1}
              onError={setError}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
