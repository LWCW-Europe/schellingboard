"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  deleteNotificationsAction,
  markNotificationsReadAction,
  openNotificationAction,
} from "@/app/actions/notifications";
import { DANGER_BUTTON, SECONDARY_BUTTON } from "@/app/components/buttons";
import { ConfirmationModal } from "../modals";
import { OpenNotificationButton } from "./open-notification-button";

export type NotificationRow = {
  id: string;
  text: string;
  when: string;
  read: boolean;
};

export function NotificationList({ rows }: { rows: NotificationRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, start] = useTransition();

  const allSelected =
    rows.length > 0 && rows.every((row) => selected.has(row.id));
  const someSelected = selected.size > 0;

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const run = (act: (ids: string[]) => Promise<unknown>) =>
    start(async () => {
      await act([...selected]);
      // The ticks were for this action: leaving them would let the next click
      // act again on rows already dealt with.
      setSelected(new Set());
      router.refresh();
    });

  return (
    <>
      <div
        role="group"
        aria-label="Notification actions"
        className="flex flex-wrap items-center gap-3"
      >
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            onChange={() =>
              setSelected(
                allSelected ? new Set() : new Set(rows.map((row) => row.id))
              )
            }
            className="h-4 w-4 cursor-pointer"
          />
          Select all
        </label>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            disabled={!someSelected || pending}
            onClick={() => run(markNotificationsReadAction)}
            className={SECONDARY_BUTTON}
          >
            Mark as read
          </button>
          <button
            type="button"
            disabled={!someSelected || pending}
            onClick={() => setConfirmingDelete(true)}
            className={DANGER_BUTTON}
          >
            Delete
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className={
              row.read
                ? "rounded-md border border-line bg-surface-raised"
                : "rounded-md border border-brand-accent bg-brand-tint"
            }
          >
            <div className="flex items-center gap-3 p-3">
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                aria-label={`Select ${row.text}`}
                onChange={() => toggle(row.id)}
                // Beside the first line of a notification that wraps, not
                // floating in the middle of it: mt-1 centres the box on that
                // line rather than on the whole row.
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer self-start"
              />
              <form
                action={openNotificationAction.bind(null, row.id)}
                className="min-w-0 flex-1"
              >
                <OpenNotificationButton>
                  <span
                    className={
                      row.read ? "block text-fg-subtle" : "block font-medium"
                    }
                  >
                    {row.text}
                  </span>
                  <span className="block text-sm text-fg-muted">
                    {row.when}
                  </span>
                </OpenNotificationButton>
              </form>
              {!row.read && <MarkReadButton id={row.id} />}
            </div>
          </li>
        ))}
      </ul>

      {confirmingDelete && (
        <ConfirmationModal
          open
          close={() => setConfirmingDelete(false)}
          confirm={() => run(deleteNotificationsAction)}
          message={
            selected.size === 1
              ? "Delete this notification? This cannot be undone."
              : `Delete these ${selected.size} notifications? This cannot be undone.`
          }
        />
      )}
    </>
  );
}

// Marking one read without opening it: the row stays where it is, so the list
// only needs refreshing rather than navigating anywhere.
function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      title="Mark as read"
      aria-label="Mark as read"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await markNotificationsReadAction([id]);
          router.refresh();
        })
      }
      className="shrink-0 cursor-pointer rounded-md p-2 text-fg-subtle hover:bg-surface-muted disabled:opacity-50"
    >
      <CheckIcon className="h-5 w-5" />
    </button>
  );
}
