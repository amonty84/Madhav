---
artifact: MACRO_PLAN_REDTEAM_v1_0.md
version: 1.0
status: CLOSED
session: STEP_4_MACRO_PLAN_REDTEAM
date: 2026-04-23
role: >
  Red-team pass on MACRO_PLAN_v2_0.md (DRAFT_PENDING_REDTEAM).
  Adversarial verification across T.1–T.7 per STEP_04 brief §3.
  Verdict: PASS_WITH_FIXES. Two surgical inline fixes applied to MP v2.0
  in this session (M8 MSR-expansion exit-state bullet; LL discipline rule #3
  N-definition clarifier). Three WARN-level forward-compatibility notes
  recorded for Step 5 (no blocking). ND.1 enactment verified.
subject_file: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md (1057 lines → 1059 after inline fixes)
subject_version: v2.0 (DRAFT_PENDING_REDTEAM; flips to CURRENT at Step 5 close per spec §5.1 S.8)
inputs_read:
  - CLAUDE.md (governance banner + mandatory reading list)
  - 00_ARCHITECTURE/STEP_LEDGER_v1_0.md (Step 4 row ready; Step 3 completed)
  - 00_ARCHITECTURE/STEP_BRIEFS/STEP_04_MACRO_PLAN_REDTEAM_v1_0.md (ND.1-amended; T.1–T.7)
  - 00_ARCHITECTURE/MACRO_PLAN_v2_0.md (subject under test — full read)
  - 00_ARCHITECTURE/MACRO_PLAN_CRITIQUE_v1_0.md (Step 1 critique; 132 + 4 findings)
  - 00_ARCHITECTURE/MACRO_PLAN_REVISION_SPEC_v1_0.md (Step 2 spec; traceability baseline)
  - 00_ARCHITECTURE/MACRO_PLAN_v1_0.md (baseline for diff)
  - 00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md (GA.1–GA.32)
  - 00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md (ND.1)
  - 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md v1.0.2 (§G B.0–B.10, §J risks, §N success criteria)
consumers:
  - Step 5 (Macro Plan closure + propagate) — primary
verdict: PASS_WITH_FIXES
nd1_status: addressed at MP layer (Step 3 obligation); remains `open` in NATIVE_DIRECTIVES tracking until Step 7 per ND.1 close condition
---

# MACRO PLAN RED-TEAM v1.0 — Adversarial Verification of MP v2.0

## §1 — Verdict

**PASS_WITH_FIXES.**

MP v2.0 installs 18 sections per spec §3.1 ordering, carries the per-row phase schema per spec §2.5, delivers the Learning Layer Specification Appendix per spec §3.2, installs the System Integrity Substrate (IS.1–IS.9) with mirror discipline (§IS.2) as ND.1's MP-layer enactment, and carries the Finding-Resolution Appendix with 137 rows traced to Step 1 critique + ND.1. All 12 CRITICAL in-schema findings from the critique are addressed. No factual contradictions with GROUNDING_AUDIT_v1_0 or CURRENT corpus state (MSR_v3_0 @ 499 signals; CGM_v2_0 rebuilt on FORENSIC_v8_0 2026-04-19 with CGM_v9_0 deferred to B.3.5; nine L3 reports at v1.1+; UCN_v4_0 / CDLM_v1_1 / RM_v2_0 / FORENSIC_v8_0 current). ND.1's three load-bearing claims are each present in §IS.2 with the mandated "semantic parity of governance content, not feature parity of agent capabilities" phrasing, and MP v2.0's changelog names ND.1 explicitly.

Adversarial scan surfaced two surgical defects (**FIX.1**, **FIX.2**) that violate strict spec traceability or internal consistency. Both are closable with a minimal inline edit; neither requires re-opening Step 2 or Step 3. Both fixes applied in this session per §4. Verdict flips to PASS on close.

Three forward-compatibility observations (**WARN.1**, **WARN.2**, **WARN.3**) are recorded for Step 5's awareness. None block Step 5; two of the three are Step 5 cross-surface propagation scope matters rather than MP v2.0 defects.

ND.1 addressed-status at Step 4 (this artifact): **verified addressed at MP layer**. Per ND.1 consumption matrix Row 3 ("Rewrite") → MP v2.0 §IS.2 with three load-bearing claims + changelog naming + mirror-desync disagreement class; per Row 4 ("Red-team") → this artifact's §3 contains ND.1-linked entries (OK + FIX.2 carries ND.1 adjacency clarification); T.6 ambiguity test on "adapted parity, not byte-identity" passes (one good-faith reading). ND.1 tracking-table status remains `open` globally; status flip to `addressed` is Step 7's responsibility.

---

## §2 — Adversarial tests (T.1–T.7)

### T.1 — Residual critique-dimension scan

For each of the 14 critique dimensions, an adversarial pass tried to find a residual finding in MP v2.0. Residual = either (a) a dimension-level defect reintroduced by the rewrite, or (b) a dimension-level defect the rewrite was supposed to close but did not.

