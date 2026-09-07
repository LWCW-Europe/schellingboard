import { describe, it, expect } from "vitest";

import {
  clashLine,
  clashLines,
  toMeetingClashes,
  type MeetingClash,
} from "@/utils/meeting-clash-text";

describe("toMeetingClashes", () => {
  const hosting = {
    guestId: "grace",
    guestName: "Grace",
    kind: "hosting" as const,
    title: "Microservices for Dummies",
  };
  const meeting = {
    guestId: "grace",
    guestName: "Grace",
    kind: "meeting" as const,
    title: null,
  };

  it("keeps the viewer's own commitment, title and all", () => {
    expect(toMeetingClashes([hosting], "grace")).toEqual([
      {
        guestName: "Grace",
        kind: "hosting",
        title: "Microservices for Dummies",
        isViewer: true,
      },
    ]);
  });

  // What someone else has on at that hour is theirs to tell. The browser is
  // told they are taken and nothing else -- not the session, not whether they
  // are hosting it, RSVP'd to it or meeting someone else.
  it("reduces anyone else's to the bare fact that they are taken", () => {
    expect(toMeetingClashes([hosting], "ada")).toEqual([
      { guestName: "Grace", kind: "busy", title: null, isViewer: false },
    ]);
  });

  // How many things they have on is as much theirs as what those things are.
  it("collapses what redacts to the same thing", () => {
    expect(toMeetingClashes([hosting, meeting], "ada")).toEqual([
      { guestName: "Grace", kind: "busy", title: null, isViewer: false },
    ]);
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

  it("names a session the viewer only RSVP'd to", () => {
    expect(
      clashLine({
        guestName: "Grace",
        kind: "attending",
        title: "Microservices for Dummies",
        isViewer: true,
      })
    ).toBe("You are attending Microservices for Dummies");
  });

  it("says the viewer's other 1-on-1 is one", () => {
    expect(
      clashLine({
        guestName: "Grace",
        kind: "meeting",
        title: null,
        isViewer: true,
      })
    ).toBe("You have another 1-on-1");
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
