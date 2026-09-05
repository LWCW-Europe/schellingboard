export const BASE_URL = __ENV.SITE_URL ?? "http://localhost:3000";
export const SITE_PASSWORD = __ENV.SITE_PASSWORD ?? "";
export const EVENT_SLUG = __ENV.LOAD_TEST_EVENT_SLUG ?? "Conference-Alpha";
// The event currently in the voting phase. Seeded phases advance in real
// time (Beta was mid-voting on seed day; a week later Alpha holds the open
// window), so point this at whichever event accepts votes right now.
export const VOTE_EVENT_SLUG =
  __ENV.LOAD_TEST_VOTE_EVENT_SLUG ?? "Conference-Alpha";
export const SESSION_EVENT_SLUG =
  __ENV.LOAD_TEST_SESSION_EVENT_SLUG ?? "Conference-Gamma";
export const MODE = __ENV.LOAD_TEST_MODE ?? "test";
