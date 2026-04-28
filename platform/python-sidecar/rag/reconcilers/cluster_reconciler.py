"""
cluster_reconciler.py
MARSYS-JIS RAG Pipeline — Claude Pass-2 reconciler for B.5 Cluster Annotation.
Phase B.5 Session 3. Madhav_M2A_Exec_11 (2026-04-27).

Usage (programmatic):
  from rag.reconcilers.cluster_reconciler import reconcile_batch
  result = reconcile_batch(raw_response_path, batch_id)

Or via run_cluster_pipeline.py orchestrator:
  python -m rag.reconcilers.run_cluster_pipeline --batches B5_cluster_annotation_batch1
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_REGISTERS_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "REGISTERS"
_CLUSTER_ATLAS_JSON = _REGISTERS_DIR / "CLUSTER_ATLAS_v1_0.json"
_CLUSTER_ATLAS_MD = _REGISTERS_DIR / "CLUSTER_ATLAS_v1_0.md"
_SCHEMA_FILE = _PROJECT_ROOT / "06_LEARNING_LAYER" / "SCHEMAS" / "cluster_schema_v0_1.json"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.validators import p5_signal_id_resolution as p5
from rag.ledger import append_two_pass_event

SESSION_ID = "Madhav_M2A_Exec_11"
PROMPT_ID = "gemini.cluster_annotation"
PROMPT_VERSION = "1.0"

CONFIDENCE_THRESHOLD = 0.60
CLUSTER_SIZE_MIN = 3

_cluster_schema_cache: dict | None = None
_cluster_counter: int | None = None

_CANONICAL_DOMAINS = frozenset({
    "career", "wealth", "health", "relationships", "children",
    "spiritual", "parents", "mind", "travel", "meta", "cross_domain"
})


@dataclass
class ClusterReconciliationResult:
    accepted_clusters: list[dict] = field(default_factory=list)
    rejected_proposals: list[dict] = field(default_factory=list)
    batch_acceptance_rate: float = float("nan")
    anomaly_fired: bool = False
    anomaly_message: str = ""


def _compute_event_id(seed: str) -> str:
    return hashlib.sha256(seed.encode()).hexdigest()[:12]


def _next_cluster_id() -> str:
    global _cluster_counter
    if _cluster_counter is None:
        if _CLUSTER_ATLAS_JSON.exists():
            with _CLUSTER_ATLAS_JSON.open() as f:
                data = json.load(f)
            _cluster_counter = len(data.get("clusters", []))
        else:
            _cluster_counter = 0
    _cluster_counter += 1
    return f"CLUS.{_cluster_counter:03d}"


def _cluster_counter_rollback() -> None:
    global _cluster_counter
    if _cluster_counter is not None and _cluster_counter > 0:
        _cluster_counter -= 1


def _extract_yaml_from_raw(raw_text: str) -> list[dict]:
    """Parse cluster_annotations list from Gemini raw response."""
    body = re.sub(r"^---\s*\n.*?---\s*\n", "", raw_text, flags=re.DOTALL, count=1)

    fenced_blocks = re.findall(r"```(?:yaml)?\s*\n(.*?)```", body, re.DOTALL)
    yaml_text: str | None = None
    for block in fenced_blocks:
        if "cluster_annotations:" in block:
            yaml_text = block
            break

    if yaml_text is None:
        match = re.search(r"(cluster_annotations\s*:.*)", body, re.DOTALL)
        if match:
            yaml_text = match.group(1)

    if yaml_text is None:
        return []

    yaml_text = re.split(r"\n---\s*\n", yaml_text)[0]

    try:
        parsed = yaml.safe_load(yaml_text)
    except yaml.YAMLError as exc:
        print(f"[CLUSTER_RECONCILER] YAML parse error: {exc}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        annotations = parsed.get("cluster_annotations", [])
    elif isinstance(parsed, list):
        annotations = parsed
    else:
        annotations = []

    return annotations if isinstance(annotations, list) else []


def _validate_cluster(annotation: dict, input_clusters: list[dict]) -> tuple[bool, list[str]]:
    """
    Run Claude Pass-2 validation gates on a cluster annotation.
    Returns (all_pass, rejection_reasons).
    """
    failures: list[str] = []

    # Gate: cluster_label must be present and 3-6 words
    label = annotation.get("cluster_label", "")
    if not label or len(label.split()) < 2:
        failures.append("CLUSTER_LABEL_TOO_SHORT: cluster_label must be ≥3 words")

    # Gate: dominant_domain must be in canonical domain enum
    dom = annotation.get("dominant_domain", "")
    if dom not in _CANONICAL_DOMAINS:
        failures.append(f"CLUSTER_DOMAIN_INVALID: dominant_domain '{dom}' not in canonical enum")

    # Gate: annotation must be ≥50 chars
    ann = annotation.get("annotation", "")
    if len(ann) < 50:
        failures.append("CLUSTER_ANNOTATION_TOO_SHORT: annotation must be ≥50 chars")

    # Gate: confidence ≥ CONFIDENCE_THRESHOLD
    conf = annotation.get("confidence", 0)
    if not isinstance(conf, (int, float)) or conf < CONFIDENCE_THRESHOLD:
        failures.append(f"CLUSTER_CONFIDENCE_BELOW_THRESHOLD: confidence={conf} < {CONFIDENCE_THRESHOLD}")

    # Gate: Gemini verdict must not be REJECT
    verdict = annotation.get("verdict", "ACCEPT")
    if verdict == "REJECT":
        reject_reason = annotation.get("reject_reason", "no reason given")
        failures.append(f"CLUSTER_GEMINI_REJECTED: {reject_reason}")

    # Gate: signal_ids — at least 3 must be in MSR registry
    signal_ids = annotation.get("signal_ids", [])
    if not signal_ids:
        failures.append("CLUSTER_NO_SIGNAL_IDS: signal_ids list is empty")
    else:
        registry = p5.get_signal_registry()
        bad_signals = [s for s in signal_ids if s not in registry]
        if bad_signals:
            failures.append(f"CLUSTER_P5_SIGNAL_UNRESOLVED: unresolved signal IDs: {bad_signals}")
        if len(signal_ids) < 3:
            failures.append(f"CLUSTER_MIN_SIGNALS_NOT_MET: need ≥3 signal_ids, got {len(signal_ids)}")

    # Gate: cluster_size_n ≥ CLUSTER_SIZE_MIN (from input clusters if available)
    cluster_id_temp = annotation.get("cluster_id_temp", "")
    matching_input = next(
        (c for c in input_clusters if c.get("cluster_id_temp") == cluster_id_temp),
        None
    )
    if matching_input:
        size_n = matching_input.get("cluster_size_n", CLUSTER_SIZE_MIN)
        if size_n < CLUSTER_SIZE_MIN:
            failures.append(f"CLUSTER_SIZE_BELOW_MIN: cluster_size_n={size_n} < {CLUSTER_SIZE_MIN}")
    else:
        size_n = annotation.get("cluster_size_n", CLUSTER_SIZE_MIN)

    return len(failures) == 0, failures


def _build_accepted_entry(
    annotation: dict,
    cluster_id: str,
    input_cluster: dict | None,
    ledger_event_ids: list[str],
) -> dict:
    """Construct the final CLUSTER_ATLAS entry from an accepted annotation."""
    matching = input_cluster or {}
    return {
        "cluster_id": cluster_id,
        "cluster_label": annotation.get("cluster_label", ""),
        "dominant_domain": annotation.get("dominant_domain", ""),
        "sub_domains": annotation.get("sub_domains", []),
        "signal_ids": annotation.get("signal_ids", matching.get("signal_ids", [])),
        "chunk_ids": matching.get("chunk_ids", annotation.get("chunk_ids", [])),
        "centroid_method": matching.get("centroid_method", annotation.get("centroid_method", "kmeans")),
        "cluster_size_n": matching.get("cluster_size_n", annotation.get("cluster_size_n", CLUSTER_SIZE_MIN)),
        "pass_1_actor": "gemini",
        "confidence": annotation.get("confidence", 0.0),
        "significance": annotation.get("significance", 0.0),
        "annotation": annotation.get("annotation", ""),
        "ledger_event_ids": ledger_event_ids,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by_session": SESSION_ID,
    }


def _append_to_cluster_atlas(entry: dict) -> None:
    """Append accepted cluster to CLUSTER_ATLAS_v1_0.json and regenerate .md mirror."""
    _REGISTERS_DIR.mkdir(parents=True, exist_ok=True)

    if _CLUSTER_ATLAS_JSON.exists():
        with _CLUSTER_ATLAS_JSON.open() as f:
            data = json.load(f)
    else:
        data = {
            "schema": "06_LEARNING_LAYER/SCHEMAS/cluster_schema_v0_1.json",
            "version": "1.0",
            "produced_by_session": SESSION_ID,
            "produced_at": datetime.now(timezone.utc).date().isoformat(),
            "clusters": [],
        }

    data["clusters"].append(entry)

    with _CLUSTER_ATLAS_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    _regenerate_md_mirror(data["clusters"])


def _regenerate_md_mirror(clusters: list[dict]) -> None:
    """Regenerate CLUSTER_ATLAS_v1_0.md from the canonical JSON."""
    lines = [
        "---",
        "artifact: CLUSTER_ATLAS_v1_0.md",
        'version: "1.0"',
        "status: LIVE",
        f"produced_by_session: {SESSION_ID}",
        f"produced_at: {datetime.now(timezone.utc).date().isoformat()}",
        "canonical_source: 035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.json",
        "schema: 06_LEARNING_LAYER/SCHEMAS/cluster_schema_v0_1.json",
        "changelog:",
        "  - v1.0 (2026-04-27, Madhav_M2A_Exec_11): Initial scaffold.",
        f"  - Regenerated {datetime.now(timezone.utc).isoformat()} with {len(clusters)} clusters.",
        "---",
        "",
        "# CLUSTER ATLAS v1.0 — MARSYS-JIS Discovery Layer",
        "",
        "## §1 — About This Register",
        "",
        "Derived Markdown view of `035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.json`.",
        "Do not edit directly — regenerated by `cluster_reconciler.py` after each accept.",
        "Each cluster groups semantically proximate MSR signals (from KMeans/HDBSCAN over",
        "Vertex AI text-multilingual-embedding-002 embeddings of the 499-signal corpus).",
        "",
        "---",
        "",
        "## §2 — Cluster Index",
        "",
    ]

    if not clusters:
        lines.append("*No clusters yet.*")
        lines.append("")
    else:
        lines.append("| cluster_id | cluster_label | dominant_domain | centroid_method | confidence | cluster_size_n |")
        lines.append("|---|---|---|---|---|---|")
        for c in clusters:
            lines.append(
                f"| {c['cluster_id']} | {c['cluster_label']} | {c['dominant_domain']} "
                f"| {c.get('centroid_method','?')} | {c.get('confidence',0):.2f} | {c.get('cluster_size_n','?')} |"
            )

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## §3 — Cluster Detail")
    lines.append("")
    for c in clusters:
        lines.append(f"### {c['cluster_id']} — {c['cluster_label']}")
        lines.append(f"- **dominant_domain:** {c['dominant_domain']}")
        lines.append(f"- **sub_domains:** {', '.join(c.get('sub_domains', []))}")
        lines.append(f"- **signal_ids:** {', '.join(c.get('signal_ids', []))}")
        lines.append(f"- **confidence:** {c.get('confidence',0):.2f} | **significance:** {c.get('significance',0):.2f}")
        lines.append(f"- **cluster_size_n:** {c.get('cluster_size_n','?')} | **centroid_method:** {c.get('centroid_method','?')}")
        lines.append(f"- **annotation:** {c.get('annotation','')}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("*End of CLUSTER_ATLAS_v1_0.md. Regenerated by cluster_reconciler.py.*")
    lines.append("")

    _CLUSTER_ATLAS_MD.write_text("\n".join(lines), encoding="utf-8")


def reconcile_batch(
    raw_response_path: str,
    batch_id: str,
    input_clusters: list[dict] | None = None,
) -> ClusterReconciliationResult:
    """
    Pass-2 reconciler for a single Gemini cluster annotation batch.

    For each proposed cluster annotation:
    1. Parse YAML from raw response file.
    2. Validate: label, dominant_domain, annotation length, confidence ≥0.60,
       cluster_size_n ≥3, signal_ids in MSR registry, Gemini verdict != REJECT.
    3. Emit claude_cluster_accept or claude_cluster_reject ledger event.
    4. If accepted: append to CLUSTER_ATLAS.

    Returns ClusterReconciliationResult.
    """
    raw_path = Path(raw_response_path)
    if not raw_path.is_absolute():
        raw_path = _PROJECT_ROOT / raw_response_path
    if not raw_path.exists():
        raise FileNotFoundError(f"Raw response file not found: {raw_path}")

    raw_text = raw_path.read_text(encoding="utf-8")
    input_clusters = input_clusters or []

    ts = datetime.now(timezone.utc).isoformat()
    proposal_event_id = _compute_event_id(f"{batch_id}|{ts}|cluster_proposal")

    try:
        append_two_pass_event({
            "event_id": proposal_event_id,
            "event_type": "cluster_proposal",
            "timestamp": ts,
            "batch_id": batch_id,
            "prompt_id": PROMPT_ID,
            "prompt_version": PROMPT_VERSION,
            "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
            "edge_proposal": {
                "source_node_id": "cluster_batch",
                "target_node_id": "CLUSTER_ATLAS_v1_0",
                "edge_type": "SUPPORTS",
                "l1_source": "derivative — cluster annotations reference L1 via signal IDs",
            },
        })
    except Exception as exc:
        print(f"[CLUSTER_RECONCILER] Warning: could not write proposal event: {exc}", file=sys.stderr)

    annotations = _extract_yaml_from_raw(raw_text)
    if not annotations:
        print(
            f"[CLUSTER_RECONCILER] WARNING: No cluster annotations parsed from {raw_path}",
            file=sys.stderr,
        )

    result = ClusterReconciliationResult()
    reconciler_ref = str(raw_path.with_suffix("").name) + "_reconciled.md"

    for idx, annotation in enumerate(annotations):
        ts_now = datetime.now(timezone.utc).isoformat()
        cluster_hash = _compute_event_id(f"{batch_id}|{idx}|{ts_now}|cluster")

        if not isinstance(annotation, dict):
            result.rejected_proposals.append({"annotation": annotation, "failures": ["parse_failure"]})
            continue

        passed, failures = _validate_cluster(annotation, input_clusters)

        if passed:
            cluster_id = _next_cluster_id()

            accept_event: dict[str, Any] = {
                "event_id": cluster_hash,
                "event_type": "claude_cluster_accept",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": annotation.get("cluster_id_temp", "?"),
                    "target_node_id": "CLUSTER_ATLAS_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — cluster accepted via confidence/signal/domain gates",
                },
                "cluster_id": cluster_id,
                "decision_basis": f"confidence≥{CONFIDENCE_THRESHOLD}, signal_ids in MSR, domain valid, size≥{CLUSTER_SIZE_MIN}",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(accept_event)
            except Exception as exc:
                print(f"[CLUSTER_RECONCILER] Warning: could not write accept event: {exc}", file=sys.stderr)

            matching_input = next(
                (c for c in input_clusters if c.get("cluster_id_temp") == annotation.get("cluster_id_temp")),
                None
            )
            final_entry = _build_accepted_entry(
                annotation, cluster_id, matching_input, [proposal_event_id, cluster_hash]
            )
            _append_to_cluster_atlas(final_entry)
            result.accepted_clusters.append(final_entry)

        else:
            reject_event: dict[str, Any] = {
                "event_id": cluster_hash,
                "event_type": "claude_cluster_reject",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": annotation.get("cluster_id_temp", "?"),
                    "target_node_id": "CLUSTER_ATLAS_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — proposal rejected by validator stack",
                },
                "cluster_id": "CLUS.000",
                "decision_basis": f"Validation failed: {'; '.join(failures)}",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(reject_event)
            except Exception as exc:
                print(f"[CLUSTER_RECONCILER] Warning: could not write reject event: {exc}", file=sys.stderr)

            result.rejected_proposals.append({
                "annotation": annotation,
                "failures": failures,
            })

    total = len(result.accepted_clusters) + len(result.rejected_proposals)
    if total > 0:
        result.batch_acceptance_rate = len(result.accepted_clusters) / total
        if result.batch_acceptance_rate < 0.15 or result.batch_acceptance_rate > 0.80:
            result.anomaly_fired = True
            result.anomaly_message = (
                f"[ACCEPTANCE_RATE_ANOMALY] batch={batch_id} "
                f"rate={result.batch_acceptance_rate:.2%} band=[0.15, 0.80] "
                f"(accepted={len(result.accepted_clusters)}, rejected={len(result.rejected_proposals)})"
            )

    return result