| Dim | Title | Residual finding? | Verdict |
|-----|-------|-------------------|---------|
| 1 | Phase Completeness | None (every M1–M10 row carries entry / exit / dependencies / deliverable paths / risks / quality gate / native-approval points / agent roles / time envelope / ethics binding). | OK |
| 2 | Sequencing and Dependencies | **One surgical residual.** M9 entry state delegates "MSR coverage expansion for Nadi + BNN schools" ownership to M8 (per MPC.2.6 spec §7.2 mapping), but the M8 row's own scope / exit state / produces list is silent on this work. M8 row enumerates classical-text corpora (BPHS, Phaladeepika, Saravali, Uttara Kalamrita, Jaimini Sutra, Prashna Marga, Hora Sara, Brihat Jataka, Brihat Samhita, KP commentaries) but no Nadi/BNN corpora and no MSR-expansion bullet. → See **FIX.1** in §3. | FIX |
| 3 | Exit Criteria | None. Every row has explicit exit state (coarse-grained per spec §2.5 for M3–M10; CLOSED-state for M1; PHASE_B_PLAN §N import-by-reference for M2). | OK |
| 4 | Risk Surface | None. Every M1–M10 row carries 3–6 risk bullets each paired with mitigation or pointer. ED.1–ED.9 table carries failure-mode + contingency + SPOF columns. Cross-cutting risks in §3.6 + §3.8.G pause protocol. | OK |
| 5 | Learning Layer Specificity | **One ambiguity residual.** Discipline rule #3 (MP v2.0 line 134) claims "N is per-mechanism-defined in the Learning Layer Specification Appendix", but the appendix §LL-Appendix.B per-mechanism blocks do not specify N per mechanism; they reference N in kill-switch rules without declaring a value. → See **FIX.2** in §3. | FIX |
| 6 | Concurrency Completeness | None at MP layer. CW.LEL and CW.PPL each carry all 13 schema fields per spec §2.7. One cross-plan forward-compat note: MP v2.0 says PPL is "Scaffolded at M2 close" while PHASE_B_PLAN B.0 scaffolds `prediction_ledger.jsonl` at M2 open. → See **WARN.3** in §3. | WARN |
| 7 | External Dependency Graph | None. 9-row ED.1–ED.9 table with all mandated columns; SPOF cadence §3.6.B; licensing §3.6.C; model-family migration cross-ref §3.6.D. | OK |
| 8 | Role-of-Native Cadence | None. Every M1–M10 row carries `Native-approval points`. §3.8.G pause protocol present. §3.10.A revision triggers enumerated. | OK |
| 9 | Time Horizon vs Phase Indexing | None. §3.8.A phase-indexed stance; §3.8.B session-volume envelopes per phase; §3.8.C sequencing stance (M1–M6 serial; M7+M8 overlap; M9 serial after M8; M10 serial after M9); §3.8.D concurrent duration; §3.8.E budget pointer. | OK |
| 10 | Post-M10 Framing | None. §3.9.A–E covers maintenance / publication / ownership / retirement / versioning. Project-done = M10 exit state per §3.9.D; retirement reversible. | OK |
| 11 | Ethical Framework | None. §3.5.A principles (6 bullets); §3.5.B four disclosure tiers; §3.5.C self-harm guardrail (date-of-death disallowed; health-crisis double-red-team; suicide-adjacent disallowed; mental-health double-red-team); §3.5.D M7 consent protocol; §3.5.E pre-registration; §3.5.F minor/vulnerable exclusion; §3.5.G calibration disclosure; §3.5.H Mode A / Mode B linkage. | OK |
| 12 | Meta-Governance | None. §3.10.A–G delivers revision triggers / approval protocol / MP red-team cadence / version semantics / sunset / changelog / status field. Frontmatter carries `status: DRAFT_PENDING_REDTEAM` per §3.10.G. | OK |
| 13 | Multi-Agent Collaboration | None. §3.4.A current agents; §3.4.B two-pass; §3.4.C disagreement protocol with mirror-desync class (ND.1 binding); §3.4.D quality-gate pointer; §3.4.E future-agent admission; §3.4.F version-pinning. | OK |
| 14 | System Integrity and Drift-Prevention | None. §IS.1–§IS.9 substrate parallel to Learning Layer; §IS.2 Mirror Discipline with ND.1 three claims; §IS.9 rebuild acknowledgment. | OK |

**Hostile-reviewer red-team prompt self-applied ("what can you legitimately block?").** The M8/M9 MSR-expansion gap (FIX.1) is blockable on strict traceability grounds — the spec's own §7.2 MPC.2.6 resolution line names M8 as owner, and M9's entry state accepts that assignment, but M8's own row doesn't carry the obligation. A hostile reviewer correctly flags this as a risk of the work silently going undone when M8 opens, because M8's session plan will read M8's own row, not M9's entry state. FIX.1 closes this. The rule #3 N-definition gap (FIX.2) is blockable on internal-consistency grounds — rule #3 promises something the appendix doesn't deliver. FIX.2 closes this. Nothing else surfaced to a blocking threshold.

### T.2 — MPC finding-coverage verification

Finding-Resolution Appendix in MP v2.0 §Finding-Resolution Appendix claims 137/137 coverage (132 MPC in-schema + 4 MPC.OS + 1 ND.1). Spot-check approach: for each of the 12 CRITICALs and a stratified sample across HIGH/MEDIUM, verify the resolving section cited in MP v2.0's appendix actually addresses the finding as the spec §7 committed.

| Finding | Sev | Spec §7 resolution | MP v2.0 resolving section | Verification |
|---|---|---|---|---|
| MPC.1.2 | CRIT | §2.5 per-row Exit state; M2 import PHASE_B_PLAN §N | §The ten macro-phases M1–M10 every row has Exit state; M2 imports PHASE_B_PLAN §N | OK |
| MPC.2.1 | CRIT | §2.5 per-row Dependencies (requires / produces / enables) | Every M1–M10 row has Dependencies block | OK |
| MPC.2.6 | HIGH | §7.2 → M9 row MSR Nadi+BNN flagged as M8-owned pre-M9 requirement | M9 entry state cites this; M8 row silent on ownership | **FIX.1 needed** |
| MPC.3.1 | CRIT | Every row gains Exit state | ✓ (same as MPC.1.2) | OK |
| MPC.4.1 | CRIT | Per-row Risks field, 3–6 bullets each | M1 (empty, closed), M2 (imports §J top-3), M3–M10 each 3–5 bullets | OK |
| MPC.5.11 | CRIT | §LL-Appendix.A Activation-phase matrix | Matrix LL.1–LL.10 × M1–M10 with scaffold/active/dormant/n/a | OK |
| MPC.7.1 | CRIT | §3.6.A 9-row dependency table | ED.1–ED.9 table with all mandated columns | OK |
| MPC.7.9 | CRIT | §3.7 Acharya Reviewer Pool Policy (full section) | §3.7.A–E delivered | OK |
| MPC.11.1 | CRIT | §3.5 Ethical Framework (entire section) + §3.5.A principles | §3.5.A 6 principles; §3.5.B–H all delivered | OK |
| MPC.11.3 | CRIT | §3.5.C Self-harm guardrail | Date-of-death disallowed; health-crisis double-red-team; suicide-adjacent disallowed; mental-health double-red-team | OK |
| MPC.11.5 | CRIT | §3.5.D Consent protocol for M7 cohort | Four-point consent requirement present | OK |
| MPC.14.1 | CRIT | §System Integrity Substrate parallel to Learning Layer | §IS.1–§IS.9 delivered | OK |
| MPC.14.6 | CRIT | §IS.9 + frontmatter `produced_during` + §Why this exists prepend | §IS.9 references "Step 3 of the Step 0→15 governance rebuild"; frontmatter has `produced_during: STEP_3_MACRO_PLAN_REWRITE`; §Why this exists opens with rebuild framing | OK |

