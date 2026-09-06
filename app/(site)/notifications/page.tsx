import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageNotice } from "@/app/components/page-notice";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { outOfRangePageRedirect, parsePage } from "@/utils/pagination";
import { formatRelativeTime } from "@/utils/relative-time";
import { serverNow } from "@/utils/dev-clock-server";
import { NotificationList } from "./notification-list";

const PAGE_SIZE = 20;

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
  const total = await notifications.countByGuest(currentUser);
  // A stale link to a page that no longer exists lands on the last real one,
  // as everywhere else that paginates.
  const redirectTarget = outOfRangePageRedirect({
    basePath: "/notifications",
    page,
    total,
    pageSize: PAGE_SIZE,
  });
  if (redirectTarget) redirect(redirectTarget);

  const listed = await notifications.listByGuest(currentUser, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const hasOlder = page * PAGE_SIZE < total;
  const now = await serverNow();
  const rows = listed.map((notification) => ({
    id: notification.id,
    text: notification.text,
    when: formatRelativeTime(notification.createdAt, now),
    read: notification.readAt !== undefined,
  }));

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {rows.length === 0 ? (
        <p className="text-fg-muted">
          Nothing yet. When someone comments on your session or changes
          something you have RSVP&apos;d to, it will show up here.
        </p>
      ) : (
        // Ticks are for the rows on screen, so paging away starts a fresh
        // selection rather than carrying ids the reader can no longer see.
        <NotificationList key={page} rows={rows} />
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
