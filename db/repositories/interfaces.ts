// ── Shared enums ─────────────────────────────────────────────────────────────

export enum VoteChoice {
  interested = "interested",
  maybe = "maybe",
  skip = "skip",
}

// ── Site settings ────────────────────────────────────────────────────────────

export type SiteSettings = {
  title: string;
  description: string;
  mapImageUrl: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  title: "Example Conference Weekend",
  description: "Welcome! Browse the schedules for each event below.",
  mapImageUrl: "",
};

export interface SettingsRepository {
  /** The singleton settings row, falling back to defaults when unset. */
  get(): Promise<SiteSettings>;
  /** Upserts the singleton row and returns the merged settings. */
  update(patch: Partial<SiteSettings>): Promise<SiteSettings>;
}

// ── Days ─────────────────────────────────────────────────────────────────────

export type Day = {
  id: string;
  start: Date;
  end: Date;
  startBookings: Date;
  endBookings: Date;
  eventId: string;
};

export interface DaysRepository {
  list(): Promise<Day[]>;
  listByEvent(eventId: string): Promise<Day[]>;
  findById(id: string): Promise<Day | undefined>;
  create(data: Omit<Day, "id">): Promise<Day>;
  update(
    id: string,
    patch: Partial<Omit<Day, "id" | "eventId">>
  ): Promise<Day | undefined>;
  /** Deletes the day and every session that overlaps the day's window. */
  delete(id: string): Promise<void>;
}

// ── Events ────────────────────────────────────────────────────────────────────

export type Event = {
  id: string;
  name: string;
  /**
   * URL segment for the event. Derived from the name at creation and stable
   * afterwards (renames don't change it), so shared links keep working.
   */
  slug: string;
  description: string;
  website: string;
  start: Date;
  end: Date;
  proposalPhaseStart?: Date;
  proposalPhaseEnd?: Date;
  votingPhaseStart?: Date;
  votingPhaseEnd?: Date;
  schedulingPhaseStart?: Date;
  schedulingPhaseEnd?: Date;
  maxSessionDuration: number;
  breakMinutes: number;
  slotIncrementMinutes: number;
  timezone: string;
  /** When true, a session's capacity (> 0) rejects further RSVPs once reached. */
  rsvpCapacityHardLimit: boolean;
  icon?: string | null;
};

export interface EventsRepository {
  list(): Promise<Event[]>;
  findById(id: string): Promise<Event | undefined>;
  findByName(name: string): Promise<Event | undefined>;
  /** Finds the event with the given slug. Slugs are unique. */
  findBySlug(slug: string): Promise<Event | undefined>;
  /**
   * Creates the event with a slug derived from its name. Rejects when another
   * event already has that slug (unique constraint).
   */
  create(data: Omit<Event, "id" | "slug">): Promise<Event>;
  update(
    id: string,
    patch: Partial<Omit<Event, "id" | "slug">>
  ): Promise<Event | undefined>;
  /** Deletes the event and all records referencing it (cascades via DB FK). */
  delete(id: string): Promise<void>;
}

// ── Guests ────────────────────────────────────────────────────────────────────

// When the guest wants to be emailed.
export type EmailSettings = {
  /** A session the guest RSVP'd to changed time or location. */
  rsvpChange: boolean;
  /** A session the guest is hosting changed time or location. */
  hostChange: boolean;
  /** The guest was added as a co-host of a session. */
  cohostAdd: boolean;
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  rsvpChange: true,
  hostChange: true,
  cohostAdd: true,
};

type GuestPrivateInfo = {
  email: string;
  // These aren't very private, but still no reason to expose them to other
  // guests.
  emailSettings: EmailSettings;
};

/** An answered profile prompt, e.g. { prompt: "Ask me about", answer: "…" }. */
export type ProfilePrompt = { prompt: string; answer: string };

export const CONTACT_TYPES = [
  "email",
  "phone",
  "whatsapp",
  "signal",
  "telegram",
  "discord",
  "website",
  "other",
] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

/**
 * A public contact entry. Deliberately separate from the private system email
 * (GuestPrivateInfo.email): filling one in is the guest's opt-in to showing it.
 * `label` is the guest-supplied name for type "other".
 */
export type ProfileContact = {
  type: ContactType;
  label?: string;
  value: string;
};

export type Guest<PI extends GuestPrivateInfo | void = void> = {
  id: string;
  name: string;
  // Public: shown on the guest's profile to anyone who can view it.
  aboutMe?: string | null;
  avatarUrl?: string | null;
  pronouns?: string | null;
  basedIn?: string | null;
  prompts?: ProfilePrompt[] | null;
  languages?: string[] | null;
  contacts?: ProfileContact[] | null;
  info: PI;
};

export type CompleteGuest = Guest<GuestPrivateInfo>;

