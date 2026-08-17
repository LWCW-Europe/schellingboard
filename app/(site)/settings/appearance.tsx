import { ThemeSelect } from "@/app/theme-select";

/**
 * A mirror of the footer control, for people who look for it where the other
 * settings are. It is stored per device rather than on the guest record: it
 * follows the screen you are reading on, and switching guests is
 * unauthenticated, so anyone could otherwise change someone else's.
 */
export function AppearanceSettings() {
  return (
    <section
      aria-labelledby="appearance-heading"
      className="max-w-2xl mx-auto w-full px-4 sm:px-0 flex flex-col gap-2"
    >
      <h2 id="appearance-heading" className="text-lg font-semibold">
        Appearance (this device)
      </h2>
      <p className="text-sm text-fg-subtle">
        Following the system means the site is dark whenever your phone or
        laptop is.
      </p>
      {/* Wrapped so the inline control keeps its own width in this column. */}
      <div>
        <ThemeSelect labelled />
      </div>
    </section>
  );
}
