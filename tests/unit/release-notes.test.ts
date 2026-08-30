import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { releaseNotes, SHOWN_RELEASES } from "@/app/release-notes";

/**
 * The in-app release notes are written by hand, so nothing keeps them in step
 * with CHANGELOG.md on its own. These checks are that: they turn red the
 * moment a release is finalized without its note, which is when the omission
 * is cheapest to fix.
 */

const CHANGELOG = readFileSync(
  path.join(__dirname, "../../CHANGELOG.md"),
  "utf8"
);

/** Released versions and their dates, from the headings, newest first. */
const released = [
  ...CHANGELOG.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm),
].map(([, version, date]) => ({ version, date }));

/** The entries that name a release, i.e. all but an unreleased first one. */
const dated = releaseNotes.filter((note) => note.date !== undefined);

describe("in-app release notes", () => {
  it("cover at least the releases the modal shows", () => {
    expect(releaseNotes.length).toBeGreaterThanOrEqual(SHOWN_RELEASES);
  });

  it("start at the newest release in the changelog", () => {
    expect(dated[0].version).toBe(released[0].version);
  });

  it("name a released version, dated as the changelog dates it", () => {
    for (const note of dated) {
      expect(released).toContainEqual({
        version: note.version,
        date: note.date,
      });
    }
  });

  it("run newest first", () => {
    const positions = dated.map((note) =>
      released.findIndex((release) => release.version === note.version)
    );
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(new Set(positions).size).toBe(positions.length);
  });

  it("carry the unreleased entry, if any, first and alone", () => {
    // Releasing renames that entry and dates it; a second one would mean a
    // release was cut without the first being renamed.
    const undated = releaseNotes.filter((note) => note.date === undefined);
    expect(undated.length).toBeLessThanOrEqual(1);
    for (const note of undated) {
      expect(note).toBe(releaseNotes[0]);
      expect(note.version).toBe("Unreleased");
    }
  });

  it("say something, briefly", () => {
    for (const note of releaseNotes) {
      expect(note.highlights.length).toBeGreaterThan(0);
    }
    const highlights = releaseNotes.flatMap((note) => note.highlights);
    for (const highlight of highlights) {
      expect(highlight.trim()).toBe(highlight);
      expect(highlight).not.toBe("");
      // A modal an organizer/attendee skims, not the changelog: a highlight that no
      // longer fits in a sentence belongs in CHANGELOG.md instead.
      expect(highlight.length).toBeLessThanOrEqual(200);
    }
  });
});
