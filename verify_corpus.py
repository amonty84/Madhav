#!/usr/bin/env python3
"""
AM-JIS Corpus Verification Orchestrator
========================================
Brain:   Claude Opus 4.7 (the session/you) — reads the findings report and decides what to fix
Workers: Claude Haiku 4.5 (default) or DeepSeek — classify suspicious passages cheaply

Architecture
------------
Phase 1 [PURE PYTHON, free]:
  1a. Extract authoritative ground truth from FORENSIC_ASTROLOGICAL_DATA_v8_0.md
  1b. Regex-scan all claim-bearing files → collect suspicious passages with context
  1c. Pure-Python MSR citation integrity check
  1d. Pure-Python L2 matrix spot-check against ground truth

Phase 2 [WORKER LLM, cheap]:
  2a. For each suspicious passage, call Haiku/DeepSeek to classify:
        LIVE_ERROR | HISTORICAL_DOC | REGEX_FP | CORRECT
  2b. Workers run concurrently (semaphore-limited) with prompt caching
  2c. Workers return structured JSON

Phase 3 [BRAIN, you]:
  3a. Script writes a prioritised JSON + Markdown findings report
  3b. You (Claude Opus) read the report and approve fixes

Usage
-----
  pip install anthropic
  python verify_corpus.py                          # Haiku workers (default)
  python verify_corpus.py --backend deepseek       # DeepSeek workers (needs DEEPSEEK_API_KEY)
  python verify_corpus.py --workers 10             # more concurrency
  python verify_corpus.py --dry-run                # skip API calls, show candidate count
"""

import asyncio
import json
import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Any, Tuple, Optional

# ── SDK imports ────────────────────────────────────────────────────────────────
import anthropic

# Optional: DeepSeek uses the OpenAI-compatible SDK
try:
    import openai as _openai_mod
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

# ── Configuration ──────────────────────────────────────────────────────────────

ROOT = Path.cwd()

WORKER_MODEL_ANTHROPIC = "claude-haiku-4-5"
WORKER_MODEL_DEEPSEEK   = "deepseek-chat"

# Files whose content IS the ground truth — don't check them for errors
AUTHORITATIVE_FILES = {
    "01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md",
}

# Files skipped entirely (meta/remediation/transit docs)
SKIP_PATTERNS = [
    r"00_ARCHITECTURE/(AUDIT_REPORT|DATA_INTEGRITY_AUDIT|SESSION_LOG|FALSIFIER|"
        r"CONTRADICTION|RECONCILIATION|RED_TEAM|FIX_SESSION|MAINTENANCE|"
        r"LIVING_PROJECT|ACHARYA_ENGAGEMENT|EXTERNAL_ACHARYA|FILE_INDEX|"
        r"GOVERNANCE_STACK|PROJECT_COMPLETION|PROJECT_WIDE_RED_TEAM)",
    r"01_FACTS_LAYER/(CGP_AUDIT|EVENT_CHART_STATES|LIFE_EVENT_LOG|EXTERNAL_COMPUTATION)",
    r"025_HOLISTIC_SYNTHESIS/RED_TEAM",
    r"03_DOMAIN_REPORTS/(RED_TEAM|CROSS_REPORT_COHERENCE_AUDIT)",
    r"05_TEMPORAL_ENGINES/",
    r"docs/",
    r"platform/",
    r"(^|/)CLAUDE\.md$",
    r"(^|/)AGENTS\.md$",
    r"(^|/)README\.md$",
    r"(^|/)SESSION_RESUME_PROMPT\.md$",
    r"(^|/)AM_JIS_BOOTSTRAP_HANDOFF\.md$",
    r"audit.*\.md$",
    r"verify.*\.md$",
    r"data_integrity_audit_report.*\.md$",
    r"test.*\.md$",
    r"\.git/",
]

# Auto-exclude older versions when newer exist (e.g., _v1_0 when _v1_1 exists)
VERSION_RE = re.compile(r"^(?P<stem>.+?)_v(?P<major>\d+)(?:_(?P<minor>\d+))?\.md$", re.I)

# Key MSR registry — source of truth for citation checks
MSR_REGISTRY_PATH = "025_HOLISTIC_SYNTHESIS/MSR_v2_0.md"

