"use client";
import { ScheduleToolbar } from "./schedule-toolbar";
import { DayGrid } from "./day-grid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { DayText } from "./day-text";
import { Input } from "@/app/input";
import { useState, useContext, useRef } from "react";
import { EventContext } from "../context";
import { getDefaultFoldedDayIds } from "@/utils/schedule-fold";
import { KioskController, useKioskMode } from "./kiosk";
import { SessionModal } from "./session-modal";
import type { DayWithSessions } from "../context";
import { useDragToPan } from "./use-drag-to-pan";
import Footer from "@/app/footer";

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  useDragToPan(scrollerRef, view === "grid");

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

  const toolbar = <ScheduleToolbar event={event} />;

  // Both views own the viewport below the nav bar via the same fixed frame, so
  // the toolbar rests in the same spot and doesn't jump when switching views.
  // The frame's inner container is the only scroll surface; the toolbar lives
  // inside it (as the first item) so it scrolls away with the content, leaving
  // only the sticky room headers pinned in the grid view. globals.css locks
  // window scrolling and hides the site footer while [data-schedule-frame] is
  // mounted; a footer copy ends the schedule content instead.
  const scheduleBody =
    view === "grid" ? (
      <div
        data-testid="schedule-scroll"
        ref={scrollerRef}
        // `grid` with a single minmax(max-content, 1fr) column (rather than
        // block flow) so the toolbar, fold bars and footer stretch to the
        // widest day's grid when it overflows — instead of falling short when
        // scrolled horizontally — yet still fill the viewport when the grid is
        // narrower than it.
        // `cursor` inherits, so links/buttons (session cells, fold toggles, …)
        // are reset to their normal cursor rather than showing the grab hand.
        className="flex-1 w-full overflow-auto cursor-grab grid content-start [&_a]:cursor-pointer [&_button]:cursor-pointer"
        style={{ gridTemplateColumns: "minmax(max-content, 1fr)" }}
      >
        {toolbar}
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
        <Footer inline />
      </div>
    ) : (
      <div
        data-testid="schedule-scroll"
        ref={scrollerRef}
        className="flex-1 w-full overflow-auto flex flex-col items-stretch"
      >
        {toolbar}
        <Input
          className="max-w-3xl w-full my-5 mx-auto"
          placeholder="Search sessions"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
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
        <Footer inline />
      </div>
    );

  return (
    <>
      <div
        data-schedule-frame
        className="fixed inset-x-0 top-16 bottom-0 flex flex-col bg-white"
      >
        {scheduleBody}
      </div>
      {viewSession && (
        <SessionModal sessionId={viewSession} eventSlug={event.slug} />
      )}
      {kiosk && <KioskController />}
    </>
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
