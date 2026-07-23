import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/app/(site)/votes";
import { inVotingPhase } from "@/app/(site)/utils/events";
import { requestNow } from "@/utils/dev-clock";
import {
  guestProtectionError,
  isRequestVerifiedAsGuest,
} from "@/utils/acting-guest";

type VoteParams = {
  proposalId: string;
  guestId: string;
  choice: VoteChoice;
};

export const dynamic = "force-dynamic"; // defaults to auto

// Replaces any existing vote by that user for that proposal
export async function POST(req: Request) {
  const { proposalId, guestId, choice } = (await req.json()) as VoteParams;
  const repos = getRepositories();
  if (!(await isRequestVerifiedAsGuest(req, guestId))) {
    return guestProtectionError();
  }
  const proposal = await repos.sessionProposals.findById(proposalId);
  if (!proposal) {
    return Response.json({ error: "Proposal not found" }, { status: 404 });
  }
  const event = await repos.events.findById(proposal.eventId);
  const eventGuests = event ? await repos.guests.listByEvent(event.id) : [];
  if (!eventGuests.some((g) => g.id === guestId)) {
    return Response.json(
      { error: "Guest is not part of this event" },
      { status: 403 }
    );
  }
  if (!event || !inVotingPhase(event, requestNow(req))) {
    return Response.json(
      { error: "Voting is only allowed during the voting phase" },
      { status: 403 }
    );
  }
  try {
    // Atomic upsert: concurrent requests for the same (guest, proposal)
    // cannot produce duplicate votes.
    await repos.votes.upsert({ proposalId, guestId, choice });
  } catch (err) {
    console.error(err);
    return Response.error();
  }

  return Response.json({ success: true });
}
