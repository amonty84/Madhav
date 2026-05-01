#!/usr/bin/env python3
"""
audit_cgm_supports.py — Audit 3: CGM SUPPORTS → MSR traceability.
Measures: % of SUPPORTS-type edges with ≥1 valid MSR signal in source_signals.
Target: ≥ 95%.

SCHEMA DEVIATION NOTE (KARN-W6-R3 pre-flight finding):
The l25_cgm_edges table does NOT have a source_signals column (brief assumed TEXT[]).
MSR signal traceability in the CGM lives in l25_cgm_nodes.properties->derived_from_signals
for UCN_SECTION node types. This script runs two checks:

  PRIMARY (adapted):
    % of UCN_SECTION nodes with ≥1 valid MSR signal in properties->derived_from_signals.
    This is the actual MSR traceability surface in the CGM.

  SECONDARY (per brief spec, documented for completeness):
    % of SUPPORTS edges whose source_node's properties carry MSR signals.
    Only 2 SUPPORTS edges exist; both connect PLN.* nodes (L1 chart facts) which
    by design do not carry derived_from_signals. Expected result: 0%.

Connects to local Postgres proxy on 127.0.0.1:5433.
DB: amjis, user: amjis_app.

Usage: python3 platform/scripts/integrity/audit_cgm_supports.py
Output: prints results to stdout.

KARN-W6-R3. READ-ONLY (SELECT only).
"""

import re
import json
import sys
import os
from pathlib import Path

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("ERROR: psycopg2 not available. Install with: pip install psycopg2-binary", file=sys.stderr)
    sys.exit(1)

# Load DSN from environment or derive from .env.rag / .env.local
def _get_dsn() -> str:
    db_url = os.environ.get('DATABASE_URL', '')
    if db_url:
        return db_url
    # Try to read from .env.rag in repo root
    root = Path(__file__).parents[3]
    for env_file in [root / '.env.rag', root / 'platform' / '.env.local']:
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                if line.startswith('DATABASE_URL='):
                    return line.split('=', 1)[1].strip()
    return "host=127.0.0.1 port=5433 dbname=amjis user=amjis_app"


MSR_ID_RE = re.compile(r'\bSIG\.MSR\.\d{3}\b|\bMSR\.\d{3}\b')


