"use client";

import { useState, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { VoteChoice } from "@/app/(site)/votes";
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
  const { votes, proposalVoteEmoji } = useContext(VotesContext);
  const localZone = useLocalZone();
  const router = useRouter();
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
        const getVoteOrder = (proposalId: string) => {
          if (!currentUserId) return 3;
          const userVote = votes.find(
            (v) => v.proposalId === proposalId && v.guestId === currentUserId
          );
          if (!userVote) return 3; // no vote
          switch (userVote.choice) {
            case VoteChoice.interested:
              return 0;
            case VoteChoice.maybe:
              return 1;
            case VoteChoice.skip:
              return 2;
            default:
              return 3; // no vote
          }
        };
        cmp = getVoteOrder(a.id) - getVoteOrder(b.id);
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
              <HoverTooltip
                text="Select a user first"
                visible={!currentUserId}
                unavailable
              >
                <button
                  className={`aria-disabled:opacity-50 aria-disabled:cursor-not-allowed text-sm px-3 py-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                    effectiveFilter === "mine"
                      ? "bg-info text-on-info hover:bg-info-hover"
                      : currentUserId
                        ? "bg-surface-muted text-fg-muted hover:bg-surface-hover"
                        : "bg-surface-muted text-fg-muted"
                  }`}
                  onClick={() => updateResultFilter("mine")}
                  aria-pressed={effectiveFilter === "mine"}
                  aria-label={`Filter to show only your proposals${effectiveFilter === "mine" ? " (active)" : ""}`}
                >
                  <UserIcon className="h-4 w-4" />
                  My proposals
                  {effectiveFilter === "mine" && (
                    <span className="bg-info-hover text-on-info text-xs px-1.5 py-0.5 rounded-full">
                      {filteredProposals.length}
                    </span>
                  )}
                </button>
              </HoverTooltip>
              <HoverTooltip
                text={votingDisabledText}
                visible={!votingEnabled}
                unavailable
              >
                <button
                  className={`aria-disabled:opacity-50 aria-disabled:cursor-not-allowed text-sm px-3 py-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                    effectiveFilter === "unvoted"
                      ? "bg-info text-on-info hover:bg-info-hover"
                      : currentUserId
                        ? "bg-surface-muted text-fg-muted hover:bg-surface-hover"
                        : "bg-surface-muted text-fg-muted"
                  }`}
                  aria-label="Filter to show only unvoted proposals"
                  onClick={() => updateResultFilter("unvoted")}
                >
                  <EyeSlashIcon className="h-4 w-4" />
                  Only unvoted
                  {effectiveFilter === "unvoted" && (
                    <span className="bg-info-hover text-on-info text-xs px-1.5 py-0.5 rounded-full">
                      {filteredProposals.length}
                    </span>
                  )}
                </button>
              </HoverTooltip>
              <HoverTooltip
                text={votingDisabledText}
                visible={!votingEnabled}
                unavailable
              >
                <button
                  className={`aria-disabled:opacity-50 aria-disabled:cursor-not-allowed text-sm px-3 py-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                    effectiveFilter === "voted"
                      ? "bg-info text-on-info hover:bg-info-hover"
                      : currentUserId
                        ? "bg-surface-muted text-fg-muted hover:bg-surface-hover"
                        : "bg-surface-muted text-fg-muted"
                  }`}
                  aria-label="Filter to show only voted proposals"
                  onClick={() => updateResultFilter("voted")}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  Only voted
                  {effectiveFilter === "voted" && (
                    <span className="bg-info-hover text-on-info text-xs px-1.5 py-0.5 rounded-full">
                      {filteredProposals.length}
                    </span>
                  )}
                </button>
              </HoverTooltip>
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
              <th
                onClick={() => handleSort("title")}
                scope="col"
                className={`${schedEnabled ? "w-[18%]" : "w-[20%]"} text-left px-4 lg:px-6 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-surface-hover
                  ${sortConfig.key === "title" && !isSearching ? "text-fg font-semibold" : "text-fg-subtle"}`}
              >
                Title
                {!isSearching &&
                  (sortConfig.key === "title"
                    ? sortConfig.direction === "asc"
                      ? " ↓"
                      : " ↑"
                    : " ↑↓")}
              </th>
              <th
                onClick={() => handleSort("hosts")}
                scope="col"
                className={`w-[15%] px-4 lg:px-6 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-surface-hover
                  ${sortConfig.key === "hosts" && !isSearching ? "text-fg font-semibold" : "text-fg-subtle"}`}
              >
                Host(s)
                {!isSearching &&
                  (sortConfig.key === "hosts"
                    ? sortConfig.direction === "asc"
                      ? " ↓"
                      : " ↑"
                    : " ↑↓")}
              </th>
              <th
                scope="col"
                className={`${schedEnabled ? "w-[20%]" : "w-[25%]"} px-4 lg:px-6 py-3 text-left text-xs font-medium text-fg-subtle uppercase tracking-wider`}
              >
                Description
              </th>
              <th
                onClick={() => handleSort("durationMinutes")}
                scope="col"
                className={`w-[10%] px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-surface-hover
                  ${sortConfig.key === "durationMinutes" && !isSearching ? "text-fg font-semibold" : "text-fg-subtle"}`}
              >
                Duration
                {!isSearching &&
                  (sortConfig.key === "durationMinutes"
                    ? sortConfig.direction === "asc"
                      ? " ↓"
                      : " ↑"
                    : " ↑↓")}
              </th>
              <th
                onClick={() => handleSort("userVote")}
                scope="col"
                className={`${schedEnabled ? "w-[7%]" : "w-[10%]"} px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-surface-hover
                  ${sortConfig.key === "userVote" && !isSearching ? "text-fg font-semibold" : "text-fg-subtle"}`}
              >
                Your vote
                {!isSearching &&
                  (sortConfig.key === "userVote"
                    ? sortConfig.direction === "asc"
                      ? " ↓"
                      : " ↑"
                    : " ↑↓")}
              </th>
              {schedEnabled && (
                <th
                  onClick={() => handleSort("votes")}
                  scope="col"
                  className={`w-[10%] px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-surface-hover
                    ${sortConfig.key === "votes" && !isSearching ? "text-fg font-semibold" : "text-fg-subtle"}`}
                >
                  Votes
                  {!isSearching &&
                    (sortConfig.key === "votes"
                      ? sortConfig.direction === "asc"
                        ? " ↓"
                        : " ↑"
                      : " ↑↓")}
                </th>
              )}
              <th
                scope="col"
                className={`w-[20%] px-4 lg:px-6 py-3 text-left text-xs font-medium text-fg-subtle uppercase tracking-wider`}
              >
                Actions
              </th>
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
                        <span
                          title={(() => {
                            const vote = votes.find(
                              (v) =>
                                v.proposalId === proposal.id &&
                                v.guestId === currentUserId
                            );
                            if (!vote) return "No vote";
                            switch (vote.choice) {
                              case VoteChoice.interested:
                                return "Interested";
                              case VoteChoice.maybe:
                                return "Maybe";
                              case VoteChoice.skip:
                                return "Skip";
                              default:
                                return "No vote";
                            }
                          })()}
                        >
                          {proposalVoteEmoji(proposal.id)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            title={`${proposal.interestedVotesCount} interested vote${proposal.interestedVotesCount !== 1 ? "s" : ""}`}
                            className="flex items-center gap-1 text-sm text-fg-subtle"
                          >
                            ❤️&nbsp;{proposal.interestedVotesCount}
                          </span>
                          <span
                            title={`${proposal.maybeVotesCount} maybe vote${proposal.maybeVotesCount !== 1 ? "s" : ""}`}
                            className="flex items-center gap-1 text-sm text-fg-subtle"
                          >
                            ⭐&nbsp;{proposal.maybeVotesCount}
                          </span>
                        </div>
                      </td>
                    </>
                  )}
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1 flex-col sm:flex-row">
                      {canEdit(proposal.hosts) && (
                        <div className="relative inline-block group">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/${eventSlug}/proposals/${proposal.id}/edit`
                              );
                            }}
                            className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border border-brand-accent text-brand-fg hover:bg-brand-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                        </div>
                      )}
                      {canEdit(proposal.hosts) && (
                        <HoverTooltip
                          text={schedDisabledText}
                          visible={!schedEnabled}
                          unavailable
                        >
                          <button
                            onClick={() =>
                              router.push(
                                `/${eventSlug}/add-session?proposalID=${proposal.id}`
                              )
                            }
                            className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border border-brand-accent text-brand-fg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent hover:bg-brand-tint transition-colors ${
                              schedEnabled
                                ? ""
                                : "opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Schedule
                          </button>
                        </HoverTooltip>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {searchResults.length === 0 && (
              <tr>
                <td
                  colSpan={6}
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
                            title={(() => {
                              const vote = votes.find(
                                (v) =>
                                  v.proposalId === proposal.id &&
                                  v.guestId === currentUserId
                              );
                              if (!vote) return "No vote";
                              switch (vote.choice) {
                                case VoteChoice.interested:
                                  return "Interested";
                                case VoteChoice.maybe:
                                  return "Maybe";
                                case VoteChoice.skip:
                                  return "Skip";
                                default:
                                  return "No vote";
                              }
                            })()}
                            className="ml-1"
                          >
                            {proposalVoteEmoji(proposal.id)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        Total votes:
                        <span
                          title={`${proposal.interestedVotesCount} interested vote${proposal.interestedVotesCount !== 1 ? "s" : ""}`}
                          className="flex items-center gap-1 text-sm text-fg-subtle"
                        >
                          ❤️&nbsp;{proposal.interestedVotesCount}
                        </span>
                        <span
                          title={`${proposal.maybeVotesCount} maybe vote${proposal.maybeVotesCount !== 1 ? "s" : ""}`}
                          className="flex items-center gap-1 text-sm text-fg-subtle"
                        >
                          ⭐&nbsp;{proposal.maybeVotesCount}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 relative z-10">
                    {canEdit(proposal.hosts) && (
                      <div className="relative inline-block group">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/${eventSlug}/proposals/${proposal.id}/edit`
                            );
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-brand-accent text-brand-fg hover:bg-brand-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    )}
                    {canEdit(proposal.hosts) && (
                      <HoverTooltip
                        text={schedDisabledText}
                        visible={!schedEnabled}
                        unavailable
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/${eventSlug}/add-session?proposalID=${proposal.id}`
                            );
                          }}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-brand-accent text-brand-fg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent hover:bg-brand-tint transition-colors ${
                            schedEnabled ? "" : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Schedule
                        </button>
                      </HoverTooltip>
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
