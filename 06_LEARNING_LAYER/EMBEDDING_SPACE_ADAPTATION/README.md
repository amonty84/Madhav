---
artifact: 06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/README.md
mechanism_id: LL.3
mechanism_name: Embedding space adaptation
version: 1.0
status: STUB
expose_to_chat: false
native_id: "abhisek"
layer: "L6"
produced_during: STEP_11_LEARNING_LAYER_SCAFFOLD (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
activates_at: M4
prerequisite: >
  Voyage-3-large embedding corpus (per ED.3) loaded; per-query relevance records
  available from operator review; signal-to-signal similarity records from Discovery
  output; LL.1 stable for active operation per MP §LL-Appendix.B LL.3.
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B LL.3
provenance: 00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §3.2
---

# LL.3 — Embedding Space Adaptation

```
STATUS: STUB — activates at M4. Do not populate until Voyage-3-large corpus loaded + relevance records + signal similarity records + LL.1 stable.
```

---

## What this mechanism does

LL.3 layers adapter weights (LoRA-style or equivalent) on the base Voyage-3-large
embedding to shape the embedding space toward the MARSYS-JIS corpus's signal/domain semantics.
The output is a set of adapter weights at `embedding_adapters/` (**does not yet exist**).
Adapters are added at retrieval time, not by replacing the base embedding.

LL.3 has no scaffold-time dependencies (none for scaffold per MP §LL-Appendix.B LL.3
dependencies row); it depends on LL.1 stable for active operation only.

## I/O contract (from MP §LL-Appendix.B LL.3)

- **Input.** Current embedding corpus (Voyage-3-large; see MP §ED.3); per-query relevance
  records; signal-to-signal similarity records.
- **Output.** Adapter weights (LoRA-style or equivalent) layered on the base embedding;
  emitted to `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/embedding_adapters/`
  (scaffold-pending; does not yet exist).
- **Kill-switch.** Suspended if adapted embeddings degrade retrieval MAP/MRR against the
  classical-only baseline on held-out queries.
- **Owner.** Claude co-owns with native per standard LL ownership (MP §LL-Appendix.D).
- **Dependency on other LL.M.** None for scaffold; LL.1 stable for active operation.
- **Interaction with workstreams.** Indirect (feeds retrieval, which feeds Discovery
  which feeds CW.PPL).

## Activation status

| Phase | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 | M10 |
|-------|----|----|----|----|----|----|----|----|----|-----|
| LL.3  | n/a | scaffold | scaffold | **active** | active | active | active | active | active | active |

Currently in M2 (paused). Scaffold state. No active adaptation.

## Guardrails

- **Population gate.** First write to `embedding_adapters/` is at the M4 retrieval-bundle
  evaluation session.
- **N threshold.** N = 3 default; per-mechanism override per
  `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.4`.
- **Base-embedding-untouched.** No write to the Voyage-3-large base corpus from this
  mechanism. Adapters are layered, not substituted.
- **Two-pass approval.** Required per `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.3`.

Full guardrail list: `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5`.

## Last update

*No updates. Stub state at Step 11 scaffold close (2026-04-24).*

---

*End of LL.3 stub — Step 11 of the Step 0 → Step 15 governance rebuild — 2026-04-24.*
