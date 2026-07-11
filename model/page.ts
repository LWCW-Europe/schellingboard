import { z } from "zod";

export const pageRequestSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .transform((page) => Math.max(page, 1))
    .optional()
    .default(1),
  query: z.string().trim().optional().default(""),
});
