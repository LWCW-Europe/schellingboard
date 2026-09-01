/**
 * The `?page=` a visitor asked for, or 1 when it is missing or not a page
 * number. Rejects fractions and infinities rather than rounding them: SQLite
 * refuses a non-integer OFFSET, and a page beyond the end is handled by
 * {@link outOfRangePageRedirect} rather than by clamping here.
 */
export function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

/**
 * Returns the URL of the last valid page when `page` is beyond it (stale URL,
 * or the list shrank), otherwise null. `params` are preserved in the redirect;
 * empty values are dropped, as is `page` when the target is page 1.
 */
export function outOfRangePageRedirect({
  basePath,
  page,
  total,
  pageSize,
  params = {},
}: {
  basePath: string;
  page: number;
  total: number;
  pageSize: number;
  params?: Record<string, string>;
}): string | null {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (page <= totalPages) return null;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  if (totalPages > 1) search.set("page", String(totalPages));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
