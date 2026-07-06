"use client";

import {
  useState,
  useEffect,
  useMemo,
  ButtonHTMLAttributes,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/app/input";
import { updateProfileAction } from "@/app/actions/profile";
import { Avatar } from "../avatar";
import type { Guest } from "@/db/repositories/interfaces";
import { resizeImage } from "@/utils/images-client";
import clsx from "clsx";
import { Path, useForm, useWatch } from "react-hook-form";
import { profileSchema } from "@/model/guest";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileFormSchema = profileSchema.extend({
  avatar: z.instanceof(FileList).nullable().optional(),
});

export function ProfileForm({ guest }: { guest: Guest }) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: guest.name,
      aboutMe: guest.aboutMe,
    },
    resolver: zodResolver(profileFormSchema),
  });
  const avatarFileList = useWatch({
    control: form.control,
    name: "avatar",
  });
  const avatar = avatarFileList === null ? null : avatarFileList?.[0];
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const avatarUrl = useMemo(
    () => avatar && URL.createObjectURL(avatar),
    [avatar]
  );

  useEffect(() => {
    const url = avatarUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [avatarUrl]);

  const resize = async (file: Blob, maxSize: number) => {
    return canvas.current
      ? await resizeImage(canvas.current, file, maxSize)
      : { blob: file };
  };

  const handleSubmit = async (
    rawProfile: z.infer<typeof profileFormSchema>
  ) => {
    setIsSubmitting(true);
    setFormError(null);

    const profile: z.infer<typeof profileSchema> = {
      ...rawProfile,
      avatar: rawProfile.avatar === null ? null : rawProfile.avatar?.[0],
    };

    // Try to preprocess the avatar
    if (profile.avatar) {
      try {
        const resized = await resize(profile.avatar, 256);
        if ("error" in resized) {
          form.setError("avatar", { message: resized.error });
          return;
        }

        profile.avatar = resized.blob;
      } catch {}
    }

    try {
      const result = await updateProfileAction(profile);
      if (!result.ok) {
        if (typeof result.error === "string") setFormError(result.error);
        else
          for (const issue of result.error) {
            const path = issue.path.join(".") as Path<
              z.infer<typeof profileFormSchema>
            >;
            form.setError(path, issue);
          }
      } else {
        router.push(`/guests/${guest.id}`);
        router.refresh();
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarAreaController: ButtonHTMLAttributes<HTMLButtonElement> = useMemo(
    () => ({
      onDrop(e) {
        e.preventDefault();
        form.setValue("avatar", e.dataTransfer.files);
        setIsDragging(false);
      },
      onDragOver: function (e) {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave(e) {
        e.preventDefault();
        setIsDragging(false);
      },
      onClick() {
        fileInput.current?.click();
      },
    }),
    [fileInput, form]
  );

  const { ref: avatarRef, ...avatarInputController } = form.register("avatar");

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <Link
        href="/guests"
        className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
      >
        Back to attendees
      </Link>
      <h1 className="text-2xl font-bold">Edit profile</h1>

      <canvas ref={canvas} hidden />

      <form
        onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center gap-4 cursor-pointer">
          <button
            className={clsx(
              "flex items-center gap-4 cursor-pointer pe-4 border-solid border-e",
              "hover:text-rose-500 active:text-rose-600 drop:boder-rose-400",
              "transition-outline duration-200 ease-in-out outline-gray-500 outline-dashed outline-0",
              isDragging
                ? "cursor-grabbing outline-4 rounded-full border-transparent"
                : "border-gray-500"
            )}
            type="button"
            {...avatarAreaController}
          >
            <Avatar
              name={form.getValues().name}
              size="sm"
              image={
                avatarUrl === null
                  ? undefined
                  : avatarUrl
                    ? avatarUrl
                    : guest.avatarUrl
                      ? guest.avatarUrl
                      : undefined
              }
            />
            <label htmlFor={`${guest.id}-image`}>Change profile picture</label>
          </button>
          <button
            type="button"
            className="text-rose-400 hover:text-rose-500 active:text-rose-600 cursor-pointer"
            onClick={() => form.setValue("avatar", null)}
          >
            Reset
          </button>
          <input
            id={`${guest.id}-image`}
            type="file"
            className={form.formState.errors.avatar ? "invalid" : ""}
            {...avatarInputController}
            ref={(el) => {
              avatarRef(el);
              fileInput.current = el;
            }}
            hidden
          />
        </div>
        <span className="text-rose-400 text-sm">
          {form.formState.errors.avatar?.message}
        </span>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="profile-name">
            Name
            <span className="text-rose-500 mx-1">*</span>
          </label>
          <Input
            id="profile-name"
            className={form.formState.errors.name ? "invalid" : ""}
            {...form.register("name")}
            placeholder="Your name"
          />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.name?.message}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="profile-about-me">
            About me
          </label>
          <textarea
            id="profile-about-me"
            {...form.register("aboutMe")}
            placeholder="Tell others about yourself"
            className={clsx(
              "rounded-md text-sm resize-y h-40 border bg-white px-4 py-2 shadow-sm transition-colors focus:outline-none border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none",
              form.formState.errors.aboutMe ? "invalid" : ""
            )}
          />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.aboutMe?.message}
          </span>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Error: {formError}</p>
          </div>
        )}

        <button
          type="submit"
          className="bg-rose-400 text-white font-semibold py-2 rounded shadow disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500 mx-auto px-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
