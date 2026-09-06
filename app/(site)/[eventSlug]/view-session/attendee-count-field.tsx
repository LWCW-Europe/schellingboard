"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getAttendeeCountAction,
  setAttendeeCountAction,
} from "@/app/actions/attendee-count";
import {
  attendeeCountFormSchema,
  MAX_ATTENDEE_COUNT,
  MIN_ATTENDEE_COUNT,
} from "@/model/attendee-count";
import { setActionErrors } from "@/utils/forms";

/**
 * Records how many people came to a finished session. Rendered only for a
 * host, but the server action is the enforcement — hiding it is a courtesy.
 *
 * The stored count is fetched here rather than read off the session: it is
 * absent from the `Session` type on purpose, because that type reaches every
 * visitor's browser (docs/dev/adr/0006).
 */
export function AttendeeCountField({
  sessionId,
  autoFocus = false,
}: {
  sessionId: string;
  /**
   * Set only when the URL carries the follow-up email's `record=count`.
   * Focusing every finished session a host opens would steal their scroll
   * position and pop the keyboard on mobile.
   */
  autoFocus?: boolean;
}) {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const form = useForm({
    defaultValues: { count: "" },
    resolver: zodResolver(attendeeCountFormSchema),
  });
  const { reset, setError } = form;

  useEffect(() => {
    let cancelled = false;
    void getAttendeeCountAction(sessionId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        reset({ count: result.count === null ? "" : String(result.count) });
      } else if (typeof result.error === "string") {
        setError("root", { message: result.error });
      }
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId, reset, setError]);

  const handleSubmit = async ({ count }: { count: number | null }) => {
    setSaved(false);
    try {
      const result = await setAttendeeCountAction(sessionId, count);
      if (!result.ok) {
        setActionErrors(form, result.error);
        return;
      }
      // Rebaseline from what was stored, so a second save racing this one
      // leaves the field showing the value that actually won.
      reset({ count: result.count === null ? "" : String(result.count) });
      setSaved(true);
    } catch (err) {
      form.setError("root", { message: "Could not save — try again" });
      console.error(err);
    }
  };

  const { errors, isSubmitting } = form.formState;
  const message = errors.count?.message ?? errors.root?.message;

  if (!loaded) return null;

  return (
    <section className="mb-6 rounded-md border border-line-subtle bg-surface-muted p-3">
      <form
        onSubmit={(e) => form.handleSubmit(handleSubmit)(e) as never}
        // The browser's own number validation would block the submit and show
        // a tooltip, so the shared Zod rule would never get to put its message
        // on the field where ADR 0003 wants it.
        noValidate
        className="flex flex-col gap-2"
      >
        <label htmlFor={fieldId} className="text-sm font-medium text-fg">
          How many people attended?
        </label>
        <p className="text-xs text-fg-subtle">
          Optional, and only this session&rsquo;s hosts can see it. Enter{" "}
          <strong>0</strong> if the session was held but nobody came. If it
          never happened at all, delete the session instead. Leave the field
          empty to go back to no count at all.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            {...form.register("count")}
            id={fieldId}
            autoFocus={autoFocus}
            type="number"
            inputMode="numeric"
            min={MIN_ATTENDEE_COUNT}
            max={MAX_ATTENDEE_COUNT}
            step={1}
            aria-invalid={message ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className="w-24 rounded-md border border-line bg-surface-raised px-2 py-1 text-sm text-fg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <button
            type="submit"
            aria-label="Save attendee count"
            disabled={isSubmitting}
            className="rounded-md bg-brand px-3 py-1 text-sm font-medium text-on-brand shadow hover:bg-brand-hover disabled:bg-surface-hover disabled:text-fg-subtle disabled:shadow-none"
          >
            Save
          </button>
          {/* Announced rather than only coloured: the save has no other
              outward sign once the value is already in the input. */}
          <span role="status" aria-live="polite" className="text-xs">
            {isSubmitting ? (
              <span className="text-fg-muted">Saving&hellip;</span>
            ) : saved && !form.formState.isDirty ? (
              <span className="text-success-fg">Saved</span>
            ) : null}
          </span>
        </div>
        {message && (
          <p id={messageId} className="text-xs text-danger-fg">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
