"""
router
MARSYS-JIS RAG Pipeline — query router and query-plan generator.
Phase B.7. Madhav_M2A_Exec_13 (2026-04-27).

Routes natural-language queries to QueryPlan objects for downstream consumption.
Plan types: interpretive_multidomain | interpretive_single | factual | timing | meta.
Static fallback type: exploratory (on API/parse failure only).
Enforces Whole-Chart-Read (B.11 / P3) on interpretive queries via wcr_forced flag.
"""
from __future__ import annotations

import json
import logging
import re
from pathlib import Path

import anthropic

from rag.schemas import QueryPlan

logger = logging.getLogger(__name__)

ANTHROPIC_MODEL = "claude-opus-4-6"

# Resolved relative to the repo root — three parents up from this file:
# platform/python-sidecar/rag/router.py
#   → rag/  → python-sidecar/  → platform/  → repo root
_REPO_ROOT = Path(__file__).resolve().parents[3]
_ROUTER_PROMPT_PATH = (
    _REPO_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "claude" / "router_v1_0.md"
)

_STATIC_FALLBACK_DOMAINS: list[str] = ["all"]


def _load_router_prompt() -> str:
    """
    Read router_v1_0.md and return the body with YAML frontmatter stripped.
    The frontmatter block is delimited by leading '---' and trailing '---'.
    """
    raw = _ROUTER_PROMPT_PATH.read_text(encoding="utf-8")
    # Strip YAML frontmatter: content between first and second '---' lines
    stripped = re.sub(r"^\s*---\n.*?---\n", "", raw, count=1, flags=re.DOTALL)
    return stripped.strip()


def _static_fallback(query: str) -> QueryPlan:
    """Return a schema-valid degraded-mode plan when the API or parse fails."""
    return QueryPlan(
        query_text=query,
        plan_type="exploratory",
        significance_score=0.5,
        domains=_STATIC_FALLBACK_DOMAINS,
        actor="static_fallback",
        wcr_forced=False,
        routing_rationale="",
    )


def classify_query(query: str) -> QueryPlan:
    """
    Classify a natural-language query into a QueryPlan using claude-opus-4-6.

    Calls the Anthropic API with the router prompt as the system message and the
    query as the user message. Parses the JSON response into a QueryPlan, then
    applies the WCR enforcer rule:
        if plan_type in {interpretive_multidomain, interpretive_single}: wcr_forced = True

    On any API exception or JSON parse failure, returns a static fallback QueryPlan
    (plan_type='exploratory', actor='static_fallback') and logs at WARNING.
    """
    system_prompt = _load_router_prompt()
    client = anthropic.Anthropic()

    try:
        message = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=300,
            temperature=0.0,
            system=system_prompt,
            messages=[{"role": "user", "content": query}],
        )
        raw_text = message.content[0].text.strip()

        # Parse JSON — Opus should return raw JSON, but strip any accidental fences
        json_text = re.sub(
            r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.DOTALL
        ).strip()
        parsed = json.loads(json_text)

        # WCR enforcer rule (post-parse; not delegated to Opus)
        wcr_forced = parsed.get("plan_type") in {
            "interpretive_multidomain",
            "interpretive_single",
        }

        plan = QueryPlan(
            query_text=query,
            plan_type=parsed["plan_type"],
            significance_score=float(parsed["significance_score"]),
            domains=parsed.get("domains", []),
            actor=ANTHROPIC_MODEL,
            wcr_forced=wcr_forced,
            routing_rationale=parsed.get("routing_rationale", ""),
        )
        return plan

    except Exception as exc:
        logger.warning(
            "classify_query fallback triggered for query %r: %s: %s",
            query[:80],
            type(exc).__name__,
            exc,
        )
        return _static_fallback(query)