# ── Authoritative placements (extracted from forensic v8; hardcoded for robustness) ──

GROUND_TRUTH: Dict[str, Dict[str, str]] = {
    # D1 planet placements (rashi house)
    "Sun":       {"sign": "Capricorn",   "house": "10"},
    "Moon":      {"sign": "Aquarius",    "house": "11"},
    "Mars":      {"sign": "Libra",       "house": "7"},
    "Mercury":   {"sign": "Capricorn",   "house": "10"},
    "Jupiter":   {"sign": "Sagittarius", "house": "9"},
    "Venus":     {"sign": "Sagittarius", "house": "9"},
    "Saturn":    {"sign": "Libra",       "house": "7"},
    "Rahu":      {"sign": "Taurus",      "house": "2"},
    "Ketu":      {"sign": "Scorpio",     "house": "8"},
    # Special lagnas (v8.0 corrected values)
    "Hora Lagna":    {"sign": "Gemini",      "house": "3"},
    "Ghati Lagna":   {"sign": "Sagittarius", "house": "9"},
    "Varnada Lagna": {"sign": "Cancer",      "house": "4"},
    "Shree Lagna":   {"sign": "Libra",       "house": "7"},
    "Indu Lagna":    {"sign": "Scorpio",     "house": "8"},
    "Bhava Lagna":   {"sign": "Pisces",      "house": "12"},
    # Sahams
    "Saham Roga":     {"sign": "Taurus",      "house": "2"},
    "Saham Mahatmya": {"sign": "Sagittarius", "house": "9"},
    "Saham Vivaha":   {"sign": "Cancer",      "house": "4"},
}

# Old wrong values (v6.0 era) — a passage mentioning these may be historical, not an error
KNOWN_OLD_WRONG = {
    "Jupiter":       {"sign": "Cancer",   "house": "4"},
    "Hora Lagna":    {"sign": "Libra",    "house": "7"},
    "Ghati Lagna":   {"sign": "Scorpio",  "house": "8"},
    "Varnada Lagna": {"sign": "Scorpio",  "house": "8"},
    "Shree Lagna":   {"sign": "Sagittarius", "house": "9"},
    "Saham Roga":    {"sign": "Libra",    "house": "7"},
    "Saham Mahatmya":{"sign": "Libra",    "house": "7"},
    "Saham Vivaha":  {"sign": "Gemini",   "house": "3"},
}

# Regex patterns for suspicious passages (entity, pattern, description)
ERROR_PATTERNS: List[Tuple[str, str, str]] = [
    ("Jupiter", r"Jupiter\s+in\s+Cancer",                "Jupiter in Cancer (should be Sagittarius 9H)"),
    ("Jupiter", r"Jupiter[^.\n]{0,50}\b4H\b",            "Jupiter associated with 4H"),
    ("Jupiter", r"Jupiter[^.\n]{0,80}aspect[^.\n]{0,50}\b(10H|8H|12H)\b",
                                                          "Jupiter aspecting 10H/8H/12H from wrong position"),
    ("Shree Lagna", r"Shree\s+Lagna[^.\n]{0,50}\b9H\b",  "Shree Lagna in 9H (should be 7H Libra)"),
    ("Ghati Lagna", r"Ghati\s+Lagna[^.\n]{0,50}\b8H\b",  "Ghati Lagna in 8H (should be 9H Sagittarius)"),
    ("Varnada Lagna", r"Varnada\s+Lagna[^.\n]{0,50}\b8H\b", "Varnada Lagna in 8H (should be 4H Cancer)"),
    ("Hora Lagna", r"Hora\s+Lagna[^.\n]{0,50}\b7H\b",    "Hora Lagna in 7H (should be 3H Gemini)"),
    ("Saham Roga", r"Saham\s+Roga[^.\n]{0,50}\b7H\b",    "Roga Saham in 7H (should be 2H Taurus)"),
    ("Saham Mahatmya", r"Saham\s+Mahatmya[^.\n]{0,50}\b7H\b", "Mahatmya Saham in 7H (should be 9H Sagittarius)"),
    ("Saham Vivaha", r"Saham\s+Vivaha[^.\n]{0,50}\b3H\b", "Vivaha Saham in 3H (should be 4H Cancer)"),
    ("hidden pinnacle", r"hidden[\s\-]*pinnacle|Varnada[^.\n]{0,40}Ghati[^.\n]{0,40}\b8H\b",
                                                          "Hidden pinnacle / Varnada+Ghati in 8H (falsified)"),
]

