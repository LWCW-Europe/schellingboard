"use client";
import { LocationCol } from "./location-col";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { TIME_FORMAT } from "@/utils/utils";
import { getNumSlots, getNowOffsetPx } from "@/utils/slots";
import { useKioskMode } from "./kiosk";
import { useContext } from "react";
import Image from "next/image";
import { isUnoptimized } from "@/utils/image-loader";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "./tooltip";
import { DateTime } from "luxon";
import type { Guest, Location } from "@/db/repositories/interfaces";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext, useSlotIncrement } from "@/app/(site)/context";
import { meetingsForDay, takesPartInMeetings } from "@/utils/meeting-column";
import { MeetingsCol } from "./meetings-col";
import { OneOnOnePicture } from "./one-on-one-picture";
import { useMyMeetings } from "./use-meetings";

// Width of the left time-axis gutter. The body rows show `HH:mm` labels and the
// header corner shows the day's date, so it has to fit a short date.
const GUTTER = "2.5rem";

// One day is a single CSS grid: column 1 is the time gutter, the remaining
// columns are the locations. The room-name row sticks to the top and the gutter
// sticks to the left, so both stay visible while you scroll the schedule. No
// JS, no scroll listeners — just `position: sticky` inside the scroll container
// that wraps every day (see `EventDisplay`).
export function DayGrid(props: {
  locations: Location[];
  day: DayWithSessions;
  guests: Guest[];
}) {
  const { day, locations, guests } = props;
  const { event, now } = useContext(EventContext);
  const timezone = event?.timezone ?? "UTC";
  const searchParams = useSearchParams();
  const { meetings, availability } = useMyMeetings();
  // The viewer's own 1-on-1s, outside the ?loc= filter below: the column is
  // not a location, so filtering the schedule down to one room must not drop
  // it (issue #392, section 2.6). It is there on every day for anyone taking
  // part -- open to 1-on-1s, or with one arranged -- so the rooms line up
  // from one day to the next, and gone entirely for everyone else, so it
  // costs them no width on a phone.
  //
  // Nothing is known until the fetch lands, so the first paint is without
  // the column and the rooms shift right when it arrives. Accepted: the
  // schedule is a shared server render, and reserving the width for a
  // viewer who might turn out to have nothing would shift it the other way
  // for the many.
  const showMeetings =
    meetings !== null &&
    availability !== null &&
    takesPartInMeetings(meetings, availability);
  const myMeetings = meetings ? meetingsForDay(meetings, day) : [];
  const myAvailability = availability ?? [];
  const locParams = searchParams?.getAll("loc");
  const locationsFromParams = locations.filter((loc) =>
    locParams?.includes(loc.name)
  );
  const includedLocations =
    locationsFromParams.length === 0 ? locations : locationsFromParams;
  const numLocations = includedLocations.length;
  const slotIncrement = useSlotIncrement();
  const numSlots = getNumSlots(day.start, day.end, slotIncrement);
  const firstImageIndex = includedLocations.findIndex((loc) => loc.imageUrl);
  const hasImages = firstImageIndex !== -1;
  const date = DateTime.fromJSDate(day.start).setZone(timezone);

  // Kiosk mode: a red line across the day at the current time. `now` comes from
  // EventContext so it honours the dev fake clock (and ticks live) rather than
  // reading the real wall clock — time-travelling with ?dev=1 must move the
  // line too. SSR and hydration share the server-seeded value, so they agree.
  const nowOffsetPx = useKioskMode()
    ? getNowOffsetPx(day, now, slotIncrement)
    : null;

  return (
    <div
      className="grid bg-surface"
      style={{
        gridTemplateColumns: `${GUTTER} ${
          showMeetings ? "minmax(96px, 160px) " : ""
        }repeat(${numLocations}, minmax(120px, 240px))`,
      }}
    >
      {/* Row 1 — room-name header, sticky to the top. The corner cell (where no
          hour is) carries the day's date, so it gets replaced by the next day's
          date as that day scrolls into view. */}
      <div className="sticky top-0 left-0 z-21 flex flex-col justify-end bg-surface border-b border-r border-line-subtle p-1 leading-tight">
        <span className="text-[11px] font-bold">{date.toFormat("EEE")}</span>
        <span className="text-[10px] text-fg-subtle">
          {date.toFormat("MMM d")}
        </span>
      </div>
      {showMeetings && (
        <div className="sticky top-0 z-20 bg-surface border-b border-l border-line-subtle p-1">
          <h3 className="font-semibold text-xs sm:text-sm">1-on-1s</h3>
        </div>
      )}
      {includedLocations.map((loc) => (
        <div
          key={loc.name}
          className="sticky top-0 z-20 bg-surface border-b border-l border-line-subtle p-1"
        >
          {/* What a room offers (projector, whiteboard, …) is behind its name.
              The ⓘ is the only hint that there is anything to open, so it goes
              in the button itself, where a tap or a hover finds it. */}
          <h3 className="font-semibold text-xs sm:text-sm">
            <Tooltip
              toggleable
              content={
                loc.description ? (
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-semibold text-fg-muted">
                      {loc.name}
                    </p>
                    <p className="text-sm">{loc.description}</p>
                  </div>
                ) : undefined
              }
              placement="bottom-start"
              triggerClassName="flex items-start gap-0.5 text-left rounded-sm hover:text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              {loc.name}
              {loc.description && (
                <InformationCircleIcon
                  className="mt-px h-3 w-3 shrink-0 text-fg-subtle sm:h-3.5 sm:w-3.5"
                  aria-hidden
                />
              )}
            </Tooltip>
          </h3>
        </div>
      ))}
      {/* Row 2 — room description */}
      <div className="sticky top-0 z-20 bg-surface border-r border-line-subtle" />
      {showMeetings && (
        <div className="border-l border-line-subtle p-1">
          <p className="text-[10px] text-fg-subtle">Only you see these</p>
        </div>
      )}
      {includedLocations.map((loc) => (
        <div key={loc.name} className="border-l border-line-subtle p-1">
          <p className="text-[10px] text-fg-subtle">
            {loc.areaDescription ?? <br />}
          </p>
          <p className="text-[10px] text-fg-subtle">
            {loc.capacity ? `max ${loc.capacity}` : <br />}
          </p>
        </div>
      ))}
      {/* Row 3 — room images */}
      {hasImages && (
        <>
          <div className="sticky left-0 z-20 bg-surface border-r border-line-subtle" />
          {showMeetings && (
            <div className="border-l border-line-subtle p-1">
              <OneOnOnePicture />
            </div>
          )}
          {includedLocations.map((loc, i) => (
            <div key={loc.name} className="border-l border-line-subtle p-1">
              {loc.imageUrl && (
                <Image
                  src={loc.imageUrl}
                  alt={loc.name}
                  unoptimized={isUnoptimized(loc.imageUrl)}
                  // Above the fold, so it is usually the LCP element
                  priority={i === firstImageIndex}
                  className="w-full aspect-[4/3]"
                  style={{ maxHeight: 200 }}
                  width={500}
                  height={500}
                />
              )}
            </div>
          ))}
        </>
      )}

      {/* Row 4 — body. The time gutter sticks to the left; each location renders
          its session blocks in a matching 44px-row grid so the times line up. */}
      <div
        className={clsx(
          "sticky left-0 z-20 grid bg-surface border-r border-line-subtle",
          `grid-rows-[repeat(${numSlots},44px)]`
        )}
      >
        {Array.from({ length: numSlots }).map((_, i) => (
          <div
            key={i}
            className="border-b border-line-subtle text-[10px] p-1 h-[44px]"
          >
            {DateTime.fromMillis(
              day.start.getTime() + i * slotIncrement * 60 * 1000
            )
              .setZone(timezone)
              .toFormat(TIME_FORMAT)}
          </div>
        ))}
        {nowOffsetPx !== null && (
          <div
            data-testid="now-line"
            aria-hidden="true"
            className="absolute inset-x-0 z-10 h-0.5 bg-danger pointer-events-none"
            style={{ top: nowOffsetPx }}
          />
        )}
      </div>
      {showMeetings && (
        <MeetingsCol
          meetings={myMeetings}
          availability={myAvailability}
          day={day}
          nowOffsetPx={nowOffsetPx}
        />
      )}
      {includedLocations.map((location) => (
        <LocationCol
          key={location.name}
          sessions={day.sessions.filter((session) =>
            session.locations.some((l) => l.id === location.id)
          )}
          guests={guests}
          day={day}
          location={location}
          nowOffsetPx={nowOffsetPx}
        />
      ))}
    </div>
  );
}
