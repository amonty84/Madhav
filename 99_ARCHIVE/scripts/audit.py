#!/usr/bin/env python3
"""Data Integrity Audit for the MARSYS-JIS (Madhav) corpus.

Scans claim-bearing markdown files for (a) historical error patterns and
(b) mismatches against the authoritative placements in v8.0 forensic data.

Design notes (v2 — addresses false-positive explosion in v1):
- Excludes meta/remediation docs (audit reports, falsifier registries, session
  logs, red-team passes, etc.) because by design they *enumerate* old errors
  in order to falsify them; counting those as live errors triple-counts them.
- Auto-excludes superseded versioned artifacts: if FOO_v1_0.md and FOO_v1_1.md
  both exist, only the highest version is scanned. v6.0 forensic data is
  archival per CLAUDE.md.
- Consistency check uses a bounded locality window around the key rather than
  scanning the whole line — a line like "Jupiter aspects Mars in Scorpio 8H"
  no longer misattributes Scorpio/8H to Jupiter.
- Skips lines with clear historical/negation markers
  (e.g. "FALSIFIED", "v6.0 said", "previously claimed", "corrected from",
  "NOT in ...", "removed").
"""

import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Tuple, Any

ROOT = Path.cwd()

# Directories never audited.
SKIP_DIRS = {
    ".git",
    "JHora",
    "platform/node_modules",
    "platform/.next",
    "platform/dist",
    "platform/build",
    "platform/out",
    "platform/python-sidecar/venv",
    "docs/superpowers",
}

# File exclusions (regex, matched against path relative to ROOT, case-insensitive).
# Two categories: binary/out-of-scope, and meta/remediation docs.
EXCLUDE_PATTERNS = [
    # Binary / non-claim
    r"\.csv$",
    r"\.(png|jpg|jpeg|gif|bmp|pdf|docx|xlsx|pptx)$",
    r"JHORA_TRANSCRIPTION",
    r"SADE_SATI_CYCLES_ALL\.md$",
    r"venv/",
    r"\.dist-info",
    r"~$",
    r"\.bak$",
    # Project-level instruction / prompt / bootstrap files
    r"(^|/)CLAUDE\.md$",
    r"(^|/)AGENTS\.md$",
    r"(^|/)README\.md$",
    r"(^|/)SESSION_RESUME_PROMPT\.md$",
    r"(^|/)MARSYS_JIS_BOOTSTRAP_HANDOFF\.md$",
    # The audit's own outputs
    r"(^|/)audit_report.*\.md$",
    r"(^|/)data_integrity_audit_report.*\.md$",
    r"(^|/)test(_.*)?\.md$",
    # Meta / remediation / red-team / falsifier / contradiction docs.
    # These enumerate past errors by design — scanning them is double-counting.
    r"00_ARCHITECTURE/AUDIT_REPORT",
    r"00_ARCHITECTURE/DATA_INTEGRITY_AUDIT",
    r"00_ARCHITECTURE/SESSION_LOG",
    r"00_ARCHITECTURE/FALSIFIER_REGISTRY",
    r"00_ARCHITECTURE/CONTRADICTION_REGISTRY",
    r"00_ARCHITECTURE/RECONCILIATION",
    r"00_ARCHITECTURE/V\d+_\d+_RECONCILIATION",
    r"00_ARCHITECTURE/PROJECT_WIDE_RED_TEAM",
    r"00_ARCHITECTURE/FIX_SESSION",
    r"00_ARCHITECTURE/MAINTENANCE_SCHEDULE",
    r"00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE",
    r"00_ARCHITECTURE/ACHARYA_ENGAGEMENT_KIT",
    r"00_ARCHITECTURE/EXTERNAL_ACHARYA_REVIEW",
    r"00_ARCHITECTURE/FILE_INDEX",
    r"00_ARCHITECTURE/GOVERNANCE_STACK",
    r"00_ARCHITECTURE/PROJECT_COMPLETION_DOSSIER",
    r"01_FACTS_LAYER/CGP_AUDIT",
    r"01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6",  # v6 archival per CLAUDE.md
    r"025_HOLISTIC_SYNTHESIS/RED_TEAM",
    r"03_DOMAIN_REPORTS/RED_TEAM",
    r"03_DOMAIN_REPORTS/CROSS_REPORT_COHERENCE_AUDIT",
    r"05_TEMPORAL_ENGINES/RED_TEAM",
    # Legacy named report superseded by REPORT_FINANCIAL_v2_x
    r"03_DOMAIN_REPORTS/FINANCIAL_REPORT_Abhisek_Mohanty\.md$",
    # Legacy DEEP_ANALYSIS superseded by matrix docs
    r"02_ANALYTICAL_LAYER/DEEP_ANALYSIS_",
    # Event/transit chart states — document planetary positions at event times,
    # not natal placements, so the natal authority doesn't apply.
    r"01_FACTS_LAYER/EVENT_CHART_STATES",
    r"01_FACTS_LAYER/LIFE_EVENT_LOG",
    r"01_FACTS_LAYER/EXTERNAL_COMPUTATION_SPEC",
    r"05_TEMPORAL_ENGINES/",  # transit/varshaphal heatmaps are event-timing, not natal
]

