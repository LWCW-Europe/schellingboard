import http from "k6/http";
import { fail, sleep } from "k6";
import { parseHTML } from "k6/html";
import type { Response } from "k6/http";
import {
  CheckSection,
  actionSucceeded,
  commentIds,
  extractGuestIds,
  randomChoice,
  randomCommentBody,
  randomCount,
  serverAction,
  toString,
} from "../util.js";
import { BASE_URL, SESSION_EVENT_SLUG } from "../env.js";
import { createSessionCommentActionId } from "../server-actions.js";
import { login, pickActorGuest, selectGuest } from "./setup.js";

type SessionLink = { id: string; title: string };

const browse = new CheckSection("sessions browse");
const comment = new CheckSection("sessions comment");
const rsvp = new CheckSection("sessions rsvp");

const scheduleUrl = `${BASE_URL}/${SESSION_EVENT_SLUG}`;

function extractSessionLinks(html: string): SessionLink[] {
  const doc = parseHTML(html);
  const links: SessionLink[] = [];
  doc
    .find("a[href*='viewSession=']")
    .toArray()
    .forEach((el) => {
      const href = el.attr("href") ?? "";
      const match = href.match(/viewSession=([^&]+)/);
      if (match) {
        links.push({ id: match[1], title: el.text() });
      }
    });
  return links;
}

export function loadSchedule(section: CheckSection): SessionLink[] {
  const res = http.get(scheduleUrl);
  const links = extractSessionLinks(toString(res.body));

  section.check(res, {
    "schedule status is 200": (r) => r.status === 200,
    "schedule shows sessions": () => links.length > 0,
  });

  if (links.length === 0) {
    fail(`No session links found on ${scheduleUrl}`);
  }
  return links;
}

export function openDetail(
  section: CheckSection,
  pick: SessionLink
): { detail: Response; comments: Response } {
  const detail = http.get(`${scheduleUrl}?viewSession=${pick.id}`);

  section.check(detail, {
    "modal status is 200": (r) => r.status === 200,
    "modal opens": (r) => {
      const dialog = parseHTML(toString(r.body)).find(
        '[aria-label="Session details"]'
      );
      return dialog.size() > 0 && dialog.text().includes(pick.title);
    },
  });

  const comments = http.get(`${BASE_URL}/api/session/${pick.id}/comments`);
  section.check(comments, {
    "comments status is 200": (r) => r.status === 200,
    "comments are a list": (r) => {
      try {
        return Array.isArray(r.json());
      } catch {
        return false;
      }
    },
  });

  return { detail, comments };
}

export function sessionsBrowse() {
  login();

  const links = loadSchedule(browse);

  for (let i = 0; i < randomCount(3, 8); i++) {
    openDetail(browse, randomChoice(links)!);
    sleep(Math.random() * 2 + 0.5);
  }
}

export function sessionsComment() {
  login();
  selectGuest(pickActorGuest());

  const links = loadSchedule(comment);

  for (let i = 0; i < randomCount(1, 3); i++) {
    const pick = randomChoice(links)!;
    const { comments } = openDetail(comment, pick);

    if (Math.random() < 0.7) {
      const args: Record<string, string> = {
        sessionId: pick.id,
        body: randomCommentBody(),
      };
      const existing = commentIds(comments.json());
      if (Math.random() < 0.5 && existing.length > 0) {
        args.parentId = randomChoice(existing)!;
      }
      const res = serverAction(scheduleUrl, createSessionCommentActionId, [
        args,
      ]);
      comment.check(res, {
        "comment posted": actionSucceeded,
      });
    }

    sleep(Math.random() * 2 + 0.5);
  }
}

export default function sessionsFlow() {
  sessionsBrowse();
  sessionsComment();
}

// RSVP rows carry `sessionId` and `guestId` (own-user list and the public
// per-session list share the same shape).
function rsvpGuestIds(res: Response): string[] {
  try {
    const rows = res.json() as Array<{ guestId?: unknown }>;
    return rows
      .filter((r) => typeof r.guestId === "string")
      .map((r) => r.guestId as string);
  } catch {
    return [];
  }
}

function rsvpSessionIds(res: Response): string[] {
  try {
    const rows = res.json() as Array<{ sessionId?: unknown }>;
    return rows
      .filter((r) => typeof r.sessionId === "string")
      .map((r) => r.sessionId as string);
  } catch {
    return [];
  }
}

function toggleRsvp(
  section: CheckSection,
  sessionId: string,
  guestId: string,
  remove?: boolean
): Response {
  const res = http.post(
    `${BASE_URL}/api/toggle-rsvp`,
    JSON.stringify({ sessionId, guestId, remove }),
    { headers: { "Content-Type": "application/json" } }
  );
  section.check(res, {
    "RSVP changed": actionSucceeded,
  });
  return res;
}

export function sessionsRsvp() {
  login();

  const links = loadSchedule(rsvp);

  // The actor must belong to the event (the server 403s outsiders). Anyone on
  // a session's RSVP list is provably an attendee — and never that session's
  // host (hosts cannot RSVP to their own session).
  const seedSession = randomChoice(links)!;
  const pool = http.get(`${BASE_URL}/api/rsvps?session=${seedSession.id}`);
  rsvp.check(pool, {
    "session RSVPs status is 200": (r) => r.status === 200,
  });
  const attendees = rsvpGuestIds(pool);
  rsvp.check(attendees, {
    "session has RSVP'd attendees": (a) => a.length > 0,
  });
  if (attendees.length === 0) {
    fail(`No RSVP'd attendees on session ${seedSession.title}`);
  }
  const actor = randomChoice(attendees)!;
  selectGuest(actor);

  const mine = http.get(`${BASE_URL}/api/rsvps?user=${actor}`);
  rsvp.check(mine, {
    "own RSVPs status is 200": (r) => r.status === 200,
  });
  const attending = new Set(rsvpSessionIds(mine));

  for (let i = 0; i < randomCount(2, 6); i++) {
    const pick = randomChoice(links)!;

    // The session detail modal exposes its hosts as profile links; the server
    // rejects RSVPing to one's own session, so look before toggling.
    const detail = http.get(`${scheduleUrl}?viewSession=${pick.id}`);
    rsvp.check(detail, {
      "RSVP modal status is 200": (r) => r.status === 200,
    });
    const hosts = new Set(extractGuestIds(toString(detail.body)));

    if (attending.has(pick.id)) {
      // Already going — sometimes drop out, sometimes reaffirm (re-adding an
      // existing RSVP is a no-op success on the server).
      if (Math.random() < 0.4) {
        toggleRsvp(rsvp, pick.id, actor, true);
        attending.delete(pick.id);
      } else {
        toggleRsvp(rsvp, pick.id, actor);
      }
    } else if (!hosts.has(actor)) {
      toggleRsvp(rsvp, pick.id, actor);
      attending.add(pick.id);
    }

    sleep(Math.random() * 2 + 0.5);
  }
}
