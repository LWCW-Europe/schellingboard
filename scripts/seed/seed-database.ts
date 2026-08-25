import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { DateTime } from "luxon";
import * as schema from "@/db/schema";
import { resolveDbPath, runMigrations } from "@/db/migrate";
import { eventNameToSlug } from "@/utils/utils";
import { uploadsDir } from "@/utils/uploads-dir";
import { VoteChoice } from "@/db/repositories/interfaces";
import { hashUserPassword } from "@/utils/user-credentials";
import { createSeededRandom } from "./random";
import { generateBulkGuests, generateBulkProposals } from "./bulk";
import {
  guestConfigs,
  hasProfileFields,
  type GuestConfig,
} from "./data/guests";
import { gammaSessionConfigs } from "./data/gamma-schedule";
import { locationRows } from "./data/locations";
import {
  sessionTemplates,
  eventSpecificProposals,
  eventSpecificTitlePatterns,
  gammaExtraProposals,
  commentOpeners,
  commentReplies,
  commentFollowUps,
} from "./data/templates";

const TZ = "Europe/Berlin";

// Returns a UTC Date representing the given clock time on a specific day in Berlin.
// dayOffset is added to baseDate's Berlin calendar date before setting the time.
function berlinTime(
  baseDate: Date,
  dayOffset: number,
  hour: number,
  minute = 0
): Date {
  return DateTime.fromJSDate(baseDate)
    .setZone(TZ)
    .plus({ days: dayOffset })
    .set({ hour, minute, second: 0, millisecond: 0 })
    .toJSDate();
}

const mode = process.env.NODE_ENV ?? "dev";
const envFileLocal = path.resolve(process.cwd(), `.env.${mode}.local`);
const envFileShared = path.resolve(process.cwd(), `.env.${mode}`);
const envFile = fs.existsSync(envFileLocal)
  ? envFileLocal
  : fs.existsSync(envFileShared)
    ? envFileShared
    : null;
if (envFile) dotenv.config({ path: envFile });

if (process.env.NODE_ENV === "production") {
  throw new Error("🚨 SAFETY: Cannot reset production database!");
}

// "small" is the hand-curated fixture set the E2E suite pins on; "large"
// layers a few hundred procedurally generated guests/proposals (see bulk.ts)
// on top for realistic manual testing. Tests must always run "small" so the
// bulk layer stays freely changeable.
export type SeedProfile = "small" | "large";

export function resolveProfile(): SeedProfile {
  const fromEnv = process.env.SEED_PROFILE;
  if (fromEnv === "small" || fromEnv === "large") return fromEnv;
  if (fromEnv) {
    throw new Error(`Invalid SEED_PROFILE "${fromEnv}" (use small or large)`);
  }
  return process.env.NODE_ENV === "test" ? "small" : "large";
}

const BULK_GUEST_COUNT = 360; // + 40 curated = 400 total
// Proposals per event (Alpha is mid-proposal-phase, so fewer). The small
// numbers predate profiles and are what the E2E suite was written against.
const PROPOSAL_COUNTS: Record<SeedProfile, number[]> = {
  small: [8, 10, sessionTemplates.length],
  large: [150, 300, 300],
};

function openDb() {
  const sqlite = new Database(resolveDbPath());
  // Enforce foreign keys on every connection; runMigrations toggles it off and
  // back on internally.
  sqlite.pragma("foreign_keys = ON");
  const migrationsFolder = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../drizzle"
  );
  runMigrations(sqlite, migrationsFolder);
  return drizzle(sqlite, { schema });
}

// Two independent RNG streams: the curated stream must consume values in
// exactly the historical order so the small profile keeps producing the data
// the E2E suite was written against; bulk generation draws from its own
// stream so adding/changing it can never shift the curated sequence.
const seededRandom = createSeededRandom(42);
const bulkRng = createSeededRandom(1337);

// SQLite limits bind variables per statement; large-profile tables (votes are
// the biggest at ~100k rows) must be inserted in chunks.
const INSERT_CHUNK = 2000;
function insertChunked<T>(
  rows: T[],
  insert: (chunk: T[]) => { run(): unknown }
): void {
  for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
    insert(rows.slice(i, i + INSERT_CHUNK)).run();
  }
}

