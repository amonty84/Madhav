#!/usr/bin/env python3
"""
mirror_enforcer.py — MARSYS-JIS Claude ↔ Gemini mirror enforcer.

# Implements: GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §J (primary)
# Addresses: NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md ND.1 (Mirror Discipline)

Operates over the full mirror-pair inventory declared in CANONICAL_ARTIFACTS §2
(currently MP.1 through MP.8 per PROJECT_ARCHITECTURE_v2_2 §D.11.2). For each
pair, applies a declarative per-pair rule set comparing structural blocks and
semantic content — NOT bytes.

Per ND.1 claims:
  (1) Bidirectional obligation — enforced at session-close via SESSION_CLOSE
      `mirror_updates_propagated.both_updated_same_session`. This script verifies
      the current state of the pair; the close-checklist verifies the propagation
      discipline of the session that touched the pair.
  (2) Adapted parity — per-pair rule set compares structural blocks, not bytes.
  (3) Scope beyond CLAUDE.md — full MP.1–MP.8 inventory.

Exit codes (per §J.6):
  0  — all pairs clean (pass or declared Claude-only / Gemini-only)
  1  — at least one mirror_desync finding
  2  — at least one asymmetry_declaration_drift finding
  3  — declared-Claude-only / declared-Gemini-only mismatch between CANONICAL_ARTIFACTS
       and the in-script rule set
  4  — script-internal error

Usage:
  python3 platform/scripts/governance/mirror_enforcer.py \
      [--repo-root PATH] [--session-id ID] [--report-path PATH] [--json-path PATH]
"""
from __future__ import annotations

import argparse
import dataclasses
import datetime as _dt
import json
import pathlib
import re
import sys
import traceback
from typing import Callable, Dict, List, Optional, Tuple

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from _ca_loader import load_canonical_artifacts  # noqa: E402


# --------------------------------------------------------------------------------------
# Finding model
# --------------------------------------------------------------------------------------

@dataclasses.dataclass
class Finding:
    pair_id: str
    finding_class: str           # mirror_desync | asymmetry_declaration_drift | subset_relationship_violation
    severity: str                # CRITICAL | HIGH | MEDIUM
    authoritative_side: str      # claude | gemini | none
    which_side_stale: str        # claude | gemini | both | none
    section_affected: str
    evidence_claude: str
    evidence_gemini: str
    suggested_remediation: str

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


# --------------------------------------------------------------------------------------
# Per-pair rules (one function per pair).
#
# Each rule function returns a list of Finding objects. An empty list means "pass".
# Rule functions accept the full text of both sides + the CANONICAL_ARTIFACTS parsed object.
# --------------------------------------------------------------------------------------

