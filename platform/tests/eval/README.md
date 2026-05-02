# Planner Evaluation Harness — Golden Test Set

This directory holds the labeled `(query → expected_tool_plan)` corpus that
`W2-EVAL-B` (Round 4) will use to score the LLM-first planner. The data lives
in `golden_test_set.json`; the runner that consumes it is **not** in this
session's scope.

## File layout

```
tests/eval/
  golden_test_set.json    # 25 labeled entries
  README.md               # this file
```

## Entry shape

```jsonc
{
  "id": "GT.NNN",                      // stable identifier, sortable
  "query": "...",                      // natural-language input the user would type
  "query_class": "remedial | interpretive | predictive | cross_domain | discovery | holistic | remedial | cross_native",
  "category":    "remedial | interpretive | predictive | holistic | planetary | edge_case",
  "expected_tools":  ["tool_a", "tool_b", ...],   // full set a correct planner SHOULD pick
  "required_tools":  ["tool_a"],                  // subset that MUST appear; empty list = no hard requirement
  "forbidden_tools": ["tool_z"],                  // tools that MUST NOT appear
  "notes": "Why this example is in the set, and what it exercises."
}
```

`query_class` is the QueryPlan enum value the planner is expected to emit
(load-bearing for downstream bundle composition). `category` is a coarser
grouping used only for distribution coverage in this test set — `planetary`
and `edge_case` are not QueryPlan enum values.

## Distribution

| category      | count |
| ------------- | ----- |
| remedial      | 6     |
| interpretive  | 6     |
| predictive    | 4     |
| holistic      | 4     |
| planetary     | 3     |
| edge_case     | 2     |
| **total**     | 25    |

The two edge cases test planner robustness on degenerate input (single
character) and open-ended ambiguous prompts.

## Grounding

Every non-edge entry assumes the MARSYS-JIS native (Abhisek Mohanty,
born 1984-02-05 10:43 IST, Bhubaneswar). The native context block at the
top of `golden_test_set.json` records the canonical chart facts and the
mahadasha state at authoring time so planners can be evaluated against
the right contextual baseline. `expected_tools` values are derived from
the actual capability of each tool in `platform/src/lib/retrieve/` —
not from current `classify()` heuristics.

## Scoring formula

For each entry, given `predicted` (the planner's `tools_authorized` output)
and `expected` (the entry's `expected_tools`):

```
tool_recall    = |predicted ∩ expected| / |expected|
tool_precision = |predicted ∩ expected| / |predicted|
```

`required_tools` and `forbidden_tools` are hard gates layered on top of
recall/precision:

- An entry **fails** (score → 0) if any tool in `required_tools` is
  missing from `predicted`.
- An entry **fails** (score → 0) if any tool in `forbidden_tools` appears
  in `predicted`.

Otherwise the entry passes the gates and the recall/precision values
flow into the macro-averaged report.

## Acceptance thresholds

`W2-EVAL-B` will treat the planner as passing the eval when, across all 25
entries:

- macro-averaged **tool_recall ≥ 0.80**
- macro-averaged **tool_precision ≥ 0.90**

Both numbers are computed over entries that pass the `required_tools` /
`forbidden_tools` gates. Entries that fail a gate count as 0 for both
metrics, so gate failures pull both averages down.

The thresholds reflect the asymmetric cost of planner errors: a correct
plan that *misses* a useful tool degrades answer quality (recall ≥ 0.80
allows up to one useful tool missed in a 5-tool plan); a plan that
*adds* an unrelated tool burns cost and tokens (precision ≥ 0.90 keeps
that within ~10% of the plan).

## Maintenance

When a tool is added, removed, or renamed in `platform/src/lib/retrieve/`:

1. Update the `available_tools` array at the top of `golden_test_set.json`.
2. Walk every entry and revise `expected_tools` / `required_tools` /
   `forbidden_tools` to reflect the new capability surface.
3. Bump the `$schema_version` if the entry shape changes.

Do **not** rebalance the distribution silently — the 6/6/4/4/3/2 split is
load-bearing for category coverage and is referenced from the
`CLAUDECODE_BRIEF.md` for `W2-EVAL-A`.
