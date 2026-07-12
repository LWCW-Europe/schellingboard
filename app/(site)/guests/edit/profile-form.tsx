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
import { Path, useController, useForm, useWatch } from "react-hook-form";
import { profileSchema } from "@/model/guest";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { MarkdownHint } from "@/app/(site)/markdown";

const profileFormSchema = profileSchema.extend({
  avatar: z.instanceof(FileList).nullable().optional(),
});

export function ProfileForm({ guest }: { guest: Guest }) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: guest.name,
      aboutMe: guest.aboutMe,
      pronouns: guest.pronouns,
    },
    resolver: zodResolver(profileFormSchema),
  });
  const avatarFileList = useWatch({
    control: form.control,
    name: "avatar",
  });
  const pronounController = useController({
    control: form.control,
    name: "pronouns",
  });
  const avatar = avatarFileList === null ? null : avatarFileList?.[0];
  const [isDragging, setIsDragging] = useState(false);
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
    const profile: z.infer<typeof profileSchema> = {
      ...rawProfile,
      avatar: rawProfile.avatar === null ? null : rawProfile.avatar?.[0],
    };

    // Try to preprocess the avatar. Ultimately, though, the backend should have the final say
    // So this operation doesn't block the submission
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
        if (typeof result.error === "string")
          form.setError("root", { message: result.error });
        else {
          for (const issue of result.error) {
            const path = issue.path.join(".") as Path<
              z.infer<typeof profileFormSchema>
            >;
            form.setError(path, issue);
          }
        }
      } else {
        router.push(`/guests/${guest.id}`);
        router.refresh();
      }
    } catch (err) {
      form.setError("root", { message: "An unexpected error occurred" });
      console.error(err);
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
        onSubmit={(e) => form.handleSubmit(handleSubmit)(e) as never}
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

        <div className="flex md:flex-row flex-col gap-4">
          <div className="flex flex-1 flex-col gap-1">
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
            <label className="font-medium" htmlFor="profile-pronouns">
              Pronouns
            </label>
            <PronounSelect
              id="profile-pronouns"
              value={pronounController.field.value}
              onChange={pronounController.field.onChange}
              invalid={pronounController.fieldState.invalid}
            />
            <span className="text-rose-400 text-sm">
              {form.formState.errors.pronouns?.message}
            </span>
          </div>
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
          <MarkdownHint />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.aboutMe?.message}
          </span>
        </div>

        {form.formState.errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">
              Error: {form.formState.errors.root.message}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="bg-rose-400 text-white font-semibold py-2 rounded shadow disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500 mx-auto px-12"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

const defaultPronouns = ["He/Him", "She/Her", "They/Them"];

function PronounSelect({
  value,
  onChange,
  invalid = false,
  id,
}: {
  id?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  invalid?: boolean;
}) {
  const mode = useRef<"navigation" | "typing">("navigation");
  const inputRef = useRef<HTMLInputElement>(null);

  // Distinguish between navigation and typing to avoid "enter" changing the input's value
  // to one of the options below.
  // This is a bit hacky, but it works for now.
  // Enter returns undefined, meaning "keep the previous mode".
  const classifyKey = (key: string) => {
    switch (key) {
      case "ArrowUp":
      case "ArrowDown":
      case "Home":
      case "End":
      case "Escape":
      case "Tab":
        return "navigation";
      case "Enter":
        return;
      default:
        return "typing";
    }
  };

  return (
    <div className="relative">
      <Combobox value={value ?? null} onChange={onChange} immediate>
        <ComboboxInput
          className={clsx(
            "h-12 w-full rounded-md border bg-white px-4 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 invalid:placeholder-red-300 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500",
            invalid
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" // matches invalid: styles
              : "border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none"
          )}
          id={id}
          ref={inputRef}
          placeholder="He/Him/His/They/etc."
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            mode.current = classifyKey(e.key) ?? mode.current;
            if (e.key === "Enter" && mode.current === "typing") {
              e.preventDefault();
              inputRef.current?.blur();
            }
          }}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
        </ComboboxButton>
        <ComboboxOptions className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {defaultPronouns.map((value) => (
            <ComboboxOption
              key={value}
              value={value}
              className={({ focus }) =>
                clsx`relative cursor-pointer select-none py-2 pl-10 pr-4 z-10
                  ${focus ? "bg-rose-100 text-rose-900" : "text-gray-900 bg-white"}`
              }
            >
              {value}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
