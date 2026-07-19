import { z } from "zod";
import {
  DEFAULT_LOCATION_COLOR,
  LOCATION_COLOR_NAMES,
  normalizeLocationColor,
} from "@/utils/location-colors";

export const locationSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  capacity: z
    .int()
    .min(0, { error: "Capacity must be a non-negative whole number" }),
  description: z.string().trim().default(""),
  areaDescription: z.string().trim().optional(),
  color: z
    .string()
    .trim()
    .transform(normalizeLocationColor)
    .pipe(z.enum(LOCATION_COLOR_NAMES))
    .optional()
    .default(DEFAULT_LOCATION_COLOR),
  hidden: z.boolean().default(false),
  bookable: z.boolean().default(false),
  eventIds: z.string().array().default([]),
  image: z
    .instanceof(Blob)
    .transform((blob) => (blob.size > 0 ? blob : undefined))
    .nullable()
    .optional(),
});

export const updateLocationSchema = locationSchema.extend({
  id: z.string().nonempty(),
});
