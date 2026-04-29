"""
synthesize
MARSYS-JIS RAG Pipeline — synthesis layer (B.8).
Madhav_M2A_Exec_14 (2026-04-28).

Given a QueryPlan and a retrieval bundle, calls claude-opus-4-6 to produce a
layer-aware SynthesisAnswer. Enforces P5 (bundle-only citations), P6 (UCN
presence check), P7 (3 interpretations when significance >= 0.7), and P8
(confidence + rationale).
"""
from __future__ import annotations

import json
import logging
import re
from pathlib import Path

import anthropic

from rag.schemas import DerivationEntry, QueryPlan, SynthesisAnswer

logger = logging.getLogger(__name__)

ANTHROPIC_MODEL = "claude-opus-4-6"

_REPO_ROOT = Path(__file__).resolve().parents[3]
_SYNTHESIS_PROMPT_PATH = (
    _REPO_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "claude" / "synthesis_v1_0.md"
)

_DOC_TYPE_TO_LAYER: dict[str, str] = {
    "l1_fact": "L1",
    "msr_signal": "L2.5",
    "ucn_section": "L2.5",
    "cgm_node": "L2.5",
    "cdlm_cell": "L2.5",
    "domain_report": "L3",
}


class SynthesisError(Exception):
    """Raised when synthesis fails validation or the Opus API errors."""


def _load_synthesis_prompt() -> str:
    """Read synthesis_v1_0.md and return body with YAML frontmatter stripped."""
    raw = _SYNTHESIS_PROMPT_PATH.read_text(encoding="utf-8")
    stripped = re.sub(r"^\s*---\n.*?---\n", "", raw, count=1, flags=re.DOTALL)
    return stripped.strip()


def _build_bundle_context(plan: QueryPlan, results: list) -> str:
    """Format QueryPlan + retrieval bundle as a structured user message for Opus."""
    domains_str = ", ".join(plan.domains) if plan.domains else "general"
    lines = [
        "QUERY_PLAN:",
        f"  query_text: {plan.query_text}",
        f"  plan_type: {plan.plan_type}",
        f"  significance_score: {plan.significance_score}",
        f"  domains: [{domains_str}]",
        f"  wcr_forced: {plan.wcr_forced}",
        "",
        f"RETRIEVAL_BUNDLE ({len(results)} results, ranked by score):",
        "[",
    ]
    for r in results:
        layer = _DOC_TYPE_TO_LAYER.get(r.doc_type, "L?")
        # Escape any double-quotes in text to keep JSON-like structure readable
        safe_text = r.text.replace('"', '\\"')[:500]
        lines.append(
            f'  {{ "chunk_id": "{r.chunk_id}", "doc_type": "{r.doc_type}", '
            f'"layer": "{layer}", "score": {r.score:.4f}, "text": "{safe_text}" }},'
        )
    lines.append("]")
    return "\n".join(lines)


def synthesize(plan: QueryPlan, results: list) -> SynthesisAnswer:
    """
    Synthesize a layer-aware answer from a QueryPlan and retrieval bundle.

    Single-pass Opus call at temperature=0.2, max_tokens=4096.
    Post-parse enforcements (applied here, not delegated to Opus):
      - p7_triggered = (plan.significance_score >= 0.7)
      - If p7_triggered and len(interpretations) != 3: raises SynthesisError
      - bundle_chunk_ids = [r.chunk_id for r in results]
      - P5: all derivation_ledger chunk_ids must be in bundle_chunk_ids
      - actor = ANTHROPIC_MODEL
    Raises SynthesisError on any API or validation failure.
    """
    from rag.retrieve import RetrievalResult  # lazy import — avoids circular

    system_prompt = _load_synthesis_prompt()
    user_message = _build_bundle_context(plan, results)

    client = anthropic.Anthropic()

    try:
        message = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=4096,
            temperature=0.2,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        raw_text = message.content[0].text.strip()
    except Exception as exc:
        raise SynthesisError(f"Anthropic API call failed: {exc}") from exc

    # Strip accidental markdown fences
    json_text = re.sub(
        r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.DOTALL
    ).strip()

    try:
        parsed = json.loads(json_text)
    except json.JSONDecodeError as exc:
        raise SynthesisError(f"JSON parse failure: {exc}\nRaw: {raw_text[:300]}") from exc

    # ── Post-parse enforcements ────────────────────────────────────────────────

    bundle_chunk_ids: list[str] = [r.chunk_id for r in results]
    p7_triggered: bool = plan.significance_score >= 0.7

    interpretations: list[str] = parsed.get("interpretations", [])
    if p7_triggered and len(interpretations) != 3:
        raise SynthesisError(
            f"P7 violation: significance_score={plan.significance_score} >= 0.7 "
            f"requires exactly 3 interpretations, got {len(interpretations)}."
        )

    # P5: all derivation_ledger chunk_ids must be in bundle
    raw_ledger = parsed.get("derivation_ledger", [])
    for entry in raw_ledger:
        cid = entry.get("chunk_id", "")
        if cid not in bundle_chunk_ids:
            raise SynthesisError(
                f"P5 violation: chunk_id '{cid}' in derivation_ledger is not in the bundle."
            )

    if not raw_ledger:
        raise SynthesisError("derivation_ledger is empty — at least 1 entry required.")

    derivation_ledger = [
        DerivationEntry(
            chunk_id=e["chunk_id"],
            doc_type=e.get("doc_type", ""),
            layer=e.get("layer", ""),
            signal_or_fact_id=e.get("signal_or_fact_id", ""),
            claim_supported=e.get("claim_supported", ""),
        )
        for e in raw_ledger
    ]

    try:
        answer = SynthesisAnswer(
            query_text=plan.query_text,
            plan=plan,
            answer_text=parsed["answer_text"],
            derivation_ledger=derivation_ledger,
            confidence=parsed["confidence"],
            confidence_rationale=parsed.get("confidence_rationale", ""),
            interpretations=interpretations,
            bundle_chunk_ids=bundle_chunk_ids,
            actor=ANTHROPIC_MODEL,
            p7_triggered=p7_triggered,
            p6_enforcement=parsed.get("p6_enforcement", "full"),
        )
    except Exception as exc:
        raise SynthesisError(f"SynthesisAnswer construction failed: {exc}") from exc

    return answer
