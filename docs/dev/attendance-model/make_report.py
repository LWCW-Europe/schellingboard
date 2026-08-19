"""Generate the public markdown report from the CSV, so the tables can't drift.

The report is publishable: sessions are identified by number only, and the
commentary is kept quantitative so a session cannot be recognised from its
description.

Run: uv run make_report.py
"""

from pathlib import Path

from model import (A, ATTENDEES, BASE, HI_A, I, K, LO_A, M, N_SESSIONS, PARALLELISM,
                   RSVP, S, S_BAR, V, covers, df, log_r2, midpoint, predict, s)

lines = []
w = lines.append


def att(i):
    lo, hi = LO_A[i], HI_A[i]
    return f"~{lo:g}" if lo == hi else f"~{lo:g}–{hi:g}"


w("# Predicting session attendance from voting results")
w("")
w("Data from a 2025 unconference: **259 attendees**, about **9 sessions running in")
w("parallel** at any given time, and 13 sessions whose hosts could tell us roughly how")
w("many people showed up.")
w("")
w("Voting was a three-way choice per session — **Interested**, **Maybe**, or **Skip**.")
w(f"Around {V.mean() / ATTENDEES * 100:.0f}% of attendees voted "
  f"({V.min():.0f}–{V.max():.0f} votes cast per session).")
w("")
w("> **Every attendance figure is a host's recollection, not a count.** Treat them as")
w("> ±25% at best. Sessions are numbered by interest share; titles are withheld.")
w("")

w("## The data")
w("")
w("| # | Interested | Maybe | Skip | Total votes | Interest share | RSVPs | Attended |")
w("|---|---:|---:|---:|---:|---:|---:|---:|")
for i in range(N_SESSIONS):
    w(f"| {df['session_id'][i]} | {I[i]:.0f} | {M[i]:.0f} | {S[i]:.0f} | {V[i]:.0f} | "
      f"{s[i] * 100:.0f}% | {RSVP[i]:.0f} | {att(i)} |")
w("")
w(f"*Interest share = Interested ÷ total votes on that session. Average across the "
  f"13: **{S_BAR * 100:.0f}%**.*")
w("")

w("## What the data says")
w("")
w(f"- **About {K * BASE / (S_BAR * V.mean()) * 100:.0f}% of *Interested* votes turn into bodies in the room.**")
w("  That is the formula in one sentence; the rest is bookkeeping for events of a")
w("  different size.")
w("- **\"Maybe\" votes carry no signal.** Adding them to the interest share at any weight")
w("  made predictions *worse*. Only *Interested* counts.")
w("- **The link is real but noisy.** Sessions with near-identical interest shares drew")
w("  crowds differing by a factor of two or more, in both directions.")
w(f"- **RSVPs predict far better than votes** (R² 0.63 against {log_r2(midpoint(s)):.2f} for the")
w("  formula below, both on log attendance) — but they arrive after you have already had")
w("  to pick a room, and once you know them the vote adds nothing.")
w("")

w("## The formula")
w("")
w("It predicts a **range**, not a number. Given the noise in the underlying data, a")
w("single number would be false precision.")
w("")
w("```")
w("            s          N")
w("  M  =  k · ──   ×    ───          the midpoint")
w("            s̄          P")
w("")
w("  range  =  M ÷ g  …  M × g        g = exp(z · σ)")
w("")
w("                  ┌─────────────────────┐")
w("        σ  =  sqrt│  0.31  +   1 − s    │      z = 0.67 for a 50% range")
w("                  │            ───────  │      z = 1.28 for an 80% range")
w("                  └             s · V   ┘")
w("```")
w("")
w("| symbol | meaning | 2025 value |")
w("|---|---|---|")
w(f"| `N` | total attendees at the event | {ATTENDEES} |")
w(f"| `P` | sessions running in parallel | {PARALLELISM} |")
w("| `s` | Interested ÷ total votes, for your session | varies |")
w(f"| `s̄` | average `s` across all sessions at the event | {S_BAR:.2f} |")
w(f"| `V` | number of people who voted on your session | ~{V.mean():.0f} |")
w(f"| `k` | share of attendees in *any* session at a given moment | {K} |")
w("| `0.31` | irreducible variance — what the vote cannot know | — |")
w("")

w("### Does the number of voters matter?")
w("")
w("Yes, but only for the **width** of the range, never for the midpoint.")
w("")
w("`s` is a *share*, not a count, so if 200 people vote instead of 100 and the same")
w("proportion are Interested, the prediction is unchanged. That is the desired")
w("behaviour: turnout should not change the answer, only the confidence in it.")
w("")
w("Where turnout does enter is the `(1 − s) / (s · V)` term — the sampling error of")
w("estimating a share from `V` voters. Few voters, wide range:")
w("")
w("| Voters on the session | Midpoint | 80% range | width |")
w("|---:|---:|---:|---:|")
for v in [10, 25, 50, 100, 259]:
    lo, mu, hi = predict(0.27, v, 0.80)
    w(f"| {v} | {mu:.0f} | {lo:.0f}–{hi:.0f} | ×{hi / lo:.1f} |")
