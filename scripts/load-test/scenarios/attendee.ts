import { fail, sleep } from "k6";
import {
  CheckSection,
  actionSucceeded,
  commentIds,
  randomChoice,
  randomCommentBody,
  randomCount,
  serverAction,
  toString,
} from "../util.js";
import { BASE_URL, EVENT_SLUG, SESSION_EVENT_SLUG } from "../env.js";
import {
  createProfileCommentActionId,
  createProposalCommentActionId,
  createSessionCommentActionId,
  updateProfileActionId,
} from "../server-actions.js";
import { login, selectGuest } from "./setup.js";
import { directoryEntries, editProfilePayload, openProfile } from "./guests.js";
import {
  extractCommentIds,
  loadList as loadProposals,
  openDetail as openProposalDetail,
} from "./proposals.js";
import { loadSchedule, openDetail as openSessionDetail } from "./sessions.js";

const section = new CheckSection("attendee");
const edit = section.subsection("edit");
const guests = section.subsection("guests");
const sessions = section.subsection("sessions");
const proposals = section.subsection("proposals");

const directoryUrl = `${BASE_URL}/guests`;
const scheduleUrl = `${BASE_URL}/${SESSION_EVENT_SLUG}`;
const proposalsUrl = `${BASE_URL}/${EVENT_SLUG}/proposals`;

// One attendee's day: touch up their own profile, look at a few other
// profiles, then wander the schedule and the proposals, chiming in now and
// then. Votes and RSVPs stay in their own scenarios — they are phase-gated,
// while comments and profile saves work in every phase.
export function attendeeFlow() {
  login();

  const entries = directoryEntries();
  section.check(entries, {
    "directory has named attendees": (l) => l.length > 0,
  });
  if (entries.length === 0) {
    fail(`No attendee entries on ${directoryUrl}`);
  }

  const actor = randomChoice(entries)!;
  selectGuest(actor.id);

  for (let i = 0; i < randomCount(0, 2); i++) {
    const res = serverAction(`${BASE_URL}/guests/edit`, updateProfileActionId, [
      editProfilePayload(actor.name),
    ]);
    edit.check(res, {
      "profile saved": (r) => actionSucceeded(r, '"ok":true'),
    });
    sleep(Math.random() * 2 + 0.5);
  }

  const others = entries.filter((e) => e.id !== actor.id);
  for (let i = 0; i < randomCount(2, 5) && others.length > 0; i++) {
    const pick = randomChoice(others)!;
    const { comments } = openProfile(guests, pick.id);
    if (Math.random() < 0.35) {
      addComment(
        guests,
        "profileId",
        pick.id,
        commentIds(comments.json()),
        directoryUrl,
        createProfileCommentActionId
      );
    }
    sleep(Math.random() * 2 + 0.5);
  }

  const sessionLinks = loadSchedule(sessions);
  for (let i = 0; i < randomCount(1, 3); i++) {
    const pick = randomChoice(sessionLinks)!;
    const { comments } = openSessionDetail(sessions, pick);
    if (Math.random() < 0.35) {
      addComment(
        sessions,
        "sessionId",
        pick.id,
        commentIds(comments.json()),
        scheduleUrl,
        createSessionCommentActionId
      );
    }
    sleep(Math.random() * 2 + 0.5);
  }

  const proposalLinks = loadProposals(proposals);
  for (let i = 0; i < randomCount(1, 3); i++) {
    const pick = randomChoice(proposalLinks)!;
    const detail = openProposalDetail(proposals, pick);
    if (Math.random() < 0.35) {
      addComment(
        proposals,
        "proposalId",
        pick.id,
        extractCommentIds(toString(detail.body)),
        proposalsUrl,
        createProposalCommentActionId,
        EVENT_SLUG
      );
    }
    sleep(Math.random() * 2 + 0.5);
  }
}

// One comment, sometimes a reply to something already said. The three comment
// kinds differ only in the item key, the target page and the action id.
function addComment(
  section: CheckSection,
  item: string,
  id: string,
  thread: string[],
  url: string,
  actionId: string,
  eventSlug?: string
): void {
  const args: Record<string, string> = {
    [item]: id,
    body: randomCommentBody(),
  };
  if (eventSlug) args.eventSlug = eventSlug;
  if (Math.random() < 0.4 && thread.length > 0) {
    args.parentId = randomChoice(thread)!;
  }
  const res = serverAction(url, actionId, [args]);
  section.check(res, { "comment posted": actionSucceeded });
}