# Historical/negation markers — lines with these are almost certainly not live claims
HISTORICAL_MARKERS = [
    re.compile(p, re.I) for p in [
        r"\bFALSIFIED\b", r"\bFALSIFY\b", r"\bINVALIDATED?\b",
        r"previously\s+claimed", r"previously\s+stated",
        r"v[0-9]+(?:[._][0-9]+)?\s+said",
        r"corrected\s+from", r"corrected\s+to",
        r"was\s+(?:claimed|stated|said)",
        r"old\s+(?:claim|value)", r"\bstale\b",
        r"\bNOT\b[^.\n]{0,30}\d{1,2}H",
        r"erroneously", r"mistaken", r"\bincorrect\b",
        r"removed",r"deprecated",r"superseded",
        r"~~",        # markdown strikethrough
        r"error[\s:\-]", r"\bregex\b",
        r"→|->",       # correction arrows in changelogs
    ]
]

CONTEXT_LINES = 5   # lines of context around each match

# ── File discovery ─────────────────────────────────────────────────────────────

def should_skip(path: Path) -> bool:
    try:
        rel = str(path.relative_to(ROOT))
    except ValueError:
        rel = str(path)
    return any(re.search(p, rel, re.I) for p in SKIP_PATTERNS)


def find_latest_versions(paths: List[Path]) -> Tuple[List[Path], List[Path]]:
    """Keep only the highest version for each (dir, stem) pair."""
    groups: Dict[Tuple[str,str], List[Tuple[Tuple[int,int], Path]]] = defaultdict(list)
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
    kept = list(singletons)
    dropped: List[Path] = []
    for key, versions in groups.items():
        versions.sort(reverse=True)
        kept.append(versions[0][1])
        dropped.extend(v[1] for v in versions[1:])
    return sorted(kept), sorted(dropped)


def discover_files() -> Tuple[List[Path], List[Path], List[Path]]:
    """Returns (scan_files, authoritative_files, superseded_files)."""
    all_md: List[Path] = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames
                       if not should_skip(Path(dirpath) / d)]
        for fname in filenames:
            if fname.endswith(".md"):
                fp = Path(dirpath) / fname
                if not should_skip(fp):
                    all_md.append(fp)

    kept, dropped = find_latest_versions(all_md)
    auth = [p for p in kept if str(p.relative_to(ROOT)) in AUTHORITATIVE_FILES]
    scan = [p for p in kept if str(p.relative_to(ROOT)) not in AUTHORITATIVE_FILES]
    return scan, auth, dropped


# ── Phase 1: pure-Python scanning ─────────────────────────────────────────────

def read_lines(fp: Path) -> List[str]:
    try:
        return fp.read_text(encoding="utf-8").splitlines()
    except UnicodeDecodeError:
        return fp.read_text(encoding="latin-1").splitlines()


def is_historical(line: str) -> bool:
    return any(m.search(line) for m in HISTORICAL_MARKERS)


def scan_file(fp: Path) -> List[Dict[str, Any]]:
    """Find suspicious passages in a single file."""
    lines = read_lines(fp)
    rel = str(fp.relative_to(ROOT))
    findings: List[Dict[str, Any]] = []
    compiled = [(entity, re.compile(pat, re.I), desc)
                for entity, pat, desc in ERROR_PATTERNS]

    for i, line in enumerate(lines, start=1):
        if is_historical(line):
            continue
        stripped = line.lstrip()
        if stripped.startswith("|"):           # table rows — rarely live claims
            continue
        for entity, regex, desc in compiled:
            if regex.search(line):
                start = max(0, i - CONTEXT_LINES - 1)
                end   = min(len(lines), i + CONTEXT_LINES)
                context_block = "\n".join(
                    f"{'>>>' if j+1 == i else '   '} L{j+1}: {lines[j]}"
                    for j in range(start, end)
                )
                findings.append({
                    "file":    rel,
                    "line":    i,
                    "entity":  entity,
                    "trigger": desc,
                    "match":   line.strip()[:160],
                    "context": context_block,
                })
                break   # one hit per line
    return findings