def run_audit() -> dict:
    dsn = _get_dsn()
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # ── Edge type inventory ──────────────────────────────────────────────────
    cur.execute("SELECT edge_type, COUNT(*) n FROM l25_cgm_edges GROUP BY edge_type ORDER BY n DESC")
    edge_type_counts = {r['edge_type']: r['n'] for r in cur.fetchall()}

    # ── SECONDARY: SUPPORTS edge check (per brief spec) ─────────────────────
    cur.execute("""
        SELECT e.id, e.edge_id, e.source_node_id, e.target_node_id, e.notes,
               n.properties as source_props
        FROM l25_cgm_edges e
        LEFT JOIN l25_cgm_nodes n ON n.node_id = e.source_node_id
        WHERE e.edge_type = 'SUPPORTS'
    """)
    supports_edges = cur.fetchall()

    secondary_total = len(supports_edges)
    secondary_with_msr = []
    secondary_without_msr = []

    for edge in supports_edges:
        props = edge['source_props'] or {}
        derived = props.get('derived_from_signals', []) or []
        notes_text = edge['notes'] or ''
        # Check notes field and derived_from_signals of source node
        sigs_in_notes = MSR_ID_RE.findall(notes_text)
        sigs_in_props = [s for s in derived if MSR_ID_RE.search(s)]
        if sigs_in_notes or sigs_in_props:
            secondary_with_msr.append(str(edge['id']))
        else:
            secondary_without_msr.append({
                'id': str(edge['id']),
                'edge_id': edge['edge_id'],
                'source_node_id': edge['source_node_id'],
                'target_node_id': edge['target_node_id'],
                'notes_excerpt': notes_text[:80],
            })

    secondary_pct = round(len(secondary_with_msr) / secondary_total * 100, 2) if secondary_total > 0 else 0.0

    # ── PRIMARY (adapted): UCN_SECTION node derived_from_signals coverage ───
    cur.execute("""
        SELECT node_id, properties->'derived_from_signals' as signals
        FROM l25_cgm_nodes
        WHERE node_type = 'UCN_SECTION'
    """)
    ucn_nodes = cur.fetchall()

    primary_total = len(ucn_nodes)
    primary_with_msr = []
    primary_without_msr = []

    for node in ucn_nodes:
        signals = node['signals'] or []
        if isinstance(signals, str):
            try:
                signals = json.loads(signals)
            except Exception:
                signals = []
        valid_sigs = [s for s in signals if MSR_ID_RE.search(str(s))]
        if valid_sigs:
            primary_with_msr.append({'node_id': node['node_id'], 'signals': valid_sigs[:5]})
        else:
            primary_without_msr.append(node['node_id'])

    primary_pct = round(len(primary_with_msr) / primary_total * 100, 2) if primary_total > 0 else 0.0
    primary_target_met = primary_pct >= 95.0

    cur.close()
    conn.close()

    return {
        'schema_deviation': (
            "l25_cgm_edges has no source_signals column. "
            "PRIMARY metric uses UCN_SECTION node derived_from_signals. "
            "SECONDARY metric checks SUPPORTS edges via source node properties + notes."
        ),
        'edge_type_counts': edge_type_counts,
        # Primary (adapted)
        'primary_metric': 'UCN_SECTION nodes with ≥1 valid MSR signal in derived_from_signals',
        'primary_total': primary_total,
        'primary_with_msr_count': len(primary_with_msr),
        'primary_without_msr_count': len(primary_without_msr),
        'primary_coverage_pct': primary_pct,
        'primary_target_met': primary_target_met,
        'primary_without_msr_sample': primary_without_msr[:20],
        # Secondary (per brief spec)
        'secondary_metric': 'SUPPORTS edges with MSR signal in source node properties or notes',
        'secondary_total': secondary_total,
        'secondary_with_msr_count': len(secondary_with_msr),
        'secondary_without_msr_count': len(secondary_without_msr),
        'secondary_coverage_pct': secondary_pct,
        'secondary_sample': secondary_without_msr[:10],
    }


if __name__ == '__main__':
    result = run_audit()

    primary_status = 'PASS' if result['primary_target_met'] else 'FAIL'

    print(f"\n=== Audit 3: CGM → MSR traceability ===")
    print(f"SCHEMA DEVIATION: {result['schema_deviation']}")
    print()
    print(f"── PRIMARY (adapted) ──")
    print(f"Metric: {result['primary_metric']}")
    print(f"Status: {primary_status}")
    print(f"Total UCN_SECTION nodes: {result['primary_total']}")
    print(f"With valid MSR: {result['primary_with_msr_count']} / {result['primary_total']} = {result['primary_coverage_pct']}%")
    print(f"Target: ≥95% → {'MET' if result['primary_target_met'] else 'NOT MET'}")
    if result['primary_without_msr_sample']:
        print(f"Nodes without MSR (first 20): {result['primary_without_msr_sample']}")
    print()
    print(f"── SECONDARY (per brief spec) ──")
    print(f"Metric: {result['secondary_metric']}")
    print(f"Total SUPPORTS edges: {result['secondary_total']}")
    print(f"With MSR reference: {result['secondary_with_msr_count']} / {result['secondary_total']} = {result['secondary_coverage_pct']}%")
    if result['secondary_sample']:
        print(f"Edges without MSR source:")
        for e in result['secondary_sample']:
            print(f"  {e['edge_id']}  source={e['source_node_id']}→{e['target_node_id']}")
    print()
    print(f"All edge types: {json.dumps(result['edge_type_counts'])}")
    print(f"\nJSON_RESULT: {json.dumps(result)}")
