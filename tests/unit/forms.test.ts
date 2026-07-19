import { describe, it, expect } from "vitest";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { setActionErrors } from "@/utils/forms";

type FormValues = { name: string; contacts: { value: string }[] };

/**
 * `setActionErrors` only ever talks to the form through `setError`, so recording
 * those calls captures everything it does.
 */
function formSpy() {
  const calls: [string, { message?: string }][] = [];
  const form = {
    setError: (name: string, error: { message?: string }) => {
      calls.push([name, error]);
    },
  } as unknown as UseFormReturn<FormValues>;
  return { form, calls };
}

/** Real zod issues, so the shapes match what a server action actually returns. */
function issuesFor(value: unknown): z.core.$ZodIssue[] {
  const schema = z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      contacts: z.array(
        z.object({ value: z.string().min(1, { message: "Value is required" }) })
      ),
    })
    .refine((v) => v.name !== "duplicate", { message: "That name is taken" });
  const result = schema.safeParse(value);
  if (result.success) throw new Error("expected the value to be rejected");
  return result.error.issues;
}

describe("setActionErrors", () => {
  it("shows a plain string error on the form as a whole", () => {
    const { form, calls } = formSpy();

    setActionErrors(form, "Unauthorized");

    expect(calls).toEqual([["root", { message: "Unauthorized" }]]);
  });

  it("shows each issue on the field it belongs to", () => {
    const { form, calls } = formSpy();

    setActionErrors(form, issuesFor({ name: "", contacts: [{ value: "" }] }));

    expect(calls).toEqual([
      ["name", { message: "Name is required" }],
      ["contacts.0.value", { message: "Value is required" }],
    ]);
  });

  it("shows a form-level issue on the form as a whole", () => {
    const { form, calls } = formSpy();

    // A form-level refine produces an issue with an empty path. Passing that
    // to setError("") would drop the message silently, so it has to land in
    // the form-wide slot instead.
    setActionErrors(form, issuesFor({ name: "duplicate", contacts: [] }));

    expect(calls).toEqual([["root", { message: "That name is taken" }]]);
  });
});
