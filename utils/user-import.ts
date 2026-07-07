export type UserImportRow = { name: string; email: string };

export type UserImportParseResult =
  { ok: true; rows: UserImportRow[] } | { ok: false; errors: string[] };

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type CsvRecord = { cells: string[]; line: number };

const DELIMITERS = [",", ";", "\t"] as const;

/**
 * Picks the field delimiter by counting candidates on the first line, outside
 * quotes. Handles the common European Excel export that uses `;`, plus tabs.
 * Defaults to comma when the header has no delimiter at all.
 */
function detectDelimiter(text: string): string {
  const counts = new Map<string, number>(DELIMITERS.map((d) => [d, 0]));
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') i++;
        else inQuotes = false;
      }
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === "\n" || ch === "\r") break;
    else if (counts.has(ch)) counts.set(ch, counts.get(ch)! + 1);
  }
  let best = ",";
  let bestCount = 0;
  for (const d of DELIMITERS) {
    const c = counts.get(d)!;
    if (c > bestCount) {
      best = d;
      bestCount = c;
    }
  }
  return best;
}

type CsvReadResult = { records: CsvRecord[]; errors: string[] };

/**
 * Minimal RFC-4180-style CSV reader: quoted fields may contain the delimiter,
 * newlines and doubled quotes. A quote is only meaningful at the very start
 * of a field; anywhere else (mid-field, or trailing after a closing quote)
 * it is a structural error rather than silently-altered content, as is an
 * unterminated quoted field at EOF. Returns records with the 1-based line
 * number each record starts on, plus any structural errors found.
 */
function readCsvRecords(text: string, delimiter: string): CsvReadResult {
  const records: CsvRecord[] = [];
  const errors: string[] = [];
  let cells: string[] = [];
  let cell = "";
  let cellState: "start" | "unquoted" | "quoted" | "afterQuote" = "start";
  let fieldErrorReported = false;
  let line = 1;
  let recordStartLine = 1;
  let recordHasContent = false;

  const endCell = () => {
    cells.push(cell);
    cell = "";
    cellState = "start";
    fieldErrorReported = false;
  };
  const endRecord = () => {
    endCell();
    if (recordHasContent || cells.length > 1 || cells[0] !== "") {
      records.push({ cells, line: recordStartLine });
    }
    cells = [];
    recordHasContent = false;
  };
  const reportFieldError = (message: string) => {
    if (!fieldErrorReported) {
      errors.push(`Line ${recordStartLine}: ${message}`);
      fieldErrorReported = true;
    }
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (cellState === "quoted") {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          cellState = "afterQuote";
        }
      } else {
        if (ch === "\n") line++;
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      if (cellState === "start") {
        cellState = "quoted";
      } else {
        reportFieldError(
          "quote character is only allowed at the start of a field"
        );
      }
      recordHasContent = true;
    } else if (ch === delimiter) {
      endCell();
      recordHasContent = true;
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      endRecord();
      line++;
      recordStartLine = line;
    } else {
      if (cellState === "afterQuote") {
        reportFieldError("unexpected character after closing quote");
      }
      if (cellState === "start") cellState = "unquoted";
      cell += ch;
      recordHasContent = true;
    }
  }
  if (cellState === "quoted") {
    errors.push(`Line ${recordStartLine}: unterminated quoted field`);
  }
  if (recordHasContent || cells.length > 0 || cell !== "") endRecord();

  return { records, errors };
}

/**
 * Parses a user-import CSV. Requires a header row containing `name` and
 * `email` columns (any order, case-insensitive, extra columns ignored).
 * All-or-nothing: any invalid row rejects the whole file, and every problem
 * is reported with its line number.
 */
export function parseUserImportCsv(text: string): UserImportParseResult {
  const { records, errors: structuralErrors } = readCsvRecords(
    text,
    detectDelimiter(text)
  );
  if (structuralErrors.length > 0) {
    return { ok: false, errors: structuralErrors };
  }
  if (records.length === 0) {
    return { ok: false, errors: ["Missing header row (expected name,email)"] };
  }

  const header = records[0].cells.map((c) => c.trim().toLowerCase());
  const nameIdx = header.indexOf("name");
  const emailIdx = header.indexOf("email");
  const headerErrors: string[] = [];
  if (nameIdx === -1) headerErrors.push('Header is missing a "name" column');
  if (emailIdx === -1) headerErrors.push('Header is missing an "email" column');
  if (headerErrors.length > 0) return { ok: false, errors: headerErrors };

  const dataRecords = records.slice(1);
  if (dataRecords.length === 0) {
    return { ok: false, errors: ["File contains no data rows"] };
  }

  const rows: UserImportRow[] = [];
  const errors: string[] = [];
  const seenEmails = new Map<string, number>();

  for (const record of dataRecords) {
    if (record.cells.length > header.length) {
      errors.push(
        `Line ${record.line}: has ${record.cells.length} columns, expected ${header.length}`
      );
      continue;
    }
    const name = (record.cells[nameIdx] ?? "").trim();
    const email = (record.cells[emailIdx] ?? "").trim();

    if (!name) {
      errors.push(`Line ${record.line}: name is missing`);
      continue;
    }
    if (!EMAIL_PATTERN.test(email)) {
      errors.push(`Line ${record.line}: invalid email "${email}"`);
      continue;
    }
    const emailKey = email.toLowerCase();
    const firstLine = seenEmails.get(emailKey);
    if (firstLine !== undefined) {
      errors.push(
        `Line ${record.line}: duplicate email "${email}" (first seen on line ${firstLine})`
      );
      continue;
    }
    seenEmails.set(emailKey, record.line);
    rows.push({ name, email });
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, rows };
}
