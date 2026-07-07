import type { Session, Location, Guest } from "@/db/repositories/interfaces";
import type { DayWithSessions } from "@/app/(site)/context";
import { useSlotIncrement } from "@/app/(site)/context";
import { SessionBlock } from "./session-block";
import { getNumSlots } from "@/utils/slots";
import clsx from "clsx";

export function LocationCol(props: {
  sessions: Session[];
  location: Location;
  day: DayWithSessions;
  guests: Guest[];
  /** Kiosk now-line offset from the top of the slot grid; null hides it. */
  nowOffsetPx?: number | null;
}) {
  const { sessions, location, day, guests, nowOffsetPx } = props;
  const slotIncrement = useSlotIncrement();
  const sessionsWithBlanks = insertBlankSessions(sessions, day, slotIncrement);
  const numSlots = getNumSlots(day.start, day.end, slotIncrement);
  return (
    <div className={"relative px-0.5"}>
      <div
        className={clsx("grid h-full", `grid-rows-[repeat(${numSlots},44px)]`)}
      >
        {sessionsWithBlanks.map((session) => {
          return (
            <SessionBlock
              day={day}
              key={session.startTime?.toISOString() ?? session.id}
              session={session}
              location={location}
              guests={guests}
            />
          );
        })}
      </div>
      {/* Each column draws its own segment of the kiosk now line; together
          with the gutter's segment (see DayGrid) they form one continuous
          line across the day. */}
      {nowOffsetPx != null && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 z-10 h-0.5 bg-red-500 pointer-events-none"
          style={{ top: nowOffsetPx }}
        />
      )}
    </div>
  );
}

function insertBlankSessions(
  sessions: Session[],
  day: DayWithSessions,
  slotIncrementMinutes: number
): Session[] {
  const slotMs = slotIncrementMinutes * 60 * 1000;
  const sessionsWithBlanks: Session[] = [];
  for (
    let currentTime = day.start.getTime();
    currentTime < day.end.getTime();
    currentTime += slotMs
  ) {
    const sessionNow = sessions.find((session) => {
      const startTime = session.startTime?.getTime() ?? 0;
      const endTime = session.endTime?.getTime() ?? 0;
      return startTime <= currentTime && endTime > currentTime;
    });
    if (sessionNow) {
      if ((sessionNow.startTime?.getTime() ?? 0) === currentTime) {
        sessionsWithBlanks.push(sessionNow);
      } else {
        continue;
      }
    } else {
      sessionsWithBlanks.push({
        startTime: new Date(currentTime),
        endTime: new Date(currentTime + slotMs),
        title: "",
        description: "",
        hosts: [],
        locations: [],
        capacity: 0,
        numRsvps: 0,
        id: "",
        adminManaged: true,
        blocker: false,
        closed: false,
        eventId: day.eventId,
      });
    }
  }
  return sessionsWithBlanks;
}
