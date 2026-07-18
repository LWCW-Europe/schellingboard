"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { updateEmailSettingsAction } from "@/app/actions/settings";
import { emailSettingsSchema } from "@/model/guest";
import type { EmailSettings } from "@/db/repositories/interfaces";

export function SettingsForm({
  emailSettings,
}: {
  emailSettings: EmailSettings;
}) {
  const form = useForm({
    defaultValues: emailSettings,
    resolver: zodResolver(emailSettingsSchema),
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (
    settings: z.infer<typeof emailSettingsSchema>
  ) => {
    setSaved(false);
    try {
      const result = await updateEmailSettingsAction(settings);
      if (!result.ok) {
        form.setError("root", {
          message:
            typeof result.error === "string"
              ? result.error
              : "Invalid settings",
        });
      } else {
        // Rebaseline so isDirty reflects "differs from what's saved".
        form.reset(settings);
        setSaved(true);
      }
    } catch (err) {
      form.setError("root", { message: "An unexpected error occurred" });
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 px-4 sm:px-0">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-gray-500">
        Everything here is private and never shown to other attendees. Your{" "}
        <Link
          href="/guests/edit"
          className="text-rose-500 hover:text-rose-600 underline"
        >
          public profile
        </Link>{" "}
        is edited separately.
      </p>

      <form
        onSubmit={(e) => form.handleSubmit(handleSubmit)(e) as never}
        className="flex flex-col gap-4"
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="text-lg font-semibold mb-1">
            Email me when&hellip;
          </legend>
          <p className="text-sm text-gray-500 mb-1">
            Notifications go to the email address the organizers have for you.
            Contact an organizer to change it.
          </p>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...form.register("rsvpChange")} />a session
            I&rsquo;ve RSVP&rsquo;d to changes time or location
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...form.register("hostChange")} />a session
            I&rsquo;m hosting changes time or location
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...form.register("cohostAdd")} />
            someone adds me as a session co-host
          </label>
        </fieldset>

        {form.formState.errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">
              Error: {form.formState.errors.root.message}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-rose-400 text-white font-semibold py-2 rounded shadow disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-rose-500 active:bg-rose-500 px-12"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </button>
          {saved && !form.formState.isDirty && (
            <span role="status" className="text-sm text-green-700">
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
