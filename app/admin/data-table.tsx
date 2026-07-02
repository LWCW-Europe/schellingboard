"use client";

import { type ReactNode, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Column<T> = {
  header: ReactNode;
  cell: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

/**
 * Opt-in row selection for bulk actions. Selection state is owned by the caller
 * (so it can drive a bulk action bar); the table only renders the checkboxes and
 * reports toggles. `onToggleAllOnPage` receives the keys for the current page
 * and whether they should all become selected.
 */
export type Selection<T> = {
  selectedKeys: Set<string>;
  onToggleRow: (key: string) => void;
  onToggleAllOnPage: (pageKeys: string[], shouldSelectAll: boolean) => void;
  rowLabel: (row: T) => string;
};

/**
 * Hook for components that drive a `DataTable` to update the URL search params
 * that back its server-side query. Passing `null` removes a param. Changing the
 * page is the caller's responsibility (pass `page`); any other change should
 * reset to page 1 by passing `page: null`.
 */
export function useTableParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  return { searchParams, setParams };
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  total,
  page,
  pageSize,
  searchQuery,
  searchPlaceholder = "Search…",
  toolbar,
  bulkBar,
  selection,
  mobileCard,
  emptyMessage = "Nothing to show.",
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  total: number;
  page: number;
  pageSize: number;
  searchQuery: string;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  bulkBar?: ReactNode;
  selection?: Selection<T>;
  mobileCard: (row: T) => ReactNode;
  emptyMessage?: string;
}) {
  const { setParams } = useTableParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    setParams({ q: typeof value === "string" ? value : null, page: null });
  };

  const pageKeys = rows.map(rowKey);
  const allOnPageSelected =
    pageKeys.length > 0 &&
    pageKeys.every((k) => selection?.selectedKeys.has(k));
  const someOnPageSelected = pageKeys.some((k) =>
    selection?.selectedKeys.has(k)
  );

  const selectAllRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = someOnPageSelected && !allOnPageSelected;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={onSearch} role="search" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:border-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Search
          </button>
        </form>
        {toolbar}
      </div>

      {bulkBar}

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <>
          {/* Desktop: a table. */}
          <table className="hidden w-full text-sm sm:table">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                {selection && (
                  <th className="py-2 pr-4 font-medium">
                    <input
                      type="checkbox"
                      ref={selectAllRef}
                      checked={allOnPageSelected}
                      aria-label="Select all"
                      onChange={() =>
                        selection.onToggleAllOnPage(
                          pageKeys,
                          !allOnPageSelected
                        )
                      }
                      className="h-4 w-4 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`py-2 pr-4 font-medium ${col.headerClassName ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={rowKey(row)} className="border-b border-gray-100">
                  {selection && (
                    <td className="py-2 pr-4">
                      <input
                        type="checkbox"
                        checked={selection.selectedKeys.has(rowKey(row))}
                        aria-label={`Select ${selection.rowLabel(row)}`}
                        onChange={() => selection.onToggleRow(rowKey(row))}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={`py-2 pr-4 ${col.cellClassName ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: stacked cards. */}
          <ul className="space-y-3 sm:hidden">
            {rows.map((row) => (
              <li
                key={rowKey(row)}
                className="flex items-start gap-3 rounded-md border border-gray-200 p-3"
              >
                {selection && (
                  <input
                    type="checkbox"
                    checked={selection.selectedKeys.has(rowKey(row))}
                    aria-label={`Select ${selection.rowLabel(row)}`}
                    onChange={() => selection.onToggleRow(rowKey(row))}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
                  />
                )}
                <div className="min-w-0 flex-1">{mobileCard(row)}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {total === 0
            ? "0 results"
            : `${total} result${total === 1 ? "" : "s"}`}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setParams({ page: String(page - 1) })}
            disabled={page <= 1}
            aria-label="Previous page"
            className="px-3 py-1 rounded-md border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setParams({ page: String(page + 1) })}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="px-3 py-1 rounded-md border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
