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

export async function searchBySubject(
  subject: string
): Promise<MessageSummary[]> {
  const query = encodeURIComponent(`subject:"${subject}"`);
  const result = (await mailpitGet(`/api/v1/search?query=${query}`)) as {
    messages: MessageSummary[];
  };
  return result.messages;
}

export async function getMessage(
  id: string
): Promise<{ Text: string; HTML: string }> {
  return (await mailpitGet(`/api/v1/message/${id}`)) as {
    Text: string;
    HTML: string;
  };
}
