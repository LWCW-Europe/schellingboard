import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/app/(site)/votes";

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
