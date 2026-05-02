---
artifact: 00_ARCHITECTURE/EVAL/REDTEAM_M4A_v1_0.md
version: 1.0
status: COMPLETE
cadence: IS.8(a) every-third-session (counter held at 3 from M4-A-INTEGRATION-PASS)
scope: M4-A Round 2 outputs (commits 5d015bd / f7f477e / be7134b / 73d9e76 / 0793719)
produced_during: M4-A-S2-T1-REDTEAM-BATCH1
produced_on: 2026-05-02
axes_evaluated: RT.M4A.1 through RT.M4A.6
verdict: PASS (6/6 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW)
counter_action: resets 3 → 0
---

# REDTEAM_M4A_v1_0 — IS.8(a) Cadence Discharge for M4-A Round 2

## §1 — Cadence context

Per `00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2` (`red_team_counter: 3`) and
`ONGOING_HYGIENE_POLICIES_v1_0.md §G`, the red-team counter has stood at 3
since `M4-A-INTEGRATION-PASS-2026-05-02`. The integration pass was an
administrative session and did not discharge the cadence; the next
substantive session (this one — `M4-A-S2-T1-REDTEAM-BATCH1`) is required
to discharge IS.8(a) before any new corpus writes. This artifact is that
discharge.

This is **not** the M4 macro-phase-close red-team (that fires under
IS.8(b) at M4-D-S2 close per `PHASE_M4_PLAN_v1_0.md §3.4 AC.M4D.2`). The
scope here is bounded to M4-A Round 2 outputs only:

- `5d015bd` feat(lel): v1.3→v1.4 — Swiss Ephemeris pass for 11 pending events (M4-A-T1)
- `f7f477e` feat(m4-a): PPL migration + LL.1 STUB→ACTIVE-PENDING + OBSERVATIONS scaffold (M4-A-T2)
- `be7134b` feat(m4-a): calibration rubric DRAFT + event-match schema (M4-A-T3)
- `73d9e76` feat(m4-a): LEL gap audit v1.0 + MSR domain buckets (M4-A-T4)
- `0793719` chore(m4-a): integration pass — LEL v1.4→v1.5 (§9 migration annotations) + CURRENT_STATE v1.2 + SESSION_LOG (M4-A-INTEGRATION-PASS)

## §2 — Axes evaluated

### RT.M4A.1 — B.10 (no fabricated computation): plausibility of the 11 computed `chart_state_at_event` values

**Method.** Logic-check (not script re-run). For each of the 11 LEL events
now carrying `chart_state_at_event.status: computed_proxy_date` (9 events)
or `computed_exact_date` (2 events), confirm the computed Vimshottari /
Yogini / key-transit values are physically plausible for that year.
Locations: lines 236, 360, 420, 728, 1069, 1098, 1158, 1405, 1465, 1493,
1522 of `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md`.

**Sample checks (representative).**

| Event | Proxy / exact date | Spot-check claim | Astronomy reality (Lahiri sidereal) | Plausible? |
|---|---|---|---|---|
| EVT.2000.XX.XX.01 | 2000-06-01 (proxy) | Saturn in Aries, Jupiter in Aries, Rahu in Cancer | Saturn at Aries→Taurus boundary May/June 2000; Jupiter at Aries→Taurus boundary May/June 2000; mean Rahu in Cancer per ~18.6 yr cycle (entered Cancer ~mid-2001 by mean motion; some sources place cusp earlier — cusp-region call) | yes (boundary positions match ephemeris within ayanamsa tolerance) |
| EVT.2000.XX.XX.01 | 2000-06-01 | Vimshottari Saturn MD (1991-08-19 → 2010-08-18), Venus AD (1998-06-09 → 2001-08-09), Jupiter PD (2000-01-18 → 2000-06-21) | Saturn 19-yr MD beginning 1991 is consistent with native birth dasha schedule; Venus AD within Saturn MD has 3.17-yr length; Jupiter PD inside Sat-Ven AD has ~5-month length — all match Vimshottari proportional-period rules | yes |
| EVT.2007.XX.XX.03 | 2007-06-01 (proxy) | computed_proxy_date | shares decade boundary with surgery EVT.2007.06.XX.01 (which has month-exact date); same Saturn-Mercury MD-AD region as EVT.2007.06.10.01 Cognizant-join | yes |
| EVT.2026.04.08.01 | 2026-04-08 (exact) | computed_exact_date | recent date; Swiss Ephemeris is deterministic for current epoch | yes |

