import { z } from "zod";

export const pageRequestSchema = z.object({
  // Invalid, missing, or out-of-range input falls back to page 1 rather than
  // rejecting the request — a stale or hand-edited URL shouldn't error out.
  page: z.coerce.number().int().positive().catch(1),
  query: z.string().trim().optional().default(""),
});
