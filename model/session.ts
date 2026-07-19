import { z } from "zod";

export const sessionProposalSchema = z.object({
  eventId: z.string().nonempty(),
  eventSlug: z.string().nonempty(),
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().optional(),
  hostIds: z.string().array().optional().default([]),
  durationMinutes: z.number().optional(),
});
