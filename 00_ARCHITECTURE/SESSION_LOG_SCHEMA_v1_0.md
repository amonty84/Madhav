---
artifact: SESSION_LOG_SCHEMA_v1_0.md
version: 1.0
status: CURRENT
produced_during: STEP_10_SESSION_LOG_SCHEMA (Step 0 → Step 15 governance rebuild)
produced_on: 2026-04-24
authoritative_side: claude
implements: >
  GROUNDING_AUDIT_v1_0.md findings GA.17 (session naming inconsistency), GA.18 (multi-option
  next-objective), GA.19 (you-are-here marker — full upgrade via CURRENT_STATE_v1_0.md
  sibling artifact produced in the same step). Also formalizes the SESSION_LOG-entry
  structural schema referenced by GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §I.3.3 (structural
  presence of session_open + body + session_close) and §I.5 (GA.17 + GA.18 closure bound to
  Step 10).
mirror_obligations:
  claude_side: 00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md
  gemini_side: null
  mirror_mode: claude_only
  authoritative_side: claude
  asymmetries: >
    The SESSION_LOG itself is declared Claude-only at MP.7 (CANONICAL_ARTIFACTS §2), so
    this schema — the rule-set for SESSION_LOG entries — is also Claude-only by inheritance.
    Gemini sessions that append to SESSION_LOG (none currently; future possibility) would
    emit entries conforming to this same schema; no Gemini-side schema counterpart is
    required.
supersedes: (none — first version of the SESSION_LOG schema)
consumers:
  - platform/scripts/governance/schema_validator.py — validate_session_log() extended in
    Step 10 to check post-adoption entries against §2
  - 00_ARCHITECTURE/SESSION_LOG.md — carries the schema-adoption banner pointing here;
    entries appended after the horizontal-rule adoption point conform to §2
  - Every Claude session from STEP_10 onward — the appended entry self-validates against §2
    as part of the session-close YAML's implicit contract
  - 00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md — the `session_open` YAML this schema
    requires in §2.b is the instantiated handshake from that template
  - 00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md — the `session_close` YAML in §2.f is
    the instantiated close-checklist from that template
