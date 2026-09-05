import type { MetadataRoute } from "next";

import { getRepositories } from "@/db/container";
import { LIGHT_SURFACE } from "@/utils/theme";

// The name comes out of the database, so this can't be baked at build time —
// the image is built without one, and two instances of it are different events.
export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getRepositories().settings.get();

  return {
    name: settings.title,
    description: settings.description,
    // Pinned, so that changing start_url later doesn't read as a different
    // app and strand every install.
    id: "/",
    start_url: "/",
    display: "standalone",
    // The light theme's --surface: an installed window paints this before the
    // first render, and guessing dark for a guest whose phone is light is the
    // more jarring way to be wrong. The window chrome around a running app
    // follows the theme-color meta tag instead, which app/layout.tsx sets per
    // theme.
    background_color: LIGHT_SURFACE,
    theme_color: LIGHT_SURFACE,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