def check_msr_citations(scan_files: List[Path]) -> Dict[str, Any]:
    """
    Pure-Python: every MSR.NNN cited in corpus should be in the valid range.

    MSR_v2_0.md incorporates signals 001-420 from v1_0 by reference (they are NOT
    individually listed as SIG.MSR.NNN entries in the v2_0 file — they inherit).
    New signals: MSR.421-437 (v8.0 yogas), MSR.444-496 (expansion batch 2026-04-19).
    Special: MSR.402b (replacement for invalidated MSR.402).
    Valid range: 1-496 plus special suffixes (b, etc.).

    Returns orphaned = citations that fall OUTSIDE the valid range.
    """
    msr_re = re.compile(r"\bMSR\.(\d+[a-z]?)\b", re.I)

    VALID_SPECIAL = {"402b"}
    MAX_VALID_NUM = 496

    def is_valid(nnn: str) -> bool:
        if nnn.lower() in VALID_SPECIAL:
            return True
        try:
            return 1 <= int(nnn) <= MAX_VALID_NUM
        except ValueError:
            return False

    cited: Dict[str, List[str]] = defaultdict(list)
    total = 0
    for fp in scan_files:
        rel = str(fp.relative_to(ROOT))
        if "MSR_v2_0" in rel or "MSR_v1_0" in rel:
            continue
        for i, line in enumerate(read_lines(fp), start=1):
            for m in msr_re.finditer(line):
                nnn = m.group(1)
                cited[nnn].append(f"{rel}:{i}")
                total += 1

    orphaned = {nnn: locs for nnn, locs in cited.items() if not is_valid(nnn)}
    return {
        "registry_path": MSR_REGISTRY_PATH,
        "valid_range": f"MSR.001–MSR.496 + MSR.402b",
        "total_citations": total,
        "unique_cited_ids": len(cited),
        "orphaned_ids": orphaned,
    }


def spot_check_matrix_files(scan_files: List[Path]) -> List[Dict[str, Any]]:
    """
    Check MATRIX_*.md files for planet placements that contradict ground truth.
    Only checks narrative lines (not table rows that cover all divisional charts).
    """
    issues: List[Dict[str, Any]] = []
    matrix_files = [f for f in scan_files if "MATRIX_" in f.name]
    house_re  = re.compile(r"\b(\d{1,2})H\b")
    signs = list({v["sign"] for v in GROUND_TRUTH.values()})
    sign_re = re.compile(r"\b(" + "|".join(signs) + r")\b", re.I)

    # Divisional-chart table markers — these list tenants across D1-D60, not natal D1 only
    div_row_re = re.compile(r"\bD\d{1,2}\.[A-Z0-9_]+\b")

    for fp in matrix_files:
        rel = str(fp.relative_to(ROOT))
        for i, line in enumerate(read_lines(fp), start=1):
            if is_historical(line):
                continue
            stripped = line.lstrip()
            if stripped.startswith("|"):       # table rows span all charts
                continue
            if div_row_re.search(line):        # divisional chart reference
                continue
            for entity, truth in GROUND_TRUTH.items():
                if not re.search(r"\b" + re.escape(entity) + r"\b", line, re.I):
                    continue
                window_start = max(0, line.lower().find(entity.lower()))
                window = line[max(0, window_start-50):window_start+100]
                house_m = house_re.search(window)
                sign_m  = sign_re.search(window)
                found_h = house_m.group(1) if house_m else None
                found_s = sign_m.group(1).capitalize() if sign_m else None
                if found_h and found_h != truth["house"] and found_s and found_s != truth["sign"]:
                    issues.append({
                        "file":     rel,
                        "line":     i,
                        "entity":   entity,
                        "expected": f"{truth['sign']} {truth['house']}H",
                        "found":    f"{found_s} {found_h}H",
                        "context":  line.strip()[:200],
                    })
                    break
    return issues


# ── Phase 2: worker LLM classification ────────────────────────────────────────

