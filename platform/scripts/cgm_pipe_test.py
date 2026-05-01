#!/usr/bin/env python3
"""
cgm_pipe_test.py — CGM end-to-end pipe verification (15 checks)

Sections:
  A — Ingest pipe: DB state verification (nodes, edges, status breakdown)
  B — BFS traversal: mirrors cgm_graph_walk.ts SQL exactly
  C — Orphan edge accessibility
  D — Report and exit code

Usage:
    python3 platform/scripts/cgm_pipe_test.py [--repo-root /path/to/repo]

Requirements: psycopg[binary], python-dotenv
Auth Proxy must be running on port 5433.
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv as _load_dotenv
except ImportError:
    _load_dotenv = None  # type: ignore


def _load_env(repo_root: str) -> None:
    env_path = Path(repo_root) / "platform" / ".env.local"
    if _load_dotenv and env_path.exists():
        _load_dotenv(env_path, override=False)


# ─── Check accumulator ────────────────────────────────────────────────────────

checks: list[dict] = []


def _record(check_id: str, label: str, actual, expected, passed: bool, note: str = "") -> None:
    checks.append({
        "id": check_id,
        "label": label,
        "actual": actual,
        "expected": expected,
        "passed": passed,
        "note": note,
    })


def _pass(check_id: str, label: str, actual=None, expected=None, note: str = "") -> None:
    _record(check_id, label, actual, expected, passed=True, note=note)


def _fail(check_id: str, label: str, actual=None, expected=None, note: str = "") -> None:
    _record(check_id, label, actual, expected, passed=False, note=note)


# ─── Section A — Ingest pipe verification ────────────────────────────────────

def run_section_a(conn) -> None:

    # A.1 — l25_cgm_nodes row count
    count = conn.execute("SELECT COUNT(*) FROM l25_cgm_nodes").fetchone()[0]
    (_pass if count == 234 else _fail)("A.1", "l25_cgm_nodes row count", count, 234)

    # A.2 — l25_cgm_edges total
    total = conn.execute("SELECT COUNT(*) FROM l25_cgm_edges").fetchone()[0]
    (_pass if total == 127 else _fail)("A.2", "l25_cgm_edges total", total, 127)

    # A.3 — status=valid
    valid_cnt = conn.execute(
        "SELECT COUNT(*) FROM l25_cgm_edges WHERE status = 'valid'"
    ).fetchone()[0]
    (_pass if valid_cnt == 21 else _fail)("A.3", "status=valid", valid_cnt, 21)

    # A.4 — status=orphan
    orphan_cnt = conn.execute(
        "SELECT COUNT(*) FROM l25_cgm_edges WHERE status = 'orphan'"
    ).fetchone()[0]
    (_pass if orphan_cnt == 105 else _fail)("A.4", "status=orphan", orphan_cnt, 105)

    # A.5 — status=self_loop
    loop_cnt = conn.execute(
        "SELECT COUNT(*) FROM l25_cgm_edges WHERE status = 'self_loop'"
    ).fetchone()[0]
    (_pass if loop_cnt == 1 else _fail)("A.5", "status=self_loop", loop_cnt, 1)

    # A.6 — node type breakdown (9 types with correct counts)
    expected_types = {
        "DVS": 77, "SEN": 42, "DSH": 30, "YOG": 19,
        "KRK": 18, "NAK": 15, "HSE": 12, "SGN": 12, "PLN": 9,
    }
    rows = conn.execute(
        "SELECT node_type, COUNT(*) FROM l25_cgm_nodes GROUP BY node_type"
    ).fetchall()
    actual_types = {r[0]: r[1] for r in rows}
    if actual_types == expected_types:
        _pass("A.6", "node type breakdown", actual_types, expected_types)
    else:
        _fail("A.6", "node type breakdown", actual_types, expected_types)

    # A.7 — valid edge type breakdown (5 types with correct counts)
    expected_edge_types = {
        "DISPOSITED_BY": 8, "NAKSHATRA_LORD_IS": 8,
        "ASPECTS_3RD": 2, "ASPECTS_4TH": 2, "ASPECTS_8TH": 1,
    }
    rows = conn.execute(
        "SELECT edge_type, COUNT(*) FROM l25_cgm_edges WHERE status = 'valid' GROUP BY edge_type"
    ).fetchall()
    actual_edge_types = {r[0]: r[1] for r in rows}
    if actual_edge_types == expected_edge_types:
        _pass("A.7", "valid edge type breakdown", actual_edge_types, expected_edge_types)
    else:
        _fail("A.7", "valid edge type breakdown", actual_edge_types, expected_edge_types)

    # A.8 — orphan targets exclusively UCN.SEC.* and KARAKA.DUAL_SYSTEM_DIVERGENCE
    rows = conn.execute(
        "SELECT DISTINCT target_node_id FROM l25_cgm_edges WHERE status = 'orphan'"
    ).fetchall()
    unexpected = [
        r[0] for r in rows
        if not r[0].startswith("UCN.SEC.") and r[0] != "KARAKA.DUAL_SYSTEM_DIVERGENCE"
    ]
    ucn_count = sum(1 for r in rows if r[0].startswith("UCN.SEC."))
    karaka_present = any(r[0] == "KARAKA.DUAL_SYSTEM_DIVERGENCE" for r in rows)
    if not unexpected and ucn_count > 0 and karaka_present:
        _pass("A.8", "orphan targets correct",
              f"UCN.SEC.*({ucn_count}) + KARAKA.DUAL_SYSTEM_DIVERGENCE",
              "UCN.SEC.* + KARAKA.DUAL_SYSTEM_DIVERGENCE only")
    else:
        _fail("A.8", "orphan targets correct",
              f"unexpected={unexpected}", "UCN.SEC.* + KARAKA.DUAL_SYSTEM_DIVERGENCE only")

    # A.9 — self-loop is CGM_EDGE_014 (PLN.VENUS → PLN.VENUS, NAKSHATRA_LORD_IS)
    loop_row = conn.execute(
        "SELECT edge_id, source_node_id, target_node_id, edge_type "
        "FROM l25_cgm_edges WHERE status = 'self_loop'"
    ).fetchone()
    if (loop_row and loop_row[0] == "CGM_EDGE_014"
            and loop_row[1] == "PLN.VENUS" and loop_row[2] == "PLN.VENUS"):
        _pass("A.9", "self-loop is CGM_EDGE_014", str(loop_row),
              "CGM_EDGE_014 PLN.VENUS→PLN.VENUS")
    else:
        _fail("A.9", "self-loop is CGM_EDGE_014", str(loop_row),
              "CGM_EDGE_014 PLN.VENUS→PLN.VENUS")

    # A.10 — status index exists on l25_cgm_edges
    idx = conn.execute(
        "SELECT indexname FROM pg_indexes "
        "WHERE tablename = 'l25_cgm_edges' AND indexname = 'idx_l25_cgm_edges_status'"
    ).fetchone()
    (_pass if idx else _fail)(
        "A.10", "status index exists",
        idx[0] if idx else None, "idx_l25_cgm_edges_status",
    )


# ─── Section B — BFS traversal pipe verification ─────────────────────────────

def run_section_b(conn) -> None:
    """Mirrors the exact SQL executed by cgm_graph_walk.ts in production."""

    # B.1 — BFS from PLN.SUN returns ≥1 valid edge
    sun_rows = conn.execute(
        """
        SELECT source_node_id, target_node_id, edge_type,
               COALESCE(strength, 1.0)::float AS weight
        FROM l25_cgm_edges
        WHERE source_node_id = ANY(ARRAY['PLN.SUN'])
          AND (NULL::text[] IS NULL OR edge_type = ANY(NULL::text[]))
          AND status = 'valid'
        """
    ).fetchall()
    if len(sun_rows) >= 1:
        _pass("B.1", "BFS from PLN.SUN returns edges", len(sun_rows), "≥1",
              note=str([(r[1], r[2]) for r in sun_rows]))
    else:
        _fail("B.1", "BFS from PLN.SUN returns edges", len(sun_rows), "≥1")

    # B.2 — PLN.VENUS self-loop NOT returned by status='valid' filter
    venus_loops = conn.execute(
        """
        SELECT source_node_id, target_node_id
        FROM l25_cgm_edges
        WHERE source_node_id = ANY(ARRAY['PLN.VENUS'])
          AND status = 'valid'
          AND source_node_id = target_node_id
        """
    ).fetchall()
    (_pass if len(venus_loops) == 0 else _fail)(
        "B.2", "PLN.VENUS self-loop not returned by status=valid query",
        len(venus_loops), 0,
    )

    # B.3 — node hydration works for PLN.SUN targets
    if sun_rows:
        target_ids = list({r[1] for r in sun_rows})
        node_rows = conn.execute(
            "SELECT node_id, node_type, properties FROM l25_cgm_nodes "
            "WHERE node_id = ANY(%s::text[])",
            (target_ids,),
        ).fetchall()
        node_map = {r[0]: r for r in node_rows}
        missing = [t for t in target_ids if t not in node_map]
        null_props = [t for t in target_ids if t in node_map and node_map[t][2] is None]
        if not missing and not null_props:
            _pass("B.3", "node hydration works",
                  f"{len(node_rows)} nodes hydrated", f"{len(target_ids)} targets",
                  note=str([node_map[t][1] for t in target_ids if t in node_map]))
        else:
            _fail("B.3", "node hydration works",
                  f"missing={missing} null_props={null_props}", "all targets hydrated")
    else:
        _fail("B.3", "node hydration works", "no edges from B.1 to hydrate", "≥1 edge")


# ─── Section C — Orphan edge accessibility ───────────────────────────────────

def run_section_c(conn) -> None:

    # C.1 — all three statuses queryable
    rows = conn.execute(
        "SELECT status, COUNT(*) FROM l25_cgm_edges GROUP BY status ORDER BY status"
    ).fetchall()
    status_map = {r[0]: r[1] for r in rows}
    has_all = all(k in status_map for k in ("valid", "orphan", "self_loop"))
    (_pass if has_all and status_map.get("orphan", 0) > 0 else _fail)(
        "C.1", "orphan rows queryable", status_map, "valid + orphan + self_loop all present",
    )

    # C.2 — orphan_reason populated for every orphan row
    unpopulated = conn.execute(
        "SELECT COUNT(*) FROM l25_cgm_edges WHERE status = 'orphan' AND orphan_reason IS NULL"
    ).fetchone()[0]
    if unpopulated == 0:
        sample = conn.execute(
            "SELECT edge_id, orphan_reason FROM l25_cgm_edges WHERE status = 'orphan' LIMIT 3"
        ).fetchall()
        _pass("C.2", "orphan_reason populated", "all orphan rows have reason",
              "no NULL orphan_reason", note=str([(r[0], r[1][:40]) for r in sample]))
    else:
        _fail("C.2", "orphan_reason populated",
              f"{unpopulated} rows with NULL orphan_reason", 0)


# ─── Section D — Report ───────────────────────────────────────────────────────

def print_report() -> int:
    passed = sum(1 for c in checks if c["passed"])
    total = len(checks)

    print()
    print("=" * 75)
    print("=== CGM PIPE TEST RESULTS ===")
    print("=" * 75)
    for c in checks:
        status = "✅ PASS" if c["passed"] else "❌ FAIL"
        actual_str = str(c["actual"])[:35] if c["actual"] is not None else "—"
        expected_str = f"[EXPECTED: {str(c['expected'])[:20]}]" if c["expected"] is not None else ""
        note = f"  note: {c['note'][:45]}" if c["note"] else ""
        print(f"{c['id']:<5}  {c['label']:<43}: {actual_str:<37} {expected_str:<28} {status}{note}")
    print("=" * 75)
    if passed == total:
        print(f"OVERALL: {passed}/{total} PASS  ✅")
    else:
        failed_ids = [c["id"] for c in checks if not c["passed"]]
        print(f"OVERALL: {passed}/{total} PASS  ❌  FAILURES: {failed_ids}")
    print("=" * 75)

    return 0 if passed == total else 1


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="CGM end-to-end pipe test (15 checks)")
    parser.add_argument("--repo-root", default=None,
                        help="Path to repo root (default: auto-detect from script location)")
    args = parser.parse_args()

    if args.repo_root:
        repo_root = args.repo_root
    else:
        script_dir = Path(__file__).resolve().parent  # platform/scripts/
        repo_root = str(script_dir.parent.parent)     # repo root

    _load_env(repo_root)

    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        print("ERROR: DATABASE_URL not set. Is the Cloud SQL Auth Proxy running on port 5433?")
        sys.exit(1)

    try:
        import psycopg
    except ImportError:
        print("ERROR: psycopg not installed. Run: pip install psycopg[binary]")
        sys.exit(1)

    print(f"Connecting to Cloud SQL via Auth Proxy...")
    with psycopg.connect(db_url) as conn:
        run_section_a(conn)
        run_section_b(conn)
        run_section_c(conn)

    sys.exit(print_report())


if __name__ == "__main__":
    main()
