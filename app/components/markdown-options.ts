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
type Key = string | ((e: React.KeyboardEvent<HTMLTextAreaElement>) => boolean);
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
  typeOver?: boolean;
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

/**
 * Select the text the template wrote even though the user selected none: a
 * placeholder like the "url" of a fresh link is there to be typed over, and
 * hunting for it by hand is the whole cost it was meant to save.
 */
const typeOver = (split: Split): Split => ({ ...split, typeOver: true });

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
    selectionEnd:
      selected || split.typeOver ? caret + split.selectedText.length : caret,
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

/** How many times `char` repeats at the start (or end) of `text`. */
function runLength(text: string, char: string, edge: "start" | "end") {
  let n = 0;
  while (
    n < text.length &&
    text[edge === "start" ? n : text.length - 1 - n] === char
  ) {
    n++;
  }
  return n;
}

/**
 * Whether `text` carries `marker` at `edge`.
 *
 * A marker of one repeated character ("*", "**", "`") must match the run
 * exactly: the "*" of italic must not recognise itself inside the "**" of
 * bold, or italicising a bold word would strip its bold instead of nesting.
 */
function carriesMarker(text: string, marker: string, edge: "start" | "end") {
  if (marker === "") return true;
  const present =
    edge === "start" ? text.startsWith(marker) : text.endsWith(marker);
  const [char] = marker;
  if (!present || ![...marker].every((c) => c === char)) return present;
  return runLength(text, char, edge) === marker.length;
}

/** Toggle: strip the template's markers when they're already there. */
const around =
  (template: Template): Template =>
  (before, selectedText, after) => {
    const split = template(before, selectedText, after);
    const [, prefix = "", postfix = ""] = split.infixes;

    const outside = {
      prefix: carriesMarker(before, prefix, "end"),
      postfix: carriesMarker(after, postfix, "start"),
    };
    const inside = {
      prefix: carriesMarker(selectedText, prefix, "start"),
      postfix: carriesMarker(selectedText, postfix, "end"),
    };

    // Markers aren't there yet - apply them
    if (!(
      (outside.prefix || inside.prefix) &&
      (outside.postfix || inside.postfix)
    )) {
      return split;
    }

    // Markers are already there - undo them, each on the side that carries it.
    // Taking a marker off both the selection and its surroundings would eat a
    // character the user still needs: unwrapping "[" + "[a](b)" + "](url)"
    // twice over leaves the malformed "a](b)".
    const escaped = {
      prefix: prefix.replaceAll(...escape),
      postfix: postfix.replaceAll(...escape),
    };
    const strip = (text: string, marker: string, edge: "start" | "end") =>
      text.replace(
        new RegExp(edge === "start" ? `^${marker}` : `${marker}$`),
        ""
      );
    const newBefore = outside.prefix
      ? strip(before, escaped.prefix, "end")
      : before;
    const newAfter = outside.postfix
      ? strip(after, escaped.postfix, "start")
      : after;
    const unprefixed = outside.prefix
      ? selectedText
      : strip(selectedText, escaped.prefix, "start");
    const newSelectedText = outside.postfix
      ? unprefixed
      : strip(unprefixed, escaped.postfix, "end");
    return tpl`${newBefore}${newSelectedText}${newAfter}`;
  };

export const isKey =
  (key: Key) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
    typeof key === "function"
      ? key(e)
      : e.key.toLowerCase() === key.toLowerCase();

// Each binding states whether Shift is held, so that Ctrl+Shift+E isn't also
// read as the Ctrl+E it contains — options are matched in order, and the
// laxer binding would always win.
const ctrl = (k: Key) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
  (e.ctrlKey || e.metaKey) && !e.shiftKey && isKey(k)(e);
const ctrlShift = (k: Key) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
  (e.ctrlKey || e.metaKey) && e.shiftKey && isKey(k)(e);

/**
 * Match the key by its position rather than the character it produces: what
 * Shift+7 types is "&" on a US layout, "/" on a German one, and so on, while
 * the key labelled 7 stays `Digit7` everywhere.
 */
const at = (code: string) => (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
  e.code === code;

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
    label: "Quote (Ctrl+Shift+.)",
    // Per line rather than once around the block: quoting several lines and
    // then unquoting them has to leave none of them behind.
    template: selectLine(listMarker(/^>\s+/, (line) => `> ${line}`)),
    key: ctrlShift(at("Period")),
  },
  {
    icon: NumberedListIcon,
    label: "Numbered list (Ctrl+Shift+7)",
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
    key: ctrlShift(at("Digit7")),
  },
  {
    icon: ListBulletIcon,
    label: "Bullet list (Ctrl+Shift+8)",
    template: selectLine(listMarker(/^-\s+/, (line) => `- ${line}`)),
    key: ctrlShift(at("Digit8")),
  },
  {
    icon: CodeBracketIcon,
    label: "Inline code (Ctrl+E)",
    template: around(
      (before, selectedText, after) => tpl`${before}\`${selectedText}\`${after}`
    ),
    key: ctrl("E"),
  },
  {
    icon: CodeBracketSquareIcon,
    // GitHub has no separate code-block binding — Ctrl+E adapts to the
    // selection there — so this one extends the set rather than copying it.
    label: "Code block (Ctrl+Shift+E)",
    template: selectLine(
      around(
        (before, selectedText, after) =>
          tpl`${before}\`\`\`\n${selectedText}\n\`\`\`${after}`
      )
    ),
    key: ctrlShift("E"),
  },
  {
    icon: LinkIcon,
    label: "Insert link (Ctrl+K)",
    template: around((before, selectedText, after) => {
      // Nothing selected: no label to write, so the "url" placeholder is left
      // selected for the address to be typed straight over it, as on GitHub.
      if (!selectedText) return typeOver(tpl`${before}[](${"url"})${after}`);
      // Text that is already an address is the link's target — that is how a
      // pasted URL is turned into a link; any other text is the label GitHub
      // makes it. Text that already is a "[](…)", or already sits in one's
      // target, keeps that shape so that pressing Ctrl+K on it unwraps the
      // link instead of nesting a second one around it.
      return /^https?:\/\//i.test(selectedText) ||
        /^\[\]\([^()]*\)$/.test(selectedText) ||
        (before.endsWith("[](") && after.startsWith(")"))
        ? tpl`${before}[](${selectedText})${after}`
        : tpl`${before}[${selectedText}](url)${after}`;
    }),
    key: ctrl("K"),
  },
];
