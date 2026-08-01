"use client";

import { ReactNode, useCallback, useRef, useState } from "react";

// Distance from the trigger and from the viewport edges.
const MARGIN = 8;

export default function HoverTooltip(props: {
  children: ReactNode;
  text: string;
  visible: boolean;
}) {
  const { children, text, visible } = props;
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