HIGH/MEDIUM sample (22 spot-checks): MPC.1.6 (deliverable paths per row → present); MPC.2.3 (PPL pre-M6 accumulation → §M6 Entry state + CW.PPL feeds_into + §IS.3); MPC.2.11 (PHASE_B_PLAN version pointer → "currently v1.0.2; see FILE_REGISTRY for CURRENT pointer"); MPC.3.4 (M10 publication target → "arXiv preprint minimum; peer-reviewed journal submission as stretch goal"); MPC.3.5 (LL no-closure disclosure → §Learning Layer substrate paragraph); MPC.4.11 (cross-cutting risks → §3.6 ED table + §IS.6 drift-detector); MPC.5.14 (n=1 mitigation binding table → §LL-Appendix.C 6-row table); MPC.6.12 (minimum-volume gates → CW.LEL "≥ 40 events" + CW.PPL "≥ 50 predictions"); MPC.7.10 (SPOF mitigation cadence → §3.6.B); MPC.7.12 / MPC.13.7 (model-family migration + version-pinning → §3.4.F + §3.6.D); MPC.8.5 / MPC.8.6 (pause protocol + unavailable-handoff → §3.8.G); MPC.9.3 (sequencing stance → §3.8.C); MPC.10.1–10.6 (§3.9.A–E); MPC.11.4 (disclosure tiers → §3.5.B four audiences); MPC.12.4 (MP red-team cadence → §3.10.C every phase close + 12-month); MPC.13.2 (disagreement protocol → §3.4.C + §IS.5); MPC.13.6 (quality gate per phase → per-row Quality gate field + §3.4.D pointer); MPC.OS.1 (date/session-id disambiguation → frontmatter `produced_during`); MPC.OS.4 (id_namespace → frontmatter includes M1..M10; LL.1..LL.10; IS.1..IS.9; ED.1..ED.9; CW.LEL, CW.PPL; MP.1..MP.7). All 22 spot-checks OK.

**T.2 verdict:** 136/137 findings fully addressed. MPC.2.6 has a partial-ownership gap (the spec resolution commits M8 ownership; MP v2.0 encodes it in M9 entry state but not M8 row itself). Closed by FIX.1. After FIX.1, coverage is 137/137.

### T.3 — Cross-reference vs GROUNDING_AUDIT and CURRENT corpus

| Claim in MP v2.0 | Grounding / CLAUDE.md current state | Verdict |
|---|---|---|
| MSR v3.0 at 499 signals (M1 exit `d`; LL.1 Input; frontmatter id_namespace) | GA.1: MSR_v3_0 current at 499 signals (authoritative per CLAUDE.md + SESSION_LOG CORPUS_VERIFICATION_PASS). | OK |
| UCN v4.0 current (M1 exit `e`) | GA.2.2: UCN_v4_0 current. | OK |
| CDLM v1.1 current (M1 exit `f`) | GA.2.5: CDLM_v1_1 current. | OK |
| CGM v2_0 rebuilt on FORENSIC_v8_0 2026-04-19 (M1 exit `a`); will become CGM_v9_0 after B.3.5 (implied via §3.6) | GA.2.3 + CLAUDE.md: CGM_v2_0 rebuilt on v8.0 in GAP_RESOLUTION_SESSION 2026-04-19; CGM_v9_0 will land after Phase B.3.5. | OK |
| RM v2.0 current (M1 exit `g`) | GA.2.5: RM_v2_0 current. | OK |
| FORENSIC v8.0 unified (M1 exit `h`) | GA.2.5 + CLAUDE.md: FORENSIC_v8_0 unified. | OK |
| All nine L3 Domain Reports at v1.1+ (M1 exit `b`) | GA.5 + CLOSURE_AUDIT_PASS 2026-04-19: 9 L3 reports at v1.1+. | OK |
| GAP.13 resolved (M1 exit `c`) | PHASE_B_PLAN v1.0.2 §O, GROUNDING_AUDIT §2.3: GAP.13 resolved 2026-04-23 (8-karaka lock with P7 7-karaka alternative). | OK |
| PHASE_B_PLAN currently v1.0.2 (M2 scope) | GA §1 R.4: PHASE_B_PLAN v1.0.2 current. | OK |
| Swiss Ephemeris version-lock in SESSION_LOG (ED.2 contingency) | PROJECT_ARCHITECTURE convention; consistent. | OK |
| Voyage-3-large as embedding model (ED.3) | CLAUDE.md + PHASE_B_PLAN §G B.3: Voyage-3-large. | OK |
| Postgres + pgvector at M2+ (ED.4) | PHASE_B_PLAN §G B.0 Task 7: Supabase pgvector migration. | OK |
| Claude Opus 4.7 + Gemini 2.5 Pro current agents (§3.4.A) | CLAUDE.md current; PROJECT_ARCHITECTURE_v2_1 §D.6. | OK |
| LEL v1.2 at 36 events + 5 period summaries + 6 chronic patterns (CW.LEL activation) | GA.9: LEL_v1_2.md current with these counts. | OK |
| GA.7 "twinkly-puzzling-quokka.md" superseded (referenced via §IS.3 drift context) | MP v2.0 §IS.3 doesn't re-reference the superseded file; consistent. | OK |