function generateEventDates() {
  const today = new Date();
  const phaseDuration = 14;
  const middleOffset = 7;
  // Lead time between the start of scheduling work and the event itself.
  // The scheduling phase stays open through the whole live event, so
  // schedulingPhaseEnd always equals the event's end date.
  const schedulingLeadTime = 21;

  // Event 1: Currently in proposal phase
  const e1PropStart = new Date(today);
  e1PropStart.setDate(today.getDate() - middleOffset);
  const e1PropEnd = new Date(e1PropStart);
  e1PropEnd.setDate(e1PropStart.getDate() + phaseDuration);
  const e1VoteStart = new Date(e1PropEnd);
  const e1VoteEnd = new Date(e1VoteStart);
  e1VoteEnd.setDate(e1VoteStart.getDate() + phaseDuration);
  const e1SchedStart = new Date(e1VoteEnd);
  // Align the event with the seeded Day windows (09:00–18:00 Berlin) so the
  // exclusive schedulingPhaseEnd doesn't cut off the last day early.
  const e1Start = berlinTime(e1SchedStart, schedulingLeadTime, 9, 0);
  const e1End = berlinTime(e1Start, 2, 18, 0);
  const e1SchedEnd = new Date(e1End);

  // Event 2: Currently in voting phase
  const e2VoteStart = new Date(today);
  e2VoteStart.setDate(today.getDate() - middleOffset);
  const e2VoteEnd = new Date(e2VoteStart);
  e2VoteEnd.setDate(e2VoteStart.getDate() + phaseDuration);
  const e2PropStart = new Date(e2VoteStart);
  e2PropStart.setDate(e2VoteStart.getDate() - phaseDuration);
  const e2PropEnd = new Date(e2VoteStart);
  const e2SchedStart = new Date(e2VoteEnd);
  const e2Start = berlinTime(e2SchedStart, schedulingLeadTime, 9, 0);
  const e2End = berlinTime(e2Start, 2, 18, 0);
  const e2SchedEnd = new Date(e2End);

  // Event 3: Currently in scheduling phase
  const e3SchedStart = new Date(today);
  e3SchedStart.setDate(today.getDate() - middleOffset);
  const e3VoteStart = new Date(e3SchedStart);
  e3VoteStart.setDate(e3SchedStart.getDate() - phaseDuration);
  const e3VoteEnd = new Date(e3SchedStart);
  const e3PropStart = new Date(e3VoteStart);
  e3PropStart.setDate(e3VoteStart.getDate() - phaseDuration);
  const e3PropEnd = new Date(e3VoteStart);
  const e3Start = berlinTime(e3SchedStart, schedulingLeadTime, 9, 0);
  // Gamma's last day runs into the small hours (see the day seeding below), so
  // the event — and with it the scheduling phase — ends at 03:00 the morning
  // after day 2, not at 18:00.
  const e3End = berlinTime(e3Start, 3, 3, 0);
  const e3SchedEnd = new Date(e3End);

  return [
    {
      name: "Conference Alpha",
      description: "Event currently in proposal phase",
      icon: "AcademicCapIcon",
      start: e1Start,
      end: e1End,
      proposalPhaseStart: e1PropStart,
      proposalPhaseEnd: e1PropEnd,
      votingPhaseStart: e1VoteStart,
      votingPhaseEnd: e1VoteEnd,
      schedulingPhaseStart: e1SchedStart,
      schedulingPhaseEnd: e1SchedEnd,
    },
    {
      name: "Conference Beta",
      // Markdown: seeded descriptions mix markdown and plain text so both
      // render paths stay exercised in dev and e2e environments.
      description:
        "Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.",
      icon: "BeakerIcon",
      start: e2Start,
      end: e2End,
      proposalPhaseStart: e2PropStart,
      proposalPhaseEnd: e2PropEnd,
      votingPhaseStart: e2VoteStart,
      votingPhaseEnd: e2VoteEnd,
      schedulingPhaseStart: e2SchedStart,
      schedulingPhaseEnd: e2SchedEnd,
    },
    {
      name: "Conference Gamma",
      description:
        "Event currently in **scheduling phase**.\n\n### Quick links\n\n- [Venue map](https://test-event-3.example.com/map)\n- [Code of conduct](https://test-event-3.example.com/coc)",
      icon: "GlobeAltIcon",
      start: e3Start,
      end: e3End,
      proposalPhaseStart: e3PropStart,
      proposalPhaseEnd: e3PropEnd,
      votingPhaseStart: e3VoteStart,
      votingPhaseEnd: e3VoteEnd,
      schedulingPhaseStart: e3SchedStart,
      schedulingPhaseEnd: e3SchedEnd,
    },
  ];
}

// Committed CC0 avatar images (see scripts/seed-assets/avatars/README.md);
// copied into SB_UPLOADS_DIR at seed time like real uploads.
const seedAvatarsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../seed-assets/avatars"
);

function uploadedAvatarsDir(): string {
  return path.join(uploadsDir(), "avatars");
}

// clearAll() recursively deletes subdirectories of the uploads dir. Guard
// against a misconfigured SB_UPLOADS_DIR (a stray absolute path, a shared
// volume) by refusing to delete anything that isn't strictly inside the
// project directory. Returns the validated, resolved base path.
function assertSafeUploadsDir(dir: string): string {
  const resolved = path.resolve(dir);
  const root = path.resolve(process.cwd());
  if (resolved === root || !resolved.startsWith(root + path.sep)) {
    throw new Error(
      `🚨 SAFETY: refusing to clear uploads dir outside the project: ${resolved}`
    );
  }
  return resolved;
}

