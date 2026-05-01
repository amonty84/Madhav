---
artifact: DIS009_ANALYSIS_v1_0.md
version: 1.0
status: CURRENT
authored_by: M3-W1-A1-EVAL-BASELINE
authored_at: 2026-05-01
binding_level: read-only analysis (NOT a disposition)
governs_disposition_at: M3-A close (PHASE_M3_PLAN_v1_0.md AC.M3A.4)
prerequisite_for: AC.M3A.4 — DIS.009 disposition decision (R1 / R2 / R3)
mirror_obligations: claude-only (no Gemini-side counterpart for analysis artifacts; the
  disposition itself, when committed, lands in DISAGREEMENT_REGISTER which is mirrored)
references:
  - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md §DIS.009
  - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json (PAT.008)
  - 025_HOLISTIC_SYNTHESIS/MSR_v3_0.md (SIG.MSR.348, SIG.MSR.397, SIG.MSR.042, SIG.MSR.040)
  - 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md (§3.5 D9, §17 Arudhas, §20 Deity Triad, §21 Sade Sati)
  - 035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_revalidation_batch1_raw.md
---

# DIS.009 — Analysis (Read-Only) v1.0

## Provenance and scope

This document is read-only analysis prepared at the M3-W1-A1-EVAL-BASELINE session
to feed AC.M3A.4 (DIS.009 disposition) at M3-A close. **It modifies nothing.** It
does not alter `DISAGREEMENT_REGISTER_v1_0.md`, `PATTERN_REGISTER_v1_0.json`,
`MSR_v3_0.md`, or any other live artifact. It frames evidence and presents three
resolution options (R1 / R2 / R3) per the M3-A close native-decision schema, with
Claude's recommendation in §3.

## §1 — Evidence chain

### §1.1 — What PAT.008 currently claims

From `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json` (lines 314–355):

- `pattern_id`: `PAT.008`
- `claim_text`: "Saturn's governance of both the D9 Karakamsa (soul purpose sign
  ruler) and the D1 Arudha Lagna (public identity) creates an architectural lock:
  spiritual evolution and material recognition advance or regress together, never
  independently."
- `mechanism`: "Mercury occupies the D9 Karakamsa, making Mercury's soul purpose
  the chart's deepest spiritual driver. **Saturn governs Capricorn, which is both
  the Arudha Lagna sign (10H) and exerts AmK governance.** When Saturn disciplines
  Mercury's expression, it simultaneously refines both material public recognition
  (AL) and soul-purpose fulfillment (Karakamsa). The chart cannot produce spiritual
  advancement without commensurate material recognition, and vice versa — they are
  structurally yoked. Saturn transit activation (D1 Sade Sati + D60 Lagna past-karma)
  during Mercury MD enforces both dimensions simultaneously."
