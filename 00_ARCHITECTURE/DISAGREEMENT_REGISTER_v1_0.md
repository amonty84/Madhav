---
artifact: DISAGREEMENT_REGISTER_v1_0.md
version: 1.0
status: LIVING
produced_during: STEP_7_GOVERNANCE_INTEGRITY_IMPLEMENTATION (2026-04-24)
implements: GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K
authoritative_side: Claude (Claude-only registry; the register IS the trace — it exists once and
  is appended by whichever session resolves or opens a disagreement, regardless of which agent
  opened it)
mirror_obligations: >
  None for the register itself. Individual DR entries may cite both Claude-side and Gemini-side
  evidence, but the register is a single append-only Claude-resident artifact. Each mirror-desync
  entry (class `DIS.class.mirror_desync`) documents both sides' sha256-before and sha256-after
  per §K.3 step 3 of the protocol.
update_policy: >
  LIVING. Append-only (§K.1); never delete rows. Resolved rows carry `resolved_on` + `resolution`
  + `resolved_by_session`. Schema-breaking changes force v2.0 of this file; patch additions
  (new `linked_artifacts.linkage` value, etc.) are in-place edits recorded in the §0 changelog.
consumers:
  - Every session whose close-checklist carries a non-empty `disagreement_register_entries_opened`
    or `_resolved` list
  - `mirror_enforcer.py` — on detecting mirror-desync, emits a DR entry of class
    `DIS.class.mirror_desync` (does NOT silently overwrite per §K.3 step 3 of the protocol)
  - Step 12 (ongoing hygiene policies) — extends the DR cadence (e.g., a weekly open-DR review)
  - Native arbitrator — when a disagreement escalates per §K.3 step 4
changelog:
  - v1.0 (2026-04-24, Step 7): Initial empty register. Produced per GOVERNANCE_INTEGRITY_PROTOCOL §K.
    Skeleton carries frontmatter + §0 purpose + §1 classes + §2 entry schema + §3 arbitration
    protocol + §4 empty entries table. Zero entries at creation; entries accumulate from this
    session forward.
---

# DISAGREEMENT REGISTER v1.0
## MARSYS-JIS Project — Multi-Agent Disagreement Log

*Implements `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K`. LIVING artifact. Append-only; rows are never deleted. Resolved rows carry explicit resolution fields and remain in the register.*

---

## §0 — Purpose

This register captures disagreements that arise in multi-agent collaboration (Claude ↔ Gemini) and in multi-session sequential work where two sessions conclude differently about the same input. The register is the mechanical trace that **silent overwriting is forbidden** — per ND.1 and protocol §K.3 step 3, a session that detects a mirror-desync or a state-disagreement must open a DR entry, not quietly correct one side.

The register is the operationalized half of the disagreement-resolution protocol specified at `MACRO_PLAN_v2_0.md §Multi-Agent Collaboration §3.4.C` and elaborated in `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K`.

---

## §1 — Disagreement classes

Five classes, per protocol §K.2:

| Class ID | Trigger | Example |
|---|---|---|
| **DIS.class.output_conflict** | Claude and Gemini reach conflicting conclusions on the same input (a pattern proposal, a reconciliation, a validation verdict) | Gemini proposes pattern P with evidence E; Claude rejects on P1 layer-separation grounds. |
| **DIS.class.mirror_desync** *(per ND.1)* | `mirror_enforcer.py` detects a mirror pair out of semantic parity. An implicit disagreement: requires resolution via §3 protocol, not silent overwriting. | `CLAUDE.md` cites MSR_v3_0 with 499 signals; `.geminirules` cites MSR_v3_0 with 500 signals. |
| **DIS.class.version_disagreement** | Two governance surfaces claim different CURRENT versions for the same canonical artifact. | `FILE_REGISTRY` says MSR_v2_0 CURRENT; `CLAUDE.md` says MSR_v3_0 CURRENT (GA.1 pattern). |
| **DIS.class.scope_disagreement** | Claude-reconciler and Gemini-connector disagree on whether a proposal is in-scope for the current macro-phase. | M2 session; Gemini proposes a pattern that requires M4-era calibration data; Claude rejects scope. |
| **DIS.class.closure_disagreement** | Two sessions disagree on whether a close criterion is met. | Session N claims Step X closed; Session N+1 re-opens on grounds of an unmet criterion. |

Additional classes may be added in a minor-version bump (v1.X). Adding or removing a class at runtime without a version bump fails schema validation.

---

## §2 — DR entry schema

Every entry is a single YAML block. Fields:

