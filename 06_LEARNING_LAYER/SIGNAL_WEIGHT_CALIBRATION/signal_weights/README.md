signal_weights — LL.1 Signal Weight Calibration register

Status: ACTIVE (M4-B; first writes 2026-05-02 at M4-B-S1-LL1-SHADOW-WEIGHTS)
Mechanism: LL.1 — Signal weight calibration
Protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md (NAP.M4.4 APPROVED 2026-05-02)
Parent: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md

Layout

  shadow/      — LL.1 shadow register; weights observed but NOT applied to retrieval / ranking / synthesis
  production/  — LL.1 production register; written ONLY when SHADOW_MODE_PROTOCOL §3 promotion criteria are met

Promotion criteria (SHADOW_MODE_PROTOCOL §3, summarized)

  (a) N_observations ≥ 3 in training partition
  (b) match_rate variance ≤ 0.3 across those N observations
  (c) two-pass approval recorded (Claude initial + Gemini red-team review)
  (d) native notified with no hold instruction
  (§3.2) provisional-validity threshold: mean_match_rate ≥ 0.4

Discipline

  Held-out LEL events NEVER contribute to weights in this directory (Learning Layer discipline rule #4).
  Every weight carries the n=1 disclaimer in its parent register file header.
  Promotion is structural admission to the pipeline; it does not lift the n=1 caveat.
  No file in production/ may exist before its corresponding shadow/ entry has cleared
  all §3 criteria and the two-pass approval has been recorded in SESSION_LOG.

See ../README.md for the LL.1 mechanism overview and the broader Learning Layer scaffold.