GROUND_TRUTH_SUMMARY = "\n".join(
    f"  - {entity}: {v['sign']} House {v['house']}"
    for entity, v in GROUND_TRUTH.items()
)

OLD_WRONG_SUMMARY = "\n".join(
    f"  - {entity}: was {v['sign']} House {v['house']} in v6.0 (NOW FALSIFIED)"
    for entity, v in KNOWN_OLD_WRONG.items()
)

WORKER_SYSTEM = f"""You are a corpus integrity checker for an AM-JIS Jyotish (Vedic astrology) research project.

## Authoritative placements (FORENSIC_ASTROLOGICAL_DATA_v8_0.md, v8.0):
{GROUND_TRUTH_SUMMARY}

## OLD WRONG VALUES (v6.0 era — now falsified, documented for historical record only):
{OLD_WRONG_SUMMARY}

## Your task
You receive a suspicious passage from a document. Classify it as ONE of:
- LIVE_ERROR: Makes a currently-active, forward-looking claim that contradicts the authoritative placements above.
- HISTORICAL_DOC: Mentions old wrong values only to document what was corrected (changelogs, falsifier registries, correction notes, reconciliation tables). NOT an error.
- REGEX_FP: The search pattern triggered but the passage is NOT making a claim about the entity in question (it's about something else entirely, or the entity name appears incidentally).
- CORRECT: The passage accurately uses the authoritative v8.0 placements.

## Output — return ONLY valid JSON, no other text:
{{
  "classification": "LIVE_ERROR" | "HISTORICAL_DOC" | "REGEX_FP" | "CORRECT",
  "confidence": 0.0-1.0,
  "reason": "one sentence explaining your classification",
  "what_is_wrong": "if LIVE_ERROR: describe the specific wrong claim. Otherwise null."
}}"""


async def classify_passage_anthropic(
    client: anthropic.AsyncAnthropic,
    passage: Dict[str, Any],
    semaphore: asyncio.Semaphore,
) -> Dict[str, Any]:
    """Call Haiku to classify a single suspicious passage."""
    user_msg = (
        f"File: {passage['file']} (line {passage['line']})\n"
        f"Pattern triggered: {passage['trigger']}\n"
        f"Entity: {passage['entity']}\n\n"
        f"Passage (>>> marks the flagged line):\n{passage['context']}"
    )
    async with semaphore:
        try:
            resp = await client.messages.create(
                model=WORKER_MODEL_ANTHROPIC,
                max_tokens=256,
                system=WORKER_SYSTEM,
                messages=[{"role": "user", "content": user_msg}],
                output_config={
                    "format": {
                        "type": "json_schema",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "classification": {"type": "string", "enum": ["LIVE_ERROR","HISTORICAL_DOC","REGEX_FP","CORRECT"]},
                                "confidence":     {"type": "number"},
                                "reason":         {"type": "string"},
                                "what_is_wrong":  {"type": ["string","null"]},
                            },
                            "required": ["classification","confidence","reason","what_is_wrong"],
                            "additionalProperties": False,
                        }
                    }
                },
            )
            text = next((b.text for b in resp.content if b.type == "text"), "{}")
            result = json.loads(text)
        except Exception as e:
            result = {
                "classification": "REGEX_FP",
                "confidence": 0.0,
                "reason": f"API error: {e}",
                "what_is_wrong": None,
            }
    return {**passage, "worker_result": result}


async def classify_passage_deepseek(
    client: Any,  # openai.AsyncOpenAI
    passage: Dict[str, Any],
    semaphore: asyncio.Semaphore,
) -> Dict[str, Any]:
    """Call DeepSeek (OpenAI-compatible) to classify a single passage."""
    user_msg = (
        f"File: {passage['file']} (line {passage['line']})\n"
        f"Pattern triggered: {passage['trigger']}\n"
        f"Entity: {passage['entity']}\n\n"
        f"Passage:\n{passage['context']}\n\n"
        f"Return ONLY valid JSON with keys: classification, confidence, reason, what_is_wrong"
    )
    async with semaphore:
        try:
            resp = await client.chat.completions.create(
                model=WORKER_MODEL_DEEPSEEK,
                max_tokens=256,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": WORKER_SYSTEM},
                    {"role": "user",   "content": user_msg},
                ],
            )
            text = resp.choices[0].message.content or "{}"
            result = json.loads(text)
        except Exception as e:
            result = {
                "classification": "REGEX_FP",
                "confidence": 0.0,
                "reason": f"API error: {e}",
                "what_is_wrong": None,
            }
    return {**passage, "worker_result": result}


