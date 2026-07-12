// Single source of truth for the admin-uploaded files directory (avatars,
// location images, the site map). A persistent volume in production; defaults
// to ./uploads. Uses `||` so an empty SB_UPLOADS_DIR falls back to the default
// rather than resolving relative to the current directory.
//
// Keep this an opaque function (don't inline the literal at call sites): the
// standalone build's file tracer follows a literal "./uploads" into a
// whole-project trace, but not an opaque call. See utils/images.ts.
export function uploadsDir(): string {
  return process.env.SB_UPLOADS_DIR || "./uploads";
}
