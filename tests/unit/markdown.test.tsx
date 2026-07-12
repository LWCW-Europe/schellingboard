import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "@/app/(site)/markdown";
import { stripMarkdown } from "@/utils/markdown";

function render(markdown: string): string {
  return renderToStaticMarkup(<Markdown>{markdown}</Markdown>);
}

describe("Markdown component", () => {
  it("renders emphasis, strong and inline code", () => {
    const html = render("Some *italic*, **bold** and `code`.");
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toMatch(/<code[^>]*>code<\/code>/);
  });

  it("renders lists", () => {
    const html = render("- one\n- two");
    expect(html).toMatch(/<ul[^>]*>/);
    expect(html).toMatch(/<li[^>]*>one<\/li>/);
  });

  it("preserves single newlines as line breaks (legacy plain text)", () => {
    const html = render("first line\nsecond line");
    expect(html).toContain("<br/>");
  });

  it("escapes raw HTML instead of rendering it", () => {
    const html = render('<script>alert("x")</script>');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("does not render event-handler attributes from raw HTML", () => {
    const html = render('<img src="x" onerror="alert(1)">');
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img"); // escaped, shown as literal text
  });

  it("drops javascript: URLs", () => {
    const html = render("[click](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
  });

  it("opens links in a new tab with safe rel", () => {
    const html = render("[site](https://example.com)");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toMatch(/rel="[^"]*noopener[^"]*"/);
    expect(html).toMatch(/rel="[^"]*nofollow[^"]*"/);
  });

  it("autolinks bare URLs", () => {
    const html = render("see https://example.com/page");
    expect(html).toContain('href="https://example.com/page"');
  });

  it("does not render markdown images", () => {
    const html = render("![tracking pixel](https://evil.example/p.gif)");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("evil.example");
  });

  it("never renders native heading elements, but keeps heading text", () => {
    const html = render("# Huge title\n\nbody");
    expect(html).not.toMatch(/<h[1-6]/);
    expect(html).toContain("Huge title");
  });

  it("does not render tables but keeps their text", () => {
    const html = render("| a | b |\n| - | - |\n| c | d |");
    expect(html).not.toContain("<table");
  });
});

describe("stripMarkdown", () => {
  it("strips formatting down to plain text", () => {
    expect(stripMarkdown("Some **bold** and [a link](https://x.com).")).toBe(
      "Some bold and a link."
    );
  });

  it("strips headings and separates blocks with newlines", () => {
    expect(stripMarkdown("# Title\n\nBody text")).toBe("Title\nBody text");
  });

  it("keeps literal special characters unescaped", () => {
    expect(stripMarkdown("2 * 3 = 6 and snake_case")).toBe(
      "2 * 3 = 6 and snake_case"
    );
  });

  it("keeps inline code content", () => {
    expect(stripMarkdown("run `make test` now")).toBe("run make test now");
  });

  it("drops images but keeps alt text", () => {
    expect(stripMarkdown("![alt text](https://x.com/i.png)")).toBe("alt text");
  });

  it("flattens list items onto separate lines", () => {
    expect(stripMarkdown("- one\n- two")).toBe("one\ntwo");
  });

  it("returns empty string for empty input", () => {
    expect(stripMarkdown("")).toBe("");
  });

  it("returns empty string for null or undefined input", () => {
    expect(stripMarkdown(null)).toBe("");
    expect(stripMarkdown(undefined)).toBe("");
  });

  it("drops raw HTML tags instead of showing their literal text", () => {
    expect(stripMarkdown("Some <div>text</div> here")).toBe("Some text here");
  });
});
