import Link from "next/link";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      // py/-my: a 14px line is a 20px tap target, under the 24px minimum a
      // thumb needs; the negative margin keeps the extra height from pushing
      // the content below it down.
      className="inline-block py-1 -my-1 text-sm text-fg-subtle hover:text-fg-muted"
      href={href}
    >
      ← {children}
    </Link>
  );
}
