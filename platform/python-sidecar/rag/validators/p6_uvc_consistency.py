"""
validators.p6_uvc_consistency
MARSYS-JIS RAG Pipeline — P6 UCN-vs-L3 consistency validator (PARTIAL IMPLEMENTATION).

PARTIAL-IMPL: This module implements the minimal surface required for B.4 CONTRADICTS
Pass-1 hypothesis generation (scan_ucn_vs_l3 -> list[ConflictFlag]). Full P6 enforcement
— gate validator with accept/reject fixtures and CI integration — is deferred to B.5
Session 3 (Exec_11) per PHASE_B_PLAN §H + §B.5 retroactive-review obligation.

Detection heuristics (keyword-level only; no semantic model):
  - direct_negation: antonym pairs (strengthens/weakens, before/after, increases/decreases)
  - magnitude_mismatch: magnitude scalar pairs (primary/secondary, dominant/minor)
  - mechanism_inversion: planetary-state inversions (dignified/debilitated, exalted/fallen)

Timing inconsistency detection is deferred to B.5 (requires ephemeris integration).
"""

from __future__ import annotations

import hashlib
import pathlib
import re
from dataclasses import dataclass

_PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent.parent
_UCN_PATH = _PROJECT_ROOT / "025_HOLISTIC_SYNTHESIS" / "UCN_v4_0.md"
_L3_REPORTS_DIR = _PROJECT_ROOT / "03_DOMAIN_REPORTS"

CURRENT_L3_REPORTS = [
    "REPORT_CAREER_DHARMA_v1_1.md",
    "REPORT_CHILDREN_v1_1.md",
    "REPORT_FINANCIAL_v2_1.md",
    "REPORT_HEALTH_LONGEVITY_v1_1.md",
    "REPORT_PARENTS_v1_1.md",
    "REPORT_PSYCHOLOGY_MIND_v1_1.md",
    "REPORT_RELATIONSHIPS_v1_1.md",
    "REPORT_SPIRITUAL_v1_1.md",
    "REPORT_TRAVEL_v1_1.md",
]

# Antonym pair sets — bidirectional. Each tuple means: if one appears near a planet/entity
# in UCN and the other appears near the same planet/entity in L3, flag conflict.
_ANTONYM_PAIRS: list[tuple[str, str]] = [
    ("strengthen", "weaken"),
    ("strengthens", "weakens"),
    ("strengthened", "weakened"),
    ("support", "undermine"),
    ("before", "after"),
    ("increases", "decreases"),
    ("rise", "fall"),
    ("favorable", "unfavorable"),
    ("benefic", "malefic"),
    ("positive", "negative"),
]

_MAGNITUDE_PAIRS: list[tuple[str, str]] = [
    ("primary", "secondary"),
    ("dominant", "minor"),
    ("central", "peripheral"),
    ("major", "negligible"),
    ("strongest", "weakest"),
    ("most significant", "least significant"),
]

_STATE_PAIRS: list[tuple[str, str]] = [
    ("dignified", "debilitated"),
    ("exalted", "fallen"),
    ("exalted", "debilitated"),
    ("own sign", "enemy sign"),
    ("friend", "enemy"),
    ("vargottama", "not vargottama"),
    ("functional benefic", "functional malefic"),
]

# Planets and significant entities to anchor pair-matching.
_ANCHOR_TERMS = [
    "Saturn", "Jupiter", "Mars", "Mercury", "Venus", "Sun", "Moon",
    "Rahu", "Ketu", "Lagna", "Moon", "Atmakaraka", "AK",
]

# UCN section heading patterns (two formats observed in UCN_v4_0.md).
_UCN_SECTION_PATTERN = re.compile(
    r"^### (?:§)?([IVX]+\.\d+|§[IVXLC]+\.\d+) — (.+)$"
)
_UCN_SECTION_PATTERN_ROMAN = re.compile(
    r"^### ([IVX]+\.\d+) — (.+)$"
)
_UCN_SECTION_PATTERN_PARA = re.compile(
    r"^### §([IVXLC]+\.\d+) — (.+)$"
)


@dataclass
class ConflictFlag:
    conflict_id: str            # sha256-truncated-12 of (ucn_section_id, l3_report_id, claim_excerpt)
    ucn_section_id: str         # UCN.SEC.<part>.<section>
    ucn_assertion_excerpt: str  # ≤200 chars
    l3_report_id: str           # REPORT_<DOMAIN>_v1_<NN>.md
    l3_claim_excerpt: str       # ≤200 chars
    conflict_type: str          # 'direct_negation' | 'magnitude_mismatch' | 'mechanism_inversion'
    severity_prior: str         # 'LOW' | 'MED' | 'HIGH' (Claude heuristic; Gemini adjudicates)


def _conflict_id(ucn_section_id: str, l3_report_id: str, claim_excerpt: str) -> str:
    seed = f"{ucn_section_id}|{l3_report_id}|{claim_excerpt[:50]}"
    return hashlib.sha256(seed.encode()).hexdigest()[:12]


