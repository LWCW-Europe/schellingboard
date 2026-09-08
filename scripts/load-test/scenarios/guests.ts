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
import { BASE_URL } from "../env.js";
import {
  updateProfileActionId,
  createProfileCommentActionId,
} from "../server-actions.js";
import { login, pickActorGuest, selectGuest } from "./setup.js";

const browse = new CheckSection("guests browse");
const comment = new CheckSection("guests comment");
const edit = new CheckSection("guests edit");

const directoryUrl = `${BASE_URL}/guests`;

function loadDirectory(section: CheckSection): string[] {
  const res = http.get(directoryUrl);
  const ids = extractGuestIds(toString(res.body));

  section.check(res, {
    "directory status is 200": (r) => r.status === 200,
    "directory shows attendees": (r) =>
      parseHTML(toString(r.body)).find("h1").text() === "Attendees",
  });
  section.check(ids, {
    "directory has guest links": (l) => l.length > 0,
  });

  if (ids.length === 0) {
    fail(`No guest links found on ${directoryUrl}`);
  }
  return ids;
}

export function openProfile(
  section: CheckSection,
  guestId: string
): { detail: Response; comments: Response } {
  const detail = http.get(`${directoryUrl}/${guestId}`);

  section.check(detail, {
    "profile status is 200": (r) => r.status === 200,
    "profile modal opens": (r) => {
      const dialog = parseHTML(toString(r.body)).find('[role="dialog"]');
      const label = dialog.first().attr("aria-label");
      return dialog.size() > 0 && !!label && label !== "Profile";
    },
  });

  const comments = http.get(`${BASE_URL}/api/profile/${guestId}/comments`);
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

export function guestsBrowse() {
  login();

  const ids = loadDirectory(browse);

  for (let i = 0; i < randomCount(3, 8); i++) {
    openProfile(browse, randomChoice(ids)!);
    sleep(Math.random() * 2 + 0.5);
  }
}

export function guestsComment() {
  login();
  const actor = pickActorGuest();
  selectGuest(actor);

  // Commenting on your own profile would be a write nobody makes.
  const ids = loadDirectory(comment).filter((id) => id !== actor);
  if (ids.length === 0) {
    fail(`No guest other than ${actor} to comment on`);
  }

  for (let i = 0; i < randomCount(1, 3); i++) {
    const pick = randomChoice(ids)!;
    const { comments } = openProfile(comment, pick);

    if (Math.random() < 0.7) {
      const args: Record<string, string> = {
        profileId: pick,
        body: randomCommentBody(),
      };
      const existing = commentIds(comments.json());
      if (Math.random() < 0.5 && existing.length > 0) {
        args.parentId = randomChoice(existing)!;
      }
      const res = serverAction(directoryUrl, createProfileCommentActionId, [
        args,
      ]);
      comment.check(res, {
        "comment posted": actionSucceeded,
      });
    }

    sleep(Math.random() * 2 + 0.5);
  }
}

export default function guestsFlow() {
  guestsBrowse();
  guestsComment();
}

type DirectoryEntry = { id: string; name: string };

// The directory's attendee cards carry each name in the link's surname span
// (the rest of the card text is a pronouns/based-in line and a bio excerpt).
export function directoryEntries(): DirectoryEntry[] {
  const res = http.get(directoryUrl);
  const doc = parseHTML(toString(res.body));
  const entries: DirectoryEntry[] = [];
  doc
    .find("a[href^='/guests/']")
    .toArray()
    .forEach((el) => {
      const href = el.attr("href") ?? "";
      const match = href.match(/^\/guests\/([^/?]+)/);
      if (!match || match[1] === "edit") return;
      const name = el.find("span.font-medium").first().text();
      if (name) entries.push({ id: match[1], name });
    });
  return [...new Map(entries.map((e) => [e.id, e])).values()];
}

const EDIT_PRONOUNS = ["she/her", "he/him", "they/them"];
const EDIT_BASED_IN = [
  "Berlin",
  "Lisbon",
  "London",
  "Amsterdam",
  "Barcelona",
  "Vienna",
];
const ABOUT_ME =
  "Long-time conference regular; here for the talks and the people.";
const EDIT_PROMPTS = [
  "What are you most looking forward to?",
  "Ask me about",
  "Working on at the moment",
  "Best conference tip",
];
const EDIT_PROMPT_ANSWERS = [
  "The hallway track.",
  "Backend performance.",
  "An open-source side project.",
  "Pacing yourself.",
];
const EDIT_LANGUAGES = ["English", "German", "Spanish", "French", "Portuguese"];

// The profile save replaces the whole public profile, so the payload carries a
// complete one. The name echoes the actor's current name — the field you would
// not change — and the rest reads as a plausible profile.
export function editProfilePayload(name: string): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name,
    basedIn: randomChoice(EDIT_BASED_IN)!,
    pronouns: randomChoice(EDIT_PRONOUNS)!,
  };
  if (Math.random() < 0.6) {
    payload.aboutMe = ABOUT_ME;
    if (Math.random() < 0.7) {
      payload.prompts = [
        {
          prompt: randomChoice(EDIT_PROMPTS)!,
          answer: randomChoice(EDIT_PROMPT_ANSWERS)!,
        },
      ];
    }
  }
  if (Math.random() < 0.5) {
    payload.languages = [randomChoice(EDIT_LANGUAGES)!];
  }
  if (Math.random() < 0.4) {
    payload.contacts = [{ type: "website", value: "https://example.com" }];
  }
  return payload;
}

export function guestsEdit() {
  login();

  const entries = directoryEntries();
  edit.check(entries, {
    "directory has named attendees": (l) => l.length > 0,
  });
  if (entries.length === 0) {
    fail(`No attendee entries on ${directoryUrl}`);
  }

  const actor = randomChoice(entries)!;
  selectGuest(actor.id);

  // Most visitors only read a couple of profiles; only occasionally does
  // someone save changes to their own — the write this scenario is for.
  const others = entries.filter((e) => e.id !== actor.id);
  for (let i = 0; i < randomCount(1, 2) && others.length > 0; i++) {
    openProfile(edit, randomChoice(others)!.id);
    sleep(Math.random() * 2 + 0.5);
  }

  if (Math.random() < 0.1) {
    const res = serverAction(`${BASE_URL}/guests/edit`, updateProfileActionId, [
      editProfilePayload(actor.name),
    ]);
    edit.check(res, {
      "profile saved": (r) => actionSucceeded(r, '"ok":true'),
    });
  }

  sleep(Math.random() * 2 + 0.5);
}
