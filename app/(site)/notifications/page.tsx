import { cookies } from "next/headers";
import Link from "next/link";
import { DateTime } from "luxon";
import { PageNotice } from "@/app/components/page-notice";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { openNotificationAction } from "@/app/actions/notifications";
import { MarkAllReadButton, MarkReadButton } from "./mark-read-buttons";

const PAGE_SIZE = 20;
// SQLite refuses a non-integer OFFSET, so "?page=1.05" or "?page=1e999" would
// crash the page rather than show the first one.
const MAX_PAGE = 10_000;

export function parsePage(raw: string | undefined): number {
  const parsed = Math.floor(Number(raw ?? 1));
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, MAX_PAGE);
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);

  if (!currentUser) {
    return (
      <PageNotice backHref="/guests" backLabel="Attendees">
        {await unverifiedUserMessage(cookieStore, "seeing your notifications")}
      </PageNotice>
    );
  }

  const page = parsePage((await searchParams).page);
  const { notifications } = getRepositories();
  // One extra row answers "is there another page" without a second count.
  const rows = await notifications.listByGuest(currentUser, {
    limit: PAGE_SIZE + 1,
    offset: (page - 1) * PAGE_SIZE,
  });
  const hasOlder = rows.length > PAGE_SIZE;
  const listed = rows.slice(0, PAGE_SIZE);
  const unread = await notifications.countUnread(currentUser);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unread > 0 && <MarkAllReadButton />}
      </div>

      {listed.length === 0 ? (
        <p className="text-fg-muted">
          {page === 1
            ? "Nothing yet. When someone comments on your session or changes something you have RSVP'd to, it will show up here."
            : "No more notifications."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {listed.map((notification) => (
            <li
              key={notification.id}
              className={
                notification.readAt
                  ? "rounded-md border border-line bg-surface-raised"
                  : "rounded-md border border-brand-accent bg-brand-tint"
              }
            >
              <div className="flex items-center gap-2 p-3">
                <form
                  action={openNotificationAction.bind(null, notification.id)}
                  className="min-w-0 flex-1"
                >
                  <button
                    type="submit"
                    className="w-full cursor-pointer text-left"
                  >
                    <span
                      className={
                        notification.readAt
                          ? "block text-fg-subtle"
                          : "block font-medium"
                      }
                    >
                      {notification.text}
                    </span>
                    <span className="block text-sm text-fg-muted">
                      {DateTime.fromJSDate(notification.createdAt).toRelative()}
                    </span>
                  </button>
                </form>
                {!notification.readAt && (
                  <MarkReadButton id={notification.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between">
        {page > 1 ? (
          <Link
            href={`/notifications?page=${page - 1}`}
            className="text-brand-fg hover:underline"
          >
            ← Newer
          </Link>
        ) : (
          <span />
        )}
        {hasOlder && (
          <Link
            href={`/notifications?page=${page + 1}`}
            className="text-brand-fg hover:underline"
          >
            Older →
          </Link>
        )}
      </div>
    </div>
  );
}
