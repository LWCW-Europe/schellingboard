# ADR 0006: Attendee count storage and in-process reminder dispatch

- **Status:** Accepted
- **Date:** 2026-08-25, amended 2026-09-02 (see [Amendment](#amendment-2026-09-02--the-in-app-channel))

## Context

Hosts record how many people attended a session of theirs once it has finished,
and are reminded to do so by two emails: a heads-up an hour before the session
starts, and a follow-up fifteen minutes after it ends.

Three parts of that constrain future work well beyond the feature itself, and
none of them is covered by an existing ADR:

1. The emails must go out unattended, which means this codebase acquires its
   first background job.
2. Sessions get rescheduled. A reminder that was already sent for one schedule
   may be owed again for another, and must never be sent twice for the same
   one — including when two dispatch runs overlap.
3. The count is host-only data living on a record that is otherwise published
   to every visitor's browser.

## Decision

### 1. Dispatch runs in-process, on an interval from `instrumentation.ts`

`utils/reminder-scheduler.ts` starts a `setInterval` from `register()` in
`instrumentation.ts`, guarded to `NEXT_RUNTIME === "nodejs"` and stored on
`globalThis` — the pattern `utils/mailer.ts` already uses, for the reason in
[vercel/next.js#68572](https://github.com/vercel/next.js/discussions/68572).
The period comes from `REMINDER_DISPATCH_INTERVAL_MS` (default `60000`; `0`
disables the scheduler entirely). The timer is `unref()`d, an in-process guard
skips a tick while the previous run is still in flight, and a throw from a run
is logged and swallowed.

`instrumentation.ts` is the only hook that runs once per server process
regardless of traffic, and the mailer is initialised there already: the two have
identical lifecycles and the same "Node runtime only" constraint.

Rejected:

- **External cron or a systemd timer hitting an API route.** It puts setup work
  on every self-hoster and needs an authenticated trigger endpoint — new attack
  surface for no gain.
- **Next.js `after()` on ordinary requests.** Request-driven: an event with no
  overnight traffic would send nothing until someone visited, which is exactly
  when hosts are asleep and reminders matter.
- **A cron library (`node-cron`, `croner`).** A dependency to express "every 60
  seconds".

Consequence: behind a load balancer every instance ticks. That is safe because
of decision 2, which concurrency-safety requires anyway.

Because the interval is disabled outright in both E2E tiers — a live tick against
the wall-clock-relative seed data drops stray mail into the mailbox the delivery
assertions search — the dev toolbar carries a **Send due reminders** button, and
`app/actions/dev-reminders.ts` refuses unless `SB_ENABLE_DEV_TOOLS` is set. It
runs one tick against the dev clock, which is what lets the E2E suite reach a
real follow-up email and follow the link out of it (SC-001) rather than
hand-building a `?viewSession=` URL. Nothing about it exists on a real
deployment.

### 2. Reminder state is keyed by the reminder's due time, not a sent flag

One row per `(session_id, guest_id, kind)` in `session_reminders`, carrying the
due time it was last claimed for. That single column is simultaneously the
idempotency key and the re-arm signal:

- an unchanged schedule computes the same due time, so a repeated or concurrent
  run finds it already sent and skips;
- a moved start computes a different heads-up due time and re-arms only that
  kind; a moved end re-arms only the follow-up; editing the title or the host
  list moves neither.

No boolean "sent" flag can express that without also storing the time it was
sent for.

Dispatch **claims before sending**: one write transaction sets the due time and
`sent_at`, and reports whether this process won. Only one transaction can flip
`sent_at` from NULL for a given due time, and `better-sqlite3` serialises
writers through SQLite's own write lock, so overlapping ticks cannot both send.

**The 90-minute reschedule guard** compares the new displayed start against the
due time the host's existing heads-up was sent for: it is suppressed when that
email went out 90 minutes or less before the new start, because it is still a
useful warning for the new slot. `research.md` §5 sketched the guard as
`now >= displayedStart − 90 min`, which does not work — a heads-up is only ever
due from `displayedStart − 60 min` onwards, so that condition holds every time
it is evaluated and would suppress every re-send, including the
three-hours-later move the spec requires to re-arm.

**Accepted limitation:** a process that crashes between the claim and the send
drops that reminder for that due time. The window is milliseconds and the
failure mode is one missing email rather than a duplicate — the opposite
trade-off, send-then-mark, produces duplicates on the same crash, which is the
one outcome the spec forbids. A lease column with an expiry that a later tick
reclaims would close the window, and is more machinery than a single-process
self-hosted app warrants. Recorded here rather than left to be rediscovered.

### 3. The attendee count is deliberately absent from the `Session` type

`sessions.attendee_count` is a nullable column with **no default**, so `NULL`
("not recorded") stays distinguishable from `0` ("held, nobody came"). It is
read and written through host-scoped methods on `SessionsRepository`, and it
**must not** be added to `Session`, `SessionCreateInput`, or
`SessionUpdateInput`.

`Session` is loaded by the `[eventSlug]` layout and serialised into the client
bundle for every visitor — that is how `view-session.tsx` receives its data. A
field there publishes the count to every attendee's browser no matter what the
JSX renders, which is the one way of leaking it that cannot be spotted by
reading the component. Keeping it off the type makes the leak impossible to
write by accident rather than something a reviewer has to remember; an
integration test asserts that a non-host's event payload and the admin session
read surface carry no count anywhere.

The dispatch candidate projection in `db/repositories/sqlite/reminders.ts` does
read `sessions.attendee_count` directly, and exposes it as a
`hasRecordedCount` boolean rather than the number. That is compatible with this
posture precisely because the projection is server-only and never serialised —
the dispatcher decides suppression and has no business holding the value.

Rejected: adding `attendeeCount` to `Session` and stripping it during
serialisation. A strip step is a rule enforced by memory, and every new read
path has to remember it.

**Scope of the protection:** this is host-scoping, not secrecy. Guest switching
on `(site)` pages is unauthenticated, so a determined visitor can select a
host's name and see the count — as they can with every other host-only control.
The requirement is that the number stays out of ordinary attendees' way and out
of exports and listings.

## Consequences

### Positive

- Reminders work out of the box for a self-hoster with SMTP configured; no
  external scheduler to set up.
- Rescheduling, repetition, and concurrency are all answered by one column.
- FR-005 (the count never reaches a non-host) is a type-level property, not a
  convention.

### Negative

- A background timer inside the web process is a new kind of moving part. It is
  confined to one module, ~~inert without SMTP~~ (**superseded by the 2026-09-02
  amendment**: it delivers in-app notifications whether or not mail is
  configured), and disabled in both E2E tiers.
- The count cannot be read alongside a session in one call; host-scoped reads
  are separate round trips. At conference scale that is one extra query on a
  modal open.
- A crash in the claim-then-send window loses one email (above).

### Neutral

- `REMINDER_DISPATCH_INTERVAL_MS` is a real configuration variable, not a
  test-only back door, so it must reach the configuration reference,
  `docker-compose.yml`, and `.env.docker.example` — `tests/unit/docker-compose-env.test.ts`
  enforces that.

## Amendment, 2026-09-02 — the in-app channel

The spec's second clarification session (FR-021 – FR-025) makes the reminder a
two-channel delivery. Nothing above is withdrawn except where marked; three
further decisions constrain future work.

### 4. A reminder is delivered on two channels, not sent as an email

"Sending a reminder" is no longer synonymous with "sending mail". Every due
reminder creates an in-app notification for its host unconditionally; the email
is a second, conditional half that goes out only when the host is opted in and
reachable and the instance has mail configured. Dispatch therefore no longer
bails out when SMTP is missing — an instance with no mail still reminds its
hosts, which is the whole of FR-021.

A future third channel, or a second reminder feature, inherits that shape:
claim the reminder once, then deliver on each channel independently, and let
the per-channel state decide what is still owed.

Rejected: routing dispatch through `notifyGuest` in `utils/notifications.ts`,
which already pairs "write the notification, then mail if opted in". It sends
the mail inside the same call, so dispatch could not tell a failed send from a
written notification — and the retry lifecycle is the one thing dispatch owns.
What is shared instead is the smaller piece: `sessionPath` is exported and used
for all three deep links rather than copied a third time.

### 5. The email settings govern the emails, never the notifications

`EmailSettings.sessionHeadsUp` and `EmailSettings.attendeeCountReminder` gate
the two reminder **emails** and nothing else. A host who turns both off still
finds both reminders in their notification list.

One key per kind, not one for the pair: the two mails answer different
questions. "Your session starts in an hour" is worth having on its own even to a
host who never counts the room, and a host who finds the pre-session mail
redundant should not have to give up the link that records the count. Dispatch
therefore reads the key for the candidate's kind, `reminderOptIn` on
`DueReminderCandidate` being whichever one applies.

This is the house rule already stated at `notifyGuest` — "opting out of the mail
is a request not to be interrupted outside the app, not a request to be
uninformed inside it" — now binding on reminders too, which had been the one
notification type that read the setting before deciding whether to act at all.
The settings checkboxes are worded as email switches to match, and every other
key in `EmailSettings` already works this way.

### 6. Each channel gets its own column on `session_reminders`

`notified_at` records the in-app notification for the current due time;
`sent_at` records a confirmed email; `claimed_at` is the concurrency and
settlement guard. Three columns because the two channels have different failure
modes: a mail retry must resend without re-notifying (FR-016), while a
reschedule must do both (FR-024), and a reminder settled with nothing to mail
must still block reprocessing without ever claiming to have sent mail.

The last of those is why `claimed_at` exists at all. Decision 2 above used
`sent_at` as both "this due time is spoken for" and "an email went out", which
cannot both be true once a reminder can settle with no mail to send. `claim`
now guards on `claimed_at`, `markSent` is the only writer of `sent_at`, and
`markFailed` clears `claimed_at` to re-arm the retry. `claim` clears
`notified_at` whenever it advances the row to a new due time, which is what
makes a reschedule re-notify while a retry does not.

Rejected:

- **Deriving "already notified" from the `notifications` table.** It stores
  type, text, url and timestamps only; answering "was this host notified for
  _this_ due time" would mean matching on a URL string or a time window, and
  neither survives a reschedule that lands on the same session.
- **A second row per channel.** Doubles the table and makes a reschedule re-arm
  two rows atomically, for state that belongs to one reminder.
- **Overloading `sent_at` to mean "delivered on whatever channels applied".**
  It makes the field lie for every row it is true of, and breaks the guarantee
  that a host who opts back in before the next tick still gets their mail.

### 7. The migration settles the follow-up for sessions that had already finished

A follow-up is deliberately never dropped for being late (FR-011), so on an
existing installation the first tick after the upgrade would find every
uncounted session in the event history owed one — a notification and an email
per host per session, about sessions that finished months ago.

`drizzle/0034_session_attendee_count.sql` therefore ends with a hand-written
backfill: one settled `followUp` row (`claimed_at` and `notified_at` set,
`sent_at` left NULL — nothing was mailed) for every host of every session whose
follow-up was already due when the migration ran. The due time is computed in
SQL to match `followUpDueTime` to the millisecond; anything else would read as
a reschedule and re-arm the very reminder it suppresses.

The line is "already due", not "already finished": a session that ended two
minutes before the upgrade still gets its follow-up on the next tick, which is
what a host would expect.

Rejected: a staleness cutoff in `followUpEligible`. It would also drop the
reminders an instance owes after a few hours of downtime, which is exactly the
case FR-011 is written for.

### The banner is withdrawn

`listUncountedFinishedByHost` and the schedule prompt it fed are deleted
(FR-025): the notification list says the same thing in the place hosts already
look. The host-only control and the `?record=count` deep link stay.
