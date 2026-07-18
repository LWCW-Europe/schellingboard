import { z } from "zod";
import { CONTACT_TYPES, type ContactType } from "@/db/repositories/interfaces";

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
  signal: "Signal",
  telegram: "Telegram",
  discord: "Discord",
  website: "Website",
  other: "Other",
};

// Matches EmailSettings in db/repositories/interfaces.ts.
export const emailSettingsSchema = z.object({
  rsvpChange: z.boolean(),
  hostChange: z.boolean(),
  cohostAdd: z.boolean(),
});

// Length caps are sanity limits only a malicious user would hit; entry caps
// (10 languages/contacts) keep profiles and the edit form scannable.
export const MAX_LANGUAGES = 10;
export const MAX_CONTACTS = 10;

const promptEntrySchema = z.object({
  prompt: z.string().trim().min(1).max(100),
  answer: z.string().trim().max(500, {
    message: "Keep prompt answers under 500 characters",
  }),
});

const contactEntrySchema = z
  .object({
    type: z.enum(CONTACT_TYPES),
    label: z
      .string()
      .trim()
      .max(40, { message: "Keep contact labels under 40 characters" })
      .optional(),
    value: z.string().trim().max(200, {
      message: "Keep contact entries under 200 characters",
    }),
  })
  .refine((c) => c.type !== "other" || c.value === "" || !!c.label, {
    message: "Give this contact a label",
    path: ["label"],
  });

// The edit form pre-seeds rows the attendee may leave blank, so blank
// entries are dropped rather than rejected; an empty list is stored as null.
function dropBlank<T>(isBlank: (entry: T) => boolean) {
  return (entries: T[] | null): T[] | null => {
    const filled = (entries ?? []).filter((entry) => !isBlank(entry));
    return filled.length > 0 ? filled : null;
  };
}

export const profileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  aboutMe: z.string().trim().nullable().optional().default(null),
  avatar: z.instanceof(Blob).nullable().optional(),
  pronouns: z.string().trim().nullable().optional().default(null),
  basedIn: z
    .string()
    .trim()
    .max(100, { message: "Keep this under 100 characters" })
    .nullable()
    .optional()
    .default(null)
    .transform((value) => value || null),
  prompts: z
    .array(promptEntrySchema)
    .nullable()
    .optional()
    .default(null)
    .transform(dropBlank((p) => p.answer === ""))
    // The UI never repeats a prompt, but the profile page keys sections by
    // prompt text, so a crafted payload must not produce duplicates.
    .transform((ps) => {
      if (!ps) return ps;
      const seen = new Set<string>();
      return ps.filter((p) => {
        if (seen.has(p.prompt)) return false;
        seen.add(p.prompt);
        return true;
      });
    })
    // The UI can't produce more than the prompt pool; this only stops abuse.
    .refine((ps) => (ps?.length ?? 0) <= 100, {
      message: "At most 100 prompts",
    }),
  languages: z
    .array(
      z.string().trim().max(50, {
        message: "Keep language names under 50 characters",
      })
    )
    .nullable()
    .optional()
    .default(null)
    .transform(dropBlank((l) => l === ""))
    .refine((ls) => (ls?.length ?? 0) <= MAX_LANGUAGES, {
      message: `At most ${MAX_LANGUAGES} languages`,
    }),
  contacts: z
    .array(contactEntrySchema)
    .nullable()
    .optional()
    .default(null)
    .transform(dropBlank((c) => c.value === ""))
    // The form keeps a label in state even after the type is switched away
    // from "other"; only "other" contacts actually use one.
    .transform(
      (cs) =>
        cs &&
        cs.map((c) =>
          c.type === "other" ? c : { type: c.type, value: c.value }
        )
    )
    .refine((cs) => (cs?.length ?? 0) <= MAX_CONTACTS, {
      message: `At most ${MAX_CONTACTS} contacts`,
    }),
  emailSettings: emailSettingsSchema,
});
