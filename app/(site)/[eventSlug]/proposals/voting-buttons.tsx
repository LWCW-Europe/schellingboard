import { useContext } from "react";
import clsx from "clsx";
import { VoteChoice, type Vote } from "@/app/(site)/votes";
import HoverTooltip from "@/app/(site)/hover-tooltip";
import { UserContext, VotesContext } from "@/app/(site)/context";

interface VotingButtonsProps {
  proposalId: string;
  votingEnabled: boolean;
  votingDisabledText: string;
  large?: boolean;
  onVote?: (proposalId: string, choice: VoteChoice) => Promise<boolean>;
}

export function VotingButtons({
  proposalId,
  votingEnabled,
  votingDisabledText,
  large = false,
  onVote,
}: VotingButtonsProps) {
  const { user: currentUserId } = useContext(UserContext);
  const { votes, addVote, removeVote, updateVote } = useContext(VotesContext);

  // update votes optimistically
  async function vote(proposalId: string, choice: VoteChoice) {
    if (!votingEnabled || !currentUserId) {
      return;
    }

    // If custom vote handler is provided, use it. This is needed for quick voting.
    // TODO: quite ugly, should be refactored
    if (onVote) {
      return onVote(proposalId, choice);
    }

    const existingVote = votes.find(
      (v) => v.proposalId === proposalId && v.guestId === currentUserId
    );
    if (existingVote?.choice === choice) {
      return deleteVote(proposalId);
    }

    try {
      const newVote: Vote = {
        id: "",
        proposalId,
        guestId: currentUserId,
        choice,
      };

      // Optimistic update
      if (existingVote) {
        updateVote(proposalId, choice);
      } else {
        addVote(newVote);
      }

      const response = await fetch("/api/add-vote", {
        method: "POST",
        body: JSON.stringify(newVote),
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        if (existingVote) {
          updateVote(proposalId, existingVote.choice);
        } else {
          removeVote(proposalId);
        }
      }
      return response.ok;
    } catch (error: unknown) {
      // Revert optimistic update on error
      console.error("Error updating vote: ", error);
      if (existingVote) {
        updateVote(proposalId, existingVote.choice);
      } else {
        removeVote(proposalId);
      }
      return false;
    }
  }

  async function deleteVote(proposalId: string) {
    // Store the previous vote state for reversion
    const existingVote = votes.find(
      (v) => v.proposalId === proposalId && v.guestId === currentUserId
    );

    try {
      // Optimistic update
      removeVote(proposalId);

      const response = await fetch("/api/delete-vote", {
        method: "POST",
        body: JSON.stringify({
          proposalId,
          guestId: currentUserId,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        if (existingVote) {
          addVote(existingVote);
        }
        console.error("Failed to delete vote");
      }
      return response.ok;
    } catch (error: unknown) {
      // Revert optimistic update on error
      if (existingVote) {
        addVote(existingVote);
      }
      console.error("Error deleting vote: ", error);
      return false;
    }
  }

  const handleVote = (choice: VoteChoice, e: React.MouseEvent) => {
    void vote(proposalId, choice);
    e.stopPropagation();
  };

  const chosen = votes.find(
    (vote) => vote.proposalId === proposalId && vote.guestId === currentUserId
  )?.choice;

  return (
    <div
      className={clsx(
        "flex",
        large ? "gap-2 sm:gap-3 justify-center" : "gap-1.5 flex-row"
      )}
    >
      {VOTE_OPTIONS.map(({ choice, emoji, label }) => (
        <HoverTooltip
          key={label}
          text={votingEnabled ? label : votingDisabledText}
          visible={true}
          unavailable={!votingEnabled}
        >
          <VoteButton
            emoji={emoji}
            label={label}
            large={large}
            selected={chosen === choice}
            votingEnabled={votingEnabled}
            onClick={(e) => handleVote(choice, e)}
          />
        </HoverTooltip>
      ))}
    </div>
  );
}

const VOTE_OPTIONS = [
  { choice: VoteChoice.interested, emoji: "❤️", label: "Interested" },
  { choice: VoteChoice.maybe, emoji: "⭐", label: "Maybe" },
  { choice: VoteChoice.skip, emoji: "👋🏽", label: "Skip" },
] as const;

// The chosen vote must stay recognisable without perceiving hue: a light tint
// against white collapsed into "no visible difference" under the Dark Reader
// extension and for colourblind attendees (issue #802). Hence three redundant
// cues — aria-pressed, a solid `vote-chosen` fill that keeps its luminance gap
// from the page under any recolouring, and a check mark — rather than a
// background colour alone. Why that fill is a hue rather than a neutral is at
// the token in `globals.css`.
function VoteButton({
  emoji,
  label,
  large,
  selected,
  votingEnabled,
  // HoverTooltip clones this element to attach its aria wiring, so anything it
  // passes has to reach the underlying <button>.
  ...rest
}: {
  emoji: string;
  label: string;
  large: boolean;
  selected: boolean;
  votingEnabled: boolean;
} & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...rest}
      type="button"
      aria-pressed={selected}
      className={clsx(
        "relative rounded-md border shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent",
        large
          ? "w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center"
          : "px-1 py-1",
        !votingEnabled && "opacity-50 cursor-not-allowed grayscale",
        selected
          ? "bg-vote-chosen border-line-strong text-on-vote-chosen ring-2 ring-line-strong"
          : "bg-surface-raised border-line-strong text-fg-muted",
        !selected && votingEnabled && "hover:bg-surface-muted"
      )}
    >
      <div className={large ? "text-sm sm:text-lg mb-1" : ""}>{emoji}</div>
      {large && <div className="text-[10px] sm:text-xs">{label}</div>}
      {selected && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-surface-raised bg-bar text-[9px] leading-none text-bar-fg"
        >
          ✓
        </span>
      )}
    </button>
  );
}
