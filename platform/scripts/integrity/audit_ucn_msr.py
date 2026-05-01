#!/usr/bin/env python3
"""
audit_ucn_msr.py — Audit 2 (v2): UCN → MSR traceability.
Measures: % of UCN_SECTION nodes in l25_cgm_nodes with ≥1 valid MSR signal
in properties->'derived_from_signals'.
Target: ≥ 90%.

METHODOLOGY NOTE (v2 — KARN-W7-R1):
v1 (KARN-W6-R3) used paragraph-grep on UCN_v4_0.md prose and reported 6.60%.
That was the wrong measurement surface — UCN citations live in DB node
metadata (derived_from_signals on UCN_SECTION nodes), not in the prose text.
v2 queries l25_cgm_nodes directly, mirroring the PRIMARY block in
audit_cgm_supports.py.

A "valid MSR signal ID" matches: SIG.MSR.NNN or MSR.NNN (3 digits).

Usage: python3 platform/scripts/integrity/audit_ucn_msr.py
Output: prints results + JSON_RESULT to stdout.
DB: reads DATABASE_URL from env, .env.rag, or platform/.env.local
Exit codes: 0 if PASS (coverage ≥ 90%), 1 if FAIL.

KARN-W7-R1. READ-ONLY (SELECT only).
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print(
        "ERROR: psycopg2 not available. Install with: pip install psycopg2-binary",
        file=sys.stderr,
    )
    sys.exit(2)


def _get_dsn() -> str:
    """Resolve DATABASE_URL from env or repo .env files (matches audit_cgm_supports.py)."""
    db_url = os.environ.get("DATABASE_URL", "")
    if db_url:
        return db_url
    root = Path(__file__).parents[3]
    for env_file in [root / ".env.rag", root / "platform" / ".env.local"]:
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                if line.startswith("DATABASE_URL="):
                    return line.split("=", 1)[1].strip()
    return "host=127.0.0.1 port=5433 dbname=amjis user=amjis_app"


MSR_ID_RE = re.compile(r"\bSIG\.MSR\.\d{3}\b|\bMSR\.\d{3}\b")


def run_audit() -> dict:
    dsn = _get_dsn()
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute(
        """
        SELECT node_id, properties->'derived_from_signals' AS signals
        FROM l25_cgm_nodes
        WHERE node_type = 'UCN_SECTION'
        ORDER BY node_id
        """
    )
    rows = cur.fetchall()

    total = len(rows)
    cited = []
    uncited = []

    for r in rows:
        signals = r["signals"] or []
        if isinstance(signals, str):
            try:
                signals = json.loads(signals)
            except Exception:
                signals = []
        valid = [s for s in signals if MSR_ID_RE.search(str(s))]
        if valid:
            cited.append({"node_id": r["node_id"], "signals": valid[:5]})
        else:
            uncited.append(r["node_id"])

    cur.close()
    conn.close()

    coverage_pct = round(len(cited) / total * 100, 2) if total > 0 else 0.0
    target_met = coverage_pct >= 90.0

    return {
        "metric": (
            "UCN_SECTION nodes with ≥1 valid MSR signal "
            "in properties->derived_from_signals"
        ),
        "methodology_version": "v2 — KARN-W7-R1 (DB query, not paragraph-grep)",
        "total_nodes": total,
        "cited_count": len(cited),
        "uncited_count": len(uncited),
        "coverage_pct": coverage_pct,
        "target_met": target_met,
        "uncited_node_ids": uncited,
        "citation_examples": cited[:5],
    }


if __name__ == "__main__":
    result = run_audit()
    status = "PASS" if result["target_met"] else "FAIL"
    print()
    print("=== Audit 2 (v2): UCN → MSR ===")
    print(f"Methodology: {result['methodology_version']}")
    print(f"Metric: {result['metric']}")
    print(f"Status: {status}")
    print(
        f"With valid MSR: {result['cited_count']} / {result['total_nodes']} = "
        f"{result['coverage_pct']}%"
    )
    print(f"Target: ≥90% → {'MET' if result['target_met'] else 'NOT MET'}")
    if result["citation_examples"]:
        print()
        print("Citation examples (first 5):")
        for c in result["citation_examples"]:
            print(f"  {c['node_id']}  → {c['signals']}")
    if result["uncited_node_ids"]:
        print()
        print(f"Uncited nodes ({len(result['uncited_node_ids'])}):")
        for nid in result["uncited_node_ids"][:25]:
            print(f"  {nid}")
        if len(result["uncited_node_ids"]) > 25:
            print(f"  ... and {len(result['uncited_node_ids']) - 25} more")
    print()
    print(f"JSON_RESULT: {json.dumps(result)}")
    sys.exit(0 if result["target_met"] else 1)
