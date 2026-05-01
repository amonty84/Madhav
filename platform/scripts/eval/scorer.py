"""
scorer.py — eval-harness scoring functions.

Three primitives:
  - keyword_recall_score: case-insensitive substring presence
  - signal_recall_score:  exact MSR.NNN / SIG.MSR.NNN match
  - synthesis_score:      Haiku-as-judge against gold_answer_summary

Plus a weighted_score combiner that respects per-fixture weights.

Haiku model id is sourced from platform/src/lib/models/registry.ts
(`TITLE_MODEL_ID = 'claude-haiku-4-5'`) — read at import time, no
hardcoded literal here.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Iterable

# ── Haiku model resolution (from codebase, not a literal) ─────────────────────

REGISTRY_PATH_REL = "platform/src/lib/models/registry.ts"
HAIKU_RE = re.compile(r"TITLE_MODEL_ID\s*=\s*'([^']+)'")


def resolve_haiku_model(repo_root: Path | None = None) -> str:
    """
    Read the Haiku model id from the TS registry. Falls back to a documented
    default only if the file is unreadable, and prints a warning to stderr.
    """
    if repo_root is None:
        repo_root = Path(__file__).resolve().parents[3]
    registry = repo_root / REGISTRY_PATH_REL
    try:
        m = HAIKU_RE.search(registry.read_text(encoding="utf-8"))
        if m:
            return m.group(1)
    except OSError as err:
        print(f"[scorer] WARNING: could not read {registry}: {err}", file=sys.stderr)
    print(
        f"[scorer] WARNING: Haiku model not found in {registry}; "
        "falling back to claude-haiku-4-5",
        file=sys.stderr,
    )
    return "claude-haiku-4-5"


HAIKU_MODEL = resolve_haiku_model()

# ── Primitive scorers ─────────────────────────────────────────────────────────

SIG_RE = re.compile(r"\bSIG\.MSR\.(\d{1,4})\b|\bMSR\.(\d{1,4})\b")


def keyword_recall_score(response_text: str, fixture: dict[str, Any]) -> float:
    expected: list[str] = fixture.get("expected_keywords") or []
    if not expected:
        return 1.0
    haystack = response_text.lower()
    found = sum(1 for kw in expected if kw.lower() in haystack)
    return found / len(expected)


def _normalize_signal(token: str) -> str:
    digits = re.sub(r"\D", "", token)
    return f"SIG.MSR.{int(digits):03d}" if digits else token


def signal_recall_score(response_text: str, fixture: dict[str, Any]) -> float:
    expected: list[str] = fixture.get("expected_signals") or []
    if not expected:
        return 1.0
    found_set: set[str] = set()
    for match in SIG_RE.finditer(response_text):
        digits = match.group(1) or match.group(2)
        found_set.add(f"SIG.MSR.{int(digits):03d}")
    expected_set = {_normalize_signal(s) for s in expected}
    if not expected_set:
        return 1.0
    hits = sum(1 for sig in expected_set if sig in found_set)
    return hits / len(expected_set)


def synthesis_score(
    response_text: str,
    fixture: dict[str, Any],
    model: str = HAIKU_MODEL,
) -> float:
    """
    Use Haiku as a judge on a 0.0-1.0 scale. On any failure (no API key,
    HTTP error, malformed JSON), return 0.5 with a stderr warning.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print(
            "[scorer] WARNING: ANTHROPIC_API_KEY not set; "
            "synthesis_score returning 0.5",
            file=sys.stderr,
        )
        return 0.5

    try:
        from anthropic import Anthropic  # type: ignore
    except ImportError:
        print(
            "[scorer] WARNING: anthropic SDK not installed; "
            "synthesis_score returning 0.5",
            file=sys.stderr,
        )
        return 0.5

    gold = fixture.get("gold_answer_summary", "")
    user_prompt = f"Gold: {gold}\nAnswer: {response_text[:800]}"
    system_prompt = (
        "You are an expert Jyotish evaluator. Score this answer from 0.0 to 1.0 "
        "on synthesis quality given the gold answer summary. Output JSON: "
        '{"score": 0.0-1.0, "reason": "<one sentence>"}. Be strict.'
    )

    try:
        client = Anthropic(api_key=api_key)
        msg = client.messages.create(
            model=model,
            max_tokens=200,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = "".join(
            getattr(block, "text", "") for block in msg.content if hasattr(block, "text")
        ).strip()
    except Exception as err:  # noqa: BLE001 — judge calls are best-effort
        print(f"[scorer] WARNING: Haiku judge call failed: {err}", file=sys.stderr)
        return 0.5

    return _parse_score(text)


def _parse_score(text: str) -> float:
    if not text:
        return 0.5
    match = re.search(r"\{[^{}]*\}", text, re.DOTALL)
    candidate = match.group(0) if match else text
    try:
        obj = json.loads(candidate)
        score = float(obj.get("score", 0.5))
        return max(0.0, min(1.0, score))
    except (json.JSONDecodeError, TypeError, ValueError):
        return 0.5


def weighted_score(
    keyword: float,
    signal: float,
    synthesis: float,
    weights: dict[str, float],
) -> float:
    return (
        keyword * float(weights.get("keyword_recall", 0.0))
        + signal * float(weights.get("signal_recall", 0.0))
        + synthesis * float(weights.get("synthesis", 0.0))
    )


def validate_weights(fixtures: Iterable[dict[str, Any]]) -> list[str]:
    """Return list of fixture_ids whose weights don't sum to 1.0 (±0.001)."""
    bad: list[str] = []
    for f in fixtures:
        w = f.get("scoring_weights", {})
        total = (
            float(w.get("keyword_recall", 0.0))
            + float(w.get("signal_recall", 0.0))
            + float(w.get("synthesis", 0.0))
        )
        if abs(total - 1.0) > 0.001:
            bad.append(f.get("fixture_id", "<unknown>"))
    return bad


if __name__ == "__main__":
    fixtures_path = Path(__file__).parent / "fixtures.json"
    data = json.loads(fixtures_path.read_text(encoding="utf-8"))
    bad = validate_weights(data["fixtures"])
    if bad:
        print(f"FAIL — weights do not sum to 1.0 for: {', '.join(bad)}")
        sys.exit(1)
    print(f"OK — {len(data['fixtures'])} fixtures, all weights sum to 1.0")
    print(f"Haiku model resolved: {HAIKU_MODEL}")
