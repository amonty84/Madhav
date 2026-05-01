---
artifact: REDTEAM_M3A_v1_0.md
version: 1.0
status: CURRENT
authored_by: M3-W1-A2-PATTERN-ENGINE
authored_at: 2026-05-01
red_team_class: IS.8(a) every-third-session cadence
red_team_counter_at_fire: 3
session_at_fire: M3-W1-A2-PATTERN-ENGINE
scope: >
  This is the FIRST IS.8(a) cadence-fire in M3 (counter reset to 0 at M2 close;
  M3-W2-B1 +1 → 1, M3-W3-C1 +1 → 2, M3-W1-A1 governance-aside +0 → 2,
  M3-W1-A2 substantive +1 → 3). Per PHASE_M3_PLAN §3.1 AC.M3A.9 this is the
  expected first M3 IS.8(a) firing.

  Surface red-teamed: this session's flag-gate wiring of pattern_register,
  contradiction_register, resonance_register, cluster_atlas + the manifest
  entry_count fix-up. The M3-A *sub-phase-close* IS.8(b) macro-phase-style
  red-team (Pattern + Contradiction + Resonance + Cluster cross-tests against
  the synthesis prompt) is M3-A-S5/M3-W1-A4 scope; the synthesis prompt is
  must_not_touch in this session, so cross-fixture red-teaming on the
  composition path is out-of-scope here and deferred per AC.M3A.9.
verdict: PASS
findings: 0
fixes_applied: 0
---

# REDTEAM M3A v1.0 — IS.8(a) Cadence Fire (Flag-Gate Wiring)

## §1 — Scope

Red-team the flag-gate wiring shipped this session:

- `feature_flags.ts` — four new flags (`DISCOVERY_PATTERN_ENABLED`,
  `DISCOVERY_CONTRADICTION_ENABLED`, `DISCOVERY_RESONANCE_ENABLED`,
  `DISCOVERY_CLUSTER_ENABLED`).
- `pattern_register.ts` / `contradiction_register.ts` /
  `resonance_register.ts` / `cluster_atlas.ts` — flag gate at top of
  `retrieve()`, returning a disabled-bundle when off.
- `CAPABILITY_MANIFEST.json` — `tool_binding` field added to four register
  JSON entries; `entry_count` corrected `109 → 112`.

OUT OF SCOPE for this red-team:

- Synthesis-prompt amendments (A3 scope).
- Output-shape changes for retrieved chunks (no shape change shipped here).
- Cross-fixture eval-delta (gated on auth-secrets per
  `BASELINE_RUN_W9_MANUAL §6` KR.W9.1).

## §2 — Adversarial axes

### Axis A — Can the flag gate be bypassed?

**Claim under attack:** When `DISCOVERY_PATTERN_ENABLED=false`, the
pattern-register tool returns an empty bundle without touching the register
JSON file.

**Attack:** Read the register file via the storage client *before* the flag
check, e.g., via a side import or via a memoized read. Inspect
`pattern_register.ts` for any read above the `getFlag` line.

**Result:** PASS. The `getFlag('DISCOVERY_PATTERN_ENABLED')` check is the
**first** line of `retrieve()` (after `start = Date.now()`); the
`getStorageClient().readFile(REGISTER_PATH)` call happens only after the
gate. No top-level register reads. The same pattern holds for
contradiction / resonance / cluster.

### Axis B — Can a flag-true result silently mask flag-false governance?

**Claim under attack:** A future caller reading the bundle metadata can
distinguish "tool ran, found nothing" from "tool was skipped due to flag".

**Attack:** Inspect `disabledBundle.invocation_params`. Confirm a stable
machine-readable marker (`disabled: true`, `reason: '<FLAG>=false'`) plus an
empty `results` array.

**Result:** PASS. All four `disabledBundle` helpers set
`invocation_params.disabled = true` and
`invocation_params.reason = '<FLAG_NAME>=false'`. The flag-true path's
`invocation_params` does NOT carry these fields, so a downstream consumer
can branch on `params.disabled === true`.

### Axis C — Can env-overlay surprise the operator?

**Claim under attack:** Setting `MARSYS_FLAG_DISCOVERY_PATTERN_ENABLED=false`
in env overrides the now-default-true value to false, providing a clean
opt-out at runtime.

**Attack:** Inspect `config/index.ts` `loadEnvOverrides()`. Confirm the
`FLAG_ENV_PREFIX = 'MARSYS_FLAG_'` prefix + flag-name concat applies to the
new flags identically to existing flags.

