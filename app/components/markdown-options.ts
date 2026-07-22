import {
  BoldIcon,
  ChatBubbleBottomCenterTextIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
} from "@heroicons/react/16/solid";

type Icon = typeof BoldIcon;
type Key =
  RegExp | string | ((e: React.KeyboardEvent<HTMLTextAreaElement>) => boolean);
type Option = {
  icon: Icon;
  label: string;
  template: Template;
  key: Key;
};

/**
 * A split of the textarea's contents into the untouched text before the edit,
 * the text the edit replaces, and the untouched text after it.
 *
 * `before` and `after` must stay verbatim prefixes/suffixes of the textarea's
 * value — their lengths are what locates the edit. Trimming or padding them
 * makes the edit overwrite (or skip) characters the user never selected.
 */
type Split = {
  infixes: ReadonlyArray<string>;
  before: string;
  selectedText: string;
  after: string;
};

/** Tagged template: tpl`${before}**${selectedText}**${after}` */
function tpl(
  infixes: ReadonlyArray<string>,
  before: string,
  selectedText: string,
  after: string
): Split {
  return { infixes, before, selectedText, after };
}

type Template = (before: string, selectedText: string, after: string) => Split;

export type Edit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

/**
 * Apply `template` to `value` for the given selection, without touching a
 * textarea — the whole of the toolbar's behaviour is decided here.
 */
export function applyTemplate(
  template: Template,
  value: string,
  selectionStart: number,
  selectionEnd: number
): Edit {
  const selected = value.slice(selectionStart, selectionEnd);
  const split = template(
    value.slice(0, selectionStart),
    selected,
    value.slice(selectionEnd)
  );

  // The template's literal parts wrap the replaced text; its interpolated
  // before/after locate it in `value`.
  const [, prefix = "", postfix = ""] = split.infixes;
  const start = split.before.length;
  const end = value.length - split.after.length;
  const replacement = `${prefix}${split.selectedText}${postfix}`;

  const caret = start + prefix.length;
  return {
    value: value.slice(0, start) + replacement + value.slice(end),
    selectionStart: caret,
    // With a selection, keep the (re)wrapped text selected; without one, put
    // the caret between the markers that were just inserted.
    selectionEnd: selected ? caret + split.selectedText.length : caret,
  };
}

/** Apply `template` to a textarea, keeping React and the caret in sync. */
export function applyToTextarea(
  template: Template,
  textarea: HTMLTextAreaElement
) {
  const edit = applyTemplate(
    template,
    textarea.value,
    textarea.selectionStart,
    textarea.selectionEnd
  );

  // setRangeText (rather than assigning .value) keeps the browser's own undo
  // stack working; the input event is what React's onChange listens for.
  textarea.setRangeText(edit.value, 0, textarea.value.length, "preserve");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  // Restore focus and selection after React updates
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
  });
}

/** Widen the selection to the whole line(s) it touches. */
const selectLine =
  (template: Template): Template =>
  (before, selectedText, after) => {
    const beforeLines = before.split("\n");
    const lineStart = beforeLines.pop() ?? "";
    const afterLines = after.split("\n");
    const lineEnd = afterLines.shift() ?? "";
    return template(
      // Only re-add the separator that was actually split off, so that the
      // first and last line of the textarea keep their exact boundaries.
      beforeLines.length ? beforeLines.join("\n") + "\n" : "",
      lineStart + selectedText + lineEnd,
      afterLines.length ? "\n" + afterLines.join("\n") : ""
    );
  };

/**
 * Toggle a per-line marker ("- ", "1. ") over the selected lines: strip it
 * when every line already carries one, add it otherwise.
 */
