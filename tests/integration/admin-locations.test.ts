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

const VALID_SECRET = "0123456789abcdef0123456789abcdef"; // 32 chars

async function loginAsAdmin() {
  const c = await createAdminAuthCookie();
  cookieJar.set(c.name, c.value);
}

function locationFormData(
  overrides: Record<string, string | File> = {}
): FormData {
  const formData = new FormData();
  formData.set("name", "Main Hall");
  formData.set("description", "The big one");
  formData.set("capacity", "50");
  formData.set("color", "#aabbcc");
  for (const [key, value] of Object.entries(overrides)) {
    formData.set(key, value);
  }
  return formData;
}

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
    vi.stubEnv("UPLOADS_DIR", uploadsDir);
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
      expect(await createLocationAction(locationFormData())).toEqual({
        ok: false,
        error: "Unauthorized",
      });
      expect(
        await updateLocationAction(
          locationFormData({ id: location.id, name: "Hacked" })
        )
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
      const formData = locationFormData({
        areaDescription: "First floor",
        hidden: "on",
        bookable: "on",
      });
      const result = await createLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const all = await getRepositories().locations.list();
      expect(all).toHaveLength(1);
      expect(all[0]).toMatchObject({
        name: "Main Hall",
        description: "The big one",
        capacity: 50,
        color: "#aabbcc",
        hidden: true,
        bookable: true,
        areaDescription: "First floor",
        imageUrl: "",
      });
    });

    it("appends new locations at the end of the sort order", async () => {
      await createLocationAction(locationFormData({ name: "A" }));
      await createLocationAction(locationFormData({ name: "B" }));
      const all = await getRepositories().locations.list();
      expect(all.map((l) => l.name)).toEqual(["A", "B"]);
      expect(all[1].sortIndex).toBeGreaterThan(all[0].sortIndex);
    });

    it("assigns the location to the given events", async () => {
      const event = await createEvent();
      const formData = locationFormData();
      formData.append("eventIds", event.id);
      const result = await createLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const { locations } = getRepositories();
      const [created] = await locations.list();
      expect(await locations.listEventIds(created.id)).toEqual([event.id]);
    });

    it("rejects unknown event ids", async () => {
      const formData = locationFormData();
      formData.append("eventIds", "no-such-event");
      const result = await createLocationAction(formData);
      expect(result).toEqual({ ok: false, error: "Unknown event" });
      expect(await getRepositories().locations.list()).toEqual([]);
    });

    it("requires a name", async () => {
      const result = await createLocationAction(
        locationFormData({ name: "  " })
      );
      expect(result).toEqual({ ok: false, error: "Name is required" });
    });

    it("rejects a negative capacity", async () => {
      const result = await createLocationAction(
        locationFormData({ capacity: "-1" })
      );
      expect(result).toEqual({
        ok: false,
        error: "Capacity must be a non-negative whole number",
      });
    });

    it("stores a valid image and sets the imageUrl", async () => {
      const formData = locationFormData({
        image: await makeImageFile(800, 600),
      });
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

    it("rejects an image with the wrong aspect ratio and creates nothing", async () => {
      const formData = locationFormData({
        image: await makeImageFile(800, 800),
      });
      const result = await createLocationAction(formData);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toMatch(/4:3/);
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

      const formData = locationFormData({
        id: location.id,
        name: "Renamed",
        capacity: "10",
      });
      formData.append("eventIds", event.id);
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
      const formData = locationFormData({
        id: location.id,
        image: await makeImageFile(800, 600),
      });
      const result = await updateLocationAction(formData);
      expect(result).toEqual({ ok: true });

      const updated = await getRepositories().locations.findById(location.id);
      expect(updated?.imageUrl).toContain(
        `/media/locations/${location.id}.png`
      );
    });

    it("errors for an unknown id", async () => {
      const result = await updateLocationAction(
        locationFormData({ id: "does-not-exist" })
      );
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
      const formData = locationFormData({
        image: await makeImageFile(800, 600),
      });
      await createLocationAction(formData);
      const [created] = await getRepositories().locations.list();
      const imagePath = path.join(uploadsDir, "locations", `${created.id}.png`);
      expect(fs.existsSync(imagePath)).toBe(true);

      await deleteLocationAction({ id: created.id });
      expect(fs.existsSync(imagePath)).toBe(false);
    });
  });

  describe("moveLocationAction", () => {
    it("moves a location up and down", async () => {
      const { locations } = getRepositories();
      await createLocationAction(locationFormData({ name: "A" }));
      await createLocationAction(locationFormData({ name: "B" }));
      await createLocationAction(locationFormData({ name: "C" }));

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
      await createLocationAction(locationFormData({ name: "A" }));
      await createLocationAction(locationFormData({ name: "B" }));
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
