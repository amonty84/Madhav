"""
ab_runner.py — A/B comparison driver.

Calls runner.py twice: once with --planner-off (control) and once with
--planner-on (treatment). Computes per-dimension deltas and a verdict.

Usage:
    python3 platform/scripts/eval/ab_runner.py
        [--base-url http://localhost:3000]
        [--chart-id <uuid>] [--session-cookie <cookie>]
        [--output 00_ARCHITECTURE/EVAL/AB_RUN_<date>.json]

Environment is read the same way runner.py reads it.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import runner as eval_runner  # noqa: E402

VERDICT_THRESHOLD = 0.05


def run_branch(
    args: argparse.Namespace,
    planner_on: bool,
    judge_enabled: bool,
) -> dict[str, Any]:
    fixtures = eval_runner.load_fixtures(Path(args.fixtures), None)
    label = "treatment" if planner_on else "control"
    print(f"\n── Branch: {label} (planner {'ON' if planner_on else 'OFF'}) ──")
    os.environ["MARSYS_FLAG_PER_TOOL_PLANNER_ENABLED"] = "true" if planner_on else "false"

    records: list[dict[str, Any]] = []
    for fixture in fixtures:
        record = eval_runner.run_one(
            fixture,
            args.base_url,
            args.chart_id,
            args.session_cookie,
            args.timeout,
            judge_enabled,
        )
        records.append(record)
        s = record["scores"]
        print(
            f"  {record['fixture_id']} {record['status']:<8} "
            f"wtd={s['weighted']:.2f} ({record['latency_ms']}ms)"
        )
    agg = eval_runner.aggregate(records)
    return {"aggregate": agg, "results": records}


def compute_delta(control_agg: dict[str, Any], treatment_agg: dict[str, Any]) -> dict[str, float]:
    keys = ("keyword_recall", "signal_recall", "synthesis", "weighted")
    return {k: round(treatment_agg[k] - control_agg[k], 4) for k in keys}


def verdict_for(weighted_delta: float) -> str:
    if weighted_delta > VERDICT_THRESHOLD:
        return "PLANNER_HELPS"
    if weighted_delta < -VERDICT_THRESHOLD:
        return "PLANNER_HURTS"
    return "PLANNER_NEUTRAL"


def per_fixture_delta(
    control_results: list[dict[str, Any]],
    treatment_results: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    by_id = {r["fixture_id"]: r for r in control_results}
    rows: list[dict[str, Any]] = []
    for tr in treatment_results:
        fid = tr["fixture_id"]
        cr = by_id.get(fid)
        if cr is None:
            continue
        rows.append({
            "fixture_id": fid,
            "type": tr["type"],
            "control": cr["scores"],
            "treatment": tr["scores"],
            "delta_weighted": round(tr["scores"]["weighted"] - cr["scores"]["weighted"], 4),
            "control_status": cr["status"],
            "treatment_status": tr["status"],
        })
    return rows


def print_summary(control_agg: dict, treatment_agg: dict, delta: dict, verdict: str) -> None:
    print()
    print("A/B COMPARISON: Planner OFF vs ON")
    print(f"{'Metric':<18}{'Control':>10}{'Treatment':>12}{'Delta':>10}")
    print("─" * 50)
    for k in ("keyword_recall", "signal_recall", "synthesis", "weighted"):
        sign = "+" if delta[k] >= 0 else ""
        print(f"{k:<18}{control_agg[k]:>10.4f}{treatment_agg[k]:>12.4f}{sign}{delta[k]:>9.4f}")
    print(f"\nVerdict: {verdict}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="A/B compare planner OFF vs ON")
    parser.add_argument("--fixtures", default=str(eval_runner.DEFAULT_FIXTURES))
    parser.add_argument("--base-url", default=os.environ.get("EVAL_BASE_URL", eval_runner.DEFAULT_BASE_URL))
    parser.add_argument("--chart-id", default=os.environ.get("SMOKE_CHART_ID", ""))
    parser.add_argument("--session-cookie", default=os.environ.get("SMOKE_SESSION_COOKIE", ""))
    parser.add_argument("--timeout", type=int, default=eval_runner.DEFAULT_TIMEOUT_S)
    parser.add_argument("--output", default="")
    parser.add_argument("--no-judge", action="store_true")
    args = parser.parse_args(argv)

    if not args.chart_id:
        print("ERROR: --chart-id (or SMOKE_CHART_ID env) required", file=sys.stderr)
        return 2

    judge_enabled = not args.no_judge
    control = run_branch(args, planner_on=False, judge_enabled=judge_enabled)
    treatment = run_branch(args, planner_on=True, judge_enabled=judge_enabled)

    delta = compute_delta(control["aggregate"], treatment["aggregate"])
    verdict = verdict_for(delta["weighted"])
    per_fix = per_fixture_delta(control["results"], treatment["results"])

    out = {
        "run_date": datetime.now(timezone.utc).isoformat(),
        "fixture_count": control["aggregate"]["fixture_count"],
        "base_url": args.base_url,
        "judge_enabled": judge_enabled,
        "control": control,
        "treatment": treatment,
        "delta": delta,
        "verdict": verdict,
        "verdict_threshold": VERDICT_THRESHOLD,
        "per_fixture": per_fix,
    }

    if args.output:
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output).write_text(json.dumps(out, indent=2), encoding="utf-8")
        print(f"\nFull A/B results written to: {args.output}")

    print_summary(control["aggregate"], treatment["aggregate"], delta, verdict)
    return 0


if __name__ == "__main__":
    sys.exit(main())
