---
artifact: 06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/README.md
mechanism_id: LL.2
mechanism_name: Graph edge weight learning
version: 1.0
status: STUB
produced_during: STEP_11_LEARNING_LAYER_SCAFFOLD (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
activates_at: M4
prerequisite: >
  LL.1 signal weights stable (foundation mechanism); CGM (Chart Graph Model) edge rows
  available; signal-to-signal co-activation records from Discovery Engine output;
  per-edge outcome-correlation data from M4+ per MP §LL-Appendix.B LL.2.
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B LL.2
provenance: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §3.2
---

# LL.2 — Graph Edge Weight Learning

```
STATUS: STUB — activates at M4. Do not populate until LL.1 stable + CGM edges + Discovery co-activation records + per-edge outcome correlation available.
```

---

## What this mechanism does

LL.2 learns edge-weight modulators on the Chart Graph Model
(`025_HOLISTIC_SYNTHESIS/CGM_v2_0.md`) from signal-to-signal co-activation patterns and
per-edge outcome correlation. The output is a set of edge-weight modulators written to a
shadow register (`edge_weights/` — **does not yet exist**), promoted post-N observations.

LL.2 depends on LL.1 stabilizing first (signal weights must settle before edge weights
shift; otherwise the two mechanisms chase each other).

## I/O contract (from MP §LL-Appendix.B LL.2)

- **Input.** CGM edge rows; signal-to-signal co-activation records from Discovery Engine
  output; per-edge outcome-correlation data from M4+ onward.
- **Output.** Edge weight modulators at `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/edge_weights/`
  (shadow register; does not yet exist). Promoted post-N observations.
- **Kill-switch.** Suspended if modulated edge weights produce a worse retrieval-precision
  score than classical-prior-only edges on held-out probes.
- **Owner.** Native approves modulator range; Claude scaffolds; Gemini red-teams.
- **Dependency on other LL.M.** LL.1 (signal weights stabilize before edge weights shift).
- **Interaction with workstreams.** Consumes CW.PPL outcomes; emits proposed edge updates
  to SESSION_LOG for red-team.

## Activation status

| Phase | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 | M10 |
|-------|----|----|----|----|----|----|----|----|----|-----|
| LL.2  | n/a | scaffold | scaffold | **active** | active | active | active | active | active | active |

Currently in M2 (paused). Scaffold state. No active learning.

## Guardrails

- **Population gate.** First write to `edge_weights/` is at the M4 calibration session
  that follows LL.1 stabilization.
- **N threshold.** N = 3 default; per-mechanism override per
  `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.4`.
- **Dependency gate.** LL.2 must not fire until LL.1 has produced ≥ N stable updates.
  Cross-mechanism dependency tracked in MP §LL-Appendix.B LL.2 dependencies row.
- **Two-pass approval.** Required per `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.3`.

Full guardrail list: `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5`.

## Last update

*No updates. Stub state at Step 11 scaffold close (2026-04-24).*

---

*End of LL.2 stub — Step 11 of the Step 0 → Step 15 governance rebuild — 2026-04-24.*
