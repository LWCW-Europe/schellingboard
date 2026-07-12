"use client";
import { ScheduleSettings } from "./schedule-settings";
import { DayGrid } from "./day-grid";
import {
  CalendarIcon,
  LinkIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { DayText } from "./day-text";
import { Input } from "@/app/input";
import { useState, useContext } from "react";
import { EventContext } from "../context";
import { hasPhases } from "@/app/(site)/utils/events";
import Link from "next/link";
import { getDefaultFoldedDayIds } from "@/utils/schedule-fold";
import { KioskController, useKioskMode } from "./kiosk";
import { SessionModal } from "./session-modal";
import type { DayWithSessions } from "../context";
import { Markdown } from "@/app/(site)/markdown";

export function EventDisplay() {
  const { event, days, locations, guests, rsvps, now } =
    useContext(EventContext);
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "grid";
  const viewSession = searchParams.get("viewSession");
  const kiosk = useKioskMode();
  const [search, setSearch] = useState("");
  const [unfoldedDayIds, setUnfoldedDayIds] = useState<Set<string>>(
    () => new Set()
  );

  if (!event) return <div>No event data available</div>;

  const daysForEvent = days.filter((day) => day.eventId === event.id);
  const defaultFoldedDayIds = getDefaultFoldedDayIds(daysForEvent, now);
  const isFolded = (dayId: string) =>
    defaultFoldedDayIds.has(dayId) && !unfoldedDayIds.has(dayId);
  const toggleDayFold = (dayId: string) =>
    setUnfoldedDayIds((prev) => {
      const next = new Set(prev);
      if (next.has(dayId)) next.delete(dayId);
      else next.add(dayId);
      return next;
    });
  const locationsForEvent = locations;
  const multipleDays = event.start.getTime() !== event.end.getTime();

  return (
    <div className="flex flex-col items-start w-full">
      <div className="mx-2">
        <h1 className="sm:text-4xl text-3xl font-bold mt-20">
          {event.name} Schedule
        </h1>
        <div className="flex text-gray-500 text-sm mt-1 gap-5 font-medium">
          <span className="flex gap-1 items-center">
            <CalendarIcon className="h-4 w-4 stroke-2" />
            <span>
              {DateTime.fromJSDate(event.start)
                .setZone(event.timezone)
                .toFormat("LLL d")}
              {multipleDays && (
                <>
                  {" - "}
                  {DateTime.fromJSDate(event.end)
                    .setZone(event.timezone)
                    .toFormat("LLL d")}
                </>
              )}
              {" · "}
              {event.timezone}
            </span>
          </span>
          <a
            className="flex gap-1 items-center hover:underline"
            href={`https://${event.website}`}
          >
            <LinkIcon className="h-4 w-4 stroke-2" />
            <span>{event.website}</span>
          </a>
        </div>
        <div className="text-gray-900 mt-3 mb-5">
          <Markdown>{event.description}</Markdown>
        </div>
        {hasPhases(event) && (
          <div className="mb-5">
            <Link
              href={`/${event.slug}/proposals`}
              className={`bg-rose-400 hover:bg-rose-500 transition-colors text-white px-4 py-2 rounded-md flex items-center gap-2 max-w-fit`}
            >
              <ClipboardDocumentListIcon className="h-4 w-4" />
              View Session Proposals
            </Link>
          </div>
        )}
      </div>
      <div className="mb-10 w-full">
        <ScheduleSettings guests={guests} />
      </div>
      {view !== "grid" && (
        <Input
          className="max-w-3xl w-full mb-5 mx-auto"
          placeholder="Search sessions"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      )}
      {view === "grid" ? (
        // One large scroll container for everything:
        // Time, room name and day are sticky, and every new day day+room names get replaced.
        // - `dvh` (not `vh`) so the mobile address bar showing/hiding doesn't change the height.
        <div
          data-testid="schedule-scroll"
          // `grid` with a single max-content column (rather than block flow)
          // so the fold bar's `w-full` stretches to match the widest day's
          // grid instead of the container's own (viewport-bound) width —
          // otherwise its background falls short when scrolled horizontally.
          className="w-full overflow-auto sticky top-16 max-h-[calc(100dvh-6rem)] sm:max-h-[calc(100dvh-8rem)] rounded-lg border border-gray-200 grid"
          style={{ gridTemplateColumns: "max-content" }}
        >
          {daysForEvent.map((day) => (
            <div key={day.id} className="contents">
              {defaultFoldedDayIds.has(day.id) && (
                <DayFoldBar
                  day={day}
                  timezone={event.timezone}
                  folded={isFolded(day.id)}
                  onToggle={() => toggleDayFold(day.id)}
                />
              )}
              {!isFolded(day.id) && (
                <DayGrid
                  day={day}
                  locations={locationsForEvent}
                  guests={guests}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-12 w-full">
          {daysForEvent.map((day) => (
            <div key={day.id}>
              {defaultFoldedDayIds.has(day.id) && (
                <div className="max-w-3xl mx-auto">
                  <DayFoldBar
                    day={day}
                    timezone={event.timezone}
                    folded={isFolded(day.id)}
                    onToggle={() => toggleDayFold(day.id)}
                  />
                </div>
              )}
              {!isFolded(day.id) && (
                <DayText
                  day={day}
                  search={search}
                  locations={locationsForEvent}
                  rsvps={view === "rsvp" ? rsvps : []}
                  eventSlug={event.slug}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {viewSession && (
        <SessionModal sessionId={viewSession} eventSlug={event.slug} />
      )}
      {kiosk && <KioskController />}
    </div>
  );
}

// Collapsed/expandable header for a day that has already passed. In the grid
// view the label sticks to the left edge so it stays readable while the wide
// grid is scrolled horizontally.
function DayFoldBar(props: {
  day: DayWithSessions;
  timezone: string;
  folded: boolean;
  onToggle: () => void;
}) {
  const { day, timezone, folded, onToggle } = props;
  const date = DateTime.fromJSDate(day.start).setZone(timezone);
  const Chevron = folded ? ChevronRightIcon : ChevronDownIcon;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="block w-full bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200 text-left"
    >
      <span className="sticky left-0 inline-flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500">
        <Chevron className="h-3.5 w-3.5 stroke-2" />
        <span className="font-medium">{date.toFormat("EEEE, MMMM d")}</span>
        <span>· day has passed · {folded ? "show" : "hide"}</span>
      </span>
    </button>
  );
}
