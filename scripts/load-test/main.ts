import type { Options, Stage } from "k6/options";
import { MODE } from "./env.js";
import setupAndLoadFlow from "./scenarios/setup.js";
import { attendeeFlow } from "./scenarios/attendee.js";
import { guestsBrowse, guestsComment, guestsEdit } from "./scenarios/guests.js";
import {
  proposalsBrowse,
  proposalsComment,
  proposalsVote,
} from "./scenarios/proposals.js";
import {
  sessionsBrowse,
  sessionsComment,
  sessionsRsvp,
} from "./scenarios/sessions.js";

export const home = setupAndLoadFlow;
export { attendeeFlow };
export { proposalsBrowse, proposalsComment, proposalsVote };
export { sessionsBrowse, sessionsComment, sessionsRsvp };
export { guestsBrowse, guestsComment, guestsEdit };
const stages: Stage[] =
  MODE === "debug"
    ? [{ duration: "5s", target: 1 }]
    : [
        { duration: "30s", target: 10 }, // warm up
        { duration: "1m", target: 10 },
        { duration: "30s", target: 50 },
        { duration: "1m", target: 50 },
        { duration: "30s", target: 200 },
        { duration: "1m", target: 200 },
        { duration: "30s", target: 1000 }, // peak load
        { duration: "1m", target: 1000 },
        { duration: "30s", target: 0 }, // ramp down
      ];

export const options: Options = {
  scenarios: {
    home: {
      executor: "ramping-vus",
      exec: "home",
      stages,
    },
    "proposals-browse": {
      executor: "ramping-vus",
      exec: "proposalsBrowse",
      stages,
    },
    "proposals-comment": {
      executor: "ramping-vus",
      exec: "proposalsComment",
      stages,
    },
    "proposals-vote": {
      executor: "ramping-vus",
      exec: "proposalsVote",
      stages,
    },
    "sessions-browse": {
      executor: "ramping-vus",
      exec: "sessionsBrowse",
      stages,
    },
    "sessions-comment": {
      executor: "ramping-vus",
      exec: "sessionsComment",
      stages,
    },
    "sessions-rsvp": {
      executor: "ramping-vus",
      exec: "sessionsRsvp",
      stages,
    },
    "guests-browse": {
      executor: "ramping-vus",
      exec: "guestsBrowse",
      stages,
    },
    "guests-comment": {
      executor: "ramping-vus",
      exec: "guestsComment",
      stages,
    },
    "guests-edit": {
      executor: "ramping-vus",
      exec: "guestsEdit",
      stages,
    },
    attendee: {
      executor: "ramping-vus",
      exec: "attendeeFlow",
      stages,
    },
  },

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};