**T.3 verdict:** No factual contradiction with GROUNDING_AUDIT_v1_0 or CURRENT corpus state. All MP v2.0 claims about versions, dates, and counts match authoritative sources.

### T.4 — Forward compatibility with PHASE_B_PLAN v1.0.2

**Core question.** Does the B.0–B.10 plan still make sense under MP v2.0's M2 definition? Specifically, does B.0 still make sense?

- **M2 scope in MP v2.0:** "Turn the static M1 corpus into an LLM-navigable graph+vector substrate with Discovery Engine batch operations that surface patterns, resonances, contradictions, and clusters. This is the B.0–B.10 plan governed by `PHASE_B_PLAN_v1_0.md` (currently v1.0.2; see FILE_REGISTRY for CURRENT pointer)."
- **B.0 objective in PHASE_B_PLAN §G:** "Infrastructure ready; `035_DISCOVERY_LAYER/`, `06_LEARNING_LAYER/` scaffolded; Supabase migration applied; dependencies installed."
- **M2 exit state in MP v2.0:** imported by reference from PHASE_B_PLAN §N (10-point list).

Compatibility verdict: **YES** — B.0 is precisely the Foundations phase that enables B.1–B.10, and MP v2.0's M2 row does not redefine B.0's scope. MP v2.0 imports PHASE_B_PLAN §N for M2's exit state and §J for M2's risk list, so any future change in PHASE_B_PLAN propagates automatically without MP v2.0 revision.

Three forward-compat observations (none blocking):

- **WARN.1** — PHASE_B_PLAN §G B.0 Task 2 and Task 10 create `06_LEARNING_LAYER/` as part of M2 kickoff. MP v2.0 §Learning Layer marks the directory as "scaffold-pending as of v2.0 publication; the LL scaffold decision is Step 11 of the governance rebuild." This is coordination, not contradiction: the governance rebuild (Steps 0–15) closes before M2 B-execution resumes (per the CLAUDE.md banner: "Active work is paused on the M2 corpus-activation execution plan"), so Step 11 will have made the scaffold decision before B.0 runs. No action required in MP v2.0; Step 11 brief should cross-reference B.0 Task 2/10 and Step 5 should flag this for PHASE_B_PLAN's next amendment.

- **WARN.2** — PHASE_B_PLAN §N Point 10 reads: "`SESSION_LOG.md` reflects M2 closure; `MACRO_PLAN_v1_0.md` 'current macro-phase' advanceable to M3." Once Step 5 closes (MP v1.0 → SUPERSEDED; MP v2.0 → CURRENT), this PHASE_B_PLAN reference becomes a stale pointer to a SUPERSEDED artifact. MACRO_PLAN_REVISION_SPEC §5.1 Step 5 cross-surface list (S.1–S.10) does NOT include PHASE_B_PLAN. Step 5 should either (a) amend PHASE_B_PLAN §N Point 10 to read "MACRO_PLAN_v2_0.md" in the same atomic close pass, or (b) defer to a PHASE_B_PLAN v1.0.3 amendment with an explicit cross-reference entry in the STEP_LEDGER. Not an MP v2.0 defect; flagged for Step 5 scope expansion.

- **WARN.3** — MP v2.0 CW.PPL Activation field reads: "Scaffolded at M2 close (register exists). Active from first M5 probabilistic output." PHASE_B_PLAN §G B.0 Task 10 scaffolds `06_LEARNING_LAYER/` tree plus `prediction_ledger.jsonl` (empty) at M2 *open* (B.0 is Phase 1 of M2), not M2 close. The essence is preserved (scaffold happens during M2; active from first M5 output), but the precise anchor "at M2 close" in MP v2.0 is inconsistent with "at B.0 (M2 open)" in PHASE_B_PLAN. Severity LOW: the register existing earlier than "M2 close" does not invalidate MP v2.0's claim that the register exists before activation, but strict anchor-matching would read "scaffolded during M2 (B.0); active from first M5 output". Flagged as WARN only — PHASE_B_PLAN scaffolds the prediction ledger empty at B.0, which is a superset of "scaffolded at M2 close," so no functional conflict. Step 5 may harmonize the language in a future amendment.

### T.5 — Scope-creep test

Step 3 brief §4 and spec §6 explicitly bound Step 3's scope. Adversarial scan: did MP v2.0 introduce content beyond spec?

| Spec §3 section | Required subsections | MP v2.0 delivery | Scope-creep? |
|---|---|---|---|
| §3.2 LL-Appendix | A, B (LL.1–LL.10), C, D | A (matrix), B (LL.1–LL.10 each with 7 fields), C (6-row table), D (ownership paragraph) | No |
| §3.3 System Integrity Substrate | IS.1–IS.9 | IS.1, IS.2, IS.3, IS.4, IS.5, IS.6, IS.7, IS.8, IS.9 | No |
| §3.4 Multi-Agent | A–F | A, B, C, D, E, F | No |
| §3.5 Ethical Framework | A–H | A, B, C, D, E, F, G, H | No |
| §3.6 External Dependency Graph | A–D | A (ED.1–ED.9), B, C, D | No |
| §3.7 Acharya Pool | A–E | A, B, C, D, E | No |
| §3.8 Time/Effort | A–G | A, B, C, D, E, F, G | No |
| §3.9 Post-M10 | A–E | A, B, C, D, E | No |
| §3.10 Meta-Governance | A–G | A, B, C, D, E, F, G | No |
| §3.11 Finding-Resolution Appendix | 137 rows binding MPC + ND.1 → MP v2.0 sections | 137 rows | No |
| (Step 3 brief §5) Spec Traceability Appendix | Required by Step 3 brief (not by spec); permissible per brief | Present; maps MP v2.0 sections → spec entries | **No** (brief-mandated, not scope creep) |

Section ordering: MP v2.0 matches spec §3.1 ordering 18/18. No deleted required sections. No added unmandated top-level sections. No editorializing beyond spec content direction.

**T.5 verdict:** No scope-creep detected. Spec Traceability Appendix is brief-§5-required, not spec scope-creep.

