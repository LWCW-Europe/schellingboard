"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/app/components/modal";
import { Input } from "@/app/input";
import { requestMeetingAction } from "@/app/actions/meetings";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/app/components/buttons";
import { clashLines } from "@/utils/meeting-clash-text";
import type { MeetingDayOption, MeetingOption } from "@/utils/meeting-options";

function SlotList({
  days,
  selected,
  onSelect,
}: {
  days: MeetingDayOption[];
  selected: string | null;
  onSelect: (start: string) => void;
}) {
  return (
    <>
      {days.map((day) => (
        <section key={day.label} aria-label={day.label} className="mb-4">
          <h3 className="text-sm font-semibold text-fg mb-1">{day.label}</h3>
          <ul className="flex flex-wrap gap-2">
            {day.slots.map((slot) => {
              const unavailable = slot.state === "unavailable";
              const isSelected = selected === slot.start;
              return (
                <li key={slot.start}>
                  <button
                    type="button"
                    disabled={unavailable}
                    aria-pressed={isSelected}
                    onClick={() => onSelect(slot.start)}
                    className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                      isSelected
                        ? "border-brand bg-brand text-on-brand"
                        : unavailable
                          ? "border-line-subtle bg-surface-sunken text-fg-subtle cursor-not-allowed"
                          : slot.state === "busy"
                            ? "border-warning bg-warning-tint text-fg hover:bg-surface-hover"
                            : "border-line bg-surface-raised text-fg hover:bg-surface-hover"
                    }`}
                  >
                    {slot.label}
                    {unavailable && (
                      <span className="block text-xs">Unavailable</span>
                    )}
                    {slot.state === "busy" && (
                      <span className="block text-xs">Busy</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

function RequestForm({
  option,
  recipientId,
  recipientName,
  onDone,
}: {
  option: MeetingOption;
  recipientId: string;
  recipientName: string;
  onDone: () => void;
}) {
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [meetingPoint, setMeetingPoint] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSending, startSend] = useTransition();

  const day = option.days.find((d) =>
    d.slots.some((s) => s.start === slotStart)
  );
  const slot = day?.slots.find((s) => s.start === slotStart);
  const selectedPoint = option.meetingPoints.find(
    (p) => p.name === meetingPoint
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotStart) return;
    setError(null);
    startSend(async () => {
      try {
        const result = await requestMeetingAction({
          eventId: option.eventId,
          recipientId,
          slotStart,
          meetingPoint,
          message,
        });
        if (!result.ok) setError(result.error);
        else setSent(true);
      } catch {
        setError("Request failed");
      }
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-fg">
          Asked {recipientName} for {slot?.label} on {day?.label}. You&apos;ll
          hear when they answer.
        </p>
        <button type="button" onClick={onDone} className={PRIMARY_BUTTON}>
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-fg">
        1-on-1 with {recipientName}
        <span className="block text-sm font-normal text-fg-muted">
          {option.eventName}
        </span>
      </h2>

      {error && <p className="text-sm text-danger-fg">{error}</p>}

      <div className="max-h-64 overflow-y-auto">
        <SlotList
          days={option.days}
          selected={slotStart}
          onSelect={setSlotStart}
        />
      </div>

      {/* A clash is raised, never enforced: the pair decide for themselves. */}
      {slot?.state === "busy" && (
        <p className="text-sm rounded-md bg-warning-tint p-3 text-fg">
          {clashLines(slot.clashes)} during this slot — book it anyway?
        </p>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-fg-muted">Where to meet</span>
        {option.meetingPoints.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-1">
            {option.meetingPoints.map((point) => (
              <li key={point.id}>
                <button
                  type="button"
                  aria-pressed={meetingPoint === point.name}
                  onClick={() => setMeetingPoint(point.name)}
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
          onChange={(e) => setMeetingPoint(e.target.value)}
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Would love to talk about…"
          className="w-full h-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSending || !slotStart || !meetingPoint.trim()}
          className={PRIMARY_BUTTON}
        >
          {isSending ? "Sending..." : "Send request"}
        </button>
        <button type="button" onClick={onDone} className={SECONDARY_BUTTON}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * "Schedule a 1-on-1" on an attendee's profile — one button per event the
 * pair share where meetings are on and they are bookable, so nothing shows at
 * all when there is nothing to book.
 */
export function MeetingPicker({
  recipientId,
  recipientName,
  options,
}: {
  recipientId: string;
  recipientName: string;
  options: MeetingOption[];
}) {
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  if (options.length === 0) return null;

  const open = options.find((o) => o.eventId === openEventId);

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option.eventId}
          type="button"
          onClick={() => setOpenEventId(option.eventId)}
          className={SECONDARY_BUTTON}
        >
          {options.length === 1
            ? "Schedule a 1-on-1"
            : `Schedule a 1-on-1 at ${option.eventName}`}
        </button>
      ))}
      {/* Opened from inside the profile modal, which is z-50: without the
          portal and a higher z it renders behind it. */}
      <Modal
        open={open !== undefined}
        setOpen={() => setOpenEventId(null)}
        zIndex="z-[60]"
        portal
        maxWidth="sm:max-w-2xl"
        hideClose
      >
        {open && (
          <RequestForm
            option={open}
            recipientId={recipientId}
            recipientName={recipientName}
            onDone={() => setOpenEventId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