function clearAll() {
  console.log("🧹 Clearing all tables...");
  // Validate the uploads dir before opening the DB or deleting anything.
  const uploadsBase = assertSafeUploadsDir(uploadsDir());
  const db = openDb();
  db.delete(schema.commentLikes).run();
  db.delete(schema.proposalComments).run();
  db.delete(schema.comments).run();
  db.delete(schema.votes).run();
  db.delete(schema.rsvps).run();
  db.delete(schema.sessionLocations).run();
  db.delete(schema.sessionHosts).run();
  db.delete(schema.sessions).run();
  db.delete(schema.proposalHosts).run();
  db.delete(schema.sessionProposals).run();
  db.delete(schema.days).run();
  db.delete(schema.eventGuests).run();
  db.delete(schema.eventLocations).run();
  db.delete(schema.events).run();
  db.delete(schema.locations).run();
  db.delete(schema.guests).run();
  db.delete(schema.siteSettings).run();
  // Avatar files belong to the guest rows just deleted; remove them too so
  // repeated seeding doesn't accumulate orphaned uploads. Likewise the map
  // upload belongs to the site-settings row just cleared.
  fs.rmSync(path.join(uploadsBase, "avatars"), {
    recursive: true,
    force: true,
  });
  fs.rmSync(path.join(uploadsBase, "site"), { recursive: true, force: true });
  console.log("  ✅ All tables cleared");
}

