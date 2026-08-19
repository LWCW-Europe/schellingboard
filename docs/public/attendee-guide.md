---
title: "Attendee guide"
description: "How to pick your name, propose a session, vote, RSVP, and protect your name."
type: guide
---

# Using SchellingBoard as an attendee

## The three phases

An event moves through up to three phases, and what you can do depends on
which one it is in. Buttons that belong to another phase are greyed out rather
than hidden — hover one to see when it opens.

| Phase          | What you can do                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Proposal**   | Propose sessions, edit your own, and comment on any of them. Voting is not open yet.                                  |
| **Voting**     | All of the above, plus vote on proposals. Vote counts stay hidden.                                                    |
| **Scheduling** | Vote counts become visible; put proposals on the schedule, book empty slots, and RSVP. Proposing and voting are over. |

Nothing you do before the scheduling phase commits you to anything: proposing
a session is not a promise to give it, and voting is not a promise to attend.
**RSVPs are the exception** — see [RSVP](#rsvp).

Organizers can skip phases, and an event with no phase dates at all is simply
always in the scheduling phase.

## Pick your name

Open the event link, enter the site password if asked, then pick your name
from the list. By default this isn't a login — anyone can pick any name — so
please only pick your own. If you'd rather it _were_ a login, see
[Protect your name](#protect-your-name) below.

## Propose a session

You can browse, search, and sort existing proposals at any time. Search covers
titles, hosts and the full description — a tool or prerequisite mentioned deep
in a proposal is enough to find it — and while you are searching, results stay
ordered by how well they match. During the **proposal** phase, click "Add
Proposal" to suggest a session: title, description, and optionally co-hosts.
You can edit your own proposals until scheduling starts. Proposing is not a commitment — a proposal only becomes a
real session once someone puts it on the schedule.

A proposal doesn't need a host. Leaving the host field empty is a way of
saying "I'd like someone to offer this" rather than "I'll give this" — a
request instead of an offer. Anyone who can give such a session takes it on by
editing the proposal and adding themselves as a host; nobody's permission is
needed.

Description fields accept Markdown. A small toolbar above the box adds bold,
italics, links, lists, quotes and code for you, and a **Preview** tab shows
how the text will look before you save.

![Session proposal form with title, description, hosts, and duration fields](../screenshots/proposal-edit.webp)

## Discuss a proposal

Open a proposal to see its comments. Pick your name first, then leave a
comment or reply to someone else's — a good place to ask what background is
assumed, offer to co-host, or work out whether two proposals should merge.
Replies are threaded, and the `[-]` next to a comment folds it and everything
under it away.

Like a comment to agree with it without adding another comment to the thread.
Click the like count next to the button to see who liked it, and click "Liked"
again to take your like back.

You can edit or delete your own comments. Deleting is permanent — there is no
history and no undo. If the comment already has replies, a "Comment deleted"
placeholder stays behind so the replies still make sense.

Each comment's timestamp links to that comment alone, so you can point
someone at one particular remark.

## Vote

During the **voting** phase, react to each proposal with ❤️ Interested,
⭐ Maybe, or 👋 Skip. Click your choice again to remove it. Voting is not a
commitment: when you vote you have no idea what else will be running at the
same time, so nobody reads your votes as a promise to turn up.

![Proposal list with Interested / Maybe / Skip vote buttons](../screenshots/proposals-vote.webp)

### The fastest way to vote

Click **"Go to Quick Voting!"** on the proposals page. It shows you one
proposal at a time, skipping the ones you have already voted on, and counts
down how many are left.

![Quick Voting screen showing one proposal with large Interested / Maybe / Skip buttons](../screenshots/quick-voting.webp)

You can see and change your own votes at any time while voting is open: your
choice is highlighted on each proposal, and the **"Only voted"** and
**"Only unvoted"** filters on the proposals page narrow the list to either
group. You don't vote on your own proposals — the buttons aren't shown there.

### Why the vote buttons are greyed out

Greyed-out vote buttons mean voting isn't available to you _right now_. Hover
one to see why:

- **"Voting will be enabled at …"** — the event is still in the proposal
  phase. Add and discuss proposals now; come back to vote when it opens.
- **"Select a user first"** — you haven't picked your name yet.
- **"The voting phase is over"** — scheduling has started. Vote counts are
  visible now.

### Results stay hidden until voting closes

Nobody can see the vote counts while voting is running, so early votes can't
sway later ones. The counts appear for everyone when the scheduling phase
starts.

**Only the counts are ever shown — never who voted which way.** Your own votes
are visible to you alone; a host sees how many people were interested in their
proposal, not their names, and neither does anyone else, organizers included.
Hosts get the fuller picture of their own proposal — see
[How many people to expect](#how-many-people-to-expect).

## The schedule

Once **scheduling** opens, proposals turn into real sessions on the grid.
Proposing and voting close.

![Simple scheduling grid with rooms as columns and time slots as rows](../screenshots/schedule-grid.webp)

### Put a proposal on the schedule

Two ways, whichever you find first:

- **From the proposal.** Click **"Proposals"** at the top of the schedule,
  then **"Schedule"** — either in the proposals table or on the proposal's own
  page. Pick a room and a time slot, and save.
- **From the grid.** Click an empty slot in a bookable room, then use the
  **"Pre-fill from proposal"** dropdown to fill the form from one of your
  proposals. You can also ignore it and just book the slot with a brand-new
  session that was never proposed.

![Form for adding a session to the schedule, with a Pre-fill from proposal dropdown](../screenshots/add-session.webp)

Two things worth knowing:

- **Proposals with no host are up for grabs.** Anyone can schedule one — no
  permission needed. They show up in your "Pre-fill from proposal" dropdown
  alongside your own.
- **The same proposal can be scheduled more than once**, for instance in two
  slots if interest is high and you're happy to give it twice.

### How many people to expect

Vote counts become visible when scheduling opens. They tell you roughly how
much interest there is — not how many people will walk in, since voters didn't
know what would end up running against your session.

Open your own proposal during scheduling and it shows a **vote breakdown**:
how many attendees voted and how many didn't, how the votes split between
❤️, ⭐ and 👋🏽, and how many people to expect if you host it.

The expectation is a **range**, not a number — "expect 8–17 people" — and even
that is **a very rough guess**. Where it comes from: at one event, thirteen
hosts were asked afterwards roughly how many people had come to their session,
and those recollections were compared against the votes. The formula that came
out of it takes a proposal's ❤️ count relative to the other proposals at the
event and scales it by the number of attendees.

That is hardly any data to build on, so the range can be well out in either
direction — use it to pick a room, nothing more. Expect it to change: the
formula will be reworked as more events are recorded, and the assumptions
behind it (currently a fixed guess at how many sessions run at the same time)
will become settings an organizer can adjust per event. If fewer than 10% of
attendees voted on the proposal, or nobody voted ❤️, no figure is given at all.

**Keep voting ⭐ Maybe.** Today's formula happens not to use ⭐ votes — at that
one event they didn't visibly improve the guess — but thirteen sessions prove
very little, and hosts read your ⭐ as real interest regardless.

The breakdown is for the hosts: on a proposal nobody hosts yet, anyone can see
it, since anyone may still take it on.

![Proposals list in the scheduling phase, with a Your vote column and heart and star vote counts per proposal](../screenshots/proposals-results.webp)

### RSVP

Click a session to see its details and **RSVP**.

![Session detail popup with host, location, time, attendee list, and full description](../screenshots/session-details.webp)

Unlike votes, **an RSVP is a commitment** — hosts plan around it. If you
change your mind, take it back with "Un-RSVP": someone else may want the
place. You'll be warned if you RSVP to two sessions that overlap.

Depending on how the organizers set the event up, a session's capacity is
either advisory or a hard limit; with a hard limit the button reads "Session
full" and no further RSVPs are accepted. A session marked **closed** warns
that you can be at most five minutes late, but doesn't block your RSVP.

## Attendee directory & profiles

Every attendee gets a profile page with their bio, proposals, and the sessions
they're hosting — click any name wherever it appears to see it. Click their
profile photo to see it enlarged. The attendee directory lets you search
everyone at the event and see who's hosting a session at a glance. Search
covers everything on a profile — names, pronouns, bios, languages, where
someone is based, prompts and their answers, and any contact details they
published — so a remembered handle, a service name like "Signal", or a shared
interest is enough to find someone. Your private email address is never part
of a profile and is never searched.

The list is alphabetical by default; **Sort by → Recently updated** puts the
profiles that changed most recently first, which is the quick way to see who
has filled theirs in since you last looked. Each row shows when that profile
was last edited; profiles that are still empty show no date and come last.
While you are searching, results stay ordered by how well they match, so the
sort choice is unavailable.

![Searchable attendee directory with avatars, bios, and Session host badges](../screenshots/attendees.webp)

## Your profile

After picking your name, open "Edit profile" to set your About me,
pronouns, and avatar. These are visible to other attendees wherever your
name appears (proposals, hosting, RSVPs).

About me, the answers to the conversation starters, and your contact details
all accept Markdown, so you can add bold text or a named link — and a web
address or email address you paste in becomes clickable on its own.

![Edit profile form with name, pronouns, avatar, and a Markdown-supported about-me field](../screenshots/edit-profile.webp)

## Protect your name

Normally anyone on the site can pick your name and act as you. If you'd
rather that took a login, open **Settings → Account security** and click
**Enable protection**. You'll be emailed an 8-character code, valid for 10
minutes; type it in to confirm. You can optionally set a password at the same
time.

![Settings page with email notification checkboxes and an Enable protection button](../screenshots/user-settings.webp)

Once protected, picking your name from the list asks for your password or a
fresh emailed code. Anything done as you — voting, RSVPing, editing your
profile, creating or changing your sessions — needs that login. It lasts a
week, or until you switch to a different name.

To turn protection off or change your password, use either your current
password or a fresh emailed code — whichever you have to hand. You'll get an
email letting you know the change happened.

Two things worth knowing:

- **Codes go to the email address the organizers have on file for you.** If
  you can't receive it, ask them to check the address. If the event has no
  email set up at all, protection isn't available.
- **Protecting your name is what makes your sessions yours.** Only a
  session's hosts can edit or delete it — but if you haven't protected your
  name, anyone can pick your name and edit as you. Protection is what closes
  that gap.

Lost access to both your password and your email? Ask an organizer to update
the email address they have on file for you — codes then go to the new
address, and you can unlock from there.

## Email settings

If the event has email enabled, Settings also controls which notifications
you get: when a session you host or RSVP'd to is moved or deleted, when
someone adds you as a co-host, and when someone comments on a proposal you're
hosting. These are on by default and can be turned off independently. One
further setting is off by default: emails about every new comment on a
proposal you have commented on yourself.

## Dark mode

The switch at the very bottom of every page — System, Light, Dark — chooses
how the site looks. **System** follows whatever your phone or laptop is set
to, so the site turns dark in the evening if your device does. The same switch
is on the settings page under "Appearance".

The choice is remembered on the device you made it on, not on your name: you
can read the schedule in the dark on your phone while your laptop stays light,
and it works before you have picked your name.
