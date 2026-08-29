// Custom next/image loader, wired up as `images.loaderFile` in
// next.config.js. It has to be a global loader rather than a per-component
// `loader` prop, because <Image> is a client component and a server component
// cannot pass it a function.
//
// Uploaded media cannot go through Next's built-in optimizer once /media is
// behind auth. The optimizer fetches the source itself, and that internal
// request is built by createRequestResponseMocks({ url, method, socket }) with
// no headers at all — so it carries no cookie, the proxy bounces it to /login,
// and the optimizer 400s even for a caller who *is* logged in.
//
// So media is fetched straight from the media routes, which the browser
// requests with cookies attached; those routes do the resizing the optimizer
// would otherwise have done.
//
// Everything else is served as stored, unresized: configuring any custom
// loader makes Next answer /_next/image with a 404 (next-server.js bails on
// `imagesConfig.loader !== 'default'`), so the optimizer is off for the whole
// app, not just for media. Only build assets take this path — the seeded room
// photos under public/locations — and they ship at display size already.

const DEFAULT_QUALITY = 75;

/**
 * @param {import("next/image").ImageLoaderProps} props
 * @returns {string}
 */
export default function imageLoader({ src, width, quality }) {
  if (!src.startsWith("/media/")) return src;

  // Stored media URLs already carry a ?v= cache-buster.
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || DEFAULT_QUALITY}`;
}