w("")
w("*(holding interest share at 27%)*")
w("")
w("Two honest caveats on this:")
w("")
w("1. **This part is derived, not measured.** In 2025 every session got 99–107 votes,")
w("   so there is no variation in turnout to fit against. The sampling term comes from")
w("   binomial theory, not from evidence.")
w("2. **It assumes voters are representative of attendees.** With 40% turnout that is a")
w("   real assumption. If the people who bother to vote are systematically keener")
w("   session-goers, the formula over-predicts across the board — and `k` is silently")
w("   absorbing some of that.")
w("")
w("At 2025 turnout, sampling error is only ~10% of the total error. Polling more people")
w("sharpens the estimate a little; the floor is the `0.31` intrinsic term, which no")
w("amount of voting can reduce.")
w("")

w("## Look-up table")
w("")
w("For a 2025-sized event (N=259, P=9, s̄=0.27, ~103 voters per session).")
w("")
w("| Interest share | Likely (50%) | Plan for (80%) |")
w("|---:|---:|---:|")
for pct in [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60]:
    l5, _, h5 = predict(pct / 100, 103, 0.50)
    l8, _, h8 = predict(pct / 100, 103, 0.80)
    w(f"| {pct}% | {l5:.0f}–{h5:.0f} | {l8:.0f}–{h8:.0f} |")
w("")
w("**Use the 50% range to decide whether the session is worth running, and the top of")
w("the 80% range to pick a room.** Under-booking a room hurts more than over-booking.")
w("")

w("## How well does it work?")
w("")
l5, _, h5 = predict(s, V, 0.50)
l8, _, h8 = predict(s, V, 0.80)
hit80 = covers(l8, h8)
w("| # | Interest share | Likely (50%) | Plan for (80%) | Actual | In 80%? |")
w("|---|---:|---:|---:|---:|:-:|")
for i in range(N_SESSIONS):
    w(f"| {df['session_id'][i]} | {s[i] * 100:.0f}% | {l5[i]:.0f}–{h5[i]:.0f} | "
      f"{l8[i]:.0f}–{h8[i]:.0f} | {att(i)} | {'yes' if hit80[i] else '**no**'} |")
w("")
w("Calibration — how often the range caught the session. Where the host gave a range")
w("rather than a figure, it counts as caught if the two ranges overlap at all:")
w("")
w("| Nominal | Actual |")
w("|---:|---:|")
for conf in (0.50, 0.80):
    lo, _, hi = predict(s, V, conf)
    c = covers(lo, hi)
    w(f"| {conf:.0%} | {c.mean():.0%} ({c.sum()}/{N_SESSIONS}) |")
w("")
w("Close enough to nominal that the ranges can be taken at face value — with the")
w("caveat that they were calibrated on the same 13 sessions they are scored against.")
w("")
under, over = int((HI_A < l8).sum()), int((LO_A > h8).sum())
w(f"The {(~hit80).sum()} misses fall on both sides: {under} drew well under the predicted range")
w(f"and {over} well over. There is no sign that the formula is biased high or low overall —")
w("it is simply imprecise.")
w("")

w("## Caveats worth stating plainly")
w("")
w(f"1. **{N_SESSIONS} sessions.** The vote–attendance correlation is not statistically")
w("   significant at this sample size (p ≈ 0.07 on log attendance; on ranks it is 0.19).")
w("   This is the best available guess, not an established relationship.")
w("2. **Attendance was recalled, not counted**, and several figures are ranges.")
w(f"3. **Self-selected sample** — the hosts who replied. Their sessions averaged {A.mean():.0f}")
w(f"   attendees against a fair-share expectation of {BASE:.0f}.")
w("4. **`P` is treated as a constant 9.** In reality it varies by slot, and a session")
w("   competing against 5 others should draw more than one competing against 12.")
w("5. **Time slot, room, and what a session runs against are all ignored** — probably")
w("   the largest missing variable.")
w("")

w("## What would sharpen this next year")
w("")
w("- **Count attendance.** A host entering a number at the end of each session turns")
w("  ±25% recollections into data. By far the highest-value change.")
w("- **Record the timetable**, so each session's real competition is known instead of a")
w("  flat `P = 9`.")
w("- **Vary or record turnout deliberately** — with 99–107 votes on every session, the")
w("  effect of the number of voters is currently theory, not measurement.")
w("- **Give voters a limited budget** (say, N stars) instead of unlimited Interested")
w("  flags. \"Interested\" is cheap, which is very likely why Maybe votes turned out to")
w("  carry no signal at all.")

(Path(__file__).parent / "attendance-2025.md").write_text("\n".join(lines) + "\n")
print(f"wrote attendance-2025.md ({len(lines)} lines)")
