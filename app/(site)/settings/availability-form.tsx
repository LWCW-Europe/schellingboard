"use client";

import { useId, useState, useTransition } from "react";
import { saveMeetingAvailabilityAction } from "@/app/actions/meetings";
import { PRIMARY_BUTTON } from "@/app/components/buttons";
import type {
  AvailabilityFormData,
  SlotDay,
} from "@/utils/meeting-availability-form";

const QUIET_BUTTON =
  "px-2 py-1 text-sm rounded-md text-fg-muted bg-surface-muted hover:bg-surface-hover transition-colors";

/** One event's availability, inside its panel on the Settings page. */
export function AvailabilityForm({
  eventId,
  eventName,
  timezone,
  days,
  declared,
}: AvailabilityFormData) {
  // Settings holds one of these per event, so the checkbox id cannot be fixed.
  const switchId = useId();
  // No rows means not bookable, which is also the state of someone who never
  // turned the switch on -- so the switch is simply "did you declare anything".
  const [open, setOpen] = useState(declared.length > 0);
  const [selected, setSelected] = useState<Set<string>>(new Set(declared));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, startSave] = useTransition();

  const allSlots = days.flatMap((day) => day.slots.map((s) => s.start));
  // Saving this would store nothing, and nothing reads back as "not open" --
  // so the switch would silently flip itself off. Say so instead.
  const emptyWhileOpen = open && selected.size === 0;

  const change = (next: Set<string>) => {
    setSaved(false);
    setSelected(next);
  };

  const toggleOpen = (checked: boolean) => {
    setSaved(false);
    setOpen(checked);
    // Switching it on marks every slot available -- you then clear the ones
    // you want kept free, rather than building the set up from nothing.
    if (checked && selected.size === 0) setSelected(new Set(allSlots));
  };

  const toggleSlot = (start: string) => {
    const next = new Set(selected);
    if (next.has(start)) next.delete(start);
    else next.add(start);
    change(next);
  };

  const setDay = (day: SlotDay, on: boolean) => {
    const next = new Set(selected);
    for (const slot of day.slots) {
      if (on) next.add(slot.start);
      else next.delete(slot.start);
    }
    change(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        const result = await saveMeetingAvailabilityAction({
          eventId,
          // Switched off is an empty set: it is the opt-out control, so it
          // must clear the declaration rather than just hide it.
          slotStarts: open ? [...selected] : [],
        });
        if (!result.ok) setError(result.error);
        else setSaved(true);
      } catch {
        setError("Request failed");
      }
    });
  };

  return (
    <form
      onSubmit={handleSave}
      aria-label={`1-on-1s at ${eventName}`}
      className="flex flex-col gap-4"
    >
      {error && <p className="text-sm text-danger-fg">{error}</p>}

      <div className="rounded-md border border-line-subtle p-4">
        <div className="flex items-start gap-2">
          <input
            id={switchId}
            type="checkbox"
            checked={open}
            onChange={(e) => toggleOpen(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line text-brand-fg focus:ring-brand-accent"
          />
          <div>
            <label htmlFor={switchId} className="font-medium text-fg">
              I&apos;m open to 1-on-1s at this event
            </label>
            <p className="text-sm text-fg-subtle">
              While this is off, nobody can book you and you won&apos;t appear
              as bookable.
            </p>
          </div>
        </div>
      </div>

      {open && (
        <>
          <p className="text-sm text-fg-subtle rounded-md bg-surface-sunken p-3">
            Clear the slots you want kept free. You don&apos;t need to clear the
            ones where you&apos;re hosting or have RSVP&apos;d to — anyone
            booking you is warned about those. Times are in the event timezone (
            {timezone}).
          </p>

          {days.length === 0 && (
            <p className="text-fg-muted">
              The organizer hasn&apos;t set up any days with meeting slots yet.
            </p>
          )}

          {days.map((day) => (
            <section key={day.id} aria-label={day.label}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3 className="text-base font-semibold text-fg">{day.label}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDay(day, true)}
                    aria-label={`Select all slots on ${day.label}`}
                    className={QUIET_BUTTON}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() => setDay(day, false)}
                    aria-label={`Clear all slots on ${day.label}`}
                    className={QUIET_BUTTON}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-line-subtle border-t border-line-subtle">
                {day.slots.map((slot) => (
                  <li key={slot.start}>
                    <label className="flex items-center gap-3 py-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(slot.start)}
                        onChange={() => toggleSlot(slot.start)}
                        className="h-4 w-4 rounded border-line text-brand-fg focus:ring-brand-accent"
                      />
                      <span className="text-fg">{slot.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}

      <div className="flex items-center justify-end gap-3">
        {emptyWhileOpen && (
          <span className="text-sm text-fg-subtle">
            Clearing every slot is the same as switching this off.
          </span>
        )}
        {saved && <span className="text-sm text-success-fg">Saved!</span>}
        <button
          type="submit"
          disabled={isSaving || emptyWhileOpen}
          className={PRIMARY_BUTTON}
        >
          {isSaving ? "Saving..." : "Save availability"}
        </button>
      </div>
    </form>
  );
}
