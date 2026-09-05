/**
 * A clash as the browser sees one. Only the reader's own commitment is
 * described: what anyone else has on at that hour is theirs to tell, so their
 * clash arrives as the bare fact that they are taken — see GuestClash and
 * `toMeetingClash` below.
 */
export type MeetingClash = {
  guestName: string;
  kind: "hosting" | "busy";
  /** Never set for anyone but the viewer. */
  title: string | null;
  /** The viewer's own clash, so the line can say "you" rather than naming
      the reader back to themselves in the third person. */
  isViewer: boolean;
};

/**
 * What the server may say about one clash, given who is reading. The reader's
 * own session is named back to them — it is their diary — while everyone
 * else's is flattened to "busy" with no title, before it ever reaches the
 * browser: a title stripped only at render time would still be in the payload.
 */
export function toMeetingClash(
  clash: {
    guestId: string;
    guestName: string;
    kind: "hosting" | "busy";
    title: string | null;
  },
  viewerId: string
): MeetingClash {
  const isViewer = clash.guestId === viewerId;
  return {
    guestName: clash.guestName,
    kind: isViewer ? clash.kind : "busy",
    title: isViewer ? clash.title : null,
    isViewer,
  };
}

/** "You are hosting Their talk" / "Yuki is already booked". */
export function clashLine(clash: MeetingClash): string {
  if (!clash.isViewer) return `${clash.guestName} is already booked`;
  return clash.kind === "hosting" && clash.title
    ? `You are hosting ${clash.title}`
    : "You are busy";
}
