// The ids here are the output of fetch-server-actions.ts, which regenerates
// scripts/load-test/server-actions.json from the server-reference manifest on
// every `make load-test` — Next assigns each action a fresh id per compile.
// k6 has no JSON module loader, so the file is read at init instead of
// imported; open() resolves relative to this file, which is dist/ at runtime.
const ids = JSON.parse(open("../server-actions.json")) as Record<
  string,
  string
>;

export const selectUserActionId = ids.selectUserActionId;
export const createProposalCommentActionId = ids.createProposalCommentActionId;
export const createSessionCommentActionId = ids.createSessionCommentActionId;
export const createProfileCommentActionId = ids.createProfileCommentActionId;
export const updateProfileActionId = ids.updateProfileActionId;
