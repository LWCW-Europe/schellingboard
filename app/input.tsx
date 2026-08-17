/* eslint-disable react/display-name */
import clsx from "clsx";
import { type ComponentPropsWithoutRef, Ref, forwardRef } from "react";

export const Input = forwardRef(
  (
    props: {
      error?: boolean;
      errorMessage?: string;
    } & ComponentPropsWithoutRef<"input">,
    ref: Ref<HTMLInputElement>
  ) => {
    const { error, errorMessage, className, ...rest } = props;
    return (
      <>
        <input
          ref={ref}
          className={clsx(
            "h-12 rounded-md border bg-surface-raised px-4 shadow-sm transition-colors invalid:border-danger invalid:text-danger-fg invalid:placeholder-danger-border focus:outline-none disabled:cursor-not-allowed disabled:border-line-subtle disabled:bg-surface-sunken disabled:text-fg-subtle",
            error
              ? "border-danger-border text-danger-fg placeholder-danger-border focus:border-danger focus:ring-danger" // matches invalid: styles
              : "border-line placeholder-fg-subtle focus:ring-2 focus:ring-brand-accent focus:outline-0 focus:border-transparent",
            className
          )}
          {...rest}
        />
        {error && errorMessage && (
          <span className="text-xs text-danger-fg">{errorMessage}</span>
        )}
      </>
    );
  }
);
