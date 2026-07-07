"use client";

import { useState, useTransition } from "react";
import { Input } from "@/app/input";
import type { Event } from "@/db/repositories/interfaces";
import {
  updateEventPhasesAction,
  type EventPhasesInput,
} from "@/app/actions/admin-events";
import { PRIMARY_BUTTON } from "@/app/admin/buttons";
import { utcToZonedInput, zonedInputToUtc } from "@/utils/admin-datetime";

type PhasesForm = Omit<EventPhasesInput, "id">;

export function EventPhasesForm({ event }: { event: Event }) {
  const toInput = (date: Date | undefined) =>
    utcToZonedInput(date?.toISOString(), event.timezone);
  const [form, setForm] = useState<PhasesForm>({
    proposalPhaseStart: toInput(event.proposalPhaseStart),
    proposalPhaseEnd: toInput(event.proposalPhaseEnd),
    votingPhaseStart: toInput(event.votingPhaseStart),
    votingPhaseEnd: toInput(event.votingPhaseEnd),
    schedulingPhaseStart: toInput(event.schedulingPhaseStart),
    schedulingPhaseEnd: toInput(event.schedulingPhaseEnd),
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, startSave] = useTransition();

  const set = (key: keyof PhasesForm, value: string) => {
    setSaveSuccess(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    startSave(async () => {
      // Form values are in the event timezone; the action expects UTC.
      const utcForm = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          zonedInputToUtc(value ?? "", event.timezone),
        ])
      ) as PhasesForm;
      const result = await updateEventPhasesAction({
        id: event.id,
        ...utcForm,
      });
      if (!result.ok) {
        setSaveError(result.error);
      } else {
        setSaveSuccess(true);
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Phases</h2>
      <p className="text-sm text-gray-500">
        All times are in the event timezone ({event.timezone}). Leave fields
        empty to unset a phase. A phase with no end runs until the next phase
        starts; set an end earlier than the next start to leave an inactive gap.
      </p>
      {saveError && <p className="text-sm text-red-600">{saveError}</p>}

      {(
        [
          {
            label: "Proposal phase",
            startKey: "proposalPhaseStart",
            endKey: "proposalPhaseEnd",
          },
          {
            label: "Voting phase",
            startKey: "votingPhaseStart",
            endKey: "votingPhaseEnd",
          },
          {
            label: "Scheduling phase",
            startKey: "schedulingPhaseStart",
            endKey: "schedulingPhaseEnd",
          },
        ] as const
      ).map(({ label, startKey, endKey }) => (
        <fieldset key={label}>
          <legend className="text-sm font-medium text-gray-700">{label}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="flex flex-col gap-1">
              <label htmlFor={startKey} className="text-sm text-gray-600">
                Start
              </label>
              <Input
                id={startKey}
                type="datetime-local"
                value={form[startKey] ?? ""}
                onChange={(e) => set(startKey, e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={endKey} className="text-sm text-gray-600">
                End
              </label>
              <Input
                id={endKey}
                type="datetime-local"
                value={form[endKey] ?? ""}
                onChange={(e) => set(endKey, e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
          {isSaving ? "Saving..." : "Save phases"}
        </button>
        {saveSuccess && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </form>
  );
}
