import { describe, expect, it, vi } from "vitest";
import { isKey, options } from "@/app/components/markdown-options";

function mockTextAreaElement() {
  const mock = {
    value: "Hello world",
    selectionStart: 0,
    selectionEnd: 5,
    focus: vi.fn(),
    setRangeText: vi.fn((replacement: string, start: number, end: number) => {
      mock.value =
        mock.value.slice(0, start) + replacement + mock.value.slice(end);
    }),
    setSelectionRange: vi.fn((start: number, end: number) => {
      mock.selectionStart = start;
      mock.selectionEnd = end;
    }),
    dispatchEvent: vi.fn(),
  };
  const textarea = mock as unknown as HTMLTextAreaElement & {
    mock: typeof mock;
  };
  textarea.mock = mock;
  return textarea;
}

const raf = vi.fn((cb: FrameRequestCallback) => {
  cb(0);
  return 1;
});

vi.stubGlobal("requestAnimationFrame", raf);

function getEvents(textarea: ReturnType<typeof mockTextAreaElement>) {
  return textarea.mock.dispatchEvent.mock.calls
    .map(([event]) => event as Event)
    .map(({ type }) => type);
}

describe("Markdown editor options", () => {
  const simpleOperators = [
    { label: "Bold", prefix: "**", suffix: "**" },
    { label: "Italic", prefix: "*", suffix: "*" },
    { label: "Inline code", prefix: "`", suffix: "`" },
    { label: "Insert link", prefix: "[](", suffix: ")" },
  ] as const;

  for (const operator of simpleOperators) {
    describe(operator.label, () => {
      const option = options.find((opt) =>
        opt.label.startsWith(operator.label)
      );
      if (!option) throw new Error(`${operator.label} option not found`);

      it("should add", () => {
        const textarea = mockTextAreaElement();
        const selectionStart = (textarea.mock.selectionStart = 2);
        const selectionEnd = (textarea.mock.selectionEnd = 7);

        option.onClick(textarea);

        expect(textarea.value).toEqual(
          `He${operator.prefix}llo w${operator.suffix}orld`
        );
        expect(textarea.selectionStart).toBe(
          selectionStart + operator.prefix.length
        );
        expect(textarea.selectionEnd).toBe(
          selectionEnd + operator.prefix.length
        );
      });

      it("should toggle if the inner part is selected", () => {
        const textarea = mockTextAreaElement();
        textarea.mock.value = `Hello ${operator.prefix}world${operator.suffix}`;
        const selectionStart = (textarea.mock.selectionStart =
          6 + operator.prefix.length);
        const selectionEnd = (textarea.mock.selectionEnd =
          textarea.mock.value.length - operator.suffix.length);

        option.onClick(textarea);

        expect(textarea.value).toEqual("Hello world");
        expect(textarea.selectionStart).toBe(
          selectionStart - operator.prefix.length
        );
        expect(textarea.selectionEnd).toBe(
          selectionEnd - operator.prefix.length
        );
        expect(getEvents(textarea)).toMatchObject(["input"]);
      });

      it("should toggle bold if the text is selected together with the surrounding operators", () => {
        const textarea = mockTextAreaElement();
        textarea.mock.value = `Hello ${operator.prefix}world${operator.suffix}`;
        const selectionStart = (textarea.mock.selectionStart = 6);
        const selectionEnd = (textarea.mock.selectionEnd =
          textarea.mock.value.length);

        option.onClick(textarea);

        expect(textarea.value).toEqual("Hello world");
        expect(textarea.selectionStart).toBe(selectionStart);
        expect(textarea.selectionEnd).toBe(
          selectionEnd - operator.suffix.length - operator.prefix.length
        );
        expect(getEvents(textarea)).toMatchObject(["input"]);
      });
    });
  }

  describe("Insert link", () => {
    const option = options.find((opt) => opt.label.startsWith("Insert link"));
    if (!option) throw new Error(`Insert link option not found`);

    // FIXME Known issue
    it.fails("should be able to toggle a link if it has any label", () => {
      const textarea = mockTextAreaElement();
      textarea.value = "Hello [world](https://example.com)";
      const selectionStart = (textarea.mock.selectionStart = 6);
      textarea.mock.selectionEnd = textarea.value.length;

      option.onClick(textarea);

      expect(textarea.value).toEqual("Hello world");
      expect(textarea.selectionStart).toBe(selectionStart);
      expect(textarea.selectionEnd).toBe(textarea.value.length);
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });
  });

  describe("Numbered list", () => {
    const numberedList = options.find((opt) =>
      opt.label.match(/Numbered list/i)
    );
    if (!numberedList) throw new Error("Numbered list option not found");

    it("should appear at the beginning of the line", () => {
      const textarea = mockTextAreaElement();
      textarea.value = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nullam a erat eget lorem porta ornare.
    Sed nec lectus in nulla mollis tincidunt.
`;
      textarea.mock.selectionStart = 87;
      textarea.mock.selectionEnd = 87;

      numberedList.onClick(textarea);

      expect(textarea.value.split("\n")[2]).toMatch(/^1\./);
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });

    it("removes it if it already exists", () => {
      const textarea = mockTextAreaElement();
      textarea.value = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
1.  Nullam a erat eget lorem porta ornare.
    Sed nec lectus in nulla mollis tincidunt.
`;
      textarea.mock.selectionStart = 87;
      textarea.mock.selectionEnd = 87;

      numberedList.onClick(textarea);

      expect(
        textarea.value.split("\n").some((line) => line.match(/^\d*\./))
      ).toBeFalsy();
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });

    it("should consider the number in the previous line when turning a line into a numbered list element", () => {
      const textarea = mockTextAreaElement();
      textarea.value = `
256. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
     Nullam a erat eget lorem porta ornare.
     Sed nec lectus in nulla mollis tincidunt.
`;
      textarea.mock.selectionStart = 87;
      textarea.mock.selectionEnd = 87;

      numberedList.onClick(textarea);

      expect(textarea.value.split("\n")[2]).toMatch(/^257\./);
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });

    it("doesn't care what number the line is numbered with", () => {
      const textarea = mockTextAreaElement();
      textarea.value = `
     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
256. Nullam a erat eget lorem porta ornare.
     Sed nec lectus in nulla mollis tincidunt.
`;
      textarea.mock.selectionStart = 87;
      textarea.mock.selectionEnd = 87;

      numberedList.onClick(textarea);

      expect(
        textarea.value.split("\n").some((line) => line.match(/^\d*\./))
      ).toBeFalsy();
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });
  });

  const simpleLineOperators = [
    { label: "Bullet list", prefix: "- " },
    { label: "Quote", prefix: "> " },
  ] as const;

  for (const operator of simpleLineOperators) {
    describe(operator.label, () => {
      const option = options.find((opt) =>
        opt.label.startsWith(operator.label)
      );
      if (!option) throw new Error(`${operator.label} list option not found`);

      it("should appear at the beginning of the line", () => {
        const textarea = mockTextAreaElement();
        textarea.value = `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam a erat eget lorem porta ornare.
      Sed nec lectus in nulla mollis tincidunt.
  `;
        textarea.mock.selectionStart = 87;
        textarea.mock.selectionEnd = 87;

        option.onClick(textarea);

        expect(textarea.value.split("\n")[2]).toMatch(
          new RegExp(`^${operator.prefix}`)
        );
        expect(getEvents(textarea)).toMatchObject(["input"]);
      });

      it("removes it if it already exists", () => {
        const textarea = mockTextAreaElement();
        textarea.value = `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
${operator.prefix} Nullam a erat eget lorem porta ornare.
      Sed nec lectus in nulla mollis tincidunt.
  `;
        textarea.mock.selectionStart = 87;
        textarea.mock.selectionEnd = 87;

        option.onClick(textarea);

        expect(
          textarea.value
            .split("\n")
            .some((line) => line.startsWith(operator.prefix))
        ).toBeFalsy();
        expect(getEvents(textarea)).toMatchObject(["input"]);
      });
    });
  }

  describe("Code block", () => {
    const codeBlock = options.find((opt) => opt.label.startsWith("Code block"));
    if (!codeBlock) throw new Error(`Code block option not found`);

    it("should appear at the beginning of the line", () => {
      const textarea = mockTextAreaElement();
      textarea.value = `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam a erat eget lorem porta ornare.
      Sed nec lectus in nulla mollis tincidunt.
  `;
      textarea.mock.selectionStart = 87;
      textarea.mock.selectionEnd = 87;

      codeBlock.onClick(textarea);

      const lines = textarea.value.split("\n");

      expect(lines[2]).toEqual("```");
      expect(lines[4]).toEqual("```");
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });

    it("removes it if it already exists", () => {
      const textarea = mockTextAreaElement();
      textarea.value = `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
\`\`\`
      Nullam a erat eget lorem porta ornare.
\`\`\`
      Sed nec lectus in nulla mollis tincidunt.
  `;
      textarea.mock.selectionStart = 87;
      textarea.mock.selectionEnd = 87;

      codeBlock.onClick(textarea);

      expect(
        textarea.value.split("\n").some((line) => line.startsWith("```"))
      ).toBeFalsy();
      expect(getEvents(textarea)).toMatchObject(["input"]);
    });
  });
});

