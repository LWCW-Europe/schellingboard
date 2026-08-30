import { describe, it, expect, beforeAll, afterAll } from "vitest";

import {
  listReleaseDumps,
  upgradeFromDump,
  disposeUpgradedDb,
  appliedMigrationCount,
  migrationFileCount,
  schemaOfUpgradedDb,
  schemaOfFreshDb,
} from "../helpers/upgrade-db";
import {
  createGuest,
  createLocation,
  createDay,
  createProposal,
  createSession,
} from "../helpers/factories";
import {
  changelogReleases,
  compareVersions,
  readManifest,
} from "@/scripts/release-dumps";
import { getRepositories } from "@/db/container";
import { VoteChoice } from "@/db/repositories/interfaces";

const dumps = listReleaseDumps();
const manifest = readManifest();

describe("release upgrade fixtures", () => {
  it("has a dump to upgrade from", () => {
    expect(dumps.map((d) => d.version)).not.toHaveLength(0);
  });

  it("says what covers every released version", () => {
    const missing = changelogReleases().filter(
      (version) =>
        compareVersions(version, manifest.oldestSupported) >= 0 &&
        !(version in manifest.coveredBy)
    );
    expect(
      missing,
      "released versions absent from tests/fixtures/upgrade/releases.json — " +
        "run `make dump-release-db VERSION=<version>` for each"
    ).toEqual([]);
  });

  it("names a stored dump for every version it records", () => {
    const stored = dumps.map((d) => d.version);
    expect(
      Object.values(manifest.coveredBy).filter((v) => !stored.includes(v)),
      "releases.json points at dumps that aren't in tests/fixtures/upgrade/"
    ).toEqual([]);
    expect(
      Object.keys(manifest.coveredBy).filter(
        (version) => !changelogReleases().includes(version)
      ),
      "releases.json names versions the changelog doesn't"
    ).toEqual([]);
  });

  it("records what every stored dump is there for", () => {
    const covering = new Set(Object.values(manifest.coveredBy));
    expect(
      dumps.map((d) => d.version).filter((version) => !covering.has(version)),
      "dumps in tests/fixtures/upgrade/ that no release points at"
    ).toEqual([]);
  });
});

