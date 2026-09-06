"use client";
import {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useContext,
} from "react";
import { usePathname } from "next/navigation";
import type {
  Event,
  Day,
  Session,
  Location,
  Guest,
  Rsvp,
} from "@/db/repositories/interfaces";
import {
  Vote,
  voteChoiceToEmoji,
  voteChoiceToLabel,
  NO_VOTE_LABEL,
} from "@/app/(site)/votes";
import {
  currentVerifiedUserAction,
  selectUserAction,
  type SelectUserResult,
} from "@/app/actions/user-auth";
import { DEFAULT_BREAK_MINUTES, votesApiUrl } from "@/utils/utils";
import { DEFAULT_SLOT_INCREMENT_MINUTES } from "@/utils/slots";
import { startNowTicker, NOW_REFRESH_INTERVAL_MS } from "@/utils/now-ticker";

export type DayWithSessions = Day & { sessions: Session[] };

// Shared "none" values, so a render with nothing loaded yields the same array
// each time instead of a fresh one.
const NO_RSVPS: Rsvp[] = [];
const NO_VOTES: Vote[] = [];

export interface UserContextType {
  user: string | null;
  /**
   * Switches the current user via the server, which owns the identity
   * cookies. Fails with needsAuth for a protected guest — the caller should
   * then collect credentials and call the login action, followed by
   * applyUser on success.
   */
  switchUser: ((u: string | null) => Promise<SelectUserResult>) | null;
  /** Syncs client state after the server already authenticated the user. */
  applyUser: ((u: string | null) => void) | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  switchUser: null,
  applyUser: null,
});

export interface EventContextType {
  event: Event | null;
  days: DayWithSessions[];
  sessions: Session[];
  locations: Location[];
  guests: Guest[];
  rsvps: Rsvp[];
  // Starts as the server-rendered value so SSR and hydration agree on
  // time-dependent decisions (e.g. which schedule days default to folded),
  // then ticks forward on the client (see startNowTicker) so long-lived
  // pages don't treat a stale `now` as current (e.g. bookable-slot checks).
  now: Date;
  rsvpdForSession: (sessionId: string) => boolean;
  localSessions: Session[];
  userBusySessions: () => Session[];
  updateRsvp: (
    guestId: string,
    sessionId: string,
    remove: boolean
  ) => Promise<{ ok: true } | { ok: false; error?: string }>;
}

export const EventContext = createContext<EventContextType>({
  event: null,
  days: [],
  sessions: [],
  locations: [],
  guests: [],
  rsvps: [],
  now: new Date(0),
  localSessions: [],
  userBusySessions: () => [],
  rsvpdForSession: () => false,
  updateRsvp: async () => {
    await Promise.resolve();
    return { ok: false };
  },
});

/**
 * The current event's break length, read from EventContext so duration/time
 * displays don't have to prop-drill it. Falls back to DEFAULT_BREAK_MINUTES
 * when no event is in context (e.g. before the provider has loaded).
 */
export function useBreakMinutes(): number {
  const { event } = useContext(EventContext);
  return event?.breakMinutes ?? DEFAULT_BREAK_MINUTES;
}

/**
 * The current event's slot increment, read from EventContext like
 * useBreakMinutes. Falls back to DEFAULT_SLOT_INCREMENT_MINUTES when no event
 * is in context.
 */
export function useSlotIncrement(): number {
  const { event } = useContext(EventContext);
  return event?.slotIncrementMinutes ?? DEFAULT_SLOT_INCREMENT_MINUTES;
}

export interface VotesContextType {
  votes: Vote[];
  addVote: (vote: Vote) => void;
  removeVote: (proposalId: string) => void;
  updateVote: (proposalId: string, choice: Vote["choice"]) => void;
  hasVoted: (proposalId: string) => boolean;
  getVote: (proposalId: string) => Vote | undefined;
  proposalVoteEmoji: (proposalId: string) => string;
  proposalVoteLabel: (proposalId: string) => string;
}