async def run_worker_phase(
    candidates: List[Dict[str, Any]],
    backend: str,
    n_workers: int,
) -> List[Dict[str, Any]]:
    """Run all candidates through worker LLMs concurrently."""
    semaphore = asyncio.Semaphore(n_workers)
    tasks = []

    if backend == "deepseek":
        if not OPENAI_AVAILABLE:
            print("ERROR: 'openai' package not installed. Run: pip install openai", file=sys.stderr)
            sys.exit(1)
        import openai as openai_mod
        client = openai_mod.AsyncOpenAI(
            api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
            base_url="https://api.deepseek.com",
        )
        tasks = [classify_passage_deepseek(client, p, semaphore) for p in candidates]
    else:
        client = anthropic.AsyncAnthropic()
        tasks = [classify_passage_anthropic(client, p, semaphore) for p in candidates]

    results = []
    for i, coro in enumerate(asyncio.as_completed(tasks), start=1):
        result = await coro
        cls = result.get("worker_result", {}).get("classification", "?")
        print(f"  [{i}/{len(tasks)}] {cls:14s}  {result['file']}:{result['line']}")
        results.append(result)

    return results


# ── Phase 3: report generation ────────────────────────────────────────────────

def generate_report(
    scan_files: List[Path],
    dropped: List[Path],
    classified: List[Dict[str, Any]],
    msr_check: Dict[str, Any],
    matrix_issues: List[Dict[str, Any]],
    output_path: Path,
) -> Dict[str, Any]:

    live_errors = [r for r in classified
                   if r.get("worker_result",{}).get("classification") == "LIVE_ERROR"]
    historical  = [r for r in classified
                   if r.get("worker_result",{}).get("classification") == "HISTORICAL_DOC"]
    fps         = [r for r in classified
                   if r.get("worker_result",{}).get("classification") in ("REGEX_FP","CORRECT")]

    # Sort live errors by confidence (highest first) then by file
    live_errors.sort(key=lambda r: -r["worker_result"]["confidence"])

    # Per-file error counts
    errors_by_file: Dict[str, int] = defaultdict(int)
    for r in live_errors:
        errors_by_file[r["file"]] += 1

    summary = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "files_scanned": len(scan_files),
        "versions_excluded": len(dropped),
        "candidates_sent_to_workers": len(classified),
        "live_errors": len(live_errors),
        "historical_docs": len(historical),
        "regex_false_positives": len(fps),
        "msr_orphaned_citations": len(msr_check.get("orphaned_ids", {})),
        "matrix_inconsistencies": len(matrix_issues),
    }

    # Write JSON report
    json_report = {
        "summary": summary,
        "live_errors": live_errors,
        "msr_citation_check": msr_check,
        "matrix_spot_checks": matrix_issues,
        "historical_docs": historical,
        "false_positives": fps,
    }
    json_path = output_path.with_suffix(".json")
    json_path.write_text(json.dumps(json_report, indent=2, ensure_ascii=False), encoding="utf-8")

    # Write Markdown report
    now = summary["generated_at"]
    lines = [
        f"# AM-JIS Corpus Verification Report — {now}",
        "",
        "## Executive Summary",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Files scanned | {summary['files_scanned']} |",
        f"| Superseded versions excluded | {summary['versions_excluded']} |",
        f"| Candidates evaluated by workers | {summary['candidates_sent_to_workers']} |",
        f"| **LIVE ERRORS** (need fixing) | **{summary['live_errors']}** |",
        f"| Historical/remediation docs (not errors) | {summary['historical_docs']} |",
        f"| Regex false positives | {summary['regex_false_positives']} |",
        f"| Orphaned MSR citations | {summary['msr_orphaned_citations']} |",
        f"| Matrix spot-check issues | {summary['matrix_inconsistencies']} |",
        "",
        "---",
        "",
        "## Priority 1 — Live Errors by File",
        "",
    ]

    for fname, count in sorted(errors_by_file.items(), key=lambda x: -x[1]):
        lines.append(f"- `{fname}` — **{count}** live error(s)")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Priority 1 — Live Error Details")
    lines.append("")

    for i, err in enumerate(live_errors, start=1):
        wr = err["worker_result"]
        lines += [
            f"### Error {i} — {err['file']}:{err['line']}",
            f"- **Entity**: {err['entity']}",
            f"- **Pattern**: {err['trigger']}",
            f"- **Confidence**: {wr['confidence']:.2f}",
            f"- **What is wrong**: {wr.get('what_is_wrong') or 'see passage'}",
            f"- **Reason**: {wr['reason']}",
            "",
            "```",
            err["context"],
            "```",
            "",
        ]

    if msr_check.get("orphaned_ids"):
        lines += [
            "---",
            "",
            "## Priority 2 — Orphaned MSR Citations",
            "",
            f"MSR IDs cited in corpus but NOT found in `{msr_check['registry_path']}`:",
            "",
        ]
        def _msrsort(kv):
            digits = re.sub(r"[^0-9]", "", kv[0]) or "9999"
            return (int(digits), kv[0])
        for nnn, locs in sorted(msr_check["orphaned_ids"].items(), key=_msrsort):
            lines.append(f"- **MSR.{nnn}** cited at: {', '.join(locs[:5])}"
                         + (f" (+{len(locs)-5} more)" if len(locs) > 5 else ""))
        lines.append("")

    if matrix_issues:
        lines += [
            "---",
            "",
            "## Priority 3 — Matrix File Inconsistencies",
            "",
            "| File | Line | Entity | Expected | Found |",
            "|------|------|--------|----------|-------|",
        ]
        for iss in matrix_issues:
            lines.append(f"| `{iss['file']}` | {iss['line']} | {iss['entity']} "
                         f"| {iss['expected']} | {iss['found']} |")
        lines.append("")

    lines += [
        "---",
        "",
        "## Methodology",
        "- **Workers**: LLM-based classification (LIVE_ERROR / HISTORICAL_DOC / REGEX_FP / CORRECT)",
        "- **Excluded**: meta/remediation docs, superseded versions, transit/event files",
        "- **Ground truth**: `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (v8.0 JHora-authoritative placements)",
        "- **MSR check**: pure-Python citation cross-reference against `MSR_v2_0.md`",
        "",
        f"*Full JSON findings: `{json_path.name}`*",
        f"*Generated by verify_corpus.py at {now}*",
    ]

    output_path.write_text("\n".join(lines), encoding="utf-8")
    return summary