changelog:
  - v1.0 (2026-04-24, Step 10 of the Step 0 → Step 15 governance rebuild):
      Initial schema. §1 naming schema (rebuild-era + post-rebuild forms + legacy
      preservation); §2 required entry structure (six-block order: frontmatter /
      session_open / body / scope-discipline / session_close / next-objective); §3
      optional per-entry frontmatter; §4 deprecation of multi-option "Choose from
      A/B/C/D" next-objective trailers in favor of one committed objective + a
      "Deferred alternatives" appendix; §5 SESSION_LOG header banner specification
      that SESSION_LOG.md must carry; §6 retrofit policy (forward-only; the Step 10
      session's own entry is the first entry under the new schema). Closes GA.17 +
      GA.18 at the schema layer; §I.5 of the integrity protocol acknowledges Step 10
      as the closure locus. CURRENT_STATE_v1_0.md is the paired deliverable that
      closes GA.19 at the state-surface layer.
---

# SESSION_LOG SCHEMA v1.0
## AM-JIS Project — Canonical Entry Format for `00_ARCHITECTURE/SESSION_LOG.md`

*Implements GA.17 (naming inconsistency) + GA.18 (multi-option next-objective) closure per
`GROUNDING_AUDIT_v1_0.md`. Companion deliverable `CURRENT_STATE_v1_0.md` closes GA.19
at the state-surface layer. Produced in Step 10 of the Step 0 → Step 15 governance
rebuild.*

---

## §0 — Why this schema exists

Before Step 10, `SESSION_LOG.md` entries carried three incompatible naming conventions
(numeric `Session 1`, prefix-numeric `FIX_SESSION_001`, descriptive `GAP_RESOLUTION_SESSION`)
and the closing "Next session objective" frequently presented a menu of options rather than
a single committed next-objective. The grounding audit (§6.1 GA.17, §6.2 GA.18, §6.3 GA.19)
documented this; `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §I.5` routed the closure to this step.

A schema is the minimum cost of fixing three coupled defects:

1. A fresh session opening the log cannot reliably locate the most recent entry or grep
   the history without first decoding the three naming styles.
2. An agent that reads a multi-option next-objective must re-decide scope before beginning
   work — a scope-drift vector for which the protocol now holds us accountable.
3. Structural inconsistency across entries makes the SESSION_LOG entry an invalid target
   for mechanical validation; `schema_validator.py §I.3.3` can only check trivial presence
   without a schema to check against.

Installing the schema here, carrying a retrofit horizontal rule in `SESSION_LOG.md` rather
than rewriting history, and extending `schema_validator.py` to validate post-adoption
entries resolves all three.

---

## §1 — Entry naming schema

Every SESSION_LOG entry identifies itself with a stable `session_id` at its `## <id> — <date>`
header, in the adjacent `session_open` YAML block's `session_id` field, and in any downstream
artifacts that cite the session (STEP_LEDGER deliverable rows, `last_verified_session` fields
in CANONICAL_ARTIFACTS, etc.). The three fields must agree; drift between them is a finding.

### §1.1 — Allowed `session_id` forms (post-adoption)

The form is determined by the session's class. Classes are disjoint; a session has exactly
one class.

| Class | Form | Example | Notes |
|------|------|---------|-------|
| **Governance-rebuild step** (Steps 0–15) | `STEP_NN_<SHORT_TITLE>` | `STEP_10_SESSION_LOG_SCHEMA` | Title in `SCREAMING_SNAKE_CASE`; `NN` is two-digit zero-padded (Step 5A uses `STEP_5A_...` — the only non-numeric ID). Class active only until Step 15 closes `GOVERNANCE_BASELINE_v1_0.md`. |
| **Post-rebuild macro-phase work** | `YYYY-MM-DD_Mx_<sub-phase>_<SLUG>` | `2026-06-03_M2_B3_UCN_RETRIEVAL_BUNDLE` | Date prefix ISO-8601; `Mx` names the macro-phase (M1–M10 per `MACRO_PLAN_v2_0.md`); sub-phase optional (phase-B sessions carry `Bx`); SLUG in `SCREAMING_SNAKE_CASE`. |
| **Post-rebuild corrective fix** | `YYYY-MM-DD_FIX_NNN_<SLUG>` | `2026-07-14_FIX_042_MSR_DUPLICATE_SIGNAL` | `NNN` monotonic three-digit counter across all fix sessions (continues the pre-rebuild `FIX_SESSION_001..003` sequence; Step 10's adoption is the first opportunity to re-use that counter — reserve `FIX_004` onward). |
| **Ad-hoc / audit / amendment session** | `YYYY-MM-DD_<DESCRIPTIVE_SLUG>` | `2026-08-01_FORENSIC_V9_SUPPLEMENT_AUDIT` | For sessions that do not fit the three classes above. SLUG must be specific (no `GENERIC_SESSION`). |

### §1.2 — Legacy forms (pre-adoption; preserved as-is)

Historical entries that use any of the following legacy forms are NOT rewritten; they stand
as authored. The schema-adoption horizontal rule in `SESSION_LOG.md` (§5 below) marks the
cut-off:

- `Session N` (numeric, e.g., `Session 1`, `Session 2`, ..., `Session 18`)
- `Session N.M` (sub-numeric, e.g., `Session 1.5`)
- `FIX_SESSION_NNN[_variant]` (e.g., `FIX_SESSION_001`, `FIX_SESSION_003_deferred`)
- Bare descriptive (e.g., `GAP_RESOLUTION_SESSION`, `UCN_MERGE_SESSION`, `CLOSURE_AUDIT_PASS`,
  `CORPUS_VERIFICATION_PASS`, `MACRO_PLAN_INSTALLATION`, `PHASE_B_PLAN_v1_0.2_AMENDMENT_PASS`)
- `STEP_NN_<TITLE>` (introduced during the rebuild; continues seamlessly into §1.1 row 1 —
  no retrofit required for Steps 0–9 entries that already use this form)

### §1.3 — Uniqueness

Every `session_id` is globally unique across the log. Re-use is forbidden even for resumed
sessions; a continuation session appends `_CONT`, `_RESUME`, or similar suffix or, if its
scope is materially different, receives a new ID. A session that splits across multiple
Cowork threads for technical reasons (context compaction, disconnection) declares the split
in its body and still carries one canonical `session_id`.

### §1.4 — Cross-surface binding

- The `session_id` in the SESSION_LOG header matches the `session_id` in the entry's
  embedded `session_open` and `session_close` YAML blocks.
- The STEP_LEDGER per-step history entry's "Owner" field (rebuild era) or CURRENT_STATE's
  `last_session_id` field (post-rebuild) matches the SESSION_LOG `session_id`.
- Any downstream artifact that cites a session (e.g., CANONICAL_ARTIFACTS §1 rows'
  `last_verified_session` field) cites the same string.

---

## §2 — Entry structure (post-adoption)

Every post-adoption entry is a single markdown section at level 2 with six blocks in this
order. Any reordering or omission is a schema violation.

```
(§2.a) ## <session_id> — YYYY-MM-DD
(§2.b) <session_open YAML block>                 # fenced ```yaml ... ```
(§2.c) <body — free-form narrative>              # Environment / Objective / Outputs
(§2.d) <scope discipline observed>               # within-scope confirmation
(§2.e) <session_close YAML block>                # fenced ```yaml ... ```
(§2.f) <next session objective>                  # one committed objective; see §4
```

Optional appendices (red-team self-check, tracked follow-ups, cross-check notes) live
after block §2.f and before the entry-terminator (`*End of <session_id> entry — YYYY-MM-DD.*`).

### §2.a — Heading

```
## <session_id> — YYYY-MM-DD
```

Date is the close date in ISO-8601 local-calendar form. A session that spans midnight is
logged with its close-date header. A session that was opened one calendar day and closed
a later day uses close-date; the open-date is recorded inside the `session_open` block.

### §2.b — Embedded `session_open` YAML

Verbatim the YAML block emitted at session open per `SESSION_OPEN_TEMPLATE_v1_0.md §2`,
wrapped in a fenced ```yaml ... ``` code block. Fingerprints, declared scope, mirror-pair
freshness, and native-directive obligations as they stood at open. Not a later rewrite —
this IS the emitted handshake, captured at open, appended to the log at close as part of
the atomic SESSION_LOG write.

### §2.c — Body

Free-form markdown narrative covering (at minimum):

- **Environment** — agent surface (Claude desktop app Cowork mode / Claude Code CLI /
  Gemini web / etc.), working directory, any distinctive environmental facts.
- **Objective** — one sentence restating what the session's step brief (or equivalent)
  asked for.
- **Outputs produced** — every file created or modified, with path; typically grouped by
  new files, modified files, and reports. Matches `session_close.files_touched` in §2.e.
- **Outcome narrative** — prose account of what happened, decisions taken, self-verification
  performed. This is the reading surface for a future agent auditing the session; it carries
  the judgment calls that the YAML cannot.

The body is the only part of the schema that remains free-form. It has no required
sub-heading schema (headings like "### Outcome" or "### Close-criteria discipline" are
conventional in rebuild-era entries and recommended but not mandatory).

### §2.d — Scope discipline observed

A short block (one paragraph or a bullet list) that confirms the session operated within
the `declared_scope` emitted in §2.b. Every file outside `declared_scope.may_touch` that
was touched is named with its justification; every file within `must_not_touch` that was
touched is named with a `scope_amendment_reason` and the native-approval evidence.

If scope was perfectly observed, the block reads: "Scope discipline: all touched files fall
within `declared_scope.may_touch`; no `must_not_touch` entries were modified." (or equivalent).

### §2.e — Embedded `session_close` YAML

Verbatim the YAML block emitted at session close per `SESSION_CLOSE_TEMPLATE_v1_0.md §2`,
wrapped in a fenced ```yaml ... ``` code block. Must carry `close_criteria_met: true` (a
`false` value means the session did not close; no SESSION_LOG entry is written at all in
that case — the session halts per protocol §G.3).

### §2.f — Next session objective

**One** committed next objective, in a block labelled `### Next session objective` or
equivalent level-3 heading. Menu-form ("Choose from A/B/C/D") is forbidden per §4. If the
session genuinely leaves multiple credible next steps, it commits to one and names the
others in a `### Deferred alternatives` appendix with brief rationale for deferral. The
committed objective is what the next session's `session_open.session_id` and its brief (if
applicable) will address.

Typical content of the committed block:

1. One-sentence committed objective, naming the step / phase / fix it addresses.
2. Ordered list of files the next session must read at open.
3. Proposed Cowork thread name per `CONVERSATION_NAMING_CONVENTION_v1_0.md §2` (must match
   the next session's `session_open.cowork_thread_name` field when it opens).

### §2.g — Entry terminator (convention)

`*End of <session_id> entry — YYYY-MM-DD.*`

Italicized one-liner at the end of the entry. Not schema-required (a consumer can detect
the next entry's `## ` heading as the boundary) but strongly recommended for reader clarity.
Historical entries from STEP_7 onward adopt this convention.

---

## §3 — Optional per-entry frontmatter

A post-adoption entry MAY carry a YAML frontmatter block between §2.a (heading) and §2.b
(`session_open`). When present, it SHOULD carry:

```yaml
session_id: STEP_10_SESSION_LOG_SCHEMA
date_opened: 2026-04-24T12:00:00+05:30
date_closed: 2026-04-24T20:00:00+05:30
agent: claude-opus-4-7
step: STEP_10              # or macro-phase, e.g., M2.B.3; null for ad-hoc
files_touched_count: 14    # integer; matches session_close.files_touched length
cowork_thread_name: "Madhav 10 — SESSION_LOG Schema + CURRENT_STATE"
```

Frontmatter is optional because the `session_open` YAML (§2.b) already carries most of the
same information; the frontmatter exists only as a quick-grep surface. A consumer that reads
`session_open.session_id` gets the same data.

Rationale for keeping it optional rather than mandatory: dual-writing increases the risk of
drift between the frontmatter and the `session_open` block (if the frontmatter claims
`agent: claude-opus-4-7` but `session_open.agent_name: gemini-2-5-pro`, which wins?). The
schema validator (§7) treats any disagreement between frontmatter and `session_open` as a
schema violation; a session that chooses to emit frontmatter takes on the cost of keeping
them synchronized.

---

## §4 — Deprecation of multi-option next-objective trailers

### §4.1 — The defect

Legacy entries frequently closed with text of the form:

> **Next session objective:** Choose from:
>
> - (A) Session N+1: foo
> - (B) Session N+1: bar
> - (C) Session N+1: baz
> - (D) Fix session: quux

The next session that opened on this log had to re-decide scope before beginning work. This
is a scope-drift vector and a procedural-discipline failure (GA.18).

### §4.2 — The replacement

Every post-adoption entry ends with exactly **one** committed next-session objective. If the
closing session genuinely left credible alternatives, it does two things:

1. Commits to one in the `### Next session objective` block.
2. Names the alternatives in an adjacent `### Deferred alternatives` appendix with, for
   each, a one-line rationale for deferral.

Example of the acceptable form:

```
### Next session objective

Execute **Step 11 — Learning Layer scaffold decision**. Fresh conversation reads:
1. `CLAUDE.md` ...
2. `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` (verify Step 11 → `ready`; Step 10 → `completed`)
3. `00_ARCHITECTURE/STEP_BRIEFS/STEP_11_LEARNING_LAYER_SCAFFOLD_v1_0.md`
...
**Proposed Cowork thread name:** `Madhav 11 — Learning Layer Scaffold` per
`CONVERSATION_NAMING_CONVENTION_v1_0.md §2`.

### Deferred alternatives

- Skip Step 11 and jump to Step 12 ongoing hygiene — deferred because the brief
  dependency chain explicitly blocks Step 12 on Step 11 per STEP_LEDGER.
```

### §4.3 — Handling honest ambiguity

If a session authentically cannot commit because native input is required, its next-objective
block states: "Committed: wait for native decision on <X>. Upon decision, the session that
opens next commits to one of <Y1> or <Y2>; the menu is enumerated in `### Deferred
alternatives` below." This is a committed next-objective ("wait"), not a menu. The deferred
alternatives describe the post-decision branch and never the pre-decision branch.

---

## §5 — SESSION_LOG header banner

`00_ARCHITECTURE/SESSION_LOG.md` carries a schema banner at its top (between the existing
title and the first entry) naming this file:

```
<!-- SCHEMA BANNER — installed at Step 10 close 2026-04-24 -->
*Entry schema: `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md`. Post-adoption entries (below
the `---` rule marked "# Schema adoption point (Step 10 close, 2026-04-24)") conform to
§2 of the schema. Historical entries above the rule are preserved verbatim per the schema's
retrofit policy (§6). Machine validation: `platform/scripts/governance/schema_validator.py`
`validate_session_log_entries()` (added in Step 10).*
<!-- END SCHEMA BANNER -->
```

A horizontal rule marks the adoption point. The rule is literal — three hyphens inside a
markdown horizontal-rule block — labelled on its following line as the "Schema adoption
point":

```
---

# Schema adoption point (Step 10 close, 2026-04-24)

*Entries below this line conform to `SESSION_LOG_SCHEMA_v1_0.md §2`.*
```

The rule is inserted immediately before the Step 10 session's own `## STEP_10_SESSION_LOG_SCHEMA`
entry. That entry is the first post-adoption entry (self-test per brief §5 discipline rule).

---

## §6 — Retrofit policy

### §6.1 — Forward-only retrofit

Historical entries are NOT rewritten. Rationale:

1. The entries are append-only historical record; rewriting is a form of silent mutation the
   drift detector cannot audit (a rewritten past is a form of unauthored revisionism).
2. The information loss is zero — the schema applies forward; historical entries are read as
   they were authored. Readers that want schema-conformant entries read entries below the
   horizontal rule.
3. Attempting retrofit within Step 10 scope conflicts with brief §4 constraint: "Do NOT
   rewrite any historical SESSION_LOG entries. Retrofit is forward-only."

### §6.2 — Cross-schema citation

When a downstream artifact cites a pre-adoption entry (e.g., "per SESSION_LOG entry
GAP_RESOLUTION_SESSION"), the citation uses the entry's as-authored session_id even though
that ID does not conform to §1.1. This is not a finding; the citation references what
exists, not what a hypothetical retrofit would have produced.

### §6.3 — Schema upgrades

A later schema (v1.1, v2.0, ...) may make further refinements. Any such upgrade follows the
same retrofit rule: forward-only, with a new adoption-point horizontal rule. The SESSION_LOG
then has N+1 sections separated by N horizontal rules (pre-v1.0 → v1.0 → v1.1 → ...), each
following the schema current at the time of its authoring.

---

## §7 — Schema validator integration

`platform/scripts/governance/schema_validator.py` carries (post-Step-10) a
`validate_session_log_entries()` function and an `artifact_schemas.yaml` class
`session_log_entry` that together enforce §2 structural presence on every post-adoption
entry. The validator:

1. Locates the adoption-point horizontal rule by its literal marker `# Schema adoption
   point` (§5).
2. For each subsequent `## ` heading, parses the entry as §2.a–§2.g.
3. Verifies that the §2.b `session_open` YAML block and §2.e `session_close` YAML block
   exist, parse, and carry the required fields from `SESSION_OPEN_TEMPLATE §2` and
   `SESSION_CLOSE_TEMPLATE §2` respectively.
4. Verifies that the heading's `<session_id>` matches the `session_open.session_id` and
   `session_close.session_id`.
5. Verifies that the entry ends with one `### Next session objective` block (menu-form
   detected by presence of "Choose from" or a bulleted list of multiple committed
   objectives — HIGH-severity violation per §4).

Violations follow the severity taxonomy of the integrity protocol (§I.4). Structural absence
of §2.b or §2.e is CRITICAL; menu-form next-objective is HIGH; missing entry terminator
(§2.g) is LOW (informational only).

The validator does NOT enforce content quality — the body (§2.c) can say anything short of
schema violation; the validator cannot (and is not asked to) judge whether the narrative
corresponds to the YAML.

---

## §8 — Red-team self-check

The schema has been tested against every session-class it must support:

- **Rebuild-era step sessions** (Steps 0 – 9 historically; Step 10 self-test going forward)
  — §1.1 row 1 + §2 blocks map cleanly onto the STEP_7/8/9 entries already in the log; the
  only missing element was the explicit horizontal-rule adoption boundary, which §5 + §6
  install.
- **Post-rebuild macro-phase sessions** (forward-only; first will be the session that opens
  M2.B.3 or equivalent after Step 15 closes) — §1.1 row 2 + §2 blocks compose; the
  `session_open.step_number_or_macro_phase` field carries `M2.B.3` rather than `STEP_10`, but
  the entry structure is identical.
- **Post-rebuild corrective fix sessions** — §1.1 row 3 continues the pre-rebuild `FIX_NNN`
  counter; §2 blocks compose the same way; the `session_open.predecessor_session` field
  cites whatever session authored the artifact being fixed.
- **Ad-hoc / audit / amendment sessions** — §1.1 row 4 accepts descriptive-slug IDs; §2
  blocks compose; the `session_open.step_number_or_macro_phase` field is null or `n/a`.
- **Historical legacy entries** — §1.2 preserves them; §6 forbids retrofit. The validator
  (§7) bypasses entries above the adoption-point rule.

One ambiguous case the self-check surfaced: a session that is formally part of the
governance rebuild (e.g., Step 5A insertion on 2026-04-23) but was itself a *ledger amendment*
rather than a step execution. §1.1 row 1 accommodates `STEP_5A_...` (hence the "exception: 5A"
clause in the table's Notes cell); the §2 structure applies unchanged; the body (§2.c)
declares the amendment nature. No schema defect.

**One disagreement-risk** surfaced: if a post-adoption entry's `session_open.session_id`
conflicts with its heading, which wins? Ruling: the heading is canonical for human reading;
the YAML is canonical for machine reading; **they must agree** (§1.4), and disagreement is a
schema violation (HIGH) that the validator catches. The author is responsible for keeping
them synchronized.

---

## §9 — Relationship to CURRENT_STATE_v1_0.md (Step 10 sibling deliverable)

`CURRENT_STATE_v1_0.md` is the state-surface counterpart to this schema. It answers the
question "where are we now?" in one machine-readable YAML file, updated at every session
close. The session-close checklist's `current_state_updated: true` field (which becomes
required post-Step-15 per `SESSION_CLOSE_TEMPLATE §4`) affirms the update happened.

Together, the pair closes GA.17–GA.19:

- **GA.17** (session naming inconsistency) — fixed by §1 of THIS schema.
- **GA.18** (multi-option next-objective) — fixed by §4 of THIS schema.
- **GA.19** (you-are-here marker) — partially fixed by STEP_LEDGER during the rebuild;
  fully fixed by CURRENT_STATE_v1_0.md post-Step-15.

---

*End of SESSION_LOG_SCHEMA_v1_0.md — Step 10 of the Step 0 → Step 15 governance rebuild —
2026-04-24.*
