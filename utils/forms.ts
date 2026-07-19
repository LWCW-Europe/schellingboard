import "client-only";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";

/**
 * Shows the error a server action returned on the form it came from: a plain
 * string on the form as a whole, a list of Zod issues on the fields they name.
 * @param form the form to set errors on
 * @param error the error received from the server action
 */
export function setActionErrors<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
>(
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
  error: z.core.$ZodIssue[] | string
) {
  if (typeof error === "string") {
    form.setError("root", { message: error });
    return;
  }
  for (const issue of error) {
    // An issue's path is the name react-hook-form knows the field by; only a
    // cast can say so, since joining the path segments yields a plain string.
    // A form-level issue has an empty path, and setError("") would drop the
    // message silently, so fall back to the form-wide slot.
    const path = (issue.path.join(".") || "root") as FieldPath<TFieldValues>;
    form.setError(path, { message: issue.message });
  }
}
