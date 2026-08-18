import { describe, expect, it, vi } from "vitest";
import {
  applyTemplate,
  applyToTextarea,
  isKey,
  options,
} from "@/app/components/markdown-options";

// Options are looked up by the start of their label so that adding a keyboard
// shortcut hint to the label doesn't break these tests.
function apply(label: string, value: string, start: number, end = start) {
  const option = options.find((o) => o.label.startsWith(label));
  if (!option) throw new Error(`No toolbar option labelled "${label}"`);
  return applyTemplate(option.template, value, start, end);
}

describe("markdown toolbar options", () => {
  describe("Bold", () => {
    it("wraps the selection and keeps it selected", () => {
      const edit = apply("Bold", "hello world", 6, 11);
      expect(edit.value).toBe("hello **world**");
      expect([edit.selectionStart, edit.selectionEnd]).toEqual([8, 13]);
    });

    it("inserts empty markers with the caret between them", () => {
      const edit = apply("Bold", "hi", 2);
      expect(edit.value).toBe("hi****");
      expect([edit.selectionStart, edit.selectionEnd]).toEqual([4, 4]);
    });

    it("unwraps a selection that is already bold", () => {
      const edit = apply("Bold", "a **foo** b", 4, 7);
      expect(edit.value).toBe("a foo b");
      expect([edit.selectionStart, edit.selectionEnd]).toEqual([2, 5]);
    });

    it("keeps a blank first line", () => {
      expect(apply("Bold", "\nfoo", 1, 4).value).toBe("\n**foo**");
    });

    it("keeps leading whitespace", () => {
      expect(apply("Bold", "  foo", 2, 5).value).toBe("  **foo**");
    });

    it("keeps a trailing newline", () => {
      expect(apply("Bold", "foo\n", 0, 3).value).toBe("**foo**\n");
    });
  });

  describe("Italic", () => {
    it("wraps the selection", () => {
      expect(apply("Italic", "foo", 0, 3).value).toBe("*foo*");
    });

    it("unwraps a selection that is already italic", () => {
      expect(apply("Italic", "*foo*", 1, 4).value).toBe("foo");
    });

    // The "*" of italic must not recognise itself inside the "**" of bold.
    it("nests inside bold instead of stripping it", () => {
      expect(apply("Italic", "**foo**", 2, 5).value).toBe("***foo***");
      expect(apply("Italic", "**foo**", 0, 7).value).toBe("***foo***");
    });
  });

  describe("Quote", () => {
    it("prefixes the current line", () => {
      expect(apply("Quote", "a\nfoo", 3).value).toBe("a\n> foo");
    });

    it("keeps a preceding blank line", () => {
      expect(apply("Quote", "\nfoo", 2).value).toBe("\n> foo");
    });

    it("keeps a following line", () => {
      expect(apply("Quote", "foo\nbar", 1).value).toBe("> foo\nbar");
    });

    it("unquotes an already quoted line", () => {
      expect(apply("Quote", "> a", 3).value).toBe("a");
    });

    it("prefixes every selected line", () => {
      expect(apply("Quote", "a\nb\nc", 0, 5).value).toBe("> a\n> b\n> c");
    });

    it("removes the quote from every selected line", () => {
      expect(apply("Quote", "> a\n> b", 0, 7).value).toBe("a\nb");
    });
  });

  describe("Bullet list", () => {
    it("prefixes every selected line", () => {
      expect(apply("Bullet", "a\nb", 0, 3).value).toBe("- a\n- b");
    });

    it("only prefixes the lines that aren't bulleted yet", () => {
      expect(apply("Bullet", "- a\nb", 0, 5).value).toBe("- a\n- b");
    });

    it("removes the bullets when every selected line has one", () => {
      expect(apply("Bullet", "- a\n- b", 0, 7).value).toBe("a\nb");
    });

    it("starts a list on an empty line", () => {
      expect(apply("Bullet", "foo\n", 4).value).toBe("foo\n- ");
    });

    it("keeps a blank line inside the selection", () => {
      expect(apply("Bullet", "\nfoo", 0, 4).value).toBe("\n- foo");
    });
  });

  describe("Numbered list", () => {
    it("numbers every selected line", () => {
      expect(apply("Numbered", "a\nb", 0, 3).value).toBe("1. a\n2. b");
    });

    it("continues the numbering of the preceding line", () => {
      expect(apply("Numbered", "1. a\nb", 5).value).toBe("1. a\n2. b");
    });

    it("restarts numbering after a blank line", () => {
      expect(apply("Numbered", "1. a\n\nb", 6).value).toBe("1. a\n\n1. b");
    });

    it("ignores numbers that aren't a list marker", () => {
      expect(apply("Numbered", "Version 2.0\nb", 12).value).toBe(
        "Version 2.0\n1. b"
      );
    });

    it("removes the numbers when every selected line has one", () => {
      expect(apply("Numbered", "1. a\n2. b", 0, 9).value).toBe("a\nb");
    });

    it("starts a list on an empty line", () => {
      expect(apply("Numbered", "foo\n", 4).value).toBe("foo\n1. ");
    });
  });

  describe("Code", () => {
    it("wraps the selection in backticks", () => {
      expect(apply("Inline code", "foo", 0, 3).value).toBe("`foo`");
    });

    it("fences the selected lines", () => {
      expect(apply("Code block", "a\nb", 0, 3).value).toBe("```\na\nb\n```");
    });

    it("unfences an already fenced block", () => {
      expect(apply("Code block", "```\na\n```", 5).value).toBe("a");
    });
  });

  describe("Insert link", () => {
    it("turns a selected address into the link target", () => {
      const edit = apply("Insert link", "https://www.example.com", 0, 23);
      expect(edit.value).toBe("[](https://www.example.com)");
    });

    it("recognises an address whatever the case of its scheme", () => {
      const edit = apply("Insert link", "HTTP://EXAMPLE.COM", 0, 18);
      expect(edit.value).toBe("[](HTTP://EXAMPLE.COM)");
    });

    it("turns any other selection into the link label", () => {
      const edit = apply("Insert link", "example.com", 0, 11);
      expect(edit.value).toBe("[example.com](url)");
    });

    // The placeholder is both the hint that an address goes there and what the
    // address is typed over, so it has to arrive selected.
    it("selects the placeholder target of an empty link", () => {
      const edit = apply("Insert link", "", 0);
      expect(edit.value).toBe("[](url)");
      expect([edit.selectionStart, edit.selectionEnd]).toEqual([3, 6]);
    });

    it("unwraps a link whose target isn't an address", () => {
      expect(apply("Insert link", "[](example.com)", 3, 14).value).toBe(
        "example.com"
      );
    });

    it("unwraps a link that is selected whole", () => {
      expect(apply("Insert link", "[](https://a)", 0, 13).value).toBe(
        "https://a"
      );
    });

    // Whatever a press does, the press after it has to be able to take back —
    // leaving "a](https://a)" behind is worse than doing nothing.
    it("takes back the link it wrapped around a labelled link", () => {
      const first = apply("Insert link", "[a](https://a)", 0, 14);
      const second = apply(
        "Insert link",
        first.value,
        first.selectionStart,
        first.selectionEnd
      );
      expect(second.value).toBe("[a](https://a)");
    });

    it("unwraps a labelled link that still has its placeholder target", () => {
      expect(apply("Insert link", "[example.com](url)", 1, 12).value).toBe(
        "example.com"
      );
    });

    // FIXME Known issue: a labelled link only round-trips while its target is
    // still the "url" placeholder — once it is filled in, the link is wrapped
    // again instead of being unwrapped.
    it.fails("unwraps a link that has a label", () => {
      expect(apply("Insert link", "[a](example.com)", 0, 16).value).toBe("a");
    });
  });
});

