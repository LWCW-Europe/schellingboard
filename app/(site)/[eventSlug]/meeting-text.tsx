import clsx from "clsx";
import { DateTime } from "luxon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import type { MeetingView } from "@/utils/meeting-views";
import { blockStatus, meetingTitle } from "@/utils/meeting-rules";
import { EventContext } from "../context";
import { meetingStateClasses } from "./meeting-state-classes";
import { viewMeetingLinkFromOwner } from "./modal-nav";

export function MeetingText({
  meeting,
  eventSlug,
}: {
  meeting: MeetingView;
  eventSlug: string;
}) {
  const searchParams = useSearchParams();
  const { event } = useContext(EventContext);
  const timezone = event?.timezone ?? "UTC";
  const weekday = DateTime.fromISO(meeting.slotStart)
    .setZone(timezone)
    .toFormat("EEEE");

  return (
    <div className="px-1.5 rounded h-full min-h-10 pt-5 pb-8 relative">
      <div className="flex items-start gap-2">
        <h1 className="font-bold leading-tight flex-1 flex items-center gap-1">
          <Link
            {...viewMeetingLinkFromOwner(searchParams, eventSlug, meeting.id)}
            className="cursor-pointer hover:text-link transition-colors flex items-center gap-1"
          >
            {meetingTitle(meeting)}
          </Link>
        </h1>
        <div className="flex items-center" title="Only you see this 1-on-1">
          <UserGroupIcon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-2 sm:items-center gap-2">
        <div className="flex gap-2 text-sm text-fg-subtle">
          <span>
            {weekday}, {meeting.timeLabel}
          </span>
          •<span>{meeting.meetingPoint}</span>
        </div>
        <span
          className={clsx(
            "rounded-full py-0.5 px-2 text-xs font-semibold w-fit border-2",
            meetingStateClasses(meeting.status),
            meeting.status === "accepted" ? "text-fg" : "text-fg-muted"
          )}
        >
          {blockStatus(meeting)}
        </span>
      </div>
      {meeting.message && (
        <p className="text-sm mt-2 whitespace-pre-line line-clamp-3">
          “{meeting.message}”
        </p>
      )}
    </div>
  );
}
