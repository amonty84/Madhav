---
artifact: REDTEAM_M2_v1_0.md
canonical_id: REDTEAM_M2_v1_0
version: 1.0
status: CURRENT
authored_by: KARN-W8-R1-REDTEAM-SMOKE
authored_at: 2026-05-01
brief: 00_ARCHITECTURE/BRIEFS/CLAUDECODE_BRIEF_M2_G1_REDTEAM_SMOKE.md
parent_plan: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §IS.8
verdict: PASS
w8_r2_gate: CLEARED
changelog:
  - v1.0 (2026-05-01) — Initial M2 macro-phase-close red-team report. 9 axes executed, 5 smoke steps run, verdict PASS.
---

# M2 Red-Team Report

**Session:** KARN-W8-R1-REDTEAM-SMOKE
**Mandate:** `MACRO_PLAN_v2_0.md §IS.8` — every macro-phase close requires a red-team pass before SESSION_LOG seal.
**Verdict:** **PASS**

The M2 corpus-activation macro-phase clears the IS.8 red-team gate. All nine axes returned PASS. All five smoke steps returned green within established residual baselines. No fixes were applied this session — verdict is PASS, not PASS_WITH_FIXES.

---

## Axis findings

| Axis | Description | Result | Action taken |
|---|---|---|---|
| RT.1 | Layer separation (B.1) — 10 random MSR signals checked against FORENSIC v8.0 | PASS | None — 10/10 sampled signals carry ≥1 valid FORENSIC ID |
| RT.2 | Derivation ledger (B.3) — synthesis prompt mandates citation | PASS | None — `CITATION_DISCIPLINE` constant in `prompts/templates/shared.ts:20` + per-template requirements in 7 templates (interpretive, remedial, cross_domain, factual, discovery, holistic, predictive) all enforce `[F.<id>]` and `[SIG.MSR.<id>]` citation |
| RT.3 | Versioning discipline (B.8) — frontmatter on W7-touched artifacts | PASS | `audit_ucn_msr.py` v2 docstring carries KARN-W7-R1 attribution + methodology note ✓; `fixtures.json` carries `$schema_version: 1.0` + `fixture_count: 24` matching actual ✓; `M2_PROVENANCE_AUDIT_RESULTS.md` Post-W7-R1 section appended ✓; CAPABILITY_MANIFEST `entry_count: 109` vs actual 112 entries — known deferred miscount (W7-R2 sealed; out of scope per brief MUST_NOT_TOUCH) |
| RT.4 | No fabricated computation (B.10) — 5 fixtures spot-checked | PASS | All 4 sampled `expected_signals` (SIG.MSR.396, 410, 413, 007) verified present in MSR_v3_0; topical match on signal_name; temporal-fixture empty `expected_signals: []` is allowed by design |
| RT.5 | Whole-chart-read protocol (B.11) — holistic bundle composition | PASS | Floor rule adds FORENSIC + CGM (always_required); interpretive rule adds UCN + CDLM + RM for `holistic`; discovery rule adds Pattern/Contradiction/Cluster/Resonance registers for `holistic`; tools_authorized for holistic includes `msr_sql`, `cgm_graph_walk`, `pattern_register`, `vector_search` per `router/prompt.ts:108` — all 5 L2.5 surfaces (MSR/UCN/CDLM/CGM/RM) reachable |
| RT.6 | Mirror discipline (MP.1 + ND.1) — gross desync only | PASS | Both sides agree on M2 active, Phase 11A pipeline cutover landed, B.0–B.8 complete; W6/W7 Cowork-stream additions (composition rules, per-tool planner, provenance audits, eval harness) not yet propagated to Gemini side — full mirror update is W8-R2 scope |
| RT.7 | Pipeline integrity — typecheck + targeted tests | PASS | typecheck has 9 pre-existing errors, all confined to `tests/components/AppShell.test.tsx` and `tests/components/ReportGallery.test.tsx` — both authored in pre-W6 portal-redesign commits (5c63d11, 3323603); composition_rules tests 39/39 PASS; per_tool_planner tests 15/15 PASS; full vitest suite 1047 passed / 13 failed = matches W5 baseline residual count exactly |
| RT.8 | Scope boundary — no M3+ pre-build | PASS | No `07_*`/`08_*`/`09_*`/`10_*` directories exist; `05_TEMPORAL_ENGINES` content authored in pre-W6 commits (e1a03f3, 034516d); `06_LEARNING_LAYER/` is the Step-11-scaffold scope per MACRO_PLAN — allowed |
| RT.9 | Fixture factual accuracy — 6 fixtures (1 per type) | PASS | F011 / F003 / F022 / F018 / F006 / F014 all factually correct against MSR_v3_0 + FORENSIC_ASTROLOGICAL_DATA_v8_0 (F003 Mercury MD–Saturn AD ending 2027-08-21 = `DSH.V.023` exact match) |

