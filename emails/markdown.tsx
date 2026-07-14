import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { MARKDOWN_DISALLOWED_ELEMENTS } from "@/utils/markdown";

// User-provided markdown in email bodies. The same parser and safety
// settings as the site's Markdown component (raw HTML never parsed, unsafe
// URL schemes stripped, images disallowed), but unlike the site version it
// keeps plain HTML tags: mail clients apply their default styles, and CSS
// classes would do nothing without the site's stylesheet.
//
// Headings are the exception, as on the site: they render as bold paragraphs
// so user content can't out-shout the email's own headings.
function Heading({ children }: { children?: ReactNode }) {
  return <p style={{ fontWeight: "bold" }}>{children}</p>;
}

export function EmailMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      disallowedElements={MARKDOWN_DISALLOWED_ELEMENTS}
      unwrapDisallowed
      components={{
        h1: Heading,
        h2: Heading,
        h3: Heading,
        h4: Heading,
        h5: Heading,
        h6: Heading,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
