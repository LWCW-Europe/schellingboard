"use client";

import { useState, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import Fuse from "fuse.js";
import {
  PencilIcon,
  ClockIcon,
  UserIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

import HoverTooltip from "@/app/(site)/hover-tooltip";
import { EventContext, UserContext, VotesContext } from "@/app/(site)/context";
import type { SessionProposal } from "@/db/repositories/interfaces";
import {
  inSchedPhase,
  inVotingPhase,
  dateStartDescription,
  inProposalPhase,
} from "@/app/(site)/utils/events";
import type { Event } from "@/db/repositories/interfaces";
import { useLocalZone } from "@/utils/hooks";
import { formatDuration, durationMinusBreak } from "@/utils/utils";

import { VotingButtons } from "./voting-buttons";
import { VoteTally } from "./vote-tally";
import { voteChoiceRank } from "@/app/(site)/votes";
import { viewProposalLinkFromOwner } from "../modal-nav";
import { stripMarkdown } from "@/utils/markdown";

const ITEMS_PER_PAGE = 1000;

type SortColumn = keyof SessionProposal | "userVote" | "votes";

type SortConfig = {
  key: SortColumn;
  direction: "asc" | "desc";
};

type Filter = "mine" | "voted" | "unvoted" | undefined;

export function ProposalTable({
  proposals: paramProposals,
  eventSlug,
  event,
}: {
  proposals: SessionProposal[];
  eventSlug: string;
  event: Event;
}) {
  const { now } = useContext(EventContext);
  // Both the desktop table and the mobile cards are mounted at once (CSS
  // decides which is visible), so anything derived per row is paid twice per
  // render. stripMarkdown runs a full remark parse and dominates that cost on
  // large lists, hence deriving it here once per proposal instead of per row.
  const initialProposals = useMemo(
    () =>
      paramProposals.map((proposal) => ({
        ...proposal,
        hostNames: proposal.hosts.map((h) => h.name),
        plainDescription: stripMarkdown(proposal.description),
      })),
    [paramProposals]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [resultFilter, setResultFilter] = useState<Filter>(undefined);
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    inVotingPhase(event, now)
      ? {
          key: "votesCount",
          direction: "asc",
        }
      : {
          key: "createdTime",
          direction: "desc",
        }
  );
  const { user: currentUserId } = useContext(UserContext);
  const { votes, proposalVoteEmoji, proposalVoteLabel } =
    useContext(VotesContext);
  const localZone = useLocalZone();
  // Derived: filter only applies when a user is selected. Hidden from data
  // and UI when logged out, without discarding the selection.
  const effectiveFilter: Filter = currentUserId ? resultFilter : undefined;
  const filteredProposals = useMemo(
    () =>
      initialProposals.filter((pr) => {
        if (effectiveFilter) {
          const isMine = pr.hosts.some((h) => h.id === currentUserId);
          const hasVoted = votes.some((vote) => vote.proposalId === pr.id);
          let actual: Filter;
          if (isMine) {
            actual = "mine";
          } else if (hasVoted) {
            actual = "voted";
          } else {
            actual = "unvoted";
          }
          return effectiveFilter === actual;
        } else {
          return true;
        }
      }),
    [initialProposals, effectiveFilter, currentUserId, votes]
  );
  const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
  const votingEnabled = !!currentUserId && inVotingPhase(event, now);
  const schedEnabled = inSchedPhase(event, now);
  let votingDisabledText = "";
  if (inSchedPhase(event, now)) {
    votingDisabledText = `The voting phase is over`;
  } else if (inProposalPhase(event, now)) {
    votingDisabledText = `Voting ${dateStartDescription(event.votingPhaseStart, event.timezone, localZone)}`;
  } else if (!currentUserId) {
    votingDisabledText = "Select a user first";
  }
  const schedDisabledText =
    "Scheduling " +
    dateStartDescription(event.schedulingPhaseStart, event.timezone, localZone);

  function updateResultFilter(newFilter: Filter) {
    setPage(1);
    setResultFilter((oldFilter) =>
      oldFilter === newFilter ? undefined : newFilter
    );
  }
  const isSearching = searchQuery.trim() !== "";
  // Indexing every proposal costs more than a search does, so the index is
  // built only once a search is under way — the boolean, not the query,
  // is the dependency, so typing reuses it. Voting rebuilds it, since
  // filteredProposals is derived from the votes.
  const fuse = useMemo(
    () =>
      isSearching
        ? new Fuse(filteredProposals, {
            keys: [
              {
                name: "title",
                weight: 0.6,
              },
              {
                name: "hostNames",
                weight: 0.25,
              },
              {
                // The stripped text, not the markdown source: a phrase the
                // reader sees is otherwise cut in two by the "**" around it.
                name: "plainDescription",
                weight: 0.15,
              },
            ],
            // Fuse scores a match by how near the start of the field it is
            // and stops counting after ~100 characters, which hides most of
            // a description. Matching anywhere costs precision, so the
            // threshold comes down with it: at the default 0.6 a query
            // matched half the list, at 0.3 it matches a handful and still
            // forgives a typo.
            ignoreLocation: true,
            threshold: 0.3,
          })
        : null,
    [isSearching, filteredProposals]
  );
  const searchResults = useMemo(() => {
    // A search is ordered by relevance; an explicit sort would throw that away.
    if (fuse) {
      return fuse.search(searchQuery).map((res) => res.item);
    }
    // Copy: filteredProposals is memoized, so sorting it in place would leave
    // the cached value reordered for every later reader.
    const sorted = [...filteredProposals];
    sorted.sort((a, b) => {
      const { key, direction } = sortConfig;

      let cmp = 0;
      if (key === "title") {
        cmp = a[key].localeCompare(b[key]);
      } else if (key === "hosts") {
        if (a[key].length === 0 && b[key].length === 0) {
          cmp = 0;
        } else if (a[key].length === 0) {
          cmp = -1;
        } else if (b[key].length === 0) {
          cmp = 1;
        } else {
          const hostNamesStr = (hosts: SessionProposal["hosts"]) =>
            hosts
              .map((h) => h.name)
              .sort((x, y) => x.localeCompare(y))
              .join("");
          cmp = hostNamesStr(a.hosts).localeCompare(hostNamesStr(b.hosts));
        }
      } else if (key === "durationMinutes") {
        cmp = (a[key] || 0) - (b[key] || 0);
      } else if (key === "createdTime") {
        cmp = a[key].getTime() - b[key].getTime();
      } else if (key === "votesCount") {
        cmp = (a[key] || 0) - (b[key] || 0);
      } else if (key === "userVote") {
        // Not VotesContext.getVote: that closes over the provider's state and
        // would be an unstable dependency of this memo.
        const rank = (proposalId: string) =>
          voteChoiceRank(
            votes.find(
              (v) => v.proposalId === proposalId && v.guestId === currentUserId
            )?.choice
          );
        cmp = rank(a.id) - rank(b.id);
      } else if (key === "votes") {
        const voteNum = (p: SessionProposal) =>
          p.interestedVotesCount * 4 + p.maybeVotesCount;
        cmp = voteNum(a) - voteNum(b);
      }
      return direction === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [fuse, searchQuery, filteredProposals, sortConfig, currentUserId, votes]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setPage(1);
    }
  };

  const getPageNumbers = () => {
    const arrowCss =
      "px-3 py-2 text-sm font-medium text-fg-muted bg-surface-raised border border-line rounded-md hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed";
    const currentPageNumCss = "bg-info text-on-info";
    const otherPageNumCss =
      "text-fg-muted bg-surface-raised border border-line hover:bg-surface-hover";
    const pages = [
      { display: "<<", toPage: 1, css: arrowCss },
      { display: "<", toPage: Math.max(page - 1, 1), css: arrowCss },
    ];
    for (
      let i = Math.max(1, page - 2);
      i <= Math.min(page + 2, totalPages);
      i++
    ) {
      const css = i === page ? currentPageNumCss : otherPageNumCss;
      pages.push({
        display: i.toString(),
        toPage: i,
        css,
      });
    }
    pages.push({
      display: ">",
      toPage: Math.min(page + 1, totalPages),
      css: arrowCss,
    });
    pages.push({ display: ">>", toPage: totalPages, css: arrowCss });
    return pages;
  };

  const currentPageProposals = searchResults.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const canEdit = (hosts: SessionProposal["hosts"]) => {
    if (hosts.length === 0) {
      return true;
    } else {
      return currentUserId && hosts.some((h) => h.id === currentUserId);
    }
  };

  const handleSort = (key: SortColumn) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortHeader = {
    sortConfig,
    sorting: !isSearching,
    onSort: handleSort,
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Section */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="lg:flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-fg-muted">
                Filters:
              </span>
              <span className="text-xs text-fg-subtle">
                ({searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                filter="mine"
                label="My proposals"
                describes="your proposals"
                icon={UserIcon}
                // Picking out your own proposals doesn't depend on the phase,
                // only on there being a "you".
                available={!!currentUserId}
                unavailableText="Select a user first"
                active={effectiveFilter === "mine"}
                count={filteredProposals.length}
                onClick={updateResultFilter}
              />
              <FilterButton
                filter="unvoted"
                label="Only unvoted"
                describes="unvoted proposals"
                icon={EyeSlashIcon}
                available={votingEnabled}
                unavailableText={votingDisabledText}
                active={effectiveFilter === "unvoted"}
                count={filteredProposals.length}
                onClick={updateResultFilter}
              />
              <FilterButton
                filter="voted"
                label="Only voted"
                describes="voted proposals"
                icon={CheckCircleIcon}
                available={votingEnabled}
                unavailableText={votingDisabledText}
                active={effectiveFilter === "voted"}
                count={filteredProposals.length}
                onClick={updateResultFilter}
              />
              {effectiveFilter && (
                <button
                  onClick={() => updateResultFilter(undefined)}
                  className="text-xs text-fg-subtle hover:text-fg-muted px-2 py-1 rounded border border-line bg-surface-raised hover:bg-surface-sunken transition-colors inline-flex items-center gap-1"
                  aria-label="Clear all active filters"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="lg:w-80">
            <input
              type="text"
              placeholder="Search proposals..."
              className="w-full p-3 border border-line rounded-md focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sort Dropdown */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-fg-muted">Sort by:</label>
          <select
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-") as [
                SortColumn,
                "asc" | "desc",
              ];
              setSortConfig({ key, direction });
            }}
            className="block w-48 px-3 py-2 text-sm border border-line rounded-md bg-surface-raised focus:ring-2 focus:ring-brand-accent focus:border-transparent"
          >
            <option value="title-asc">Title ↓</option>
            <option value="title-desc">Title ↑</option>
            <option value="hosts-asc">Host(s) ↓</option>
            <option value="hosts-desc">Host(s) ↑</option>
            <option value="durationMinutes-asc">Duration ↓</option>
            <option value="durationMinutes-desc">Duration ↑</option>
            <option value="userVote-asc">Your vote ↓</option>
            <option value="userVote-desc">Your vote ↑</option>
            {schedEnabled && (
              <>
                <option value="votes-asc">Votes ↓</option>
                <option value="votes-desc">Votes ↑</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-fixed w-full divide-y divide-line-subtle min-w-0">
          <thead className="bg-surface-sunken">
            <tr>
              <SortableHeader
                column="title"
                label="Title"
                width={schedEnabled ? "w-[18%]" : "w-[20%]"}
                {...sortHeader}
              />
              <SortableHeader
                column="hosts"
                label="Host(s)"
                width="w-[15%]"
                {...sortHeader}
              />
              <PlainHeader
                label="Description"
                width={schedEnabled ? "w-[20%]" : "w-[25%]"}
              />
              <SortableHeader
                column="durationMinutes"
                label="Duration"
                width="w-[10%]"
                {...sortHeader}
              />
              <SortableHeader
                column="userVote"
                label="Your vote"
                width={schedEnabled ? "w-[7%]" : "w-[10%]"}
                {...sortHeader}
              />
              {schedEnabled && (
                <SortableHeader
                  column="votes"
                  label="Votes"
                  width="w-[10%]"
                  {...sortHeader}
                />
              )}
              <PlainHeader label="Actions" width="w-[20%]" />
            </tr>
          </thead>
          <tbody className="bg-surface-raised divide-y divide-line-subtle">
            {currentPageProposals.map((proposal) => {
              return (
                <tr key={proposal.id} className="hover:bg-surface-hover">
                  <td className="px-4 lg:px-6 py-4" title={proposal.title}>
                    <Link
                      {...viewProposalLinkFromOwner(eventSlug, proposal.id)}
                      className="block w-full"
                    >
                      <div className="text-sm font-medium text-fg hover:text-link transition-colors line-clamp-2 leading-tight">
                        {proposal.title}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-fg-subtle">
                    <div className="truncate">
                      {proposal.hosts.length === 0 ? (
                        <span className="italic">No host yet</span>
                      ) : (
                        proposal.hosts.map((h, i) => (
                          <span key={h.id}>
                            {i > 0 && ", "}
                            <Link
                              href={`/guests/${h.id}`}
                              className="hover:text-link transition-colors"
                            >
                              {h.name}
                            </Link>
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td
                    className="px-4 lg:px-6 py-4"
                    title={proposal.plainDescription}
                  >
                    <div className="text-sm text-fg-subtle line-clamp-2 leading-tight">
                      {proposal.plainDescription || "-"}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {proposal.durationMinutes ? (
                        <>
                          <ClockIcon className="h-4 w-4 mr-1 text-fg-subtle flex-shrink-0" />
                          <span className="text-sm text-fg-subtle truncate">
                            {formatDuration(
                              durationMinusBreak(
                                proposal.durationMinutes,
                                event.breakMinutes
                              )
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-fg-subtle">-</span>
                      )}
                    </div>
                  </td>
                  {!schedEnabled && (
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      {currentUserId &&
                        !proposal.hosts.some((h) => h.id === currentUserId) && (
                          <VotingButtons
                            proposalId={proposal.id}
                            votingEnabled={votingEnabled}
                            votingDisabledText={votingDisabledText}
                          />
                        )}
                    </td>
                  )}
                  {schedEnabled && (
                    <>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span title={proposalVoteLabel(proposal.id)}>
                          {proposalVoteEmoji(proposal.id)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <VoteTally proposal={proposal} />
                      </td>
                    </>
                  )}
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {canEdit(proposal.hosts) && (
                        <ProposalActions
                          eventSlug={eventSlug}
                          proposalId={proposal.id}
                          schedEnabled={schedEnabled}
                          schedDisabledText={schedDisabledText}
                          compact
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {searchResults.length === 0 && (
              <tr>
                <td
                  colSpan={schedEnabled ? 7 : 6}
                  className="px-4 lg:px-6 py-4 text-center text-sm text-fg-subtle"
                >
                  No proposals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {currentPageProposals.map((proposal) => {
          return (
            <div
              key={proposal.id}
              className="bg-surface-raised border border-line-subtle rounded-lg p-4 hover:bg-surface-sunken relative"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-medium text-fg">
                    <Link
                      {...viewProposalLinkFromOwner(eventSlug, proposal.id)}
                      className="hover:text-link transition-colors after:absolute after:inset-0"
                    >
                      {proposal.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-fg-subtle mt-1">
                    {proposal.hosts.length === 0 ? (
                      <span className="italic">No host yet</span>
                    ) : (
                      `Host(s): ${proposal.hosts.map((h) => h.name).join(", ")}`
                    )}
                  </p>
                </div>

                {proposal.plainDescription ? (
                  <p className="text-sm text-fg-muted line-clamp-3">
                    {proposal.plainDescription}
                  </p>
                ) : (
                  <p className="text-sm text-fg-subtle">-</p>
                )}

                {proposal.durationMinutes ? (
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-fg-subtle" />
                    <span className="text-sm text-fg-subtle">
                      {formatDuration(
                        durationMinusBreak(
                          proposal.durationMinutes,
                          event.breakMinutes
                        )
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-fg-subtle">-</div>
                )}

                <div className="pt-2 border-t border-line-subtle space-y-3">
                  {currentUserId &&
                    !proposal.hosts.some((h) => h.id === currentUserId) &&
                    !schedEnabled && (
                      <div className="relative z-10">
                        <VotingButtons
                          proposalId={proposal.id}
                          votingEnabled={votingEnabled}
                          votingDisabledText={votingDisabledText}
                        />
                      </div>
                    )}
                  {schedEnabled && (
                    <>
                      {!canEdit(proposal.hosts) && (
                        <div>
                          Your vote:
                          <span
                            title={proposalVoteLabel(proposal.id)}
                            className="ml-1"
                          >
                            {proposalVoteEmoji(proposal.id)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        Total votes:
                        <VoteTally proposal={proposal} />
                      </div>
                    </>
                  )}

                  {/* Above the card-wide link the title stretches over, so
                      these stay clickable in their own right. */}
                  <div className="flex gap-2 relative z-10">
                    {canEdit(proposal.hosts) && (
                      <ProposalActions
                        eventSlug={eventSlug}
                        proposalId={proposal.id}
                        schedEnabled={schedEnabled}
                        schedDisabledText={schedDisabledText}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {searchResults.length === 0 && (
          <div className="text-center py-8 text-sm text-fg-subtle">
            No proposals found
          </div>
        )}
      </div>
      {searchResults.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {getPageNumbers().map(({ display, toPage, css }) => (
            <button
              key={display}
              onClick={() => setPage(toPage)}
              disabled={page == toPage}
              className={
                "px-2 sm:px-3 py-2 text-sm font-medium rounded-md " + css
              }
            >
              {display}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const HEADER_CSS =
  "px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";

function PlainHeader({ label, width }: { label: string; width: string }) {
  return (
    <th scope="col" className={clsx(width, HEADER_CSS, "text-fg-subtle")}>
      {label}
    </th>
  );
}

function SortableHeader({
  column,
  label,
  width,
  sortConfig,
  // False while a search is running: the results are ordered by relevance, so
  // there is no sort to indicate and no column to highlight.
  sorting,
  onSort,
}: {
  column: SortColumn;
  label: string;
  width: string;
  sortConfig: SortConfig;
  sorting: boolean;
  onSort: (column: SortColumn) => void;
}) {
  const active = sorting && sortConfig.key === column;
  let indicator = "";
  if (sorting) {
    indicator = active ? (sortConfig.direction === "asc" ? " ↓" : " ↑") : " ↑↓";
  }

  return (
    <th
      scope="col"
      onClick={() => onSort(column)}
      className={clsx(
        width,
        HEADER_CSS,
        "cursor-pointer hover:bg-surface-hover",
        active ? "text-fg font-semibold" : "text-fg-subtle"
      )}
    >
      {label}
      {indicator}
    </th>
  );
}

function FilterButton({
  filter,
  label,
  describes,
  icon: Icon,
  available,
  unavailableText,
  active,
  count,
  onClick,
}: {
  filter: NonNullable<Filter>;
  label: string;
  /** Completes "Filter to show only …" for screen readers. */
  describes: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  unavailableText: string;
  active: boolean;
  count: number;
  onClick: (filter: Filter) => void;
}) {
  return (
    <HoverTooltip text={unavailableText} visible={!available} unavailable>
      <button
        className={clsx(
          "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed text-sm px-3 py-2 rounded-md transition-colors inline-flex items-center gap-2",
          active
            ? "bg-info text-on-info hover:bg-info-hover"
            : "bg-surface-muted text-fg-muted",
          !active && available && "hover:bg-surface-hover"
        )}
        onClick={() => onClick(filter)}
        aria-pressed={active}
        aria-label={`Filter to show only ${describes}`}
      >
        <Icon className="h-4 w-4" />
        {label}
        {active && (
          <span className="bg-info-hover text-on-info text-xs px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>
    </HoverTooltip>
  );
}

function ProposalActions({
  eventSlug,
  proposalId,
  schedEnabled,
  schedDisabledText,
  compact = false,
}: {
  eventSlug: string;
  proposalId: string;
  schedEnabled: boolean;
  schedDisabledText: string;
  /** The denser pair the table rows use; the cards want tappable ones. */
  compact?: boolean;
}) {
  const router = useRouter();
  const buttonCss = clsx(
    "inline-flex items-center justify-center font-medium rounded-md border border-brand-accent text-brand-fg hover:bg-brand-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors",
    compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
  );
  const iconCss = clsx(compact ? "h-3 w-3" : "h-4 w-4", "mr-1");
  const go = (href: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(href);
  };

  return (
    <>
      <button
        onClick={go(`/${eventSlug}/proposals/${proposalId}/edit`)}
        className={buttonCss}
      >
        <PencilIcon className={iconCss} />
        Edit
      </button>
      <HoverTooltip
        text={schedDisabledText}
        visible={!schedEnabled}
        unavailable
      >
        <button
          onClick={go(`/${eventSlug}/add-session?proposalID=${proposalId}`)}
          className={clsx(
            buttonCss,
            !schedEnabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <CalendarIcon className={iconCss} />
          Schedule
        </button>
      </HoverTooltip>
    </>
  );
}
