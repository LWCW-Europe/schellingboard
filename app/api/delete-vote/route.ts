import { getRepositories } from "@/db/container";
import { inVotingPhase } from "@/app/(site)/utils/events";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { guestId, proposalId } = (await req.json()) as {
    guestId: string;
    proposalId: string;
  };

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
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.error();
  }
}