**Result:** PASS. `loadEnvOverrides()` iterates `Object.keys(DEFAULT_FLAGS)`
which now includes the four new flags; env-string `'true' / 'false'` parsing
is identical. Operator opt-out path is preserved.

### Axis D — Manifest entry_count audit drift

**Claim under attack:** `entry_count: 112` matches `len(entries)`; no other
`entry_count` consumers expect `109`.

**Attack:** Grep the codebase for `entry_count` references; confirm no caller
hard-codes `109`.

**Result:** PASS. `manifest_query.ts` reads `manifest.entries` directly (no
`entry_count` consumption). `parity_validator.ts` and `manifest:validate-parity`
script paths are governance-side and re-derive from `entries.length`.
`CAPABILITY_MANIFEST` consumers documented in `manifest_query.ts` declare
the read shape; `entry_count` is informational metadata, not a load-bearing
counter.

### Axis E — Tool-binding semantics

**Claim under attack:** `tool_binding: 'pattern_register'` on the
PATTERN_REGISTER_JSON entry correctly identifies the consuming tool name as
registered in `RETRIEVAL_TOOLS`.

**Attack:** Cross-check the four `tool_binding` values against the four
`tool.name` constants in `pattern_register.ts` /
`contradiction_register.ts` / `resonance_register.ts` / `cluster_atlas.ts`.

**Result:** PASS. Verbatim matches: `pattern_register`,
`contradiction_register`, `resonance_register`, `cluster_atlas`.

### Axis F — B.10 (no-fabricated-computation) compliance

**Claim under attack:** This session writes no chart-numerical values
manufactured at L2.5+. All retrieved chunks trace to register-source files.

**Attack:** Inspect each retrieve() function for any synthesized numbers.

**Result:** PASS. Tools read JSON registers and emit chunks with passthrough
content from the register's `claim_text` / `mechanism` / `hypothesis_text`.
Derivations (`toNumericConfidence`, hash construction) are deterministic
formatting, not chart computation.

### Axis G — Layer-separation (B.1)

**Claim under attack:** The Pattern + Contradiction + Resonance + Cluster
registers are L3.5 surfaces; activating them at retrieval time does not move
L3.5 claims into L1 or vice versa.

**Attack:** Confirm `source_canonical_id` on emitted chunks ≠ `FORENSIC` /
`MSR` / `LEL` (i.e., not L1 IDs); the register identifiers are
`PATTERN_REGISTER` / `CONTRADICTION_REGISTER` / etc.

**Result:** PASS. All four tools set `source_canonical_id` to the register's
canonical ID; the L3.5 → L1 boundary is preserved.

## §3 — Smoke evidence

```
[pattern_register]       flag=false: results=0,  disabled=true  -> PASS
[pattern_register]       flag=true:  results=22                 -> PASS
[contradiction_register] flag=false: results=0,  disabled=true  -> PASS
[contradiction_register] flag=true:  results=8                  -> PASS
[resonance_register]     flag=false: results=0,  disabled=true  -> PASS
[resonance_register]     flag=true:  results=12                 -> PASS
[cluster_atlas]          flag=false: results=0,  disabled=true  -> PASS
[cluster_atlas]          flag=true:  results=12                 -> PASS

failures=0
```

(Reproducible via
`MARSYS_REPO_ROOT=/Users/Dev/Vibe-Coding/Apps/Madhav npx tsx --conditions=react-server platform/src/lib/retrieve/__smoke__/m3a2_discovery_flags.ts`.)

## §4 — Verdict

**PASS** — 7/7 axes, 0 findings, 0 fixes applied.

The flag-gate wiring is byte-clean, env-overlay-respecting, and bundle-shape-
preserving. The IS.8(b) sub-phase-close red-team (cross-fixture eval-delta
+ contradiction-framing model-behavior tests) remains scheduled at M3-A close
(M3-W1-A4) per AC.M3A.9 + PHASE_M3_PLAN §3.1.

## §5 — Counter state

- `red_team_counter_at_fire: 3`
- `red_team_counter_after: 0` (resets on IS.8(a) cadence fire per
  `ONGOING_HYGIENE_POLICIES §G`).
- Next IS.8(a) fire expected at counter=3 again, i.e., after three more
  substantive sessions.

---

*End of REDTEAM_M3A_v1_0.md.*
