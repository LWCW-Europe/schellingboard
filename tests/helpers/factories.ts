import { getRepositories } from "@/db/container";
import type {
  EmailSettings,
  Event,
  Guest,
  Location,
  Day,
  Session,
  SessionProposal,
} from "@/db/repositories/interfaces";
import { sanitizeGuest } from "@/utils/guests";

const DAY_MS = 24 * 60 * 60 * 1000;

// Date.now() alone can collide when two events (or guests) are created in
// the same millisecond, violating the unique event slug (or guest email).
let eventCounter = 0;
let guestCounter = 0;

export async function createEvent(opts?: {
  phase?: "proposal" | "voting" | "scheduling";
  name?: string;
  proposalPhaseStart?: Date;
  proposalPhaseEnd?: Date;
  votingPhaseStart?: Date;
  votingPhaseEnd?: Date;
  schedulingPhaseStart?: Date;
  schedulingPhaseEnd?: Date;
  slotIncrementMinutes?: number;
  rsvpCapacityHardLimit?: boolean;
}): Promise<Event> {
  const { events } = getRepositories();
  const now = new Date();
  const phase = opts?.phase ?? "proposal";

  let proposalPhaseStart: Date,
    proposalPhaseEnd: Date,
    votingPhaseStart: Date,
    votingPhaseEnd: Date,
    schedulingPhaseStart: Date,
    schedulingPhaseEnd: Date;

  if (phase === "proposal") {
    proposalPhaseStart = new Date(now.getTime() - 7 * DAY_MS);
    proposalPhaseEnd = new Date(now.getTime() + 7 * DAY_MS);
    votingPhaseStart = proposalPhaseEnd;
    votingPhaseEnd = new Date(votingPhaseStart.getTime() + 14 * DAY_MS);
    schedulingPhaseStart = votingPhaseEnd;
    schedulingPhaseEnd = new Date(schedulingPhaseStart.getTime() + 14 * DAY_MS);
  } else if (phase === "voting") {
    votingPhaseStart = new Date(now.getTime() - 7 * DAY_MS);
    votingPhaseEnd = new Date(now.getTime() + 7 * DAY_MS);
    proposalPhaseStart = new Date(votingPhaseStart.getTime() - 14 * DAY_MS);
    proposalPhaseEnd = votingPhaseStart;
    schedulingPhaseStart = votingPhaseEnd;
    schedulingPhaseEnd = new Date(schedulingPhaseStart.getTime() + 14 * DAY_MS);
  } else {
    schedulingPhaseStart = new Date(now.getTime() - 7 * DAY_MS);
    schedulingPhaseEnd = new Date(now.getTime() + 7 * DAY_MS);
    votingPhaseStart = new Date(schedulingPhaseStart.getTime() - 14 * DAY_MS);
    votingPhaseEnd = schedulingPhaseStart;
    proposalPhaseStart = new Date(votingPhaseStart.getTime() - 14 * DAY_MS);
    proposalPhaseEnd = votingPhaseStart;
  }

  const start = new Date(schedulingPhaseEnd.getTime() + 7 * DAY_MS);
  const end = new Date(start.getTime() + 2 * DAY_MS);

  return events.create({
    name: opts?.name ?? `Test Event ${++eventCounter}`,
    description: "",
    website: "",
    start,
    end,
    proposalPhaseStart: opts?.proposalPhaseStart ?? proposalPhaseStart,
    proposalPhaseEnd: opts?.proposalPhaseEnd ?? proposalPhaseEnd,
    votingPhaseStart: opts?.votingPhaseStart ?? votingPhaseStart,
    votingPhaseEnd: opts?.votingPhaseEnd ?? votingPhaseEnd,
    schedulingPhaseStart: opts?.schedulingPhaseStart ?? schedulingPhaseStart,
    schedulingPhaseEnd: opts?.schedulingPhaseEnd ?? schedulingPhaseEnd,
    maxSessionDuration: 120,
    breakMinutes: 10,
    slotIncrementMinutes: opts?.slotIncrementMinutes ?? 30,
    timezone: "UTC",
    rsvpCapacityHardLimit: opts?.rsvpCapacityHardLimit ?? false,
  });
}

