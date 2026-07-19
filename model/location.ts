import { z } from "zod";
import {
  DEFAULT_LOCATION_COLOR,
  LOCATION_COLOR_NAMES,
  normalizeLocationColor,
} from "@/utils/location-colors";

// Clearing the capacity field yields NaN, and a fractional entry yields a
// non-integer; both need the same plain-language message rather than zod's
// "expected int, received NaN".
const CAPACITY_ERROR = "Capacity must be a non-negative whole number";

export const locationSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }),
  capacity: z.int({ error: CAPACITY_ERROR }).min(0, { error: CAPACITY_ERROR }),
  description: z.string().trim().default(""),
  // The form always submits a string; blank must stay unset, because the
  // schedule grid renders a spacer only for a missing area description.
  areaDescription: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
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
