"""
pipeline.extractors.forensic_extractor
MARSYS-JIS Phase 14C Stream B — load CHART_FACTS_EXTRACTION_v1_0.yaml into chart_facts table.

Reads the YAML extraction artifact, validates each fact against CHART_FACTS_SCHEMA_v1_0.json,
and upserts rows into the chart_facts (or chart_facts_staging) Postgres table.

Usage (direct):
    python -m pipeline.extractors.forensic_extractor [--staging]

Schema contract:
    chart_facts(fact_id TEXT PK, category TEXT, divisional_chart TEXT,
                value_text TEXT, value_number NUMERIC, value_json JSONB,
                source_section TEXT, extraction_method TEXT, notes TEXT)
"""
from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
from typing import Any

import jsonschema
import psycopg2
import psycopg2.extras
import yaml

logger = logging.getLogger(__name__)

_REPO_ROOT = Path(__file__).resolve().parents[4]
_YAML_PATH = _REPO_ROOT / "01_FACTS_LAYER" / "STRUCTURED" / "CHART_FACTS_EXTRACTION_v1_0.yaml"
_SCHEMA_PATH = _REPO_ROOT / "01_FACTS_LAYER" / "STRUCTURED" / "CHART_FACTS_SCHEMA_v1_0.json"

_TABLE_LIVE = "chart_facts"
_TABLE_STAGING = "chart_facts_staging"

_UPSERT_SQL = """
INSERT INTO {table} (
    fact_id, category, divisional_chart,
    value_text, value_number, value_json,
    source_section, extraction_method, notes
) VALUES (
    %(fact_id)s, %(category)s, %(divisional_chart)s,
    %(value_text)s, %(value_number)s, %(value_json)s,
    %(source_section)s, %(extraction_method)s, %(notes)s
)
ON CONFLICT (fact_id) DO UPDATE SET
    category          = EXCLUDED.category,
    divisional_chart  = EXCLUDED.divisional_chart,
    value_text        = EXCLUDED.value_text,
    value_number      = EXCLUDED.value_number,
    value_json        = EXCLUDED.value_json,
    source_section    = EXCLUDED.source_section,
    extraction_method = EXCLUDED.extraction_method,
    notes             = EXCLUDED.notes;
"""


def _load_yaml() -> dict[str, Any]:
    with open(_YAML_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


def _load_schema() -> dict[str, Any]:
    with open(_SCHEMA_PATH, encoding="utf-8") as f:
        return json.load(f)


def _validate(data: dict[str, Any], schema: dict[str, Any]) -> list[str]:
    validator = jsonschema.Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: list(e.path))
    return [f"{list(e.path)}: {e.message}" for e in errors]


def _fact_to_row(fact: dict[str, Any]) -> dict[str, Any]:
    value_json = fact.get("value_json")
    return {
        "fact_id": fact["fact_id"],
        "category": fact["category"],
        "divisional_chart": fact["divisional_chart"],
        "value_text": fact.get("value_text"),
        "value_number": fact.get("value_number"),
        "value_json": psycopg2.extras.Json(value_json) if value_json is not None else None,
        "source_section": fact["source_section"],
        "extraction_method": fact.get("extraction_method"),
        "notes": fact.get("notes"),
    }


def run(staging: bool = False, dry_run: bool = False) -> int:
    """
    Load, validate, and upsert all chart facts.
    Returns count of rows upserted.
    """
    table = _TABLE_STAGING if staging else _TABLE_LIVE
    logger.info("forensic_extractor: target table=%s dry_run=%s", table, dry_run)

    data = _load_yaml()
    schema = _load_schema()

    errors = _validate(data, schema)
    if errors:
        for e in errors:
            logger.error("Schema violation: %s", e)
        raise ValueError(f"YAML failed schema validation ({len(errors)} errors)")

    facts = data["facts"]
    logger.info("Loaded %d facts from %s", len(facts), _YAML_PATH.name)

    if dry_run:
        logger.info("dry_run=True — skipping DB write")
        return len(facts)

    db_url = os.environ["DATABASE_URL"]
    rows = [_fact_to_row(f) for f in facts]

    with psycopg2.connect(db_url) as conn:
        with conn.cursor() as cur:
            sql = _UPSERT_SQL.format(table=table)
            psycopg2.extras.execute_batch(cur, sql, rows, page_size=100)
        conn.commit()

    logger.info("Upserted %d rows into %s", len(rows), table)
    return len(rows)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    parser = argparse.ArgumentParser(description="Load chart facts into Postgres")
    parser.add_argument("--staging", action="store_true", help="Write to chart_facts_staging")
    parser.add_argument("--dry-run", action="store_true", help="Validate only, no DB write")
    args = parser.parse_args()
    count = run(staging=args.staging, dry_run=args.dry_run)
    print(f"Done: {count} facts processed.")


if __name__ == "__main__":
    main()
