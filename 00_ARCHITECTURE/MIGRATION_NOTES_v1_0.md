---
artifact: MIGRATION_NOTES_v1_0.md
version: 1.0
status: LIVING
---

# MARSYS-JIS Migration Notes

## MIG-1: LLM_FIRST_PLANNER_ENABLED retirement (target: v2.1)

**Current state (v2.0):** `LLM_FIRST_PLANNER_ENABLED` defaults to `false`.
The LLM planner (`callLlmPlanner`) is implemented and gated; the legacy
`classify() + compose_bundle()` path runs by default.

**Activation:** Set `MARSYS_FLAG_LLM_FIRST_PLANNER_ENABLED=true` in env to
enable the LLM planner. Validate with `npx tsx platform/tests/eval/planner_smoke_runner.ts`.
Accept if avg_tool_recall ≥ 0.80 and avg_tool_precision ≥ 0.90.

**Retirement (v2.1):**
1. Flip DEFAULT_FLAGS: `LLM_FIRST_PLANNER_ENABLED: true`
2. Run full eval smoke test; confirm thresholds pass in production
3. Delete `classify.ts` and `compose_bundle()` call in `route.ts`
4. Remove the `planSchema === null` fallback branch from `route.ts`
5. Remove `LLM_FIRST_PLANNER_ENABLED` from FeatureFlag union and DEFAULT_FLAGS
6. Bump platform version to 2.1

**Prerequisite for retirement:** Native acceptance of planner quality on 5+
consecutive production queries. Run `planner_ab_compare.ts` as final gate.
