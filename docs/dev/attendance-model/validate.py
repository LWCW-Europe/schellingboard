"""How much of this survives n=13, approximate attendance, and near-constant turnout?

Also splits the error into the part more voting could fix and the part it cannot,
which is where INTRINSIC_VAR in model.py comes from.

Run: uv run validate.py
"""

import numpy as np
import pandas as pd
from scipy import stats

from model import (A, ATTENDEES, BASE, HI_A, I, INTRINSIC_VAR, LO_A, M, N_SESSIONS,
                   RSVP, S_BAR, V, covers, df, midpoint, predict, s)

rng = np.random.default_rng(20250818)
pd.set_option("display.width", 200)

print(f"n = {N_SESSIONS} sessions; mean attendance {A.mean():.1f}, "
      f"even split would be {BASE:.1f}")
print(f"turnout: {V.mean():.0f} voters of {ATTENDEES} attendees "
      f"({V.mean() / ATTENDEES * 100:.0f}%), range {V.min():.0f}-{V.max():.0f}\n")

# --- 1. Is the vote signal significant at all? -------------------------------
print("=== Correlation with attendance ===")
for label, x in [("interested share I/V", I / V), ("(I+M)/V", (I + M) / V),
                 ("interested count I", I), ("RSVPs", RSVP)]:
    rho, p_s = stats.spearmanr(x, A)
    r, p_p = stats.pearsonr(np.log(x), np.log(A))
    print(f"  {label:22s} Spearman rho={rho:+.2f} (p={p_s:.3f})   "
          f"log-Pearson r={r:+.2f} (p={p_p:.3f})")
print("  -> the vote signal is suggestive, not significant. RSVPs clearly are.")

# --- 2. Does the vote add anything on top of RSVPs? --------------------------
print("\n=== Regression of log(attendance) on both ===")
X = np.column_stack([np.ones(N_SESSIONS), np.log(RSVP), np.log(s)])
y = np.log(A)
beta, *_ = np.linalg.lstsq(X, y, rcond=None)
resid = y - X @ beta
dof = N_SESSIONS - X.shape[1]
se = np.sqrt(np.diag(resid @ resid / dof * np.linalg.inv(X.T @ X)))
for name, b, e in zip(["intercept", "log(RSVP)", "log(share)"], beta, se):
    print(f"  {name:10s} coef={b:+.3f}  se={e:.3f}  p={2 * stats.t.sf(abs(b / e), dof):.3f}")
print("  -> given RSVPs, the vote adds nothing. It is a stand-in, not an independent signal.")

# --- 3. Bootstrap the exponent -----------------------------------------------
print("\n=== Bootstrap the exponent b (5000 resamples) ===")


def fit_b(idx):
    return np.polyfit(np.log(s[idx] / S_BAR), np.log(A[idx] / BASE), 1)[0]


boot = np.array([fit_b(rng.integers(0, N_SESSIONS, N_SESSIONS)) for _ in range(5000)])
lo, hi = np.percentile(boot, [2.5, 97.5])
print(f"  b = {fit_b(np.arange(N_SESSIONS)):.2f}, 95% CI [{lo:.2f}, {hi:.2f}]")
print(f"  P(b<=0) = {np.mean(boot <= 0):.2f}, P(b>=1) = {np.mean(boot >= 1):.2f}")
print("  -> b=1 is well inside the CI, so pinning it there costs nothing.")

# --- 4. Sensitivity to the attendance guesses --------------------------------
print("\n=== If every attendance figure is off by up to +/-25% ===")
bs = [np.polyfit(np.log(s / S_BAR),
                 np.log(rng.uniform(LO_A, HI_A) * rng.uniform(0.75, 1.25, N_SESSIONS) / BASE),
                 1)[0] for _ in range(5000)]
lo, hi = np.percentile(bs, [2.5, 97.5])
print(f"  b = {np.mean(bs):.2f}, 95% CI [{lo:.2f}, {hi:.2f}] -- robust to the guessing")

# --- 5. Variance decomposition: the source of INTRINSIC_VAR ------------------
print("\n=== Where the error comes from ===")
total_var = float((np.log(A) - np.log(midpoint(s))).var(ddof=2))
samp_var = ((1 - s) / (s * V)).mean()
print(f"  total residual variance (log)  {total_var:.4f}  (sd {np.sqrt(total_var):.2f})")
print(f"  ...vote sampling error         {samp_var:.4f}  "
      f"({samp_var / total_var * 100:.0f}%) -- more voters would fix this")
print(f"  ...intrinsic                   {total_var - samp_var:.4f}  "
      f"-> INTRINSIC_VAR = {INTRINSIC_VAR}")
if abs(total_var - samp_var - INTRINSIC_VAR) > 5e-4:
    print(f"  !! INTRINSIC_VAR is stale after the data changed -- set model.py "
          f"INTRINSIC_VAR = {total_var - samp_var:.4f}")
print("  Sampling error is a small slice: the intrinsic term is the floor, and no")
print("  amount of voting reduces it.")

print("\n=== Effect of turnout, at a 27% interest share ===")
print("  voters | midpoint | 80% range | width")
for v in [10, 25, 50, 100, 259]:
    lo, mu, hi = predict(0.27, v)
    print(f"  {v:6d} |    {mu:5.0f} | {lo:4.0f}-{hi:3.0f}   | x{hi / lo:.1f}")
print("  The midpoint never moves -- s is a share. Turnout buys confidence only.")
print("  CAVEAT: derived from binomial theory. 2025 turnout was 99-107 on every")
print("  session, so there is no variation in the data to check this against.")

# --- 6. Calibration ----------------------------------------------------------
print("\n=== Calibration ===")
print("  a session counts as caught if its reported figure -- or, where the host")
print("  gave a range, any part of that range -- lands inside the prediction")
print("  nominal | caught")
for conf in [0.50, 0.80, 0.90, 0.95]:
    lo, _, hi = predict(s, V, conf)
    c = covers(lo, hi)
    print(f"    {conf:.0%}   |  {c.mean():.0%}  ({c.sum()}/{N_SESSIONS})")

lo50, mu, hi50 = predict(s, V, 0.50)
lo80, _, hi80 = predict(s, V, 0.80)
print()
print(pd.DataFrame({
    "session": df["session_id"],
    "s": (s * 100).round(0).astype(int).astype(str) + "%",
    "V": V.astype(int),
    "50%": [f"{a:.0f}-{b:.0f}" for a, b in zip(lo50, hi50)],
    "80%": [f"{a:.0f}-{b:.0f}" for a, b in zip(lo80, hi80)],
    "actual": [f"{a:g}" if a == b else f"{a:g}-{b:g}" for a, b in zip(LO_A, HI_A)],
    "in 80%": np.where(covers(lo80, hi80), "yes", "NO"),
}).to_string(index=False))
print("\nCalibrated on the same 13 sessions it is scored against -- treat as indicative.")
