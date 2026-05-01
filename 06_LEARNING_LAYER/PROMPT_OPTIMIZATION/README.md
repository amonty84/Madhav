---
artifact: 06_LEARNING_LAYER/PROMPT_OPTIMIZATION/README.md
mechanism_id: LL.4
mechanism_name: Prompt optimization
version: 1.0
status: STUB
expose_to_chat: false
native_id: "abhisek"
layer: "L6"
produced_during: STEP_11_LEARNING_LAYER_SCAFFOLD (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
activates_at: M4
prerequisite: >
  Per-prompt outcome records (pattern-emission quality + reconciliation correctness)
  available from M4 calibration cycles; operator feedback on Discovery output collected
  per MP §LL-Appendix.B LL.4. Note: PHASE_B_PLAN B.0 substrate hook PROMPT_REGISTRY/
  (sibling, not duplicate) provides the upstream prompt-version registry that LL.4 reads.
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B LL.4
provenance: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §3.2
related: 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md §F.1 (PROMPT_REGISTRY substrate hook —
  forthcoming sibling at M2 B.0 execution per LEARNING_LAYER_SCAFFOLD_DECISION_v1_0 §7)
---

# LL.4 — Prompt Optimization

```
STATUS: STUB — activates at M4. Do not populate until per-prompt outcome records + operator feedback collected.
```

---

## What this mechanism does

LL.4 tracks per-prompt outcome quality and emits updated prompt templates with version
bumps. The output is a versioned set of prompt templates at `prompts/` (**does not yet
exist**). LL.4 is the only Learning Layer mechanism whose "promotion" (LL.4 prompt-template
update) is always-on from M4 — distinct from LL.10 strict fine-tuning which activates only
at M10 per MP §LL-Appendix.B LL.10 prompt-vs-fine-tune disambiguation.

**B.0 substrate-hook coordination.** When PHASE_B_PLAN B.0 executes (post-Step-15
M2 resume), it adds `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` as a sibling to this
mechanism's directory. The registry is the upstream version-tracking surface that LL.4
reads at activation; LL.4 does not duplicate it. See `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md
§7` for the coordination rationale.

## I/O contract (from MP §LL-Appendix.B LL.4)

- **Input.** Per-prompt outcome records (pattern-emission quality, reconciliation
  correctness); operator feedback on Discovery output.
- **Output.** Updated prompt templates at `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/prompts/`
  (scaffold-pending; does not yet exist) with version bumps per template.
- **Kill-switch.** Suspended if updated prompt produces lower acharya-grade score on
  held-out chart probe.
- **Owner.** Claude co-owns with native.
- **Dependency on other LL.M.** None.
- **Interaction with workstreams.** Consumes CW.PPL outcome records tied to specific
  prompt versions.

## Activation status

| Phase | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 | M10 |
|-------|----|----|----|----|----|----|----|----|----|-----|
| LL.4  | n/a | scaffold | scaffold | **active** | active | active | active | active | active | active |

Currently in M2 (paused). Scaffold state. No active prompt optimization.

## Guardrails

- **Population gate.** First write to `prompts/` is at the M4 prompt-evaluation session
  after CW.PPL outcomes accumulate to N.
- **N threshold.** N = 3 default; per-mechanism override per
  `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.4`.
- **Version monotonicity.** Per-template versions are monotonically increasing; no
  re-issuing of prior versions.
- **Two-pass approval.** Required per `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.3`.
- **PROMPT_REGISTRY coordination.** LL.4 reads from B.0's PROMPT_REGISTRY when present;
  does not write to it directly. Any write to PROMPT_REGISTRY/INDEX.json is the
  responsibility of the prompt registration pipeline (PHASE_B_PLAN §B.0 step 13).

Full guardrail list: `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5`.

## Last update

*No updates. Stub state at Step 11 scaffold close (2026-04-24).*

---

*End of LL.4 stub — Step 11 of the Step 0 → Step 15 governance rebuild — 2026-04-24.*
