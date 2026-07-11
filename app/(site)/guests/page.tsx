import Link from "next/link";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import { pageRequestSchema } from "@/model/page";
import { outOfRangePageRedirect } from "@/utils/pagination";
import { redirect } from "next/navigation";
import { sanitizeGuest } from "@/utils/guests";
import { GuestList } from "@/app/(site)/guests/guest-list";

const PAGE_SIZE = 25;

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const parsedParams = pageRequestSchema.safeParse({
    page: params.page,
    query: params.q,
  });
  if (!parsedParams.success) {
    return <p className="text-gray-600">Invalid page request {}</p>;
  }

  const { page, query } = parsedParams.data;

  const { rows, total } = await getRepositories().guests.search({
    query: query || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const redirectTarget = outOfRangePageRedirect({
    basePath: "/admin/users",
    page,
    total,
    pageSize: PAGE_SIZE,
    params: { q: query },
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

      <GuestList
        rows={rows.map(sanitizeGuest)}
        pageSize={PAGE_SIZE}
        total={total}
        page={page}
        searchQuery={query}
      />
    </div>
  );
}
