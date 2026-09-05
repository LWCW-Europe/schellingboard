import { describe, it, expect } from "vitest";
import webpush from "web-push";

import { urlBase64ToUint8Array } from "@/utils/push-key";

describe("urlBase64ToUint8Array", () => {
  // A real VAPID public key is 65 bytes, which is not a multiple of 3 — so it
  // always encodes with padding that base64url then drops. Getting that wrong
  // is the classic way subscribe() fails with an opaque error.
  it("decodes a generated VAPID public key to its 65 bytes", () => {
    const { publicKey } = webpush.generateVAPIDKeys();

    const bytes = urlBase64ToUint8Array(publicKey);

    expect(bytes).toHaveLength(65);
    expect(Buffer.from(bytes).toString("base64url")).toBe(publicKey);
  });

  it("decodes the characters base64url swaps out", () => {
    const withBothCharacters = Buffer.from([0xfb, 0xff, 0xbf]).toString(
      "base64url"
    );
    expect(withBothCharacters).toBe("-_-_");

    expect(Array.from(urlBase64ToUint8Array(withBothCharacters))).toEqual([
      0xfb, 0xff, 0xbf,
    ]);
  });
});
