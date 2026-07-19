"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { sendMail } from "@/utils/mailer";
import { testEmail } from "@/emails/test-email";
import { z } from "zod";
import { createGuestSchema, updateGuestSchema } from "@/model/guest";

export type AdminFormActionResult =
  { ok: true } | { ok: false; error: string | z.core.$ZodIssue[] };
export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

const EMAIL_UNIQUENESS_ERROR: z.core.$ZodIssue = {
  code: "custom",
  path: ["email"],
  message: "A user with this email already exists",
};

export async function createGuestAction(
  input: z.input<typeof createGuestSchema>
): Promise<AdminFormActionResult>;
export async function createGuestAction(
  input: unknown
): Promise<AdminFormActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const parseResult = createGuestSchema.safeParse(input);
  if (!parseResult.success) {
    return { ok: false, error: parseResult.error.issues };
  }

  const { name, email } = parseResult.data;

  const { guests } = getRepositories();
  // findOrCreateByEmail is atomic (unique index on lower(email)), so a
  // concurrent create with the same email can't slip past this check.
  const { created } = await guests.findOrCreateByEmail({
    name,
    info: { email },
  });
  if (!created) {
    return {
      ok: false,
      error: [EMAIL_UNIQUENESS_ERROR],
    };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateGuestAction(
  input: z.input<typeof updateGuestSchema>
): Promise<AdminFormActionResult>;
export async function updateGuestAction(
  input: unknown
): Promise<AdminFormActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const parseResult = updateGuestSchema.safeParse(input);
  if (!parseResult.success) {
    return { ok: false, error: parseResult.error.issues };
  }

  const { id, name, email } = parseResult.data;

  const { guests } = getRepositories();
  const existing = await guests.findByEmail(email);
  if (existing && existing.id !== id) {
    return { ok: false, error: [EMAIL_UNIQUENESS_ERROR] };
  }

  let updated;
  try {
    updated = await guests.update(id, { name, info: { email } });
  } catch (e) {
    // A concurrent update/create can win the race between the findByEmail
    // check above and this update; translate the constraint violation into
    // the same friendly error instead of surfacing a 500.
    if (
      e instanceof Error &&
      e.message.includes(
        "UNIQUE constraint failed: index 'guests_email_unique'"
      )
    ) {
      return {
        ok: false,
        error: [EMAIL_UNIQUENESS_ERROR],
      };
    }
    throw e;
  }
  if (!updated) return { ok: false, error: "User not found" };

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteGuestAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { guests } = getRepositories();
  const guest = await guests.findById(input.id);
  if (!guest) return { ok: false, error: "User not found" };

  await guests.delete(input.id);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function sendTestEmailAction(input: {
  id: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const { guests } = getRepositories();
  const guest = await guests.findById(input.id);
  if (!guest) return { ok: false, error: "User not found" };

  try {
    await sendMail({
      to: guest.info.email,
      ...testEmail({ name: guest.name }),
    });
  } catch (err) {
    console.error("Failed to send test email:", err);
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Failed to send test email: ${detail}` };
  }

  return { ok: true };
}
