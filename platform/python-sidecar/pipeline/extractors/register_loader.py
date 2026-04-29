"""
pipeline.extractors.register_loader — Generic JSON register loader for L3 discovery registers.
Phase 14E. Loads all four registers from GCS, validates schema via Pydantic, and returns
typed entry lists ready for writer FK validation and staging insertion.

JSON is the canonical authoring source; .md companions are read-only human views.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field, field_validator

log = logging.getLogger(__name__)

BUILD_ID = "build-l3-registers-20260429"

# ── Confidence conversion ─────────────────────────────────────────────────────

_CONF_MAP: dict[str, float] = {"HIGH": 0.85, "MED": 0.60, "LOW": 0.35}


def _to_numeric_confidence(v: Any) -> float:
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().upper()
    if s in _CONF_MAP:
        return _CONF_MAP[s]
    try:
        return float(s)
    except ValueError:
        raise ValueError(f"Cannot convert confidence value: {v!r}")


# ── Pydantic models ───────────────────────────────────────────────────────────

class PatternEntry(BaseModel):
    pattern_id: str
    claim_text: str
    mechanism: str = ""
    domain: str | None = None
    signals_referenced: list[str] = Field(default_factory=list)
    ledger_event_ids: list[str] = Field(default_factory=list)
    confidence: Any
    created_at: str
    re_validation_status: str = "not_required"

    @field_validator("confidence", mode="before")
    @classmethod
    def coerce_confidence(cls, v: Any) -> float:
        return _to_numeric_confidence(v)

    def to_db_row(self) -> dict[str, Any]:
        parts = self.claim_text.split(". ", 1)
        name = parts[0][:200] if parts else self.pattern_id
        description = self.claim_text
        if self.mechanism:
            description = f"{self.claim_text}\n\nMechanism: {self.mechanism}"

        status_map = {"gemini_confirmed": "active", "not_required": "active",
                      "gemini_conflict": "active", "superseded": "superseded",
                      "rejected": "rejected"}
        status = status_map.get(self.re_validation_status, "active")

        return {
            "pattern_id": self.pattern_id,
            "name": name,
            "description": description,
            "domain": self.domain,
            "evidence": json.dumps({
                "signal_ids": self.signals_referenced,
                "fact_ids": [],
                "event_ids": self.ledger_event_ids,
            }),
            "source_signal_ids": self.signals_referenced or None,
            "source_fact_ids": None,
            "confidence": float(self.confidence),
            "discovered_at": self.created_at,
            "discovered_in_build_id": BUILD_ID,
            "status": status,
        }


class ResonanceEntry(BaseModel):
    resonance_id: str
    claim_text: str
    mechanism: str = ""
    domains_bridged: list[str] = Field(default_factory=list)
    signals_referenced: list[str] = Field(default_factory=list)
    confidence: Any
    created_at: str

    @field_validator("confidence", mode="before")
    @classmethod
    def coerce_confidence(cls, v: Any) -> float:
        return _to_numeric_confidence(v)

    def to_db_row(self) -> dict[str, Any]:
        theme = "_".join(self.domains_bridged) if self.domains_bridged else self.resonance_id
        description = self.claim_text
        if self.mechanism:
            description = f"{self.claim_text}\n\nMechanism: {self.mechanism}"
        return {
            "resonance_id": self.resonance_id,
            "theme": theme,
            "description": description,
            "signal_ids": self.signals_referenced,
            "pattern_ids": None,
            "domains": self.domains_bridged or None,
            "confidence": float(self.confidence),
            "discovered_at": self.created_at,
            "discovered_in_build_id": BUILD_ID,
            "status": "active",
        }


class ClusterEntry(BaseModel):
    cluster_id: str
    cluster_label: str
    dominant_domain: str | None = None
    sub_domains: list[str] = Field(default_factory=list)
    signal_ids: list[str] = Field(default_factory=list)
    annotation: str = ""
    confidence: Any
    created_at: str

    @field_validator("confidence", mode="before")
    @classmethod
    def coerce_confidence(cls, v: Any) -> float:
        return _to_numeric_confidence(v)

    def to_db_row(self) -> dict[str, Any]:
        # Derive theme from cluster_label: lowercase, underscored
        theme = "_".join(self.cluster_label.lower().split()[:4])
        return {
            "cluster_id": self.cluster_id,
            "name": self.cluster_label,
            "theme": theme,
            "description": self.annotation or self.cluster_label,
            "member_signal_ids": self.signal_ids,
            "member_fact_ids": None,
            "member_event_ids": None,
            "domain": self.dominant_domain,
            "confidence": float(self.confidence),
            "discovered_at": self.created_at,
            "discovered_in_build_id": BUILD_ID,
            "status": "active",
        }


class ContradictionEntry(BaseModel):
    contradiction_id: str
    contradiction_class: str
    hypothesis_text: str
    mechanism: str = ""
    domains_implicated: list[str] = Field(default_factory=list)
    signals_in_conflict: list[str] = Field(default_factory=list)
    l1_references: list[str] = Field(default_factory=list)
    claude_severity_prior: str = "MED"
    gemini_verdict: str = "CONFIRMED"
    resolution_options: list[str] = Field(default_factory=list)
    created_at: str

    def to_db_row(self) -> dict[str, Any]:
        # Split hypothesis_text into statement_a / statement_b on '; '
        parts = self.hypothesis_text.split("; ", 1)
        statement_a = parts[0]
        statement_b = parts[1] if len(parts) > 1 else self.mechanism[:500] if self.mechanism else self.hypothesis_text

        conflict_type_map = {
            "signal_polarity_conflict": "signal_vs_signal",
            "signal_vs_signal": "signal_vs_signal",
            "fact_vs_signal": "fact_vs_signal",
            "pattern_vs_event": "pattern_vs_event",
            "tradition_vs_observation": "tradition_vs_observation",
        }
        conflict_type = conflict_type_map.get(self.contradiction_class, "signal_vs_signal")

        verdict_map = {
            "CONFIRMED": "unresolved",
            "DISMISSED": "dismissed",
            "REFRAMED": "reframed",
            "ACCEPTED": "accepted",
        }
        resolution_status = verdict_map.get(self.gemini_verdict.upper(), "unresolved")
        resolution_notes = "; ".join(self.resolution_options[:3]) if self.resolution_options else None

        confidence = _to_numeric_confidence(self.claude_severity_prior)

        domain = self.domains_implicated[0] if self.domains_implicated else None

        return {
            "contradiction_id": self.contradiction_id,
            "statement_a": statement_a,
            "statement_b": statement_b,
            "conflict_type": conflict_type,
            "evidence": json.dumps({
                "signal_ids": self.signals_in_conflict,
                "fact_ids": [],
                "l1_references": self.l1_references,
            }),
            "source_signal_ids": self.signals_in_conflict or None,
            "source_fact_ids": None,
            "resolution_status": resolution_status,
            "resolution_notes": resolution_notes,
            "domain": domain,
            "confidence": confidence,
            "discovered_at": self.created_at,
            "discovered_in_build_id": BUILD_ID,
        }


# ── GCS loader ────────────────────────────────────────────────────────────────

REGISTER_CONFIGS: dict[str, dict[str, Any]] = {
    "pattern": {
        "json_uri": "gs://madhav-marsys-sources/L3/registers/PATTERN_REGISTER_v1_0.json",
        "entries_key": "patterns",
        "pydantic_model": PatternEntry,
        "fk_validations": [
            ("source_signal_ids", "msr_signals", "signal_id"),
        ],
    },
    "resonance": {
        "json_uri": "gs://madhav-marsys-sources/L3/registers/RESONANCE_REGISTER_v1_0.json",
        "entries_key": "resonances",
        "pydantic_model": ResonanceEntry,
        "fk_validations": [
            ("signal_ids", "msr_signals", "signal_id"),
        ],
    },
    "cluster": {
        "json_uri": "gs://madhav-marsys-sources/L3/registers/CLUSTER_ATLAS_v1_0.json",
        "entries_key": "clusters",
        "pydantic_model": ClusterEntry,
        "fk_validations": [
            ("member_signal_ids", "msr_signals", "signal_id"),
        ],
    },
    "contradiction": {
        "json_uri": "gs://madhav-marsys-sources/L3/registers/CONTRADICTION_REGISTER_v1_0.json",
        "entries_key": "contradictions",
        "pydantic_model": ContradictionEntry,
        "fk_validations": [
            ("source_signal_ids", "msr_signals", "signal_id"),
        ],
    },
}


_REPO_ROOT = Path(__file__).resolve().parents[4]
_LOCAL_REGISTER_DIR = _REPO_ROOT / "035_DISCOVERY_LAYER" / "REGISTERS"

_GCS_TO_LOCAL: dict[str, str] = {
    "gs://madhav-marsys-sources/L3/registers/PATTERN_REGISTER_v1_0.json":  "PATTERN_REGISTER_v1_0.json",
    "gs://madhav-marsys-sources/L3/registers/RESONANCE_REGISTER_v1_0.json": "RESONANCE_REGISTER_v1_0.json",
    "gs://madhav-marsys-sources/L3/registers/CLUSTER_ATLAS_v1_0.json":      "CLUSTER_ATLAS_v1_0.json",
    "gs://madhav-marsys-sources/L3/registers/CONTRADICTION_REGISTER_v1_0.json": "CONTRADICTION_REGISTER_v1_0.json",
    "gs://madhav-marsys-sources/L3/registers/INDEX.json":                   "INDEX.json",
}


def _fetch_json_from_gcs(uri: str) -> Any:
    """Load JSON from local canonical source (authoritative per 14E brief §Architectural Commitments).
    Falls back to GCS download only if local file is missing."""
    local_name = _GCS_TO_LOCAL.get(uri)
    if local_name:
        local_path = _LOCAL_REGISTER_DIR / local_name
        if local_path.exists():
            data = json.loads(local_path.read_text())
            log.info("loaded_from_local path=%s", local_path)
            return data

    # Fallback: GCS download
    gcs_path = uri.removeprefix("gs://")
    bucket_name, blob_path = gcs_path.split("/", 1)
    from google.cloud import storage as gcs_storage
    client = gcs_storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_path)
    data = json.loads(blob.download_as_text())
    log.info("loaded_from_gcs uri=%s", uri)
    return data


def load(register_name: str) -> list[Any]:
    """
    Load a register from GCS, validate each entry via Pydantic, and return
    a list of Pydantic model instances.

    :param register_name: One of 'pattern', 'resonance', 'cluster', 'contradiction'.
    :raises KeyError: If register_name is not in REGISTER_CONFIGS.
    :raises ValidationError: If any entry fails Pydantic validation.
    """
    config = REGISTER_CONFIGS[register_name]
    raw = _fetch_json_from_gcs(config["json_uri"])
    entries_key = config["entries_key"]
    raw_entries: list[dict] = raw.get(entries_key, [])
    model = config["pydantic_model"]

    validated: list[Any] = []
    for i, entry in enumerate(raw_entries):
        try:
            validated.append(model(**entry))
        except Exception as exc:
            raise ValueError(f"[{register_name}] entry {i} validation error: {exc}") from exc

    log.info("register_loaded register=%s count=%d", register_name, len(validated))
    return validated
