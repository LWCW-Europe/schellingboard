import { z } from "zod";

export const sessionProposalSchema = z.object({
  eventId: z.string().min(1),
  eventSlug: z.string().min(1),
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  hostIds: z.string().array().default([]),
  durationMinutes: z.number().optional(),
});

// An update reuses the create payload minus eventId: a proposal can't be moved
// to another event, so the event is taken from the stored proposal rather than
// the request. The edit form still submits every remaining field, so an update
// is a full replacement validated exactly like a creation (e.g. title stays
// required) — there is no partial-update path to model here.
export const sessionProposalUpdateSchema = sessionProposalSchema.omit({
  eventId: true,
});