/** Input for creating a guest. Everything else is filled in after creation. */
export type NewGuest = {
  name: string;
  info: { email: string };
};

/** A guest paired with their email and whether they are assigned to a given event. */
export type EventGuestRow = {
  id: string;
  name: string;
  email: string;
  assigned: boolean;
};

/** A page of guests plus the total count of rows matching the same filter. */
export type EventGuestPage = {
  rows: EventGuestRow[];
  total: number;
};

/** A page of complete guests plus the total count matching the same filter. */
export type GuestPage = {
  rows: CompleteGuest[];
  total: number;
};

/** A guest with information used in the attendees list */
export type Attendee = Guest & {
  isHost: boolean;
};

export interface GuestsRepository {
  /**
   * Every guest with basic public fields only — no extended profile
   * (basedIn, prompts, languages, contacts). Pages embed this list in their
   * client payload (name/host selectors), so it must stay lean; use
   * findById/listAttendees where the extended profile is shown.
   */
  list(): Promise<Guest[]>;
  /** Every user with their private info (email). For admin export/lookup. */
  listFull(): Promise<CompleteGuest[]>;
  listByEvent(eventId: string): Promise<Guest[]>;
  /**
   * Server-side paginated + searchable global user list. `query` matches name
   * or email (case-insensitive substring, LIKE metacharacters matched
   * literally). Ordered by name with id tiebreaker.
   */
  search(opts: {
    query?: string;
    limit: number;
    offset: number;
  }): Promise<GuestPage>;
  /**
   * All guests as attendees (public profile fields plus whether they host any
   * session), ordered by name with id tiebreaker. `host: true` narrows to
   * session hosts. Search and pagination happen in memory on top of this
   * (see utils/attendee-search.ts): attendee counts don't warrant a SQL or
   * persisted search index.
   */
  listAttendees(opts: { host?: boolean }): Promise<Attendee[]>;
  /**
   * Assigned events for many guests in one query, ordered by event name.
   * Every requested id is present in the result; guests without assignments
   * map to [].
   */
  listEventsByGuests(
    guestIds: string[]
  ): Promise<Map<string, { id: string; name: string }[]>>;
  /**
   * Server-side paginated + searchable guest list scoped to an event's
   * assignment. `assigned` filters by membership (undefined = all); `query`
   * matches name or email (case-insensitive substring). Ordered by name.
   */
  searchForEventAssignment(
    eventId: string,
    opts: {
      query?: string;
      assigned?: boolean;
      limit: number;
      offset: number;
    }
  ): Promise<EventGuestPage>;
  findById(id: string): Promise<CompleteGuest | undefined>;
  // Matches the email case-insensitively.
  findByEmail(email: string): Promise<CompleteGuest | undefined>;
  /** Guests whose email matches any of `emails`, compared case-insensitively. */
  findByEmails(emails: string[]): Promise<CompleteGuest[]>;
  create(data: NewGuest): Promise<CompleteGuest>;
  /**
   * Atomically creates a guest, or returns the existing one if a guest with
   * the same email (case-insensitive) already exists. Safe under concurrent
   * calls with the same email (backed by a DB-level unique index).
   */
  findOrCreateByEmail(
    data: NewGuest
  ): Promise<{ guest: CompleteGuest; created: boolean }>;
  // Usage: an admin updates a user (name and email). Email settings are not
  // touched: those belong to the guest, via updateProfile.
  update(
    id: string,
    data: { name: string; info: { email: string } }
  ): Promise<CompleteGuest | undefined>;
  // Usage: a user updates their own profile (name, public profile fields, and
  // their email notification settings).
  updateProfile(
    id: string,
    data: {
      name: string;
      aboutMe: string | null;
      avatarUrl: string | null;
      pronouns: string | null;
      basedIn: string | null;
      prompts: ProfilePrompt[] | null;
      languages: string[] | null;
      contacts: ProfileContact[] | null;
      emailSettings: EmailSettings;
    }
  ): Promise<CompleteGuest | undefined>;
  /** Deletes the guest and all records referencing them (votes, RSVPs, host links, event assignments). */
  delete(id: string): Promise<void>;
  findExistingIds(ids: string[]): Promise<string[]>;
  assignToEvent(eventId: string, guestIds: string[]): Promise<void>;
  removeFromEvent(eventId: string, guestIds: string[]): Promise<void>;
  /**
   * Matches `rows` to existing guests by email (case-insensitive), creates
   * the missing ones, and assigns every resulting guest to each event in
   * `eventIds`. Existing guests are left unchanged. Runs in a single
   * transaction so a failure partway through leaves no partial writes.
   */
  importAndAssign(
    rows: { name: string; email: string }[],
    eventIds: string[]
  ): Promise<{ created: number }>;
}

// ── Locations ─────────────────────────────────────────────────────────────────

