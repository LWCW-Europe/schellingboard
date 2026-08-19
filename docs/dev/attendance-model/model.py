"""The fitted attendance model. Single source of truth for data and constants.

    midpoint = K * (N/P) * (s / s_bar)
    range    = midpoint / g .. midpoint * g,   g = exp(z * sigma)
    sigma    = sqrt(INTRINSIC_VAR + (1 - s) / (s * V))

`s` is a share, so the midpoint is invariant to how many people voted; turnout
enters only through the binomial term, widening the range when few voted.
"""

from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).parent

ATTENDEES = 259  # total event attendees, 2025
PARALLELISM = 9  # sessions running concurrently at any given time
K = 0.66  # attendees in *any* session at a given moment; fitted in explore.py
INTRINSIC_VAR = 0.3134  # log-variance the vote cannot explain; fitted in validate.py

Z = {0.50: 0.674, 0.80: 1.282, 0.90: 1.645, 0.95: 1.960}

df = pd.read_csv(HERE / "data-2025.csv")
A = df["attendees_mid"].to_numpy(float)  # every figure is a host's rough recollection
LO_A = df["attendees_min"].to_numpy(float)
HI_A = df["attendees_max"].to_numpy(float)
RSVP = df["rsvps"].to_numpy(float)
V = df["votes_total"].to_numpy(float)
I = df["votes_interested"].to_numpy(float)
M = df["votes_maybe"].to_numpy(float)
S = df["votes_skip"].to_numpy(float)
assert np.all(I + M + S == V), "interested + maybe + skip must equal total votes"

N_SESSIONS = len(df)
BASE = ATTENDEES / PARALLELISM  # "fair share" of the crowd per session
s = I / V
S_BAR = s.mean()


def share(w):
    """Interest share, counting a Maybe as `w` of an Interested. w=0 is the model."""
    return (I + w * M) / V


def midpoint(s_obs, n_att=ATTENDEES, p_par=PARALLELISM, s_ref=S_BAR):
    return K * (n_att / p_par) * (s_obs / s_ref)


def predict(s_obs, v, conf=0.80, **kw):
    """(low, midpoint, high). `v` = number of people who voted on that session."""
    mu = midpoint(s_obs, **kw)
    sigma = np.sqrt(INTRINSIC_VAR + (1 - s_obs) / (s_obs * v))
    return mu / np.exp(Z[conf] * sigma), mu, mu * np.exp(Z[conf] * sigma)


def covers(lo, hi):
    """Did the host's reported attendance range overlap the predicted one?"""
    return (HI_A >= lo) & (LO_A <= hi)


def log_r2(pred):
    resid = np.log(pred) - np.log(A)
    return 1 - resid @ resid / np.sum((np.log(A) - np.log(A).mean()) ** 2)