### T.6 — Ambiguity test

Adversarial scan: does any Learning Layer mechanism, Integrity substrate, or ethical framework paragraph admit more than one good-faith reading?

- **§IS.2 claim 2 "Adapted parity, not byte-identity":** "The mirror is *semantically* equivalent, not *textually* identical. CLAUDE.md speaks in Claude's conventions... `.geminirules` and `.gemini/project_state.md` speak in Gemini's conventions... Each mirror is adapted to its target agent's construct while preserving the meaning. The mirror principle is *semantic parity of governance content, not feature parity of agent capabilities*." **One good-faith reading:** mirrors carry equivalent governance content but may use different phrasings adapted to each agent; feature-parity of Claude/Gemini tooling is not required. No second good-faith reading survives the "semantic parity... not feature parity" disambiguation. **ND.1 T.6 obligation: PASS.** OK.

- **§IS.2 claim 1 "Bidirectional obligation":** "Any change on the Claude side triggers a mirror update on the Gemini side in the same session." Minor residual: "change" class is not defined (typo fix? version bump?). Resolved downstream: Step 6 Governance Integrity Protocol §K change-class taxonomy (per spec §3.6 brief §3 amended-per-ND.1). Not blocking at MP layer. **WARN-adjacent, not FIX-level.** OK.

- **Learning Layer discipline rule #3:** "Every parameter update requires ≥N independent observations where N is per-mechanism-defined in the Learning Layer Specification Appendix; never less than 3." **Multiple good-faith readings:** (a) N defaults to 3 for every mechanism; (b) each mechanism in LL-Appendix.B declares its own N (but the appendix doesn't actually do this); (c) N is TBD and will be set at Step 11 scaffold. The appendix's kill-switch rules reference "a rolling window of N updates" without defining N. **This admits three readings** — violates T.6 single-good-faith-reading criterion. → See **FIX.2** in §3.

- **§3.5.C "Health-crisis output requires double red-team":** "health-crisis" is not explicitly scoped. One good-faith reading: acute medical events flagged by health-domain signals. Second potential reading: any health-adjacent prediction. Adversarial scan: the surrounding context (mortality, suicide-adjacent, mental-health all listed separately) implies health-crisis is its own class distinct from those three, covering acute medical events. This is the intended class per spec §3.5.C. **Acceptable editorial breadth, not ambiguity.** OK.

- **§3.7.B "paid per-review with bounded hourly rate":** "bounded" not quantified. Intentionally left to M10 kickoff per §3.7.B ("Honorarium budget is declared at M10 open"). **Not ambiguity at MP layer.** OK.

