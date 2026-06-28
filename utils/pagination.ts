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
