"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import {
  deleteMapImage,
  saveMapImage,
  validateMapImage,
} from "@/utils/map-image";
import type { AdminActionResult } from "./admin-guests";

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateSettingsAction(
  formData: FormData
): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) {
    return { ok: false, error: "Unauthorized" };
  }

  const title = formString(formData, "title");
  if (!title) {
    return { ok: false, error: "Title is required" };
  }
  const description = formString(formData, "description");

  const imageEntry = formData.get("image");
  const image =
    imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : undefined;
  const removeMap = formData.get("removeMap") === "on";

  const { settings } = getRepositories();
  const current = await settings.get();

  // Validate the image (if any) before persisting anything.
  let prepared: { buffer: Buffer; ext: string } | undefined;
  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const validation = await validateMapImage(buffer);
    if ("error" in validation) {
      return { ok: false, error: validation.error };
    }
    prepared = { buffer, ext: validation.ext };
  }

  let mapImageUrl = current.mapImageUrl;
  if (prepared) {
    mapImageUrl = await saveMapImage(prepared.buffer, prepared.ext);
  } else if (removeMap) {
    await deleteMapImage();
    mapImageUrl = "";
  }

  await settings.update({ title, description, mapImageUrl });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}
