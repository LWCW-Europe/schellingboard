import type { Session } from "@/db/repositories/interfaces";
import { sessionsOverlap } from "@/app/(site)/session_utils";
import type { MeetingView } from "./meeting-views";

export type RsvpClash =
  | { kind: "session"; session: Session }
  | { kind: "meeting"; meeting: MeetingView };

// `meetings` is null until the viewer's 1-on-1s have loaded; until then only
// sessions can be reported.
export function findRsvpClash(
  session: Session,
  busySessions: Session[],
  meetings: MeetingView[] | null
): RsvpClash | null {
  const busy = busySessions.find((other) => sessionsOverlap(session, other));
  if (busy) return { kind: "session", session: busy };

  const { startTime, endTime } = session;
  if (!startTime || !endTime) return null;
  const meeting = meetings?.find(
    (m) =>
      m.status === "accepted" &&
      new Date(m.slotStart) < endTime &&
      new Date(m.slotEnd) > startTime
  );
  return meeting ? { kind: "meeting", meeting } : null;
}

export function describeRsvpClash(
  clash: RsvpClash,
  currentUser: string | null
): string {
  if (clash.kind === "meeting") {
    return `your 1-on-1 with ${clash.meeting.otherName}`;
  }
  const { session } = clash;
  const hosting = session.hosts.some((h) => h.id === currentUser);
  return `"${session.title}", which you are ${hosting ? "hosting" : "attending"}`;
}