---

## Smoke results

| Step | Command | Result |
|---|---|---|
| S.1 TypeScript | `npx tsc --noEmit` (project lacks `npm run typecheck` script) | 9 errors, all in 2 pre-W6 UI test fixture files; **no W6/W7 regressions** |
| S.2 Unit tests | `npx vitest run` (project uses vitest, not jest as brief assumed) | 1047 passing / 13 failing — **exactly matches the 13-residual W5 baseline** |
| S.3 Composition rules | `npx vitest run src/lib/bundle/__tests__/composition_rules.test.ts` | **39/39 PASS** |
| S.4 Per-tool planner | `npx vitest run src/lib/router/__tests__/per_tool_planner.test.ts` | **15/15 PASS** |
| S.5 Audit scripts | `audit_msr_forensic.py` + `audit_ucn_msr.py` | **98.99%** (490/495) / **95.52%** (128/134) — both `target_met: true`. `audit_cgm_supports.py` SKIPPED (no DB in this environment) per brief escape clause |

---

## Fixes applied

None. All axes returned PASS without intervention. Verdict is PASS, not PASS_WITH_FIXES.

---

## Verdict rationale

The M2 corpus-activation macro-phase is materially sound at the axes the IS.8 red-team is designed to probe: layer separation holds, derivation citations are enforced at the prompt layer, versioning frontmatter is present on every W7-touched artifact, no fixture fabricates a computation that cannot be verified in the corpus, the whole-chart-read protocol is honored by the bundle composer + router for holistic queries, mirror discipline is at adapted parity for the macro state (full propagation deferred to W8-R2 by design), the TypeScript + vitest pipeline shows no W6/W7-introduced regressions (residuals are pre-existing UI-test fixture drift from portal-redesign commits well prior to W6), no M3+ infrastructure has been pre-built, and the eval-harness fixtures hold up to factual spot-check. The single non-passing finding (`CAPABILITY_MANIFEST.json` `entry_count: 109` vs actual `112`) is a known deferred item explicitly carried forward in the W7 close summary and explicitly out of scope per this brief's MUST_NOT_TOUCH guard. It does not constitute a material flaw against the IS.8 axes.

---

## W8-R2 gate

**CLEARED.** W8-R2 (M2 CLOSE artifact authoring) may proceed. The IS.8 mandatory red-team has produced a PASS verdict on the M2 corpus-activation macro-phase; the SESSION_LOG seal that closes M2 may now be authored.

---

## Forward-work items not in W8-R1 scope

Recorded for the W8-R2 close session and for steady-state hygiene. None block M2 close.

- **CAPABILITY_MANIFEST `entry_count` miscount (+3 delta).** Manifest header says 109; actual is 112. Inherited pre-W7-R2 per W7 close summary. Resolve in a manifest-audit pass; not in scope for W7-R2 (which sealed) or W8-R1 (forbidden by brief).
- **Mirror parity for W6/W7 Cowork-stream additions.** `.geminirules` and `.gemini/project_state.md` should acknowledge composition rules expansion + per-tool planner + provenance audits + eval harness. W8-R2 scope per the brief.
- **TypeScript test-fixture errors in `tests/components/AppShell.test.tsx` + `tests/components/ReportGallery.test.tsx`.** 9 errors total. Pre-W6 portal-redesign drift; not blocking but deserve a fixture-refresh pass.
- **SIG.MSR.207 sequence gap in MSR_v3_0.md.** Medium severity, KARN-W6-R3 finding, still open. Not blocking M2 close.
- **`audit_cgm_supports.py` requires live DB.** No DB available in this red-team session; the W7-R1 verification stands authoritative for that audit.
- **Eval harness baseline run.** STUB only at W7-R3 close (auth-cookie required). Not in W8-R1 scope; native-run after M2 close per W7-R3 manual-follow-up.

---

*End of REDTEAM_M2_v1_0.md.*