export type Location = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  capacity: number;
  color: string;
  hidden: boolean;
  bookable: boolean;
  sortIndex: number;
  areaDescription?: string;
};

/** A location paired with whether it is assigned to a given event. */
export type EventLocationRow = {
  id: string;
  name: string;
  capacity: number;
  assigned: boolean;
};

/** A page of locations plus the total count of rows matching the same filter. */
export type EventLocationPage = {
  rows: EventLocationRow[];
  total: number;
};

export interface LocationsRepository {
  /** All locations (including hidden), ordered by sortIndex. */
  list(): Promise<Location[]>;
  /**
   * Server-side paginated + searchable location list scoped to an event's
   * assignment. `assigned` filters by membership (undefined = all); `query`
   * matches the name (case-insensitive substring). Ordered by name.
   */
  searchForEventAssignment(
    eventId: string,
    opts: {
      query?: string;
      assigned?: boolean;
      limit: number;
      offset: number;
    }
  ): Promise<EventLocationPage>;
  /** Visible locations assigned to the given event, ordered by sortIndex. */
  listVisibleByEvent(eventId: string): Promise<Location[]>;
  listBookable(): Promise<Location[]>;
  findById(id: string): Promise<Location | undefined>;
  create(data: Omit<Location, "id">): Promise<Location>;
  update(id: string, data: Omit<Location, "id">): Promise<Location | undefined>;
  /** Deletes the location and all session/event links referencing it. */
  delete(id: string): Promise<void>;
  /** Number of sessions linked to this location. */
  countSessionLinks(id: string): Promise<number>;
  /**
   * Session-link counts for many locations in one query. Every requested id
   * is present in the result; locations without links map to 0.
   */
  countSessionLinksByLocations(ids: string[]): Promise<Map<string, number>>;
  /** IDs of events this location is assigned to. */
  listEventIds(id: string): Promise<string[]>;
  /**
   * Event IDs for many locations in one query. Every requested id is present
   * in the result; locations without assignments map to [].
   */
  listEventIdsByLocations(ids: string[]): Promise<Map<string, string[]>>;
  /** IDs of locations assigned to the given event. */
  listLocationIdsByEvent(eventId: string): Promise<string[]>;
  /**
   * Replaces the location's event assignments. Does not touch session_locations:
   * a session already scheduled at this location keeps that link even if its
   * event is dropped here, so it stops appearing in that event's schedule grid
   * (see listVisibleByEvent) while the underlying link is untouched.
   */
  setEventIds(id: string, eventIds: string[]): Promise<void>;
  /** Returns the subset of `ids` that exist in the locations table. */
  findExistingIds(ids: string[]): Promise<string[]>;
  /** Atomically adds the location to the given events (idempotent). */
  assignToEvent(eventId: string, locationIds: string[]): Promise<void>;
  /**
   * Atomically removes the location from the given events. Does not touch
   * session_locations, so sessions already scheduled there stop appearing in
   * the event's schedule grid (see listVisibleByEvent) but keep the stale link.
   */
  removeFromEvent(eventId: string, locationIds: string[]): Promise<void>;
  /**
   * Moves the location one position up or down in the sort order.
   * Normalizes sortIndex values to consecutive integers as a side effect.
   * Returns false if the location is already at the boundary or unknown.
   */
  move(id: string, direction: "up" | "down"): Promise<boolean>;
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export type SessionHost = Pick<Guest, "id" | "name">;
export type SessionLocation = Pick<Location, "id" | "name" | "color">;

export type Session = {
  id: string;
  title: string;
  description: string;
  startTime?: Date;
  endTime?: Date;
  capacity: number;
  adminManaged: boolean;
  blocker: boolean;
  closed: boolean;
  proposalId?: string;
  eventId: string;
  hosts: SessionHost[];
  locations: SessionLocation[];
  numRsvps: number;
};

export type SessionCreateInput = {
  title: string;
  description: string;
  startTime?: Date;
  endTime?: Date;
  capacity: number;
  adminManaged: boolean;
  blocker: boolean;
  closed: boolean;
  proposalId?: string;
  eventId: string;
  hostIds: string[];
  locationIds: string[];
};

export type SessionUpdateInput = Partial<
  Omit<SessionCreateInput, "hostIds" | "locationIds">
> & {
  hostIds?: string[];
  locationIds?: string[];
};

/** A page of sessions plus the total count of rows matching the same filter. */
export type SessionPage = {
  rows: Session[];
  total: number;
};

export interface SessionsRepository {
  list(): Promise<Session[]>;
  listScheduled(): Promise<Session[]>;
  listByEvent(eventId: string): Promise<Session[]>;
  listScheduledByEvent(eventId: string): Promise<Session[]>;
  listHostedByGuest(guestId: string): Promise<Session[]>;
  listRsvpdByGuest(guestId: string): Promise<Session[]>;
  /**
   * Server-side paginated + searchable session list for an event. `query`
   * matches the title or a host name (case-insensitive substring). Ordered by
   * title.
   */
  searchByEvent(
    eventId: string,
    opts: { query?: string; limit: number; offset: number }
  ): Promise<SessionPage>;
  findById(id: string): Promise<Session | undefined>;
  create(data: SessionCreateInput): Promise<Session>;
  /**
   * When `hostIds` is given, any RSVPs by the session's hosts are removed
   * in the same transaction: hosts don't RSVP to their own session.
   */
  update(id: string, patch: SessionUpdateInput): Promise<Session>;
  delete(id: string): Promise<void>;
  /**
   * Finds a scheduled session in the event that overlaps [start, end) and
   * shares at least one of the given locations, excluding `excludeId`. Used
   * for conflict checks; returns only the fields needed for an error message.
   */
  findLocationConflict(
    eventId: string,
    start: Date,
    end: Date,
    locationIds: string[],
    excludeId?: string
  ): Promise<{ id: string; title: string } | undefined>;
}

// ── RSVPs ─────────────────────────────────────────────────────────────────────

export type Rsvp = {
  id: string;
  sessionId: string;
  guestId: string;
};

export interface RsvpsRepository {
  listByGuest(guestId: string): Promise<Rsvp[]>;
  listBySession(sessionId: string): Promise<Rsvp[]>;
  /**
   * RSVPs for many sessions in one query. Every requested id is present in
   * the result; sessions without RSVPs map to [].
   */
  listBySessions(sessionIds: string[]): Promise<Map<string, Rsvp[]>>;
  create(data: { sessionId: string; guestId: string }): Promise<Rsvp>;
  /**
   * Atomically creates an RSVP unless the session already holds `capacity`
   * RSVPs from other guests. A guest re-adding their own existing RSVP always
   * succeeds. Returns null when the session is full.
   */
  createIfUnderCapacity(data: {
    sessionId: string;
    guestId: string;
    capacity: number;
  }): Promise<Rsvp | null>;
  deleteBySessionAndGuest(sessionId: string, guestId: string): Promise<void>;
}

// ── Session Proposals ─────────────────────────────────────────────────────────

export type ProposalHost = Pick<Guest, "id" | "name">;

export type SessionProposal = {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  createdTime: Date;
  hosts: ProposalHost[];
  votesCount: number;
  interestedVotesCount: number;
  maybeVotesCount: number;
  sessionIds: string[];
};

export type SessionProposalCreateInput = {
  eventId: string;
  title: string;
  description?: string;
  hostIds: string[];
  durationMinutes?: number;
};

export type SessionProposalUpdateInput = {
  title?: string;
  description?: string;
  hostIds?: string[];
  durationMinutes?: number | null;
};

/** A page of proposals plus the total count of rows matching the same filter. */
export type SessionProposalPage = {
  rows: SessionProposal[];
  total: number;
};

export interface SessionProposalsRepository {
  listByEvent(eventId: string): Promise<SessionProposal[]>;
  listByHost(guestId: string): Promise<SessionProposal[]>;
  /**
   * Server-side paginated + searchable proposal list for an event. `query`
   * matches the title or a host name (case-insensitive substring). Ordered by
   * title.
   */
  searchByEvent(
    eventId: string,
    opts: { query?: string; limit: number; offset: number }
  ): Promise<SessionProposalPage>;
  findById(id: string): Promise<SessionProposal | undefined>;
  create(data: SessionProposalCreateInput): Promise<SessionProposal>;
  update(
    id: string,
    patch: SessionProposalUpdateInput
  ): Promise<SessionProposal>;
  delete(id: string): Promise<void>;
}

// ── Votes ─────────────────────────────────────────────────────────────────────

export type Vote = {
  id: string;
  proposalId: string;
  guestId: string;
  choice: VoteChoice;
};

export interface VotesRepository {
  listByGuestAndEvent(guestId: string, eventId: string): Promise<Vote[]>;
  create(data: {
    proposalId: string;
    guestId: string;
    choice: VoteChoice;
  }): Promise<Vote>;
  upsert(data: {
    proposalId: string;
    guestId: string;
    choice: VoteChoice;
  }): Promise<void>;
  deleteByGuestAndProposal(guestId: string, proposalId: string): Promise<void>;
  deleteByProposal(proposalId: string): Promise<void>;
  deleteByProposalAndGuests(
    proposalId: string,
    guestIds: string[]
  ): Promise<void>;
}

// ── Images ─────────────────────────────────────────────────────────────────────

export interface ImageResourceRepository<Id> {
  validate(
    buffer: Buffer
  ): Promise<{ buffer: Buffer; ext: string } | { error: string }>;
  save(id: Id, buffer: Buffer, ext: string): Promise<string>;
  delete(id: Id): Promise<void>;
}
