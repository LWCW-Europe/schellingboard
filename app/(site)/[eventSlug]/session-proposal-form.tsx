"use client";

import { useContext, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/app/input";
import { UserContext, useBreakMinutes, useSlotIncrement } from "../context";
import {
  createProposal,
  updateProposal,
  deleteProposal,
} from "./proposals/actions";
import type { SessionProposal, Guest } from "@/db/repositories/interfaces";
import { SelectHosts } from "@/app/select-hosts";
import { ConfirmDeletionModal } from "../modals";
import { formatDuration, durationMinusBreak } from "@/utils/utils";
import { slotDurationOptions } from "@/utils/slots";
import { MarkdownHint } from "@/app/(site)/markdown";
import { Path, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionProposalSchema } from "@/model/session";
import { z } from "zod";

export function SessionProposalForm(props: {
  eventID: string;
  eventSlug: string;
  proposal?: SessionProposal;
  guests: Guest[];
  maxSessionDuration: number;
}) {
  const { eventID, eventSlug, proposal, guests, maxSessionDuration } = props;
  const breakMinutes = useBreakMinutes();
  const slotIncrement = useSlotIncrement();
  const DURATION_OPTIONS = [
    undefined,
    ...slotDurationOptions(slotIncrement, maxSessionDuration),
  ];
  const { user: currentUserId } = useContext(UserContext);
  const router = useRouter();

  const defaultHosts = useMemo(() => {
    if (proposal) return proposal.hosts.map((h) => h.id);
    if (currentUserId) return [currentUserId];
    return [];
  }, [currentUserId, proposal]);

  const form = useForm({
    resolver: zodResolver(sessionProposalSchema),
    defaultValues: {
      eventId: eventID,
      eventSlug,
      title: proposal?.title ?? "",
      description: proposal?.description ?? "",
      hostIds: defaultHosts,
      durationMinutes: proposal?.durationMinutes,
    },
  });

  const hostsController = useController({
    control: form.control,
    name: "hostIds",
  });

  const durationMinutesController = useController({
    control: form.control,
    name: "durationMinutes",
  });

  const titleController = useController({
    control: form.control,
    name: "title",
  });

  const handleSubmit = async (
    sessionProposal: z.infer<typeof sessionProposalSchema>
  ) => {
    try {
      let result: Awaited<ReturnType<typeof updateProposal>>;
      if (proposal) {
        result = await updateProposal(proposal.id, sessionProposal);
      } else {
        result = await createProposal(sessionProposal);
      }

      if ("error" in result) {
        if (typeof result.error === "string")
          form.setError("root", { message: result.error });
        else {
          for (const issue of result.error) {
            const path = issue.path.join(".") as Path<
              z.infer<typeof sessionProposalSchema>
            >;
            form.setError(path, issue);
          }
        }
      } else {
        router.push(`/${eventSlug}/proposals`);
      }
    } catch (err) {
      form.setError("root", { message: "An unexpected error occurred" });
      console.error(err);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!proposal) return;

    try {
      const result = await deleteProposal(proposal.id, eventSlug);

      if (result.error) {
        form.setError("root", { message: result.error });
      } else {
        router.push(`/${eventSlug}/proposals`);
      }
    } catch (err) {
      form.setError("root", { message: "An unexpected error occurred" });
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Link
        className="bg-rose-400 text-white font-semibold py-2 px-4 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
        href={`/${eventSlug}/proposals`}
      >
        Back to Proposals
      </Link>
      <div>
        <h2 className="text-2xl font-bold">
          {proposal ? "Edit" : "Add"} Session Proposal
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Share your session idea with the community. Only the title is
          required.
        </p>
      </div>

      <form
        onSubmit={(e) => form.handleSubmit(handleSubmit)(e) as never}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="proposal-title">
            Title
            <span className="text-rose-500 mx-1">*</span>
          </label>
          <Input
            id="proposal-title"
            {...form.register("title")}
            autoFocus
            placeholder="Enter a clear, descriptive title"
          />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.title?.message}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="proposal-description">
            Description
          </label>
          <textarea
            id="proposal-description"
            {...form.register("description")}
            className="rounded-md text-sm resize-y h-24 border bg-white px-4 py-2 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 invalid:placeholder-red-300 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none"
            placeholder="Describe what your session will cover"
          />
          <MarkdownHint />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="proposal-hosts">
            Host(s)
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Leave empty if you would like someone to volunteer.
          </p>
          <SelectHosts
            id="proposal-hosts"
            guests={guests}
            hosts={guests.filter((g) =>
              hostsController.field.value?.some((h) => h === g.id)
            )}
            setHosts={(nextHosts) =>
              hostsController.field.onChange(nextHosts.map((h) => h.id))
            }
            selectMany={true}
          />
          <span className="text-rose-400 text-sm">
            {form.formState.errors.hostIds?.message}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">Duration</label>
          <fieldset>
            <div className="grid gap-3">
              {DURATION_OPTIONS.map((value) => (
                <div key={value ?? "undecided"} className="flex items-center">
                  <input
                    id={`duration-${value ?? "undecided"}`}
                    type="radio"
                    checked={value === durationMinutesController.field.value}
                    onChange={() =>
                      durationMinutesController.field.onChange(value)
                    }
                    className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
                  />
                  <label
                    htmlFor={`duration-${value ?? "undecided"}`}
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    {value
                      ? formatDuration(
                          durationMinusBreak(value, breakMinutes),
                          true
                        )
                      : "Undecided"}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <span className="text-rose-400 text-sm">
            {form.formState.errors.durationMinutes?.message}
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
          disabled={!titleController.field.value || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {proposal && (
        <ConfirmDeletionModal
          btnDisabled={form.formState.isSubmitting}
          confirm={form.handleSubmit(handleDelete)}
          itemName="session proposal"
        />
      )}
    </div>
  );
}
