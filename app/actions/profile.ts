"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfileAction(
  formData: FormData
): Promise<ProfileActionResult> {
  const name = ((formData.get("name") as string | null) ?? "").trim();
  const aboutMe = (formData.get("aboutMe") as string | null)?.trim() ?? null;

  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;
  if (!currentUser) {
    return { ok: false, error: "No user is logged in" };
  }

  if (!name) {
    return { ok: false, error: "Name is required" };
  }

  const { guests } = getRepositories();
  if (!(await guests.findById(currentUser))) {
    return { ok: false, error: "Profile not found" };
  }

  await guests.updateProfile(currentUser, { name, aboutMe: aboutMe });

  revalidatePath(`/guests/${currentUser}`);
  revalidatePath("/guests");
  return { ok: true };
}
