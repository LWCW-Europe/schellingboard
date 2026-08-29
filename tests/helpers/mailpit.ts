// Talking to Mailpit's API (make mailpit), for tests that check real email
// delivery.
export const MAILPIT_API_URL = process.env.MAILPIT_API_URL ?? "";

// Skip-condition for mail tests. Locally they are opt-in: unset mail vars mean
// skip, so a fresh checkout passes without Mailpit. In CI they must never be
// silently skipped, so a missing MAILPIT_API_URL throws instead.
export function skipWithoutMailpit(): boolean {
  if (MAILPIT_API_URL) return false;
  if (process.env.CI) {
    throw new Error(
      "MAILPIT_API_URL is unset in CI — mail tests must always run there. Check the mailpit service and env vars in .github/workflows/ci.yml."
    );
  }
  return true;
}

export type MessageSummary = {
  ID: string;
  From: { Name: string; Address: string };
  To: { Address: string }[];
  Subject: string;
};

async function mailpitGet(path: string): Promise<unknown> {
  const res = await fetch(new URL(path, MAILPIT_API_URL));
  if (!res.ok) {
    throw new Error(`Mailpit API ${path} returned ${res.status}`);
  }
  return res.json();
}

// Mailpit answers a search with the newest 50 matches only.
async function search(query: string): Promise<MessageSummary[]> {
  const result = (await mailpitGet(
    `/api/v1/search?query=${encodeURIComponent(query)}`
  )) as { messages: MessageSummary[] };
  return result.messages;
}

// Only for subjects unique to one test run (a session title, say): with fewer
// than 50 matches the result is the whole truth, so its length can be waited
// on. For a subject several tests share, wait on the message itself with
// newestBySubjectTo — neither the length of a search result nor mailpit's own
// match count means "one more arrived" there. The window caps at 50, and the
// mailbox holds only the newest 500 messages of all, so an eviction of an
// older match cancels out the arrival of a new one.
export async function searchBySubject(
  subject: string
): Promise<MessageSummary[]> {
  return search(`subject:"${subject}"`);
}

// The newest match, or undefined if there is none. Mailpit sorts newest first,
// matches a subject on substring and an address on substring too, so pass the
// full address.
export async function newestBySubjectTo(
  subject: string,
  address: string
): Promise<MessageSummary | undefined> {
  return (await search(`subject:"${subject}" to:${address}`))[0];
}

export async function getMessage(
  id: string
): Promise<{ Text: string; HTML: string }> {
  return (await mailpitGet(`/api/v1/message/${id}`)) as {
    Text: string;
    HTML: string;
  };
}