describe("applyToTextarea", () => {
  function mockTextarea(value: string, start: number, end: number) {
    const mock = {
      value,
      selectionStart: start,
      selectionEnd: end,
      focus: vi.fn(),
      setRangeText: vi.fn((replacement: string, from: number, to: number) => {
        mock.value =
          mock.value.slice(0, from) + replacement + mock.value.slice(to);
      }),
      setSelectionRange: vi.fn((from: number, to: number) => {
        mock.selectionStart = from;
        mock.selectionEnd = to;
      }),
      dispatchEvent: vi.fn(),
    };
    return mock;
  }

  function applyOption(
    label: string,
    textarea: ReturnType<typeof mockTextarea>
  ) {
    const option = options.find((o) => o.label.startsWith(label));
    if (!option) throw new Error(`No toolbar option labelled "${label}"`);
    // requestAnimationFrame isn't available outside a browser; run it inline.
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    applyToTextarea(
      option.template,
      textarea as unknown as HTMLTextAreaElement
    );
  }

  it("writes the edit back and restores the selection", () => {
    const textarea = mockTextarea("hello world", 6, 11);
    applyOption("Bold", textarea);
    expect(textarea.value).toBe("hello **world**");
    expect([textarea.selectionStart, textarea.selectionEnd]).toEqual([8, 13]);
    expect(textarea.focus).toHaveBeenCalled();
  });

  // React's onChange listens for the native input event, so the form behind
  // the textarea only learns about a toolbar edit if one is dispatched.
  it("dispatches a single bubbling input event", () => {
    const textarea = mockTextarea("hello world", 6, 11);
    applyOption("Bold", textarea);
    const events = textarea.dispatchEvent.mock.calls.map(([e]) => e as Event);
    expect(events.map((e) => e.type)).toEqual(["input"]);
    expect(events[0].bubbles).toBe(true);
  });

  // setRangeText rather than assigning .value, so the browser's undo stack
  // survives a toolbar edit.
  it("edits through setRangeText", () => {
    const textarea = mockTextarea("hello world", 6, 11);
    applyOption("Bold", textarea);
    expect(textarea.setRangeText).toHaveBeenCalled();
  });
});

