/**
 * The slice of Playwright's JSON reporter output the flake tooling reads, plus
 * the walk over its nested suites. Shared by scripts/ci-flaky-summary.ts and
 * scripts/e2e-flake-report.ts, which would otherwise keep two copies of a
 * shape only Playwright gets to define.
 *
 * Every field is optional: a run killed mid-suite still writes a file.
 */

export interface JsonError {
  message?: string;
}
export interface JsonAttachment {
  name?: string;
  path?: string;
}
export interface JsonResult {
  status?: string;
  duration?: number;
  errors?: JsonError[];
  error?: JsonError;
  attachments?: JsonAttachment[];
}
export interface JsonTest {
  status?: string;
  timeout?: number;
  results?: JsonResult[];
}
export interface JsonSpec {
  title?: string;
  file?: string;
  line?: number;
  tests?: JsonTest[];
}
export interface JsonSuite {
  title?: string;
  file?: string;
  specs?: JsonSpec[];
  suites?: JsonSuite[];
}
export interface JsonStats {
  duration?: number;
  unexpected?: number;
}
export interface JsonReport {
  // Spec paths are relative to this, the common root of the test directories
  // (tests/e2e), not to the repository.
  config?: { rootDir?: string };
  suites?: JsonSuite[];
  errors?: JsonError[];
  stats?: JsonStats;
}

export interface CollectedSpec {
  spec: JsonSpec;
  /** Titles of the describe blocks around the spec, outermost first. */
  titlePath: string[];
}

/** Flatten the suite tree to its specs, carrying the describe titles along. */
export function collectSpecs(
  suites: JsonSuite[],
  ancestors: string[] = []
): CollectedSpec[] {
  const out: CollectedSpec[] = [];
  for (const suite of suites) {
    // The file-level suite is titled with the file path itself; describe
    // blocks below it carry real titles.
    const title = suite.title && suite.title !== suite.file ? suite.title : "";
    const titlePath = title ? [...ancestors, title] : ancestors;
    for (const spec of suite.specs ?? []) out.push({ spec, titlePath });
    out.push(...collectSpecs(suite.suites ?? [], titlePath));
  }
  return out;
}

/** `describe › describe › test`, the name Playwright itself prints. */
export function specTitle({ spec, titlePath }: CollectedSpec): string {
  return [...titlePath, spec.title ?? "(untitled)"].join(" › ");
}

export function specFile({ spec }: CollectedSpec): string {
  return spec.file ?? "(unknown file)";
}
