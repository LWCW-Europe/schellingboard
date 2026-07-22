"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  FlagIcon,
  InformationCircleIcon,
  LinkIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import Link from "next/link";
import { Modal } from "@/app/(site)/modals";
import { Markdown } from "@/app/(site)/markdown";
import { hasPhases } from "@/app/(site)/utils/events";
import type { Event } from "@/db/repositories/interfaces";

// Slim single-row (wrapping on mobile) header for the schedule views. The view
// toggle (Grid/Text/RSVP'd) sits next to two distinct navigation links —
// "Event details" (opens a popup with dates/description) and "Proposals". The
// event name is intentionally omitted: the site header already shows it.
export function ScheduleToolbar(props: { event: Event }) {
  const { event } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    // The outer div spans the (possibly horizontally overflowing) grid width;
    // the inner one sticks the controls to the visible area — same pattern as
    // the fold bars and the inline footer.
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="sticky left-0 flex max-w-[100dvw] flex-wrap items-center gap-x-4 gap-y-1 px-2 py-1.5 sm:px-3">
        <SelectView />
        {/* Divider keeps the segmented view toggle visually distinct from the
            navigation links that follow. */}
        <span className="hidden h-5 w-px bg-gray-200 sm:block" aria-hidden />
        <div className="flex items-center gap-x-4 gap-y-1">
          <button
            onClick={() => setDetailsOpen(true)}
            className="flex items-center gap-1 rounded-md py-1.5 px-1 text-xs sm:text-sm text-gray-500 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <InformationCircleIcon className="h-4 w-4 stroke-2" />
            Event details
          </button>
          {hasPhases(event) && (
            <Link
              href={`/${event.slug}/proposals`}
              className="flex items-center gap-1 rounded-md py-1.5 px-1 text-xs sm:text-sm text-gray-500 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <ClipboardDocumentListIcon className="h-4 w-4 stroke-2" />
              Proposals
            </Link>
          )}
        </div>
      </div>
      <Modal open={detailsOpen} setOpen={setDetailsOpen}>
        <EventDetails event={event} />
      </Modal>
    </div>
  );
}

// Dates, website and description for the event, shown in the "Event details"
// popup opened from the toolbar.
function EventDetails(props: { event: Event }) {
  const { event } = props;
  const multipleDays = event.start.getTime() !== event.end.getTime();
  return (
    <div className="max-h-[70dvh] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900">{event.name}</h2>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-gray-500">
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 stroke-2" />
          <span>
            {DateTime.fromJSDate(event.start)
              .setZone(event.timezone)
              .toFormat("LLL d")}
            {multipleDays && (
              <>
                {" - "}
                {DateTime.fromJSDate(event.end)
                  .setZone(event.timezone)
                  .toFormat("LLL d")}
              </>
            )}
            {" · "}
            {event.timezone}
          </span>
        </span>
        {event.website && (
          <a
            className="flex items-center gap-1 hover:underline"
            href={event.website}
          >
            <LinkIcon className="h-4 w-4 stroke-2" />
            <span>{event.website}</span>
          </a>
        )}
      </div>
      <div className="mt-3 text-gray-900">
        <Markdown>{event.description}</Markdown>
      </div>
    </div>
  );
}

function SelectView() {
  const searchParams = useSearchParams();
  const [view, setView] = useState(searchParams.get("view") ?? "grid");
  const urlSearchParams = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const VIEWS = [
    {
      name: "grid",
      label: "Grid",
      icon: TableCellsIcon,
    },
    {
      name: "text",
      label: "Text",
      icon: DocumentTextIcon,
    },
    {
      name: "rsvp",
      label: "RSVP'd",
      icon: FlagIcon,
    },
  ];
  return (
    <div className="flex items-center gap-2">
      {VIEWS.map((v) => (
        <button
          key={v.name}
          className={clsx(
            "flex gap-1 items-center rounded-md text-xs sm:text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400",
            view === v.name
              ? "bg-rose-400 text-white"
              : "text-gray-400 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
          )}
          onClick={() => {
            if (view === v.name) return;
            setView(v.name);
            urlSearchParams.set("view", v.name);
            router.replace(`${pathname}?${urlSearchParams.toString()}`);
          }}
        >
          <v.icon className="h-4 w-4 stroke-2" />
          {v.label}
        </button>
      ))}
    </div>
  );
}
