signal_weights/shadow — LL.1 Shadow Weight Register
Status: ACTIVE (M4-B)
Protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3 (NAP.M4.4 APPROVED 2026-05-02)
Contents
FileMechanismPhaseSignalsProducedll1_shadow_weights_v1_0.jsonLL.1 Signal Weight CalibrationM4-B3802026-05-02
Discipline rules

No file in this directory influences production retrieval, ranking, or synthesis output
until it has passed ALL promotion criteria in SHADOW_MODE_PROTOCOL §3.
held_out partition events are NEVER used to compute weights in this directory.
Promotion to ../production/ requires: N≥3 observations AND mean_match_rate≥0.4 AND
variance≤0.3 AND two-pass approval (Claude initial + Gemini review) AND native
notification with no hold.
n=1 disclaimer applies to all weights: single-native corpus; dominant risk is overfit.
