import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { MARKDOWN_DISALLOWED_ELEMENTS } from "@/utils/markdown";

// User-provided content: raw HTML is never parsed (react-markdown default)
// and unsafe URL schemes like javascript: are stripped by the default URL
// transform.

// Headings render as bold paragraphs sized relative to the surrounding text
// (em units), so user content can never out-shout the page's own headings,
// and repeated h1s in descriptions don't pollute the document outline.
const heading = (weight: string, size: string) =>
  function Heading({ children }: { children?: React.ReactNode }) {
    return (
      <p className={`${weight} ${size} mt-3 mb-1 first:mt-0`}>{children}</p>
    );
  };

const blockComponents: Components = {
  h1: heading("font-bold", "text-[1.1em]"),
  h2: heading("font-bold", "text-[1.05em]"),
  h3: heading("font-semibold", "text-[1em]"),
  h4: heading("font-semibold", "text-[1em]"),
  h5: heading("font-semibold", "text-[1em]"),
  h6: heading("font-semibold", "text-[1em]"),
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      // mailto:/tel: hand off to another app; a new tab would just be left
      // behind blank.
      target={/^https?:/i.test(href ?? "") ? "_blank" : undefined}
      rel="noopener noreferrer nofollow"
      className="text-rose-500 underline hover:text-rose-600"
    >
      {
        children ||
          href /* Supports links without names, like [](website.com) */
      }
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 my-2 first:mt-0 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 my-2 first:mt-0 last:mb-0">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-3 text-gray-600 my-2">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 rounded px-1 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-100 rounded p-2 my-2 overflow-x-auto">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-3 border-gray-200" />,
};

// Fields written in a single-line input and shown inside a line of text (a
// contact row, a prompt answer): nothing block-level may come out of them, so
// every block element is unwrapped to its text and paragraphs disappear.
const INLINE_DISALLOWED_ELEMENTS = [
  ...MARKDOWN_DISALLOWED_ELEMENTS,
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "hr",
];

// Spread rather than picking the inline overrides by hand, so a styling change
// to a link or to inline code can't reach one renderer and not the other. The
// block entries are dead weight: their elements never survive.
const inlineComponents: Components = {
  ...blockComponents,
  p: ({ children }) => <>{children}</>,
};

export function MarkdownHint() {
  return <p className="text-xs text-gray-500">Markdown supported</p>;
}

function MarkdownRoot({
  children,
  components,
  disallowedElements,
}: {
  children: string | null | undefined;
  components: Components;
  disallowedElements: string[];
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      disallowedElements={disallowedElements}
      unwrapDisallowed
      components={components}
    >
      {children ?? ""}
    </ReactMarkdown>
  );
}

export function Markdown({
  children,
}: {
  children: string | null | undefined;
}) {
  return (
    <MarkdownRoot
      components={blockComponents}
      disallowedElements={MARKDOWN_DISALLOWED_ELEMENTS}
    >
      {children}
    </MarkdownRoot>
  );
}

export function InlineMarkdown({
  children,
}: {
  children: string | null | undefined;
}) {
  return (
    <MarkdownRoot
      components={inlineComponents}
      disallowedElements={INLINE_DISALLOWED_ELEMENTS}
    >
      {children}
    </MarkdownRoot>
  );
}