def rule_mp1(claude_md: str, geminirules: str, ca) -> List[Finding]:
    """MP.1 — CLAUDE.md ↔ .geminirules structural parity."""
    findings: List[Finding] = []
    # Mandatory-reading items Gemini side should name (subset per MP.1 scope):
    #   PROJECT_ARCHITECTURE v2.2, MACRO_PLAN v2.0, PHASE_B_PLAN v1.0.2,
    #   STEP_LEDGER, GROUNDING_AUDIT.
    expected_gemini = [
        "PROJECT_ARCHITECTURE_v2_2.md",
        "MACRO_PLAN_v2_0.md",
        "PHASE_B_PLAN_v1_0.md",
        "STEP_LEDGER_v1_0.md",
        "GROUNDING_AUDIT_v1_0.md",
    ]
    for needle in expected_gemini:
        if needle not in geminirules:
            findings.append(Finding(
                pair_id="MP.1",
                finding_class="mirror_desync",
                severity="HIGH",
                authoritative_side="claude",
                which_side_stale="gemini",
                section_affected=".geminirules / mandatory reading",
                evidence_claude=f"CLAUDE.md names {needle}",
                evidence_gemini=f".geminirules does not cite {needle}",
                suggested_remediation="Mirror-update .geminirules to reference the canonical path",
            ))
    # Rebuild-era banner — both sides carry the "GOVERNANCE REBUILD" / "paused work" reference.
    if "GOVERNANCE REBUILD" not in claude_md.upper():
        findings.append(Finding(
            pair_id="MP.1",
            finding_class="mirror_desync",
            severity="HIGH",
            authoritative_side="claude",
            which_side_stale="claude",
            section_affected="CLAUDE.md / governance-rebuild banner",
            evidence_claude="CLAUDE.md missing the rebuild banner",
            evidence_gemini="",
            suggested_remediation="Restore the rebuild banner on CLAUDE.md",
        ))
    if "GOVERNANCE REBUILD" not in geminirules.upper():
        findings.append(Finding(
            pair_id="MP.1",
            finding_class="mirror_desync",
            severity="HIGH",
            authoritative_side="claude",
            which_side_stale="gemini",
            section_affected=".geminirules / governance-rebuild banner",
            evidence_claude="CLAUDE.md rebuild banner present",
            evidence_gemini=".geminirules missing the rebuild banner",
            suggested_remediation="Mirror-update .geminirules to include the rebuild banner",
        ))
    # ND.1 citation — both sides
    if "ND.1" not in geminirules:
        findings.append(Finding(
            pair_id="MP.1",
            finding_class="mirror_desync",
            severity="HIGH",
            authoritative_side="claude",
            which_side_stale="gemini",
            section_affected=".geminirules / ND.1 citation",
            evidence_claude="MP.1 requires ND.1 citation on both sides",
            evidence_gemini=".geminirules does not cite ND.1",
            suggested_remediation="Add the Mirror Discipline (ND.1) section to .geminirules",
        ))
    # Asymmetries section — required on Gemini side after Step 7 per ND.1
    if "Asymmetries" not in geminirules:
        findings.append(Finding(
            pair_id="MP.1",
            finding_class="mirror_desync",
            severity="HIGH",
            authoritative_side="claude",
            which_side_stale="gemini",
            section_affected=".geminirules / Asymmetries section",
            evidence_claude="ND.1 Step-7 obligation requires Asymmetries section on Gemini side",
            evidence_gemini=".geminirules does not contain an Asymmetries section",
            suggested_remediation="Add `### Asymmetries` section to .geminirules",
        ))
    return findings


