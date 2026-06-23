"use client";
import { LocationCol } from "./location-col";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { getNumHalfHours, TIME_FORMAT } from "@/utils/utils";
import { useSafeLayoutEffect } from "@/utils/hooks";
import { useRef, useState, useContext } from "react";
import Image from "next/image";
import { Tooltip } from "./tooltip";
import { DateTime } from "luxon";
import type { Guest, Location } from "@/db/repositories/interfaces";
import type { DayWithSessions } from "@/app/(site)/context";
import { EventContext } from "@/app/(site)/context";

// Width of the left time-axis gutter. Shared by the body's TimestampCol and the
// sticky header's corner spacer so their columns line up. Fits an `HH:mm` label.
const GUTTER_WIDTH = "w-8";

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
  const start = day.start;
  const end = day.end;
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const headerTrackRef = useRef<HTMLDivElement>(null);
  const [scrolledToRightEnd, setScrolledToRightEnd] = useState(false);
  const [scrolledToLeftEnd, setScrolledToLeftEnd] = useState(true);
  // Now that the festival is over, show entire schedule by default
  const [expanded, setExpanded] = useState(true);
  // Or use this to hide dates that have already ended
  // const [expanded, setExpanded] = useState(end >= new Date());
  useSafeLayoutEffect(() => {
    const handleScroll = () => {
      const div = scrollableDivRef.current;
      if (!div) return;
      const { scrollLeft, scrollWidth, clientWidth } = div;
      setScrolledToRightEnd(scrollLeft + clientWidth >= scrollWidth);
      setScrolledToLeftEnd(scrollLeft === 0);

      // The sticky room-header row lives outside this horizontal scroller, so
      // mirror the body's horizontal scroll onto it.
      if (headerTrackRef.current) {
        headerTrackRef.current.style.transform = `translateX(${-scrollLeft}px)`;
      }
    };

    handleScroll();

    const div = scrollableDivRef.current;
    div?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      div?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Day heading + room headers stick to the top while scrolling through
          this day, then get pushed out when the next day's grid arrives. */}
      <div className="sticky top-16 z-20 bg-white">
        <div className="flex items-center gap-2 py-1">
          <h2 className="text-2xl font-bold">
            {DateTime.fromJSDate(day.start)
              .setZone(timezone)
              .toFormat("EEEE, MMMM d")}
          </h2>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-500 underline"
          >
            ({expanded ? "hide" : "show"})
          </button>
        </div>
        {expanded && (
          <div className="flex w-full">
            {/* Spacer matching the time-axis gutter so header columns line up
                with the body grid below. */}
            <div
              className={clsx(
                "flex-none border-r border-gray-100",
                GUTTER_WIDTH
              )}
            />
            <div className="overflow-hidden flex-1">
              <div
                ref={headerTrackRef}
                className="grid divide-x divide-gray-100 w-full will-change-transform"
                style={{
                  gridTemplateColumns: `repeat(${numLocations}, minmax(120px, 2fr))`,
                }}
              >
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
                  >
                    <div
                      key={loc.name}
                      className="p-1 border-b border-gray-100 h-full"
                    >
                      <h3 className="font-semibold text-xs sm:text-sm">
                        {loc.name}
                      </h3>
                      <p className="text-[10px] text-gray-500">
                        {loc.areaDescription ?? <br />}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {loc.capacity ? `max ${loc.capacity}` : <br />}
                      </p>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {expanded && (
        <div className="flex items-end relative w-full overflow-visible">
          <TimestampCol start={start} end={end} timezone={timezone} />
          <div
            className="overflow-x-auto overflow-y-clip flex-shrink"
            ref={scrollableDivRef}
          >
            {/* Location images sit above the grid and scroll with it, so they
                are not pinned along with the sticky room headers. */}
            {includedLocations.some((loc) => loc.imageUrl) && (
              <div
                className="grid w-full"
                style={{
                  gridTemplateColumns: `repeat(${numLocations}, minmax(120px, 2fr))`,
                }}
              >
                {includedLocations.map((loc) => (
                  <div key={loc.name} className="p-1">
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
              </div>
            )}
            <div
              className="grid divide-x divide-gray-100 relative w-full"
              style={{
                gridTemplateColumns: `repeat(${numLocations}, minmax(120px, 2fr))`,
              }}
            >
              {/* <NowBar start={start} end={end} /> */}
              {includedLocations.map((location) => {
                if (!location) {
                  return null;
                }
                return (
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
                );
              })}
            </div>
          </div>
          {!scrolledToRightEnd && (
            <div className="bg-gradient-to-r from-transparent to-white h-full absolute right-0 w-2" />
          )}
          {!scrolledToLeftEnd && (
            <div className="bg-gradient-to-l from-transparent to-white h-full absolute left-8 w-2" />
          )}
        </div>
      )}
    </div>
  );
}

function TimestampCol(props: { start: Date; end: Date; timezone: string }) {
  const { start, end, timezone } = props;
  const numHalfHours = getNumHalfHours(start, end);
  return (
    <div
      className={clsx(
        "grid h-full border-r border-t border-gray-100",
        GUTTER_WIDTH,
        `grid-rows-[repeat(${numHalfHours},44px)]`
      )}
    >
      {Array.from({ length: numHalfHours }).map((_, i) => (
        <div
          key={i}
          className="border-b border-gray-100 text-[10px] p-1 pl-0 text-right h-[44px]"
        >
          {DateTime.fromMillis(start.getTime() + i * 30 * 60 * 1000)
            .setZone(timezone)
            .toFormat(TIME_FORMAT)}
        </div>
      ))}
    </div>
  );
}
