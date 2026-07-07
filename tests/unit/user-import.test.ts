import { describe, it, expect } from "vitest";
import { parseUserImportCsv } from "@/utils/user-import";

function expectOk(result: ReturnType<typeof parseUserImportCsv>) {
  if (!result.ok)
    throw new Error(`expected ok, got ${result.errors.join("; ")}`);
  return result.rows;
}

function expectErrors(result: ReturnType<typeof parseUserImportCsv>) {
  if (result.ok) throw new Error("expected errors, got ok");
  return result.errors;
}

describe("parseUserImportCsv", () => {
  it("parses name,email rows below a header", () => {
    const rows = expectOk(
      parseUserImportCsv(
        "name,email\nAlice,alice@example.com\nBob,bob@example.com\n"
      )
    );
    expect(rows).toEqual([
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
    ]);
  });

  it("parses semicolon-delimited files (European Excel export)", () => {
    const rows = expectOk(
      parseUserImportCsv(
        "name;email\nAlice;alice@example.com\nBob;bob@example.com\n"
      )
    );
    expect(rows).toEqual([
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
    ]);
  });

  it("parses tab-delimited files", () => {
    const rows = expectOk(
      parseUserImportCsv("name\temail\nAlice\talice@example.com\n")
    );
    expect(rows).toEqual([{ name: "Alice", email: "alice@example.com" }]);
  });

  it("keeps commas in values when the delimiter is a semicolon", () => {
    const rows = expectOk(
      parseUserImportCsv("name;email\nDoe, Jane;jane@example.com\n")
    );
    expect(rows).toEqual([{ name: "Doe, Jane", email: "jane@example.com" }]);
  });

  it("accepts any header column order and ignores extra columns", () => {
    const rows = expectOk(
      parseUserImportCsv("company,email,name\nAcme,alice@example.com,Alice\n")
    );
    expect(rows).toEqual([{ name: "Alice", email: "alice@example.com" }]);
  });

  it("matches header names case-insensitively and trims cells", () => {
    const rows = expectOk(
      parseUserImportCsv("Name , EMAIL\n Alice , alice@example.com \n")
    );
    expect(rows).toEqual([{ name: "Alice", email: "alice@example.com" }]);
  });

  it("handles quoted fields with commas, quotes and newlines", () => {
    const rows = expectOk(
      parseUserImportCsv(
        'name,email\n"Doe, Jane ""JD""",jane@example.com\n"Multi\nLine",multi@example.com\n'
      )
    );
    expect(rows).toEqual([
      { name: 'Doe, Jane "JD"', email: "jane@example.com" },
      { name: "Multi\nLine", email: "multi@example.com" },
    ]);
  });

  it("handles CRLF line endings and skips blank lines", () => {
    const rows = expectOk(
      parseUserImportCsv(
        "name,email\r\nAlice,alice@example.com\r\n\r\nBob,bob@example.com\r\n"
      )
    );
    expect(rows).toHaveLength(2);
  });

  it("rejects a missing header", () => {
    const errors = expectErrors(parseUserImportCsv(""));
    expect(errors.join(" ")).toMatch(/header/i);
  });

  it("rejects a header without the required columns", () => {
    const errors = expectErrors(
      parseUserImportCsv("name,mail\nAlice,alice@example.com\n")
    );
    expect(errors.join(" ")).toMatch(/email/i);
  });

  it("rejects invalid emails with the line number", () => {
    const errors = expectErrors(
      parseUserImportCsv(
        "name,email\nAlice,alice@example.com\nBob,not-an-email\n"
      )
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/line 3/i);
    expect(errors[0]).toMatch(/not-an-email/);
  });

  it("rejects empty names with the line number", () => {
    const errors = expectErrors(
      parseUserImportCsv("name,email\n,alice@example.com\n")
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/line 2/i);
    expect(errors[0]).toMatch(/name/i);
  });

  it("rejects duplicate emails within the file, case-insensitively", () => {
    const errors = expectErrors(
      parseUserImportCsv(
        "name,email\nAlice,alice@example.com\nAlicia,ALICE@example.com\n"
      )
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/line 3/i);
    expect(errors[0]).toMatch(/duplicate/i);
  });

  it("reports all errors at once", () => {
    const errors = expectErrors(
      parseUserImportCsv("name,email\n,alice@example.com\nBob,broken\n")
    );
    expect(errors).toHaveLength(2);
  });

  it("rejects rows with more cells than the header", () => {
    const errors = expectErrors(
      parseUserImportCsv("name,email\nAlice,alice@example.com,extra\n")
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/line 2/i);
  });

  it("rejects a file with no data rows", () => {
    const errors = expectErrors(parseUserImportCsv("name,email\n"));
    expect(errors.join(" ")).toMatch(/no .*rows/i);
  });

  it("rejects an unterminated quoted field", () => {
    const errors = expectErrors(
      parseUserImportCsv('name,email\n"Alice,alice@example.com\n')
    );
    expect(errors[0]).toMatch(/line 2/i);
    expect(errors[0]).toMatch(/unterminated/i);
  });

  it("rejects a quote appearing mid-field", () => {
    const errors = expectErrors(
      parseUserImportCsv('name,email\nAli"ce,alice@example.com\n')
    );
    expect(errors[0]).toMatch(/line 2/i);
    expect(errors[0]).toMatch(/quote/i);
  });

  it("rejects stray characters after a closing quote", () => {
    const errors = expectErrors(
      parseUserImportCsv('name,email\n"Alice"x,alice@example.com\n')
    );
    expect(errors[0]).toMatch(/line 2/i);
    expect(errors[0]).toMatch(/quote/i);
  });
});