# Authoritative placements from FORENSIC_ASTROLOGICAL_DATA_v8_0.md
# key: (expected_house, expected_sign)
AUTHORITATIVE_PLACEMENTS = {
    "Jupiter":       ("9", "Sagittarius"),
    "Shree Lagna":   ("7", "Libra"),
    "Ghati Lagna":   ("9", "Sagittarius"),
    "Varnada Lagna": ("4", "Cancer"),
    "Hora Lagna":    ("3", "Gemini"),
    "Saham Roga":    ("2", "Taurus"),
    "Saham Mahatmya":("9", "Sagittarius"),
    "Saham Vivaha":  ("4", "Cancer"),
}

# Historical error phrases.  Written tightly to minimize false positives.
ERROR_PATTERNS = [
    (r"Jupiter\s+in\s+Cancer", "Jupiter placement error (should be Sagittarius 9H)"),
    (r"Jupiter[^.]{0,40}\b4H\b", "Jupiter placement error (should be Sagittarius 9H)"),
    (r"Jupiter[^.]{0,60}aspect[^.]{0,40}\b(10H|8H|12H)\b",
        "Jupiter aspect from wrong house (should be from 9H)"),
    (r"Shree\s+Lagna[^.]{0,40}\b9H\b", "Shree Lagna should be Libra 7H"),
    (r"Ghati\s+Lagna[^.]{0,40}\b8H\b", "Ghati Lagna should be Sagittarius 9H"),
    (r"Varnada\s+Lagna[^.]{0,40}\b8H\b", "Varnada Lagna should be Cancer 4H"),
    (r"Hora\s+Lagna[^.]{0,40}\b7H\b", "Hora Lagna should be Gemini 3H"),
    (r"Saham\s+Roga[^.]{0,40}\b7H\b", "Roga Saham should be Taurus 2H"),
    (r"Saham\s+Mahatmya[^.]{0,40}\b7H\b", "Mahatmya Saham should be Sagittarius 9H"),
    (r"Saham\s+Vivaha[^.]{0,40}\b3H\b", "Vivaha Saham should be Cancer 4H"),
    (r"hidden[\s-]*pinnacle", "Hidden pinnacle concept invalid; remove reference"),
    (r"Varnada[^.]{0,40}Ghati[^.]{0,40}\b8H\b",
        "Hidden pinnacle concept invalid; remove reference"),
]

