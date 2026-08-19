import Link from "next/link";
import { getRepositories } from "@/db/container";
import { cookies } from "next/headers";
import { AttendeeList } from "@/app/(site)/guests/attendee-list";
import { serverNow } from "@/utils/dev-clock-server";
import { verifiedCurrentUser } from "@/utils/acting-guest";

export default async function GuestsPage() {
  // The whole directory, unfiltered: search, filters, sorting and paging all
  // happen in the browser (see attendee-list.tsx). `listAttendees` returns
  // public profile fields only — `Attendee` has no `info`, so no email can
  // reach the client payload this way.
  const attendees = await getRepositories().guests.listAttendees();
  const now = await serverNow();
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
        attendees={attendees}
        now={now}
        canEditProfile={currentUser !== null}
      />
    </div>
  );
}