async function seedTestData(profile: SeedProfile) {
  console.log(`🌱 Seeding test data (${profile} profile)...`);
  const db = openDb();

  const eventConfigs = generateEventDates();
  console.log(`📅 Generated dynamic dates for ${eventConfigs.length} events`);
  console.log(`🗓️  Today is: ${new Date().toISOString().split("T")[0]}`);

  // Guests: curated fixtures first — E2E host assignment is index-based, so
  // bulk guests must only ever be appended.
  console.log("  📝 Creating test guests...");
  const allGuestConfigs: GuestConfig[] =
    profile === "large"
      ? [...guestConfigs, ...generateBulkGuests(BULK_GUEST_COUNT, bulkRng)]
      : guestConfigs;
  fs.mkdirSync(uploadedAvatarsDir(), { recursive: true });
  const guestRows = await Promise.all(
    allGuestConfigs.map(async (config, index) => {
      const id = nanoid();
      let avatarUrl: string | null = null;
      if (config.avatar !== undefined) {
        const filename = `${id}.webp`;
        fs.copyFileSync(
          path.join(
            seedAvatarsDir,
            `avatar-${String(config.avatar).padStart(2, "0")}.webp`
          ),
          path.join(uploadedAvatarsDir(), filename)
        );
        avatarUrl = `/media/avatars/${filename}?v=${Date.now()}`;
      }
      const passwordHash = config.password
        ? await hashUserPassword(config.password)
        : null;
      // The app stamps this when a guest saves their profile; the seed writes
      // rows directly, so it has to stamp them itself or "Recently updated"
      // has nothing to sort. Spread over the past month, oldest last, so the
      // list shows a range of ages. Guests with nothing filled in keep a null
      // stamp — they have never edited a profile.
      const hasProfile = hasProfileFields(config);
      return {
        id,
        name: config.name,
        email: config.email,
        aboutMe: config.aboutMe ?? null,
        pronouns: config.pronouns ?? null,
        avatarUrl,
        basedIn: config.basedIn ?? null,
        languages: config.languages ?? null,
        prompts: config.prompts ?? null,
        contacts: config.contacts ?? null,
        profileUpdatedAt: hasProfile
          ? new Date(
              Date.now() -
                (config.profileAgeHours ?? index * 19 + 3) * 60 * 60 * 1000
            ).toISOString()
          : null,
        authProtected: passwordHash !== null,
        passwordHash,
      };
    })
  );
  insertChunked(guestRows, (chunk) => db.insert(schema.guests).values(chunk));
  const avatarCount = guestRows.filter((g) => g.avatarUrl).length;
  const protectedCount = guestRows.filter((g) => g.authProtected).length;
  console.log(
    `  ✅ Created ${guestRows.length} guests (${avatarCount} with avatars, ${protectedCount} with account protection)`
  );

  const guestIdByName = (name: string): string => {
    const guest = guestRows.find((g) => g.name === name);
    if (!guest) throw new Error(`Unknown seed guest: ${name}`);
    return guest.id;
  };

  // Locations
  console.log("  📍 Creating test locations...");
  db.insert(schema.locations).values(locationRows).run();
  console.log(`  ✅ Created ${locationRows.length} locations`);

  // Events
  console.log("  🎪 Creating test events...");
  const eventRows = eventConfigs.map((config, index) => ({
    id: nanoid(),
    name: config.name,
    slug: eventNameToSlug(config.name),
    description: config.description,
    icon: config.icon,
    website: `https://test-event-${index + 1}.example.com`,
    start: config.start.toISOString(),
    end: config.end.toISOString(),
    proposalPhaseStart: config.proposalPhaseStart.toISOString(),
    proposalPhaseEnd: config.proposalPhaseEnd.toISOString(),
    votingPhaseStart: config.votingPhaseStart.toISOString(),
    votingPhaseEnd: config.votingPhaseEnd.toISOString(),
    schedulingPhaseStart: config.schedulingPhaseStart.toISOString(),
    schedulingPhaseEnd: config.schedulingPhaseEnd.toISOString(),
    timezone: TZ,
    maxSessionDuration: 120,
    breakMinutes: 10,
  }));
  db.insert(schema.events).values(eventRows).run();
  console.log(`  ✅ Created ${eventRows.length} events`);

  // Link all guests and locations to all events
  const eventGuestRows = eventRows.flatMap((ev) =>
    guestRows.map((g) => ({ eventId: ev.id, guestId: g.id }))
  );
  const eventLocationRows = eventRows.flatMap((ev) =>
    locationRows.map((l) => ({ eventId: ev.id, locationId: l.id }))
  );
  insertChunked(eventGuestRows, (chunk) =>
    db.insert(schema.eventGuests).values(chunk)
  );
  db.insert(schema.eventLocations).values(eventLocationRows).run();

  // Days (3 per event, 09:00–18:00 Berlin, bookable 09:00–17:30 Berlin).
  // Exception: Conference Gamma's last day is a party night that runs to 03:00
  // the next morning, bookable until 02:30 — the fixture for scheduling
  // sessions after midnight, on the night with no following day entry.
  console.log("  📅 Creating test days...");
  const dayRows = eventRows.flatMap((ev, eventIndex) => {
    const config = eventConfigs[eventIndex];
    return [0, 1, 2].map((dayIndex) => {
      const lateNight = ev.name === "Conference Gamma" && dayIndex === 2;
      return {
        id: nanoid(),
        start: berlinTime(config.start, dayIndex, 9, 0).toISOString(),
        end: berlinTime(
          config.start,
          lateNight ? dayIndex + 1 : dayIndex,
          lateNight ? 3 : 18,
          0
        ).toISOString(),
        startBookings: berlinTime(config.start, dayIndex, 9, 0).toISOString(),
        endBookings: berlinTime(
          config.start,
          lateNight ? dayIndex + 1 : dayIndex,
          lateNight ? 2 : 17,
          30
        ).toISOString(),
        eventId: ev.id,
      };
    });
  });
  db.insert(schema.days).values(dayRows).run();
  console.log(
    `  ✅ Created ${dayRows.length} days across ${eventRows.length} events`
  );

  // Session proposals
  console.log("  💡 Creating test session proposals...");
  const proposalRows: (typeof schema.sessionProposals.$inferInsert)[] = [];
  const proposalHostRows: (typeof schema.proposalHosts.$inferInsert)[] = [];

  eventRows.forEach((ev, eventIndex) => {
    const eventName = eventConfigs[eventIndex].name;
    // Later phases have accumulated more proposals; Gamma (scheduling) gets
    // at least all curated templates so gammaSessionConfigs can schedule any
    // of them. Beyond the curated templates, titles come from the bulk
    // generator (large profile only).
    const numProposals = PROPOSAL_COUNTS[profile][eventIndex];
    const bulkCount = Math.max(0, numProposals - sessionTemplates.length);
    const templates =
      bulkCount > 0
        ? [...sessionTemplates, ...generateBulkProposals(bulkCount, bulkRng)]
        : sessionTemplates;

    for (let i = 0; i < numProposals; i++) {
      const template = templates[i];
      const hostIndex = (eventIndex + i) % guestRows.length;
      const hostProbability = seededRandom();
      let hostIds: string[];
      if (hostProbability < 0.2) {
        hostIds = [];
      } else if (hostProbability < 0.4) {
        hostIds = [
          guestRows[hostIndex].id,
          guestRows[(hostIndex + 1) % guestRows.length].id,
        ];
      } else {
        hostIds = [guestRows[hostIndex].id];
      }

      const possibleDurations = [undefined, 30, 60, 90, 120, 150, 180];
      const duration =
        possibleDurations[
          Math.floor(seededRandom() * possibleDurations.length)
        ];

      const proposalId = nanoid();
      proposalRows.push({
        id: proposalId,
        eventId: ev.id,
        title: template.title,
        description: template.description,
        durationMinutes: duration ?? null,
        createdTime: new Date().toISOString(),
      });
      for (const guestId of hostIds) {
        proposalHostRows.push({ proposalId, guestId });
      }
    }

    eventSpecificProposals(eventName).forEach((p, pIndex) => {
      const proposalId = nanoid();
      const guestId = guestRows[(eventIndex + pIndex) % guestRows.length].id;
      proposalRows.push({
        id: proposalId,
        eventId: ev.id,
        title: p.title,
        description: p.description,
        durationMinutes: 30,
        createdTime: new Date().toISOString(),
      });
      proposalHostRows.push({ proposalId, guestId });
    });
  });

  for (const p of gammaExtraProposals) {
    const proposalId = nanoid();
    proposalRows.push({
      id: proposalId,
      eventId: eventRows[2].id,
      title: p.title,
      description: p.description,
      durationMinutes: p.durationMinutes,
      createdTime: new Date().toISOString(),
    });
    for (const name of p.hostNames) {
      proposalHostRows.push({ proposalId, guestId: guestIdByName(name) });
    }
  }

  // Conference Gamma is mid-scheduling: most of its proposals get scheduled
  // as sessions below (gammaSessionConfigs). Align each scheduled proposal's
  // hosts and duration with its session so the data stays consistent — and so
  // the vote seeding below skips the real hosts.
  const gammaEvent = eventRows[2];
  for (const cfg of gammaSessionConfigs) {
    if (!cfg.fromProposal) continue;
    const proposal = proposalRows.find(
      (p) => p.eventId === gammaEvent.id && p.title === cfg.title
    );
    if (!proposal) {
      throw new Error(`No seeded Gamma proposal titled "${cfg.title}"`);
    }
    for (let i = proposalHostRows.length - 1; i >= 0; i--) {
      if (proposalHostRows[i].proposalId === proposal.id) {
        proposalHostRows.splice(i, 1);
      }
    }
    proposalHostRows.push(
      ...cfg.hostNames.map((name) => ({
        proposalId: proposal.id,
        guestId: guestIdByName(name),
      }))
    );
    proposal.durationMinutes =
      cfg.end[0] * 60 + cfg.end[1] - (cfg.start[0] * 60 + cfg.start[1]);
  }

  insertChunked(proposalRows, (chunk) =>
    db.insert(schema.sessionProposals).values(chunk)
  );
  insertChunked(proposalHostRows, (chunk) =>
    db.insert(schema.proposalHosts).values(chunk)
  );
  console.log(
    `  ✅ Created ${proposalRows.length} session proposals across ${eventRows.length} events`
  );

  // Host lookup by proposal — the per-pair scans this replaces were fine for
  // 40×50 but not for the large profile's 400×750.
  const hostsByProposal = new Map<string, string[]>();
  for (const ph of proposalHostRows) {
    const hosts = hostsByProposal.get(ph.proposalId) ?? [];
    hosts.push(ph.guestId);
    hostsByProposal.set(ph.proposalId, hosts);
  }

  // Votes (for Beta and Gamma events)
  console.log("  🗳️  Creating test votes...");
  const voteChoices = [
    { choice: VoteChoice.interested, weight: 40 },
    { choice: VoteChoice.maybe, weight: 35 },
    { choice: VoteChoice.skip, weight: 25 },
  ];

  const voteRows: (typeof schema.votes.$inferInsert)[] = [];

  eventRows.forEach((ev, eventIndex) => {
    const eventName = eventConfigs[eventIndex].name;
    if (eventName !== "Conference Beta" && eventName !== "Conference Gamma") {
      return;
    }

    const eventProposals = proposalRows.filter(
      (p) =>
        p.eventId === ev.id &&
        !eventSpecificTitlePatterns.some((re) => re.test(p.title))
    );

    guestRows.forEach((guest) => {
      eventProposals.forEach((proposal) => {
        const isHost =
          hostsByProposal.get(proposal.id)?.includes(guest.id) ?? false;
        if (!isHost && seededRandom() < 0.4) {
          const randomValue = seededRandom() * 100;
          let cumulativeWeight = 0;
          let selectedChoice = VoteChoice.interested;
          for (const { choice, weight } of voteChoices) {
            cumulativeWeight += weight;
            if (randomValue <= cumulativeWeight) {
              selectedChoice = choice;
              break;
            }
          }
          voteRows.push({
            id: nanoid(),
            proposalId: proposal.id,
            guestId: guest.id,
            choice: selectedChoice,
          });
        }
      });
    });
  });

  insertChunked(voteRows, (chunk) => db.insert(schema.votes).values(chunk));
  console.log(`  ✅ Created ${voteRows.length} votes`);

  console.log("  💬 Creating test comments...");
  const commentRows: (typeof schema.comments.$inferInsert)[] = [];
  const proposalCommentRows: (typeof schema.proposalComments.$inferInsert)[] =
    [];

  const addComment = (
    proposalId: string,
    guestId: string,
    body: string,
    minutesAgo: number,
    parentId?: string,
    edited?: boolean
  ) => {
    const id = nanoid();
    const createdTime = new Date(Date.now() - minutesAgo * 60_000);
    commentRows.push({
      id,
      authorId: guestId,
      parentId: parentId ?? null,
      body,
      createdTime: createdTime.toISOString(),
      editedTime: edited
        ? new Date(createdTime.getTime() + 4 * 60_000).toISOString()
        : null,
    });
    proposalCommentRows.push({ commentId: id, proposalId });
    return id;
  };

  eventRows.forEach((ev) => {
    const commentable = proposalRows.filter(
      (p) =>
        p.eventId === ev.id &&
        !eventSpecificTitlePatterns.some((re) => re.test(p.title))
    );

    commentable.forEach((proposal, index) => {
      if (seededRandom() < 0.45) return;

      const proposalHosts = hostsByProposal.get(proposal.id) ?? [];
      const nonHosts = guestRows.filter((g) => !proposalHosts.includes(g.id));
      if (nonHosts.length < 3) return;
      const host = proposalHosts[0];

      const opener = addComment(
        proposal.id,
        nonHosts[index % nonHosts.length].id,
        commentOpeners[index % commentOpeners.length],
        600 - index * 7,
        undefined,
        index % 5 === 0
      );

      if (host && seededRandom() < 0.7) {
        const reply = addComment(
          proposal.id,
          host,
          commentReplies[index % commentReplies.length],
          540 - index * 7,
          opener
        );
        if (seededRandom() < 0.5) {
          addComment(
            proposal.id,
            nonHosts[(index + 1) % nonHosts.length].id,
            commentFollowUps[index % commentFollowUps.length],
            480 - index * 7,
            reply
          );
        }
      }

      if (seededRandom() < 0.3) {
        addComment(
          proposal.id,
          nonHosts[(index + 2) % nonHosts.length].id,
          "Seconding the above — this is the session I'd most like to attend.",
          420 - index * 7
        );
      }
    });
  });

  // A known thread with two sibling replies, so tests can assert on branching
  // without having to build it by hand.
  const branching = proposalRows.find(
    (p) =>
      p.title ===
      "Conference Gamma Panel: Industry Leaders Share Their Insights"
  );
  if (branching) {
    const asker = guestRows[3].id;
    const root = addComment(
      branching.id,
      asker,
      "Who else is on the panel?",
      300
    );
    addComment(branching.id, guestRows[4].id, "I'd like to join.", 240, root);
    addComment(branching.id, guestRows[5].id, "So would I.", 180, root);
  }

  const deletedWithReply = commentRows.find(
    (c) => c.parentId && commentRows.some((p) => p.id === c.parentId)
  );
  if (deletedWithReply?.parentId) {
    const tombstone = commentRows.find(
      (c) => c.id === deletedWithReply.parentId
    )!;
    tombstone.authorId = null;
    tombstone.body = "";
    tombstone.deleted = true;
    tombstone.editedTime = null;
  }

  const likeRows: (typeof schema.commentLikes.$inferInsert)[] = [];
  commentRows.forEach((comment, index) => {
    if (comment.deleted) return;
    const likers = guestRows.filter((g) => g.id !== comment.authorId);
    const count = Math.min(Math.floor(seededRandom() * 4), likers.length);
    for (let i = 0; i < count; i++) {
      likeRows.push({
        commentId: comment.id,
        guestId: likers[(index + i) % likers.length].id,
        createdTime: new Date(Date.now() - (60 + i) * 60_000).toISOString(),
      });
    }
  });

  insertChunked(commentRows, (chunk) =>
    db.insert(schema.comments).values(chunk)
  );
  insertChunked(proposalCommentRows, (chunk) =>
    db.insert(schema.proposalComments).values(chunk)
  );
  insertChunked(likeRows, (chunk) =>
    db.insert(schema.commentLikes).values(chunk)
  );
  console.log(
    `  ✅ Created ${commentRows.length} comments and ${likeRows.length} likes`
  );

  // Sessions: one keynote + lunch blockers per event, plus a filled-out
  // schedule for Conference Gamma (scheduling phase).
  console.log("  🎯 Creating test sessions...");
  const sessionRows: (typeof schema.sessions.$inferInsert)[] = [];
  const sessionHostRows: (typeof schema.sessionHosts.$inferInsert)[] = [];
  const sessionLocationRows: (typeof schema.sessionLocations.$inferInsert)[] =
    [];

  eventRows.forEach((ev, eventIndex) => {
    const config = eventConfigs[eventIndex];

    // Opening keynote: 09:00–10:30 Berlin on day 1
    const keynoteId = nanoid();
    sessionRows.push({
      id: keynoteId,
      title: `Opening Keynote - ${config.name}`,
      description: `Welcome to ${config.name}`,
      startTime: berlinTime(config.start, 0, 9, 0).toISOString(),
      endTime: berlinTime(config.start, 0, 10, 30).toISOString(),
      eventId: ev.id,
      capacity: locationRows[0].capacity,
      adminManaged: true,
      blocker: false,
      closed: false,
    });
    sessionHostRows.push({
      sessionId: keynoteId,
      guestId: guestRows[eventIndex % guestRows.length].id,
    });
    sessionLocationRows.push({
      sessionId: keynoteId,
      locationId: locationRows[0].id,
    });

    // Lunch blockers: 12:30–14:00 Berlin, all rooms, all 3 days
    for (let dayIndex = 0; dayIndex < 3; dayIndex++) {
      const lunchId = nanoid();
      sessionRows.push({
        id: lunchId,
        title: "Lunch Break",
        description: "",
        startTime: berlinTime(config.start, dayIndex, 12, 30).toISOString(),
        endTime: berlinTime(config.start, dayIndex, 14, 0).toISOString(),
        eventId: ev.id,
        capacity: 0,
        adminManaged: true,
        blocker: true,
        closed: false,
      });
      for (const loc of locationRows) {
        sessionLocationRows.push({ sessionId: lunchId, locationId: loc.id });
      }
    }
  });

  // Conference Gamma's scheduled sessions (see gammaSessionConfigs)
  const gammaConfig = eventConfigs[2];
  for (const cfg of gammaSessionConfigs) {
    const proposal = cfg.fromProposal
      ? proposalRows.find(
          (p) => p.eventId === gammaEvent.id && p.title === cfg.title
        )
      : undefined;
    const sessionId = nanoid();
    sessionRows.push({
      id: sessionId,
      title: cfg.title,
      description: proposal?.description ?? cfg.description ?? "",
      startTime: berlinTime(
        gammaConfig.start,
        cfg.day,
        ...cfg.start
      ).toISOString(),
      endTime: berlinTime(gammaConfig.start, cfg.day, ...cfg.end).toISOString(),
      eventId: gammaEvent.id,
      capacity: cfg.capacity,
      adminManaged: cfg.adminManaged ?? false,
      blocker: false,
      closed: cfg.closed ?? false,
      proposalId: proposal?.id ?? null,
    });
    for (const name of cfg.hostNames) {
      sessionHostRows.push({ sessionId, guestId: guestIdByName(name) });
    }
    sessionLocationRows.push({
      sessionId,
      locationId: locationRows[cfg.location].id,
    });
  }

  // Large profile: pack Gamma's remaining grid with sessions scheduled from
  // its bulk proposals, so the schedule looks like a real mid-scheduling
  // event. Greedy fill per location/day, leaving random gaps; respects the
  // lunch blockers, the curated sessions and host availability.
  if (profile === "large") {
    const bulkSessionCount = scheduleBulkGammaSessions(
      proposalRows,
      hostsByProposal,
      gammaEvent.id,
      gammaConfig.start,
      sessionRows,
      sessionHostRows,
      sessionLocationRows
    );
    console.log(`  ➕ Scheduled ${bulkSessionCount} bulk Gamma sessions`);
  }

  insertChunked(sessionRows, (chunk) =>
    db.insert(schema.sessions).values(chunk)
  );
  insertChunked(sessionHostRows, (chunk) =>
    db.insert(schema.sessionHosts).values(chunk)
  );
  insertChunked(sessionLocationRows, (chunk) =>
    db.insert(schema.sessionLocations).values(chunk)
  );
  console.log(
    `  ✅ Created ${sessionRows.length} sessions across ${eventRows.length} events`
  );

  // RSVPs (Conference Gamma only — the server rejects RSVP changes outside
  // the scheduling phase). Guests skip sessions they host and sessions
  // overlapping one they already RSVP'd to. Bob Test and Yuki Tanaka never
  // RSVP the Opening Keynote: rsvp.spec.ts (Bob) and the admin RSVP-moderation
  // test (Yuki) use it as their clean "no prior RSVP" target.
  console.log("  🙋 Creating test RSVPs...");
  type SessionRow = (typeof sessionRows)[number];
  const overlaps = (a: SessionRow, b: SessionRow) =>
    a.startTime! < b.endTime! && b.startTime! < a.endTime!;
  const rsvpRows: (typeof schema.rsvps.$inferInsert)[] = [];
  const rsvpTargets = sessionRows
    .filter((s) => s.eventId === gammaEvent.id && !s.blocker)
    .sort((a, b) => a.startTime!.localeCompare(b.startTime!));
  const sessionHostPairs = new Set(
    sessionHostRows.map((sh) => `${sh.sessionId}|${sh.guestId}`)
  );
  const rsvpCountBySession = new Map<string, number>();
  for (const guest of guestRows) {
    // Hosted sessions make the guest busy for that slot
    const busy = rsvpTargets.filter((s) =>
      sessionHostPairs.has(`${s.id}|${guest.id}`)
    );
    for (const session of rsvpTargets) {
      const isKeynote = session.title.startsWith("Opening Keynote");
      if (
        isKeynote &&
        (guest.name === "Bob Test" || guest.name === "Yuki Tanaka")
      ) {
        continue;
      }
      if (busy.some((b) => b.id === session.id || overlaps(b, session))) {
        continue;
      }
      const count = rsvpCountBySession.get(session.id) ?? 0;
      if (count >= session.capacity!) continue;
      if (seededRandom() < (isKeynote ? 0.6 : 0.3)) {
        rsvpRows.push({
          id: nanoid(),
          sessionId: session.id,
          guestId: guest.id,
        });
        rsvpCountBySession.set(session.id, count + 1);
        busy.push(session);
      }
    }
  }
  insertChunked(rsvpRows, (chunk) => db.insert(schema.rsvps).values(chunk));
  console.log(`  ✅ Created ${rsvpRows.length} RSVPs`);

  console.log("✅ Test data seeded successfully");
}