export const VotesContext = createContext<VotesContextType>({
  votes: [],
  addVote: () => {},
  removeVote: () => {},
  updateVote: () => {},
  hasVoted: () => false,
  getVote: () => undefined,
  proposalVoteEmoji: () => "",
  proposalVoteLabel: () => NO_VOTE_LABEL,
});

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: string | null;
}) {
  const [user, setUser] = useState<string | null>(initialUser);
  const path = usePathname();

  const switchUser = async (
    guestId: string | null
  ): Promise<SelectUserResult> => {
    const result = await selectUserAction(guestId);
    if (result.ok) {
      setUser(guestId);
    }
    return result;
  };

  // `initialUser` is read once, when the (site) layout mounts, and that layout
  // then survives every client-side navigation — so a selection the server has
  // meanwhile stopped honouring (protection enabled from this browser or from
  // another device, #805) would go on rendering as if it still held, offering
  // a menu whose pages all insist no name is selected. Re-ask the server on
  // each navigation instead. The first run is skipped: the render that mounted
  // this provider already carries the server's answer, and this provider sits
  // above every Suspense boundary, where an update landing during hydration
  // can be built and never committed (see the VotesProvider comment in
  // app/(site)/[eventSlug]/layout.tsx).
  const checkedOnce = useRef(false);
  useEffect(() => {
    if (!checkedOnce.current) {
      checkedOnce.current = true;
      return;
    }
    if (!user) return;
    let superseded = false;
    async function check() {
      try {
        const verified = await currentVerifiedUserAction();
        // A reply overtaken by a later switch must not undo it.
        if (superseded || verified === user) return;
        if (verified === null) {
          // Clear the cookie too, not just the client state: this browser is
          // logged out, and a selection the server won't act as would go on
          // telling the pages that read it raw (settings, edit profile) that a
          // name is picked.
          await switchUser(null);
        } else {
          // Another tab switched names; the cookie is shared, so it wins.
          setUser(verified);
        }
      } catch {
        // Session check failed — leave the current state as-is;
        // the next navigation will retry.
      }
    }

    void check();
    return () => {
      superseded = true;
    };
  }, [user, path]);

  return (
    <UserContext.Provider value={{ user, switchUser, applyUser: setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function EventProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Omit<
    EventContextType,
    "localSessions" | "userBusySessions" | "rsvpdForSession" | "updateRsvp"
  >;
}) {
  const { user } = useContext(UserContext);
  const serverSessions = value.days.flatMap((d) => d.sessions);
  // value.rsvps seeds the initial state once. The user-change effect below
  // is the only authoritative source of subsequent updates (plus optimistic
  // mutations in updateRsvp). Server-side revalidation is not used for RSVPs.
  // Keyed by the guest they belong to, so switching names never shows the
  // previous guest's RSVPs while the new answer is in flight, and logging out
  // has nothing to clear.
  const [loadedRsvps, setLoadedRsvps] = useState<{
    user: string | null;
    rsvps: Rsvp[];
  }>(() => ({ user, rsvps: value.rsvps }));
  const rsvps = loadedRsvps.user === user ? loadedRsvps.rsvps : NO_RSVPS;
  const updateRsvps = (update: (current: Rsvp[]) => Rsvp[]) =>
    setLoadedRsvps((prev) => ({
      user,
      rsvps: update(prev.user === user ? prev.rsvps : NO_RSVPS),
    }));
  const [rsvpCountDeltas, setRsvpCountDeltas] = useState(
    () => new Map<string, number>()
  );
  const [now, setNow] = useState(value.now);
  // The server re-seeds `now` on every RSC render; it jumps when the dev fake
  // clock changes and triggers a router.refresh. Adopt the new instant during
  // render (React's reset-state-on-prop-change pattern) rather than in an
  // effect, so there is no cascading render and no stale flash before the first
  // tick. `seedMs` also keys the ticker effect below.
  const seedMs = value.now.getTime();
  const [prevSeedMs, setPrevSeedMs] = useState(seedMs);
  if (seedMs !== prevSeedMs) {
    setPrevSeedMs(seedMs);
    setNow(value.now);
  }

  // Keep simulated time moving with an offset matching the current seed (~0
  // without an override, the simulated jump under one). Restarted whenever the
  // seed changes; see startNowTicker.
  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax -- deriving the offset needs the real clock the seed was taken against
    const offsetMs = seedMs - Date.now();
    return startNowTicker(setNow, NOW_REFRESH_INTERVAL_MS, offsetMs);
  }, [seedMs]);

  const localSessions = serverSessions.map((session) => {
    const delta = rsvpCountDeltas.get(session.id) ?? 0;
    if (delta === 0) return session;

    return {
      ...session,
      numRsvps: session.numRsvps + delta,
    };
  });

  useEffect(() => {
    // Deltas are relative to serverSessions' numRsvps values. When value.days
    // changes after an RSC refresh, the old deltas must be discarded so we don't
    // double-count optimistic changes that are now included by the server.
    //
    // Do not reset rsvps here: value.rsvps is only the initial/RSC value, and
    // may be older than the client-side user fetch or optimistic RSVP state.
    //
    // Tradeoffs of doing this in an effect:
    // - React first renders fresh serverSessions with the previous deltas, then
    //   this effect clears them, so there can be a transient wrong count.
    // - Depending on value.days may reset more often than strictly necessary.
    // - A failed RSVP request already in flight can still restore its old delta
    //   snapshot after this reset. That race already exists in the optimistic
    //   update flow; fixing it would require tracking a generation per request.
    // The alternative is storing generation metadata with the deltas, which is
    // more complex.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRsvpCountDeltas((current) =>
      current.size === 0 ? current : new Map<string, number>()
    );
  }, [value.days]);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    void fetch(`/api/rsvps?user=${user}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<Rsvp[]>) : null))
      .then((userRsvps) => {
        if (userRsvps) setLoadedRsvps({ user, rsvps: userRsvps });
      })
      // Aborted on switching names, and the browser kills it when the page
      // goes; either way there is nobody left to tell.
      .catch(() => undefined);
    return () => controller.abort();
  }, [user]);

  function userBusySessions() {
    if (user) {
      const sessionsWithRSVP = rsvps.map((r) => r.sessionId);
      return localSessions.filter(
        (ses) =>
          sessionsWithRSVP.includes(ses.id) ||
          ses.hosts.some((h) => h.id === user)
      );
    } else {
      return [];
    }
  }

  const rsvpdForSession = (sessionId: string) => {
    return rsvps.some((rsvp) => rsvp.sessionId === sessionId);
  };

  const updateRsvp = async (
    guestId: string,
    sessionId: string,
    remove: boolean
  ) => {
    const rsvpsBeforeUpdate = loadedRsvps;
    const rsvpCountDeltasBeforeUpdate = rsvpCountDeltas;
    // A snapshot from before a name switch must not replace what has since
    // been loaded for the new guest.
    const revertRsvps = () =>
      setLoadedRsvps((current) =>
        current.user === user ? rsvpsBeforeUpdate : current
      );
    try {
      const countChange = remove ? -1 : 1;
      setRsvpCountDeltas((old) => {
        const res = new Map(old);
        const delta = (res.get(sessionId) ?? 0) + countChange;
        if (delta === 0) {
          res.delete(sessionId);
        } else {
          res.set(sessionId, delta);
        }
        return res;
      });

      if (remove) {
        updateRsvps((prevRsvps) =>
          prevRsvps.filter(
            (rsvp) =>
              !(rsvp.guestId === guestId && rsvp.sessionId === sessionId)
          )
        );
      } else {
        const newRsvp: Rsvp = { id: "", guestId, sessionId };
        updateRsvps((prevRsvps) => [...prevRsvps, newRsvp]);
      }

      const response = await fetch("/api/toggle-rsvp", {
        method: "POST",
        body: JSON.stringify({
          guestId,
          sessionId,
          remove,
        }),
      });

      if (!response.ok) {
        revertRsvps();
        setRsvpCountDeltas(rsvpCountDeltasBeforeUpdate);
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        return { ok: false, error: body?.error };
      }
      return { ok: true };
    } catch (error: unknown) {
      console.error("Error updating RSVP:", error);
      revertRsvps();
      setRsvpCountDeltas(rsvpCountDeltasBeforeUpdate);
      return { ok: false };
    }
  };

  const contextValue: EventContextType = {
    ...value,
    now,
    rsvps,
    localSessions,
    userBusySessions,
    rsvpdForSession,
    updateRsvp,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}

export function VotesProvider({
  children,
  eventSlug,
}: {
  children: ReactNode;
  eventSlug: string;
}) {
  const { user } = useContext(UserContext);
  // Keyed by whose votes on which event they are, so switching names or
  // events never shows the previous answer while the new one is in flight,
  // and logging out has nothing to clear.
  const key = user ? `${user}:${eventSlug}` : null;
  const [loaded, setLoaded] = useState<{ key: string; votes: Vote[] } | null>(
    null
  );
  const votes = key !== null && loaded?.key === key ? loaded.votes : NO_VOTES;
  const updateVotes = (update: (current: Vote[]) => Vote[]) => {
    if (key === null) return;
    setLoaded((prev) => ({
      key,
      votes: update(prev?.key === key ? prev.votes : NO_VOTES),
    }));
  };

  useEffect(() => {
    if (!user) return;
    const fetchedFor = `${user}:${eventSlug}`;
    const controller = new AbortController();
    void fetch(votesApiUrl(user, eventSlug), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          console.error("Failed to fetch votes");
          return;
        }
        const fetchedVotes = (await response.json()) as Vote[];
        setLoaded((prev) => {
          // Preserve optimistic votes not yet reflected on the server
          const optimistic = (
            prev?.key === fetchedFor ? prev.votes : NO_VOTES
          ).filter(
            (pv) =>
              !fetchedVotes.some(
                (fv) =>
                  fv.proposalId === pv.proposalId && fv.guestId === pv.guestId
              )
          );
          return { key: fetchedFor, votes: [...fetchedVotes, ...optimistic] };
        });
      })
      // Aborted on switching names or events, and the browser kills it when
      // the page goes; either way there is nobody left to tell.
      .catch(() => undefined);
    return () => controller.abort();
  }, [user, eventSlug]);

  const addVote = (vote: Vote) => {
    updateVotes((prev) => {
      const existingIndex = prev.findIndex(
        (v) => v.proposalId === vote.proposalId && v.guestId === vote.guestId
      );
      if (existingIndex >= 0) {
        const newVotes = [...prev];
        newVotes[existingIndex] = vote;
        return newVotes;
      } else {
        return [...prev, vote];
      }
    });
  };

  const removeVote = (proposalId: string) => {
    updateVotes((prev) =>
      prev.filter((v) => !(v.proposalId === proposalId && v.guestId === user))
    );
  };

  const updateVote = (proposalId: string, choice: Vote["choice"]) => {
    if (!user) return;

    updateVotes((prev) => {
      const existingIndex = prev.findIndex(
        (v) => v.proposalId === proposalId && v.guestId === user
      );
      if (existingIndex >= 0) {
        const newVotes = [...prev];
        newVotes[existingIndex] = { ...newVotes[existingIndex], choice };
        return newVotes;
      } else {
        return [...prev, { id: "", proposalId, guestId: user, choice }];
      }
    });
  };

  const hasVoted = (proposalId: string) => {
    return votes.some((v) => v.proposalId === proposalId && v.guestId === user);
  };

  const getVote = (proposalId: string) => {
    return votes.find((v) => v.proposalId === proposalId && v.guestId === user);
  };

  const proposalVoteEmoji = (proposalId: string) => {
    const choice = getVote(proposalId)?.choice;
    return choice ? voteChoiceToEmoji(choice) : "-";
  };

  const proposalVoteLabel = (proposalId: string) => {
    const choice = getVote(proposalId)?.choice;
    return choice ? voteChoiceToLabel(choice) : NO_VOTE_LABEL;
  };

  const contextValue: VotesContextType = {
    votes,
    addVote,
    removeVote,
    updateVote,
    hasVoted,
    getVote,
    proposalVoteEmoji,
    proposalVoteLabel,
  };

  return (
    <VotesContext.Provider value={contextValue}>
      {children}
    </VotesContext.Provider>
  );
}