```yaml
disagreement_register_entry:
  # Identity
  dr_id: DIS.001                            # sequential: DIS.001, DIS.002, ...
  class: output_conflict|mirror_desync|version_disagreement|scope_disagreement|closure_disagreement
  opened_on: <ISO date>
  opened_by_session: <session_id>

  # Parties
  parties: [claude-opus-4-7, gemini-2-5-pro]  # or [claude-side, gemini-side] for mirror_desync
                                              # or [session_N, session_N+1] for closure_disagreement
  description: >
    2–5 sentences: what the disagreement is, when it was noticed, and why it cannot be
    silently resolved.

  # Evidence (both sides)
  authoritative_side: claude|gemini|none|n/a
    # "claude" or "gemini" for mirror_desync (per CANONICAL_ARTIFACTS mirror_obligations);
    # "none" for legitimate open output_conflict where neither side has prior claim;
    # "n/a" for pure output_conflict where the question is which proposal is correct, not
    # which side is authoritative.
  evidence_side_a:
    source: <path or session_id>
    excerpt: "<exact sentence or row>"
    sha256: <hex if a file surface>
  evidence_side_b:
    source: <path or session_id>
    excerpt: "<exact sentence or row>"
    sha256: <hex if a file surface>

  # Arbitration trace (append-only within the entry)
  arbitration_steps_taken:
    - step: isolation_re_run|reconciler_resolution|native_arbitration|cross_reg_registration
      result: string              # short verdict of this step
      timestamp: <ISO>
      session_id: <session that performed this step>

  # Status
  status: open|resolved|escalated|reopened
  resolution: string                 # free-form; present if status == resolved
  resolved_on: <ISO date or null>
  resolved_by_session: <session_id or null>

  # State-before / state-after hashes (required for mirror_desync per §K.3 step 3)
  state_hashes:
    side_a_before: <hex or null>
    side_a_after: <hex or null>      # null if side_a was authoritative and not modified
    side_b_before: <hex or null>
    side_b_after: <hex or null>      # null if side_b was authoritative and not modified

  # Cross-registry linkage
  linked_artifacts:
    - path: <path>
      linkage: cause|remediation|evidence|registry_updated|falsifier_promoted|contradiction_promoted
```

---

## §3 — Arbitration protocol

Per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K.3` (expansion of `MACRO_PLAN_v2_0.md §3.4.C`):

1. **Isolation re-run.** Each agent produces its output in isolation (no sight of the other's). If isolation re-run reverts the disagreement, it was an artifact of cross-contamination and is closed with that rationale.
2. **Claude-reconciler resolution attempt.** Claude reviews both isolation-outputs and attempts resolution with explicit rationale. Resolution is logged alongside the DR entry.
3. **Mirror-desync special handling (per ND.1)** — for `DIS.class.mirror_desync`:
   1. Identify the authoritative side from `CANONICAL_ARTIFACTS_v1_0.md`.
   2. Update the non-authoritative side via adapted-parity — **not** by overwriting text, but by semantic-content propagation.
   3. Log the resolution to the DR entry with both sides' sha256-before and sha256-after in the `state_hashes` block.
   4. Re-run `mirror_enforcer.py` to confirm parity; entry closes on clean re-run.
   5. **Silent overwriting — updating the non-authoritative side without logging the divergence — is forbidden.**
4. **Native arbitration.** If Claude-reconciler cannot resolve (or native wishes to arbitrate), escalate. Native arbitration is logged with its own rationale under `arbitration_steps_taken`.
5. **Registration in FALSIFIER_REGISTRY / CONTRADICTION_REGISTRY**, when appropriate. An output-conflict that reveals a testable falsifier (e.g., a P6 UCN-authority conflict on a specific signal) cross-references to `FALSIFIER_REGISTRY_v2_0_EXPANSION.md`; an unresolved logical conflict cross-references to `CONTRADICTION_REGISTRY_v1_1.md`.

---

## §4 — Entry table

*Entries are appended below as they are opened. Zero entries at this register's creation (Step 7 close of the governance rebuild workflow).*

<!-- ENTRIES_BEGIN -->

*(No entries yet. First entry, when opened, replaces this placeholder with a fully-populated `disagreement_register_entry` YAML block under an `## DIS.001 — <short title>` heading. Subsequent entries append below.)*

<!-- ENTRIES_END -->

---

## §5 — Integration with other surfaces

- **SESSION_LOG + STEP_LEDGER**: every open DR entry is referenced in the opening session's close-checklist `disagreement_register_entries_opened` field. Every resolved DR entry is referenced in the resolving session's `disagreement_register_entries_resolved` field.
- **CURRENT_STATE (post-Step-10)**: will surface a summary count of open DR entries as a governance-health metric.
- **FALSIFIER_REGISTRY**: output-conflict entries promoted to testable falsifiers carry a `linked_artifacts` row with `linkage: falsifier_promoted`.
- **CONTRADICTION_REGISTRY**: unresolved logical conflicts carry `linkage: contradiction_promoted`.
- **mirror_enforcer.py**: on detecting mirror-desync, emits a DR entry skeleton (class + evidence + state_hashes) and halts with exit code 1. The session that closes (or resolves) the desync completes the skeleton per §2.

---

## §6 — GA.N + ND.1 closure

Per protocol §K.7:
- **Closes ND.1** (secondary) — §J `mirror_enforcer.py` is primary; this register implements the disagreement-class half of ND.1's consumption matrix via the `DIS.class.mirror_desync` class and the forbidden-silent-overwrite rule.
- **Closes GA.31** (multi-agent collaboration as protocol) — MP v2.0 §3.4 resolves at MP level; this register operationalizes the DR entry schema and arbitration protocol.

---

*End of DISAGREEMENT_REGISTER_v1_0.md skeleton. Entries append in §4.*
