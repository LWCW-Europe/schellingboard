"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { Input } from "@/app/input";
import type { Guest } from "@/db/repositories/interfaces";
import {
  createGuestAction,
  updateGuestAction,
  deleteGuestAction,
} from "../actions/admin-guests";

const PRIMARY_BUTTON =
  "px-3 py-2 text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const SECONDARY_BUTTON =
  "px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const DANGER_BUTTON =
  "px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function AddGuestForm({
  onError,
}: {
  onError: (error: string | null) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createGuestAction({ name, email });
      if (!result.ok) {
        onError(result.error);
      } else {
        onError(null);
        setName("");
        setEmail("");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 sm:items-end"
    >
      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="new-user-name" className="text-sm text-gray-600">
          Name
        </label>
        <Input
          id="new-user-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full h-10"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="new-user-email" className="text-sm text-gray-600">
          Email
        </label>
        <Input
          id="new-user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-10"
        />
      </div>
      <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
        {isPending ? "Adding..." : "Add user"}
      </button>
    </form>
  );
}

function GuestRow({
  guest,
  onError,
}: {
  guest: Guest;
  onError: (error: string | null) => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [name, setName] = useState(guest.name);
  const [email, setEmail] = useState(guest.email);
  const [isPending, startTransition] = useTransition();

  const startEdit = () => {
    setName(guest.name);
    setEmail(guest.email);
    onError(null);
    setMode("edit");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateGuestAction({ id: guest.id, name, email });
      if (!result.ok) {
        onError(result.error);
      } else {
        onError(null);
        setMode("view");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteGuestAction({ id: guest.id });
      onError(result.ok ? null : result.error);
    });
  };

  if (mode === "edit") {
    return (
      <li className="py-3">
        <form
          onSubmit={handleSave}
          className="flex flex-col sm:flex-row gap-2 sm:items-center"
        >
          <Input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 h-10"
          />
          <Input
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-10"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className={PRIMARY_BUTTON}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                onError(null);
                setMode("view");
              }}
              disabled={isPending}
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
    <li className="py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{guest.name}</p>
        <p className="text-sm text-gray-500 truncate">{guest.email}</p>
      </div>
      {mode === "delete" ? (
        <div className="flex gap-2 items-center">
          <span className="text-sm text-red-700">Delete this user?</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className={DANGER_BUTTON}
          >
            {isPending ? "Deleting..." : "Confirm delete"}
          </button>
          <button
            onClick={() => setMode("view")}
            disabled={isPending}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={startEdit} className={SECONDARY_BUTTON}>
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
      )}
    </li>
  );
}

export function GuestsManager({ guests }: { guests: Guest[] }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <AddGuestForm onError={setError} />

      {guests.length === 0 ? (
        <p className="text-sm text-gray-500">No users yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {guests.map((guest) => (
            <GuestRow key={guest.id} guest={guest} onError={setError} />
          ))}
        </ul>
      )}
    </div>
  );
}
