"""
prompt_registry.py
AM-JIS RAG Pipeline — Prompt Registry
Per PHASE_B_PLAN_v1_0.md §F.3 Hook 3 + §G B.0 Task 13.
Registers prompt files in 06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json.
"""
import hashlib
import json
import os
from datetime import datetime, timezone
from dataclasses import dataclass
from typing import Optional


@dataclass
class PromptRegistryEntry:
    prompt_id: str
    version: str
    path: str
    hash: str
    introduced_at: str
    deprecated_at: Optional[str] = None
    event_count: int = 0
    performance_metrics: dict = None

    def to_dict(self) -> dict:
        return {
            "prompt_id": self.prompt_id,
            "version": self.version,
            "path": self.path,
            "hash": self.hash,
            "introduced_at": self.introduced_at,
            "deprecated_at": self.deprecated_at,
            "event_count": self.event_count,
            "performance_metrics": self.performance_metrics or {}
        }


REGISTRY_PATH = os.path.join(
    os.path.dirname(__file__),
    "../../../../06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json"
)


def register_prompt(path: str, version: str, prompt_id: Optional[str] = None) -> PromptRegistryEntry:
    """
    Register a prompt file in the PROMPT_REGISTRY/INDEX.json.
    Reads the file at `path`, computes sha256 of its body, writes/updates the registry,
    and returns the PromptRegistryEntry for inline use in ledger events.

    Args:
        path: Relative path to the prompt file (from repo root).
        version: Semver string (e.g., "1.0").
        prompt_id: Optional explicit ID. If None, derived from path basename without extension.

    Returns:
        PromptRegistryEntry with hash, path, version, introduced_at populated.

    Raises:
        FileNotFoundError: If the prompt file does not exist.
        ValueError: If version is not a non-empty string.
    """
    if not version:
        raise ValueError("version must be a non-empty string")

    # Resolve path relative to repo root (two levels up from rag/)
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
    abs_path = os.path.join(repo_root, path)

    if not os.path.isfile(abs_path):
        raise FileNotFoundError(f"Prompt file not found: {abs_path}")

    with open(abs_path, "r", encoding="utf-8") as f:
        body = f.read()

    sha = hashlib.sha256(body.encode("utf-8")).hexdigest()

    if prompt_id is None:
        prompt_id = os.path.splitext(os.path.basename(path))[0]

    entry = PromptRegistryEntry(
        prompt_id=prompt_id,
        version=version,
        path=path,
        hash=f"sha256:{sha}",
        introduced_at=datetime.now(timezone.utc).isoformat(),
    )

    # Load or initialize registry
    registry_abs = os.path.abspath(os.path.join(repo_root, "06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json"))
    if os.path.isfile(registry_abs):
        with open(registry_abs, "r", encoding="utf-8") as f:
            registry = json.load(f)
    else:
        registry = {
            "$schema": "06_LEARNING_LAYER/SCHEMAS/prompt_registry_schema_v0_1.json",
            "version": "0.1",
            "produced_at": datetime.now(timezone.utc).isoformat(),
            "produced_by_session": "Madhav_17_B0",
            "entries": []
        }

    # Update or append
    entries = registry.get("entries", [])
    for i, existing in enumerate(entries):
        if existing["prompt_id"] == entry.prompt_id:
            entries[i] = entry.to_dict()
            break
    else:
        entries.append(entry.to_dict())

    registry["entries"] = entries

    os.makedirs(os.path.dirname(registry_abs), exist_ok=True)
    with open(registry_abs, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)

    return entry
