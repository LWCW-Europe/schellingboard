import { check } from "k6";
import type { Response } from "k6/http";
import { parseHTML } from "k6/html";
import http from "k6/http";

export function randomCount(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomChoice<T>(items: T[]): T | undefined {
  return items.length === 0
    ? undefined
    : items[Math.floor(Math.random() * items.length)];
}

const COMMENT_BODIES = [
  "Count me in!",
  "That's a great point.",
  "I'd come to this.",
  "Interesting take.",
  "Curious to hear more.",
  "This resonates with me.",
  "Can't wait for this!",
  "Love the idea.",
];

export function randomCommentBody(): string {
  const body = COMMENT_BODIES[(Math.random() * COMMENT_BODIES.length) | 0];
  return Math.random() < 0.3 ? `${body} (${randomCount(100, 999)})` : body;
}

// A server action is invoked the way a browser would: a POST carrying the
// action's id and the argument list serialized as JSON (encodeReply's output
// for plain values). A successful action answers `text/x-component` with the
// result — `{ "success": true }` — inside the flight payload.
export function serverAction(
  url: string,
  actionId: string,
  args: unknown[]
): Response {
  return http.post(url, JSON.stringify(args), {
    headers: {
      "Next-Action": actionId,
      Accept: "text/x-component",
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}

// Actions answer `text/x-component`; the returned object is serialized into
// the flight payload, so success shows up as a marker like `"ok":true` or
// `"success":true`.
export function actionSucceeded(
  res: Response,
  marker: string = '"success":true'
): boolean {
  return res.status === 200 && toString(res.body).includes(marker);
}

export function extractGuestIds(html: string): string[] {
  const doc = parseHTML(html);
  const links: string[] = [];
  doc
    .find("a[href^='/guests/']")
    .toArray()
    .forEach((el) => {
      const href = el.attr("href") ?? "";
      const match = href.match(/^\/guests\/([^/?]+)/);
      if (match && match[1] !== "edit") {
        links.push(match[1]);
      }
    });
  return [...new Set(links)];
}

// Comment ids of a thread fetched from its /api/.../comments endpoint.
type CommentRow = { id?: unknown; deleted?: unknown };

export function commentIds(payload: unknown): string[] {
  if (!Array.isArray(payload)) return [];
  const ids: string[] = [];
  for (const row of payload as CommentRow[]) {
    if (typeof row.id === "string" && row.deleted !== true) {
      ids.push(row.id);
    }
  }
  return ids;
}

export function toString(obj: unknown): string {
  if (typeof obj === "string") return obj;
  if (obj instanceof ArrayBuffer)
    return String.fromCharCode(...new Uint8Array(obj));
  return JSON.stringify(obj);
}

export class CheckSection {
  constructor(readonly name: string) {}

  subsection(name: string) {
    return new CheckSection(`${this.name} > ${name}`);
  }

  check<T>(obj: T, checks: Record<string, (obj: T) => boolean>) {
    check(
      obj,
      Object.fromEntries(
        Object.entries(checks).map(([name, check]) => [
          `${this.name} > ${name}`,
          () => check(obj),
        ])
      )
    );
  }
}
