"use client";

import {
  useState,
  useEffect,
  useMemo,
  ButtonHTMLAttributes,
  PropsWithChildren,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/app/input";
import { updateProfileAction } from "@/app/actions/profile";
import { Avatar } from "../avatar";
import type { Guest } from "@/db/repositories/interfaces";
import { CONTACT_TYPES } from "@/db/repositories/interfaces";
import { resizeImage } from "@/utils/images-client";
import clsx from "clsx";
import {
  Controller,
  Path,
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  CONTACT_TYPE_LABELS,
  MAX_CONTACTS,
  MAX_LANGUAGES,
  profileSchema,
} from "@/model/guest";
import { CORE_PROMPTS, PROMPT_POOL } from "@/model/prompt-pool";
import { languageSuggestions } from "@/model/languages";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ArrowPathIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { MarkdownHint } from "@/app/(site)/markdown";
import { MarkdownTextarea } from "@/app/components/markdown-textarea";

const profileFormSchema = profileSchema.extend({
  avatar: z.instanceof(FileList).nullable().optional(),
  // Field arrays need object entries, so languages are wrapped client-side
  // and unwrapped to plain strings on submit.
  languages: z.array(
    z.object({
      value: z.string().trim().max(50, {
        message: "Keep language names under 50 characters",
      }),
    })
  ),
});

// Module-level because it's impure (Math.random): only ever called from
// event handlers, but the React Compiler can't verify that inside a component.
function pickRandomPrompt(used: string[]): string | undefined {
  const usedSet = new Set(used);
  const available = PROMPT_POOL.filter((p) => !usedSet.has(p));
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
}

/** Core prompts first (pre-seeded, empty when unanswered), then the rest. */
function seedPrompts(saved: Guest["prompts"]) {
  const answers = new Map((saved ?? []).map((p) => [p.prompt, p.answer]));
  return [
    ...CORE_PROMPTS.map((prompt) => ({
      prompt,
      answer: answers.get(prompt) ?? "",
    })),
    ...(saved ?? []).filter((p) => !CORE_PROMPTS.includes(p.prompt)),
  ];
}

export function ProfileForm({ guest }: { guest: Guest }) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: guest.name,
      aboutMe: guest.aboutMe,
      pronouns: guest.pronouns,
      basedIn: guest.basedIn ?? null,
      prompts: seedPrompts(guest.prompts),
      languages: (guest.languages ?? []).map((value) => ({ value })),
      contacts: (guest.contacts ?? []).map((c) => ({
        type: c.type,
        label: c.label ?? "",
        value: c.value,
      })),
    },
    resolver: zodResolver(profileFormSchema),
  });
  const prompts = useFieldArray({ control: form.control, name: "prompts" });
  const languages = useFieldArray({ control: form.control, name: "languages" });
  const contacts = useFieldArray({ control: form.control, name: "contacts" });
  const avatarFileList = useWatch({
    control: form.control,
    name: "avatar",
  });
  // Watched (not fields state) so the label input appears as soon as the
  // type select changes to "other".
  const watchedContacts = useWatch({ control: form.control, name: "contacts" });
  const pronounController = useController({
    control: form.control,
    name: "pronouns",
  });
  const avatar = avatarFileList === null ? null : avatarFileList?.[0];
  const [isDragging, setIsDragging] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const languageOptions = useMemo(() => languageSuggestions(), []);

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

  const pickUnusedPrompt = () =>
    pickRandomPrompt((form.getValues("prompts") ?? []).map((p) => p.prompt));

  const suggestPrompt = () => {
    const pick = pickUnusedPrompt();
    if (pick) prompts.append({ prompt: pick, answer: "" });
  };

  // One-click alternative to Remove + Suggest a prompt: swap this row for a
  // different random suggestion, so people can iterate until one clicks.
  const swapPrompt = (index: number) => {
    const pick = pickUnusedPrompt();
    if (pick) prompts.update(index, { prompt: pick, answer: "" });
  };

  const handleSubmit = async (
    rawProfile: z.infer<typeof profileFormSchema>
  ) => {
    const profile: z.input<typeof profileSchema> = {
      ...rawProfile,
      avatar: rawProfile.avatar === null ? null : rawProfile.avatar?.[0],
      languages: rawProfile.languages.map((l) => l.value),
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
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <Link
        href="/guests"
        className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
      >
        Back to attendees
      </Link>
      <h1 className="text-2xl font-bold">Edit profile</h1>
      <p className="text-sm text-gray-500">
        Everything here is shown on your public profile. Email notifications and
        other private preferences live in{" "}
        <Link
          href="/settings"
          className="text-rose-500 hover:text-rose-600 underline"
        >
          Settings
        </Link>
        .
      </p>

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
            <FreeformCombobox
              id="profile-pronouns"
              options={defaultPronouns}
              placeholder="He/Him/His/They/etc."
              value={pronounController.field.value}
              onChange={pronounController.field.onChange}
              invalid={pronounController.fieldState.invalid}
            />
            <span className="text-rose-400 text-sm">
              {form.formState.errors.pronouns?.message}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 md:w-1/2">
          <label className="font-medium" htmlFor="profile-based-in">
            Based in
          </label>
          <Input
            id="profile-based-in"
            className={form.formState.errors.basedIn ? "invalid" : ""}
            {...form.register("basedIn")}
            placeholder="City, region, or country"
          />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.basedIn?.message}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="profile-about-me">
            About me
          </label>
          <MarkdownTextarea
            id="profile-about-me"
            {...form.register("aboutMe")}
            placeholder="Tell others about yourself"
            className={clsx(form.formState.errors.aboutMe ? "invalid" : "")}
          />
          <MarkdownHint />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.aboutMe?.message}
          </span>
        </div>

        <DisclosureSection
          title="Conversation starters"
          hint="Optional prompts that give people something to ask you about"
          defaultOpen={(guest.prompts ?? []).length > 0}
        >
          {prompts.fields.map((field, i) => {
            const isCore = CORE_PROMPTS.includes(field.prompt);
            return (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <label
                    className="font-medium"
                    htmlFor={`profile-prompt-${i}`}
                  >
                    {field.prompt}
                  </label>
                  {!isCore && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Suggest a different prompt"
                        title="Suggest a different prompt"
                        className="text-rose-400 hover:text-rose-500"
                        onClick={() => swapPrompt(i)}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="text-sm text-rose-400 hover:text-rose-500"
                        onClick={() => prompts.remove(i)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <Input
                  id={`profile-prompt-${i}`}
                  className={
                    form.formState.errors.prompts?.[i]?.answer ? "invalid" : ""
                  }
                  {...form.register(`prompts.${i}.answer`)}
                  placeholder="A sentence or two"
                />
                <span className="text-rose-400 text-sm">
                  {form.formState.errors.prompts?.[i]?.answer?.message}
                </span>
              </div>
            );
          })}
          <button
            type="button"
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 w-fit"
            onClick={suggestPrompt}
          >
            Suggest a prompt
          </button>
        </DisclosureSection>

        <DisclosureSection
          title="Languages"
          hint="Languages you're happy to talk in"
          defaultOpen={(guest.languages ?? []).length > 0}
        >
          {languages.fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1">
                <Controller
                  control={form.control}
                  name={`languages.${i}.value`}
                  render={({ field: f, fieldState }) => (
                    <>
                      <FreeformCombobox
                        ariaLabel="Language"
                        options={languageOptions}
                        filterOptions
                        placeholder="Language"
                        value={f.value}
                        onChange={(v) => f.onChange(v ?? "")}
                        invalid={fieldState.invalid}
                      />
                      {fieldState.error && (
                        <span className="text-rose-400 text-sm">
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              <button
                type="button"
                className="text-sm text-rose-400 hover:text-rose-500"
                onClick={() => languages.remove(i)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 w-fit disabled:text-gray-400"
            disabled={languages.fields.length >= MAX_LANGUAGES}
            onClick={() => languages.append({ value: "" })}
          >
            Add language
          </button>
          <span className="text-rose-400 text-sm">
            {form.formState.errors.languages?.root?.message ??
              form.formState.errors.languages?.message}
          </span>
        </DisclosureSection>

        <DisclosureSection
          title="Contact details"
          hint="Shown publicly on your profile — only add what you want visible"
          defaultOpen={(guest.contacts ?? []).length > 0}
        >
          {contacts.fields.map((field, i) => (
            <div key={field.id} className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <select
                  aria-label="Contact type"
                  {...form.register(`contacts.${i}.type`)}
                  className="h-12 sm:w-40 rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-0"
                >
                  {CONTACT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {CONTACT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
                {watchedContacts?.[i]?.type === "other" && (
                  <Input
                    aria-label="Contact label"
                    className={clsx(
                      "sm:w-32",
                      form.formState.errors.contacts?.[i]?.label
                        ? "invalid"
                        : ""
                    )}
                    {...form.register(`contacts.${i}.label`)}
                    placeholder="Label"
                  />
                )}
                <Input
                  aria-label="Contact value"
                  className={clsx(
                    "flex-1",
                    form.formState.errors.contacts?.[i]?.value ? "invalid" : ""
                  )}
                  {...form.register(`contacts.${i}.value`)}
                  placeholder="@handle, address, or URL"
                />
                <button
                  type="button"
                  className="text-sm text-rose-400 hover:text-rose-500"
                  onClick={() => contacts.remove(i)}
                >
                  Remove
                </button>
              </div>
              <span className="text-rose-400 text-sm">
                {form.formState.errors.contacts?.[i]?.label?.message ??
                  form.formState.errors.contacts?.[i]?.value?.message}
              </span>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 w-fit disabled:text-gray-400"
            disabled={contacts.fields.length >= MAX_CONTACTS}
            onClick={() =>
              contacts.append({ type: "email", label: "", value: "" })
            }
          >
            Add contact
          </button>
          <span className="text-rose-400 text-sm">
            {form.formState.errors.contacts?.root?.message ??
              form.formState.errors.contacts?.message}
          </span>
        </DisclosureSection>

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

function DisclosureSection({
  title,
  hint,
  defaultOpen,
  children,
}: PropsWithChildren<{
  title: string;
  hint: string;
  defaultOpen: boolean;
}>) {
  // Controlled so React re-renders (e.g. form state changes) don't snap the
  // section back to its initial state after the user toggles it.
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="rounded-md border border-gray-200 bg-white shadow-sm"
    >
      <summary className="cursor-pointer select-none px-4 py-3">
        <span className="font-medium">{title}</span>
        <span className="block text-sm text-gray-500">{hint}</span>
      </summary>
      <div className="flex flex-col gap-4 px-4 pb-4">{children}</div>
    </details>
  );
}

const defaultPronouns = [
  "He/Him",
  "She/Her",
  "They/Them",
  "He/They",
  "She/They",
  "Any pronouns",
  "Ask me",
];

function FreeformCombobox({
  value,
  onChange,
  invalid = false,
  id,
  ariaLabel,
  options,
  placeholder,
  filterOptions = false,
}: {
  id?: string;
  ariaLabel?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  invalid?: boolean;
  options: string[];
  placeholder?: string;
  /** Narrow the suggestion list to entries matching the typed text. */
  filterOptions?: boolean;
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

  const query = (value ?? "").trim().toLowerCase();
  const shownOptions =
    filterOptions && query
      ? options.filter((o) => o.toLowerCase().includes(query))
      : options;

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
          aria-label={ariaLabel}
          ref={inputRef}
          placeholder={placeholder}
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
        {/* modal={false} keeps the page scrollable while the list is open */}
        <ComboboxOptions
          modal={false}
          className="absolute mt-1 z-10 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <div className="max-h-60 overflow-auto">
            {shownOptions.map((option) => (
              <ComboboxOption
                key={option}
                value={option}
                className={({ focus }) =>
                  clsx`relative cursor-pointer select-none py-2 pl-10 pr-4 z-10
                    ${focus ? "bg-rose-100 text-rose-900" : "text-gray-900 bg-white"}`
                }
              >
                {option}
              </ComboboxOption>
            ))}
          </div>
          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
            Pick one or type your own
          </div>
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
