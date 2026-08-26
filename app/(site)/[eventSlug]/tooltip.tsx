"use client";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  Placement,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Transition } from "@headlessui/react";
import { ReactNode, useRef, useState } from "react";

// See https://floating-ui.com/docs/react-dom

export function Tooltip(props: {
  content?: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  placement?: Placement;
  noTap?: boolean;
  noFade?: boolean;
  hasSafePolygon?: boolean;
  suppressHydrationWarning?: boolean;
  // For content worth seeking out rather than a hover-only nicety: the trigger
  // becomes a real button, so it can be tapped or reached by keyboard, and the
  // panel closes again on Escape or a press outside. The wrapper turns inline
  // and the panel moves to a portal, so the trigger may sit inside a heading.
  toggleable?: boolean;
}) {
  const {
    content,
    children,
    className,
    triggerClassName,
    noTap,
    noFade,
    hasSafePolygon,
    suppressHydrationWarning,
    toggleable,
  } = props;

  const arrowRef = useRef(null);

  const [open, setOpen] = useState(false);

  const { x, y, refs, strategy, middlewareData, context, placement } =
    useFloating({
      strategy: "fixed",
      open: open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      placement: props.placement ?? "top",
      middleware: [
        offset(8),
        flip(),
        shift({ padding: 4 }),
        // Floating UI's arrow() middleware requires the ref object itself
        // in its configuration; it reads ref.current internally.
        // eslint-disable-next-line react-hooks/refs
        arrow({ element: arrowRef }),
      ],
    });

  const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      // A tap on a toggleable trigger has to go through useClick alone. A
      // touch also fires a synthetic hover, and a panel opened by that hover
      // is not one useClick will close, so the next tap does nothing.
      mouseOnly: noTap || toggleable,
      handleClose: hasSafePolygon ? safePolygon({ buffer: -0.5 }) : null,
    }),
    useFocus(context, { enabled: !!toggleable }),
    useClick(context, { enabled: !!toggleable }),
    useDismiss(context, { enabled: !!toggleable }),
    useRole(context, { role: "tooltip" }),
  ]);
  // which side of tooltip arrow is on. like: if tooltip is top-left, arrow is on bottom of tooltip
  const arrowSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]] as string;

  const Wrapper = toggleable ? "span" : "div";
  const Trigger = toggleable ? "button" : "span";

  const panel = (
    <Transition
      show={open}
      enter="transition ease-out duration-50"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={noFade ? "" : "transition ease-in duration-150"}
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="div"
      // refs.setFloating is a callback ref from useFloating; assigning it
      // here is the documented Floating UI pattern.
      ref={(node) => {
        refs.setFloating(node);
      }}
      role="tooltip"
      style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
      // Never wider than the screen it has to fit on: a fixed width leaves
      // shift() nothing to work with and the text runs off a phone's edge.
      className="z-40 w-[min(30rem,calc(100vw-1rem))] whitespace-normal rounded bg-surface-raised px-2 py-1 border shadow-md border-line-subtle"
      suppressHydrationWarning={suppressHydrationWarning}
      {...getFloatingProps()}
    >
      {content}
      <div
        ref={arrowRef}
        className="absolute h-2 w-2 rotate-45 bg-surface-raised"
        style={{
          top: arrowY != null ? arrowY : "",
          left: arrowX != null ? arrowX : "",
          right: "",
          bottom: "",
          [arrowSide]: "-4px",
        }}
      />
    </Transition>
  );

  return content ? (
    <Wrapper className={className}>
      <Trigger
        type={toggleable ? "button" : undefined}
        className={triggerClassName}
        suppressHydrationWarning={suppressHydrationWarning}
        ref={(node: HTMLElement | null) => {
          refs.setReference(node);
        }}
        {...getReferenceProps()}
      >
        {children}
      </Trigger>
      {toggleable ? <FloatingPortal>{panel}</FloatingPortal> : panel}
    </Wrapper>
  ) : (
    <Wrapper className={className}>{children}</Wrapper>
  );
}
