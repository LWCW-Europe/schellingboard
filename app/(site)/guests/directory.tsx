"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Attendee } from "@/db/repositories/interfaces";
import { AttendeeList } from "@/app/(site)/guests/attendee-list";
import { useDirectoryView } from "@/app/(site)/guests/directory-view";
import { ProfileModal } from "@/app/(site)/guests/profile-modal";

/**
 * The attendee directory, list and profile together. Both `/guests` and
 * `/guests/<id>` render this same component from the layout, and the open
 * profile is read off the path — so moving between profiles is a `pushState`
 * away and the list underneath is never unmounted or re-fetched.
 */
export function AttendeeDirectory({
  attendees,
  now,
  currentUserId,
}: {
  attendees: Attendee[];
  now: Date;
  currentUserId: string | null;
}) {
  const view = useDirectoryView(attendees, now);
  // `/guests/edit` has its own layout outside this one, so anything left here
  // is a guest id.
  const openGuestId = /^\/guests\/([^/]+)\/?$/.exec(usePathname())?.[1];

  // Wider than the max-w-2xl pages around it: the rows carry a name, a badge
  // and an update time. That width can reach the viewport edge between sm and
  // lg, so the horizontal padding stays on at every size.
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Attendees</h1>
          {currentUserId && (
            <Link
              href="/guests/edit"
              className="text-sm font-semibold text-brand-fg hover:text-brand-fg-hover"
            >
              Edit profile
            </Link>
          )}
        </div>

        <AttendeeList view={view} canEditProfile={currentUserId !== null} />
      </div>

      {openGuestId && (
        <ProfileModal
          guestId={decodeURIComponent(openGuestId)}
          view={view}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}