# ── Main ───────────────────────────────────────────────────────────────────────

def estimate_cost(n_candidates: int, backend: str) -> str:
    # Rough: system ~800 tokens, user ~300 tokens, output ~80 tokens per call
    input_tokens  = n_candidates * 1100
    output_tokens = n_candidates * 80
    if backend == "deepseek":
        # DeepSeek Chat pricing: ~$0.14/1M input, $0.28/1M output (cache miss)
        cost = (input_tokens * 0.14 + output_tokens * 0.28) / 1_000_000
    else:
        # Haiku 4.5: $1/1M input, $5/1M output
        cost = (input_tokens * 1.0 + output_tokens * 5.0) / 1_000_000
    return f"~${cost:.3f} ({n_candidates} calls × {backend})"


def main():
    parser = argparse.ArgumentParser(description="AM-JIS corpus verifier — brain + workers")
    parser.add_argument("--path",    default=".", help="Project root directory")
    parser.add_argument("--backend", default="anthropic", choices=["anthropic", "deepseek"],
                        help="Worker model backend (default: anthropic/haiku)")
    parser.add_argument("--workers", type=int, default=5, help="Max concurrent worker calls")
    parser.add_argument("--output",  default="corpus_verification_report_v1_0.md",
                        help="Markdown report output path")
    parser.add_argument("--dry-run", action="store_true",
                        help="Scan only — skip API calls, show candidate count and cost estimate")
    parser.add_argument("--min-confidence", type=float, default=0.6,
                        help="Only report LIVE_ERRORs above this confidence threshold")
    args = parser.parse_args()

    global ROOT
    ROOT = Path(args.path).resolve()
    if not ROOT.exists():
        print(f"Error: {ROOT} does not exist", file=sys.stderr)
        sys.exit(1)

    print(f"\n{'='*60}")
    print(f"AM-JIS Corpus Verification Orchestrator")
    print(f"Root: {ROOT}")
    print(f"Backend: {args.backend} workers | Concurrency: {args.workers}")
    print(f"{'='*60}\n")

    # ── Phase 1: pure Python ──
    print("Phase 1: Discovering files...")
    scan_files, auth_files, dropped = discover_files()
    print(f"  Scan scope: {len(scan_files)} files ({len(dropped)} superseded excluded)")
    print(f"  Authoritative (ground truth): {len(auth_files)} file(s)")

    print("\nPhase 1: Scanning for suspicious passages...")
    all_candidates: List[Dict[str, Any]] = []
    for fp in scan_files:
        hits = scan_file(fp)
        all_candidates.extend(hits)
    print(f"  Suspicious passages found: {len(all_candidates)}")

    print("\nPhase 1: MSR citation integrity check...")
    msr_check = check_msr_citations(scan_files)
    print(f"  Valid range: {msr_check['valid_range']}")
    print(f"  Unique IDs cited in corpus: {msr_check['unique_cited_ids']}")
    print(f"  Out-of-range citations: {len(msr_check['orphaned_ids'])}")
    if msr_check["orphaned_ids"]:
        def msr_sort_key(s):
            digits = re.sub(r"[^0-9]", "", s) or "9999"
            return (int(digits), s)
        for nnn in sorted(msr_check["orphaned_ids"].keys(), key=msr_sort_key)[:10]:
            print(f"    MSR.{nnn} cited at: {msr_check['orphaned_ids'][nnn][0]}")

    print("\nPhase 1: Matrix file spot-checks...")
    matrix_issues = spot_check_matrix_files(scan_files)
    print(f"  Matrix inconsistencies found: {len(matrix_issues)}")

    if args.dry_run:
        print(f"\n[DRY RUN] Would submit {len(all_candidates)} passages to workers.")
        print(f"[DRY RUN] Estimated cost: {estimate_cost(len(all_candidates), args.backend)}")
        print("[DRY RUN] Re-run without --dry-run to execute worker classification.")
        return

    if not all_candidates:
        print("\nNo candidates to classify — corpus looks clean!")
        return

    print(f"\nEstimated worker cost: {estimate_cost(len(all_candidates), args.backend)}")
    print(f"\nPhase 2: Classifying {len(all_candidates)} passages with {args.backend} workers...")
    classified = asyncio.run(run_worker_phase(all_candidates, args.backend, args.workers))

    # Filter by confidence
    live_errors = [r for r in classified
                   if r.get("worker_result",{}).get("classification") == "LIVE_ERROR"
                   and r["worker_result"]["confidence"] >= args.min_confidence]
    print(f"\n  LIVE_ERRORS (confidence ≥ {args.min_confidence}): {len(live_errors)}")
    print(f"  HISTORICAL_DOC: {sum(1 for r in classified if r.get('worker_result',{}).get('classification')=='HISTORICAL_DOC')}")
    print(f"  FALSE_POSITIVES: {sum(1 for r in classified if r.get('worker_result',{}).get('classification') in ('REGEX_FP','CORRECT'))}")

    print("\nPhase 3: Writing report...")
    output_path = ROOT / args.output
    summary = generate_report(scan_files, dropped, classified, msr_check, matrix_issues, output_path)

    print(f"\n{'='*60}")
    print(f"VERIFICATION COMPLETE")
    print(f"  Live errors requiring fixes : {summary['live_errors']}")
    print(f"  Orphaned MSR citations      : {summary['msr_orphaned_citations']}")
    print(f"  Matrix inconsistencies      : {summary['matrix_inconsistencies']}")
    print(f"  Markdown report : {output_path}")
    print(f"  JSON findings   : {output_path.with_suffix('.json')}")
    print(f"{'='*60}")
    print("\nNext step: Review the report. I (Claude Opus) will read it")
    print("and identify which fixes to apply and in which order.")


if __name__ == "__main__":
    main()