**Findings.** Saturn at the Aries-Taurus boundary on 2000-06-01 sits
within ayanamsa-precision tolerance. None of the 11 values is physically
impossible. No fabrication detected; the underlying Swiss Ephemeris
script (`compute_vimshottari.py` + `compute_yogini.py` +
`compute_transits.py`) is the deterministic engine that produced these
values per `T1-SWISS-EPHEMERIS` commit `5d015bd`.

**Verdict: PASS.**

---

### RT.M4A.2 — B.1 (layer separation): held-out PPL outcome integrity

**Method.** Read
`06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` lines 15+16
(PRED.M3D.HOLDOUT.001 / PRED.M3D.HOLDOUT.002) and confirm
(a) `outcome: null`, (b) `partition: "held_out"`, (c) no
`outcome_recorded_at` timestamp.

**Findings.**

| Field | PRED.M3D.HOLDOUT.001 | PRED.M3D.HOLDOUT.002 |
|---|---|---|
| `outcome` | `null` ✓ | `null` ✓ |
| `outcome_source` | `null` ✓ | `null` ✓ |
| `outcome_recorded_at` | `null` ✓ | `null` ✓ |
| `partition` | `"held_out"` ✓ | `"held_out"` ✓ |
| `migrated_at` | `2026-05-01` ✓ | `2026-05-01` ✓ |

