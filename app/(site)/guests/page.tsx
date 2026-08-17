import Link from "next/link";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import { pageRequestSchema } from "@/model/page";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { redirect } from "next/navigation";
import { AttendeeList } from "@/app/(site)/guests/attendee-list";
import {
  ATTENDEE_SORTS,
  DEFAULT_ATTENDEE_SORT,
  searchAttendees,
} from "@/utils/attendee-search";
import { formatRelativeTime } from "@/utils/relative-time";
import { serverNow } from "@/utils/dev-clock-server";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { z } from "zod";

const PAGE_SIZE = 25;

export function getFilters() {
  return [{ value: "isHost", label: "Session host" }];
}

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    filter?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const paramSchema = pageRequestSchema.extend({
    filter: z.enum(getFilters().map((filter) => filter.value)).optional(),
    sort: z
      .enum(ATTENDEE_SORTS.map((s) => s.value))
      .catch(DEFAULT_ATTENDEE_SORT),
  });

  const { page, query, filter, sort } = paramSchema.parse({
    page: params.page,
    query: params.q,
    filter: params.filter,
    sort: params.sort,
  });

  const attendees = await getRepositories().guests.listAttendees({
    host: filter === "isHost",
  });
  const matches = searchAttendees(attendees, query, sort);
  const total = matches.length;
  const now = await serverNow();
  const rows = matches
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    // Strip fields the list doesn't show; TypeScript's structural typing
    // wouldn't stop a full Attendee from reaching the client payload. The
    // update time is formatted here rather than shipped as a date: the list is
    // a client component, and a "now" from the browser would disagree with the
    // server-rendered markup.
    .map(
      ({
        id,
        name,
        avatarUrl,
        pronouns,
        basedIn,
        isHost,
        profileUpdatedAt,
      }) => ({
        id,
        name,
        avatarUrl,
        pronouns,
        basedIn,
        isHost,
        profileUpdated: profileUpdatedAt
          ? formatRelativeTime(profileUpdatedAt, now)
          : null,
      })
    );

  const redirectTarget = outOfRangePageRedirect({
    basePath: "/guests",
    page,
    total,
    pageSize: PAGE_SIZE,
    params: {
      q: query,
      filter: filter ?? "",
      sort: sort === DEFAULT_ATTENDEE_SORT ? "" : sort,
    },
  });

  if (redirectTarget) redirect(redirectTarget);

  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);

  // Wider than the max-w-2xl pages around it: the rows carry a name, a badge
  // and an update time. That width can reach the viewport edge between sm and
  // lg, so the horizontal padding stays on at every size.
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Attendees</h1>
        {currentUser && (
          <Link
            href="/guests/edit"
            className="text-sm font-semibold text-brand-fg hover:text-brand-fg-hover"
          >
            Edit profile
          </Link>
        )}
      </div>

      <AttendeeList
        filter={filter}
        filters={getFilters()}
        sort={sort}
        rows={rows}
        pageSize={PAGE_SIZE}
        total={total}
        page={page}
        searchQuery={query}
      />
    </div>
  );
}
