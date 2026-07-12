import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Nodes, Parent } from "mdast";

// unified + remark-parse (not the remark package): react-markdown already
// pulls both in for its own parsing, so this reuses that pipeline instead of
// adding a separate one.
const parser = unified().use(remarkParse).use(remarkGfm);

// Own mdast walker instead of strip-markdown + remark-stringify: stringify
// backslash-escapes literal markdown characters ("2 * 3" → "2 \* 3"), which
// is unacceptable in plain-text previews.
function nodeToText(node: Nodes): string {
  switch (node.type) {
    case "text":
    case "inlineCode":
    case "code":
      return node.value;
    case "break":
      return "\n";
    case "image":
      return node.alt ?? "";
    case "list":
    case "blockquote":
      return childrenToText(node, "\n");
    // Raw HTML tags in user content aren't meaningful plain text.
    case "html":
      return "";
    default:
      return "children" in node ? childrenToText(node, "") : "";
  }
}

function childrenToText(node: Parent, separator: string): string {
  return node.children
    .map(nodeToText)
    .filter((t) => t !== "")
    .join(separator);
}

/**
 * Reduce markdown to plain text for truncated previews (board cards, table
 * cells, title attributes). Block-level nodes become separate lines.
 */
export function stripMarkdown(markdown: string | null | undefined): string {
  const tree = parser.parse(markdown ?? "");
  return childrenToText(tree, "\n").trim();
}
