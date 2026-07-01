"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { getImageRepositories } from "@/utils/images";

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfileAction(
  formData: FormData
): Promise<ProfileActionResult> {
  const name = ((formData.get("name") as string | null) ?? "").trim();
  const aboutMe = (formData.get("aboutMe") as string | null)?.trim() ?? null;
  const avatarEntry = formData.get("avatar");
  const avatarFile =
    avatarEntry === ""
      ? null
      : avatarEntry instanceof File && avatarEntry.size > 0
        ? avatarEntry
        : undefined;

  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;
  if (!currentUser) {
    return { ok: false, error: "No user is logged in" };
  }

  if (!name) {
    return { ok: false, error: "Name is required" };
  }

  const { guests } = getRepositories();
  const currentProfile = await guests.findById(currentUser);
  if (!currentProfile) {
    return { ok: false, error: "Profile not found" };
  }

  const { avatars } = getImageRepositories();

  let avatarUrl: string | undefined | null =
    avatarFile === null ? null : (currentProfile.avatarUrl ?? null);

  if (avatarFile) {
    const avatarBuffer = await avatars.validate(
      Buffer.from(await avatarFile.arrayBuffer())
    );
    if ("error" in avatarBuffer) {
      return { ok: false, error: avatarBuffer.error };
    }

    avatarUrl = await avatars.save(
      currentUser,
      avatarBuffer.buffer,
      avatarBuffer.ext
    );
  }

  await guests.updateProfile(currentUser, { name, aboutMe, avatarUrl });

  revalidatePath(`/guests/${currentUser}`);
  revalidatePath("/guests");
  return { ok: true };
}
