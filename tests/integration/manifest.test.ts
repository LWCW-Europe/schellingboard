import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import { getRepositories } from "@/db/container";
import manifest from "@/app/manifest";

describe("web app manifest", () => {
  beforeAll(setupTestDb);
  beforeEach(resetTestDb);

  it("names the app after the site title, so the installed icon says whose event it is", async () => {
    await getRepositories().settings.update({
      title: "Rationality Camp",
      description: "Three days in the woods",
    });

    const built = await manifest();

    expect(built.name).toBe("Rationality Camp");
    expect(built.description).toBe("Three days in the woods");
  });

  it("falls back to the default title before an organizer has set one", async () => {
    const built = await manifest();

    expect(built.name).toBe("Example Conference Weekend");
  });

  it("is installable: standalone, starting at the site root", async () => {
    const built = await manifest();

    expect(built.display).toBe("standalone");
    expect(built.start_url).toBe("/");
    expect(built.id).toBe("/");
  });

  it("offers both icon sizes an installer looks for, plus a maskable one", async () => {
    const built = await manifest();
    const icons = built.icons ?? [];

    expect(icons.map((i) => i.sizes)).toEqual(
      expect.arrayContaining(["192x192", "512x512"])
    );
    expect(icons.some((i) => i.purpose === "maskable")).toBe(true);
  });
});
