import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/app/(site)/votes";
import { inVotingPhase } from "@/app/(site)/utils/events";

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
  const proposal = await repos.sessionProposals.findById(proposalId);
  if (!proposal) {
    return Response.json({ error: "Proposal not found" }, { status: 404 });
  }
  const event = await repos.events.findById(proposal.eventId);
  if (!event || !inVotingPhase(event)) {
    return Response.json(
      { error: "Voting is only allowed during the voting phase" },
      { status: 403 }
    );
  }
  try {
    await repos.votes.deleteByGuestAndProposal(guestId, proposalId);
    const vote = await repos.votes.create({ proposalId, guestId, choice });
    console.log(vote.id);
  } catch (err) {
    console.error(err);
    return Response.error();
  }

  return Response.json({ success: true });
}
