import type { Session } from "@/db/repositories/interfaces";
import { compareMeetings, meetingsForDay } from "@/utils/meeting-column";
import { meetingTitle } from "@/utils/meeting-rules";
import type { MeetingView } from "@/utils/meeting-views";
import { containsIgnoringAccents } from "@/utils/utils";

type ListedSession = Pick<Session, "id" | "startTime">;

export type DayTextEntry<S extends ListedSession> =
  | { key: string; session: S; meeting: null }
  | { key: string; session: null; meeting: MeetingView };

/**
 * A day of the Text and RSVP'd views, 1-on-1s among the sessions by time.
 * RSVP'd lists commitments, so it keeps only the confirmed ones (#1023).
 */
export function dayTextEntries<S extends ListedSession>({
  sessions,
  meetings,
  day,
  search,
  rsvpOnly,
}: {
  sessions: S[];
  meetings: MeetingView[];
  day: { start: Date; end: Date };
  search: string;
  rsvpOnly: boolean;
}): DayTextEntry<S>[] {
  const mine = meetingsForDay(meetings, day)
    .filter((meeting) => !rsvpOnly || meeting.status === "accepted")
    .filter((meeting) => meetingMatchesSearch(meeting, search))
    .sort(compareMeetings);
  const entries: DayTextEntry<S>[] = [
    ...sessions.map((session) => ({
      key: session.id,
      session,
      meeting: null,
    })),
    ...mine.map((meeting) => ({ key: meeting.id, session: null, meeting })),
  ];
  const startOf = (entry: DayTextEntry<S>) =>
    entry.meeting === null
      ? (entry.session.startTime?.getTime() ?? 0)
      : new Date(entry.meeting.slotStart).getTime();
  return entries.sort((a, b) => startOf(a) - startOf(b));
}

function meetingMatchesSearch(meeting: MeetingView, search: string) {
  return (
    containsIgnoringAccents(meetingTitle(meeting), search) ||
    containsIgnoringAccents(meeting.meetingPoint, search) ||
    containsIgnoringAccents(meeting.message, search)
  );
}
