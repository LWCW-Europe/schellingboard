"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import {
  deleteLocationImage,
  saveLocationImage,
  validateLocationImage,
} from "@/utils/location-images";
import type { Location } from "@/db/repositories/interfaces";
import type { AdminActionResult } from "./admin-guests";

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

type LocationFields = {
  name: string;
  description: string;
  areaDescription?: string;
  capacity: number;
  color: string;
  hidden: boolean;
  bookable: boolean;
  eventIds: string[];
};

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseLocationForm(
  formData: FormData
): { fields: LocationFields; image?: File } | { error: string } {
  const name = formString(formData, "name");
  if (!name) return { error: "Name is required" };

  const capacity = Number(formString(formData, "capacity") || 0);
  if (!Number.isInteger(capacity) || capacity < 0) {
    return { error: "Capacity must be a non-negative whole number" };
  }

  const color = formString(formData, "color");
  if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return { error: "Color must be a hex value like #aabbcc" };
  }

  const areaDescription = formString(formData, "areaDescription");
  const imageEntry = formData.get("image");
  const image =
    imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : undefined;

  return {
    fields: {
      name,
      description: formString(formData, "description"),
      areaDescription: areaDescription || undefined,
      capacity,
      color,
      hidden: formData.get("hidden") === "on",
      bookable: formData.get("bookable") === "on",
      eventIds: formData
        .getAll("eventIds")
        .filter((v): v is string => typeof v === "string"),
    },
    image,
  };
}

async function validateEventIds(eventIds: string[]): Promise<string | null> {
  const events = await getRepositories().events.list();
  const known = new Set(events.map((e) => e.id));
  return eventIds.every((id) => known.has(id)) ? null : "Unknown event";
}

/** Reads and validates an uploaded image without storing it yet. */
async function prepareImage(
  image: File
): Promise<{ buffer: Buffer; ext: string } | { error: string }> {
  const buffer = Buffer.from(await image.arrayBuffer());
  const validation = await validateLocationImage(buffer);
  if ("error" in validation) return validation;
  return { buffer, ext: validation.ext };
}

export async function createLocationAction(
  formData: FormData
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const parsed = parseLocationForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };
  const { fields, image } = parsed;

  const eventError = await validateEventIds(fields.eventIds);
  if (eventError) return { ok: false, error: eventError };

  // Validate the image before creating the location so a bad upload
  // doesn't leave a half-created record behind
  const prepared = image ? await prepareImage(image) : undefined;
  if (prepared && "error" in prepared)
    return { ok: false, error: prepared.error };

  const { locations } = getRepositories();
  const existing = await locations.list();
  const sortIndex =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((l) => l.sortIndex)) + 1;

  const location = await locations.create({
    name: fields.name,
    imageUrl: "",
    description: fields.description,
    capacity: fields.capacity,
    color: fields.color,
    hidden: fields.hidden,
    bookable: fields.bookable,
    sortIndex,
    areaDescription: fields.areaDescription,
  });

  if (prepared) {
    const imageUrl = await saveLocationImage(
      location.id,
      prepared.buffer,
      prepared.ext
    );
    await locations.update(location.id, { ...location, imageUrl });
  }
  await locations.setEventIds(location.id, fields.eventIds);

  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function updateLocationAction(
  formData: FormData
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const id = formString(formData, "id");
  const parsed = parseLocationForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };
  const { fields, image } = parsed;

  const eventError = await validateEventIds(fields.eventIds);
  if (eventError) return { ok: false, error: eventError };

  const { locations } = getRepositories();
  const existing = await locations.findById(id);
  if (!existing) return { ok: false, error: "Location not found" };

  let imageUrl = existing.imageUrl;
  if (image) {
    const prepared = await prepareImage(image);
    if ("error" in prepared) return { ok: false, error: prepared.error };
    imageUrl = await saveLocationImage(id, prepared.buffer, prepared.ext);
  }

  const data: Omit<Location, "id"> = {
    name: fields.name,
    imageUrl,
    description: fields.description,
    capacity: fields.capacity,
    color: fields.color,
    hidden: fields.hidden,
    bookable: fields.bookable,
    sortIndex: existing.sortIndex,
    areaDescription: fields.areaDescription,
  };
  await locations.update(id, data);
  await locations.setEventIds(id, fields.eventIds);

  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function deleteLocationAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { locations } = getRepositories();
  const location = await locations.findById(input.id);
  if (!location) return { ok: false, error: "Location not found" };

  await locations.delete(input.id);
  await deleteLocationImage(input.id);

  revalidatePath("/admin/locations");
  return { ok: true };
}

export async function moveLocationAction(input: {
  id: string;
  direction: "up" | "down";
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { locations } = getRepositories();
  await locations.move(input.id, input.direction);

  revalidatePath("/admin/locations");
  return { ok: true };
}
