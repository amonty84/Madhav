#!/usr/bin/env python3
"""
AM-JIS Build Tracker Probe
Called by the Cowork artifact on every refresh.
Outputs a single JSON object to stdout.
"""
import os, json, re

base = '/sessions/adoring-vigilant-thompson/mnt/Madhav'

ex = lambda p: os.path.exists(base + '/' + p)
sz = lambda p: (os.path.getsize(base + '/' + p) if os.path.exists(base + '/' + p) else 0)

# ── Phase completion detection ──────────────────────────────────────────────
phases = {
    'amendment': False,
    'b0':  ex('035_DISCOVERY_LAYER/SCHEMAS/chunker_spec_v1_0.md'),
    'b1':  ex('verification_artifacts/RAG/ingestion_manifest.json'),
    'b2':  ex('verification_artifacts/RAG/chunking_report.json'),
    'b3':  ex('platform/python-sidecar/rag/embed.py') and sz('platform/python-sidecar/rag/embed.py') > 500,
    'b35': ex('035_DISCOVERY_LAYER/SCHEMAS/cgm_edge_schema_v1_0.json'),
    'b4':  ex('035_DISCOVERY_LAYER/PATTERN_REGISTER_v1_0.md'),
    'b5':  ex('035_DISCOVERY_LAYER/LEDGER/prediction_ledger_v1_0.jsonl'),
    'b6':  ex('035_DISCOVERY_LAYER/CONTRADICTION_REGISTER_v2_0.md'),
    'b7':  ex('platform/python-sidecar/router.py') and sz('platform/python-sidecar/router.py') > 800,
    'b8':  ex('platform/ui/pages/index.jsx') or ex('platform/ui/src/App.jsx'),
    'b9':  ex('035_DISCOVERY_LAYER/RED_TEAM/red_team_report_v1_0.md'),
    'b10': ex('00_ARCHITECTURE/GOVERNANCE_BASELINE_v2_0.md'),
}

try:
    c = open(base + '/00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md').read(800)
    phases['amendment'] = '1.0.3' in c
except Exception:
    pass

# ── Brief reading ────────────────────────────────────────────────────────────
brief = {}
try:
    content = open(base + '/CLAUDECODE_BRIEF.md').read(3000)
    for line in content.split('\n'):
        for key in ['status', 'session_id', 'proposed_thread_name', 'active_sub_phase', 'prepared_on']:
            if line.startswith(key + ':'):
                brief[key] = line.split(':', 1)[1].strip().strip('"')
    brief['exists'] = True
except Exception as e:
    brief = {'exists': False, 'error': str(e)}

# ── Last session from SESSION_LOG ────────────────────────────────────────────
last_session = {}
try:
    log = open(base + '/00_ARCHITECTURE/SESSION_LOG.md').read()
    sids = re.findall(r'session_id:\s*(\S+)', log)
    if sids:
        last_session['session_id'] = sids[-1]
    notes = re.findall(r'handoff_notes:\s*>\s*\n((?:[ \t]+.+\n)+)', log)
    if notes:
        last_session['notes'] = notes[-1].strip()[:280]
    dates = re.findall(r'produced_on:\s*(\S+)', log)
    if dates:
        last_session['date'] = dates[-1]
except Exception as e:
    last_session = {'error': str(e)}

print(json.dumps({'phases': phases, 'brief': brief, 'last_session': last_session}))