function scheduleBulkGammaSessions(
  proposalRows: (typeof schema.sessionProposals.$inferInsert)[],
  hostsByProposal: Map<string, string[]>,
  gammaEventId: string,
  gammaStart: Date,
  sessionRows: (typeof schema.sessions.$inferInsert)[],
  sessionHostRows: (typeof schema.sessionHosts.$inferInsert)[],
  sessionLocationRows: (typeof schema.sessionLocations.$inferInsert)[]
): number {
  type Interval = [startMs: number, endMs: number];
  const intervalsOverlap = (a: Interval, b: Interval) =>
    a[0] < b[1] && b[0] < a[1];

  const sessionById = new Map(sessionRows.map((s) => [s.id, s]));
  const intervalOf = (s: (typeof sessionRows)[number]): Interval => [
    new Date(s.startTime!).getTime(),
    new Date(s.endTime!).getTime(),
  ];

  // Existing occupancy from keynote, lunch blockers and curated sessions.
  const locationBusy = new Map<string, Interval[]>();
  for (const sl of sessionLocationRows) {
    const s = sessionById.get(sl.sessionId);
    if (!s || s.eventId !== gammaEventId) continue;
    const busy = locationBusy.get(sl.locationId) ?? [];
    busy.push(intervalOf(s));
    locationBusy.set(sl.locationId, busy);
  }
  const hostBusy = new Map<string, Interval[]>();
  for (const sh of sessionHostRows) {
    const s = sessionById.get(sh.sessionId);
    if (!s || s.eventId !== gammaEventId) continue;
    const busy = hostBusy.get(sh.guestId) ?? [];
    busy.push(intervalOf(s));
    hostBusy.set(sh.guestId, busy);
  }

  const scheduledProposalIds = new Set(
    sessionRows.map((s) => s.proposalId).filter(Boolean)
  );
  const candidates = proposalRows.filter(
    (p) =>
      p.eventId === gammaEventId &&
      !scheduledProposalIds.has(p.id) &&
      (hostsByProposal.get(p.id)?.length ?? 0) > 0 &&
      !eventSpecificTitlePatterns.some((re) => re.test(p.title))
  );

  let candidateIndex = 0;
  let created = 0;
  const dayEndMinutes = 17 * 60 + 30; // bookable until 17:30 Berlin
  for (let day = 0; day < 3; day++) {
    for (const loc of locationRows) {
      let cursor = 9 * 60;
      while (
        cursor + 30 <= dayEndMinutes &&
        candidateIndex < candidates.length
      ) {
        // Random gaps keep the grid realistically incomplete — scheduling is
        // still in progress, and manual testing needs free slots to book.
        if (bulkRng() < 0.25) {
          cursor += 30;
          continue;
        }
        const proposal = candidates[candidateIndex];
        const duration = Math.max(
          30,
          Math.min(
            proposal.durationMinutes ?? [30, 60, 90][Math.floor(bulkRng() * 3)],
            120, // events are seeded with maxSessionDuration 120
            Math.floor((dayEndMinutes - cursor) / 30) * 30
          )
        );
        const start = berlinTime(
          gammaStart,
          day,
          Math.floor(cursor / 60),
          cursor % 60
        );
        const end = berlinTime(
          gammaStart,
          day,
          Math.floor((cursor + duration) / 60),
          (cursor + duration) % 60
        );
        const interval: Interval = [start.getTime(), end.getTime()];

        if (
          (locationBusy.get(loc.id) ?? []).some((b) =>
            intervalsOverlap(b, interval)
          )
        ) {
          cursor += 30;
          continue;
        }
        const hosts = hostsByProposal.get(proposal.id)!;
        if (
          hosts.some((h) =>
            (hostBusy.get(h) ?? []).some((b) => intervalsOverlap(b, interval))
          )
        ) {
          // Host already speaks elsewhere in this slot; drop the proposal
          // rather than the slot — there are far more candidates than slots.
          candidateIndex++;
          continue;
        }

        const sessionId = nanoid();
        sessionRows.push({
          id: sessionId,
          title: proposal.title,
          description: proposal.description ?? "",
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          eventId: gammaEventId,
          capacity: loc.capacity,
          adminManaged: false,
          blocker: false,
          closed: bulkRng() < 0.1,
          proposalId: proposal.id,
        });
        for (const h of hosts) {
          sessionHostRows.push({ sessionId, guestId: h });
          const busy = hostBusy.get(h) ?? [];
          busy.push(interval);
          hostBusy.set(h, busy);
        }
        sessionLocationRows.push({ sessionId, locationId: loc.id });
        const busy = locationBusy.get(loc.id) ?? [];
        busy.push(interval);
        locationBusy.set(loc.id, busy);

        candidateIndex++;
        created++;
        // 30-minute setup gap between sessions in the same room (the events
        // are seeded with breakMinutes 10, so this stays comfortably legal).
        cursor += duration + 30;
      }
    }
  }
  return created;
}

async function resetDatabase(profile: SeedProfile = resolveProfile()) {
  try {
    console.log("🔄 Resetting test database to known state...");
    console.log(`📍 Database: ${resolveDbPath()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "dev"}`);
    console.log(`📦 Seed profile: ${profile}`);

    clearAll();
    await seedTestData(profile);

    console.log("🎉 Database reset completed successfully!");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Database reset failed:", message);
    process.exit(1);
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  await resetDatabase();
}

export { resetDatabase, clearAll, seedTestData };
