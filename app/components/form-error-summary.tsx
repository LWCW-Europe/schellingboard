"use client";

import {
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormReturn,
  useFormState,
} from "react-hook-form";

type ErrorEntry = { name: string; message: string };

const NON_FIELD_KEYS = new Set(["ref", "types"]);

/**
 * Flattens react-hook-form's nested error object into one entry per message,
 * keyed by the field path (`contacts.0.label`) so it can be focused later.
 */
function errorEntries(errors: FieldErrors, path: string[] = []): ErrorEntry[] {
  if (!errors || typeof errors !== "object") return [];
  const message = (errors as { message?: unknown }).message;
  if (typeof message === "string") {
    return message ? [{ name: path.join("."), message }] : [];
  }
  return Object.entries(errors).flatMap(([key, value]) =>
    NON_FIELD_KEYS.has(key)
      ? []
      : errorEntries(value as FieldErrors, [...path, key])
  );
}

/** Errors on the form or a whole list, which no single input can be sent to. */
function isFormLevel(name: string) {
  return name === "root" || name.endsWith(".root");
}

/** "to fix" only where the person can act: a failed save isn't their doing. */
function heading(entries: ErrorEntry[]) {
  const count =
    entries.length === 1 ? "is a problem" : `are ${entries.length} problems`;
  return entries.some((e) => !isFormLevel(e.name))
    ? `There ${count} to fix:`
    : `There ${count}:`;
}

/**
 * Every outstanding error, repeated next to the submit button. Long forms
 * scroll the offending field out of sight — and disclosures can hide it
 * altogether — so without this the only sign that submitting failed is that
 * the page didn't move.
 */
export function FormErrorSummary<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
>({
  form,
  onJump,
}: {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  /** Called before focusing, to reveal a field that is currently collapsed. */
  onJump?: (name: string) => void;
}) {
  const { errors } = useFormState({ control: form.control });
  const entries = errorEntries(errors);
  if (entries.length === 0) return null;

  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
    >
      <p className="text-sm font-medium">{heading(entries)}</p>
      <ul className="mt-1 ps-5 list-disc space-y-1 text-sm">
        {entries.map(({ name, message }) => (
          <li key={name}>
            {isFormLevel(name) ? (
              message
            ) : (
              <button
                type="button"
                className="text-start underline hover:text-red-900"
                // Focusing scrolls the field into view; fields react-hook-form
                // holds no ref for (custom inputs) simply don't move.
                // setFocus defers by a tick, so onJump's re-render lands first.
                onClick={() => {
                  onJump?.(name);
                  form.setFocus(name as FieldPath<TFieldValues>);
                }}
              >
                {message}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
