/**
 * The site's button looks, as class strings. Shared because four copies of the
 * same literal had already drifted apart in review; `app/admin` keeps its own
 * set, which the admin chrome is free to restyle on its own.
 */
export const PRIMARY_BUTTON =
  "px-3 py-2 text-sm font-medium rounded-md text-on-brand bg-brand hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
export const SECONDARY_BUTTON =
  "px-3 py-2 text-sm font-medium rounded-md text-fg-muted bg-surface-muted hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
export const DANGER_BUTTON =
  "px-3 py-2 text-sm font-medium rounded-md text-danger-fg bg-surface-muted hover:bg-danger-tint transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
