import { describe, it, expect } from "vitest";

import {
  clashLine,
  clashLines,
  toMeetingClash,
  type MeetingClash,
} from "@/utils/meeting-clash-text";

describe("toMeetingClash", () => {
  const hosting = {
    guestId: "grace",
    guestName: "Grace",
    kind: "hosting" as const,
    title: "Microservices for Dummies",
  };

  it("keeps the viewer's own commitment, title and all", () => {
    expect(toMeetingClash(hosting, "grace")).toEqual({
      guestName: "Grace",
      kind: "hosting",
      title: "Microservices for Dummies",
      isViewer: true,
    });
  });

  // What someone else has on at that hour is theirs to tell. The browser is
  // told they are taken and nothing else -- not the session, not whether they
  // are hosting it, RSVP'd to it or meeting someone else.
  it("reduces anyone else's to the bare fact that they are taken", () => {
    expect(toMeetingClash(hosting, "ada")).toEqual({
      guestName: "Grace",
      kind: "busy",
      title: null,
      isViewer: false,
    });
  });
});

describe("clashLine", () => {
  it("names the viewer's own session", () => {
    expect(
      clashLine({
        guestName: "Grace",
        kind: "hosting",
        title: "Microservices for Dummies",
        isViewer: true,
      })
    ).toBe("You are hosting Microservices for Dummies");
  });

  it("says only that the other person is booked", () => {
    expect(
      clashLine({
        guestName: "Grace",
        kind: "busy",
        title: null,
        isViewer: false,
      })
    ).toBe("Grace is already booked");
  });

  it("says the viewer is busy when there is nothing to name", () => {
    expect(
      clashLine({
        guestName: "Ada",
        kind: "busy",
        title: null,
        isViewer: true,
      })
    ).toBe("You are busy");
  });
});

describe("clashLines", () => {
  it("says each distinct line once, in order", () => {
    const theirs: MeetingClash = {
      isViewer: false,
      guestName: "Yuki",
      kind: "busy",
      title: null,
    };
    expect(
      clashLines([
        { isViewer: true, guestName: "Me", kind: "hosting", title: "Talk" },
        theirs,
        theirs,
      ])
    ).toBe("You are hosting Talk; Yuki is already booked");
  });
});
