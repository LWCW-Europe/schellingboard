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
  /** Whether attendees can book 1-on-1 meetings with each other. */
  meetingsEnabled: boolean;
  meetingSlotMinutes: number;
  /**
   * Time-of-day bounds ("HH:mm") for 1-on-1 slots. Undefined means the day's
   * own window.
   */
  meetingDayStart?: string;
  meetingDayEnd?: string;
  /** How many unanswered requests one attendee may have outstanding. */
  maxOpenMeetingRequests: number;
};

/**
 * The organizer's 1-on-1 settings. Split out because they are configured from
 * the admin Meetings section after the event exists, never at creation, so
 * `create` takes them as optional and falls back to the schema's defaults.
 */
export type EventMeetingSettings = Pick<
  Event,
  | "meetingsEnabled"
  | "meetingSlotMinutes"
  | "meetingDayStart"
  | "meetingDayEnd"
  | "maxOpenMeetingRequests"
>;

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
  create(
    data: Omit<Event, "id" | "slug" | keyof EventMeetingSettings> &
      Partial<EventMeetingSettings>
  ): Promise<Event>;
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
  /** Someone commented on a proposal the guest is hosting. */
  proposalComment: boolean;
  /** Someone commented on a session the guest is hosting. */
  sessionComment: boolean;
  /** Someone commented on the guest's own profile. */
  profileComment: boolean;
  /**
   * Someone commented on a proposal, session or profile the guest has
   * commented on.
   */
  commentThread: boolean;
  /** Someone asked the guest for a 1-on-1 meeting. */
  meetingRequest: boolean;
  /** A 1-on-1 the guest asked for was accepted, declined or canceled. */
  meetingResponse: boolean;
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  rsvpChange: true,
  hostChange: true,
  cohostAdd: true,
  proposalComment: true,
  sessionComment: true,
  profileComment: true,
  commentThread: false,
  // On by default, unlike the comment-thread digest: this mail is addressed
  // personally to the guest and is waiting on their answer.
  meetingRequest: true,
  meetingResponse: true,
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
  // When a public field above was last changed; null for a profile that was
  // never edited (see the schema comment). Drives the "recently updated" sort.
  profileUpdatedAt?: Date | null;
  // Public (the name switcher must know to ask for credentials); the
  // password hash itself is server-only, see GuestAuthCredentials.
  authProtected?: boolean;
  info: PI;
};

/** Server-only auth state of a guest; never send to the client. */
export type GuestAuthCredentials = {
  authProtected: boolean;
  passwordHash: string | null;
};

/** Which flow an emailed token belongs to (see the `authCodes` schema). */
export type AuthCodePurpose = "login" | "reset";

/**
 * An emailed single-use token. `codeHash` is a digest of `salt + code`,
 * never the code.
 */
export type AuthCode = {
  id: string;
  guestId: string;
  purpose: AuthCodePurpose;
  salt: string;
  codeHash: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
};

/** Input for issuing a token; `id` and `attempts` are filled in on insert. */
export type NewAuthCode = {
  guestId: string;
  purpose: AuthCodePurpose;
  salt: string;
  codeHash: string;
  createdAt: Date;
  expiresAt: Date;
};

