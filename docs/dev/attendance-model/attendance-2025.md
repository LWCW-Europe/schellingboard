# Predicting session attendance from voting results

Data from a 2025 unconference: **259 attendees**, about **9 sessions running in
parallel** at any given time, and 13 sessions whose hosts could tell us roughly how
many people showed up.

Voting was a three-way choice per session — **Interested**, **Maybe**, or **Skip**.
Around 40% of attendees voted (99–107 votes cast per session).

> **Every attendance figure is a host's recollection, not a count.** Treat them as
> ±25% at best. Sessions are numbered by interest share; titles are withheld.

## The data

| # | Interested | Maybe | Skip | Total votes | Interest share | RSVPs | Attended |
|---|---:|---:|---:|---:|---:|---:|---:|
| Session 1 | 57 | 26 | 24 | 107 | 53% | 52 | ~40–60 |
| Session 2 | 43 | 26 | 35 | 104 | 41% | 18 | ~12 |
| Session 3 | 40 | 19 | 46 | 105 | 38% | 35 | ~35 |
| Session 4 | 36 | 30 | 37 | 103 | 35% | 45 | ~30–40 |
| Session 5 | 28 | 20 | 54 | 102 | 27% | 13 | ~15 |
| Session 6 | 27 | 31 | 43 | 101 | 27% | 12 | ~15–20 |
| Session 7 | 27 | 29 | 47 | 103 | 26% | 13 | ~10 |
| Session 8 | 24 | 29 | 50 | 103 | 23% | 7 | ~5–8 |
| Session 9 | 22 | 15 | 65 | 102 | 22% | 12 | ~18 |
| Session 10 | 19 | 34 | 51 | 104 | 18% | 16 | ~15 |
| Session 11 | 16 | 35 | 51 | 102 | 16% | 8 | ~25 |
| Session 12 | 12 | 13 | 76 | 101 | 12% | 15 | ~20 |
| Session 13 | 9 | 17 | 73 | 99 | 9% | 8 | ~6 |

*Interest share = Interested ÷ total votes on that session. Average across the 13: **27%**.*

## What the data says

- **About 69% of *Interested* votes turn into bodies in the room.**
  That is the formula in one sentence; the rest is bookkeeping for events of a
  different size.
- **"Maybe" votes carry no signal.** Adding them to the interest share at any weight
  made predictions *worse*. Only *Interested* counts.
- **The link is real but noisy.** Sessions with near-identical interest shares drew
  crowds differing by a factor of two or more, in both directions.
- **RSVPs predict far better than votes** (R² 0.63 against 0.20 for the
  formula below, both on log attendance) — but they arrive after you have already had
  to pick a room, and once you know them the vote adds nothing.

## The formula

It predicts a **range**, not a number. Given the noise in the underlying data, a
single number would be false precision.

```
            s          N
  M  =  k · ──   ×    ───          the midpoint
            s̄          P

  range  =  M ÷ g  …  M × g        g = exp(z · σ)

                  ┌─────────────────────┐
        σ  =  sqrt│  0.31  +   1 − s    │      z = 0.67 for a 50% range
                  │            ───────  │      z = 1.28 for an 80% range
                  └             s · V   ┘
```

| symbol | meaning | 2025 value |
|---|---|---|
| `N` | total attendees at the event | 259 |
| `P` | sessions running in parallel | 9 |
| `s` | Interested ÷ total votes, for your session | varies |
| `s̄` | average `s` across all sessions at the event | 0.27 |
| `V` | number of people who voted on your session | ~103 |
| `k` | share of attendees in *any* session at a given moment | 0.66 |
| `0.31` | irreducible variance — what the vote cannot know | — |

### Does the number of voters matter?

Yes, but only for the **width** of the range, never for the midpoint.

`s` is a *share*, not a count, so if 200 people vote instead of 100 and the same
proportion are Interested, the prediction is unchanged. That is the desired
behaviour: turnout should not change the answer, only the confidence in it.

Where turnout does enter is the `(1 − s) / (s · V)` term — the sampling error of
estimating a share from `V` voters. Few voters, wide range:

| Voters on the session | Midpoint | 80% range | width |
|---:|---:|---:|---:|
| 10 | 19 | 7–51 | ×7.1 |
| 25 | 19 | 8–44 | ×5.3 |
| 50 | 19 | 9–42 | ×4.7 |
| 100 | 19 | 9–40 | ×4.5 |
| 259 | 19 | 9–40 | ×4.3 |

