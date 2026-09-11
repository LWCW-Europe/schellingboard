"use client";
import {
  Fragment,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import type { Location, Session } from "@/db/repositories/interfaces";
import type { DayWithSessions } from "@/app/(site)/context";
import {
  EventContext,
  UserContext,
  useBreakMinutes,
  useSlotIncrement,
} from "@/app/(site)/context";
import { getNowOffsetPx } from "@/utils/slots";
import {
  agendaGroups,
  nowMarkerIndex,
  timeState,
  type TimeState,
} from "@/utils/agenda";
import type { MeetingView } from "@/utils/meeting-views";
import { meetingsForDay } from "@/utils/meeting-column";
import { statusLine } from "@/utils/meeting-rules";
import { useMyMeetings } from "./use-meetings";
import {
  formatDayLabel,
  formatOptionalTime,
  formatSlotLabel,
  TIME_FORMAT,
} from "@/utils/utils";
import { LockIcon } from "../lock-icon";
import {
  viewMeetingLinkFromOwner,
  viewSessionLinkFromOwner,
} from "./modal-nav";

// One day as a list, every session under the time it starts: what a narrow
// screen can scroll through, where the grid has to be scrolled both ways.
export function DayAgenda(props: {
  day: DayWithSessions;
  locations: Location[];
  eventSlug: string;
}) {
  const { day, locations, eventSlug } = props;
  const { event, now } = useContext(EventContext);
  const timezone = event?.timezone ?? "UTC";
  const searchParams = useSearchParams();
  const slotIncrement = useSlotIncrement();
  const breakMinutes = useBreakMinutes();
  const { meetings } = useMyMeetings();
  const groups = useMemo(() => {
    const locParams = searchParams?.getAll("loc") ?? [];
    const locationsFromParams = locations.filter((loc) =>
      locParams.includes(loc.name)
    );
    const includedLocations =
      locationsFromParams.length === 0 ? locations : locationsFromParams;
    return agendaGroups({
      sessions: day.sessions.filter((session) =>
        includedLocations.some((loc) =>
          session.locations.some((l) => l.id === loc.id)
        )
      ),
      meetings: meetingsForDay(meetings ?? [], day),
      locations,
      breakMinutes,
    }).map((group) => ({
      ...group,
      label: formatSlotLabel(group.start, day.start, timezone),
    }));
  }, [day, locations, searchParams, meetings, breakMinutes, timezone]);
  // Same condition as the grid's now line, so "Now" in the toolbar always has
  // something to jump to when it is offered.
  const nowIndex =
    getNowOffsetPx(day, now, slotIncrement) === null
      ? null
      : nowMarkerIndex(groups, now);
  const headingId = `agenda-day-${day.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="w-full max-w-3xl mx-auto px-2"
    >
      <h2 id={headingId} className="pt-4 pb-1 text-lg font-bold">
        {formatDayLabel(day, timezone)}
      </h2>
      {groups.length === 0 && (
        <p className="text-fg-subtle italic text-sm">No sessions</p>
      )}
      {groups.map((group, i) => {
        return (
          <Fragment key={group.start.getTime()}>
            {nowIndex === i && <NowMarker now={now} timezone={timezone} />}
            <section aria-label={group.label}>
              <h3 className="sticky top-0 z-10 bg-surface border-b border-line-subtle py-1 text-sm font-semibold">
                {group.label}
              </h3>
              <ul className="divide-y divide-line-subtle">
                {group.meetings.map((meeting) => (
                  <MeetingRow
                    key={meeting.id}
                    meeting={meeting}
                    eventSlug={eventSlug}
                    timezone={timezone}
                  />
                ))}
                {group.sessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    start={group.start}
                    locations={locations}
                    eventSlug={eventSlug}
                    timezone={timezone}
                  />
                ))}
              </ul>
            </section>
          </Fragment>
        );
      })}
      {nowIndex === groups.length && (
        <NowMarker now={now} timezone={timezone} />
      )}
    </section>
  );
}

// The agenda's counterpart of the grid's red now line; carries the same test
// id so the toolbar's "Now" scrolls to it unchanged.
function NowMarker(props: { now: Date; timezone: string }) {
  return (
    <div
      data-testid="now-line"
      className="flex items-center gap-2 py-1 text-xs font-semibold text-danger-fg"
    >
      <span aria-hidden className="h-0.5 flex-1 bg-danger" />
      Now · {formatOptionalTime(props.now, props.timezone, TIME_FORMAT)}
      <span aria-hidden className="h-0.5 flex-1 bg-danger" />
    </div>
  );
}

function AgendaRow(props: {
  state: TimeState;
  swatchClass: string;
  title: ReactNode;
  details: ReactNode;
  trailing?: ReactNode;
  link?: ComponentProps<typeof Link>;
}) {
  const { state, swatchClass, title, details, trailing, link } = props;
  const body = (
    <>
      <span
        aria-hidden
        className={clsx(
          "w-1 shrink-0 rounded-full",
          swatchClass,
          state === "ended" && "opacity-40"
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-1 text-sm font-medium leading-tight">
          {title}
        </span>
        <span className="block text-xs text-fg-subtle">
          {state === "running" && (
            <span className="mr-1 rounded bg-danger px-1 font-semibold text-on-danger">
              Now
            </span>
          )}
          {details}
        </span>
      </span>
      {trailing && (
        <span className="flex shrink-0 items-center gap-1 self-start text-xs text-fg-subtle">
          {trailing}
        </span>
      )}
    </>
  );
  const className = clsx(
    "flex gap-2 py-2",
    link && "hover:bg-surface-hover",
    state === "ended" && "text-fg-muted"
  );
  return (
    <li>
      {link ? (
        <Link {...link} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  );
}

function SessionRow(props: {
  session: Session;
  /** The group's shown start, which is the session's too. */
  start: Date;
  locations: Location[];
  eventSlug: string;
  timezone: string;
}) {
  const { session, start, locations, eventSlug, timezone } = props;
  const searchParams = useSearchParams();
  const { user } = useContext(UserContext);
  const { rsvpdForSession, localSessions, now } = useContext(EventContext);
  const state = timeState(start, session.endTime ?? start, now);
  const until = `until ${formatOptionalTime(session.endTime, timezone, TIME_FORMAT)}`;
  // Through the event's visible rooms, as the other views: a session's own
  // list can still name a room since hidden.
  const inRooms = locations.filter((loc) =>
    session.locations.some((l) => l.id === loc.id)
  );
  const rooms =
    inRooms.length === locations.length && inRooms.length > 1
      ? "All rooms"
      : inRooms.map((r) => r.name).join(", ");
  const color = inRooms[0]?.color;

  if (session.blocker) {
    return (
      <AgendaRow
        state={state}
        swatchClass="bg-line"
        title={session.title || "Blocked"}
        details={`${rooms} · ${until}`}
      />
    );
  }

  const rsvpd = user ? rsvpdForSession(session.id) : false;
  const isHost = !!user && session.hosts.some((h) => h.id === user);
  const numRsvps =
    localSessions.find((s) => s.id === session.id)?.numRsvps ??
    session.numRsvps;
  const hosts = session.hosts.map((h) => h.name).join(", ");
  return (
    <AgendaRow
      state={state}
      swatchClass={clsx("loc-swatch", color && `loc-${color}`)}
      link={viewSessionLinkFromOwner(searchParams, eventSlug, session.id)}
      title={
        <>
          {session.closed && (
            <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-muted" />
          )}
          <span className="line-clamp-2">{session.title}</span>
        </>
      }
      details={[rooms, until, hosts].filter(Boolean).join(" · ")}
      trailing={
        <>
          {isHost && (
            <AcademicCapIcon
              className="h-4 w-4"
              role="img"
              aria-label="You are hosting this session"
            />
          )}
          {rsvpd && (
            <CheckCircleIcon
              className="h-4 w-4"
              role="img"
              aria-label="You have RSVP'd to this session"
            />
          )}
          <UserIcon aria-hidden className="h-3 w-3" />
          {numRsvps}
        </>
      }
    />
  );
}

// One of the viewer's own 1-on-1s; opens the same popup as the grid's column.
function MeetingRow(props: {
  meeting: MeetingView;
  eventSlug: string;
  timezone: string;
}) {
  const { meeting, eventSlug, timezone } = props;
  const searchParams = useSearchParams();
  const { now } = useContext(EventContext);
  const end = new Date(meeting.slotEnd);
  return (
    <AgendaRow
      state={timeState(new Date(meeting.slotStart), end, now)}
      swatchClass={
        meeting.status === "accepted" ? "bg-brand-accent" : "bg-line"
      }
      link={viewMeetingLinkFromOwner(searchParams, eventSlug, meeting.id)}
      title={`1-on-1 with ${meeting.otherName}`}
      details={`${meeting.meetingPoint} · until ${formatOptionalTime(end, timezone, TIME_FORMAT)} · ${statusLine(meeting)}`}
    />
  );
}
