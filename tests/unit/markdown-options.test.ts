import { describe, it, expect } from "vitest";
import { applyTemplate, options } from "@/app/components/markdown-options";

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
    it("turns the selection into the link target", () => {
      const edit = apply("Insert link", "example.com", 0, 11);
      expect(edit.value).toBe("[](example.com)");
    });

    it("puts the caret in the target of an empty link", () => {
      const edit = apply("Insert link", "", 0);
      expect(edit.value).toBe("[]()");
      expect([edit.selectionStart, edit.selectionEnd]).toEqual([3, 3]);
    });
  });
});
