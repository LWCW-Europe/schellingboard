import {
  BoldIcon,
  ChatBubbleBottomCenterTextIcon,
  CodeBracketSquareIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
} from "@heroicons/react/16/solid";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

type Icon = typeof BoldIcon;
type Option = {
  icon: Icon;
  label: string;
  onClick: (textarea: HTMLTextAreaElement) => void;
};

function tpl(
  infixes: ReadonlyArray<string>,
  before: string,
  selectedText: string,
  after: string
) {
  return {
    infixes,
    before: before.trim() ? before : "",
    selectedText,
    after: after.trim() ? after : "",
  };
}

type Template = (
  before: string,
  selectedText: string,
  after: string
) => ReturnType<typeof tpl>;

const insert = (template: Template) => (textarea: HTMLTextAreaElement) => {
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  const selected = value.slice(start, end);
  const tpl = template(value.slice(0, start), selected, value.slice(end));

  // calculate the size of the preamble to figure out the range of the edit and selection
  const [, prefix, postfix] = tpl.infixes;

  const actualStart = tpl.before.length;
  const actualEnd = value.length - tpl.after.length;
  const replacement = `${prefix}${tpl.selectedText}${postfix}`;

  // reconstruct the template text as written
  textarea.setRangeText(replacement, actualStart, actualEnd, "preserve");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  // Restore focus and selection after React updates
  requestAnimationFrame(() => {
    textarea.focus();

    if (selected.length > 0) {
      // Keep the wrapped text selected
      textarea.setSelectionRange(
        actualStart + prefix.length,
        actualStart + prefix.length + tpl.selectedText.length
      );
    } else {
      // Place the caret between the prefix and postfix
      textarea.setSelectionRange(
        actualStart + prefix.length,
        actualStart + prefix.length
      );
    }
  });
};

const selectLine =
  (template: Template): Template =>
  (before, selectedText, after) => {
    const beforeLines = before.split(/\n/g);
    const beforeLastLine = beforeLines.pop() ?? "";
    const afterLines = after.split(/\n/g);
    const afterLastLine = afterLines.shift() ?? "";
    return template(
      beforeLines.join("\n") + "\n",
      beforeLastLine + selectedText + afterLastLine,
      "\n" + afterLines.join("\n")
    );
  };

const escape = [/[.*+?^${}()|[\]\\]/g, "\\$&"] as const;

const around =
  (template: Template): Template =>
  (before, selectedText, after) => {
    const tplResult = template(before, selectedText, after);

    const [, prefix, postfix] = template(before, selectedText, after).infixes;

    // Changes aren't in the original text - apply changes
    if (!(
      (before.endsWith(prefix) || selectedText.startsWith(prefix)) &&
      (after.startsWith(postfix) || selectedText.endsWith(postfix))
    )) {
      return tplResult;
    }

    // Changes are in the text - undo them
    const escaped = {
      prefix: prefix.replaceAll(...escape),
      postfix: postfix.replaceAll(...escape),
    };
    const newBefore = before.replace(new RegExp(`${escaped.prefix}$`), "");
    const newSelectedText = selectedText
      .replace(new RegExp(`^${escaped.prefix}`), "")
      .replace(new RegExp(`${escaped.postfix}$`), "");
    const newAfter = after.replace(new RegExp(`^${escaped.postfix}`), "");
    return tpl`${newBefore}${newSelectedText}${newAfter}`;
  };

export const options: Option[] = [
  {
    icon: BoldIcon,
    label: "Bold (Ctrl+B)",
    onClick: insert(
      around(
        (before, selectedText, after) =>
          tpl`${before}**${selectedText}**${after}`
      )
    ),
  },
  {
    icon: ItalicIcon,
    label: "Italic (Ctrl+I)",
    onClick: insert(
      around(
        (before, selectedText, after) => tpl`${before}*${selectedText}*${after}`
      )
    ),
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    label: "Quote (Ctrl+Q)",
    onClick: insert(
      selectLine(
        around(
          (before, selectedText, after) =>
            tpl`${before}> ${selectedText}${after}`
        )
      )
    ),
  },
  {
    icon: NumberedListIcon,
    label: "Numbered list (Ctrl+1)",
    onClick: insert(
      selectLine((before, selectedText, after) => {
        const lastNumberStr = before.match(/(\d+)\.[^\n]*\n*$/)?.[1];
        const lastNumber = lastNumberStr ? parseInt(lastNumberStr) : 0;
        const selectedTextLines = selectedText.split(/\n/g);
        const newSelectedText = selectedTextLines.some((line) =>
          line.match(/^\D/)
        )
          ? selectedTextLines
              .map((line, i) => `${i + 1 + lastNumber}. ${line}`)
              .join("\n")
          : selectedTextLines
              .map((line) => line.replace(/^\d+\.\s*/, ""))
              .join("\n");
        return tpl`${before}${newSelectedText}${after}`;
      })
    ),
  },
  {
    icon: ListBulletIcon,
    label: "Bullet list (Ctrl+-)",
    onClick: insert(
      selectLine((before, selectedText, after) => {
        const selectedTextLines = selectedText.split(/\n/g);
        if (!selectedTextLines[0]) selectedTextLines.shift();
        const newSelectedText = selectedTextLines.some((line) =>
          line.match(/^[^-]/)
        )
          ? selectedTextLines.map((line) => `- ${line}`).join("\n")
          : selectedTextLines
              .map((line) => line.replace(/^-\s*/, ""))
              .join("\n");
        return tpl`${before}${newSelectedText}${after}`;
      })
    ),
  },
  {
    icon: CodeBracketIcon,
    label: "Inline code",
    onClick: insert(
      around(
        (before, selectedText, after) =>
          tpl`${before}\`${selectedText}\`${after}`
      )
    ),
  },
  {
    icon: CodeBracketSquareIcon,
    label: "Code block",
    onClick: insert(
      selectLine(
        around(
          (before, selectedText, after) =>
            tpl`${before}\`\`\`\n${selectedText}\n\`\`\`${after}`
        )
      )
    ),
  },
  {
    icon: LinkIcon,
    label: "Insert link",
    onClick: insert(
      around((before, selectedText, after) => {
        return tpl`${before}[](${selectedText})${after}`;
      })
    ),
  },
];