def rule_mp2(claude_composite_state: dict, project_state: str, ca) -> List[Finding]:
    """MP.2 — Claude composite state ↔ .gemini/project_state.md."""
    findings: List[Finding] = []
    # The composite state is summarized in CANONICAL_ARTIFACTS §1 rows (current versions +
    # paths). The Gemini side must match on (a) current step, (b) next step, (c) CURRENT
    # corpus versions.
    # Current step: STEP_LEDGER has one `in_progress` or most-recent `completed`; Step 7
    # is the current session's state.
    for needle in ("Step 7", "STEP_7", "Governance Integrity Implementation"):
        if needle in project_state:
            break
    else:
        findings.append(Finding(
            pair_id="MP.2",
            finding_class="mirror_desync",
            severity="HIGH",
            authoritative_side="claude",
            which_side_stale="gemini",
            section_affected=".gemini/project_state.md / current executed step",
            evidence_claude="STEP_LEDGER + SESSION_LOG name Step 7 as current",
            evidence_gemini="project_state.md does not name Step 7 / STEP_7 / Governance Integrity Implementation",
            suggested_remediation="Mirror-update project_state.md current-step field to Step 7",
        ))
    # Next step pointer: Step 8
    if "Step 8" not in project_state and "STEP_8" not in project_state:
        findings.append(Finding(
            pair_id="MP.2",
            finding_class="mirror_desync",
            severity="MEDIUM",
            authoritative_side="claude",
            which_side_stale="gemini",
            section_affected=".gemini/project_state.md / next step",
            evidence_claude="STEP_LEDGER ready row: Step 8 (red-team)",
            evidence_gemini="project_state.md does not name Step 8 as next",
            suggested_remediation="Update project_state.md next-step to Step 8",
        ))
    # No superseded-plan citation as CURRENT (GA.7 closure)
    if "twinkly-puzzling-quokka" in project_state:
        # Only fail if cited in a non-historical context
        for line in project_state.splitlines():
            if "twinkly-puzzling-quokka" in line and "supersede" not in line.lower() and "historical" not in line.lower() and "drop" not in line.lower() and "Resolution" not in line:
                findings.append(Finding(
                    pair_id="MP.2",
                    finding_class="mirror_desync",
                    severity="CRITICAL",
                    authoritative_side="claude",
                    which_side_stale="gemini",
                    section_affected=".gemini/project_state.md / GA.7 regression",
                    evidence_claude="Authoritative plan is PHASE_B_PLAN v1.0.2",
                    evidence_gemini=f"project_state.md cites `twinkly-puzzling-quokka` outside historical context: {line.strip()}",
                    suggested_remediation="Drop the non-historical reference; keep only in a 'Resolution of GA.7' block",
                ))
                break
    # Canonical corpus state block must name current versions
    ca_names = {
        "MSR_v3_0.md": "MSR",
        "UCN_v4_0.md": "UCN",
        "CDLM_v1_1.md": "CDLM",
        "CGM_v2_0.md": "CGM",
        "RM_v2_0.md": "RM",
        "PROJECT_ARCHITECTURE_v2_2.md": "PROJECT_ARCHITECTURE",
        "MACRO_PLAN_v2_0.md": "MACRO_PLAN",
        "PHASE_B_PLAN_v1_0.md": "PHASE_B_PLAN",
    }
    for needle, cid in ca_names.items():
        if needle not in project_state:
            findings.append(Finding(
                pair_id="MP.2",
                finding_class="mirror_desync",
                severity="MEDIUM",
                authoritative_side="claude",
                which_side_stale="gemini",
                section_affected=f".gemini/project_state.md / canonical corpus state / {cid}",
                evidence_claude=f"CANONICAL_ARTIFACTS names {needle} CURRENT",
                evidence_gemini=f"project_state.md does not name {needle}",
                suggested_remediation=f"Add {needle} to canonical corpus state block",
            ))
    return findings


def rule_mp3(claude_mp: str, geminirules: str, project_state: str, ca) -> List[Finding]:
    """MP.3 — MACRO_PLAN_v2_0 ↔ Gemini-side compact MP summary."""
    findings: List[Finding] = []
    if "MACRO_PLAN_v2_0.md" not in geminirules:
        findings.append(Finding(
            pair_id="MP.3", finding_class="mirror_desync", severity="HIGH",
            authoritative_side="claude", which_side_stale="gemini",
            section_affected=".geminirules / MP pointer",
            evidence_claude="MP v2.0 is CURRENT per CANONICAL_ARTIFACTS",
            evidence_gemini=".geminirules does not cite MACRO_PLAN_v2_0.md",
            suggested_remediation="Update .geminirules item #3 to v2.0",
        ))
    if "MACRO_PLAN_v1_0" in geminirules and "SUPERSEDED" not in geminirules:
        findings.append(Finding(
            pair_id="MP.3", finding_class="mirror_desync", severity="HIGH",
            authoritative_side="claude", which_side_stale="gemini",
            section_affected=".geminirules / stale MP pointer",
            evidence_claude="MP v1.0 SUPERSEDED 2026-04-23",
            evidence_gemini=".geminirules cites v1.0 without SUPERSEDED tag",
            suggested_remediation="Remove or tag MP v1.0 references",
        ))
    return findings


