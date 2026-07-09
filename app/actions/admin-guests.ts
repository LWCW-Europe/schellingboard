"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";
import { sendMail } from "@/utils/mailer";
import { testEmail } from "@/emails/test-email";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

function validateGuestInput(name: string, email: string): string | null {
  if (!name) return "Name is required";
  if (!email) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email address";
  return null;
}

export async function createGuestAction(input: {
  name: string;
  email: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const name = input.name.trim();
  const email = input.email.trim();
  const validationError = validateGuestInput(name, email);
  if (validationError) return { ok: false, error: validationError };

  const { guests } = getRepositories();
  // findOrCreateByEmail is atomic (unique index on lower(email)), so a
  // concurrent create with the same email can't slip past this check.
  const { created } = await guests.findOrCreateByEmail({
    name,
    info: { email },
  });
  if (!created) {
    return { ok: false, error: "A user with this email already exists" };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateGuestAction(input: {
  id: string;
  name: string;
  email: string;
}): Promise<AdminActionResult> {
  if (!(await isAdminRequest())) return { ok: false, error: "Unauthorized" };

  const name = input.name.trim();
  const email = input.email.trim();
  const validationError = validateGuestInput(name, email);
  if (validationError) return { ok: false, error: validationError };

  const { guests } = getRepositories();
  const existing = await guests.findByEmail(email);
  if (existing && existing.id !== input.id) {
    return { ok: false, error: "A user with this email already exists" };
  }

  let updated;
  try {
    updated = await guests.update(input.id, { name, info: { email } });
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
      return { ok: false, error: "A user with this email already exists" };
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