**T.6 verdict:** one FIX-level ambiguity (discipline rule #3 N-definition). ND.1 adapted-parity ambiguity test: PASS (single good-faith reading).

### T.7 — Native directive enactment

For each `open` directive in NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md whose consumption matrix names Step 3, verify the draft actually contains the required subsection/language. Current open directives: **ND.1 only.**

ND.1 consumption-matrix Row 3 ("Rewrite") obligation:
> "MP rewrite must contain a subsection in the System Integrity Substrate section titled 'Mirror Discipline' stating the three claims. MP changelog entry names ND.1."
>
> Verification: "Subsection present with verbatim 'semantic parity of governance content, not feature parity of agent capabilities' phrasing or equivalent."

| Check | MP v2.0 location | Verdict |
|---|---|---|
| §IS.2 subsection present, titled "Mirror Discipline" | MP v2.0 line 82: "### §IS.2 — Mirror Discipline (ND.1 implementation at MP layer)" | OK |
| Claim 1 — Bidirectional obligation | MP v2.0 line 86 (verbatim per NATIVE_DIRECTIVES_FOR_REVISION §1 ND.1 interpretation claim 1) | OK |
| Claim 2 — Adapted parity, not byte-identity | MP v2.0 line 87 (verbatim); contains "semantic parity of governance content, not feature parity of agent capabilities" mandated verbatim phrasing | OK |
| Claim 3 — Scope not limited to CLAUDE.md | MP v2.0 line 88 (verbatim; names CANONICAL_ARTIFACTS_v1_0.md `mirror_obligations` column + spec §5.2 MP.1–MP.7 inventory) | OK |
| Changelog names ND.1 explicitly | MP v2.0 line 34: "the ND.1 native directive (Mirror Discipline as a First-Class Governance Principle)" | OK |
| Mirror-desync as implicit disagreement class in §3.4.C | MP v2.0 line 531: "Mirror-desync (per ND.1 / §IS.2) is treated as an implicit disagreement class — requires resolution via this same protocol, not silent overwriting." | OK |
| T.6 single-reading test on "adapted parity, not byte-identity" | Per T.6 above — single good-faith reading survives "semantic parity... not feature parity" disambiguation | OK |
| Frontmatter `id_namespace` includes mirror-pair IDs | MP v2.0 line 11: "MP.1..MP.7 (Mirror pairs, first-pass inventory)" | OK |
| Spec Traceability Appendix ND.1 summary | MP v2.0 §Spec Traceability Appendix §ND.1 traceability summary (three surfaces) | OK |

Every ND.1-consumption-matrix obligation for Row 3 is verified enacted. ND.1 T.4 (Red-team) obligation: "§1 Verdict explicitly reports ND.1 addressed status; §3 Findings include at least one ND.1-linked entry (FIX / WARN / OK)." Verified:

- §1 Verdict — ND.1 status reported addressed at MP layer; global tracking-table status remains `open` until Step 7.
- §3 Findings — ND.1-linked OK entry present below (`ND.1.OK`); FIX.2 has a tangential ND.1 adjacency (rule #3 ambiguity is Learning-Layer-discipline, not Mirror-Discipline).

**T.7 verdict:** ND.1 enactment PASS at MP layer. Step 4 obligation met.

---

## §3 — Findings

Each finding is tagged **FIX** (must resolve before Step 5), **WARN** (document, don't block), or **OK** (no action; compliance confirmation recorded for audit trail).

### FIX.1 — M8 row silent on MSR Nadi+BNN expansion ownership [HIGH; T.1, T.2]

**Defect.** M9 Entry state (MP v2.0 line 428) explicitly cites M8 as the owner of MSR coverage expansion for Nadi + BNN schools: "M8 closed AND MSR coverage expansion for Nadi + BNN schools completed (per §7 MPC.2.6; MSR expansion owned by M8 as part of its classical-attribution scope so that Nadi and BNN signal sets exist before M9 opens)." M9 Dependencies `requires` line 431 restates it: "M8 closed; MSR expansion to Nadi + BNN; M7 closed is not required for M9 kickoff."

M8's own row, however, does **not** carry this obligation:
- M8 Scope (line 410) enumerates classical-text corpora (BPHS, Phaladeepika, Saravali, Uttara Kalamrita, Jaimini Sutra, Prashna Marga, Hora Sara, KP texts, Brihat Jataka, Brihat Samhita, KP commentaries) — no Nadi/BNN corpora.
- M8 Exit state (line 412) lists four clauses (a–d): indexing + attribution + confidence tags + translation cross-check — no MSR-expansion bullet.
- M8 Dependencies `produces` (line 415) lists "classical attribution registry; classical-claim validity table" — no MSR signal expansion.

**Why it matters.** When M8 opens, the M8 phase-opening session reads M8's row to plan work. If the row does not carry the MSR-expansion obligation, it will likely be overlooked. M9's entry state is a late-binding checkpoint, not a work-authorization channel — by then, the expansion either exists or M9 blocks.

**Spec traceability.** Spec §7.2 MPC.2.6 fix resolution line: "§M9 row — MSR coverage expansion for Nadi + BNN flagged as M8-owned pre-M9 requirement." Spec §2.5 content direction for M9: "Step 3 decides which exact phase" owns it. Step 3 decided M8 (per M9 entry state), but did not back-propagate the ownership into M8's row.

**Severity.** HIGH. Breaks the closed-row-per-phase discipline that MP v2.0 is built on.

**Resolution type.** Surgical edit to M8 Exit state. No Scope rewrite; no new dependency.

**Inline fix applied (see §4.A).** Append a fifth Exit-state bullet to M8:

> `(e) MSR signal-set expanded to include Nadi + BNN school signals as a pre-M9 requirement (per MPC.2.6 resolution; enables M9 multi-school triangulation; Nadi/BNN classical basis sourced from the §3.7 acharya pool's tradition-specific consultants where corpora are not procurable under ED.7).`

Also append MSR-expansion to M8 `produces` list to keep registry traceability:

> add to `produces`: `MSR signal-set v_{M8+1} with Nadi + BNN school signal categories`.

### FIX.2 — LL discipline rule #3 promises appendix-defined N but appendix does not define N [MEDIUM; T.1, T.6]

**Defect.** MP v2.0 line 134 (Learning Layer discipline rule #3): "Every parameter update requires ≥N independent observations where N is per-mechanism-defined in the Learning Layer Specification Appendix; never less than 3."

§LL-Appendix.B per-mechanism blocks reference N in kill-switch rules (e.g., LL.1: "suspended if per-signal calibration error rate worsens over a rolling window of N updates"; LL.7 cohort mode: "active from M7 when cohort ≥ N") but **never declare N per mechanism**. A reader seeking N for LL.1 finds nothing. The rule's promise ("N is per-mechanism-defined in the appendix") is unfulfilled.

**Why it matters.** Rule #3 is the single most important n=1 overfit guardrail. If N is ambiguous, the guardrail is procedural-only. Additionally, §LL-Appendix.C n=1 mitigation binding table Row 3 binds "#3 ≥N independent observations per update" to "Update-noise inflation (single event drives misleading weight shift)" — this mitigation promise is weakened by the N ambiguity.

**T.6 ambiguity.** Three good-faith readings survive: (a) N defaults to 3 per mechanism; (b) each mechanism block declares its own N (but none does); (c) N is TBD and set at Step 11 scaffold.

**Spec traceability.** Spec §2.6 point 3 dictates the rule-#3 amended phrasing verbatim. Spec §3.2 §LL-Appendix.B required fields are Input / Output / Activation phase(s) / Kill-switch / Owner / Dependency on other LL.M / Interaction with workstreams — N is not in this list. This is a spec-level internal inconsistency that propagated into MP v2.0 faithfully.

**Severity.** MEDIUM. Guardrail-weakening, not structural.

**Resolution type.** Minimal inline clarifier on rule #3 itself. Do NOT re-open spec; do NOT add a new field to every LL-Appendix.B block.

**Inline fix applied (see §4.B).** Amend rule #3 (MP v2.0 line 134) to read:

> `3. Every parameter update requires ≥N independent observations where N is per-mechanism-defined in the Learning Layer Specification Appendix (N defaults to 3 per mechanism at MP v2.0 publication; per-mechanism overrides land at Step 11 scaffold or at the mechanism's activation phase, whichever comes first, and are logged as an amendment to §LL-Appendix.B); never less than 3. Updates also pass the two-pass Gemini/Claude protocol.`

Also append a one-line clarifier to §LL-Appendix.B opening (before the LL.1 block, after §LL-Appendix.A):

> `**N for discipline rule #3.** Per Learning Layer discipline rule #3, every parameter update and every rolling-window kill-switch N defaults to 3 per mechanism below. Per-mechanism overrides are set at Step 11 scaffold (or at the mechanism's activation phase, whichever comes first) and logged as an amendment to this appendix.`

### WARN.1 — Phase B.0 scaffolds `06_LEARNING_LAYER/` before Step 11 [T.4; coordination, not contradiction]

PHASE_B_PLAN §G B.0 Task 2 ("Create directories: ... `06_LEARNING_LAYER/`") and Task 10 ("Scaffold `06_LEARNING_LAYER/` tree") create the directory MP v2.0 marks "scaffold-pending." Under the current CLAUDE.md banner, the governance rebuild (Steps 0–15) completes before M2 B-execution resumes. Step 11 decides the LL scaffold; B.0 then either honors Step 11's decision or needs its own amendment cycle. Not an MP v2.0 defect; recorded here so Step 5 propagation can flag PHASE_B_PLAN for a coordination pass when Step 11 closes.

### WARN.2 — PHASE_B_PLAN §N Point 10 references MACRO_PLAN_v1_0.md [T.4; Step 5 scope]

PHASE_B_PLAN §N.10 reads: "`MACRO_PLAN_v1_0.md` 'current macro-phase' advanceable to M3." Once Step 5 closes (MP v1.0 → SUPERSEDED), this becomes a stale pointer. MACRO_PLAN_REVISION_SPEC §5.1 Step 5 cross-surface list (S.1–S.10) does NOT include PHASE_B_PLAN. Step 5 should either (a) amend PHASE_B_PLAN §N.10 to read "MACRO_PLAN_v2_0.md" atomically in the close session, or (b) defer to a PHASE_B_PLAN v1.0.3 with a tracked STEP_LEDGER entry. Not an MP v2.0 defect.

### WARN.3 — CW.PPL scaffold-anchor "at M2 close" vs B.0 scaffold [T.1 Dim 6; language harmonization]

MP v2.0 CW.PPL Activation: "Scaffolded at M2 close (register exists). Active from first M5 probabilistic output." PHASE_B_PLAN §G B.0 Task 10 scaffolds `prediction_ledger.jsonl` empty at B.0 (i.e., M2 open, not M2 close). Functionally equivalent (B.0-scaffolded is a superset of M2-close-scaffolded), but language harmonization would read "Scaffolded during M2 (at B.0 per PHASE_B_PLAN); active from first M5 probabilistic output." Not blocking; low-priority Step 5 amendment candidate or deferred to a future PHASE_B_PLAN / MP co-amendment cycle.

### OK — T.1 all 14 critique dimensions

All 14 critique dimensions OK except Dim 2 (FIX.1) and Dim 5 (FIX.2) as surfaced above. Per §2 T.1 table.

### OK — T.2 finding coverage

136/137 verified spot-checked; 137/137 after FIX.1 inline edit lands. Every one of 12 CRITICALs verified addressed by its spec-committed MP v2.0 section. Sampled HIGH/MEDIUM (22) all addressed.

### OK — T.3 no factual contradictions

No MP v2.0 claim contradicts GROUNDING_AUDIT_v1_0 or CURRENT corpus state (MSR_v3_0 @ 499 signals; CGM_v2_0 rebuilt on v8.0 2026-04-19 with v9_0 deferred to B.3.5; UCN_v4_0 / CDLM_v1_1 / RM_v2_0 / FORENSIC_v8_0; nine L3 reports at v1.1+; PHASE_B_PLAN v1.0.2; Claude Opus 4.7 + Gemini 2.5 Pro).

### OK — T.4 forward compat with PHASE_B_PLAN v1.0.2

B.0 makes sense under MP v2.0's M2 definition. Three coordination WARNs (W.1, W.2, W.3) recorded for Step 5 scope expansion consideration.

### OK — T.5 no scope-creep

18/18 section ordering matches spec §3.1. No sections added beyond spec + Step 3 brief §5 Spec Traceability Appendix. No content editorializing beyond spec §2/§3 content direction.

### OK — T.6 ambiguity

ND.1 "adapted parity, not byte-identity" admits exactly one good-faith reading (T.6 / ND.1 obligation PASS). §IS.2 claim 1 "change class" downstream-deferred to Step 6 (acceptable). §3.5.C health-crisis class editorially broad but not ambiguous. §3.7.B honorarium bound deferred to M10 kickoff (acceptable). One ambiguity closed by FIX.2.

### ND.1.OK — Native directive ND.1 enactment at MP layer

ND.1 consumption-matrix Row 3 ("Rewrite") obligation verified: §IS.2 subsection titled "Mirror Discipline" contains all three load-bearing claims (bidirectional obligation; adapted parity with verbatim "semantic parity of governance content, not feature parity of agent capabilities"; scope beyond CLAUDE.md); changelog names ND.1; frontmatter id_namespace includes MP.1..MP.7. Row 4 ("Red-team") obligation verified: §1 Verdict reports ND.1 addressed at MP layer; this §3 contains an ND.1-linked OK entry (this entry); T.6 single-good-faith-reading test passes on "adapted parity, not byte-identity"; §3.4.C Disagreement protocol includes mirror-desync as an implicit disagreement class. ND.1 global tracking-table status remains **`open`**; the flip to `addressed` is Step 7's responsibility per ND.1 close condition (all six per-step verifications across Steps 2, 3, 4, 5A, 6, 7 confirmed). Steps 2 and 3 already verified addressed per STEP_LEDGER history. Step 4 verified addressed per this red-team. Steps 5A, 6, 7 remain pending.

---

## §4 — Inline fixes applied

Per Step 4 brief §3 and §5: substantive rewrites loop back; inline surgical fixes are permitted. Both FIXes are minimal single-line / 2-line surgical edits.

### §4.A — FIX.1 inline edit to MP v2.0 M8 Exit state + `produces` list

**Before (MP v2.0 lines 412 and 415):**

```
- **Exit state:** (coarse) — (a) all listed corpora indexed and attributed; (b) classical-claim-holds/fails findings produced for each M5 probabilistic output; (c) attribution confidence tags populated for every citation; (d) translation-accuracy cross-check completed for non-English classical sources.
```

```
  - produces: classical attribution registry; classical-claim validity table.
```

**After (applied in this session; see diff in MP v2.0):**

```
- **Exit state:** (coarse) — (a) all listed corpora indexed and attributed; (b) classical-claim-holds/fails findings produced for each M5 probabilistic output; (c) attribution confidence tags populated for every citation; (d) translation-accuracy cross-check completed for non-English classical sources; (e) MSR signal-set expanded to include Nadi + BNN school signals as a pre-M9 requirement (per MPC.2.6 resolution; enables M9 multi-school triangulation; Nadi/BNN classical basis sourced from the §3.7 acharya pool's tradition-specific consultants where corpora are not procurable under ED.7).
```

```
  - produces: classical attribution registry; classical-claim validity table; MSR signal-set expanded for Nadi + BNN schools.
```

**Rationale.** Closes the MPC.2.6 ownership-assignment gap. M8 row now reflects what M9 entry state already asserts. Minimal line addition; no scope change beyond what spec §2.5 content direction already committed.

### §4.B — FIX.2 inline edit to MP v2.0 LL discipline rule #3 + §LL-Appendix.B opening

**Before (MP v2.0 line 134):**

```
3. Every parameter update requires ≥N independent observations where N is per-mechanism-defined in the Learning Layer Specification Appendix; never less than 3. Updates also pass the two-pass Gemini/Claude protocol.
```

**After (applied in this session; see diff in MP v2.0):**

```
3. Every parameter update requires ≥N independent observations where N is per-mechanism-defined in the Learning Layer Specification Appendix (N defaults to 3 per mechanism at MP v2.0 publication; per-mechanism overrides land at Step 11 scaffold or at the mechanism's activation phase, whichever comes first, and are logged as an amendment to §LL-Appendix.B); never less than 3. Updates also pass the two-pass Gemini/Claude protocol.
```

**Before (MP v2.0 §LL-Appendix.B opening, line 166):**

```
### §LL-Appendix.B — Per-mechanism specification
```

**After (applied in this session; inserts one line before the LL.1 block):**

```
### §LL-Appendix.B — Per-mechanism specification

**N for discipline rule #3.** Per Learning Layer discipline rule #3, every parameter update and every rolling-window kill-switch N defaults to 3 per mechanism below. Per-mechanism overrides are set at Step 11 scaffold (or at the mechanism's activation phase, whichever comes first) and logged as an amendment to this appendix.
```

**Rationale.** Closes the T.6 ambiguity on rule #3 by setting a floor-default of 3 while preserving the per-mechanism override channel at Step 11. Rule #3 still names the appendix as the authoritative source; the appendix now carries the default. No new per-mechanism field added; no LL-Appendix.B block rewrites required.

### §4.C — Fixes-summary diff stats

| File | Change | Lines added | Lines removed | Lines modified |
|---|---|---|---|---|
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | FIX.1 (M8 Exit `(e)`; M8 produces expansion) | 0 | 0 | 2 |
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | FIX.2 (rule #3 clarifier; §LL-Appendix.B N-default note) | 2 | 0 | 1 |
| **Total MP v2.0 delta:** | | **2** | **0** | **3** |

Post-fix MP v2.0 line count: 1057 + 2 = **1059 lines**. No frontmatter changes. Status remains `DRAFT_PENDING_REDTEAM` (flips to `CURRENT` at Step 5 close per spec §5.1 S.8).

**Per Step 4 brief §4 constraint:** "Do NOT change the status flag on the draft (it stays DRAFT_PENDING_REDTEAM until Step 5 closes)." — honored. No frontmatter `status` edit applied.

---

## §5 — Handoff

**Verdict:** PASS_WITH_FIXES. Both FIXes applied inline in this session per §4. All WARNs documented; none block Step 5.

**Step 4 close criteria verification (per brief §6):**

- [x] `MACRO_PLAN_REDTEAM_v1_0.md` exists (this file).
- [x] Verdict is explicit (§1).
- [x] All 7 adversarial tests executed (T.1, T.2, T.3, T.4, T.5, T.6, T.7 in §2).
- [x] PASS_WITH_FIXES: draft reflects fixes (§4.A, §4.B applied to MP v2.0); §4 logs them with before/after diff.
- [x] ND.1 enactment verified. §3 contains ND.1-linked entry (`ND.1.OK`); §1 Verdict explicitly reports ND.1 addressed at MP layer.
- [x] Every `open` directive in NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md whose consumption matrix names Step 3 verified in T.7 and reported in §3 (ND.1 only currently; verified).
- [ ] STEP_LEDGER updated; SESSION_LOG appended — executed as part of this session's close after this artifact lands.

**Next step (PASS_WITH_FIXES):** Step 5 — Macro Plan closure + propagate. The red-teamed MP v2.0 (post-FIX.1+FIX.2) is the subject of Step 5; this red-team report is the evidence of Step 4 close.

**Handoff notes for Step 5 fresh conversation.** Read CLAUDE.md → STEP_LEDGER → STEP_BRIEFS/STEP_05_MACRO_PLAN_CLOSURE_v1_0.md → MACRO_PLAN_v2_0.md (post-fixes) → this red-team artifact → MACRO_PLAN_REVISION_SPEC_v1_0.md §5 (cross-surface impact list S.1–S.10 + execution order §5.3) → NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md. Step 5's execution order per spec §5.3 is: S.8 first (MP v1.0 → SUPERSEDED) → S.5 + S.6 (registries) → S.1 + S.2 (CLAUDE.md + .geminirules mirror pass) → S.3 (project_state.md; resolves GA.7 in the same session) → S.7 (STEP_LEDGER) → S.4 (SESSION_LOG append) → S.9 (NATIVE_DIRECTIVES confirmation) → S.10 (LEL cross-ref confirmation). Step 5 should also consider whether WARN.2 (PHASE_B_PLAN §N.10 stale MP v1.0 pointer) warrants inclusion in the Step 5 atomic close or deferral to a tracked PHASE_B_PLAN v1.0.3 amendment cycle — this is a scope-expansion decision Step 5 makes up-front. Proposed Cowork thread name for Step 5 session: `Madhav 05 — Macro Plan Closure + Propagate` per CONVERSATION_NAMING_CONVENTION_v1_0.md §2.

**Step 3's ND.1 Row-3 obligation is verified addressed by this red-team.** Step 4's own ND.1 Row-4 obligation is addressed by this artifact. ND.1 global status flip to `addressed` remains deferred to Step 7 per ND.1 close condition.

---

*End of MACRO_PLAN_REDTEAM_v1_0.md. Verdict: PASS_WITH_FIXES. Next: Step 5 (Macro Plan closure + propagate) per STEP_LEDGER.*