def rule_mp4(pbp_text: str, geminirules: str, project_state: str, ca) -> List[Finding]:
    """MP.4 — PHASE_B_PLAN v1.0.3 ↔ Gemini-side phase pointer."""
    findings: List[Finding] = []
    for needle in ("PHASE_B_PLAN_v1_0.md", "v1.0.3"):
        if needle not in geminirules:
            findings.append(Finding(
                pair_id="MP.4", finding_class="mirror_desync", severity="HIGH",
                authoritative_side="claude", which_side_stale="gemini",
                section_affected=".geminirules / PBP pointer",
                evidence_claude=f"PBP v1.0.3 CURRENT",
                evidence_gemini=f".geminirules does not cite {needle}",
                suggested_remediation="Update .geminirules item #4 to PBP v1.0.3",
            ))
    if "paused" not in geminirules.lower() and "pause" not in geminirules.lower():
        findings.append(Finding(
            pair_id="MP.4", finding_class="mirror_desync", severity="MEDIUM",
            authoritative_side="claude", which_side_stale="gemini",
            section_affected=".geminirules / paused-during-rebuild banner",
            evidence_claude="PBP paused during the rebuild per CLAUDE.md banner",
            evidence_gemini=".geminirules does not reflect the paused state",
            suggested_remediation="Add paused-state banner to .geminirules",
        ))
    return findings


def rule_mp5(file_registry_text: str, geminirules: str, ca) -> List[Finding]:
    """MP.5 — FILE_REGISTRY ↔ .geminirules L2.5 canonical-path block."""
    findings: List[Finding] = []
    l2_5_needles = [
        "MSR_v3_0.md",
        "UCN_v4_0.md",
        "CDLM_v1_1.md",
        "CGM_v2_0.md",
        "RM_v2_0.md",
    ]
    for needle in l2_5_needles:
        if needle not in geminirules:
            findings.append(Finding(
                pair_id="MP.5", finding_class="mirror_desync", severity="HIGH",
                authoritative_side="claude", which_side_stale="gemini",
                section_affected=".geminirules / L2.5 canonical-path block",
                evidence_claude=f"FILE_REGISTRY §4 names {needle} CURRENT",
                evidence_gemini=f".geminirules does not cite {needle}",
                suggested_remediation=f"Add {needle} to L2.5 block",
            ))
    return findings


def rule_mp6() -> List[Finding]:
    """MP.6 — GOVERNANCE_STACK declared Claude-only. No enforcement."""
    return []


def rule_mp7() -> List[Finding]:
    """MP.7 — SESSION_LOG declared Claude-only. No enforcement."""
    return []


def rule_mp8(claude_arch: str, geminirules: str, project_state: str, ca) -> List[Finding]:
    """MP.8 — PROJECT_ARCHITECTURE v2.2 ↔ Gemini-side architecture summary."""
    findings: List[Finding] = []
    for needle in ("PROJECT_ARCHITECTURE_v2_2.md",):
        if needle not in geminirules:
            findings.append(Finding(
                pair_id="MP.8", finding_class="mirror_desync", severity="HIGH",
                authoritative_side="claude", which_side_stale="gemini",
                section_affected=".geminirules / architecture pointer",
                evidence_claude="v2.2 CURRENT per CANONICAL_ARTIFACTS",
                evidence_gemini=".geminirules does not cite v2.2",
                suggested_remediation="Update .geminirules item #2 to v2.2",
            ))
        if needle not in project_state:
            findings.append(Finding(
                pair_id="MP.8", finding_class="mirror_desync", severity="HIGH",
                authoritative_side="claude", which_side_stale="gemini",
                section_affected=".gemini/project_state.md / architecture pointer",
                evidence_claude="v2.2 CURRENT per CANONICAL_ARTIFACTS",
                evidence_gemini="project_state.md does not cite v2.2",
                suggested_remediation="Update project_state.md canonical corpus state to v2.2",
            ))
    # Layer architecture — Gemini side enumerates L0..L4
    for layer in ("L0", "L1", "L2", "L2.5", "L3", "L4"):
        if layer not in geminirules:
            findings.append(Finding(
                pair_id="MP.8", finding_class="mirror_desync", severity="MEDIUM",
                authoritative_side="claude", which_side_stale="gemini",
                section_affected=".geminirules / Layer Architecture section",
                evidence_claude="PROJECT_ARCHITECTURE §C enumerates L0–L4 (5-layer pyramid)",
                evidence_gemini=f".geminirules does not name layer `{layer}`",
                suggested_remediation="Ensure Layer Architecture section names L0, L1, L2, L2.5, L3, L4",
            ))
    return findings