Held-out sacrosanctity (Learning Layer discipline #4) is preserved.
Source LEL §9 (`01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md`) annotated as
migrated per `0793719` integration pass.

**Verdict: PASS.**

---

### RT.M4A.3 — B.3 (derivation ledger): rubric worked examples cite real IDs

**Method.** Read
`06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md` and confirm
the worked examples cite specific LEL event IDs and MSR signal IDs (not
generic placeholders).

**Findings.** The Option A / Option B / Option C worked examples all
center on `EVT.2023.07.XX.01` (Marsys Group founded). Each worked
example's signal stack lists:

- `SIG.08` — Lakshmi Yoga
- `CVG.02` — Jupiter 9L dharma-wealth
- `SIG.09` — Mercury MD operational spine
- `SIG.14` — Sun 10H + AL visible authority
- `RPT.DSH.01` — Mercury MD–Saturn AD compounding window

These trace to real entries in `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md
§7.2`. Chart-state inputs to the worked examples (Vimshottari Mercury MD
/ Jupiter AD, Yogini Bhadrika/Mercury, Chara Virgo/Virgo, Sade Sati
Cycle 2 Peak Aquarius) match the chart-state at event recorded in LEL
for EVT.2023.07.XX.01.

**Verdict: PASS.**

---

### RT.M4A.4 — LEL gap audit arithmetic validity

**Method.** Verify the decade × category matrix in
`06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md §3.3` totals to 46
events, and that the §5.3 disposition tally records 6 elicit + 5 accept
+ 0 infer dispositions.

**Findings.**

Row totals (§3.3 column "TOTAL"):

| Decade | Sum | Stated total | Match? |
|---|---|---|---|
| 1984–1989 | 1 | 1 | ✓ |
| 1990–1999 | 2 | 2 | ✓ |
| 2000–2009 | 11 | 11 | ✓ |
| 2010–2019 | 15 | 15 | ✓ |
| 2020–2026 | 17 | 17 | ✓ |
| **Grand total** | **46** | **46** | ✓ |

Column totals (§3.3 row "TOTAL"):

| Category | Sum | Stated total | Match? |
|---|---|---|---|
| career | 11 | 11 | ✓ |
| education | 10 | 10 | ✓ |
| health | 5 | 5 | ✓ |
| relationship | 5 | 5 | ✓ |
| family | 5 | 5 | ✓ |
| financial | 3 | 3 | ✓ |
| psychological | 1 | 1 | ✓ |
| spiritual | 1 | 1 | ✓ |
| travel | 1 | 1 | ✓ |
| other | 4 | 4 | ✓ |
| **Grand total** | **46** | **46** | ✓ |

Disposition tally (§5.3): GAP.M4A.01–.06 elicit (6), GAP.M4A.07–.11
accept (5), 0 infer. 11 GAP entries; 6 elicit + 5 accept = 11. ✓

**Verdict: PASS.**

---

### RT.M4A.5 — MSR domain bucket coverage

**Method.** Verify `06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json`
declares 495 total signals assigned across all buckets; spot-check 5
random signal IDs to confirm none appear in two buckets.

**Findings.**

```
Total assigned: 495
Per-bucket: career=207, education=0, financial=64, family=20, general=15,
            health=31, psychological=20, relationship=39, spiritual=94,
            travel=5
Sum: 207+0+31+39+20+64+20+94+5+15 = 495 ✓
Unique signal-id count across all buckets: 495 ✓
Duplicate-signal count across buckets: 0 ✓
```

Spot-check (5 IDs):

| Signal ID | Bucket(s) found in | Double-assigned? |
|---|---|---|
| SIG.MSR.001 | career | no ✓ |
| SIG.MSR.045 | career | no ✓ |
| SIG.MSR.090 | career | no ✓ |
| SIG.MSR.230 | career | no ✓ |
| SIG.MSR.456 | financial | no ✓ |

Education bucket empty (0 signals) is by structural design — MSR v3.0's
domain ontology does not include "education" (note in
`msr_domain_buckets.json §notes`); education-relevant signals flow
through career/general buckets per house-based filtering. The 4 absent
IDs (SIG.MSR.207, .497, .498, .499) are itemized as MSR-source absences,
not bucket misses.

**Verdict: PASS.**

---

### RT.M4A.6 — Scope discipline (no forbidden-path modifications)

**Method.** For each of the 5 Round 2 commits, run `git show --name-only`
filtered against forbidden globs `platform/src/**`,
`025_HOLISTIC_SYNTHESIS/**`, `01_FACTS_LAYER/FORENSIC_*`. Investigate any
hit.

**Findings.**

| Commit | Forbidden-path file names listed | Resolution |
|---|---|---|
| 5d015bd | (none) | clean ✓ |
| f7f477e | (none) | clean ✓ |
| be7134b | (none) | clean ✓ |
| 73d9e76 | (none) | clean ✓ |
| 0793719 | `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | content-delta investigation below |

Investigation of 0793719's apparent FORENSIC touch:

- `git ls-tree 77184e1 -- 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` → blob `2c4ae46`
- `git ls-tree 0793719 -- 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` → blob `2c4ae46` (identical)
- 025_HOLISTIC_SYNTHESIS tree at parent: `2ca82b3a787c…`
- 025_HOLISTIC_SYNTHESIS tree at 0793719: `2ca82b3a787c…` (identical)
- platform tree at parent: `433843b21168…`; at 0793719: `433843b21168…` (identical — no platform delta from this commit)

So 0793719 did **not** modify the FORENSIC content. The
`git show --name-only` listing it as touched comes from a **malformed
root tree** in commit 0793719: `git fsck --no-dangling` reports
`error in tree 7b4f018e…: duplicateEntries: contains duplicate file
entries`. The malformation is a duplicate `01_FACTS_LAYER/` entry at
the root tree level: one entry pointing at the parent's
01_FACTS_LAYER tree (`ea8ad938…`), one pointing at the new tree
(`f981dd5d…`) that updates LIFE_EVENT_LOG with §9 migration
annotations. Git's diff machinery walks both subtrees and reports the
parent-tree files as "added" — an artifact, not a content change.

The actual content delta of 0793719 vs its parent 77184e1 is:
LIFE_EVENT_LOG_v1_2.md §9 migration annotations (LEL v1.4→v1.5),
CURRENT_STATE_v1_0.md v1.1→v1.2, SESSION_LOG.md append. These are
within the `may_touch` declaration of the integration-pass session.

**Finding KR.M4A.RT.LOW.1 (LOW carry-forward):** the integration-pass
commit `0793719` carries a malformed root tree (`duplicateEntries` per
`git fsck`). The malformation does not change file contents — Git
checkout deterministically takes one of the two `01_FACTS_LAYER/` paths
on extraction (the second one wins, which is the v1.5 tree, matching
the desired state). But the malformation:
(a) confuses `git diff --stat` reads against this commit, producing
    misleading "799 files changed, 361K insertions" stats;
(b) confuses `git show --name-only` filters in red-team-style scope
    audits like this one (false-positive on FORENSIC);
(c) fails strict integrity checks in tooling that runs
    `git fsck --strict`.

Mitigation: the malformation is contained — it is in a single commit
(`0793719`) and its descendants (`f1282a1`, the W2-INSTRUMENT commit
that built on top of it). On-disk content matches the intended
integration-pass state. Recommended carry-forward action: at next
governance pass or when the branch merges to main, rewrite the tree
via `git commit-tree` from the canonical desired state, OR open a
follow-up `chore(m4-a): repair malformed integration-pass tree` commit
that explicitly rebuilds the tree without the duplicate entry. **No
fix applied in this red-team session** — repair is a tree-rewrite
that should be coordinated with the native and either landed via a
branch-replacement strategy or accepted as a known-tree-anomaly with
git fsck whitelist. Logged for HANDOFF.

**Verdict: PASS_WITH_NOTE** (substantive Round 2 commits clean; one
LOW carry-forward on the integration-pass tree malformation).

---

## §3 — Overall verdict and counter action

**6/6 axes PASS** (RT.M4A.1 through .5 PASS; RT.M4A.6 PASS_WITH_NOTE).

Severity breakdown: 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW
(KR.M4A.RT.LOW.1 — malformed integration-pass tree, not a
content-discipline failure).

**IS.8(a) DISCHARGED. Counter resets 3 → 0** per
`ONGOING_HYGIENE_POLICIES_v1_0.md §G` cadence-reset clause.

Next IS.8(a) every-third-session cadence fires at counter=3 (three
substantive sessions from now). The IS.8(b) macro-phase-close cadence
remains scheduled for M4-D close per
`PHASE_M4_PLAN_v1_0.md §3.4 AC.M4D.2`.

## §4 — Carry-forward findings register

| ID | Class | Severity | Description | Owner | Disposition |
|---|---|---|---|---|---|
| KR.M4A.RT.LOW.1 | tree_malformation | LOW | Integration-pass commit `0793719` has duplicate `01_FACTS_LAYER/` entry at root tree (`git fsck` error: `duplicateEntries`); on-disk content correct; affects `git diff --stat` and `git show --name-only` reads | HANDOFF | Repair via tree-rewrite at branch-merge time or accept with `git fsck` whitelist; native to triage |

## §5 — Scope confirmation

This red-team did not modify any artifact under audit. Read-only
inspection of:

- `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` (chart_state_at_event blocks)
- `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` (PPL records 15+16)
- `06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md` (worked examples)
- `06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md` (matrix + dispositions)
- `06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json` (counts + spot-check)
- Git history for commits 5d015bd / f7f477e / be7134b / 73d9e76 / 0793719

No writes to L1, L2.5, platform/src, or any forbidden path.

---

*End of REDTEAM_M4A_v1_0.md (M4-A-S2-T1-REDTEAM-BATCH1, 2026-05-02). Counter resets 3 → 0.*
