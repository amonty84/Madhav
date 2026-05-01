#!/usr/bin/env python3
"""
audit_msr_forensic.py — Audit 1: MSR → FORENSIC traceability.
Measures: % of MSR signals with valid v6_ids_consumed → FORENSIC fact IDs.
Target: ≥ 95%.

Usage: python3 platform/scripts/integrity/audit_msr_forensic.py
Output: prints results to stdout.

KARN-W6-R3. READ-ONLY.
"""

import re
import sys
import json
from pathlib import Path

ROOT = Path(__file__).parents[3]
MSR_PATH = ROOT / "025_HOLISTIC_SYNTHESIS/MSR_v3_0.md"
FORENSIC_PATH = ROOT / "01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md"


def extract_forensic_ids(forensic_text: str) -> set:
    """Extract all stable IDs from FORENSIC that could be referenced by MSR.

    FORENSIC §0.1 defines namespaces including divisional-chart IDs like D9.MOON,
    D10.JUPITER, D60.LAGNA (letter + digits prefix). Pattern must allow an uppercase
    letter followed by optional alphanumerics (to catch D9, D20, D60, BVB, PLN, HSE…).
    """
    return set(re.findall(r'\b[A-Z][A-Z0-9]{1,4}\.[A-Z0-9_.]+', forensic_text))


def parse_msr_signals(msr_text: str) -> list:
    """Parse MSR v3_0.md into a list of signal dicts.

    Each dict: { id, signal_name, v6_ids_consumed: list[str] | None }
    MSR format: YAML-like blocks starting with 'SIG.MSR.NNN:' at column 0.
    """
    signals = []
    # Split on signal boundaries — lines starting with SIG.MSR. at column 0
    signal_blocks = re.split(r'\n(?=SIG\.MSR\.\d{3}:)', msr_text)
    for block in signal_blocks:
        stripped = block.strip()
        if not stripped.startswith('SIG.MSR.'):
            continue
        id_match = re.match(r'(SIG\.MSR\.\d{3}):', stripped)
        if not id_match:
            continue
        sig_id = id_match.group(1)

        name_match = re.search(r'signal_name:\s*["\']?(.+?)["\']?\s*$', block, re.MULTILINE)
        signal_name = name_match.group(1).strip() if name_match else ''

        # v6_ids_consumed: [ID1, ID2, ...] — single line, square brackets
        v6_match = re.search(r'v6_ids_consumed:\s*\[([^\]]*)\]', block)
        if v6_match:
            raw = v6_match.group(1)
            ids = [i.strip().strip('"\'') for i in raw.split(',') if i.strip()]
        else:
            ids = None

        signals.append({'id': sig_id, 'signal_name': signal_name, 'v6_ids_consumed': ids})

    return signals


def run_audit() -> dict:
    msr_text = MSR_PATH.read_text(encoding='utf-8')
    forensic_text = FORENSIC_PATH.read_text(encoding='utf-8')

    forensic_ids = extract_forensic_ids(forensic_text)
    signals = parse_msr_signals(msr_text)

    if not signals:
        print("ERROR: No signals parsed from MSR file. Check file format.", file=sys.stderr)
        sys.exit(1)

    missing_field = []
    invalid_refs = []
    valid = []

    for s in signals:
        if s['v6_ids_consumed'] is None:
            missing_field.append(s['id'])
        else:
            has_valid = any(ref in forensic_ids for ref in s['v6_ids_consumed'])
            if has_valid:
                valid.append(s['id'])
            else:
                invalid_refs.append({'id': s['id'], 'refs': s['v6_ids_consumed']})

    total = len(signals)
    coverage_pct = round(len(valid) / total * 100, 2) if total > 0 else 0.0
    target_met = coverage_pct >= 95.0

    return {
        'total_signals': total,
        'valid_count': len(valid),
        'missing_field_count': len(missing_field),
        'invalid_ref_count': len(invalid_refs),
        'coverage_pct': coverage_pct,
        'target_met': target_met,
        'missing_field_ids': missing_field[:20],
        'invalid_ref_sample': invalid_refs[:10],
        'forensic_id_count': len(forensic_ids),
    }


if __name__ == '__main__':
    result = run_audit()
    status = 'PASS' if result['target_met'] else 'FAIL'
    print(f"\n=== Audit 1: MSR → FORENSIC ===")
    print(f"Status: {status}")
    print(f"Total signals: {result['total_signals']}")
    print(f"FORENSIC ID universe: {result['forensic_id_count']} unique IDs")
    print(f"Valid coverage: {result['valid_count']} / {result['total_signals']} = {result['coverage_pct']}%")
    print(f"Target: ≥95% → {'MET' if result['target_met'] else 'NOT MET'}")
    print(f"Signals missing v6_ids_consumed field: {result['missing_field_count']}")
    print(f"Signals with field but no valid FORENSIC ref: {result['invalid_ref_count']}")
    if result['missing_field_ids']:
        print(f"Missing field IDs (first 20): {result['missing_field_ids']}")
    if result['invalid_ref_sample']:
        print(f"Invalid ref sample (first 10):\n{json.dumps(result['invalid_ref_sample'], indent=2)}")
    print(f"\nJSON_RESULT: {json.dumps(result)}")