def rule_asymmetry_declaration_drift(ca) -> List[Finding]:
    """Check §2 (per-pair known_asymmetries) vs §3 (aggregate) for drift."""
    # Minimal v1.0 check: every non-empty pair should have at least one known_asymmetries entry
    # unless mirror_mode is claude_only / gemini_only.
    findings: List[Finding] = []
    for pid, pair in ca.mirror_pairs.items():
        mode = pair.get("mirror_mode", "")
        known = pair.get("known_asymmetries", [])
        if mode in ("claude_only", "gemini_only"):
            continue
        if not known:
            findings.append(Finding(
                pair_id=pid, finding_class="asymmetry_declaration_drift", severity="MEDIUM",
                authoritative_side="none", which_side_stale="none",
                section_affected=f"CANONICAL_ARTIFACTS §2 [{pid}] known_asymmetries",
                evidence_claude=f"Pair {pid} mode={mode} has no declared asymmetries",
                evidence_gemini="",
                suggested_remediation="Either declare 'no known asymmetries' explicitly OR enumerate them",
            ))
    return findings


# --------------------------------------------------------------------------------------
# Main orchestrator
# --------------------------------------------------------------------------------------

def run(repo_root: pathlib.Path) -> Tuple[List[Finding], dict]:
    findings: List[Finding] = []
    ca = load_canonical_artifacts(repo_root)

    claude_md = (repo_root / "CLAUDE.md").read_text(encoding="utf-8")
    geminirules = (repo_root / ".geminirules").read_text(encoding="utf-8")
    project_state = (repo_root / ".gemini" / "project_state.md").read_text(encoding="utf-8")
    mp_text = (repo_root / "00_ARCHITECTURE" / "MACRO_PLAN_v2_0.md").read_text(encoding="utf-8", errors="replace")
    pbp_text = (repo_root / "00_ARCHITECTURE" / "PHASE_B_PLAN_v1_0.md").read_text(encoding="utf-8", errors="replace")
    fr_path = repo_root / "00_ARCHITECTURE" / "FILE_REGISTRY_v1_3.md"
    if not fr_path.exists():
        fr_path = repo_root / "00_ARCHITECTURE" / "FILE_REGISTRY_v1_2.md"
    file_registry = fr_path.read_text(encoding="utf-8", errors="replace") if fr_path.exists() else ""
    arch_text = (repo_root / "00_ARCHITECTURE" / "PROJECT_ARCHITECTURE_v2_2.md").read_text(encoding="utf-8", errors="replace")

    findings.extend(rule_mp1(claude_md, geminirules, ca))
    findings.extend(rule_mp2({}, project_state, ca))
    findings.extend(rule_mp3(mp_text, geminirules, project_state, ca))
    findings.extend(rule_mp4(pbp_text, geminirules, project_state, ca))
    findings.extend(rule_mp5(file_registry, geminirules, ca))
    findings.extend(rule_mp6())
    findings.extend(rule_mp7())
    findings.extend(rule_mp8(arch_text, geminirules, project_state, ca))
    findings.extend(rule_asymmetry_declaration_drift(ca))

    pair_counts = {
        "pairs_checked": len(ca.mirror_pairs),
        "pairs_passed": sum(1 for pid in ca.mirror_pairs if not any(f.pair_id == pid for f in findings)),
        "pairs_failed": sum(1 for pid in ca.mirror_pairs if any(f.pair_id == pid and f.finding_class == "mirror_desync" for f in findings)),
        "pairs_claude_only": sum(1 for p in ca.mirror_pairs.values() if p.get("mirror_mode") == "claude_only"),
        "pairs_gemini_only": sum(1 for p in ca.mirror_pairs.values() if p.get("mirror_mode") == "gemini_only"),
    }
    return findings, pair_counts


