"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from "@/utils/auth";

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
  if (await guests.findByEmail(email)) {
    return { ok: false, error: "A user with this email already exists" };
  }

  await guests.create({ name, info: { email } });
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

  const updated = await guests.update(input.id, { name, info: { email } });
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