# Line-level filters: if any of these appear, the line is treated as historical
# narration (documenting a corrected error), not a live claim.
HISTORICAL_MARKERS = [
    r"\bFALSIFIED\b", r"\bFALSIFY\b", r"\bINVALIDATED?\b",
    r"previously\s+claimed", r"previously\s+stated",
    r"v[0-9]+(?:[._][0-9]+)?\s+said",
    r"corrected\s+from", r"corrected\s+to",
    r"was\s+(?:claimed|stated|said)", r"used\s+to\s+(?:claim|state|say)",
    r"old\s+(?:claim|value)", r"\bstale\b", r"residual",
    r"should\s+be\b", r"must\s+be\b",
    # "NOT Libra 7H", "NOT in 4H", "NOT Sagittarius", etc.
    r"\b(?:NOT|no\s+longer)\s+(?:in\s+)?\d{1,2}H\b",
    r"\b(?:NOT|no\s+longer)\s+(?:Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)\b",
    r"erroneously", r"mistaken", r"incorrect",
    r"removed", r"deprecated", r"superseded",
    r"strike(?:through)?", r"~~",  # markdown strikethrough
    r"error[\s:-]",
    r"regex",  # lines defining regex patterns, not claims
]

# Skip lines where the only "placement-like" tokens are lord notation
# (e.g., "Jupiter as 9L", "9th lord").  A standalone NL / 9th lord is
# dispositor language, not placement.
LORD_NEAR_KEY_RE = re.compile(
    r"\b\d{1,2}\s*L\b|\bas\s+\d{1,2}L\b|\b\d{1,2}(?:st|nd|rd|th)\s+lord\b",
    re.IGNORECASE,
)

# Divisional-chart row: D2.LEO, D3.9, D9.JUPITER, etc.  Tenants listed in
# these rows are divisional placements, not D1 natal.
DIVISIONAL_ROW_RE = re.compile(r"\bD\d{1,2}\.[A-Z0-9_]+\b")

def should_exclude(path: Path) -> bool:
    try:
        rel = str(path.relative_to(ROOT))
    except ValueError:
        rel = str(path)
    for skip in SKIP_DIRS:
        if rel == skip or rel.startswith(skip + "/") or ("/" + skip + "/") in ("/" + rel):
            return True
    for pattern in EXCLUDE_PATTERNS:
        if re.search(pattern, rel, re.IGNORECASE):
            return True
    return False

VERSION_RE = re.compile(r"^(?P<stem>.+?)_v(?P<major>\d+)(?:_(?P<minor>\d+))?\.md$",
                       re.IGNORECASE)

def filter_superseded(paths: List[Path]) -> Tuple[List[Path], List[Path]]:
    """Keep only the highest version for each (directory, stem) pair.
    Returns (kept, dropped)."""
    groups: Dict[Tuple[str, str], List[Tuple[Tuple[int, int], Path]]] = defaultdict(list)
    singletons: List[Path] = []
    for p in paths:
        m = VERSION_RE.match(p.name)
        if not m:
            singletons.append(p)
            continue
        key = (str(p.parent), m.group("stem"))
        major = int(m.group("major"))
        minor = int(m.group("minor") or 0)
        groups[key].append(((major, minor), p))
    kept: List[Path] = list(singletons)
    dropped: List[Path] = []
    for key, versions in groups.items():
        versions.sort(reverse=True)
        kept.append(versions[0][1])
        dropped.extend(v[1] for v in versions[1:])
    return sorted(kept), sorted(dropped)

def discover_markdown_files(root: Path) -> Tuple[List[Path], List[Path]]:
    md_files: List[Path] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames
                       if not should_exclude(Path(dirpath) / d)]
        for fname in filenames:
            if fname.endswith(".md"):
                filepath = Path(dirpath) / fname
                if not should_exclude(filepath):
                    md_files.append(filepath)
    return filter_superseded(md_files)

def read_lines(filepath: Path) -> List[str]:
    try:
        return filepath.read_text(encoding="utf-8").splitlines()
    except UnicodeDecodeError:
        return filepath.read_text(encoding="latin-1").splitlines()

