export type ClashKind = "hosting" | "attending" | "meeting" | "busy";

type GuestClashInput = {
  guestId: string;
  guestName: string;
  kind: ClashKind;
  title: string | null;
};

/**
 * A clash as the browser sees one: only the reader's own commitment is
 * described, so anyone else's arrives as the bare fact that they are taken.
 */
export type MeetingClash = {
  guestName: string;
  kind: ClashKind;
  title: string | null;
  /** The viewer's own clash, so the line can say "you" rather than naming
      the reader back to themselves in the third person. */
  isViewer: boolean;
};

/**
 * Redacted here rather than at render time: a title dropped in the browser
 * would still have been in the payload. Entries that redact to the same thing
 * collapse, so the count does not report how many commitments they have.
 */
export function toMeetingClashes(
  clashes: GuestClashInput[],
  viewerId: string
): MeetingClash[] {
  const distinct = new Map<string, MeetingClash>();
  for (const clash of clashes) {
    const isViewer = clash.guestId === viewerId;
    const mapped: MeetingClash = {
      guestName: clash.guestName,
      kind: isViewer ? clash.kind : "busy",
      title: isViewer ? clash.title : null,
      isViewer,
    };
    const key = [
      mapped.guestName,
      mapped.kind,
      mapped.title,
      mapped.isViewer,
    ].join("\u0000");
    if (!distinct.has(key)) distinct.set(key, mapped);
  }
  return [...distinct.values()];
}

/** "You are hosting Their talk" / "Yuki is already booked". */
export function clashLine(clash: MeetingClash): string {
  if (!clash.isViewer) return `${clash.guestName} is already booked`;
  if (clash.kind === "meeting") return "You have another 1-on-1";
  if (!clash.title) return "You are busy";
  return clash.kind === "hosting"
    ? `You are hosting ${clash.title}`
    : `You are attending ${clash.title}`;
}

/** Every clash in one breath, each distinct line said once. */
export function clashLines(clashes: MeetingClash[]): string {
  return [...new Set(clashes.map(clashLine))].join("; ");
}
