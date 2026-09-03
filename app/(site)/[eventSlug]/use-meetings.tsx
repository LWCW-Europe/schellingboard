"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { MeetingView } from "@/utils/meeting-views";
import { EventContext, UserContext } from "../context";

type MyMeetings = {
  /** Null while the answer is still on its way, so "none" and "not yet" differ. */
  meetings: MeetingView[] | null;
  reload: () => void;
};

// Shared so a guest with nothing to fetch gets a stable value rather than a
// new array on every render.
const NONE: MeetingView[] = [];

const MeetingsContext = createContext<MyMeetings>({
  meetings: null,
  reload: () => {},
});

/**
 * The viewer's own 1-on-1s at the event in context, fetched once for whoever
 * needs them — the schedule's column and the modal it opens, which must agree
 * about a meeting the modal has just answered.
 *
 * Client-side rather than part of the page's server render: the schedule is
 * shared by everyone looking at it, and these are private to one guest
 * (issue #392, section 2.6).
 */
export function MeetingsProvider({ children }: { children: ReactNode }) {
  const { event } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const [loaded, setLoaded] = useState<{
    key: string;
    meetings: MeetingView[];
  } | null>(null);
  // Bumped by reload() to re-run the fetch below.
  const [reloads, setReloads] = useState(0);

  const eventId = event?.id;
  // A kiosk with nobody picked, or an event without meetings: there is nothing
  // this guest could have.
  const key =
    eventId && event?.meetingsEnabled && user ? `${eventId}:${user}` : null;

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    void fetch(`/api/meetings?event=${eventId}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<MeetingView[]>) : []))
      .then((meetings) => setLoaded({ key, meetings }))
      // Aborted on unmount or on switching names, and the browser kills it
      // when the page goes; either way there is nobody left to tell.
      .catch(() => undefined);
    return () => controller.abort();
  }, [eventId, key, reloads]);

  const reload = useCallback(() => setReloads((n) => n + 1), []);

  // Keyed rather than cleared in an effect, so switching names never shows
  // the previous guest's meetings while the new answer is in flight. With
  // nothing to fetch the answer is "none", not "not yet".
  const meetings =
    key === null ? NONE : loaded?.key === key ? loaded.meetings : null;

  return (
    <MeetingsContext.Provider value={{ meetings, reload }}>
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMyMeetings(): MyMeetings {
  return useContext(MeetingsContext);
}