export interface AuthCodesRepository {
  /**
   * Stores a new token for the guest, replacing any previous one of the same
   * purpose — only the most recently issued token of a purpose can be valid.
   */
  replace(code: NewAuthCode): Promise<void>;
  /**
   * The guest's current token of `purpose`, or null if none exists or it
   * expired at `now`.
   */
  findActive(
    guestId: string,
    purpose: AuthCodePurpose,
    now: Date
  ): Promise<AuthCode | null>;
  recordFailedAttempt(id: string): Promise<void>;
  /** Deletes the token, so a successful use can never be replayed. */
  consume(id: string): Promise<void>;
}

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
   * session), ordered by name with id tiebreaker. Search, filtering, sorting
   * and pagination all happen in memory on top of this, in the browser (see
   * app/(site)/guests/directory-view.ts): attendee counts don't warrant a SQL
   * or persisted search index.
   */
  listAttendees(): Promise<Attendee[]>;
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
  /** Server-only: protection flag + password hash, for credential checks. */
  getAuthCredentials(id: string): Promise<GuestAuthCredentials | null>;
  /** Returns false when the guest doesn't exist. */
  setAuthProtection(id: string, creds: GuestAuthCredentials): Promise<boolean>;
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
  // Usage: a user updates their own public profile (name and profile fields).
  // `profileUpdatedAt` is set to `now` only if a public profile field actually
  // changed — saving the form unchanged must not push you to the top of the
  // "recently updated" list.
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
    },
    now: Date
  ): Promise<CompleteGuest | undefined>;
  // Usage: a user updates their own email notification settings. Kept apart
  // from updateProfile: settings are private and independent of the public
  // profile.
  updateEmailSettings(
    id: string,
    settings: EmailSettings
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
  /**
   * Visible, bookable locations assigned to the given event, ordered by
   * sortIndex — what attendees may pick when scheduling a session.
   */
  listBookableByEvent(eventId: string): Promise<Location[]>;
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
  skipVotesCount: number;
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

// ── Comments ──────────────────────────────────────────────────────────────────

export type CommentAuthor = Pick<Guest, "id" | "name">;

export type CommentLiker = Pick<Guest, "id" | "name" | "avatarUrl">;

export type Comment = {
  id: string;
  parentId: string | null;
  body: string;
  deleted: boolean;
  createdTime: Date;
  editedTime: Date | null;
  author: CommentAuthor | null;
  likes: CommentLiker[];
};

/**
 * Scope-agnostic comment operations. A comment is attached to exactly one
 * subject — a session proposal, a scheduled session or a guest's profile —
 * but finding, editing, liking and deleting work identically for all, so they
 * live here. Attaching comments to a subject is a SubjectCommentsRepository.
 */
export interface CommentsRepository {
  findById(commentId: string): Promise<Comment | undefined>;
  update(id: string, data: { body: string; editedTime: Date }): Promise<void>;
  toggleLike(data: {
    commentId: string;
    guestId: string;
    createdTime: Date;
  }): Promise<boolean>;
  /**
   * Erases the comment. One with replies is kept as a tombstone holding
   * nothing but its place in the thread; one without is removed outright,
   * along with any tombstone ancestors it was the last reply to.
   */
  delete(id: string): Promise<void>;
}

/**
 * Comments attached to one kind of subject. Which kind is fixed by the
 * repository itself — `proposalComments`, `sessionComments` and
 * `profileComments` on {@link Repositories} — so `subjectId` below is always a
 * proposal, session or profile id respectively.
 */
export interface SubjectCommentsRepository {
  /** All comments on the subject, oldest first, likes included. */
  list(subjectId: string): Promise<Comment[]>;
  /**
   * The subject a comment is attached to, or undefined when the comment
   * doesn't exist or belongs to a subject of another kind.
   */
  findSubjectId(commentId: string): Promise<string | undefined>;
  create(data: {
    subjectId: string;
    authorId: string;
    parentId?: string;
    body: string;
    createdTime: Date;
  }): Promise<Comment>;
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

// ── Meetings ───────────────────────────────────────────────────────────────────

export type MeetingPoint = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  sortIndex: number;
};

export interface MeetingPointsRepository {
  /** An event's suggested places to meet, in the organizer's order. */
  listByEvent(eventId: string): Promise<MeetingPoint[]>;
  create(data: Omit<MeetingPoint, "id">): Promise<MeetingPoint>;
  update(
    id: string,
    patch: Partial<Omit<MeetingPoint, "id" | "eventId">>
  ): Promise<MeetingPoint | undefined>;
  delete(id: string): Promise<void>;
}

export interface MeetingAvailabilityRepository {
  /**
   * The slot starts (ISO) a guest declared for an event, chronologically. An
   * empty result means they are not bookable — the same state as never having
   * switched meetings on.
   */
  listByGuestAndEvent(guestId: string, eventId: string): Promise<Date[]>;
  /** Replaces a guest's whole declared set for the event. */
  replaceForGuest(
    guestId: string,
    eventId: string,
    slotStarts: Date[]
  ): Promise<void>;
}

/**
 * Stored meeting states. "expired" is deliberately absent: a pending request
 * whose slot has passed is expired by definition, and deriving that on read
 * needs no scheduler.
 */
export type MeetingStatus = "pending" | "accepted" | "declined" | "canceled";

export type Meeting = {
  id: string;
  eventId: string;
  requesterId: string;
  recipientId: string;
  /** ISO instants; the slot the requester picked. */
  slotStart: Date;
  slotEnd: Date;
  /** Where to meet, as agreed at request time. Never empty. */
  meetingPoint: string;
  message: string;
  status: MeetingStatus;
  createdAt: Date;
  respondedAt?: Date;
};

export interface MeetingsRepository {
  findById(id: string): Promise<Meeting | undefined>;
  /**
   * Every meeting the guest is part of at the event, in either direction,
   * ordered by slot. Callers filter by status: the schedule shows pending and
   * accepted, clash detection only accepted.
   */
  listByGuestAndEvent(guestId: string, eventId: string): Promise<Meeting[]>;
  /**
   * Requests this guest has sent and not heard back on, for the organizer's
   * cap. `now` bounds it: a pending request whose slot has passed is expired
   * by definition, and an expired request is not outstanding.
   */
  countOpenByRequester(
    requesterId: string,
    eventId: string,
    now: Date
  ): Promise<number>;
  create(
    data: Omit<Meeting, "id" | "status" | "respondedAt">
  ): Promise<Meeting>;
  /**
   * The cap check and the insert in one transaction, returning null when the
   * requester is already at `cap`. Two separate awaits leave a window a double
   * submit walks straight through — the same hazard
   * {@link RsvpsRepository.createIfUnderCapacity} exists for.
   */
  createIfUnderCap(
    data: Omit<Meeting, "id" | "status" | "respondedAt">,
    cap: number,
    now: Date
  ): Promise<Meeting | null>;
  /**
   * Moves the meeting to `status`, but only from one of `from` — undefined
   * when it is in some other state, which is how a caller learns that someone
   * (a cancelling requester, a second tab) got there first.
   */
  updateStatus(
    id: string,
    status: MeetingStatus,
    respondedAt: Date,
    from: MeetingStatus[]
  ): Promise<Meeting | undefined>;
}

// ── Notifications ──────────────────────────────────────────────────────────────

/**
 * What happened, as one of the guest's email-setting keys. The two channels
 * share a taxonomy: the setting decides whether mail goes out, never whether
 * the in-app notification is recorded.
 */
export type NotificationType = keyof EmailSettings;

export type Notification = {
  id: string;
  guestId: string;
  type: NotificationType;
  /** One line, in the past tense: "Anna commented on your session". */
  text: string;
  /** Site-relative path to whatever happened, e.g. `/eventslug?viewSession=x`. */
  url: string;
  createdAt: Date;
  /** Unset while unread. */
  readAt?: Date;
};

export interface NotificationsRepository {
  /** One notification, iff it belongs to `guestId`. */
  findForGuest(guestId: string, id: string): Promise<Notification | undefined>;
  /** Newest first. */
  listByGuest(
    guestId: string,
    opts?: { limit?: number; offset?: number }
  ): Promise<Notification[]>;
  /** Drives the nav badge. */
  countUnread(guestId: string): Promise<number>;
  create(data: Omit<Notification, "id" | "readAt">): Promise<Notification>;
  /**
   * Marks one notification read, iff it belongs to `guestId`; false when it
   * does not exist or is someone else's. Already-read rows keep their original
   * timestamp. `readAt` comes from the caller so the dev fake clock reaches it.
   */
  markRead(guestId: string, id: string, readAt: Date): Promise<boolean>;
  markAllRead(guestId: string, readAt: Date): Promise<void>;
}

// ── Images ─────────────────────────────────────────────────────────────────────

export interface ImageResourceRepository<Id> {
  validate(
    buffer: Buffer
  ): Promise<{ buffer: Buffer; ext: string } | { error: string }>;
  save(id: Id, buffer: Buffer, ext: string): Promise<string>;
  delete(id: Id): Promise<void>;
}
