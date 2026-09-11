import { describe, it, expect } from "vitest";
import {
  DESCRIPTION_MAX_CHARS,
  googleCalendarUrl,
} from "@/utils/google-calendar";

const ENTRY = {
  description: "Some **bold** words\n\n- one\n- two",
  end: new Date("2026-10-02T08:30:00.000Z"),
  hostNames: ["Ada Lovelace", "Grace Hopper"],
  location: "Main Hall",
  start: new Date("2026-10-02T07:00:00.000Z"),
  timezone: "Europe/Berlin",
  title: "Opening Keynote",
  url: "https://sessions.example.org/Conference-Gamma?viewSession=abc",
};

describe("googleCalendarUrl", () => {
  it("opens Google Calendar's new-event template with the session's basics", () => {
    const url = new URL(googleCalendarUrl(ENTRY));

    expect(`${url.origin}${url.pathname}`).toBe(
      "https://calendar.google.com/calendar/render"
    );
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("Opening Keynote");
    expect(url.searchParams.get("location")).toBe("Main Hall");
  });

  it("passes the times as UTC instants, shown in the event's zone", () => {
    const params = new URL(googleCalendarUrl(ENTRY)).searchParams;

    expect(params.get("dates")).toBe("20261002T070000Z/20261002T083000Z");
    expect(params.get("ctz")).toBe("Europe/Berlin");
  });

  it("writes the description, hosts and a link back as plain text", () => {
    const details = new URL(googleCalendarUrl(ENTRY)).searchParams.get(
      "details"
    );

    expect(details).toBe(
      [
        "Some bold words\none\ntwo",
        "Hosted by Ada Lovelace, Grace Hopper",
        "https://sessions.example.org/Conference-Gamma?viewSession=abc",
      ].join("\n\n")
    );
  });

  it("cuts a long description short and keeps the hosts and link back", () => {
    const details = new URL(
      googleCalendarUrl({
        ...ENTRY,
        description: "x".repeat(DESCRIPTION_MAX_CHARS + 500),
      })
    ).searchParams.get("details");

    const [description, hosts, url] = (details ?? "").split("\n\n");
    expect(description).toHaveLength(DESCRIPTION_MAX_CHARS);
    expect(description.endsWith("…")).toBe(true);
    expect(hosts).toBe("Hosted by Ada Lovelace, Grace Hopper");
    expect(url).toBe(ENTRY.url);
  });

  it("cuts between characters, never through an emoji", () => {
    const details = new URL(
      googleCalendarUrl({
        ...ENTRY,
        description: "😀".repeat(DESCRIPTION_MAX_CHARS + 1),
      })
    ).searchParams.get("details");

    const description = (details ?? "").split("\n\n")[0];
    expect(Array.from(description)).toHaveLength(DESCRIPTION_MAX_CHARS);
    expect(description).not.toContain("�");
  });

  it("leaves a description at the limit alone", () => {
    const description = "y".repeat(DESCRIPTION_MAX_CHARS);
    const details = new URL(
      googleCalendarUrl({ ...ENTRY, description })
    ).searchParams.get("details");

    expect((details ?? "").split("\n\n")[0]).toBe(description);
  });

  it("leaves out what the session doesn't have", () => {
    const params = new URL(
      googleCalendarUrl({
        ...ENTRY,
        description: "",
        hostNames: [],
        location: undefined,
        url: undefined,
      })
    ).searchParams;

    expect(params.has("details")).toBe(false);
    expect(params.has("location")).toBe(false);
  });
});