- `signals_referenced`: SIG.MSR.348, SIG.MSR.397, SIG.MSR.042, SIG.MSR.040
- `confidence`: HIGH (0.87)
- `re_validation_status`: `gemini_conflict`
- `validator_results`: P5/P1/P2/P7/P8/P9 all `true` (passed Claude's mechanical validators)

### §1.2 — What L1 facts the claim rests on

The claim has two structural sub-claims that draw on different L1 fact sets.

**Sub-claim A — Saturn governs the D1 Arudha Lagna:**

- `ARD.AL` (FORENSIC §17, line 1214): Arudha Lagna = **Capricorn**, in the **10H**.
  Derivation: Lagna Aries → Lord Mars in 7th (Libra); 10th from Libra = Capricorn.
- Capricorn lord = **Saturn** (classical).
- Therefore: Saturn governs the AL sign. **L1-clean.** B.10 satisfied.

**Sub-claim B — Saturn governs the D9 Karakamsa:**

- `KRK.C.ATMA` (FORENSIC §22): Atmakaraka (AK) = **Moon** (highest D1 longitude 27°02′).
- `D9.MOON` (FORENSIC §3.5, line 283): Moon in D9 = **Gemini**.
- Karakamsa = the sign occupied by AK in D9 = **Gemini**.
- Gemini lord = **Mercury** (classical), not Saturn.
- `D9.SATURN` (FORENSIC §3.5, line 288): Saturn in D9 = **Aries**.
- Therefore: **Mercury governs the D9 Karakamsa, NOT Saturn.** Saturn's D9 placement
  (Aries) is in the 10th from D9 Lagna (Cancer), not in the Karakamsa.
- **Sub-claim B as written is NOT L1-clean.** The mechanism text's assertion that
  "Saturn governs the D9 Karakamsa" conflates two different things:
    - Saturn = AmK (Amatyakaraka), the second-highest karaka by degree, with broad
      "minister" significations across the chart;
    - The Karakamsa lord (Mercury, since Karakamsa = Gemini = Mercury's sign).
  Saturn does NOT govern the Karakamsa in the standard Jaimini sense.

### §1.3 — Where the claim is rescuable: the AmK reading

A charitable reading of PAT.008's mechanism text is that "Saturn... exerts AmK
governance" is a DIFFERENT claim from "Saturn governs the D9 Karakamsa." Saturn
IS the AmK (Atmakaraka second-rank = "soul-minister"), and the AmK does have a
broad governance role in Jaimini analysis — specifically, the AmK is said to
support the AK's mission. But the specific statement "Saturn's governance of...
the D9 Karakamsa" reads literally as "Saturn is the lord of the sign occupied by
the AK in D9," which is false. The two readings are semantically distinct, and
the Pattern Register's `claim_text` opener — "**Saturn's governance of both the
D9 Karakamsa**... and the D1 Arudha Lagna" — phrases the structural lock as
parallel governance, suggesting the literal reading was intended.

### §1.4 — What Gemini's revalidation actually said

From the DISAGREEMENT_REGISTER §DIS.009 entry (lines 484–488):

- `evidence_side_b.excerpt`: "D9 Karakamsa claim requires verified D9 Saturn
  placement (B.10); mechanism text creates L1 grounding conflict."
- Gemini verdict (per DR.description): **REJECT — recommend split or
  `[EXTERNAL_COMPUTATION_REQUIRED]`.**

Gemini's specific objection has two parts that must be unpacked:

**Part 1.** "D9 Saturn placement (B.10)." This phrasing suggests Gemini was
flagging the Saturn-in-D9 placement as needing external verification. But the
FORENSIC v8.0 §3.5 table explicitly carries `D9.SATURN = Aries` as an L1 fact
(provenance: jagannatha_hora). So the D9 Saturn placement IS verified. The B.10
flag, if literal, was unfounded.

**Part 2.** "Mechanism text creates L1 grounding conflict." This is the substantive
objection: the text-as-written says Saturn governs the Karakamsa, which contradicts
the L1 fact that Karakamsa = Gemini = Mercury's sign. **This part of Gemini's
objection is correct.**

### §1.5 — Where the output conflict with the AL Identity Lock arises

The "AL Identity Lock" framing (PAT.008's `claim_text`) requires BOTH halves of
the parallel — Karakamsa governance + AL governance — to be Saturn-driven for
the "lock" metaphor to hold structurally. If only the AL half is Saturn-driven
and the Karakamsa half is actually Mercury-driven, the Lock's mechanism collapses
into something different:

- The well-grounded structure is: **Saturn (AmK, AL lord) ↔ Mercury (Karakamsa
  lord, also DK in the 7-karaka system, also MD lord 2010–2027, also Vargottama
  in Capricorn 10H).** The two are linked through the Capricorn 10H (Mercury
  occupies it; Saturn rules it), not through parallel governance of two different
  surfaces.
- The PAT.008 claim, as written, asserts Saturn controls both surfaces directly.
  The well-grounded claim is that Saturn controls one (AL) and *disciplines*
  the planet that occupies the other (Mercury in Capricorn = Saturn-disposited =
  Saturn's D1 hospitality + Sade Sati 2025–2028 = Saturn-discipline reaching
  Mercury). The lock is real; its mechanism is more circumspect.

This is the precise grounding ambiguity Gemini flagged. The PAT.008 mechanism
text does name Mercury's Karakamsa occupancy (sentence 1: "Mercury occupies the
D9 Karakamsa..."), but the second sentence's "Saturn governs Capricorn, which is
both the Arudha Lagna sign (10H) and exerts AmK governance" pivots from
Mercury-via-Capricorn to Saturn-as-governor in a way that elides which surface
each planet actually owns. A reader who consumes the `claim_text` line ("Saturn's
governance of both the D9 Karakamsa and the D1 Arudha Lagna") without the
mechanism text ends up with the literal-but-false reading.

## §2 — Three resolution options

### §2.1 — Option R1 — RESOLVE-by-split

**Action.** Decompose `PAT.008` into two pattern entries:

- **`PAT.008-AL`**: Single-surface pattern — Saturn governs the D1 Arudha Lagna
  (Capricorn 10H), and Saturn-discipline transits (D1 Sade Sati 2025–2028, D60
  Lagna Saturn = past-karma) during Mercury MD shape the AL/public-identity
  surface. Signals: `SIG.MSR.397` (AL well-grounded), `SIG.MSR.040` (Saturn-Pisces
  triple), `SIG.MSR.042` (D60 Saturn at Lagna). L1-clean. B.10 satisfied. Confidence
  HIGH retained.
- **`PAT.008-D9`**: Single-surface pattern — flagged
  `[EXTERNAL_COMPUTATION_REQUIRED: verify D9 Saturn placement and any structural
  yoke between D9 Saturn (Aries) and the Karakamsa (Gemini) per Jaimini Sutras
  Ch.4]`. Signals: `SIG.MSR.348`. Confidence demoted to MED until external
  computation lands. The "architectural lock" framing is dropped from this entry
  — the D9 surface is left as an open structural question rather than a closed
  parallel claim.

The two entries together carry the same downstream references PAT.008 carries
today (resonance/cluster cross-links rerouted to the appropriate sub-entry).

**Evidence supporting R1.**
- The AL-half is L1-clean (FORENSIC §17 + classical Capricorn-Saturn rulership).
- The D9-half is the actual locus of the conflict — splitting isolates the issue
  to the half that needs further investigation without losing the well-grounded
  claim.
- Precedent: B.10 mandate explicitly names `[EXTERNAL_COMPUTATION_REQUIRED]` as
  the canonical mechanism for "computation-required-but-not-yet-derived" claims
  (PROJECT_ARCHITECTURE §B.10).

**Cost.**
- Minor schema cost: Pattern register schema must accommodate child-IDs (`PAT.008-AL`
  / `PAT.008-D9`). Inspecting `PATTERN_REGISTER_v1_0.json` shows IDs are flat strings
  — no schema change needed if the IDs are simply new sibling entries with `PAT.008`
  marked `status: superseded` and a `superseded_by: [PAT.008-AL, PAT.008-D9]` field
  added. (035 register CLAUDE.md line "Registers are append-only ... set status:
  superseded instead" supports this.)
- Downstream resonance/cluster cross-links must be audited and rerouted. (Reading
  `PATTERN_REGISTER` for PAT.008 references and grep'ing
  `RESONANCE_REGISTER_v1_0.json` + `CLUSTER_ATLAS_v1_0.json` would catch all sites;
  this is bounded work.)

**Risk.**
- Low. R1 preserves the well-grounded half, isolates the contested half, and
  leaves an audit trail. Native may revisit `PAT.008-D9` later when Jagannatha
  Hora export verifies D9 placement details (M3-B's ED.1 cross-check window).
- Slight risk of register-schema churn if other patterns later need similar
  splits and we end up with multiple naming conventions for split entries.

### §2.2 — Option R2 — WITHDRAW

**Action.** Mark `PAT.008` as `status: superseded` (per 035 register append-only
discipline) with `re_validation_status: gemini_rejected_upheld`. No replacement
pattern. Downstream resonance/cluster cross-links to PAT.008 are pruned or
rerouted to the underlying signals (SIG.MSR.348, SIG.MSR.397, etc.) directly,
without going through a Pattern-level claim.

**Evidence supporting R2.**
- Gemini's revalidation verdict was REJECT.
- The "architectural lock" framing — the most distinctive structural claim of
  PAT.008 — does not survive when the D9 half is removed. Without parallel
  Saturn-governance of both surfaces, there is no lock; there is only a Mercury-
  Saturn relationship through Capricorn (which is captured in `SIG.MSR.348`,
  `SIG.MSR.397`, etc., already).
- Strict B.10 reading: a pattern whose mechanism text contains an L1-grounding
  conflict should be withdrawn rather than preserved with caveats.

**Cost.**
- Loses the AL-half of the claim (which IS well-grounded). The Saturn-disciplines-
  AL-during-Sade-Sati structural reading would need to be re-articulated as a
  new pattern (or left implicit in the underlying signals) to stay in the corpus.
- More cross-link rerouting work than R1, since no replacement pattern catches
  the references.

**Risk.**
- Medium. The "Saturn-disciplines-AL-during-Sade-Sati" structural insight is real
  and well-grounded; withdrawing PAT.008 entirely loses it from the Pattern Engine
  surface unless re-articulated. R2 trades clarity (no contested pattern) for
  completeness (real signal absent at Pattern level).
- Withdrawal sets a precedent that any Pattern with mechanism-text ambiguity gets
  withdrawn rather than refined. This may be too strict if applied uniformly.

### §2.3 — Option R3 — RE-GROUND

**Action.** Keep `PAT.008` as a single pattern but rewrite the mechanism text
and (if needed) the claim text to ground every assertion against verified L1
facts in `FORENSIC_ASTROLOGICAL_DATA_v8_0.md`. The replacement structure:

- **Claim text (revised).** "Saturn (AmK, lord of Capricorn 10H AL) and Mercury
  (DK, MD lord, Vargottama in Capricorn 10H, occupant of D9 Karakamsa) are
  structurally yoked through the Capricorn 10H surface: AL identity development
  and Karakamsa soul-purpose fulfillment cannot diverge without one of these
  two planets breaking sign-relationship. Saturn-discipline transits (D1 Sade
  Sati 2025–2028, D60 Lagna Saturn) during Mercury MD enforce both dimensions
  through this single architectural axis."
- **Mechanism text (revised).** Drop "Saturn governs the D9 Karakamsa." Replace
  with the actual Mercury-via-Capricorn dispositorship reading: Mercury occupies
  Capricorn 10H = Saturn's sign = Saturn-disposited. Mercury is also Vargottama
  (D1 Capricorn = D9 Capricorn), so Saturn's hospitality to Mercury holds across
  D1 and D9. The Karakamsa (D9 Gemini, ruled by Mercury) is therefore reachable
  from Saturn only THROUGH Mercury — the "lock" is one-step, not parallel-
  governance.
- **Signals retained.** All four (SIG.MSR.348 / SIG.MSR.397 / SIG.MSR.042 /
  SIG.MSR.040), since the underlying L1 facts are unchanged; only the synthesis
  is re-grounded.
- **`re_validation_status`** flipped from `gemini_conflict` to
  `gemini_resolved_via_reground` (or similar) with a `resolution_session` pointer.

**Evidence supporting R3.**
- Preserves the Pattern-level claim (downstream references stay intact).
- Fixes the precise B.10 violation (literal "Saturn governs Karakamsa" claim) by
  rewording.
- The underlying structural insight — Saturn-Mercury through Capricorn yokes AL
  and Karakamsa — IS true and IS L1-grounded; R3 surfaces it cleanly.
- Preserves the `gemini_revalidation` audit trail: the conflict is recorded as
  resolved-via-rewrite, not papered over.

**Cost.**
- Moderate authoring cost: re-author claim_text + mechanism_text in
  `PATTERN_REGISTER_v1_0.json` and the .md companion. Re-run validators (P5/P1/
  P2/P7/P8/P9). Ensure no signal-citation regression.
- Requires careful prose work — the Mercury-via-Capricorn reading must NOT
  re-introduce the same elision ("Saturn governs..." conflated with "Saturn
  disposits..."). Native review of the rewrite recommended.

**Risk.**
- Low–medium. R3 succeeds if the rewrite is clean. The risk is rhetorical drift:
  a future reader of the rewritten mechanism could re-introduce the Karakamsa-
  governance elision in a paraphrase. Mitigation: the `gemini_resolved_via_reground`
  status + a `resolution_note` field that explicitly names the original conflict
  and why the rewrite avoids it.

## §3 — Claude's recommendation (NON-BINDING — native decides)

**Recommendation: R3 (RE-GROUND), with R1 (SPLIT) as the close fallback.**

**Rationale.**
1. The underlying structural insight — Saturn-Mercury yoke through Capricorn 10H
   linking AL and Karakamsa — is real, L1-grounded, and high-significance. It
   would be a corpus loss to either withdraw it (R2) or fragment it across two
   weakly-coupled child entries (R1's `PAT.008-AL` + `PAT.008-D9` lose the yoke
   framing because the yoke is precisely what links them).
2. The precise B.10 violation is rhetorical, not structural — the mechanism
   text uses "governs" where "disposits-via-Capricorn" is meant. A clean rewrite
   resolves the conflict without losing the insight.
3. R3 preserves Pattern-level downstream references (resonance / cluster cross-
   links stay intact; no rerouting work).
4. The audit trail (`gemini_resolved_via_reground` status with rewrite-resolution
   note) preserves the Gemini-Pass-2 finding's record-of-objection without forcing
   the corpus to act as if the structural insight was wrong — only its phrasing was.
5. R1 is preferred over R2 if R3 is not feasible — splitting at least preserves
   the AL-half cleanly. R2 is only preferred if native concludes the entire
   Karakamsa-governance reading is too risky to keep in any form, including a
   re-grounded one.

**Where Claude defers to native.**
- If native has a stricter B.10 reading where any "rescuable-via-rewrite" claim
  must be withdrawn rather than re-grounded (to set a precedent for future
  Pattern Engine activations), R2 is correct.
- If native wants to preserve the option of returning to `PAT.008-D9` once
  Jagannatha Hora export verifies the D9 Saturn ↔ Karakamsa Jaimini-relationship
  question independently (i.e., is there a non-trivial Saturn-Karakamsa link
  through Saturn's role as 9th-from-Karakamsa-AK in D9 from Gemini = Aquarius?
  Saturn is in D9 Aries, which is 11th from Gemini, not 9th — but secondary
  Jaimini conventions vary), R1 with the `[EXTERNAL_COMPUTATION_REQUIRED]` tag
  is the right fit.

**What Claude does NOT recommend.**
- Status-quo (leave PAT.008 as-is with `gemini_conflict` open). The disagreement
  cannot stay open into M3-B; either R1, R2, or R3 must be committed at M3-A close.
- A fourth option that downgrades PAT.008's confidence from HIGH to MED without
  changing the mechanism text — this would be a half-measure that preserves the
  B.10 violation while signaling unease. The disposition options should be terminal.

## §4 — What this analysis does NOT decide

- The DIS.009 disposition itself. That decision is native's at M3-A close
  (PHASE_M3_PLAN AC.M3A.4). This document only frames evidence and options.
- The `[EXTERNAL_COMPUTATION_REQUIRED]` specification text for R1's `PAT.008-D9`
  child entry, if R1 is selected. If R1 lands, the M3-A-close session authors
  the spec text and it lives in the new pattern entry, citing Jaimini Sutras
  Ch.4 + an explicit Jagannatha Hora cross-check ask.
- The exact rewritten claim_text and mechanism_text for R3, if R3 is selected.
  If R3 lands, the M3-A-close session does the rewrite, validators are re-run,
  and the `re_validation_status` is updated atomically.
- Any cascade implications for other patterns that cite the same signals.
  `PAT.001` and others reference `SIG.MSR.397`; none of those are affected by
  the PAT.008 disposition since they use the underlying signal directly, not
  PAT.008's synthesis. The cascade is bounded.

---

*End of DIS009_ANALYSIS_v1_0.md v1.0. Read-only. Feeds AC.M3A.4 at M3-A close.*
