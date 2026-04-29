"""
pipeline.extractors.life_event_extractor — Parse LIFE_EVENT_LOG_v1_2.md from GCS.
Phase 14C Stream E.

Uses line-by-line regex extraction rather than yaml.safe_load because the
native_reflection and description fields contain unquoted colons that break
YAML parsing. We extract only the fields we need for the DB.
"""
from __future__ import annotations

import logging
import re
from datetime import date
from typing import Any

from google.cloud import storage as gcs

log = logging.getLogger(__name__)

SOURCE_URI = "gs://madhav-marsys-sources/L1/facts/LIFE_EVENT_LOG_v1_2.md"
_TEMPLATE_ID = "EVT.YYYY.MM.DD.XX"


def _load_source() -> str:
    bucket_name, blob_path = SOURCE_URI.replace("gs://", "").split("/", 1)
    client = gcs.Client()
    blob = client.bucket(bucket_name).blob(blob_path)
    return blob.download_as_text()


def _parse_approx_date(date_str: str) -> date:
    """
    Parse date strings with 'XX' placeholders for unknown parts.
    '1995-XX-XX' → date(1995, 1, 1); '2001-03-XX' → date(2001, 3, 1).
    'CURRENT' marker → sentinel date(2026, 1, 1).
    """
    if "CURRENT" in date_str:
        return date(2026, 1, 1)
    parts = date_str.strip().split("-")
    year = int(parts[0]) if len(parts) > 0 and parts[0].isdigit() else 2000
    month = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 1
    day = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 1
    return date(year, month, day)


def _extract_simple_field(block: str, field: str) -> str | None:
    """Extract 'field: value' from a block of text, taking only the first line."""
    match = re.search(rf"^\s+{re.escape(field)}:\s+(.+)$", block, re.MULTILINE)
    if match:
        val = match.group(1).strip().strip('"\'')
        return val if val.lower() not in ("null", "~", "") else None
    return None


def _extract_chart_state(block: str) -> dict[str, Any]:
    """
    Extract chart_state_at_event sub-fields from a YAML-formatted block.
    Handles both quoted and unquoted values; skips lines that fail.
    """
    state: dict[str, Any] = {}
    in_chart_state = False
    for line in block.split("\n"):
        stripped = line.lstrip()
        indent = len(line) - len(stripped)
        if "chart_state_at_event:" in line:
            in_chart_state = True
            continue
        if in_chart_state:
            # Stop when we hit a top-level key (indent <= 2) that isn't the sub-fields
            if indent <= 2 and stripped and not stripped.startswith("#"):
                # If this is a key at the chart_state indent level, we're done
                if re.match(r"^[a-z_]+:", stripped) and indent == 2:
                    in_chart_state = False
                    continue
                # Otherwise still inside chart_state nested block
            m = re.match(r"^\s{4}([a-z_]+):\s*(.*)", line)
            if m:
                key = m.group(1)
                val = m.group(2).strip().strip('"\'')
                if val and val.lower() not in ("null", "~"):
                    state[key] = val
    return state


def extract_life_events() -> list[dict[str, Any]]:
    """
    Parse LIFE_EVENT_LOG_v1_2.md and return one dict per event (36 expected).

    Strategy: split the markdown by event ID patterns, then extract fields
    from each segment using targeted regex (avoids YAML parse errors from
    unquoted colons in native_reflection / description fields).
    """
    content = _load_source()

    # Split content at event ID markers (including CURRENT variant)
    # Pattern: start of line EVT.<id>:
    event_boundary = re.compile(r"^(EVT\.[^\n:]+):", re.MULTILINE)
    splits = list(event_boundary.finditer(content))

    rows: list[dict[str, Any]] = []
    for i, match in enumerate(splits):
        event_id = match.group(1).strip()
        if event_id == _TEMPLATE_ID:
            continue
        # Extract block from this EVT: to the next one (or end)
        start = match.start()
        end = splits[i + 1].start() if i + 1 < len(splits) else len(content)
        block = content[start:end]

        raw_date = _extract_simple_field(block, "date") or "2000-01-01"
        event_date = _parse_approx_date(raw_date)
        category = _extract_simple_field(block, "category") or "other"
        magnitude = _extract_simple_field(block, "magnitude") or "moderate"
        date_confidence = _extract_simple_field(block, "date_confidence") or "unknown"

        # Description: take the first line of the description field value
        desc_match = re.search(r"^\s+description:\s+(.+?)(?:\n|$)", block, re.MULTILINE)
        description = desc_match.group(1).strip().strip('"\'') if desc_match else ""

        significance = "major" if magnitude in ("major", "significant", "life-altering") else (
            "minor" if magnitude == "trivial" else "moderate"
        )

        chart_state = _extract_chart_state(block)

        rows.append({
            "event_id": event_id,
            "event_date": event_date,
            "category": category,
            "description": description,
            "significance": significance,
            "chart_state": chart_state,
            "source_section": f"LIFE_EVENT_LOG_v1_2.md §3 — {event_id}",
            "provenance": {
                "source_artifact": "LIFE_EVENT_LOG_v1_2",
                "source_uri": SOURCE_URI,
                "extraction_method": "regex_line_parse",
                "date_confidence": date_confidence,
            },
        })

    count = len(rows)
    if count < 30 or count > 40:
        raise RuntimeError(f"life_event sanity gate: {count} events (expected ~36)")
    log.info("life_event_extractor: extracted %d events from GCS", count)
    return rows
