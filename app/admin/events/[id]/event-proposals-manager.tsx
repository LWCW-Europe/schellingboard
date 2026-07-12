"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/input";
import {
  adminUpdateProposalAction,
  adminDeleteProposalAction,
} from "@/app/actions/admin-proposals";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  DANGER_BUTTON,
} from "@/app/admin/buttons";
import { DataTable } from "../../data-table";
import { SelectHosts } from "@/app/select-hosts";
import { MarkdownHint } from "@/app/(site)/markdown";

export type ProposalRow = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number | null;
  hosts: { id: string; name: string }[];
  votesCount: number;
  sessionCount: number;
};

export type EventGuest = { id: string; name: string };

function hostLabel(hosts: ProposalRow["hosts"]): string {
  return hosts.length > 0 ? hosts.map((h) => h.name).join(", ") : "—";
}

function ProposalItem({
  proposal,
  eventGuests,
  onError,
}: {
  proposal: ProposalRow;
  eventGuests: EventGuest[];
  onError: (e: string | null) => void;
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(proposal.title);
  const [description, setDescription] = useState(proposal.description);
  const [duration, setDuration] = useState(
    proposal.durationMinutes === null ? "" : String(proposal.durationMinutes)
  );
  const [hosts, setHosts] = useState<EventGuest[]>(proposal.hosts);
  const [isSaving, startSave] = useTransition();
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, startDelete] = useTransition();

  // Offer event-assigned guests as hosts, plus any current host that is not
  // (or no longer) assigned to the event so existing hosts are never dropped.
  const hostCandidates: EventGuest[] = [
    ...eventGuests,
    ...proposal.hosts.filter((h) => !eventGuests.some((g) => g.id === h.id)),
  ];

  const reset = () => {
    setTitle(proposal.title);
    setDescription(proposal.description);
    setDuration(
      proposal.durationMinutes === null ? "" : String(proposal.durationMinutes)
    );
    setHosts(proposal.hosts);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startSave(async () => {
      let durationMinutes: number | null = null;
      if (duration.trim() !== "") {
        const parsed = parseInt(duration, 10);
        if (isNaN(parsed) || parsed < 0 || String(parsed) !== duration.trim()) {
          onError("Duration must be a non-negative whole number");
          return;
        }
        durationMinutes = parsed;
      }
      try {
        const result = await adminUpdateProposalAction({
          id: proposal.id,
          title,
          description,
          durationMinutes,
          hostIds: hosts.map((h) => h.id),
        });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          setEditMode(false);
          router.refresh();
        }
      } catch {
        onError("Failed to save proposal");
      }
    });
  };

  const handleDelete = () => {
    startDelete(async () => {
      try {
        const result = await adminDeleteProposalAction({ id: proposal.id });
        if (!result.ok) {
          onError(result.error);
        } else {
          onError(null);
          router.refresh();
        }
      } catch {
        onError("Failed to delete proposal");
      }
    });
  };

  if (deleteMode) {
    const sessionNote =
      proposal.sessionCount > 0
        ? ` ${proposal.sessionCount} derived ${
            proposal.sessionCount === 1 ? "session" : "sessions"
          } will be kept (unlinked from this proposal).`
        : "";
    return (
      <div className="space-y-2">
        <p className="font-medium text-gray-900">{proposal.title}</p>
        <p className="text-sm text-red-700">
          This will permanently delete the proposal, its {proposal.votesCount}{" "}
          {proposal.votesCount === 1 ? "vote" : "votes"} and{" "}
          {proposal.hosts.length}{" "}
          {proposal.hosts.length === 1 ? "host link" : "host links"}.
          {sessionNote}
        </p>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`prop-delete-${proposal.id}`}
            className="text-sm text-gray-700"
          >
            Type the proposal title to confirm
          </label>
          <Input
            id={`prop-delete-${proposal.id}`}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={proposal.title}
            className="w-full h-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting || deleteConfirm !== proposal.title}
            className={DANGER_BUTTON}
          >
            {isDeleting ? "Deleting..." : "Confirm delete"}
          </button>
          <button
            onClick={() => {
              setDeleteMode(false);
              setDeleteConfirm("");
              onError(null);
            }}
            disabled={isDeleting}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!editMode) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium text-gray-900">{proposal.title}</p>
          <p className="text-sm text-gray-500">
            Hosts: {hostLabel(proposal.hosts)} · {proposal.votesCount}{" "}
            {proposal.votesCount === 1 ? "vote" : "votes"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              reset();
              setEditMode(true);
            }}
            className={SECONDARY_BUTTON}
            aria-label={`Edit ${proposal.title}`}
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteMode(true)}
            className={DANGER_BUTTON}
            aria-label={`Delete ${proposal.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`prop-title-${proposal.id}`}
          className="text-sm text-gray-600"
        >
          Title *
        </label>
        <Input
          id={`prop-title-${proposal.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full h-10"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`prop-desc-${proposal.id}`}
          className="text-sm text-gray-600"
        >
          Description
        </label>
        <textarea
          id={`prop-desc-${proposal.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-y h-24 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <MarkdownHint />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`prop-duration-${proposal.id}`}
          className="text-sm text-gray-600"
        >
          Duration (minutes) — leave empty for undecided
        </label>
        <Input
          id={`prop-duration-${proposal.id}`}
          type="number"
          min="0"
          step="5"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full h-10"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`prop-hosts-${proposal.id}`}
          className="text-sm text-gray-600"
        >
          Hosts
        </label>
        {hostCandidates.length === 0 ? (
          <p className="text-sm text-gray-500">
            No guests assigned to this event yet.
          </p>
        ) : (
          <SelectHosts
            guests={hostCandidates}
            hosts={hosts}
            setHosts={setHosts}
            id={`prop-hosts-${proposal.id}`}
            selectMany
          />
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setEditMode(false);
            onError(null);
          }}
          disabled={isSaving}
          className={SECONDARY_BUTTON}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function EventProposalsManager({
  proposals,
  eventGuests,
  total,
  page,
  pageSize,
  query,
}: {
  proposals: ProposalRow[];
  eventGuests: EventGuest[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <section aria-label="Proposals" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Proposals</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <DataTable
        rows={proposals}
        rowKey={(p) => p.id}
        total={total}
        page={page}
        pageSize={pageSize}
        searchQuery={query}
        searchPlaceholder="Search title or host…"
        emptyMessage="No proposals match."
        listItem={(p) => (
          <ProposalItem
            proposal={p}
            eventGuests={eventGuests}
            onError={setError}
          />
        )}
      />
    </section>
  );
}