function optionBy(event: unknown) {
  return options.find((opt) =>
    isKey(opt.key)(event as React.KeyboardEvent<HTMLTextAreaElement>)
  );
}

describe("Markdown editor keyboard shortcuts", () => {
  it("should do bold on Ctrl+B", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "b",
      })?.label
    ).toMatch(/^Bold/);
  });

  it("should do italics on Ctrl+I", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "i",
      })?.label
    ).toMatch(/^Italic/);
  });

  it("should do quote on Ctrl+Q", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "q",
      })?.label
    ).toMatch(/^Quote/);
  });

  it("should do numbered list on Ctrl+1", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "1",
      })?.label
    ).toMatch(/^Numbered list/);
  });

  it("should do bullet list on Ctrl+-", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "-",
      })?.label
    ).toMatch(/^Bullet list/);
  });

  it("should do inline code on Ctrl+`", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "`",
      })?.label
    ).toMatch(/^Inline code/);
  });

  it("should do inline code on Ctrl+Shift+`", () => {
    expect(
      optionBy({
        ctrlKey: true,
        shiftKey: true,
        key: "~", // ` becomes ~ when shift is held
      })?.label
    ).toMatch(/^Code block/);
  });

  it("should do insert link on Ctrl+L", () => {
    expect(
      optionBy({
        ctrlKey: true,
        key: "l",
      })?.label
    ).toMatch(/^Insert link/);
  });
});
