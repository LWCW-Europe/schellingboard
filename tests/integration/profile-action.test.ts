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
import { GUEST_COOKIE_NAME, openGuestValue } from "../helpers/guest-cookie";
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
    vi.stubEnv("SB_UPLOADS_DIR", uploadsDir);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  });

  it("leaves email settings untouched: those belong to the settings action", async () => {
    const guest = await createGuest({
      name: "Guest",
      emailSettings: { rsvpChange: false, hostChange: false, cohostAdd: true },
    });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.info.emailSettings).toEqual({
      rsvpChange: false,
      hostChange: false,
      cohostAdd: true,
      proposalComment: true,
      commentThread: false,
    });
  });

  it("updates name, pronouns and aboutMe for the current user", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
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

  it("records when the profile was updated", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const before = new Date();

    expect(await updateProfileAction({ name: "Guest", aboutMe: "Hi" })).toEqual(
      { ok: true }
    );

    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.profileUpdatedAt?.getTime()).toBeGreaterThanOrEqual(
      before.getTime()
    );
  });

  it("updates name, aboutMe, pronouns and avatar for the current user", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
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

  it("resizes a large avatar to 1024 and keeps extension", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(2048, 2048, "avatar.png"),
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    const imagePath = path.join(uploadsDir, "avatars", `${updated?.id}.png`);
    expect(fs.existsSync(imagePath)).toBe(true);
    const imageMetadata = await sharp(fs.readFileSync(imagePath)).metadata();
    expect(imageMetadata).toMatchObject({
      width: 1024,
      height: 1024,
      format: "png",
    });
  });

  it("never upscales an avatar smaller than 1024", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(512, 512, "avatar.png"),
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    const imagePath = path.join(uploadsDir, "avatars", `${updated?.id}.png`);
    const imageMetadata = await sharp(fs.readFileSync(imagePath)).metadata();
    expect(imageMetadata).toMatchObject({ width: 512, height: 512 });
  });

  it("crops a non-square avatar to its shorter side rather than upscaling", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(900, 400, "avatar.png"),
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    const imagePath = path.join(uploadsDir, "avatars", `${updated?.id}.png`);
    const imageMetadata = await sharp(fs.readFileSync(imagePath)).metadata();
    expect(imageMetadata).toMatchObject({ width: 400, height: 400 });
  });

  it("saves basedIn, prompts, languages, and contacts", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      basedIn: "Zürich",
      prompts: [{ prompt: "Ask me about", answer: "Fermentation" }],
      languages: ["Swiss German", "English"],
      contacts: [
        { type: "telegram", value: "@guest" },
        { type: "other", label: "Matrix", value: "@guest:matrix.org" },
      ],
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated).toMatchObject({
      basedIn: "Zürich",
      prompts: [{ prompt: "Ask me about", answer: "Fermentation" }],
      languages: ["Swiss German", "English"],
      contacts: [
        { type: "telegram", value: "@guest" },
        { type: "other", label: "Matrix", value: "@guest:matrix.org" },
      ],
    });
  });

  it("drops empty prompt answers, blank languages, and blank contact rows", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      basedIn: "  ",
      prompts: [
        { prompt: "Ask me about", answer: "  " },
        { prompt: "Offering", answer: "Board games" },
      ],
      languages: ["", "  ", "French"],
      contacts: [{ type: "email", value: "   " }],
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.basedIn).toBeNull();
    expect(updated?.prompts).toEqual([
      { prompt: "Offering", answer: "Board games" },
    ]);
    expect(updated?.languages).toEqual(["French"]);
    expect(updated?.contacts).toBeNull();
  });

  it("keeps only the first answer when a prompt is repeated", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      prompts: [
        { prompt: "Ask me about", answer: "Fermentation" },
        { prompt: "Ask me about", answer: "Beekeeping" },
      ],
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.prompts).toEqual([
      { prompt: "Ask me about", answer: "Fermentation" },
    ]);
  });

  it("strips labels from contacts that are not of type 'other'", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      // A label typed while the type was "other" sticks around in the form
      // state after switching the type; it must not be persisted.
      contacts: [{ type: "telegram", label: "Matrix", value: "@guest" }],
    });
    expect(result).toEqual({ ok: true });
    const updated = await getRepositories().guests.findById(guest.id);
    expect(updated?.contacts).toEqual([{ type: "telegram", value: "@guest" }]);
  });

  it("rejects an 'other' contact without a label", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      contacts: [{ type: "other", value: "@guest:matrix.org" }],
    });
    expect(result).toMatchObject({ ok: false });
  });

  it("rejects entries beyond the sanity limits", async () => {
    const guest = await createGuest({ name: "Guest" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

    const tooManyLanguages = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      languages: Array.from({ length: 11 }, (_, i) => `Lang ${i}`),
    });
    expect(tooManyLanguages).toMatchObject({ ok: false });

    const answerTooLong = await updateProfileAction({
      name: "Guest",
      aboutMe: null,
      prompts: [{ prompt: "Ask me about", answer: "x".repeat(501) }],
    });
    expect(answerTooLong).toMatchObject({ ok: false });
  });

  it("rejects images smaller than 256x256", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(128, 128, "avatar.png"),
    });
    expect(result).toMatchObject({ ok: false });
  });

  // The square crop can't be bigger than the shorter side, so a wide-but-flat
  // image would otherwise be stored below the 256px minimum.
  it("rejects a wide image whose shorter side is below the minimum", async () => {
    const guest = await createGuest({ name: "Old" });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));
    const result = await updateProfileAction({
      name: "New Name",
      aboutMe: "Hello there",
      avatar: await createImageFile(2000, 100, "avatar.png"),
    });
    expect(result).toMatchObject({ ok: false });
  });
});
