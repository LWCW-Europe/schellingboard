import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const guests = sqliteTable("guests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  aboutMe: text("about_me"),
  avatarUrl: text("avatar_url"),
});

export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    // Set from the name at creation and stable afterwards, so URLs survive
    // renames. Unique: two events must never resolve to the same URL.
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    website: text("website").notNull().default(""),
    start: text("start").notNull(),
    end: text("end").notNull(),
    proposalPhaseStart: text("proposal_phase_start"),
    proposalPhaseEnd: text("proposal_phase_end"),
    votingPhaseStart: text("voting_phase_start"),
    votingPhaseEnd: text("voting_phase_end"),
    schedulingPhaseStart: text("scheduling_phase_start"),
    schedulingPhaseEnd: text("scheduling_phase_end"),
    maxSessionDuration: integer("max_session_duration").notNull().default(120),
    breakMinutes: integer("break_minutes").notNull().default(10),
    timezone: text("timezone").notNull().default("UTC"),
    icon: text("icon"),
  },
  (table) => [uniqueIndex("events_slug_unique").on(table.slug)]
);

export const eventGuests = sqliteTable(
  "event_guests",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.guestId] })]
);

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  description: text("description").notNull().default(""),
  capacity: integer("capacity").notNull().default(0),
  color: text("color").notNull().default(""),
  hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
  bookable: integer("bookable", { mode: "boolean" }).notNull().default(false),
  sortIndex: integer("sort_index").notNull().default(0),
  areaDescription: text("area_description"),
});

export const eventLocations = sqliteTable(
  "event_locations",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.locationId] })]
);

export const days = sqliteTable("days", {
  id: text("id").primaryKey(),
  start: text("start").notNull(),
  end: text("end").notNull(),
  startBookings: text("start_bookings").notNull(),
  endBookings: text("end_bookings").notNull(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
});

export const sessionProposals = sqliteTable("session_proposals", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
  createdTime: text("created_time").notNull(),
});

export const proposalHosts = sqliteTable(
  "proposal_hosts",
  {
    proposalId: text("proposal_id")
      .notNull()
      .references(() => sessionProposals.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.proposalId, t.guestId] })]
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  startTime: text("start_time"),
  endTime: text("end_time"),
  capacity: integer("capacity").notNull().default(0),
  attendeeScheduled: integer("attendee_scheduled", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  blocker: integer("blocker", { mode: "boolean" }).notNull().default(false),
  closed: integer("closed", { mode: "boolean" }).notNull().default(false),
  proposalId: text("proposal_id").references(() => sessionProposals.id, {
    onDelete: "set null",
  }),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
});

export const sessionHosts = sqliteTable(
  "session_hosts",
  {
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.sessionId, t.guestId] })]
);

export const sessionLocations = sqliteTable(
  "session_locations",
  {
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.sessionId, t.locationId] })]
);

export const rsvps = sqliteTable(
  "rsvps",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("rsvps_session_guest_unique").on(t.sessionId, t.guestId)]
);

export const votes = sqliteTable(
  "votes",
  {
    id: text("id").primaryKey(),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => sessionProposals.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
    choice: text("choice").notNull(),
  },
  (t) => [
    uniqueIndex("votes_proposal_guest_unique").on(t.proposalId, t.guestId),
  ]
);
