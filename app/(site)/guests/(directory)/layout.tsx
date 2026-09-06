import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { AttendeeDirectory } from "@/app/(site)/guests/directory";
import { serverNow } from "@/utils/dev-clock-server";
import { verifiedCurrentUser } from "@/utils/acting-guest";

/**
 * The list is a layout, not a page, so `/guests` and `/guests/<id>` share one
 * instance of it: rendering it per page would unmount it every time a profile
 * opened, losing the reader's place in the list. The route group keeps
 * `/guests/edit` out of it.
 */
export default async function AttendeeDirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The whole directory, unfiltered: search, filters, sorting and paging all
  // happen in the browser (see directory-view.ts). `listAttendees` returns
  // public profile fields only — `Attendee` has no `info`, so no email can
  // reach the client payload this way.
  const now = await serverNow();
  const attendees = await getRepositories().guests.listAttendees(now);
  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);

  return (
    <>
      <AttendeeDirectory
        attendees={attendees}
        now={now}
        currentUserId={currentUser}
      />
      {children}
    </>
  );
}
