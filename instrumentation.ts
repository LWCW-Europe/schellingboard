import { initMailer } from "@/utils/mailer";

export function register() {
  // If we run this app in an edge runtime[1] in future, it won't support email.
  // So don't init in that case.
  // [1]: https://nextjs.org/docs/app/api-reference/edge
  if (process.env.NEXT_RUNTIME === "nodejs") {
    initMailer();
  }
}
