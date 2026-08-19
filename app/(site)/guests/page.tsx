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
import {
  parseAttendeeFilters,
  serializeAttendeeFilters,
} from "@/utils/attendee-filters";
import { hasFilledProfile, profileExcerpt } from "@/utils/attendee-profile";
import { z } from "zod";

// Everyone on one page: reading through who is coming is what the directory is
// for, and at realistic attendee counts (a few hundred) a pager only gets in
// the way. Above this it falls back to ordinary pagination.
const PAGE_SIZE = 1000;

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
    sort: z
      .enum(ATTENDEE_SORTS.map((s) => s.value))
      .catch(DEFAULT_ATTENDEE_SORT),
  });

  const { page, query, sort } = paramSchema.parse({
    page: params.page,
    query: params.q,
    sort: params.sort,
  });
  const filters = parseAttendeeFilters(params.filter);

  const attendees = await getRepositories().guests.listAttendees({
    host: filters.includes("isHost"),
  });
  const filtered = filters.includes("hasProfile")
    ? attendees.filter(hasFilledProfile)
    : attendees;
  const matches = searchAttendees(filtered, query, sort);
  const total = matches.length;
  const now = await serverNow();
  const rows = matches
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    // Strip fields the card doesn't show; TypeScript's structural typing
    // wouldn't stop a full Attendee from reaching the client payload. The
    // excerpt and the update time are rendered here rather than shipped raw:
    // the markdown parser has no business in the browser bundle, and a "now"
    // from the browser would disagree with the server-rendered markup.
    .map((attendee) => ({
      id: attendee.id,
      name: attendee.name,
      avatarUrl: attendee.avatarUrl,
      pronouns: attendee.pronouns,
      basedIn: attendee.basedIn,
      isHost: attendee.isHost,
      excerpt: profileExcerpt(attendee),
      profileUpdated: attendee.profileUpdatedAt
        ? formatRelativeTime(attendee.profileUpdatedAt, now)
        : null,
    }));

  const redirectTarget = outOfRangePageRedirect({
    basePath: "/guests",
    page,
    total,
    pageSize: PAGE_SIZE,
    params: {
      q: query,
      filter: serializeAttendeeFilters(filters) ?? "",
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
        filters={filters}
        canEditProfile={currentUser !== null}
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
