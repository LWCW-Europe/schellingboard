import { z } from "zod";

export const sessionProposalSchema = z.object({
  eventId: z.string(),
  eventSlug: z.string(),
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().optional(),
  hostIds: z.string().array().optional().default([]),
  durationMinutes: z.number().optional(),
});
