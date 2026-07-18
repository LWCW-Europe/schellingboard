"use server";

import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { emailSettingsSchema } from "@/model/guest";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { z } from "zod";

export type SettingsActionResult =
  { ok: true } | { ok: false; error: string | z.core.$ZodIssue[] };

export async function updateEmailSettingsAction(
  settings: z.input<typeof emailSettingsSchema>
): Promise<SettingsActionResult>;

export async function updateEmailSettingsAction(
  settings: unknown
): Promise<SettingsActionResult> {
  const parseResult = emailSettingsSchema.safeParse(settings);
  if (!parseResult.success) {
    return { ok: false, error: parseResult.error.issues };
  }

  const currentUser = await verifiedCurrentUser(await cookies());
  if (!currentUser) {
    return { ok: false, error: "No user is logged in" };
  }

  const { guests } = getRepositories();
  const updated = await guests.updateEmailSettings(
    currentUser,
    parseResult.data
  );
  if (!updated) {
    return { ok: false, error: "Profile not found" };
  }

  return { ok: true };
}
