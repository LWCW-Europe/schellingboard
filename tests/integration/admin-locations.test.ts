import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
    }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { createAdminAuthCookie } from "@/utils/auth";
import {
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
  moveLocationAction,
} from "@/app/actions/admin-locations";
import { createImageFile } from "@/tests/helpers/utils";
import { locationSchema } from "@/model/location";
import z from "zod";

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

const baseLocationData = {
  name: "Main Hall",
  description: "The big one",
  capacity: 50,
  color: "teal",
} satisfies Partial<z.input<typeof locationSchema>>;

async function makeImageFile(
  width: number,
  height: number,
  name = "room.png"
): Promise<File> {
  return createImageFile(width, height, name);
}

let uploadsDir: string;

describe("admin location actions", () => {
  beforeAll(() => setupTestDb());

  beforeEach(async () => {
    resetTestDb();
    cookieJar.clear();
    uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), "uploads-test-"));
    vi.stubEnv("ADMIN_PASSWORD", "admin-pw");
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("SB_UPLOADS_DIR", uploadsDir);
    await loginAsAdmin();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  });

  describe("authorization", () => {
    it("rejects all actions without an admin cookie", async () => {
      const location = await createLocation();
      cookieJar.clear();
      expect(await createLocationAction(baseLocationData as never)).toEqual({
        ok: false,
        error: "Unauthorized",
      });
      expect(
        await updateLocationAction({
          ...baseLocationData,
          id: location.id,
          name: "Hacked",
        })
      ).toEqual({ ok: false, error: "Unauthorized" });
      expect(await deleteLocationAction({ id: location.id })).toEqual({
        ok: false,
        error: "Unauthorized",
      });
      expect(
        await moveLocationAction({ id: location.id, direction: "up" })
      ).toEqual({ ok: false, error: "Unauthorized" });
      const after = await getRepositories().locations.findById(location.id);
      expect(after?.name).toBe(location.name);
    });
  });

  describe("createLocationAction", () => {
    it("creates a location with all fields", async () => {
      const formData = {
        ...baseLocationData,
        areaDescription: "First floor",
        hidden: true,
        bookable: true,
      };
      const result = await createLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const all = await getRepositories().locations.list();
      expect(all).toHaveLength(1);
      expect(all[0]).toMatchObject({
        name: "Main Hall",
        description: "The big one",
        capacity: 50,
        color: "teal",
        hidden: true,
        bookable: true,
        areaDescription: "First floor",
        imageUrl: "",
      });
    });

    it("coerces an invalid colour to the default palette name", async () => {
      const result = await createLocationAction({
        ...baseLocationData,
        color: "#aabbcc",
      });
      expect(result).toMatchObject({ ok: true });

      const [created] = await getRepositories().locations.list();
      expect(created.color).toBe("slate");
    });

    it("appends new locations at the end of the sort order", async () => {
      await createLocationAction({ ...baseLocationData, name: "A" });
      await createLocationAction({ ...baseLocationData, name: "B" });
      const all = await getRepositories().locations.list();
      expect(all.map((l) => l.name)).toEqual(["A", "B"]);
      expect(all[1].sortIndex).toBeGreaterThan(all[0].sortIndex);
    });

    it("assigns the location to the given events", async () => {
      const event = await createEvent();
      const formData = {
        ...baseLocationData,
        eventIds: [event.id],
      };
      const result = await createLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const { locations } = getRepositories();
      const [created] = await locations.list();
      expect(await locations.listEventIds(created.id)).toEqual([event.id]);
    });

    it("rejects unknown event ids", async () => {
      const formData = {
        ...baseLocationData,
        eventIds: ["no-such-event"],
      };
      const result = await createLocationAction(formData);
      expect(result).toMatchObject({
        ok: false,
        error: [{ message: "Unknown event", path: ["eventIds"] }],
      });
      expect(await getRepositories().locations.list()).toEqual([]);
    });

    it("requires a name", async () => {
      const result = await createLocationAction({
        ...baseLocationData,
        name: "  ",
      });
      expect(result).toMatchObject({
        ok: false,
        error: [{ message: "Name is required", path: ["name"] }],
      });
    });

    it("rejects a negative capacity", async () => {
      const result = await createLocationAction({
        ...baseLocationData,
        capacity: -1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: [
          {
            message: "Capacity must be a non-negative whole number",
            path: ["capacity"],
          },
        ],
      });
    });

    it("accepts a capacity of 0", async () => {
      const result = await createLocationAction({
        ...baseLocationData,
        capacity: 0,
      });
      expect(result).toEqual({ ok: true });

      const [created] = await getRepositories().locations.list();
      expect(created.capacity).toBe(0);
    });

    it("stores a valid image and sets the imageUrl", async () => {
      const formData = {
        ...baseLocationData,
        image: await makeImageFile(800, 600),
      };
      const result = await createLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const [created] = await getRepositories().locations.list();
      expect(created.imageUrl).toMatch(
        new RegExp(`^/media/locations/${created.id}\\.png\\?v=\\d+$`)
      );
      expect(
        fs.existsSync(path.join(uploadsDir, "locations", `${created.id}.png`))
      ).toBe(true);
    });

    it("accepts a 4:3 image whose orientation is specified by EXIF", async () => {
      const formData = {
        ...baseLocationData,
        image: await createImageFile(600, 800, "image.jpg", {
          preprocess: (image) => image.jpeg().withMetadata({ orientation: 6 }),
        }),
      };

      const result = await createLocationAction(formData);

      expect(result).toEqual({ ok: true });

      const [created] = await getRepositories().locations.list();

      expect(created.imageUrl).toMatch(
        new RegExp(`^/media/locations/${created.id}\\.jpg\\?v=\\d+$`)
      );
      expect(
        fs.existsSync(path.join(uploadsDir, "locations", `${created.id}.jpg`))
      ).toBe(true);
    });

    it("rejects an image with the wrong aspect ratio and creates nothing", async () => {
      const formData = {
        ...baseLocationData,
        image: await makeImageFile(800, 800),
      };
      const result = await createLocationAction(formData);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatchObject([
          {
            code: "custom",
            message: /4:3/,
            path: ["image"],
          },
        ]);
      }
      expect(await getRepositories().locations.list()).toEqual([]);
    });
  });

  describe("updateLocationAction", () => {
    it("updates fields and event assignments, keeping the existing image", async () => {
      const event = await createEvent();
      const { locations } = getRepositories();
      const location = await createLocation();
      await locations.update(location.id, {
        ...location,
        imageUrl: "/media/locations/existing.png",
      });

      const formData = {
        ...baseLocationData,
        id: location.id,
        name: "Renamed",
        capacity: 10,
        eventIds: [event.id],
      };
      const result = await updateLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const updated = await locations.findById(location.id);
      expect(updated).toMatchObject({
        name: "Renamed",
        capacity: 10,
        imageUrl: "/media/locations/existing.png",
      });
      expect(await locations.listEventIds(location.id)).toEqual([event.id]);
    });

    it("replaces the image when a new one is uploaded", async () => {
      const location = await createLocation();
      const formData = {
        ...baseLocationData,
        id: location.id,
        image: await makeImageFile(800, 600),
      };
      const result = await updateLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const updated = await getRepositories().locations.findById(location.id);
      expect(updated?.imageUrl).toContain(
        `/media/locations/${location.id}.png`
      );
    });

    it("errors for an unknown id", async () => {
      const result = await updateLocationAction({
        ...baseLocationData,
        id: "does-not-exist",
      });
      expect(result).toEqual({ ok: false, error: "Location not found" });
    });
  });

  describe("deleteLocationAction", () => {
    it("errors for an unknown id", async () => {
      const result = await deleteLocationAction({ id: "does-not-exist" });
      expect(result).toEqual({ ok: false, error: "Location not found" });
    });

    it("cascade-deletes session and event links, leaving sessions intact", async () => {
      const repos = getRepositories();
      const event = await createEvent();
      const location = await createLocation();
      const otherLocation = await createLocation();
      await repos.locations.setEventIds(location.id, [event.id]);
      const session = await createSession(event.id, {
        locationIds: [location.id, otherLocation.id],
      });

      expect(await repos.locations.countSessionLinks(location.id)).toBe(1);

      const result = await deleteLocationAction({ id: location.id });
      expect(result).toEqual({ ok: true });

      expect(await repos.locations.findById(location.id)).toBeUndefined();
      const sessionAfter = await repos.sessions.findById(session.id);
      expect(sessionAfter?.locations.map((l) => l.id)).toEqual([
        otherLocation.id,
      ]);
      // Other location untouched
      expect(await repos.locations.findById(otherLocation.id)).toBeDefined();
    });

    it("removes the stored image file", async () => {
      const formData = {
        ...baseLocationData,
        image: await makeImageFile(800, 600),
      };
      await createLocationAction(formData);
      const [created] = await getRepositories().locations.list();
      const imagePath = path.join(uploadsDir, "locations", `${created.id}.png`);
      expect(fs.existsSync(imagePath)).toBe(true);

      await deleteLocationAction({ id: created.id });
      expect(fs.existsSync(imagePath)).toBe(false);
    });

    it("keeps the image file if deleting the location record fails", async () => {
      const formData = {
        ...baseLocationData,
        image: await makeImageFile(800, 600),
      };
      await createLocationAction(formData);
      const [created] = await getRepositories().locations.list();
      const imagePath = path.join(uploadsDir, "locations", `${created.id}.png`);
      expect(fs.existsSync(imagePath)).toBe(true);

      const { locations } = getRepositories();
      vi.spyOn(locations, "delete").mockRejectedValueOnce(new Error("boom"));

      await expect(deleteLocationAction({ id: created.id })).rejects.toThrow(
        "boom"
      );
      expect(fs.existsSync(imagePath)).toBe(true);
    });
  });

  describe("moveLocationAction", () => {
    it("moves a location up and down", async () => {
      const { locations } = getRepositories();
      await createLocationAction({ ...baseLocationData, name: "A" });
      await createLocationAction({ ...baseLocationData, name: "B" });
      await createLocationAction({ ...baseLocationData, name: "C" });

      const byName = async () => (await locations.list()).map((l) => l.name);
      const idOf = async (name: string) =>
        (await locations.list()).find((l) => l.name === name)!.id;

      await moveLocationAction({ id: await idOf("C"), direction: "up" });
      expect(await byName()).toEqual(["A", "C", "B"]);

      await moveLocationAction({ id: await idOf("A"), direction: "down" });
      expect(await byName()).toEqual(["C", "A", "B"]);
    });

    it("ignores moves beyond the boundaries", async () => {
      const { locations } = getRepositories();
      await createLocationAction({ ...baseLocationData, name: "A" });
      await createLocationAction({ ...baseLocationData, name: "B" });
      const first = (await locations.list())[0];

      const result = await moveLocationAction({
        id: first.id,
        direction: "up",
      });
      expect(result).toEqual({ ok: true });
      expect((await locations.list()).map((l) => l.name)).toEqual(["A", "B"]);
    });
  });
});
