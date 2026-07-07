"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { getImageRepositories } from "@/utils/images";
import { profileSchema } from "@/model/guest";
import { z } from "zod";
import { $ZodIssue } from "zod/v4/core";

export type ProfileActionResult =
  { ok: true } | { ok: false; error: string | $ZodIssue[] };

const profileActionSchema = profileSchema.extend({
  avatar: profileSchema.shape.avatar.transform(async (avatarFile, ctx) => {
    if (!avatarFile) return avatarFile;
    const { avatars } = getImageRepositories();

    const avatarBuffer = await avatars.validate(
      Buffer.from(await avatarFile.arrayBuffer())
    );

    if ("error" in avatarBuffer) {
      ctx.addIssue({
        code: "custom",
        message: avatarBuffer.error,
      });
      return z.NEVER;
    }

    return avatarBuffer;
  }),
});

export async function updateProfileAction(
  formData: z.infer<typeof profileSchema>
): Promise<ProfileActionResult>;

export async function updateProfileAction(
  formData: unknown
): Promise<ProfileActionResult> {
  const parseResult = await profileActionSchema.safeParseAsync(formData);
  if (!parseResult.success) {
    return { ok: false, error: parseResult.error.issues };
  }

  const { name, aboutMe, avatar: avatarFile } = parseResult.data;

  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;
  if (!currentUser) {
    return { ok: false, error: "No user is logged in" };
  }

  const { guests } = getRepositories();
  const currentProfile = await guests.findById(currentUser);
  if (!currentProfile) {
    return { ok: false, error: "Profile not found" };
  }

  const { avatars } = getImageRepositories();

  let avatarUrl: string | undefined | null =
    avatarFile === null ? null : (currentProfile.avatarUrl ?? null);

  if (avatarFile === null) {
    await avatars.delete(currentUser);
  } else if (avatarFile) {
    avatarUrl = await avatars.save(
      currentUser,
      avatarFile.buffer,
      avatarFile.ext
    );
  }

  await guests.updateProfile(currentUser, { name, aboutMe, avatarUrl });

  revalidatePath(`/guests/${currentUser}`);
  revalidatePath("/guests");
  return { ok: true };
}