def _parse_ucn_sections() -> list[tuple[str, str]]:
    """Return list of (ucn_section_id, section_text) pairs from UCN_v4_0.md."""
    if not _UCN_PATH.exists():
        return []

    lines = _UCN_PATH.read_text(encoding="utf-8").splitlines()
    sections: list[tuple[str, str]] = []
    current_id: str | None = None
    current_lines: list[str] = []

    for line in lines:
        m = _UCN_SECTION_PATTERN_ROMAN.match(line)
        if not m:
            m = _UCN_SECTION_PATTERN_PARA.match(line)
            if m:
                raw_id = m.group(1)
                section_id = f"UCN.SEC.{raw_id}"
            else:
                if current_id:
                    current_lines.append(line)
                continue
        else:
            raw_id = m.group(1)
            section_id = f"UCN.SEC.{raw_id}"

        if current_id:
            sections.append((current_id, "\n".join(current_lines[:40])))
        current_id = section_id
        current_lines = [line]

    if current_id:
        sections.append((current_id, "\n".join(current_lines[:40])))

    return sections


def _find_pair_conflicts(
    ucn_text: str,
    l3_text: str,
    pairs: list[tuple[str, str]],
    conflict_type: str,
    anchor_window: int = 60,
) -> list[tuple[str, str, str]]:
    """
    For each antonym/magnitude/state pair, check if both terms appear in the same
    context of the same anchor term in UCN vs L3. Returns list of
    (ucn_excerpt, l3_excerpt, severity).
    """
    results: list[tuple[str, str, str]] = []
    ucn_lower = ucn_text.lower()
    l3_lower = l3_text.lower()

    for term_a, term_b in pairs:
        a_in_ucn = term_a in ucn_lower
        b_in_ucn = term_b in ucn_lower
        a_in_l3 = term_a in l3_lower
        b_in_l3 = term_b in l3_lower

        # Tension: UCN says A, L3 says B (or vice versa)
        if (a_in_ucn and b_in_l3) or (b_in_ucn and a_in_l3):
            # Verify at least one anchor term is near both occurrences
            for anchor in _ANCHOR_TERMS:
                anchor_lc = anchor.lower()
                if anchor_lc not in ucn_lower or anchor_lc not in l3_lower:
                    continue

                # Check anchor-term proximity within UCN
                ucn_anchor_pos = ucn_lower.find(anchor_lc)
                ucn_term = term_a if a_in_ucn else term_b
                ucn_term_pos = ucn_lower.find(ucn_term)
                if abs(ucn_term_pos - ucn_anchor_pos) > anchor_window:
                    continue

                # Check anchor-term proximity within L3
                l3_anchor_pos = l3_lower.find(anchor_lc)
                l3_term = term_b if a_in_ucn else term_a
                l3_term_pos = l3_lower.find(l3_term)
                if abs(l3_term_pos - l3_anchor_pos) > anchor_window:
                    continue

                # Extract excerpts
                ucn_start = max(0, ucn_term_pos - 40)
                ucn_excerpt = ucn_text[ucn_start: ucn_term_pos + 80].replace("\n", " ").strip()[:200]
                l3_start = max(0, l3_term_pos - 40)
                l3_excerpt = l3_text[l3_start: l3_term_pos + 80].replace("\n", " ").strip()[:200]

                severity = "HIGH" if conflict_type == "mechanism_inversion" else "MED"
                results.append((ucn_excerpt, l3_excerpt, severity))
                break  # one anchor match per pair is sufficient

    return results


def scan_ucn_vs_l3() -> list[ConflictFlag]:
    """
    Read UCN_v4_0.md sections + 9 CURRENT v1.1 L3 reports.
    Return list of candidate conflicts where a UCN assertion and an L3 claim are in tension.

    Detection heuristics: keyword-matched antonyms, magnitude scalars, planetary-state
    inversions. Timing inconsistency detection deferred to B.5 (requires ephemeris).
    Documented as PARTIAL-IMPL; full P6 enforcement at B.5 Session 3 (Exec_11).
    """
    flags: list[ConflictFlag] = []
    ucn_sections = _parse_ucn_sections()
    if not ucn_sections:
        return flags

    for l3_filename in CURRENT_L3_REPORTS:
        l3_path = _L3_REPORTS_DIR / l3_filename
        if not l3_path.exists():
            continue
        l3_text = l3_path.read_text(encoding="utf-8")
        # Use first 8000 chars of L3 for performance (heuristic scan)
        l3_snippet = l3_text[:8000]

        for ucn_section_id, ucn_text in ucn_sections:
            pair_configs = [
                (_ANTONYM_PAIRS, "direct_negation"),
                (_MAGNITUDE_PAIRS, "magnitude_mismatch"),
                (_STATE_PAIRS, "mechanism_inversion"),
            ]
            for pairs, conflict_type in pair_configs:
                conflicts = _find_pair_conflicts(
                    ucn_text, l3_snippet, pairs, conflict_type
                )
                for ucn_excerpt, l3_excerpt, severity in conflicts:
                    cid = _conflict_id(ucn_section_id, l3_filename, l3_excerpt)
                    # Deduplicate by conflict_id
                    if any(f.conflict_id == cid for f in flags):
                        continue
                    flags.append(ConflictFlag(
                        conflict_id=cid,
                        ucn_section_id=ucn_section_id,
                        ucn_assertion_excerpt=ucn_excerpt,
                        l3_report_id=l3_filename,
                        l3_claim_excerpt=l3_excerpt,
                        conflict_type=conflict_type,
                        severity_prior=severity,
                    ))

    return flags
