import "client-only";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { $ZodIssue } from "zod/v4/core";

/**
 * Sets form errors from an error returned from a server action.
 * The supported errors are either Zod issues or simple strings.
 * Simple strings are treated as root issues.
 * @param form the form to set errors on
 * @param errors the errors received from the server action
 */
export function consumeErrors<
  TFieldValues extends FieldValues = FieldValues,
  TContext = never,
  TTransformedValues = TFieldValues,
>(
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
  errors: z.core.$ZodIssue[] | string
): void;

export function consumeErrors(
  form: UseFormReturn,
  errors: $ZodIssue[] | string
) {
  if (typeof errors === "string") {
    form.setError("root", { message: errors });
  } else {
    for (const error of errors) {
      form.setError(error.path.join("."), { message: error.message });
    }
  }
}
