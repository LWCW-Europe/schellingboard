// Serves user-uploaded avatars from SB_UPLOADS_DIR. URLs carry a ?v=
// cache-buster set on upload, and ?w= the width next/image asked for (see
// utils/image-loader.js), so responses can be cached aggressively.
import { NextRequest, NextResponse } from "next/server";
import { getImageRepositories, requestedWidth } from "@/utils/images";
import { MEDIA_CACHE_CONTROL, requireMediaAuth } from "@/utils/media-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unauthorized = await requireMediaAuth(request);
  if (unauthorized) return unauthorized;

  const { filename } = await params;
  const width = requestedWidth(request.nextUrl.searchParams);
  if (width === false) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const avatars = getImageRepositories().avatars;
  const image =
    width === null
      ? await avatars.read(filename)
      : await avatars.readSized(filename, width);
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
