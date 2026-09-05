/**
 * Decodes a VAPID public key for `pushManager.subscribe`, which wants the
 * bytes rather than the base64url text the server stores. Base64url is
 * standard base64 with `+/` written as `-_`, which atob doesn't accept; its
 * dropped padding it does tolerate.
 *
 * A file of its own because the settings page imports it: everything else
 * about push lives next to `web-push`, which drags Node's crypto into any
 * bundle that touches it.
 */
// The explicit ArrayBuffer parameter is what makes this a BufferSource that
// `applicationServerKey` accepts; the default is the wider ArrayBufferLike.
export function urlBase64ToUint8Array(
  base64Url: string
): Uint8Array<ArrayBuffer> {
  const binary = atob(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
