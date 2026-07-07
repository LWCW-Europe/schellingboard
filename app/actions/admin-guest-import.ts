"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { parseUserImportCsv } from "@/utils/user-import";

export type ImportGuestsResult =
  | { ok: true; created: number; existing: number }
  | { ok: false; error: string; lineErrors?: string[] };

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

/**
 * Imports users from CSV (header: name,email) and assigns them to the given
 * events. Users are matched by email (case-insensitive): existing users are
 * left unchanged but still assigned, so re-running an import is idempotent.
 */
export async function importGuestsAction(input: {
  csvText: string;
  eventIds: string[];
}): Promise<ImportGuestsResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { events, guests } = getRepositories();
  const eventIds = [...new Set(input.eventIds)];
  for (const eventId of eventIds) {
    if (!(await events.findById(eventId))) {
      return { ok: false, error: "Event not found" };
    }
  }

  const parsed = parseUserImportCsv(input.csvText);
  if (!parsed.ok) {
    return { ok: false, error: "Invalid CSV file", lineErrors: parsed.errors };
  }

  const { created } = await guests.importAndAssign(parsed.rows, eventIds);

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  for (const eventId of eventIds) {
    revalidatePath(`/admin/events/${eventId}`);
  }

  return { ok: true, created, existing: parsed.rows.length - created };
}
