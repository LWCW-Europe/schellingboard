"use client";
import { useEffect, useState, useContext } from "react";
import { format } from "date-fns";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Input } from "@/app/input";
import { SelectHosts } from "@/app/select-hosts";
import {
  convertParamDateTime,
  dateOnDay,
  formatDuration,
  durationMinusBreak,
  TIME_FORMAT,
} from "@/utils/utils";
import { slotDurationOptions, snapDurationToSlots } from "@/utils/slots";
import { MyListbox, type Option } from "./select";
import { viewProposalLinkFromElsewhere } from "./modal-nav";
import type {
  Day,
  Event,
  Guest,
  Location,
  Session,
  SessionProposal,
} from "@/db/repositories/interfaces";
import { ConfirmDeletionModal } from "../modals";
import { UserContext } from "../context";
import { newEmptySession } from "../session_utils";
import { buildSessionInterval } from "@/app/api/session-form-utils";
import { revalidateEvent } from "./session-actions";
import { detectHostClashes, type HostClash } from "./clash-actions";
import { MarkdownHint } from "@/app/(site)/markdown";

interface ErrorResponse {
  message: string;
}

export function SessionForm(props: {
  event: Event;
  days: Day[];
  sessions: Session[];
  locations: Location[];
  guests: Guest[];
  proposals: SessionProposal[];
  maxSessionDuration: number;
}) {
  const {
    event,
    days,
    sessions,
    locations,
    guests,
    proposals,
    maxSessionDuration,
  } = props;
  const { user: currentUser } = useContext(UserContext);
  const eventName = event.name;
  const timezone = event.timezone ?? "UTC";

  const searchParams = useSearchParams();
  const dayParam = searchParams?.get("day");
  const timeParam = searchParams?.get("time");
  const initLocation = searchParams?.get("location");
  const sessionID = searchParams?.get("sessionID");
  const proposalID = searchParams?.get("proposalID");
  const initialProposal = proposals.find((p) => p.id === proposalID) ?? null;
  const session =
    sessions.find((ses) => ses.id === sessionID) || newEmptySession(event.id);
  const initDateTime =
    dayParam && timeParam
      ? convertParamDateTime(dayParam, timeParam, timezone)
      : (session.startTime ?? null);
  const initDay = initDateTime
    ? days.find((d) => dateOnDay(initDateTime, d))
    : undefined;
  let initMinutes: number | undefined;
  if (initDateTime) {
    const dt = DateTime.fromJSDate(initDateTime).setZone(timezone);
    initMinutes = dt.hour * 60 + dt.minute;
  }

  // Compute default hosts for new sessions (no initial proposal, no sessionID).
  // Also used as the "reset" target when the user un-selects a proposal.
  const defaultHosts: Guest[] = currentUser
    ? guests.filter((g) => g.id === currentUser)
    : [];
  const initialHosts: Guest[] = initialProposal
    ? guests.filter((g) => initialProposal.hosts.some((h) => h.id === g.id))
    : sessionID
      ? guests.filter((g) => session.hosts.some((h) => h.id === g.id))
      : defaultHosts;
  const sessionDuration = sessionID
    ? Math.round(
        ((session.endTime?.valueOf() ?? 0) -
          (session.startTime?.valueOf() ?? 0)) /
          1000 /
          60
      )
    : null;

  const [proposal, setProposal] = useState<SessionProposal | null>(
    initialProposal
  );
  const [usedProposal, setUsedProposal] = useState<boolean>(!!initialProposal);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialProposal?.title ?? session.title);
  const [description, setDescription] = useState(
    initialProposal?.description ?? session.description
  );
  const [closed, setClosed] = useState(session.closed);
  const [day, setDay] = useState(initDay ?? days[0]);
  const [locationId, setLocationId] = useState<string | undefined>(
    locations.find((l) => l.name === initLocation)?.id ??
      session.locations[0]?.id
  );
  const startTimes = getAvailableStartTimes(
    day,
    sessions,
    session,
    maxSessionDuration,
    event.breakMinutes,
    event.slotIncrementMinutes,
    timezone,
    locationId
  );
  const initTimeValid = startTimes.some(
    (st) => st.minutesFromMidnight === initMinutes
  );
  const [startTime, setStartTime] = useState<number | undefined>(
    initTimeValid ? initMinutes : undefined
  );
  // Derived: the currently-selected startTime if it is still available under
  // the current location/day, otherwise undefined. Avoids a setState-in-effect
  // reset by not storing invalid values downstream.
  const effectiveStartTime = startTimes.some(
    (st) => st.minutesFromMidnight === startTime && st.available
  )
    ? startTime
    : undefined;
  const maxDuration =
    startTimes.find((st) => st.minutesFromMidnight === effectiveStartTime)
      ?.maxDuration ?? maxSessionDuration;
  // Proposal durations are free-form, so they get snapped to the nearest
  // selectable slot multiple; an existing session's duration already sits on
  // the grid and passes through unchanged.
  const [duration, setDuration] = useState<number>(
    initialProposal?.durationMinutes
      ? snapDurationToSlots(
          initialProposal.durationMinutes,
          event.slotIncrementMinutes,
          maxDuration
        )
      : (sessionDuration ??
          snapDurationToSlots(60, event.slotIncrementMinutes, maxDuration))
  );
  // Derived: clamp duration to maxDuration. Preserves user-set value so it
  // restores when the limit widens again.
  const effectiveDuration = duration > maxDuration ? maxDuration : duration;
  const [hosts, setHosts] = useState<Guest[]>(initialHosts);

  function applyProposal(next: SessionProposal | null) {
    setProposal(next);
    if (next) {
      setTitle(next.title);
      setDescription(next.description ?? "");
      setHosts(guests.filter((g) => next.hosts.some((h) => h.id === g.id)));
      if (next.durationMinutes) {
        setDuration(
          snapDurationToSlots(
            next.durationMinutes,
            event.slotIncrementMinutes,
            maxDuration
          )
        );
      }
      setUsedProposal(true);
    } else if (usedProposal) {
      setTitle("");
      setDescription("");
      setHosts(defaultHosts);
    }
  }

  let dummySession = newEmptySession(event.id);
  if (effectiveStartTime !== undefined && day) {
    const { start, end } = buildSessionInterval(
      day,
      effectiveStartTime,
      effectiveDuration,
      timezone
    );
    dummySession = {
      ...newEmptySession(event.id),
      startTime: start,
      endTime: end,
      id: sessionID || "",
    };
  }

  // Clash detection runs on the server (see clash-actions): a host's RSVP'd
  // sessions are private, so the client never receives them — the server only
  // reports that the host is "busy" for the overlapping interval.
  const [hostClashes, setHostClashes] = useState<HostClash[]>([]);
  const [isCheckingClashes, setIsCheckingClashes] = useState(false);

  const hostIdsKey = hosts.map((h) => h.id).join(",");
  const candidateStart = dummySession.startTime?.getTime();
  const candidateEnd = dummySession.endTime?.getTime();

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!candidateStart || !candidateEnd || !hostIdsKey) {
        setHostClashes((prev) => (prev.length === 0 ? prev : []));
        return;
      }
      setIsCheckingClashes(true);
      try {
        const clashes = await detectHostClashes({
          eventId: event.id,
          hostIds: hostIdsKey.split(","),
          start: new Date(candidateStart).toISOString(),
          end: new Date(candidateEnd).toISOString(),
          excludeSessionId: sessionID ?? null,
        });
        if (!cancelled) setHostClashes(clashes);
      } catch (error) {
        console.error("Error detecting clashes:", error);
      } finally {
        if (!cancelled) setIsCheckingClashes(false);
      }
    };
    void check();
    return () => {
      cancelled = true;
    };
  }, [event.id, hostIdsKey, candidateStart, candidateEnd, sessionID]);

  const clashErrors = hostClashes.map((clash) => {
    const formatTime = (iso: string) =>
      DateTime.fromISO(iso).setZone(timezone).toFormat(TIME_FORMAT);
    const interval = `from ${formatTime(clash.start)} to ${formatTime(clash.end)}`;
    return clash.kind === "hosting"
      ? `${clash.hostName} is hosting ${clash.title} ${interval}`
      : `${clash.hostName} is busy ${interval}`;
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Submit = async () => {
    setIsSubmitting(true);
    setError(null);
    const location = locations.find((loc) => loc.id === locationId);
    if (!location || !day || effectiveStartTime === undefined) {
      setError("Missing required fields");
      setIsSubmitting(false);
      return;
    }
    const endpoint = sessionID ? "/api/update-session" : "/api/add-session";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: sessionID,
        title,
        description,
        closed,
        day,
        location,
        startTimeMinutes: effectiveStartTime,
        duration: effectiveDuration,
        hosts,
        proposal: proposal?.id ?? session.proposalId,
        timezone,
      }),
    });
    if (res.ok) {
      const actionType = sessionID ? "updated" : "added";
      await revalidateEvent(event.slug);
      router.push(
        `/${event.slug}/add-session/confirmation?actionType=${actionType}`
      );
      console.log(`Session ${actionType} successfully`);
    } else {
      let errorMessage = "Failed to update session";
      try {
        const errorData = (await res.json()) as ErrorResponse;
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = res.statusText || `Server error (${res.status})`;
      }
      setError(errorMessage);
      console.error("Error updating session:", {
        status: res.status,
        statusText: res.statusText,
      });
    }
    setIsSubmitting(false);
  };
  const Delete = async () => {
    setError(null);
    setIsSubmitting(true);
    const res = await fetch("/api/delete-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: sessionID,
      }),
    });
    if (res.ok) {
      console.log("Session deleted successfully");
      await revalidateEvent(event.slug);
      router.push(`/${event.slug}/edit-session/deletion-confirmation`);
    } else {
      let errorMessage = "Failed to delete session";
      try {
        const errorData = (await res.json()) as ErrorResponse;
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = res.statusText || `Server error (${res.status})`;
      }
      setError(errorMessage);
      console.error("Error deleting session:", {
        status: res.status,
        statusText: res.statusText,
      });
    }
    setIsSubmitting(false);
  };

  const nullProposalOpts: Option[] = [
    {
      value: "",
      display: "[none]",
      available: true,
    },
  ];
  const proposalSelectOpts = nullProposalOpts.concat(
    proposals.map((pr) => ({
      value: pr.id,
      display: pr.title,
      available: true,
    }))
  );

  return (
    <div className="flex flex-col gap-4">
      <Link
        className="bg-rose-400 text-white font-semibold py-2 px-4 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
        href={`/${event.slug}`}
      >
        Back to schedule
      </Link>
      <div>
        <h2 className="text-2xl font-bold">
          {eventName}: {sessionID ? "Edit" : "Add a"} session
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          {sessionID
            ? ""
            : "Fill out this form to add a session to the schedule! "}
          Your session will be added to the schedule immediately, but we may
          reach out to you about rescheduling, relocating, or cancelling.
        </p>
      </div>
      {proposals.length > 0 && !sessionID && (
        <div className="flex flex-col gap-1 w-72">
          <label className="font-medium">Proposal</label>
          <MyListbox
            currValue={proposal?.id ?? ""}
            setCurrValue={(id) =>
              applyProposal(proposals.find((p) => p.id === id) ?? null)
            }
            options={proposalSelectOpts}
            placeholder={"Pre-fill from proposal"}
            truncateText={false}
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Session title
          <RequiredStar />
        </label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">Description</label>
        <textarea
          value={description}
          className="rounded-md text-sm resize-y h-24 border bg-white px-4 py-2 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 invalid:placeholder-red-300 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none"
          onChange={(e) => setDescription(e.target.value)}
        />
        <MarkdownHint />
      </div>

      {/* Closed session checkbox */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={closed}
            onChange={(e) => setClosed(e.target.checked)}
            className="h-4 w-4 text-rose-400 focus:ring-rose-400 border-gray-300 rounded"
          />
          Closed session
        </label>
        <p className="text-sm text-gray-500 ml-6">
          Check this if attendees can at most arrive 5 minutes late. If they
          arrive later they may not join and should not knock or otherwise
          disrupt the session.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Hosts
          <RequiredStar />
        </label>
        <p className="text-sm text-gray-500">
          You and any cohosts who have agreed to host this session with you. All
          hosts will get an email confirmation when this form is submitted.
        </p>
        <SelectHosts
          guests={guests}
          hosts={hosts}
          setHosts={setHosts}
          selectMany={true}
        />
      </div>
      <div className="flex flex-col gap-1 w-72">
        <label className="font-medium">
          Location
          <RequiredStar />
        </label>
        <MyListbox
          currValue={locationId}
          setCurrValue={setLocationId}
          options={locations.map((loc) => ({
            value: loc.id,
            display: loc.name,
            available: true,
            helperText: `max ${loc.capacity}`,
          }))}
          placeholder={"Select a location"}
          truncateText={true}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Day
          <RequiredStar />
        </label>
        <SelectDay days={days} day={day} setDay={setDay} />
      </div>
      <div className="flex flex-col gap-1 w-72">
        <label className="font-medium">
          Start Time
          <RequiredStar />
        </label>
        <MyListbox
          currValue={
            effectiveStartTime !== undefined
              ? String(effectiveStartTime)
              : undefined
          }
          setCurrValue={(v) => setStartTime(parseInt(v, 10))}
          options={startTimes.map((st) => ({
            value: String(st.minutesFromMidnight),
            display: st.formattedTime,
            available: st.available,
          }))}
          placeholder={"Select a start time"}
          truncateText={true}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Duration
          <RequiredStar />
        </label>
        <SelectDuration
          duration={effectiveDuration}
          setDuration={setDuration}
          maxDuration={maxDuration}
          breakMinutes={event.breakMinutes}
          slotIncrementMinutes={event.slotIncrementMinutes}
        />
      </div>
      {sessionID && session.proposalId && (
        <p className="text-sm text-gray-600">
          This session was scheduled from a proposal. See it{" "}
          <Link
            {...viewProposalLinkFromElsewhere(event.slug, session.proposalId)}
            className="text-rose-500 underline hover:text-rose-600 transition-colors"
          >
            here
          </Link>
          .
        </p>
      )}
      {clashErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">Warning: schedule clash</p>
          {clashErrors.map((error) => (
            <p key={error} className="text-sm font-medium">
              - {error}
            </p>
          ))}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}
      <button
        type="submit"
        className="bg-rose-400 text-white font-semibold py-2 rounded shadow disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500 mx-auto px-12"
        disabled={
          !title ||
          effectiveStartTime === undefined ||
          !hosts.length ||
          !locationId ||
          !day ||
          !effectiveDuration ||
          isCheckingClashes ||
          isSubmitting
        }
        onClick={() => void Submit()}
      >
        Submit
      </button>
      {sessionID && (
        <ConfirmDeletionModal
          btnDisabled={isSubmitting}
          confirm={Delete}
          itemName="session"
        />
      )}
    </div>
  );
}

const RequiredStar = () => <span className="text-rose-500 mx-1">*</span>;

type StartTime = {
  formattedTime: string;
  minutesFromMidnight: number;
  time: number;
  maxDuration: number;
  available: boolean;
};
function getAvailableStartTimes(
  day: Day,
  sessions: Session[],
  currentSession: Session,
  maxSessionDuration: number,
  breakMinutes: number,
  slotIncrementMinutes: number,
  timezone: string,
  locationId?: string
) {
  const locationSelected = !!locationId;
  const filteredSessions = (
    locationSelected
      ? sessions.filter(
          (s) =>
            s.locations.some((l) => l.id === locationId) &&
            s.id !== currentSession.id
        )
      : sessions
  ).filter((s) => (s.startTime?.getTime() ?? 0) < day.end.getTime());
  const sortedSessions = filteredSessions.sort(
    (a, b) => (a.startTime?.getTime() ?? 0) - (b.startTime?.getTime() ?? 0)
  );
  const startTimes: StartTime[] = [];
  for (
    let t = day.startBookings.getTime();
    t < day.endBookings.getTime();
    t += slotIncrementMinutes * 60 * 1000
  ) {
    const dt = DateTime.fromMillis(t).setZone(timezone);
    // The break sits at the start of each slot, so the displayed start is
    // pushed back by breakMinutes (e.g. a 9:00 slot shows as 9:10). The stored
    // value (minutesFromMidnight) stays on the round slot boundary.
    const formattedTime = dt
      .plus({ minutes: breakMinutes })
      .toFormat(TIME_FORMAT);
    const minutesFromMidnight = dt.hour * 60 + dt.minute;
    if (locationSelected) {
      const sessionNow = sortedSessions.find(
        (session) =>
          (session.startTime?.getTime() ?? 0) <= t &&
          (session.endTime?.getTime() ?? 0) > t
      );
      if (sessionNow) {
        startTimes.push({
          formattedTime,
          minutesFromMidnight,
          time: t,
          maxDuration: 0,
          available: false,
        });
      } else {
        const nextSession = sortedSessions.find(
          (session) => (session.startTime?.getTime() ?? 0) > t
        );
        const latestEndTime = nextSession
          ? nextSession.startTime!.getTime()
          : day.endBookings.getTime();
        startTimes.push({
          formattedTime,
          minutesFromMidnight,
          time: t,
          maxDuration: Math.min(
            (latestEndTime - t) / 1000 / 60,
            maxSessionDuration
          ),
          available: true,
        });
      }
    } else {
      startTimes.push({
        formattedTime,
        minutesFromMidnight,
        time: t,
        maxDuration: maxSessionDuration,
        available: true,
      });
    }
  }
  return startTimes;
}

function SelectDuration(props: {
  duration: number;
  setDuration: (duration: number) => void;
  maxDuration?: number;
  breakMinutes: number;
  slotIncrementMinutes: number;
}) {
  const { duration, setDuration, maxDuration, breakMinutes } = props;
  const limit = maxDuration ?? 180;
  const availableDurations = slotDurationOptions(
    props.slotIncrementMinutes,
    limit
  );

  return (
    <fieldset>
      <div className="space-y-4">
        {availableDurations.map((value) => (
          <div key={value} className="flex items-center">
            <input
              id={`duration-${value}`}
              type="radio"
              checked={value === duration}
              onChange={() => setDuration(value)}
              className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
            />
            <label
              htmlFor={`duration-${value}`}
              className="ml-3 block text-sm font-medium leading-6 text-gray-900"
            >
              {formatDuration(durationMinusBreak(value, breakMinutes), true)}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function SelectDay(props: {
  days: Day[];
  day: Day;
  setDay: (day: Day) => void;
}) {
  const { days, day, setDay } = props;
  return (
    <fieldset>
      <div className="space-y-4">
        {days.map((d) => {
          const formattedDay = format(d.start, "EEEE, MMMM d");
          return (
            <div key={d.id} className="flex items-center">
              <input
                id={d.id}
                type="radio"
                checked={d.id === day.id}
                onChange={() => setDay(d)}
                className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
              />
              <label
                htmlFor={d.id}
                className="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                {formattedDay}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
