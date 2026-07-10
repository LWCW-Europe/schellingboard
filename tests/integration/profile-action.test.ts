import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  vi,
  afterEach,
} from "vitest";

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
import { createGuest } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { updateProfileAction } from "@/app/actions/profile";
import { createImageFile } from "@/tests/helpers/utils";
import fs from "fs";
import path from "path";
import os from "os";
import sharp from "sharp";

let uploadsDir: string;

describe("updateProfileAction", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), "uploads-test-"));
    vi.stubEnv("UPLOADS_DIR", uploadsDir);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  });

  it("updates name, pronouns and aboutMe for the current user", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set("user", guest.id);
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      pronouns: "they/them",
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated).toMatchObject({
      name: "New Name",
      aboutMe: "Hello there",
      pronouns: "they/them",
    });
  });

  it("updates name, aboutMe, pronouns and avatar for the current user", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set("user", guest.id);
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(256, 256, "avatar.png"),
      pronouns: "they/them",
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated).toMatchObject({
      name: "New Name",
      aboutMe: "Hello there",
      pronouns: "they/them",
    });
    expect(updated?.avatarUrl).toMatch(
      new RegExp(`^/media/avatars/${updated?.id}\\.png\\?v=\\d+$`)
    );
    const imagePath = path.join(uploadsDir, "avatars", `${updated?.id}.png`);
    expect(fs.existsSync(imagePath)).toBe(true);
  });

  it("resizes avatar to 256 and keeps extension", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set("user", guest.id);
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(512, 512, "avatar.png"),
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    const imagePath = path.join(uploadsDir, "avatars", `${updated?.id}.png`);
    expect(fs.existsSync(imagePath)).toBe(true);
    const imageMetadata = await sharp(fs.readFileSync(imagePath)).metadata();
    expect(imageMetadata).toMatchObject({
      width: 256,
      height: 256,
      format: "png",
    });
  });

  it("rejects images smaller than 256x256", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set("user", guest.id);
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(128, 128, "avatar.png"),
    });
    expect(result).toMatchObject({ ok: false });
  });
});
