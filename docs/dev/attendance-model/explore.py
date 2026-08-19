"""Why this model form? Compares candidates by leave-one-out error.

Conclusions baked into model.py:
  - only Interested counts; any weight on Maybe makes predictions worse
  - the exponent on s/s_bar is pinned to 1 (fitted 0.66 is overfitting)
  - k = 0.66

Run: uv run explore.py
"""

import numpy as np
import pandas as pd
from scipy.optimize import minimize

from model import A, ATTENDEES, BASE, K, N_SESSIONS, RSVP, log_r2, share

pd.set_option("display.width", 200, "display.max_colwidth", 46)

# name -> (initial params, predict(params, w))
CANDIDATES = {
    "null (mean)": ([20.0], lambda p, w: np.full_like(A, p[0])),
    "linear in share": ([0.0, 50.0], lambda p, w: np.clip(p[0] + p[1] * share(w), 0.5, None)),
    "proportional (no free params)": ([], lambda p, w: BASE * share(w) / share(w).mean()),
    "normalised power law": ([0.7, 1.0],
                             lambda p, w: p[0] * BASE * (share(w) / share(w).mean()) ** p[1]),
    "choice model": ([0.3, 0.3],
                     lambda p, w: ATTENDEES * p[0] * share(w) / (share(w) + p[1])),
    "RSVP baseline (not usable)": ([1.0, 1.0], lambda p, w: p[0] * RSVP ** p[1]),
}


def fit(fn, init, sel, ws):
    """Least squares on log(A) over training rows `sel`, scanning maybe-weights `ws`."""
    best = (np.inf, [], 0.0)
    for w in ws:
        def loss(p, w=w):
            with np.errstate(all="ignore"):
                pred = fn(p, w)
            if not np.all(np.isfinite(pred)) or np.any(pred <= 0):
                return 1e9
            return float(np.sum((np.log(pred[sel]) - np.log(A[sel])) ** 2))

        if not len(init):
            val, p = loss([]), []
        else:
            r = minimize(loss, init, method="Nelder-Mead", options={"maxiter": 20000})
            val, p = float(r.fun), r.x
        if val < best[0]:
            best = (val, p, w)
    return best[1], best[2]


def loo(fn, init, ws):
    """Leave-one-out median absolute % error."""
    errs = []
    for i in range(N_SESSIONS):
        sel = np.ones(N_SESSIONS, bool)
        sel[i] = False
        p, w = fit(fn, init, sel, ws)
        errs.append(abs(fn(p, w)[i] - A[i]) / A[i] * 100)
    return float(np.median(errs))


print(f"N/P = {BASE:.1f} people per session if the crowd split evenly\n")
print("=== Candidate model forms ===")
rows = []
for name, (init, fn) in CANDIDATES.items():
    ws = [0.0] if "RSVP" in name else np.linspace(0, 1, 21)
    p, w = fit(fn, init, np.ones(N_SESSIONS, bool), ws)
    rows.append({
        "model": name,
        "R2_log": round(log_r2(fn(p, w)), 3),
        "LOO_med_err_%": round(loo(fn, init, ws), 1),
        "maybe weight": round(w, 2),
    })
print(pd.DataFrame(rows).sort_values("LOO_med_err_%").to_string(index=False))
print("\nRSVPs win, but only exist after a host has already picked a room.")
print("The power law scores badly here because k and b are both refitted on every")
print("fold; with b pinned (next section) it beats the null comfortably.")

# --- Within the chosen form, pick the maybe-weight and the exponent ----------
print("\n\n=== Normalised power law: maybe-weight w and exponent b ===")


def fit_pinned(w, b, sel=None):
    """k for fixed w and b; b=None fits it. Returns (k, b, predictions)."""
    sel = np.ones(N_SESSIONS, bool) if sel is None else sel
    sw = share(w)
    x, y = np.log(sw / sw.mean()), np.log(A / BASE)
    if b is None:
        b, a = np.polyfit(x[sel], y[sel], 1)
        k = np.exp(a)
    else:
        k = np.exp(np.mean(y[sel] - b * x[sel]))
    return k, b, k * BASE * (sw / sw.mean()) ** b


rows = []
for w in [0.0, 0.25, 0.5, 1.0]:
    for b in [None, 1.0, 2 / 3, 0.5]:
        k, b_fit, pred = fit_pinned(w, b)
        errs = []
        for i in range(N_SESSIONS):
            sel = np.ones(N_SESSIONS, bool)
            sel[i] = False
            errs.append(abs(fit_pinned(w, b, sel)[2][i] - A[i]) / A[i] * 100)
        rows.append({
            "maybe weight w": w,
            "exponent b": "free" if b is None else round(b, 2),
            "fitted b": round(b_fit, 2),
            "k": round(k, 2),
            "R2_log": round(log_r2(pred), 3),
            "LOO_med_err_%": round(float(np.median(errs)), 1),
        })
print(pd.DataFrame(rows).sort_values("LOO_med_err_%").head(8).to_string(index=False))
print("\nw=0, b=1 wins: Maybe votes are noise, and the curvature the in-sample fit")
print("wants (b=0.66) does not survive cross-validation.")

k, _, pred = fit_pinned(0.0, 1.0)
chosen_loo = []
for i in range(N_SESSIONS):
    sel = np.ones(N_SESSIONS, bool)
    sel[i] = False
    chosen_loo.append(abs(fit_pinned(0.0, 1.0, sel)[2][i] - A[i]) / A[i] * 100)
print(f"\n=== Chosen: A = {k:.2f} * (N/P) * (s/s_bar)   [model.py uses K={K}] ===")
if abs(k - K) > 0.005:
    print(f"  !! K is stale after the data changed -- set model.py K = {k:.2f}")
print(f"  median error {np.median(np.abs(pred - A) / A * 100):.0f}%, "
      f"LOO {np.median(chosen_loo):.0f}%")
print(f"  vs always guessing the mean ({A.mean():.0f}): "
      f"{np.median(np.abs(A.mean() - A) / A * 100):.0f}%")
