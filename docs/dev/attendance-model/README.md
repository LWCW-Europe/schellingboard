# Attendance prediction from voting results

Fits a formula predicting session attendance from Schelling Board votes, using
the 2025 event (259 attendees, 9 parallel sessions, 13 sessions with reported
attendance).

| File                 | What it is                                                       |
| -------------------- | ---------------------------------------------------------------- |
| `data-2025.csv`      | The data, machine-readable and anonymised. Source of truth       |
| `model.py`           | Constants, data loading, the fitted formula. Import this         |
| `attendance-2025.md` | **The write-up — publishable as-is.** Generated                  |
| `explore.py`         | Why this model form: candidate comparison by leave-one-out error |
| `validate.py`        | Significance, bootstrap CIs, variance decomposition, calibration |
| `make_report.py`     | Regenerates `attendance-2025.md` from the CSV                    |

```sh
uv run explore.py
uv run validate.py
uv run make_report.py   # after editing the CSV
```

Sessions are numbered by interest share, highest first. The report is written to
be publishable: no titles, and the commentary is kept quantitative so a session
cannot be recognised from its description.

## Result

Midpoint, then a range around it:

    M      = 0.66 × (N / P) × (s / s̄)
    range  = M / g  …  M × g          g = exp(z · σ)
    σ      = sqrt( 0.31 + (1 − s) / (s · V) )

`s` = Interested ÷ total votes on the session, `s̄` = event-wide mean of `s`,
`N` = attendees, `P` = parallel sessions, `V` = people who voted on that session.
`z` = 0.674 for a 50% range, 1.282 for 80%.

Maybe votes are deliberately excluded — every non-zero weight on them made
predictions worse.

### Where the number of voters enters

Only in the width, never in the midpoint. `s` is a share, so doubling turnout at
the same proportions leaves the prediction unchanged; what changes is confidence
in it, via the binomial term `(1 − s)/(s · V)`. At 2025 turnout that term is only
~10% of total error — the `0.31` intrinsic variance is the floor, and no amount
of voting reduces it.

Calibration on 2025: 50% range caught 62% of sessions, 80% range caught 77%
(a session counts as caught if the host's recalled range overlaps the predicted
one at all).

## Caveats

With n=13 the vote–attendance correlation is not statistically significant
(p ≈ 0.07 on log attendance, 0.19 on ranks). The exponent on `s/s̄` is pinned to
1 rather than fitted: the in-sample best is 0.66, but that is overfitting — the
bootstrap CI spans [-0.17, 1.28] and 1 cross-validates best.

The turnout term is derived from binomial theory, not measured: every session in
2025 got 99–107 votes, so there is no variation to fit against. It also assumes
voters are representative of attendees, which at 40% turnout is a real
assumption — `k` is silently absorbing any bias there.

RSVPs predict far better (log R² 0.63 vs 0.20) but arrive after hosts have already
picked a room, and once you know them the vote adds nothing on top.
