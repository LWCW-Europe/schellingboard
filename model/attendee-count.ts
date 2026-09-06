import { z } from "zod";

// Client-safe: the attendee-count control imports this into a client bundle,
// so nothing here may reach db/, next/headers or the mailer.

export const MIN_ATTENDEE_COUNT = 0;
export const MAX_ATTENDEE_COUNT = 1000;

const RANGE_MESSAGE = `Enter a whole number between ${MIN_ATTENDEE_COUNT} and ${MAX_ATTENDEE_COUNT}`;

// A blank field clears the count; anything else must be a whole number in
// range. The form hint and the server validator share this one definition, so
// the message a host sees cannot drift from the rule that rejects them.
export const attendeeCountSchema = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) =>
    value === null || value === undefined || String(value).trim() === ""
      ? null
      : Number(String(value).trim())
  )
  .refine(
    (value) =>
      value === null ||
      (Number.isInteger(value) &&
        value >= MIN_ATTENDEE_COUNT &&
        value <= MAX_ATTENDEE_COUNT),
    { message: RANGE_MESSAGE }
  );

// The same rule as a one-field form, so a rejection carries the field name
// the control knows it by and the message lands on the input rather than
// above the form (ADR 0003). The server action validates through this too, so
// a client-side bypass produces the identical field-level issue.
export const attendeeCountFormSchema = z.object({
  count: attendeeCountSchema,
});
