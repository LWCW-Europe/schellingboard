"use client";

import { Input } from "@/app/input";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/app/components/buttons";
import type { MeetingPoint } from "@/db/repositories/interfaces";

/**
 * The half of a 1-on-1 request that is the same whichever way round it was
 * reached: where to meet and a line of context. A profile knows the person and
 * asks for a slot; the schedule's column knows the slot and asks for a person;
 * from here on the two are one form.
 */
export function MeetingRequestFields({
  meetingPoints,
  meetingPoint,
  onMeetingPoint,
  message,
  onMessage,
  isSending,
  submitDisabled,
  onCancel,
  cancelLabel = "Cancel",
}: {
  meetingPoints: Pick<MeetingPoint, "id" | "name" | "description">[];
  meetingPoint: string;
  onMeetingPoint: (value: string) => void;
  message: string;
  onMessage: (value: string) => void;
  isSending: boolean;
  /** Extra reasons the caller cannot send yet, beyond an unnamed place. */
  submitDisabled?: boolean;
  onCancel: () => void;
  cancelLabel?: string;
}) {
  const selectedPoint = meetingPoints.find((p) => p.name === meetingPoint);

  return (
    <>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-fg-muted">Where to meet</span>
        {meetingPoints.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-1">
            {meetingPoints.map((point) => (
              <li key={point.id}>
                <button
                  type="button"
                  aria-pressed={meetingPoint === point.name}
                  onClick={() => onMeetingPoint(point.name)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    meetingPoint === point.name
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line bg-surface-raised text-fg hover:bg-surface-hover"
                  }`}
                >
                  {point.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* Below the chips rather than a title= on them: a tooltip is the one
            place a touch user never reaches, and the description is how the
            organizer says where the place actually is. */}
        {selectedPoint?.description && (
          <p className="mb-1 text-xs text-fg-muted">
            {selectedPoint.description}
          </p>
        )}
        <Input
          value={meetingPoint}
          onChange={(e) => onMeetingPoint(e.target.value)}
          aria-label="Where to meet"
          placeholder="or type somewhere else"
          className="w-full h-10"
        />
        <p className="text-xs text-fg-subtle">
          Nothing is reserved — this is just where to find each other.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="meeting-message"
          className="text-sm font-medium text-fg-muted"
        >
          Add a line of context (optional)
        </label>
        <Input
          id="meeting-message"
          value={message}
          onChange={(e) => onMessage(e.target.value)}
          placeholder="Would love to talk about…"
          className="w-full h-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSending || submitDisabled || !meetingPoint.trim()}
          className={PRIMARY_BUTTON}
        >
          {isSending ? "Sending..." : "Send request"}
        </button>
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON}>
          {cancelLabel}
        </button>
      </div>
    </>
  );
}