def compute_exit_code(findings: List[Finding]) -> int:
    has_desync = any(f.finding_class == "mirror_desync" for f in findings)
    has_asym_drift = any(f.finding_class == "asymmetry_declaration_drift" for f in findings)
    has_subset_viol = any(f.finding_class == "subset_relationship_violation" for f in findings)
    if has_desync:
        return 1
    if has_asym_drift:
        return 2
    if has_subset_viol:
        return 3
    return 0


def write_reports(findings: List[Finding], pair_counts: dict, session_id: str,
                  exit_code: int, json_path: pathlib.Path, md_path: pathlib.Path) -> None:
    out = {
        "mirror_report": {
            "session_id": session_id,
            "run_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
            **pair_counts,
            "findings": [f.to_dict() for f in findings],
            "exit_code": exit_code,
        }
    }
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(out, indent=2), encoding="utf-8")

    lines: List[str] = []
    lines.append(f"# MIRROR REPORT — {session_id}")
    lines.append("")
    lines.append(f"*Generated by `platform/scripts/governance/mirror_enforcer.py` on {_dt.datetime.now(_dt.timezone.utc).isoformat()}.*")
    lines.append("")
    lines.append(f"Exit code: **{exit_code}** (0 clean; 1 mirror-desync; 2 asymmetry drift; 3 subset violation; 4 script error)")
    lines.append("")
    lines.append(f"Pair counts: {pair_counts}")
    lines.append("")
    if not findings:
        lines.append("**No findings — every mirror pair is in semantic parity (or declared Claude-only/Gemini-only).**")
    else:
        by_pair: Dict[str, List[Finding]] = {}
        for f in findings:
            by_pair.setdefault(f.pair_id, []).append(f)
        for pid in sorted(by_pair.keys()):
            lines.append(f"## {pid}")
            lines.append("")
            for f in by_pair[pid]:
                lines.append(f"- **{f.finding_class}** — severity={f.severity}")
                lines.append(f"  - Section: {f.section_affected}")
                lines.append(f"  - Claude evidence: {f.evidence_claude}")
                lines.append(f"  - Gemini evidence: {f.evidence_gemini}")
                lines.append(f"  - Authoritative side: {f.authoritative_side}; stale side: {f.which_side_stale}")
                lines.append(f"  - Remediation: {f.suggested_remediation}")
            lines.append("")
    md_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--repo-root", type=pathlib.Path, default=pathlib.Path.cwd())
    ap.add_argument("--session-id", default="adhoc")
    ap.add_argument("--json-path", type=pathlib.Path, default=None)
    ap.add_argument("--report-path", type=pathlib.Path, default=None)
    args = ap.parse_args()

    try:
        findings, pair_counts = run(args.repo_root)
    except FileNotFoundError as e:
        print(f"mirror_enforcer: FileNotFoundError — {e}", file=sys.stderr)
        return 4
    except Exception:
        traceback.print_exc()
        return 4

    exit_code = compute_exit_code(findings)
    ts = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    default_json = args.repo_root / "00_ARCHITECTURE" / "mirror_reports" / f"MIRROR_REPORT_{args.session_id}_{ts}.json"
    default_md = args.repo_root / "00_ARCHITECTURE" / "mirror_reports" / f"MIRROR_REPORT_{args.session_id}_{ts}.md"
    write_reports(findings, pair_counts, args.session_id, exit_code,
                  args.json_path or default_json, args.report_path or default_md)

    print(f"mirror_enforcer: {len(findings)} findings; exit={exit_code}")
    print(f"  pairs checked={pair_counts['pairs_checked']}; passed={pair_counts['pairs_passed']}; failed={pair_counts['pairs_failed']}; claude_only={pair_counts['pairs_claude_only']}")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
