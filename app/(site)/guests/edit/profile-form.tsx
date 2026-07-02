"use client";

import {
  useState,
  type SyntheticEvent,
  useRef,
  useEffect,
  useMemo,
  ButtonHTMLAttributes,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/app/input";
import { updateProfileAction } from "@/app/actions/profile";
import { Avatar } from "../avatar";
import type { Guest } from "@/db/repositories/interfaces";
import { resizeImage } from "@/utils/images-client";
import clsx from "clsx";

export function ProfileForm({ guest }: { guest: Guest }) {
  const router = useRouter();
  const [name, setName] = useState(guest.name);
  const [aboutMe, setAboutMe] = useState(guest.aboutMe ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<File | null | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  const avatarUrl = useMemo(
    () => avatar && URL.createObjectURL(avatar),
    [avatar]
  );

  useEffect(
    () => () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    },
    [avatarUrl]
  );

  const resize = async (file: File, maxSize: number) => {
    return canvas.current
      ? await resizeImage(canvas.current, file, maxSize)
      : { blob: file };
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("aboutMe", aboutMe);

    try {
      if (avatar === null) {
        formData.append("avatar", "");
      } else if (avatar) {
        const resized = await resize(avatar, 256);
        if ("error" in resized) {
          setError(resized.error);
          return;
        }

        formData.append("avatar", resized.blob);
      }

      const result = await updateProfileAction(formData);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.push(`/guests/${guest.id}`);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarAreaController: ButtonHTMLAttributes<HTMLButtonElement> = useMemo(
    () => ({
      onDrop(e) {
        e.preventDefault();
        setAvatar(e.dataTransfer.files?.item(0) ?? null);
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
    [fileInput]
  );

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
        onSubmit={(e) => void handleSubmit(e)}
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
              name={name}
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
            onClick={() => setAvatar(null)}
          >
            Reset
          </button>
          <input
            id={`${guest.id}-image`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={fileInput}
            hidden
            onChange={(e) => setAvatar(e.target.files?.item(0) ?? null)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="profile-name">
            Name
            <span className="text-rose-500 mx-1">*</span>
          </label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="profile-about-me">
            About me
          </label>
          <textarea
            id="profile-about-me"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Tell others about yourself"
            className="rounded-md text-sm resize-y h-40 border bg-white px-4 py-2 shadow-sm transition-colors focus:outline-none border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        )}

        <button
          type="submit"
          className="bg-rose-400 text-white font-semibold py-2 rounded shadow disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500 mx-auto px-12"
          disabled={!name || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
