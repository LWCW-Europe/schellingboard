// ── Shared enums ─────────────────────────────────────────────────────────────

export enum VoteChoice {
  interested = "interested",
  maybe = "maybe",
  skip = "skip",
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
  timezone: string;
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

type GuestPrivateInfo = {
  email: string;
};

export type Guest<PI extends GuestPrivateInfo | void = void> = {
  id: string;
  name: string;
  // Public: shown on the guest's profile to anyone who can view it.
  aboutMe?: string | null;
  avatarUrl?: string | null;
  info: PI;
};

export type CompleteGuest = Guest<GuestPrivateInfo>;

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

export interface GuestsRepository {
  list(): Promise<Guest[]>;
  /** Every user with their private info (email). For admin export/lookup. */
  listFull(): Promise<CompleteGuest[]>;
  listByEvent(eventId: string): Promise<Guest[]>;
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
  findByEmail(email: string): Promise<CompleteGuest | undefined>;
  create(data: Omit<CompleteGuest, "id">): Promise<CompleteGuest>;
  // Usage: an admin updates a user (name and private info such as email).
  update(
    id: string,
    data: Pick<CompleteGuest, "name" | "info">
  ): Promise<CompleteGuest | undefined>;
  // Usage: a user updates their own profile (name and public aboutMe).
  updateProfile(
    id: string,
    data: { name: string; aboutMe: string | null; avatarUrl: string | null }
  ): Promise<CompleteGuest | undefined>;
  /** Deletes the guest and all records referencing them (votes, RSVPs, host links, event assignments). */
  delete(id: string): Promise<void>;
  findExistingIds(ids: string[]): Promise<string[]>;
  assignToEvent(eventId: string, guestIds: string[]): Promise<void>;
  removeFromEvent(eventId: string, guestIds: string[]): Promise<void>;
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
  listVisible(): Promise<Location[]>;
  listBookable(): Promise<Location[]>;
  findById(id: string): Promise<Location | undefined>;
  create(data: Omit<Location, "id">): Promise<Location>;
  update(id: string, data: Omit<Location, "id">): Promise<Location | undefined>;
  /** Deletes the location and all session/event links referencing it. */
  delete(id: string): Promise<void>;
  /** Number of sessions linked to this location. */
  countSessionLinks(id: string): Promise<number>;
  /** IDs of events this location is assigned to. */
  listEventIds(id: string): Promise<string[]>;
  /** IDs of locations assigned to the given event. */
  listLocationIdsByEvent(eventId: string): Promise<string[]>;
  /** Replaces the location's event assignments. */
  setEventIds(id: string, eventIds: string[]): Promise<void>;
  /** Returns the subset of `ids` that exist in the locations table. */
  findExistingIds(ids: string[]): Promise<string[]>;
  /** Atomically adds the location to the given events (idempotent). */
  assignToEvent(eventId: string, locationIds: string[]): Promise<void>;
  /** Atomically removes the location from the given events. */
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
  attendeeScheduled: boolean;
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
  attendeeScheduled: boolean;
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

export interface SessionsRepository {
  list(): Promise<Session[]>;
  listScheduled(): Promise<Session[]>;
  listByEvent(eventId: string): Promise<Session[]>;
  listScheduledByEvent(eventId: string): Promise<Session[]>;
  listHostedByGuest(guestId: string): Promise<Session[]>;
  listRsvpdByGuest(guestId: string): Promise<Session[]>;
  findById(id: string): Promise<Session | undefined>;
  create(data: SessionCreateInput): Promise<Session>;
  update(id: string, patch: SessionUpdateInput): Promise<Session>;
  delete(id: string): Promise<void>;
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
  create(data: { sessionId: string; guestId: string }): Promise<Rsvp>;
  deleteBySessionAndGuest(sessionId: string, guestId: string): Promise<void>;
  deleteBySessionAndGuests(
    sessionId: string,
    guestIds: string[]
  ): Promise<void>;
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
