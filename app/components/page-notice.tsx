import { BackLink } from "./back-link";

/** A page standing in for content the visitor can't have, saying why. */
export function PageNotice({
  backHref,
  backLabel,
  children,
}: {
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <BackLink href={backHref}>{backLabel}</BackLink>
      <p className="text-fg-muted">{children}</p>
    </div>
  );
}
