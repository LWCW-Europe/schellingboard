import { z } from "zod";

// What PushSubscription.toJSON() gives the browser, flattened. The caps are
// sanity limits: an endpoint is a URL the server later makes requests to, and
// the keys are fixed-length base64.
export const pushSubscriptionSchema = z.object({
  endpoint: z
    .url({ message: "Not a push endpoint" })
    .max(2000)
    // The server sends the notification to this address, so the one scheme
    // every push service speaks is the only one worth storing. Deliberately
    // not an allowlist of push services — see ADR 0006.
    .refine((url) => url.startsWith("https://"), {
      message: "Push endpoints must be https",
    }),
  p256dh: z.string().min(1).max(200),
  auth: z.string().min(1).max(200),
});

export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
