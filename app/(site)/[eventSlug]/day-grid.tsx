"use client";
import { LocationCol } from "./location-col";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { getNumHalfHours, TIME_FORMAT } from "@/utils/utils";
import { useContext } from "react";
import Image from "next/image";
import { Tooltip } from "./tooltip";
import { DateTime } from "luxon";
import type { Guest, Location } from "@/db/repositories/interfaces";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext } from "@/app/(site)/context";

// Width of the left time-axis gutter. The body rows show `HH:mm` labels and the
// header corner shows the day's date, so it has to fit a short date.
const GUTTER = "2.5rem";

// One day is a single CSS grid: column 1 is the time gutter, the remaining
// columns are the locations. The room-name row sticks to the top and the gutter
// sticks to the left, so both stay visible while you scroll the schedule. No
// JS, no scroll listeners — just `position: sticky` inside the scroll container
// that wraps every day (see `EventDisplay`).
export function DayGrid(props: {
  eventName: string;
  locations: Location[];
  day: DayWithSessions;
  guests: Guest[];
}) {
  const { eventName, day, locations, guests } = props;
  const { event } = useContext(EventContext);
  const timezone = event?.timezone ?? "UTC";
  const searchParams = useSearchParams();
  const locParams = searchParams?.getAll("loc");
  const locationsFromParams = locations.filter((loc) =>
    locParams?.includes(loc.name)
  );
  const includedLocations =
    locationsFromParams.length === 0 ? locations : locationsFromParams;
  const numLocations = includedLocations.length;
  const numHalfHours = getNumHalfHours(day.start, day.end);
  const hasImages = includedLocations.some((loc) => loc.imageUrl);
  const date = DateTime.fromJSDate(day.start).setZone(timezone);

  return (
    <div
      className="grid bg-white"
      style={{
        gridTemplateColumns: `${GUTTER} repeat(${numLocations}, minmax(120px, 240px))`,
      }}
    >
      {/* Row 1 — room-name header, sticky to the top. The corner cell (where no
          hour is) carries the day's date, so it gets replaced by the next day's
          date as that day scrolls into view. */}
      <div className="sticky top-0 left-0 z-21 flex flex-col justify-end bg-white border-b border-r border-gray-100 p-1 leading-tight">
        <span className="text-[11px] font-bold">{date.toFormat("EEE")}</span>
        <span className="text-[10px] text-gray-500">
          {date.toFormat("MMM d")}
        </span>
      </div>
      {includedLocations.map((loc) => (
        <Tooltip
          key={loc.name}
          content={
            loc.description ? (
              <div className="p-2 space-y-1">
                <p className="text-xs font-semibold text-gray-700">
                  {loc.name}
                </p>
                <p className="text-sm">{loc.description}</p>
              </div>
            ) : undefined
          }
          placement="bottom-start"
          className="sticky top-0 z-20 bg-white border-b border-l border-gray-100"
        >
          <div className="p-1 h-full">
            <h3 className="font-semibold text-xs sm:text-sm">{loc.name}</h3>
            <p className="text-[10px] text-gray-500">
              {loc.areaDescription ?? <br />}
            </p>
            <p className="text-[10px] text-gray-500">
              {loc.capacity ? `max ${loc.capacity}` : <br />}
            </p>
          </div>
        </Tooltip>
      ))}

      {/* Row 2 — location images. These deliberately scroll away with the body
          (not sticky); only the empty gutter spacer stays pinned to the left so
          the left column reads as one continuous strip. */}
      {hasImages && (
        <>
          <div className="sticky left-0 z-20 bg-white border-r border-gray-100" />
          {includedLocations.map((loc) => (
            <div key={loc.name} className="border-l border-gray-100 p-1">
              {loc.imageUrl && (
                <Image
                  src={loc.imageUrl}
                  alt={loc.name}
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

      {/* Row 3 — body. The time gutter sticks to the left; each location renders
          its session blocks in a matching 44px-row grid so the times line up. */}
      <div
        className={clsx(
          "sticky left-0 z-20 grid bg-white border-r border-gray-100",
          `grid-rows-[repeat(${numHalfHours},44px)]`
        )}
      >
        {Array.from({ length: numHalfHours }).map((_, i) => (
          <div
            key={i}
            className="border-b border-gray-100 text-[10px] p-1 h-[44px]"
          >
            {DateTime.fromMillis(day.start.getTime() + i * 30 * 60 * 1000)
              .setZone(timezone)
              .toFormat(TIME_FORMAT)}
          </div>
        ))}
      </div>
      {includedLocations.map((location) => (
        <LocationCol
          key={location.name}
          sessions={day.sessions.filter((session) =>
            session.locations.some((l) => l.id === location.id)
          )}
          guests={guests}
          day={day}
          location={location}
          eventName={eventName}
        />
      ))}
    </div>
  );
}