def is_historical_line(line: str, historical_res: List[re.Pattern]) -> bool:
    return any(r.search(line) for r in historical_res)

def scan_error_patterns(filepath: Path,
                        patterns: List[Tuple[re.Pattern, str]],
                        historical_res: List[re.Pattern]) -> List[Dict[str, Any]]:
    findings = []
    for i, line in enumerate(read_lines(filepath), start=1):
        if is_historical_line(line, historical_res):
            continue
        for regex, desc in patterns:
            if regex.search(line):
                findings.append({
                    "file": str(filepath.relative_to(ROOT)),
                    "line": i,
                    "match": line.strip()[:120],
                    "pattern": desc,
                })
                break
    return findings

SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra",
         "Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
SIGN_RE = re.compile(r"\b(" + "|".join(SIGNS) + r")\b", re.IGNORECASE)
HOUSE_RE = re.compile(r"\b(\d{1,2})H\b")

LOCALITY = 60  # chars around the key considered "attributed to" the key

def check_placement_consistency(filepath: Path,
                                historical_res: List[re.Pattern]
                                ) -> List[Dict[str, Any]]:
    findings = []
    for i, line in enumerate(read_lines(filepath), start=1):
        if is_historical_line(line, historical_res):
            continue
        stripped = line.lstrip()
        # Table rows and divisional-chart references are not natal claims.
        if stripped.startswith("|"):
            continue
        if DIVISIONAL_ROW_RE.search(line):
            continue
        for key, (exp_house, exp_sign) in AUTHORITATIVE_PLACEMENTS.items():
            key_re = re.compile(r"\b" + re.escape(key) + r"\b", re.IGNORECASE)
            for m in key_re.finditer(line):
                start = max(0, m.start() - LOCALITY)
                end   = min(len(line), m.end() + LOCALITY)
                window = line[start:end]
                # Lord-of-house references aren't placement claims.
                if LORD_NEAR_KEY_RE.search(window):
                    continue
                house_m = HOUSE_RE.search(window)
                sign_m  = SIGN_RE.search(window)
                found_house = house_m.group(1) if house_m else None
                found_sign  = sign_m.group(1).capitalize() if sign_m else None
                mismatch_exp, mismatch_found = [], []
                if found_house and found_house != exp_house:
                    mismatch_exp.append(f"{exp_house}H")
                    mismatch_found.append(f"{found_house}H")
                if found_sign and found_sign != exp_sign:
                    mismatch_exp.append(exp_sign)
                    mismatch_found.append(found_sign)
                if mismatch_exp:
                    findings.append({
                        "file": str(filepath.relative_to(ROOT)),
                        "line": i,
                        "key": key,
                        "expected": ", ".join(mismatch_exp),
                        "found": ", ".join(mismatch_found),
                        "context": line.strip()[:200],
                    })
                break  # one mismatch per key per line
    return findings

