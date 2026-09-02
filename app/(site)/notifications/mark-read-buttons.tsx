"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/actions/notifications";

// Marking read without opening: the row stays where it is, so the list only
// needs refreshing rather than navigating anywhere.
export function MarkReadButton({ id }: { id: string }) {
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
          await markNotificationReadAction(id);
          router.refresh();
        })
      }
      className="shrink-0 cursor-pointer rounded-md p-2 text-fg-subtle hover:bg-surface-muted disabled:opacity-50"
    >
      <CheckIcon className="h-5 w-5" />
    </button>
  );
}

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await markAllNotificationsReadAction();
          router.refresh();
        })
      }
      className="shrink-0 cursor-pointer text-sm font-medium text-brand-fg hover:underline disabled:opacity-50"
    >
      Mark all as read
    </button>
  );
}
