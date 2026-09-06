"use client";

import { useEffect, useState, useTransition } from "react";

import { requestMeetingAction } from "@/app/actions/meetings";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/app/components/buttons";
import { Avatar } from "@/app/(site)/guests/avatar";
import { MeetingRequestFields } from "@/app/components/meeting-request-fields";
import { Modal } from "@/app/components/modal";
import Link from "next/link";
import { clashLines } from "@/utils/meeting-clash-text";
import type {
  MeetingCandidate,
  MeetingCandidates,
} from "@/utils/meeting-candidates";

/**
 * Booking a 1-on-1 from the schedule: the slot is known, the person is not.
 * Two steps in one modal — who is free then, and the usual request form —
 * which is the profile picker's flow with its two questions the other way
 * round (issue #945).
 */
export function BookMeeting({
  eventId,
  slotStart,
  onClose,
  onBooked,
}: {
  eventId: string;
  slotStart: string;
  onClose: () => void;
  /** Told once a request is sent, so the column can show it straight away. */
  onBooked: () => void;
}) {
  const [found, setFound] = useState<MeetingCandidates | null | "none">(null);
  const [chosen, setChosen] = useState<MeetingCandidate | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(
      `/api/meetings/candidates?event=${eventId}&slot=${encodeURIComponent(
        slotStart
      )}`,
      { signal: controller.signal }
    )
      .then<MeetingCandidates | "none">((res) =>
        res.ok ? (res.json() as Promise<MeetingCandidates>) : "none"
      )
      .then(setFound)
      // Closing the modal aborts the request; there is nobody left to tell.
      .catch(() => undefined);
    return () => controller.abort();
  }, [eventId, slotStart]);

  return (
    <Modal
      open
      setOpen={onClose}
      zIndex="z-[60]"
      portal
      maxWidth="sm:max-w-2xl"
      hideClose
    >
      {found === null ? (
        <p className="text-fg-muted">Loading…</p>
      ) : found === "none" ? (
        <div className="flex flex-col gap-4">
          <p className="text-fg">That slot is no longer open for 1-on-1s.</p>
          <button type="button" onClick={onClose} className={PRIMARY_BUTTON}>
            Close
          </button>
        </div>
      ) : chosen ? (
        <RequestStep
          eventId={eventId}
          slotStart={slotStart}
          found={found}
          candidate={chosen}
          onBack={() => setChosen(null)}
          onBooked={onBooked}
          onClose={onClose}
        />
      ) : (
        <CandidateStep found={found} onPick={setChosen} onClose={onClose} />
      )}
    </Modal>
  );
}

function CandidateStep({
  found,
  onPick,
  onClose,
}: {
  found: MeetingCandidates;
  onPick: (candidate: MeetingCandidate) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-fg">
          Who&apos;s free at {found.slotLabel.split(" – ")[0]}?
        </h2>
        <span className="block text-sm text-fg-muted">
          {found.dayLabel}, {found.slotLabel} · {found.eventName}
        </span>
      </div>

      {/* Your own commitment, once for the whole screen: it is the same slot
          whoever you end up asking. */}
      {found.yourClashes.length > 0 && (
        <p className="text-sm rounded-md bg-warning-tint p-3 text-fg">
          {clashLines(found.yourClashes)} during this slot — book it anyway?
        </p>
      )}

      {found.candidates.length === 0 ? (
        <p className="text-fg-muted">Nobody has marked this slot free.</p>
      ) : (
        // Scrolls rather than growing the modal past the viewport: a popular
        // slot at a big event is a long list, and Ask has to stay reachable.
        <ul className="flex flex-col gap-1 max-h-72 overflow-y-auto">
          {found.candidates.map((candidate) => (
            <li
              key={candidate.id}
              className="flex items-center gap-4 rounded-md p-2 bg-surface-sunken"
            >
              <Avatar
                name={candidate.name}
                size="sm"
                image={candidate.avatarUrl ?? undefined}
              />
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {/* Deciding whether to ask someone means reading who they
                      are, and that must not cost the slot being booked -- so
                      the profile opens in its own tab, leaving this list
                      exactly where it was. */}
                  <Link
                    href={`/guests/${candidate.id}`}
                    target="_blank"
                    rel="noopener"
                    prefetch={false}
                    className="font-medium text-brand-fg hover:text-brand-fg-hover"
                  >
                    {candidate.name}
                  </Link>
                  {candidate.isHost && (
                    <span className="w-fit rounded-full bg-brand-tint-hover text-brand-fg text-xs font-semibold px-3 py-1">
                      Session host
                    </span>
                  )}
                </span>
                {(candidate.pronouns || candidate.basedIn) && (
                  <span className="text-sm text-fg-subtle line-clamp-1">
                    {[candidate.pronouns, candidate.basedIn]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
                {/* What they have on is theirs to tell; all this says is that
                    the hour is taken (see toMeetingClashes). */}
                {candidate.busy && (
                  <span className="text-xs text-warning-fg">
                    Already booked at this time
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onPick(candidate)}
                className={SECONDARY_BUTTON}
              >
                Ask
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-fg-subtle">
        Only people who marked this slot free are listed. Nobody is told you
        looked.
      </p>

      <button
        type="button"
        onClick={onClose}
        className={`${SECONDARY_BUTTON} self-start`}
      >
        Close
      </button>
    </div>
  );
}

function RequestStep({
  eventId,
  slotStart,
  found,
  candidate,
  onBack,
  onBooked,
  onClose,
}: {
  eventId: string;
  slotStart: string;
  found: MeetingCandidates;
  candidate: MeetingCandidate;
  onBack: () => void;
  onBooked: () => void;
  onClose: () => void;
}) {
  const [meetingPoint, setMeetingPoint] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSending, startSend] = useTransition();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startSend(async () => {
      try {
        const result = await requestMeetingAction({
          eventId,
          recipientId: candidate.id,
          slotStart,
          meetingPoint,
          message,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setSent(true);
        onBooked();
      } catch {
        setError("Request failed");
      }
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-fg">
          Asked {candidate.name} for {found.slotLabel} on {found.dayLabel}.
          You&apos;ll hear when they answer.
        </p>
        <button type="button" onClick={onClose} className={PRIMARY_BUTTON}>
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-fg">
        1-on-1 with {candidate.name}
        <span className="block text-sm font-normal text-fg-muted">
          {found.dayLabel}, {found.slotLabel}
        </span>
      </h2>

      {error && <p className="text-sm text-danger-fg">{error}</p>}

      {/* A clash is raised, never enforced: the pair decide for themselves. */}
      {(candidate.busy || found.yourClashes.length > 0) && (
        <p className="text-sm rounded-md bg-warning-tint p-3 text-fg">
          {[
            ...(found.yourClashes.length > 0
              ? [clashLines(found.yourClashes)]
              : []),
            ...(candidate.busy ? [`${candidate.name} is already booked`] : []),
          ].join("; ")}{" "}
          during this slot — book it anyway?
        </p>
      )}

      <MeetingRequestFields
        meetingPoints={found.meetingPoints}
        meetingPoint={meetingPoint}
        onMeetingPoint={setMeetingPoint}
        message={message}
        onMessage={setMessage}
        isSending={isSending}
        onCancel={onBack}
        cancelLabel="Someone else"
      />
    </form>
  );
}
