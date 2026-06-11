"use client";

import { useEffect, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import type { Rsvp } from "@/db/repositories/interfaces";
import { EventContext } from "../context";
import { ViewSession } from "./view-session/view-session";
import { dismissViewSession } from "./modal-nav";

export function SessionModal({
  sessionId,
  eventSlug,
}: {
  sessionId: string;
  eventSlug: string;
}) {
  const router = useRouter();
  const { event, localSessions, guests } = useContext(EventContext);
  const [loaded, setLoaded] = useState<{ id: string; rsvps: Rsvp[] } | null>(
    null
  );

  const session = localSessions.find((s) => s.id === sessionId);
  const rsvps = loaded?.id === sessionId ? loaded.rsvps : null;

  const onDismiss = useCallback(() => {
    dismissViewSession(router);
  }, [router]);

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = "hidden";
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onDismiss]);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/rsvps?session=${sessionId}`)
      .then((res) => (res.ok ? (res.json() as Promise<Rsvp[]>) : []))
      .then((data) => {
        if (!cancelled) setLoaded({ id: sessionId, rsvps: data });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ id: sessionId, rsvps: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Session details"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onDismiss} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {!session ? (
          <div className="p-6">Session not found.</div>
        ) : rsvps === null ? (
          <div className="p-6">Loading...</div>
        ) : (
          <ViewSession
            session={session}
            guests={guests}
            rsvps={rsvps}
            eventSlug={eventSlug}
            event={event}
            isInModal={true}
            onCloseModal={onDismiss}
          />
        )}
      </div>
    </div>
  );
}
