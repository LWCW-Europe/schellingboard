import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  aboutMe: z.string().trim().nullable().optional().default(null),
  avatar: z.instanceof(Blob).nullable().optional(),
  pronouns: z.string().trim().nullable().optional().default(null),
});