export async function createGuest(opts?: {
  name?: string;
  email?: string;
  emailSettings?: EmailSettings;
  /** When set, the guest is also assigned to this event. */
  eventId?: string;
}): Promise<Guest> {
  const { guests } = getRepositories();
  const unique = ++guestCounter;
  const guest = await guests
    .create({
      name: opts?.name ?? `Test Guest ${unique}`,
      info: { email: opts?.email ?? `guest-${unique}@test.example` },
    })
    .then((g) => g && sanitizeGuest(g));
  if (opts?.emailSettings) {
    // Guests are created with default settings; non-default settings are
    // applied the way a real guest would, via their profile.
    await guests.updateProfile(guest.id, {
      name: guest.name,
      aboutMe: guest.aboutMe ?? null,
      avatarUrl: guest.avatarUrl ?? null,
      pronouns: guest.pronouns ?? null,
      basedIn: guest.basedIn ?? null,
      prompts: guest.prompts ?? null,
      languages: guest.languages ?? null,
      contacts: guest.contacts ?? null,
      emailSettings: opts.emailSettings,
    });
  }
  if (opts?.eventId) {
    await guests.assignToEvent(opts.eventId, [guest.id]);
  }
  return guest;
}

export async function createLocation(opts?: {
  name?: string;
  capacity?: number;
  bookable?: boolean;
  hidden?: boolean;
  sortIndex?: number;
}): Promise<Location> {
  const { locations } = getRepositories();
  return locations.create({
    name: opts?.name ?? `Test Room ${Date.now()}`,
    imageUrl: "",
    description: "",
    capacity: opts?.capacity ?? 30,
    color: "blue",
    hidden: opts?.hidden ?? false,
    bookable: opts?.bookable ?? true,
    sortIndex: opts?.sortIndex ?? 0,
  });
}

export async function createDay(
  eventId: string,
  opts?: { start?: Date; end?: Date; startBookings?: Date; endBookings?: Date }
): Promise<Day> {
  const { days } = getRepositories();
  const base =
    opts?.start ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      d.setHours(8, 0, 0, 0);
      return d;
    })();
  const end = opts?.end ?? new Date(new Date(base).setHours(18, 0, 0, 0));
  const startBookings =
    opts?.startBookings ?? new Date(new Date(base).setHours(9, 0, 0, 0));
  const endBookings =
    opts?.endBookings ?? new Date(new Date(base).setHours(17, 0, 0, 0));
  return days.create({ start: base, end, startBookings, endBookings, eventId });
}

export async function createProposal(
  eventId: string,
  hostIds: string[],
  opts?: { title?: string; description?: string; durationMinutes?: number }
): Promise<SessionProposal> {
  const { sessionProposals } = getRepositories();
  return sessionProposals.create({
    eventId,
    title: opts?.title ?? `Test Proposal ${Date.now()}`,
    description: opts?.description,
    hostIds,
    durationMinutes: opts?.durationMinutes,
  });
}

export async function createSession(
  eventId: string,
  opts?: {
    title?: string;
    description?: string;
    locationIds?: string[];
    hostIds?: string[];
    startTime?: Date;
    endTime?: Date;
    capacity?: number;
  }
): Promise<Session> {
  const { sessions } = getRepositories();
  return sessions.create({
    title: opts?.title ?? `Test Session ${Date.now()}`,
    description: opts?.description ?? "",
    startTime: opts?.startTime,
    endTime: opts?.endTime,
    capacity: opts?.capacity ?? 30,
    adminManaged: false,
    blocker: false,
    closed: false,
    eventId,
    hostIds: opts?.hostIds ?? [],
    locationIds: opts?.locationIds ?? [],
  });
}