*(holding interest share at 27%)*

Two honest caveats on this:

1. **This part is derived, not measured.** In 2025 every session got 99–107 votes,
   so there is no variation in turnout to fit against. The sampling term comes from
   binomial theory, not from evidence.
2. **It assumes voters are representative of attendees.** With 40% turnout that is a
   real assumption. If the people who bother to vote are systematically keener
   session-goers, the formula over-predicts across the board — and `k` is silently
   absorbing some of that.

At 2025 turnout, sampling error is only ~10% of the total error. Polling more people
sharpens the estimate a little; the floor is the `0.31` intrinsic term, which no
amount of voting can reduce.

## Look-up table

For a 2025-sized event (N=259, P=9, s̄=0.27, ~103 voters per session).

| Interest share | Likely (50%) | Plan for (80%) |
|---:|---:|---:|
| 5% | 2–6 | 1–9 |
| 10% | 5–11 | 3–16 |
| 15% | 7–16 | 5–23 |
| 20% | 10–21 | 7–30 |
| 25% | 12–26 | 8–38 |
| 30% | 14–31 | 10–45 |
| 35% | 17–37 | 12–52 |
| 40% | 19–42 | 14–59 |
| 45% | 22–47 | 15–66 |
| 50% | 24–52 | 17–74 |
| 60% | 29–62 | 21–88 |

**Use the 50% range to decide whether the session is worth running, and the top of
the 80% range to pick a room.** Under-booking a room hurts more than over-booking.

## How well does it work?

| # | Interest share | Likely (50%) | Plan for (80%) | Actual | In 80%? |
|---|---:|---:|---:|---:|:-:|
| Session 1 | 53% | 26–55 | 18–78 | ~40–60 | yes |
| Session 2 | 41% | 20–43 | 14–61 | ~12 | **no** |
| Session 3 | 38% | 18–40 | 13–56 | ~35 | yes |
| Session 4 | 35% | 17–37 | 12–52 | ~30–40 | yes |
| Session 5 | 27% | 13–29 | 9–41 | ~15 | yes |
| Session 6 | 27% | 13–28 | 9–40 | ~15–20 | yes |
| Session 7 | 26% | 13–28 | 9–39 | ~10 | yes |
| Session 8 | 23% | 11–25 | 8–35 | ~5–8 | yes |
| Session 9 | 22% | 10–23 | 7–33 | ~18 | yes |
| Session 10 | 18% | 9–19 | 6–28 | ~15 | yes |
| Session 11 | 16% | 7–17 | 5–24 | ~25 | **no** |
| Session 12 | 12% | 6–13 | 4–19 | ~20 | **no** |
| Session 13 | 9% | 4–10 | 3–15 | ~6 | yes |

Calibration — how often the range caught the session. Where the host gave a range
rather than a figure, it counts as caught if the two ranges overlap at all:

| Nominal | Actual |
|---:|---:|
| 50% | 62% (8/13) |
| 80% | 77% (10/13) |

Close enough to nominal that the ranges can be taken at face value — with the
caveat that they were calibrated on the same 13 sessions they are scored against.

The 3 misses fall on both sides: 1 drew well under the predicted range
and 2 well over. There is no sign that the formula is biased high or low overall —
it is simply imprecise.

## Caveats worth stating plainly

1. **13 sessions.** The vote–attendance correlation is not statistically
   significant at this sample size (p ≈ 0.07 on log attendance; on ranks it is 0.19).
   This is the best available guess, not an established relationship.
2. **Attendance was recalled, not counted**, and several figures are ranges.
3. **Self-selected sample** — the hosts who replied. Their sessions averaged 20
   attendees against a fair-share expectation of 29.
4. **`P` is treated as a constant 9.** In reality it varies by slot, and a session
   competing against 5 others should draw more than one competing against 12.
5. **Time slot, room, and what a session runs against are all ignored** — probably
   the largest missing variable.

## What would sharpen this next year

- **Count attendance.** A host entering a number at the end of each session turns
  ±25% recollections into data. By far the highest-value change.
- **Record the timetable**, so each session's real competition is known instead of a
  flat `P = 9`.
- **Vary or record turnout deliberately** — with 99–107 votes on every session, the
  effect of the number of voters is currently theory, not measurement.
- **Give voters a limited budget** (say, N stars) instead of unlimited Interested
  flags. "Interested" is cheap, which is very likely why Maybe votes turned out to
  carry no signal at all.
