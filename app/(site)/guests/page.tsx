import Link from "next/link";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import { pageRequestSchema } from "@/model/page";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { redirect } from "next/navigation";
import { ParticipantList } from "@/app/(site)/guests/participant-list";
import { z } from "zod";

const PAGE_SIZE = 25;

export function getFilters() {
  return [{ value: "isHost", label: "Session host" }];
}

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>;
}) {
  const params = await searchParams;

  const paramSchema = pageRequestSchema.extend({
    filter: z.enum(getFilters().map((filter) => filter.value)).optional(),
  });

  const { page, query, filter } = paramSchema.parse({
    page: params.page,
    query: params.q,
    filter: params.filter,
  });

  const { rows, total } = await getRepositories().guests.searchForParticipants({
    host: filter === "isHost",
    query: query || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const redirectTarget = outOfRangePageRedirect({
    basePath: "/guests",
    page,
    total,
    pageSize: PAGE_SIZE,
    params: { q: query, filter: filter ?? "" },
  });

  if (redirectTarget) redirect(redirectTarget);

  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Attendees</h1>
        {currentUser && (
          <Link
            href="/guests/edit"
            className="text-sm font-semibold text-rose-500 hover:text-rose-600"
          >
            Edit profile
          </Link>
        )}
      </div>

      <ParticipantList
        filter={filter}
        filters={getFilters()}
        rows={rows}
        pageSize={PAGE_SIZE}
        total={total}
        page={page}
        searchQuery={query}
      />
    </div>
  );
}
