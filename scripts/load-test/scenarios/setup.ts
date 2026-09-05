import http from "k6/http";
import { fail, sleep } from "k6";
import { parseHTML } from "k6/html";
import {
  CheckSection,
  actionSucceeded,
  extractGuestIds,
  randomChoice,
  serverAction,
  toString,
} from "../util.js";
import { BASE_URL, SITE_PASSWORD } from "../env.js";
import { selectUserActionId } from "../server-actions.js";

const section = new CheckSection("home");

export function login(): void {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ password: SITE_PASSWORD, scope: "site" }),
    { headers: { "Content-Type": "application/json" } }
  );

  if (loginRes.status !== 200) {
    fail(`Login failed with status ${loginRes.status}`);
  }
}

// Acts as a given guest by POSTing the name-picker's server action, which
// answers with the `guest` cookie. The switch needs no credentials for an
// unprotected guest, so any seeded attendee works.
export function selectGuest(guestId: string): void {
  const res = serverAction(`${BASE_URL}/guests`, selectUserActionId, [guestId]);
  if (!actionSucceeded(res, '"ok":true')) {
    fail(`Could not select guest ${guestId} (status ${res.status})`);
  }
}

export function pickActorGuest(): string {
  const directoryRes = http.get(`${BASE_URL}/guests`);
  const ids = extractGuestIds(toString(directoryRes.body));
  const chosen = randomChoice(ids);
  if (!chosen) {
    fail(`No guest to act as on ${BASE_URL}/guests`);
  }
  return chosen;
}

function loadNotLoggedIn() {
  const subsection = section.subsection("login page");

  const response = http.get(BASE_URL);

  subsection.check(response, {
    "status is 200": (r) => r.status === 200,
    "body is not null": (r) => r.body !== null,
    "is not logged in": (r) =>
      parseHTML(toString(r.body!)).find("main h2").text() === "Access Required",
  });
}

function loadLoggedIn() {
  const subsection = section.subsection("home");

  login();

  const response = http.get(BASE_URL);

  subsection.check(response, {
    "status is 200": (r) => r.status === 200,
    "body is not null": (r) => r.body !== null,
    "is logged in": (r) =>
      !!parseHTML(toString(r.body!))
        .find("p")
        .toArray()
        .find((p) => p.text().includes("Welcome!")),
  });
}

export default function setupAndLoadFlow() {
  loadNotLoggedIn();

  sleep(Math.random() * 3 + 1);

  loadLoggedIn();
}
