import http from "k6/http";
import { fail, sleep } from "k6";
import { parseHTML } from "k6/html";
import type { Response } from "k6/http";
import {
  CheckSection,
  actionSucceeded,
  extractGuestIds,
  randomChoice,
  randomCommentBody,
  randomCount,
  serverAction,
  toString,
} from "../util.js";
import { BASE_URL, EVENT_SLUG, VOTE_EVENT_SLUG } from "../env.js";
import { createProposalCommentActionId } from "../server-actions.js";
import { login, pickActorGuest, selectGuest } from "./setup.js";

type ProposalLink = { id: string; title: string };

const browse = new CheckSection("proposals browse");
const comment = new CheckSection("proposals comment");
const vote = new CheckSection("proposals vote");

const listUrl = `${BASE_URL}/${EVENT_SLUG}/proposals`;

function extractProposalLinks(html: string): ProposalLink[] {
  const doc = parseHTML(html);
  const links: ProposalLink[] = [];
  doc
    .find("a[href*='viewProposal=']")
    .toArray()
    .forEach((el) => {
      const href = el.attr("href") ?? "";
      const match = href.match(/viewProposal=([^&]+)/);
      if (match) {
        links.push({ id: match[1], title: el.text() });
      }
    });
  return links;
}

// Proposals render their comments on the server, each carrying a permalink
// anchor `#comment-<id>`.
export function extractCommentIds(html: string): string[] {
  const ids: string[] = [];
  for (const match of html.matchAll(/#comment-([A-Za-z0-9_-]+)/g)) {
    ids.push(match[1]);
  }
  return [...new Set(ids)];
}

export function loadList(section: CheckSection): ProposalLink[] {
  const res = http.get(listUrl);
  const links = extractProposalLinks(toString(res.body));

  section.check(res, {
    "list status is 200": (r) => r.status === 200,
    "list shows event": (r) =>
      parseHTML(toString(r.body))
        .find("h1")
        .text()
        .includes("Session Proposals"),
  });
  section.check(links, {
    "list has proposal links": (l) => l.length > 0,
  });

  if (links.length === 0) {
    fail(`No proposal links found on ${listUrl}`);
  }
  return links;
}

export function openDetail(
  section: CheckSection,
  pick: ProposalLink
): Response {
  const detailRes = http.get(`${listUrl}?viewProposal=${pick.id}`);

  section.check(detailRes, {
    "modal status is 200": (r) => r.status === 200,
    "modal opens": (r) => {
      const dialog = parseHTML(toString(r.body)).find(
        '[aria-label="Proposal details"]'
      );
      return dialog.size() > 0 && dialog.text().includes(pick.title);
    },
  });
  return detailRes;
}

export function proposalsBrowse() {
  login();

  const links = loadList(browse);

  for (let i = 0; i < randomCount(3, 8); i++) {
    openDetail(browse, randomChoice(links)!);
    sleep(Math.random() * 2 + 0.5);
  }
}

export function proposalsComment() {
  login();
  selectGuest(pickActorGuest());

  const links = loadList(comment);

  for (let i = 0; i < randomCount(1, 3); i++) {
    const pick = randomChoice(links)!;
    const detailRes = openDetail(comment, pick);

    if (Math.random() < 0.7) {
      const args: Record<string, string> = {
        proposalId: pick.id,
        eventSlug: EVENT_SLUG,
        body: randomCommentBody(),
      };
      const existing = extractCommentIds(toString(detailRes.body));
      if (Math.random() < 0.5 && existing.length > 0) {
        args.parentId = randomChoice(existing)!;
      }
      const res = serverAction(listUrl, createProposalCommentActionId, [args]);
      comment.check(res, {
        "comment posted": actionSucceeded,
      });
    }

    sleep(Math.random() * 2 + 0.5);
  }
}

export default function proposalsFlow() {
  proposalsBrowse();
  proposalsComment();
}

const VOTE_CHOICES = ["interested", "maybe", "skip"];

// The votes list the acting guest already holds, keyed by proposal.
function votedProposalIds(res: Response): string[] {
  try {
    const votes = res.json() as Array<{ proposalId?: unknown }>;
    return votes
      .filter((v) => typeof v.proposalId === "string")
      .map((v) => v.proposalId as string);
  } catch {
    return [];
  }
}

export function proposalsVote() {
  login();

  // Votes are only accepted on the event currently in its voting phase (the
  // seeded phases roll forward with real time; VOTE_EVENT_SLUG points at the
  // one with an open window). The voters are that event's attendees — the
  // author links on its proposals page.
  const voteListUrl = `${BASE_URL}/${VOTE_EVENT_SLUG}/proposals`;
  const listRes = http.get(voteListUrl);
  const html = toString(listRes.body);
  const proposals = extractProposalLinks(html);
  const attendees = extractGuestIds(html);

  vote.check(listRes, {
    "voting list status is 200": (r) => r.status === 200,
    "voting event is in the voting phase": (r) =>
      parseHTML(toString(r.body))
        .find("h1")
        .text()
        .includes("Session Proposals"),
  });
  vote.check(proposals, {
    "voting list has proposals": (p) => p.length > 0,
  });
  vote.check(attendees, {
    "voting list has attendees": (a) => a.length > 0,
  });

  if (proposals.length === 0 || attendees.length === 0) {
    fail(`No proposals or attendees on ${voteListUrl}`);
  }

  const actor = randomChoice(attendees)!;
  selectGuest(actor);

  const votesRes = http.get(
    `${BASE_URL}/api/votes?user=${actor}&event=${VOTE_EVENT_SLUG}`
  );
  vote.check(votesRes, {
    "own votes status is 200": (r) => r.status === 200,
  });
  const alreadyVoted = new Set(votedProposalIds(votesRes));

  for (let i = 0; i < randomCount(1, 5); i++) {
    const pick = randomChoice(proposals)!;

    // A third of the time the voter rescinds an existing vote instead of
    // casting one — keeps the vote count from drifting in one direction only.
    if (alreadyVoted.has(pick.id) && Math.random() < 0.35) {
      const del = http.post(
        `${BASE_URL}/api/delete-vote`,
        JSON.stringify({ proposalId: pick.id, guestId: actor }),
        { headers: { "Content-Type": "application/json" } }
      );
      vote.check(del, {
        "vote removed": actionSucceeded,
      });
    } else {
      const add = http.post(
        `${BASE_URL}/api/add-vote`,
        JSON.stringify({
          proposalId: pick.id,
          guestId: actor,
          choice: randomChoice(VOTE_CHOICES)!,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
      vote.check(add, {
        "vote saved": actionSucceeded,
      });
      alreadyVoted.add(pick.id);
    }

    sleep(Math.random() * 2 + 0.5);
  }
}
