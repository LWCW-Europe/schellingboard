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
  create(data: Omit<Event, "id">): Promise<Event>;
  update(
    id: string,
    patch: Partial<Omit<Event, "id">>
  ): Promise<Event | undefined>;
  /** Deletes the event and all records referencing it (cascades via DB FK). */
  delete(id: string): Promise<void>;
}

// ── Guests ────────────────────────────────────────────────────────────────────

export type Guest = {
  id: string;
  name: string;
  email: string;
};

export interface GuestsRepository {
  list(): Promise<Guest[]>;
  listByEvent(eventId: string): Promise<Guest[]>;
  findById(id: string): Promise<Guest | undefined>;
  findByEmail(email: string): Promise<Guest | undefined>;
  create(data: Omit<Guest, "id">): Promise<Guest>;
  update(id: string, data: Omit<Guest, "id">): Promise<Guest | undefined>;
  /** Deletes the guest and all records referencing them (votes, RSVPs, host links, event assignments). */
  delete(id: string): Promise<void>;
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

export interface LocationsRepository {
  /** All locations (including hidden), ordered by sortIndex. */
  list(): Promise<Location[]>;
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

export type SessionHost = Pick<Guest, "id" | "name" | "email">;
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

export type ProposalHost = Pick<Guest, "id" | "name" | "email">;

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

export interface SessionProposalsRepository {
  listByEvent(eventId: string): Promise<SessionProposal[]>;
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
  deleteByGuestAndProposal(guestId: string, proposalId: string): Promise<void>;
  deleteByProposal(proposalId: string): Promise<void>;
  deleteByProposalAndGuests(
    proposalId: string,
    guestIds: string[]
  ): Promise<void>;
}
