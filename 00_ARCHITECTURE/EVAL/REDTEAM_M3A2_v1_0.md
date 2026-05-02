---
artifact: REDTEAM_M3A2_v1_0.md
version: 1.0
status: CURRENT
authored_by: M3-W1-A4-DIS009-DISPOSITION
authored_at: 2026-05-01
red_team_class: IS.8(a) every-third-session cadence
red_team_counter_at_fire: 3
session_at_fire: M3-W1-A4-DIS009-DISPOSITION
scope: >
  Second IS.8(a) cadence-fire in M3 (counter trail: A2 fire reset 3→0; A3 0→1;
  C3-Shadbala 1→2; this session A4 2→3 → IS.8(a) FIRES at close, counter resets
  3→0). Per PHASE_M3_PLAN §3.1 AC.M3A.9 cadence note this firing was scheduled
  for "mid-M3-A or M3-A close depending on session count" — it lands at M3-A
  close as expected.

  Surface red-teamed: the full M3-A deliverable set as it stands at A4 close
  POST Gate-1 DIS.009 disposition. The seven axes named in the brief are
  enumerated below. Cross-axis interactions are evaluated where they matter
  (e.g., RT.M3A2.5 DIS.009 consistency interacts with RT.M3A2.3 B.10
  fabricated-computation; RT.M3A2.1 layer-separation interacts with
  RT.M3A2.2 derivation-ledger).

  This is the IS.8(a) every-third-session cadence red-team — NOT the IS.8(b)
  macro-phase-close red-team. The IS.8(b) red-team is M3-D scope per
  PHASE_M3_PLAN §3.4 AC.M3D.4 and remains scheduled.
verdict: PASS
findings: 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW
fixes_applied: 0
known_residuals_logged: 1
---

# REDTEAM M3A2 v1.0 — IS.8(a) Cadence Fire (M3-A Full-Surface Audit at Close)

## §1 — Scope

Red-team the full M3-A deliverable set as it stands at A4 close, post Gate-1
DIS.009 R3 disposition. Seven axes per the M3-W1-A4 session brief.

**Artifacts in scope:**

- A1: `00_ARCHITECTURE/EVAL/BASELINE_RUN_W9_MANUAL_v1_0.md` (manual-capture
  baseline) + `00_ARCHITECTURE/DIS009_ANALYSIS_v1_0.md` (read-only structured
  analysis).
- A2: `platform/src/lib/config/feature_flags.ts` (4 DISCOVERY_*_ENABLED flags),
  `platform/src/lib/retrieve/{pattern_register,contradiction_register,
  resonance_register,cluster_atlas}.ts` (flag-gate wiring),
  `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` (tool_binding + entry_count fix),
  `platform/src/lib/retrieve/__smoke__/m3a2_discovery_flags.ts` (smoke test),
  `00_ARCHITECTURE/EVAL/REDTEAM_M3A_v1_0.md` (predecessor cadence-fire).
- A3: `platform/src/lib/prompts/templates/shared.ts` (CONTRADICTION_FRAMING
  rubric in buildOpeningBlock).
- A4 / Gate 1 (this session, post-disposition):
  `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json` (PAT.008
  re-grounded), `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.md`
  (companion update), `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` (DIS.009
  → resolved).

