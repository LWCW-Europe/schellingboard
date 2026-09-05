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
      <p className="text-sm text-fg-subtle">
        Everything here is private and never shown to other attendees. Your{" "}
        <Link
          href="/guests/edit"
          className="text-brand-fg hover:text-brand-fg-hover underline"
        >
          public profile
        </Link>{" "}
        is edited separately.
      </p>
      {/* Availability is per-event, so it cannot live here -- but this is
          where people look for it first. */}
      <p className="text-sm text-fg-subtle">
        Setting when you&apos;re free for 1-on-1s is per event: open the event
        and use its <strong>1-on-1s</strong> link.
      </p>

      <form
        onSubmit={(e) => form.handleSubmit(handleSubmit)(e) as never}
        className="flex flex-col gap-4"
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="text-lg font-semibold mb-1">
            Email me when&hellip;
          </legend>
          <p className="text-sm text-fg-subtle mb-1">
            Notifications go to the email address the organizers have for you.
            Contact an organizer to change it.
          </p>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("rsvpChange")} />a session
            I&rsquo;ve RSVP&rsquo;d to changes time or location, or is deleted
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("hostChange")} />a session
            I&rsquo;m hosting changes time or location, or is deleted
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("cohostAdd")} />
            someone adds me as a session co-host
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("proposalComment")} />
            someone comments on a proposal I&rsquo;m hosting
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("sessionComment")} />
            someone comments on a session I&rsquo;m hosting
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("profileComment")} />
            someone comments on my profile
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("commentThread")} />
            someone comments on a proposal, session or profile I&rsquo;ve
            commented on
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("meetingRequest")} />
            someone asks me for a 1-on-1
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" {...form.register("meetingResponse")} />a
            1-on-1 of mine is accepted, declined or canceled
          </label>
        </fieldset>

        {form.formState.errors.root && (
          <div className="bg-danger-tint border border-danger-border text-danger-fg px-4 py-3 rounded-md">
            <p className="text-sm font-medium">
              Error: {form.formState.errors.root.message}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-brand text-on-brand font-semibold py-2 rounded shadow disabled:bg-surface-hover disabled:text-fg-subtle disabled:shadow-none hover:bg-brand-hover active:bg-brand-hover px-12"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </button>
          {saved && !form.formState.isDirty && (
            <span role="status" className="text-sm text-success-fg">
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
