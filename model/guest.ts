import { z } from "zod";

// Matches EmailSettings in db/repositories/interfaces.ts.
export const emailSettingsSchema = z.object({
  rsvpChange: z.boolean(),
  hostChange: z.boolean(),
  cohostAdd: z.boolean(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  aboutMe: z.string().trim().nullable().optional().default(null),
  avatar: z.instanceof(Blob).nullable().optional(),
  pronouns: z.string().trim().nullable().optional().default(null),
  emailSettings: emailSettingsSchema,
});