**Out of scope (M3-D's IS.8(b) macro-phase-close red-team):**
- Eval-harness contradiction-fixture cross-pair (R.M3A.3 mitigation half — eval
  fixtures pair). Deferred to M3-D per AC.M3A.9.
- 5-acharya-reading review per `MACRO_PLAN §M3` quality gate (b) — M3-D scope.
- Acharya-grade chart reading sample — M3-D scope.

## §2 — The seven axes

### RT.M3A2.1 — B.1 Layer separation (synthesis amendments)

**Claim under attack:** The A2 + A3 + A4 deliverables do not introduce L1 facts
into the interpretation layer (L2.5+), nor back-contaminate L1 with L3.5
synthesis claims.

**Attack vectors examined:**

1. **A3 CONTRADICTION_FRAMING preamble.** Read `shared.ts` lines 26 + 56-69.
   The framing constant is *instructional prose for the LLM at synthesis time*,
   not L1 content. It enforces three layer-separation invariants explicitly:
   "Do not fabricate L1 facts or invent a resolution that the register does
   not record. Cite the contradiction_id... so the response is auditable back
   to the L3.5 Contradiction Register (B.1 layer-separation; B.3 derivation-
   ledger discipline)." The preamble itself is a synthesis-prompt artifact,
   not a fact assertion. ✓
2. **A4 PAT.008 rewrite.** The two-step architecture rewrite cites L1 facts by
   reference (FORENSIC §17 for Arudha Lagna derivation, classical Capricorn-
   Saturn rulership for AL; FORENSIC §3.5 D9.MOON = Gemini and D9.MERCURY =
   Capricorn Vargottama for the dispositorship chain). The L1 facts are NAMED
   and CITED inside the L3.5 Pattern Register entry — not COPIED INTO it. The
   Pattern Register row remains an L3.5 synthesis surface that links upward
   to L1 via reference, not by content-import. Boundary preserved. ✓
3. **A2 register tool emit shape.** Per inspection at REDTEAM_M3A axis G,
   `source_canonical_id` on emitted chunks is set to the L3.5 register's
   canonical ID (PATTERN_REGISTER / CONTRADICTION_REGISTER / etc.), never to
   FORENSIC / MSR / LEL. Layer attribution on retrieved chunks is correct. ✓

**Result: PASS.** Layer-separation discipline holds across A2/A3/A4.

### RT.M3A2.2 — B.3 Derivation-ledger compliance

**Claim under attack:** Every Pattern/Contradiction Engine output carries
explicit linkage to its source register row IDs and (transitively) to L1 fact
IDs via the signals or l1_references it cites.

**Attack vectors examined:**

1. **Pattern Engine output shape.** Pattern register entries carry
   `signals_referenced` (linking L3.5 patterns to L2.5 MSR signal IDs which
   themselves cite L1). The `pattern_id` is emitted as an explicit row
   identifier in the retrieved chunk, satisfying B.3's "every L2.5+ claim
   carries a DERIVATION_LEDGER entry listing the specific L1 fact IDs it
   consumes" requirement at the register-row-pointer level. ✓
2. **Contradiction Engine output shape.** Contradiction register entries
   carry `signals_in_conflict` and `l1_references` arrays (per
   CONTRADICTION_REGISTER schema). Both link downward to L1 fact IDs. The
   `contradiction_id` is the row pointer. ✓
3. **A3 prompt-side enforcement.** CONTRADICTION_FRAMING explicitly instructs
   the LLM to "cite the contradiction_id for each contradiction you surface
   so the response is auditable back to the L3.5 Contradiction Register
   (B.1 layer-separation; B.3 derivation-ledger discipline)." This is direct
   prompt-level B.3 enforcement on the synthesis side. ✓
4. **A4 PAT.008 rewrite cites L1 sources by name.** "FORENSIC §17", "FORENSIC
   §3.5 D9.MOON = Gemini", "Capricorn lord = Saturn (classical)". The
   derivation chain is laid out step by step in the mechanism text, satisfying
   the derivation-ledger discipline at the prose layer. ✓

**Result: PASS.** Derivation-ledger discipline holds across the M3-A surface.

### RT.M3A2.3 — B.10 No-fabricated-computation

**Claim under attack:** No M3-A artifact asserts a computed numerical chart
value not traceable to pyswisseph (or already in L1) or carrying
[EXTERNAL_COMPUTATION_REQUIRED].

**Attack vectors examined:**

1. **A2 register tools emit registry content unmodified.** Pattern engine
   reads `claim_text` / `mechanism` from JSON registers; emits passthrough.
   `toNumericConfidence` is deterministic label-to-number formatting, not
   chart computation. ✓
2. **A3 CONTRADICTION_FRAMING is prose only — no numerical assertions.** ✓
3. **A4 PAT.008 rewrite.** Numerical claims in the rewrite:
   - "Atmakaraka = Moon (highest D1 longitude 27°02′)" — L1-attested
     (FORENSIC §22 + §1 PLN table).
   - "Arudha Lagna = Capricorn 10H" — L1-attested (FORENSIC §17).
   - "Moon's D9 sign = Gemini" — L1-attested (FORENSIC §3.5 D9.MOON).
   - "Mercury occupies Capricorn 10H Vargottama (D1 Capricorn = D9 Capricorn)"
     — L1-attested (FORENSIC §1 PLN.MERCURY at line 160; §3.5 D9.MERCURY at
     line 285 with Vargottama=YES annotation).
   - "Saturn transit activation (D1 Sade Sati 2025–2028)" — L1-attested
     (FORENSIC §21).
   - "Mercury MD (2010–2027)" — L1-attested (FORENSIC §5.1).
   The D9 verification embedded in the [EXTERNAL_COMPUTATION_REQUIRED] is a
   belt-and-suspenders re-verification of L1-already-attested facts, not a
   B.10 violation (the ECR text is explicit per native instruction at Gate 1).
   ✓
4. **A1 BASELINE_RUN_W9_MANUAL.** Records "NOT MEASURED — auth wall" for all
   six metrics; no fabricated numerics. ✓
5. **A1 DIS009_ANALYSIS_v1_0.md.** Read-only analysis; cites L1 IDs by
   reference (`KRK.C.ATMA`, `D9.MOON`, `D9.SATURN`, `ARD.AL`, etc.). ✓

**Result: PASS.** No fabricated computation in M3-A.

**LOW finding noted under §3 below:** the PAT.008 ECR text could explicitly
reference FORENSIC §3.5 as the in-corpus source for what JH is being asked to
verify, since both Moon D9 = Gemini and Mercury D9 = Capricorn (Vargottama)
are already L1-attested. This is a clarification opportunity, not a B.10
violation. Native explicitly authored the ECR text at Gate 1; preserving it
verbatim is correct per native verdict.

### RT.M3A2.4 — Flag-gate correctness

**Claim under attack:** `DISCOVERY_PATTERN_ENABLED` and
`DISCOVERY_CONTRADICTION_ENABLED` (and the two sibling flags
`DISCOVERY_RESONANCE_ENABLED` / `DISCOVERY_CLUSTER_ENABLED`) have correct
defaults, env-override, and smoke-test paths.

**Attack vectors examined:**

1. **Defaults.** `feature_flags.ts` lines 86-89: all four
   `DISCOVERY_*_ENABLED: true` (post-A2 smoke flip per AC.M3A.2 / AC.M3A.3).
   The flip from default-false-at-first-commit to default-true-after-smoke
   happened within A2's session per `REDTEAM_M3A_v1_0 §3` smoke evidence
   (8/8 PASS) and is durable in the committed file. ✓
2. **Env-override path.** `loadEnvOverrides()` iterates `Object.keys(
   DEFAULT_FLAGS)`, which now includes the four new flags. Operator opt-out
   via `MARSYS_FLAG_DISCOVERY_PATTERN_ENABLED=false` works identically to
   existing flags. Confirmed by REDTEAM_M3A axis C PASS; no regression since
   that red-team. ✓
3. **Gate placement in retrieve().** `pattern_register.ts` line 79: flag
   check is the first line of `retrieve()` after `start = Date.now()`; the
   `getStorageClient().readFile(REGISTER_PATH)` call at line 81+ runs only
   if the gate is open. Same shape in `contradiction_register.ts` line 74.
   No bypass path. ✓
4. **Smoke test path.** `platform/src/lib/retrieve/__smoke__/
   m3a2_discovery_flags.ts` exists; reproducible per REDTEAM_M3A §3 invocation
   `MARSYS_REPO_ROOT=/Users/Dev/Vibe-Coding/Apps/Madhav npx tsx
   --conditions=react-server platform/src/lib/retrieve/__smoke__/
   m3a2_discovery_flags.ts`. ✓
5. **Disabled-bundle marker.** Both pattern_register and
   contradiction_register `disabledBundle()` set
   `invocation_params.disabled = true` and
   `invocation_params.reason = '<FLAG>=false'`. Downstream consumers can
   branch on `params.disabled === true` to distinguish "tool ran, found
   nothing" from "tool was skipped due to flag". ✓

**Result: PASS.** Flag-gate wiring is correct, smoke-verified, and stable.

### RT.M3A2.5 — DIS.009 disposition consistency (Gate 1 cross-check)

**Claim under attack:** The R3 disposition executed at Gate 1 of this session
does not introduce new grounding ambiguity in the Pattern Register.

**Attack vectors examined:**

1. **L1 grounding of every claim in the rewritten mechanism.** Walked
   every load-bearing assertion against FORENSIC v8.0:
   - Arudha Lagna = Capricorn (FORENSIC §17). ✓
   - Capricorn lord = Saturn (classical rulership). ✓
   - Atmakaraka = Moon (FORENSIC §22). ✓
   - Moon D9 = Gemini (FORENSIC §3.5 D9.MOON). ✓
   - Karakamsa = Gemini-ruled-by-Mercury (Karakamsa-as-AK-D9-sign + classical
     Gemini-Mercury rulership). ✓
   - Mercury D1 = Capricorn (FORENSIC §1 PLN.MERCURY line 160). ✓
   - Mercury D9 = Capricorn Vargottama (FORENSIC §3.5 D9.MERCURY line 285,
     `Vargottama YES`). ✓
   - Sade Sati 2025-2028 (FORENSIC §21). ✓
   - Mercury MD 2010-2027 (FORENSIC §5.1). ✓
   Every load-bearing claim resolves to an L1 fact ID. No new ambiguity
   introduced.
2. **Internal consistency between PAT.008 fields post-rewrite.** The
   `claim_text` and `mechanism` agree (both state the two-step architecture
   with AL direct + Karakamsa via Mercury dispositorship). The
   `signals_referenced` array (SIG.MSR.348/397/042/040) remains valid — the
   underlying L1 facts those signals cite are unchanged; only the
   PAT.008-level synthesis was re-grounded. ✓
3. **Audit-trail completeness.** PAT.008 carries new fields `status:
   needs_verification`, `re_validation_status: resolved_pending_ecr`,
   `resolution_session: M3-W1-A4-DIS009-DISPOSITION`, `resolution_note: ...`
   describing the original conflict and the rewrite rationale. DIS.009 in
   DISAGREEMENT_REGISTER carries `status: resolved`, `resolution: ...`,
   `resolved_on: 2026-05-01`, `resolved_by_session: M3-W1-A4-DIS009-DISPOSITION`,
   plus a `native_arbitration` step in `arbitration_steps_taken`. Cross-
   linkage from DIS.009 to PAT.008 (and to PATTERN_REGISTER .json + .md
   companion + DIS009_ANALYSIS_v1_0.md) preserved in `linked_artifacts`. ✓
4. **Downstream cross-link integrity.** PAT.008's `signals_referenced`
   enumeration is unchanged, so RESONANCE / CLUSTER cross-links that
   referenced PAT.008 remain valid. No re-routing required (a stated benefit
   of R3 over R1). ✓
5. **gemini_conflict annotation flipped.** The PATTERN_REGISTER's
   `re_validation_status` field changed `gemini_conflict →
   resolved_pending_ecr` per native instruction. The original
   `re_validation_event_id` is preserved (audit trail), only the status
   string flipped. ✓

**Result: PASS.** R3 disposition leaves PAT.008 internally consistent and
L1-grounded; the audit trail is complete; downstream cross-links unaffected.

### RT.M3A2.6 — Eval baseline integrity

**Claim under attack:** `BASELINE_RUN_W9_MANUAL_v1_0.md` is non-stub with all
six metrics populated per AC.M3A.1.

**Attack vectors examined:**

1. **Document existence + non-stub.** File exists at
   `00_ARCHITECTURE/EVAL/BASELINE_RUN_W9_MANUAL_v1_0.md`, 190 lines,
   structured frontmatter + §1 purpose + §2 command + §3 errors + §4 harness
   self-check + §5 six-metric statement + §6 native-acceptance + §7 cross-
   references. Not a STUB. ✓
2. **Six metrics populated per §5.** Each of the six metrics named in
   PHASE_M3_PLAN §3.1 has a row in §5: per-class pass rate, retrieval
   coverage, signal-citation count, latency p50/p95, output-shape compliance,
   audit-event presence. Each row carries `status this session` (NOT
   MEASURED — auth wall) + a manual-capture statement explaining what the
   metric represents and where the harness logic for it lives. The
   ROWS ARE POPULATED; the numerical VALUES await KR.W9.1 (auth secrets).
   This matches the explicit manual-capture clause in PHASE_M3_PLAN §3.1
   (entry-gate fallback). ✓
3. **Native-acceptance present.** §6 carries
   `native_acceptance.accepted_by: native-Abhisek (implicit, via brief
   allowing manual-capture mode)` + `accepted_on: 2026-05-01` +
   `acceptance_basis` + `scope_of_acceptance` + `conditions`. ✓
4. **AC.M3A.5 (post-baseline delta) is the related but distinct gate.** §6
   `conditions` flags AC.M3A.5 as TBD pending native re-evaluation. The
   M3-A close-checklist treats AC.M3A.5 as DEFERRED-with-rationale per the
   brief-permitted disposition. ✓
5. **Harness self-check positive evidence (§4).** Eval infrastructure end-
   to-end intact except for auth credential. fixtures.json + runner.py +
   scorer.py + dev server reachability all confirmed. The blocker is auth
   only. ✓

**Result: PASS.** AC.M3A.1 satisfied via manual-capture mode per phase-plan
clause; the corresponding deferred item KR.W9.1 is logged.

### RT.M3A2.7 — Scope compliance

**Claim under attack:** A1, A2, A3 sessions touched only their declared
`may_touch` paths; no `must_not_touch` violations.

**Attack vectors examined (per session close blocks in PROJECT_M3_SESSION_LOG):**

1. **A1 (M3-W1-A1-EVAL-BASELINE).** Declared scope: eval-baseline + DIS.009
   written analysis. Produced: `00_ARCHITECTURE/EVAL/BASELINE_RUN_W9_MANUAL_v1_0.md`
   + `00_ARCHITECTURE/DIS009_ANALYSIS_v1_0.md` + state-pointer updates. No
   touch of `platform/src/lib/retrieve/**` or synthesis or bundle paths
   (DIS.009 analysis is read-only by binding_level, modifies no live artifact
   per its frontmatter). ✓
2. **A2 (M3-W1-A2-PATTERN-ENGINE).** Declared scope: flag-gating + manifest
   entry_count fix. Produced: `feature_flags.ts` (4 new flags),
   `pattern_register.ts` / `contradiction_register.ts` /
   `resonance_register.ts` / `cluster_atlas.ts` flag-gate wiring,
   `CAPABILITY_MANIFEST.json` tool_binding + entry_count fix 109→112,
   `m3a2_discovery_flags.ts` smoke, `REDTEAM_M3A_v1_0.md`. All within
   may_touch. ✓
3. **A3 (M3-W1-A3-CONTRADICTION-ENGINE).** Declared scope: synthesis-prompt
   amendment for contradiction-framing. Produced: `CONTRADICTION_FRAMING`
   constant in `platform/src/lib/prompts/templates/shared.ts` injected into
   `buildOpeningBlock()`. The amendment landed in the SHARED preamble
   covering all 7 active synthesis classes — confirming the brief's
   expectation that the rubric is class-agnostic and dormant when no
   contradiction-register chunks present. No L1 / corpus / register touches.
   83/83 vitest pass at close. ✓
4. **A4 (this session, in flight).** Declared scope (per session-open
   handshake): DISAGREEMENT_REGISTER + PATTERN_REGISTER + REDTEAM_M3A2 +
   PROJECT_M3_SESSION_LOG + CURRENT_STATE + .gemini/project_state.md +
   SESSION_LOG. Gate 1 stayed within
   `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.{json,md}` +
   `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md`. Gate 2 (this artifact)
   is `00_ARCHITECTURE/EVAL/REDTEAM_M3A2_v1_0.md`. All within may_touch. ✓
5. **Concurrent tracks (Track 2 M3-B + Track 3 M3-C) did not touch M3-A
   surfaces.** Confirmed at REDTEAM_M3C scope-compliance axis.

**Result: PASS.** No scope violations across A1/A2/A3/A4-in-flight.

## §3 — Findings + fixes

### F.M3A2.1 — LOW — ECR text could reference FORENSIC §3.5 as in-corpus L1 source

**Class:** documentation_clarity (NOT B.10 violation)

**Surface:** `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json`
PAT.008.mechanism — the [EXTERNAL_COMPUTATION_REQUIRED] block.

**Description.** The ECR asks JH to verify "(a) Moon D9 placement = Gemini"
and "(b) Mercury D1 placement = Capricorn". Both facts are already
L1-attested in FORENSIC v8.0 §3.5 (D9.MOON = Gemini at line ~283; D9.MERCURY
= Capricorn Vargottama at line 285) and §1 (PLN.MERCURY = Capricorn at line
160). The ECR is a belt-and-suspenders re-verification per native instruction
at Gate 1. A reader of PAT.008 could mistakenly conclude the underlying
claims are unverified at L1. A clarifying note inside the ECR (or in the
adjacent resolution_note) referencing the in-corpus source would foreclose
that misreading.

**Severity rationale:** LOW because (a) the resolution_note already states
"AL half is L1-clean from FORENSIC §17"; (b) the rewrite mechanism text
itself names FORENSIC §3.5 and §17 explicitly; (c) the ECR is verbatim per
native instruction at Gate 1 and the brief's hard constraint forbids
modifying the ECR text without native consent; (d) no incorrect derivation
flows from this — only a mild presentation issue.

**Fix:** None applied this session. Recorded as carry-forward for the M3-D
acharya-grade chart-reading review session (or any session where native
revisits PAT.008's text). The fix would be a one-line annotation inside the
ECR text: "(NB: both verification targets are also already attested at
FORENSIC v8.0 §3.5; ECR re-verifies for belt-and-suspenders auditability per
DIS.009 native verdict.)".

**Logged as:** known_residual KR.M3A2.1 in this session's close-checklist.

## §4 — Verdict

**PASS** — 7/7 axes, 0 CRITICAL, 0 HIGH, 0 MEDIUM, 1 LOW.

The full M3-A deliverable set as it stands at A4-close (post Gate-1 R3
disposition) holds B.1 layer-separation, B.3 derivation-ledger, B.10
no-fabricated-computation discipline. Flag-gate wiring is correct and
smoke-stable. DIS.009 R3 disposition is internally consistent with L1
grounding. Eval baseline satisfies AC.M3A.1 in manual-capture mode.
Scope-compliance held across A1/A2/A3/A4-in-flight.

The single LOW finding is a documentation-clarity carry-forward, not a
correctness defect. M3-A close is unblocked.

The IS.8(b) M3-D macro-phase-close red-team remains scheduled per
PHASE_M3_PLAN §3.4 AC.M3D.4 and will cover the cross-fixture eval-delta
+ contradiction-framing model-behavior tests deferred from A2/A3.

## §5 — Counter state

- `red_team_counter_at_fire: 3`
- `red_team_counter_after: 0` (resets on IS.8(a) cadence fire per
  `ONGOING_HYGIENE_POLICIES §G`).
- Next IS.8(a) fire expected at counter=3 again, i.e., after three more
  substantive sessions. Likely first M3-D session if M3-D is decomposed into
  multiple sessions, or first M3-B-S3 / M3-D-pre session depending on M3-B
  closure cadence.

## §6 — Cross-references

- Predecessor cadence-fire: `00_ARCHITECTURE/EVAL/REDTEAM_M3A_v1_0.md` (A2
  close, 7/7 axes PASS, 0 findings).
- Sub-phase-close quality gate (NOT cadence): `00_ARCHITECTURE/EVAL/
  REDTEAM_M3C_v1_0.md` (M3-C close, 7/7 axes PASS, 0 findings).
- Phase plan AC.M3A.9: `00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md §3.1`.
- Cadence policy: `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md §G`.
- Macro-phase-close cadence (M3-D scope): `MACRO_PLAN_v2_0.md §IS.8(b)` +
  `PHASE_M3_PLAN §3.4 AC.M3D.4`.

---

*End of REDTEAM_M3A2_v1_0.md.*