describe.each(dumps)("upgrading from $version", (dump) => {
  beforeAll(() => {
    upgradeFromDump(dump);
  });

  afterAll(() => {
    disposeUpgradedDb();
  });

  it("applies every migration", () => {
    expect(appliedMigrationCount()).toBe(migrationFileCount());
  });

  it("ends up with the schema a fresh database gets", () => {
    expect(schemaOfUpgradedDb()).toEqual(schemaOfFreshDb());
  });

  it("still reads the data the old release wrote", async () => {
    const { events, guests, sessionProposals, sessions } = getRepositories();

    const allEvents = await events.list();
    expect(allEvents).not.toHaveLength(0);
    expect(await guests.listAttendees()).not.toHaveLength(0);

    const proposals = (
      await Promise.all(
        allEvents.map((e) => sessionProposals.listByEvent(e.id))
      )
    ).flat();
    const allSessions = (
      await Promise.all(allEvents.map((e) => sessions.listByEvent(e.id)))
    ).flat();
    expect(proposals).not.toHaveLength(0);
    expect(allSessions).not.toHaveLength(0);

    // The seeded data every release produced: votes on proposals, and
    // sessions with a host, a room and RSVPs.
    expect(proposals.some((p) => p.votesCount > 0)).toBe(true);
    expect(allSessions.some((s) => s.hosts.length > 0)).toBe(true);
    expect(allSessions.some((s) => s.locations.length > 0)).toBe(true);
    expect(allSessions.some((s) => s.numRsvps > 0)).toBe(true);
  });

  it("supports CRUD on proposals and votes", async () => {
    const { events, sessionProposals, votes } = getRepositories();
    const event = (await events.list())[0];
    const host = await createGuest({ eventId: event.id });

    const proposal = await createProposal(event.id, [host.id], {
      title: "Upgrade proposal",
    });
    await votes.upsert({
      proposalId: proposal.id,
      guestId: host.id,
      choice: VoteChoice.interested,
    });
    expect(await votes.listByGuestAndEvent(host.id, event.id)).toHaveLength(1);

    await sessionProposals.update(proposal.id, {
      title: "Upgrade proposal v2",
    });
    const updated = await sessionProposals.findById(proposal.id);
    expect(updated?.title).toBe("Upgrade proposal v2");
    expect(updated?.interestedVotesCount).toBe(1);

    await sessionProposals.delete(proposal.id);
    expect(await sessionProposals.findById(proposal.id)).toBeUndefined();
    expect(await votes.listByGuestAndEvent(host.id, event.id)).toHaveLength(0);
  });

  it("supports CRUD on sessions, rooms and RSVPs", async () => {
    const { events, sessions, rsvps, locations, days } = getRepositories();
    const event = (await events.list())[0];
    const host = await createGuest({ eventId: event.id });
    const attendee = await createGuest({ eventId: event.id });
    const room = await createLocation({ eventId: event.id });
    const day = await createDay(event.id);

    const session = await createSession(event.id, {
      title: "Upgrade session",
      hostIds: [host.id],
      locationIds: [room.id],
      startTime: day.startBookings,
      endTime: new Date(day.startBookings.getTime() + 60 * 60 * 1000),
    });
    await rsvps.create({ sessionId: session.id, guestId: attendee.id });

    const stored = await sessions.findById(session.id);
    expect(stored?.hosts.map((h) => h.id)).toEqual([host.id]);
    expect(stored?.locations.map((l) => l.id)).toEqual([room.id]);
    expect(stored?.numRsvps).toBe(1);
    expect(
      await sessions.findLocationConflict(
        event.id,
        session.startTime!,
        session.endTime!,
        [room.id]
      )
    ).toBeDefined();

    await sessions.update(session.id, { title: "Upgrade session v2" });
    expect((await sessions.findById(session.id))?.title).toBe(
      "Upgrade session v2"
    );
    expect(await sessions.listRsvpdByGuest(attendee.id)).toHaveLength(1);

    await rsvps.deleteBySessionAndGuest(session.id, attendee.id);
    await sessions.delete(session.id);
    await days.delete(day.id);
    await locations.delete(room.id);
    expect(await sessions.findById(session.id)).toBeUndefined();
    expect(await locations.findById(room.id)).toBeUndefined();
  });

  it("supports CRUD on comments", async () => {
    const { events, comments, proposalComments } = getRepositories();
    const event = (await events.list())[0];
    const author = await createGuest({ eventId: event.id });
    const proposal = await createProposal(event.id, [author.id]);

    const comment = await proposalComments.create({
      subjectId: proposal.id,
      authorId: author.id,
      body: "Upgraded comment",
      createdTime: new Date(),
    });
    await comments.toggleLike({
      commentId: comment.id,
      guestId: author.id,
      createdTime: new Date(),
    });
    await comments.update(comment.id, {
      body: "Upgraded comment, edited",
      editedTime: new Date(),
    });

    const [stored] = await proposalComments.list(proposal.id);
    expect(stored.body).toBe("Upgraded comment, edited");
    expect(stored.likes.map((l) => l.id)).toEqual([author.id]);

    await comments.delete(comment.id);
    expect(await proposalComments.list(proposal.id)).toHaveLength(0);
  });

  it("supports CRUD on guests, their profiles and the site settings", async () => {
    const { guests, settings } = getRepositories();
    const guest = await createGuest();

    await guests.updateProfile(
      guest.id,
      {
        name: "Upgraded Guest",
        aboutMe: "Survived the upgrade",
        avatarUrl: null,
        pronouns: "they/them",
        basedIn: "Berlin",
        prompts: [{ prompt: "Ask me about", answer: "migrations" }],
        languages: ["en"],
        contacts: [{ type: "email", value: "upgrade@test.example" }],
      },
      new Date()
    );
    const stored = await guests.findById(guest.id);
    expect(stored?.name).toBe("Upgraded Guest");
    expect(stored?.prompts).toEqual([
      { prompt: "Ask me about", answer: "migrations" },
    ]);

    const before = await settings.get();
    expect(await settings.update({ title: "Upgraded site" })).toMatchObject({
      title: "Upgraded site",
    });
    await settings.update({ title: before.title });

    await guests.delete(guest.id);
    expect(await guests.findById(guest.id)).toBeUndefined();
  });
});