const listMarker =
  (marker: RegExp, mark: (line: string, index: number) => string): Template =>
  (before, selectedText, after) => {
    const lines = selectedText.split("\n");
    const content = lines.filter((line) => line !== "");
    let newLines: string[];
    if (content.length > 0 && content.every((line) => marker.test(line))) {
      newLines = lines.map((line) => line.replace(marker, ""));
    } else {
      // Blank lines separate paragraphs, so they keep their role — except when
      // the selection is blank altogether, which is how a list is started on
      // an empty line.
      let index = 0;
      newLines = lines.map((line) =>
        line === "" && content.length > 0
          ? line
          : mark(line.replace(marker, ""), index++)
      );
    }
    return tpl`${before}${newLines.join("\n")}${after}`;
  };

const escape = [/[.*+?^${}()|[\]\\]/g, "\\$&"] as const;

/** Toggle: strip the template's markers when they're already there. */
const around =
  (template: Template): Template =>
  (before, selectedText, after) => {
    const split = template(before, selectedText, after);
    const [, prefix = "", postfix = ""] = split.infixes;

    // Markers aren't there yet - apply them
    if (!(
      (before.endsWith(prefix) || selectedText.startsWith(prefix)) &&
      (after.startsWith(postfix) || selectedText.endsWith(postfix))
    )) {
      return split;
    }

    // Markers are already there - undo them
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

export const isKey =
  (key: Key) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
    typeof key === "function"
      ? key(e)
      : typeof key === "string"
        ? e.key.toLowerCase() === key.toLowerCase()
        : key.test(e.key);

const ctrl = (k: Key) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
  (e.ctrlKey || e.metaKey) && isKey(k)(e);
const shift = (k: Key) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
  e.shiftKey && isKey(k)(e);

export const options: Option[] = [
  {
    icon: BoldIcon,
    label: "Bold (Ctrl+B)",
    template: around(
      (before, selectedText, after) => tpl`${before}**${selectedText}**${after}`
    ),
    key: ctrl("B"),
  },
  {
    icon: ItalicIcon,
    label: "Italic (Ctrl+I)",
    template: around(
      (before, selectedText, after) => tpl`${before}*${selectedText}*${after}`
    ),
    key: ctrl("I"),
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    label: "Quote (Ctrl+Shift+>)",
    template: selectLine(
      around(
        (before, selectedText, after) => tpl`${before}> ${selectedText}${after}`
      )
    ),
    // Ctrl + Q is a special shortcut
    key: ctrl(shift(">")),
  },
  {
    icon: NumberedListIcon,
    label: "Numbered list (Ctrl+1)",
    template: selectLine((before, selectedText, after) => {
      // Continue the numbering of the list this line is appended to. `before`
      // ends on the line break selectLine split off, hence the slice.
      const previousLine = before.slice(0, -1).split("\n").pop() ?? "";
      const lastNumber = Number(previousLine.match(/^(\d+)\.\s/)?.[1] ?? 0);
      return listMarker(
        /^\d+\.\s+/,
        (line, index) => `${index + 1 + lastNumber}. ${line}`
      )(before, selectedText, after);
    }),
    key: ctrl(/\d/),
  },
  {
    icon: ListBulletIcon,
    label: "Bullet list (Ctrl+-)",
    template: selectLine(listMarker(/^-\s+/, (line) => `- ${line}`)),
    key: ctrl("-"),
  },
  {
    icon: CodeBracketIcon,
    label: "Inline code (Ctrl+`)",
    template: around(
      (before, selectedText, after) => tpl`${before}\`${selectedText}\`${after}`
    ),
    key: ctrl("`"),
  },
  {
    icon: CodeBracketSquareIcon,
    label: "Code block (Ctrl+Shift+~)",
    template: selectLine(
      around(
        (before, selectedText, after) =>
          tpl`${before}\`\`\`\n${selectedText}\n\`\`\`${after}`
      )
    ),
    key: ctrl(shift("~")),
  },
  {
    icon: LinkIcon,
    label: "Insert link (Ctrl+L)",
    template: around(
      (before, selectedText, after) => tpl`${before}[](${selectedText})${after}`
    ),
    key: ctrl("L"),
  },
];
