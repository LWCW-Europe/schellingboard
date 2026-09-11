import type { Location, Session } from "@/db/repositories/interfaces";
import type { MeetingView } from "@/utils/meeting-views";
import { getStartTimePlusBreak } from "@/utils/utils";

export type AgendaGroup = {
  start: Date;
  sessions: Session[];
  meetings: MeetingView[];
};

/** As the session's details show it — except a blocker, which fills its slot. */
export function shownStart(session: Session, breakMinutes: number): Date {
  const start = session.startTime ?? new Date(0);
  return session.blocker
    ? start
    : getStartTimePlusBreak(start, breakMinutes).toJSDate();
}

/**
 * A day's entries under their shown starts: sessions in room order, 1-on-1s
 * on their slot, same-titled blockers with the same times merged into one.
 */
export function agendaGroups(input: {
  sessions: Session[];
  meetings: MeetingView[];
  locations: Location[];
  breakMinutes: number;
}): AgendaGroup[] {
  const { sessions, meetings, locations, breakMinutes } = input;
  const rank = new Map(locations.map((loc) => [loc.id, loc.sortIndex]));
  const roomRank = (session: Session) => {
    const ranks = session.locations.flatMap((l) => rank.get(l.id) ?? []);
    return ranks.length ? Math.min(...ranks) : Number.MAX_SAFE_INTEGER;
  };
  const byStart = new Map<number, AgendaGroup>();
  const groupAt = (start: number) => {
    const group = byStart.get(start) ?? {
      start: new Date(start),
      sessions: [],
      meetings: [],
    };
    byStart.set(start, group);
    return group;
  };

  for (const session of sessions) {
    if (!session.startTime) continue;
    const group = groupAt(shownStart(session, breakMinutes).getTime());
    const twin = session.blocker
      ? group.sessions.findIndex(
          (s) =>
            s.blocker &&
            s.title === session.title &&
            s.endTime?.getTime() === session.endTime?.getTime()
        )
      : -1;
    if (twin >= 0) {
      const existing = group.sessions[twin];
      const known = new Set(existing.locations.map((l) => l.id));
      group.sessions[twin] = {
        ...existing,
        locations: [
          ...existing.locations,
          ...session.locations.filter((l) => !known.has(l.id)),
        ],
      };
    } else {
      group.sessions.push(session);
    }
  }
  for (const meeting of meetings) {
    groupAt(new Date(meeting.slotStart).getTime()).meetings.push(meeting);
  }

  const groups = [...byStart.values()];
  for (const group of groups) {
    group.sessions.sort((a, b) => roomRank(a) - roomRank(b));
  }
  return groups.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Where the "now" marker goes: before the first group still to start, so
 * what has started is above it and what is to come below.
 */
export function nowMarkerIndex(groups: AgendaGroup[], now: Date): number {
  const next = groups.findIndex((g) => g.start.getTime() > now.getTime());
  return next < 0 ? groups.length : next;
}

export type TimeState = "ended" | "running" | "upcoming";

export function timeState(start: Date, end: Date, now: Date): TimeState {
  if (end.getTime() <= now.getTime()) return "ended";
  return start.getTime() <= now.getTime() ? "running" : "upcoming";
}
