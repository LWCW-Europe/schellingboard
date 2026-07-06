"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Input } from "@/app/input";
import type { CompleteGuest } from "@/db/repositories/interfaces";
import {
  createGuestAction,
  updateGuestAction,
  deleteGuestAction,
  sendTestEmailAction,
} from "../actions/admin-guests";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, DANGER_BUTTON } from "./buttons";
import { DataTable } from "./data-table";

/** A guest plus the events they are assigned to. */
export type AdminUser = {
  guest: CompleteGuest;
  events: { id: string; name: string }[];
};

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
      className="flex flex-col sm:flex-row gap-2 sm:items-end max-w-2xl"
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
  events,
  onError,
}: {
  guest: CompleteGuest;
  events: AdminUser["events"];
  onError: (error: string | null) => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [name, setName] = useState(guest.name);
  const [email, setEmail] = useState(guest.info.email);
  const [isPending, startTransition] = useTransition();
  const [isSendingEmail, startEmailTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);

  const startEdit = () => {
    setName(guest.name);
    setEmail(guest.info.email);
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

  const handleSendTestEmail = () => {
    setEmailSent(false);
    startEmailTransition(async () => {
      const result = await sendTestEmailAction({ id: guest.id });
      if (!result.ok) {
        onError(result.error);
      } else {
        onError(null);
        setEmailSent(true);
      }
    });
  };

  if (mode === "edit") {
    return (
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
          <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
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
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{guest.name}</p>
        <p className="text-sm text-gray-500 truncate">{guest.info.email}</p>
        {events.length > 0 && (
          <p className="text-sm text-gray-500 truncate">
            {events.map((event, i) => (
              <Fragment key={event.id}>
                {i > 0 && " · "}
                <Link
                  href={`/admin/events/${event.id}`}
                  className="underline hover:text-gray-700"
                >
                  {event.name}
                </Link>
              </Fragment>
            ))}
          </p>
        )}
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
            onClick={handleSendTestEmail}
            disabled={isSendingEmail}
            className={SECONDARY_BUTTON}
          >
            {isSendingEmail
              ? "Sending..."
              : emailSent
                ? "Sent!"
                : "Send test email"}
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
    </div>
  );
}

export function GuestsManager({
  users,
  total,
  page,
  pageSize,
  query,
}: {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <AddGuestForm onError={setError} />

      <DataTable
        rows={users}
        rowKey={(u) => u.guest.id}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={query}
        searchPlaceholder="Search name or email…"
        emptyMessage="No users match."
        listItem={(u) => (
          <GuestRow guest={u.guest} events={u.events} onError={setError} />
        )}
      />
    </div>
  );
}
