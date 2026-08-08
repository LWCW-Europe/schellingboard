"use client";

import { ReactNode, useCallback, useRef, useState } from "react";

import { useToast } from "@/app/(site)/toast";

// Distance from the trigger and from the viewport edges.
const MARGIN = 8;

const HINT_MS = 6000;

export default function HoverTooltip(props: {
  children: ReactNode;
  text: string;
  visible: boolean;
  // Set when `text` says why the wrapped control is unavailable: a phone has no
  // hover, so a tap surfaces the same text as a toast instead. Off by default —
  // the overlay that catches the tap would swallow clicks on a control that is
  // merely being labelled.
  toastOnTap?: boolean;
}) {
  const { children, text, visible, toastOnTap } = props;
  const showToast = useToast();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // The tooltip is usually wider than what it describes, so an absolutely
  // positioned one gets clipped by scrollable ancestors (e.g. the proposal
  // modal). Position it fixed instead, measured on hover, and keep it inside
  // the viewport.
  const position = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;
    const rect = trigger.getBoundingClientRect();
    const centered = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
    const maxLeft = window.innerWidth - tooltip.offsetWidth - MARGIN;
    setPos({
      left: Math.round(Math.max(MARGIN, Math.min(centered, maxLeft))),
      top: Math.round(rect.top - tooltip.offsetHeight - MARGIN),
    });
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative inline-block group"
      onMouseEnter={position}
    >
      {children}
      {/* An inactive event has no reason to state (see inProposalPhase and
          friends), and a toast with nothing in it explains nothing. */}
      {visible && toastOnTap && text !== "" && (
        // A disabled control dispatches no events of its own, so the tap is
        // caught above it. A button rather than a plain span: iOS Safari only
        // raises click on elements it considers interactive. Hidden from
        // assistive tech and from the tab order — it stands in for hovering,
        // and the control it covers is not reachable by keyboard either.
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 z-10 cursor-not-allowed appearance-none bg-transparent"
          onClick={(e) => {
            // The control often sits inside a clickable row, card or link.
            e.stopPropagation();
            showToast(text, { autoDismissMs: HINT_MS });
          }}
        />
      )}
      {visible && (
        <div
          ref={tooltipRef}
          style={{ left: pos?.left ?? 0, top: pos?.top ?? 0 }}
          className={`fixed px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 ${
            pos ? "" : "invisible"
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
