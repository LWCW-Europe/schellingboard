"use client";

import {
  cloneElement,
  ReactElement,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

import { useToast } from "@/app/(site)/toast";

// Distance from the trigger and from the viewport edges.
const MARGIN = 8;

const HINT_MS = 6000;

type AriaProps = {
  "aria-disabled"?: boolean;
  "aria-describedby"?: string;
};

export default function HoverTooltip(props: {
  // A single element, so the aria wiring below has something to attach to.
  children: ReactElement<AriaProps>;
  text: string;
  visible: boolean;
  // Set when a visible tooltip says why the wrapped control is unavailable
  // rather than just labelling it. The control is then marked aria-disabled and
  // activating it — by tap, click or keyboard — does nothing; where there is a
  // reason to give, it is also described by the tooltip and raises it as a
  // toast. Off by default, so a tooltip that merely labels a working control
  // keeps it working.
  unavailable?: boolean;
}) {
  const { children, text, visible, unavailable } = props;
  const showToast = useToast();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const hintId = useId();

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

  // Whether the control acts is decided by `visible` alone; `text` only says
  // why. The two are separate because an event outside every phase has no
  // reason to give (see inProposalPhase and friends) and would otherwise be
  // left with a control that is greyed out and yet works.
  const blocked = visible && !!unavailable;
  const reason = blocked ? text : "";

  // aria-disabled rather than `disabled`: a disabled control is dropped from
  // the tab order, so the one group of people who cannot see the greyed-out
  // styling would also never find the control the explanation is about.
  const control = blocked
    ? cloneElement(children, {
        "aria-disabled": true,
        "aria-describedby": reason
          ? [children.props["aria-describedby"], hintId]
              .filter(Boolean)
              .join(" ")
          : children.props["aria-describedby"],
      })
    : children;

  return (
    <div
      ref={triggerRef}
      className="relative inline-block group"
      onMouseEnter={position}
      // Capture phase: stopping the event here keeps it from ever reaching the
      // control's own handler, so each call site is spared a guard of its own.
      onClickCapture={
        blocked
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (reason) showToast(reason, { autoDismissMs: HINT_MS });
            }
          : undefined
      }
    >
      {control}
      {visible && (
        <div
          ref={tooltipRef}
          id={hintId}
          style={{ left: pos?.left ?? 0, top: pos?.top ?? 0 }}
          className={`fixed px-2 py-1 text-sm text-fg-inverse bg-surface-inverse rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 ${
            pos ? "" : "invisible"
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
