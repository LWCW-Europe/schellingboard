import { describe, it, expect } from "vitest";
import { releaseTags, releaseRefs } from "@/scripts/release-tags";

describe("releaseTags", () => {
  it("publishes the version, its minor and its major line", () => {
    expect(releaseTags("v3.4.2", ["v3.4.2"])).toEqual([
      "v3.4.2",
      "v3.4",
      "v3",
      "latest",
    ]);
  });

  it("takes over :latest when nothing newer is released", () => {
    expect(releaseTags("v3.4.2", ["v3.3.1", "v3.4.0", "v3.4.2"])).toContain(
      "latest"
    );
  });

  it("leaves :latest alone for a patch to an older minor", () => {
    expect(releaseTags("v3.3.2", ["v3.3.1", "v3.4.2", "v3.3.2"])).toEqual([
      "v3.3.2",
      "v3.3",
      "v3",
    ]);
  });

  it("leaves :latest alone for a patch to an older major", () => {
    expect(releaseTags("v2.9.1", ["v2.9.0", "v3.0.0"])).not.toContain("latest");
  });

  it("compares versions numerically, not as strings", () => {
    expect(releaseTags("v3.10.0", ["v3.9.0", "v3.10.0"])).toContain("latest");
  });

  it("works when the tag being released is not in the list yet", () => {
    expect(releaseTags("v4.0.0", ["v3.4.2"])).toContain("latest");
  });

  it("ignores tags that are not releases", () => {
    expect(releaseTags("v3.4.2", ["v3.5.0-rc1", "wip", "v3.4.2"])).toContain(
      "latest"
    );
  });

  it("rejects a tag that is not a release version", () => {
    expect(() => releaseTags("v3.4", [])).toThrow(/v3\.4/);
    expect(() => releaseTags("v3.5.0-rc1", [])).toThrow(/rc1/);
  });
});

describe("releaseRefs", () => {
  it("keeps the repository of the image that was built", () => {
    expect(
      releaseRefs("schellingboard/schellingboard:v3.4.2", ["v3.4.2"])
    ).toEqual([
      "schellingboard/schellingboard:v3.4.2",
      "schellingboard/schellingboard:v3.4",
      "schellingboard/schellingboard:v3",
      "schellingboard/schellingboard:latest",
    ]);
  });

  it("keeps a registry host's own port out of the version", () => {
    expect(releaseRefs("registry.example:5000/sb:v1.0.0", ["v1.0.0"])).toEqual([
      "registry.example:5000/sb:v1.0.0",
      "registry.example:5000/sb:v1.0",
      "registry.example:5000/sb:v1",
      "registry.example:5000/sb:latest",
    ]);
  });

  it("rejects an image reference with no tag", () => {
    expect(() => releaseRefs("schellingboard/schellingboard", [])).toThrow(
      /tag/
    );
  });
});
