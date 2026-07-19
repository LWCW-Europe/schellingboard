"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { getImageRepositories } from "@/utils/images";
import type { Location } from "@/db/repositories/interfaces";
import type { AdminActionResult, AdminFormActionResult } from "./admin-guests";
import { locationSchema, updateLocationSchema } from "@/model/location";
import { z } from "zod";

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

async function validateEventIds(eventIds: string[]): Promise<boolean> {
  const events = await getRepositories().events.list();
  const known = new Set(events.map((e) => e.id));
  return eventIds.every((id) => known.has(id));
}

/** Reads and validates an uploaded image without storing it yet. */
async function prepareImage(
  image: Blob | null | undefined,
  ctx: z.core.$RefinementCtx<Blob | null | undefined>
): Promise<{ buffer: Buffer; ext: string } | undefined> {
  if (!image) return;
  const buffer = Buffer.from(await image.arrayBuffer());
  const validation = await getImageRepositories().locations.validate(buffer);
  if ("error" in validation) {
    ctx.addIssue({
      code: "custom",
      message: validation.error,
    });
    return z.NEVER;
  }
  return { buffer: validation.buffer, ext: validation.ext };
}

const validations = {
  eventIds: locationSchema.shape.eventIds.refine(validateEventIds, {
    message: "Unknown event",
  }),
  // Validate the image before creating the location so a bad upload
  // doesn't leave a half-created record behind
  image: locationSchema.shape.image.optional().transform(prepareImage),
} as const;

const locationValidationSchema = locationSchema.extend(validations);
const updateLocationValidationSchema = updateLocationSchema.extend(validations);

export async function createLocationAction(
  formData: z.input<typeof locationSchema>
): Promise<AdminFormActionResult>;
export async function createLocationAction(
  formData: unknown
): Promise<AdminFormActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = await locationValidationSchema.safeParseAsync(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues };
  }
  const { image, ...fields } = parsed.data;
  const { eventIds, ...locationFields } = fields;

  const { locations } = getRepositories();
  const existing = await locations.list();
  const sortIndex =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((l) => l.sortIndex)) + 1;

  const location = await locations.create({
    ...locationFields,
    imageUrl: "",
    sortIndex,
  });

  if (image) {
    const imageUrl = await getImageRepositories().locations.save(
      location.id,
      image.buffer,
      image.ext
    );
    await locations.update(location.id, { ...location, imageUrl });
  }
  await locations.setEventIds(location.id, eventIds);

  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function updateLocationAction(
  formData: z.input<typeof updateLocationSchema>
): Promise<AdminFormActionResult>;
export async function updateLocationAction(
  formData: unknown
): Promise<AdminFormActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = await updateLocationValidationSchema.safeParseAsync(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues };
  }
  const { image, id, ...fields } = parsed.data;
  const { eventIds, ...locationFields } = fields;

  const { locations } = getRepositories();
  const existing = await locations.findById(id);
  if (!existing) {
    return { ok: false, error: "Location not found" };
  }

  let imageUrl = existing.imageUrl;
  if (image) {
    imageUrl = await getImageRepositories().locations.save(
      id,
      image.buffer,
      image.ext
    );
  }

  const data: Omit<Location, "id"> = {
    ...locationFields,
    imageUrl,
    sortIndex: existing.sortIndex,
  };
  await locations.update(id, data);
  await locations.setEventIds(id, eventIds);

  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function deleteLocationAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const { locations } = getRepositories();
  const location = await locations.findById(input.id);
  if (!location) {
    return { ok: false, error: "Location not found" };
  }

  await locations.delete(input.id);
  await getImageRepositories().locations.delete(input.id);

  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function moveLocationAction(input: {
  id: string;
  direction: "up" | "down";
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const { locations } = getRepositories();
  await locations.move(input.id, input.direction);

  revalidatePath("/admin/locations");
  return { ok: true };
}