def generate_report(scanned: List[Path], dropped: List[Path],
                    errors: List[Dict[str, Any]],
                    inconsistencies: List[Dict[str, Any]],
                    output: Path) -> None:
    now = datetime.now().isoformat(timespec="seconds")
    errors_by_file: Dict[str, int] = defaultdict(int)
    for e in errors:
        errors_by_file[e["file"]] += 1
    incs_by_file: Dict[str, int] = defaultdict(int)
    for e in inconsistencies:
        incs_by_file[e["file"]] += 1

    with open(output, "w", encoding="utf-8") as f:
        f.write(f"# Data Integrity Audit Report — {now}\n\n")
        f.write("## Executive Summary\n")
        f.write(f"- Files scanned: {len(scanned)}\n")
        f.write(f"- Superseded versions auto-excluded: {len(dropped)}\n")
        f.write(f"- Error-pattern matches: {len(errors)}\n")
        f.write(f"- Cross-source inconsistencies: {len(inconsistencies)}\n\n")

        f.write("## Top Offending Files (error patterns)\n")
        for fname, n in sorted(errors_by_file.items(), key=lambda x: -x[1])[:20]:
            f.write(f"- `{fname}` — {n}\n")
        f.write("\n")

        f.write("## Top Offending Files (inconsistencies)\n")
        for fname, n in sorted(incs_by_file.items(), key=lambda x: -x[1])[:20]:
            f.write(f"- `{fname}` — {n}\n")
        f.write("\n")

        f.write("## 1. Inventory of Scanned Files\n")
        for p in scanned:
            f.write(f"- `{p.relative_to(ROOT)}`\n")
        f.write("\n")

        if dropped:
            f.write("## 1b. Superseded Files (auto-excluded)\n")
            for p in dropped:
                f.write(f"- `{p.relative_to(ROOT)}`\n")
            f.write("\n")

        if errors:
            f.write("## 2. Error-Pattern Matches\n")
            f.write("| File | Line | Match | Pattern |\n")
            f.write("|------|------|-------|---------|\n")
            for e in errors:
                safe = e["match"].replace("|", "\\|")
                f.write(f"| `{e['file']}` | {e['line']} | {safe} | {e['pattern']} |\n")
            f.write("\n")

        if inconsistencies:
            f.write("## 3. Cross-Source Inconsistencies\n")
            f.write("| Data Point | Expected | Found | File:Line |\n")
            f.write("|------------|----------|-------|-----------|\n")
            for e in inconsistencies:
                f.write(f"| {e['key']} | {e['expected']} | {e['found']} | `{e['file']}:{e['line']}` |\n")
            f.write("\n")

        f.write("## 4. Notes on Methodology\n")
        f.write("- Meta / remediation / red-team / falsifier / audit / session-log docs are excluded; by design they enumerate past errors to correct them.\n")
        f.write("- When multiple versions of the same artifact exist (e.g. `_v1_0.md` and `_v1_1.md`), only the highest is scanned.\n")
        f.write("- The consistency check uses a ±60-char locality window around each key, so multi-planet lines do not cross-contaminate.\n")
        f.write("- Lines with historical/negation markers (FALSIFIED, \"v6.0 said\", \"previously claimed\", \"corrected from\", \"NOT in Nh\", etc.) are skipped.\n")
        f.write(f"\n---\n*Generated by audit.py at {now}*\n")

def main():
    parser = argparse.ArgumentParser(description="Audit MARSYS-JIS corpus data integrity.")
    parser.add_argument("--path", default=".", help="Root directory to audit")
    parser.add_argument("--output", default="data_integrity_audit_report_v1_0.md",
                        help="Output report path")
    args = parser.parse_args()
    root = Path(args.path).resolve()
    if not root.exists():
        print(f"Error: path {root} does not exist.", file=sys.stderr)
        sys.exit(1)
    global ROOT
    ROOT = root

    print(f"Auditing {root}")
    scanned, dropped = discover_markdown_files(root)
    print(f"Scanning {len(scanned)} files ({len(dropped)} superseded versions excluded)")

    compiled_errors = [(re.compile(p, re.IGNORECASE), d) for p, d in ERROR_PATTERNS]
    historical_res = [re.compile(p, re.IGNORECASE) for p in HISTORICAL_MARKERS]

    all_errors, all_inconsistencies = [], []
    for p in scanned:
        all_errors.extend(scan_error_patterns(p, compiled_errors, historical_res))
        all_inconsistencies.extend(check_placement_consistency(p, historical_res))

    output = Path(args.output)
    generate_report(scanned, dropped, all_errors, all_inconsistencies, output)
    print(f"Report: {output}")
    print(f"  error-pattern matches:       {len(all_errors)}")
    print(f"  cross-source inconsistencies:{len(all_inconsistencies)}")

if __name__ == "__main__":
    main()
