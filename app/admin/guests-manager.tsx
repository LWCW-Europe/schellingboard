"use client";

import { Fragment, useEffect, useState, useTransition } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGuestSchema, updateGuestSchema } from "@/model/guest";
import { z } from "zod";
import { setActionErrors } from "@/utils/forms";

/** A guest plus the events they are assigned to. */
export type AdminUser = {
  guest: CompleteGuest;
  events: { id: string; name: string }[];
};

function AddGuestForm() {
  const form = useForm({
    resolver: zodResolver(createGuestSchema),
  });

  const handleSubmit = async ({
    name,
    email,
  }: z.input<typeof createGuestSchema>) => {
    const result = await createGuestAction({ name, email });
    if (!result.ok) {
      setActionErrors(form, result.error);
    } else {
      form.reset();
    }
  };

  return (
    <div className="max-w-2xl">
      <form
        noValidate
        onSubmit={(e) => form.handleSubmit(handleSubmit)(e) as never}
        className="flex flex-col sm:flex-row gap-2 sm:items-center"
      >
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="new-user-name" className="text-sm text-fg-muted">
            Name
          </label>
          <Input
            id="new-user-name"
            error={!!form.formState.errors.name}
            {...form.register("name")}
            className="w-full h-10"
          />
          <span className="text-brand-fg text-sm min-h-(--text-sm)">
            {form.formState.errors.name?.message}
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="new-user-email" className="text-sm text-fg-muted">
            Email
          </label>
          <Input
            id="new-user-email"
            type="email"
            error={!!form.formState.errors.email}
            {...form.register("email")}
            className="w-full h-10"
          />
          <span className="text-brand-fg text-sm min-h-(--text-sm)">
            {form.formState.errors.email?.message}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={PRIMARY_BUTTON}
          >
            {form.formState.isSubmitting ? "Adding..." : "Add user"}
          </button>
        </div>
      </form>
      {form.formState.errors.root && (
        <p role="alert" className="text-sm text-danger-fg">
          {form.formState.errors.root.message}
        </p>
      )}
    </div>
  );
}

function GuestRow({
  guest,
  events,
}: {
  guest: CompleteGuest;
  events: AdminUser["events"];
}) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const form = useForm({
    // `values`, not `defaultValues`: a save revalidates the page and re-renders
    // this row with the new guest, and the form has to follow — otherwise
    // re-opening the editor would show the values from before the save.
    values: {
      id: guest.id,
      name: guest.name,
      email: guest.info.email,
    },
    resolver: zodResolver(updateGuestSchema),
  });
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSendingEmail, startEmailTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const startEdit = () => {
    form.reset();
    setMode("edit");
  };

  const handleSave = async ({
    id,
    name,
    email,
  }: z.input<typeof updateGuestSchema>) => {
    const result = await updateGuestAction({ id, name, email });
    if (!result.ok) {
      setActionErrors(form, result.error);
    } else {
      setEmailSent(false);
      setMode("view");
    }
  };

  const handleDelete = () =>
    startDeleteTransition(async () => {
      const result = await deleteGuestAction({ id: guest.id });
      setViewError(result.ok ? null : result.error);
    });

  const handleSendTestEmail = () => {
    setEmailSent(false);
    startEmailTransition(async () => {
      const result = await sendTestEmailAction({ id: guest.id });
      if (!result.ok) {
        setViewError(result.error);
      } else {
        setViewError(null);
        setEmailSent(true);
      }
    });
  };

  useEffect(() => {
    if (!emailSent) return;
    // Briefly disable the button to guard against accidental double-sends.
    const timer = setTimeout(() => setEmailSent(false), 3000);
    return () => clearTimeout(timer);
  }, [emailSent]);

  if (mode === "edit") {
    return (
      <div>
        <form
          noValidate
          onSubmit={(e) => form.handleSubmit(handleSave)(e) as never}
          className="flex flex-col sm:flex-row gap-2 sm:items-baseline"
        >
          <div className="flex flex-col gap-1">
            <Input
              aria-label="Name"
              error={!!form.formState.errors.name}
              {...form.register("name")}
              className="flex-1 h-10"
            />
            <span className="text-brand-fg text-sm min-h-(--text-sm)">
              {form.formState.errors.name?.message}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              aria-label="Email"
              type="email"
              error={!!form.formState.errors.email}
              {...form.register("email")}
              className="flex-1 h-10"
            />
            <span className="text-brand-fg text-sm min-h-(--text-sm)">
              {form.formState.errors.email?.message}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className={PRIMARY_BUTTON}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                form.reset();
                setMode("view");
              }}
              disabled={form.formState.isSubmitting}
              className={SECONDARY_BUTTON}
            >
              Cancel
            </button>
          </div>
        </form>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-danger-fg">
            {form.formState.errors.root.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-fg truncate">{guest.name}</p>
          <p className="text-sm text-fg-subtle truncate">{guest.info.email}</p>
          {events.length > 0 && (
            <p className="text-sm text-fg-subtle truncate">
              {events.map((event, i) => (
                <Fragment key={event.id}>
                  {i > 0 && " · "}
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="underline hover:text-fg-muted"
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
            <span className="text-sm text-danger-fg">Delete this user?</span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={DANGER_BUTTON}
            >
              {isDeleting ? "Deleting..." : "Confirm delete"}
            </button>
            <button
              onClick={() => setMode("view")}
              disabled={isDeleting}
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
              disabled={isSendingEmail || emailSent}
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
                setMode("delete");
              }}
              className={clsx(
                SECONDARY_BUTTON,
                "text-danger-fg hover:bg-danger-tint bg-danger-tint/50"
              )}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {viewError && (
        <p role="alert" className="text-sm text-danger-fg">
          {viewError}
        </p>
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
  return (
    <div className="space-y-4">
      <AddGuestForm />

      <DataTable
        rows={users}
        rowKey={(u) => u.guest.id}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={query}
        searchPlaceholder="Search name or email…"
        emptyMessage="No users match."
        listItem={(u) => <GuestRow guest={u.guest} events={u.events} />}
      />
    </div>
  );
}
