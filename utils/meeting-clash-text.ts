/**
 * A clash as the browser sees one: who is busy and, for a hosted session
 * (public), what with. RSVP'd sessions and agreed 1-on-1s carry no title, so
 * one attendee never learns another's private commitments — see GuestClash.
 */
export type MeetingClash = {
  guestName: string;
  kind: "hosting" | "busy";
  title: string | null;
  /** The viewer's own clash, so the line can say "you" rather than naming
      the reader back to themselves in the third person. */
  isViewer: boolean;
};

/** "Yuki is hosting Their talk" / "You are busy". */
export function clashLine(clash: MeetingClash): string {
  const who = clash.isViewer ? "You" : clash.guestName;
  const is = clash.isViewer ? "are" : "is";
  return clash.kind === "hosting" && clash.title
    ? `${who} ${is} hosting ${clash.title}`
    : `${who} ${is} busy`;
}
