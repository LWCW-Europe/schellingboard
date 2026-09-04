import clsx from "clsx";
import Link from "next/link";
import type { Session, Location } from "@/db/repositories/interfaces";
import {
  formatOptionalTime,
  formatStartTimePlusBreak,
  TIME_FORMAT,
} from "@/utils/utils";
import { useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { UserContext, EventContext, useBreakMinutes } from "../context";
import { CheckCircleIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { LockIcon } from "../lock-icon";
import { viewSessionLinkFromOwner } from "./modal-nav";
import { Markdown } from "@/app/(site)/markdown";
import { stripMarkdown } from "@/utils/markdown";

export function SessionText(props: {
  session: Session;
  locations: Location[];
  eventSlug: string;
}) {
  const { session, locations, eventSlug } = props;
  const searchParams = useSearchParams();
  const { user: currentUser } = useContext(UserContext);
  const { rsvpdForSession, event } = useContext(EventContext);
  const timezone = event?.timezone ?? "UTC";
  const breakMinutes = useBreakMinutes();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const rsvpd = currentUser ? rsvpdForSession(session.id) : false;
  const isHost = currentUser && session.hosts.some((h) => h.id === currentUser);

  const description = session.description || "";
  const plainDescription = stripMarkdown(description);
  const isLongDescription = plainDescription.length > 200;

  const linkProps = viewSessionLinkFromOwner(
    searchParams,
    eventSlug,
    session.id
  );

  return (
    <div className="px-1.5 rounded h-full min-h-10 pt-5 pb-8 relative">
      <div className="flex items-start gap-2">
        <h1 className="font-bold leading-tight flex-1 flex items-center gap-1">
          <Link
            {...linkProps}
            className="cursor-pointer hover:text-link transition-colors flex items-center gap-1"
          >
            {session.closed && (
              <LockIcon className="h-4 w-4 text-fg-muted flex-shrink-0" />
            )}
            {session.title}
          </Link>
        </h1>
        <div className="flex gap-1">
          {isHost && (
            <div
              className="flex items-center"
              title="You are hosting this session"
            >
              <AcademicCapIcon className="h-4 w-4" />
            </div>
          )}
          {rsvpd && (
            <div
              className="flex items-center"
              title="You have RSVP'd to this session"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-2 sm:items-center gap-2">
        <div className="flex gap-2 text-sm text-fg-subtle">
          <div className="flex gap-1">
            <span>
              {formatStartTimePlusBreak(
                session,
                breakMinutes,
                timezone,
                "EEEE"
              )}
              ,{" "}
              {formatStartTimePlusBreak(
                session,
                breakMinutes,
                timezone,
                TIME_FORMAT
              )}{" "}
              - {formatOptionalTime(session.endTime, timezone, TIME_FORMAT)}
            </span>
          </div>
          •
          {session.hosts.length === 0 ? (
            <span>No hosts</span>
          ) : (
            <span>
              {session.hosts.map((h, i) => (
                <span key={h.id}>
                  {i > 0 && ", "}
                  <Link
                    href={`/guests/${h.id}`}
                    className="hover:text-link transition-colors"
                  >
                    {h.name}
                  </Link>
                </span>
              ))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {locations.map((loc) => (
            <LocationTag key={loc.name} location={loc} />
          ))}
        </div>
      </div>
      <div className="text-sm mt-2">
        {isLongDescription && !showFullDescription ? (
          <p className="whitespace-pre-line">
            {plainDescription.substring(0, 200) + "..."}
          </p>
        ) : (
          <Markdown>{description}</Markdown>
        )}
        {isLongDescription && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-link hover:text-link-hover font-medium cursor-pointer"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

export function LocationTag(props: { location: Location }) {
  const { location } = props;
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-full py-0.5 px-2 text-xs font-semibold w-fit border-2 loc-tag",
        `loc-${location.color}`
      )}
    >
      {location.name}
    </div>
  );
}