// Only the fields the bindings actually read; `code` is the physical key.
function optionBy(event: {
  key: string;
  code?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}) {
  return options.find((opt) =>
    isKey(opt.key)(event as unknown as React.KeyboardEvent<HTMLTextAreaElement>)
  );
}

// The bindings mirror GitHub's Markdown editor, so muscle memory carries over.
describe("Markdown editor keyboard shortcuts", () => {
  it("bolds on Ctrl+B", () => {
    expect(optionBy({ ctrlKey: true, key: "b" })?.label).toMatch(/^Bold/);
  });

  it("italicises on Ctrl+I", () => {
    expect(optionBy({ ctrlKey: true, key: "i" })?.label).toMatch(/^Italic/);
  });

  it("quotes on Ctrl+Shift+.", () => {
    expect(
      optionBy({ ctrlKey: true, shiftKey: true, code: "Period", key: ">" })
        ?.label
    ).toMatch(/^Quote/);
  });

  it("numbers a list on Ctrl+Shift+7", () => {
    expect(
      optionBy({ ctrlKey: true, shiftKey: true, code: "Digit7", key: "&" })
        ?.label
    ).toMatch(/^Numbered list/);
  });

  it("bullets a list on Ctrl+Shift+8", () => {
    expect(
      optionBy({ ctrlKey: true, shiftKey: true, code: "Digit8", key: "*" })
        ?.label
    ).toMatch(/^Bullet list/);
  });

  // Shift+7 is "&" on a US layout and "/" on a German one, so the shortcuts
  // that need a shifted key match the physical key instead of the character.
  it("numbers a list on Ctrl+Shift+7 whatever the layout prints", () => {
    expect(
      optionBy({ ctrlKey: true, shiftKey: true, code: "Digit7", key: "/" })
        ?.label
    ).toMatch(/^Numbered list/);
  });

  it("inserts inline code on Ctrl+E", () => {
    expect(optionBy({ ctrlKey: true, key: "e" })?.label).toMatch(
      /^Inline code/
    );
  });

  it("inserts a code block on Ctrl+Shift+E", () => {
    expect(
      optionBy({ ctrlKey: true, shiftKey: true, key: "E" })?.label
    ).toMatch(/^Code block/);
  });

  it("inserts a link on Ctrl+K", () => {
    expect(optionBy({ ctrlKey: true, key: "k" })?.label).toMatch(
      /^Insert link/
    );
  });

  // Browsers own these and won't let the page have them.
  it.each(["1", "l"])("leaves Ctrl+%s to the browser", (key) => {
    expect(optionBy({ ctrlKey: true, key })).toBeUndefined();
  });
});
