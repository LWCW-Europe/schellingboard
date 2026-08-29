// Serves the admin-uploaded site map from SB_UPLOADS_DIR. URLs carry a ?v=
// cache-buster set on upload, so responses can be cached aggressively.
//
// No ?w= handling, unlike the other two media routes: the map is an image of
// unknown dimensions shown at full width in a modal, so it is rendered
// `unoptimized` (see MapModal) and never asks for a rendition.
import { NextRequest, NextResponse } from "next/server";
import { readMapImage } from "@/utils/map-image";
import {
  MEDIA_CACHE_CONTROL,
  requireMediaAuth,
} from "@/utils/media-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unauthorized = await requireMediaAuth(request);
  if (unauthorized) return unauthorized;

  const { filename } = await params;
  const image = await readMapImage(filename);
  if (!image) {
    return new NextResponse("Not Found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": MEDIA_CACHE_CONTROL,
    },
  });
}
