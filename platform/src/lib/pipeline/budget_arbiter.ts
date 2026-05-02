/**
 * Budget arbiter — UQE-5a (W3-UQE-CLEANUP).
 *
 * The LLM planner emits a `token_budget` per tool, but its sum can exceed the
 * synthesis model's effective context window once the system prompt + synthesis
 * guidance reserves are accounted for. `arbitrateBudgets()` enforces a hard
 * cap on planned_total by proportionally trimming low-priority tool budgets
 * first (p3 → p2 → p1), with a per-tool floor protecting priority-1 tools.
 *
 * Pure function: no I/O, no async, no side effects.
 */

export interface BudgetArbiterConfig {
  /** Synthesis model context window (tokens). */
  synthesis_model_max_context: number
  /** Tokens reserved for the system prompt prefix. */
  system_prompt_reserve: number
  /** Tokens reserved for synthesis guidance / instructions. */
  synthesis_guidance_reserve: number
  /** Multiplier applied to the model context to leave headroom (e.g. 0.85). */
  safety_margin: number
  /** Floor below which a priority-1 tool is never trimmed. */
  min_tokens_per_tool: number
}

export interface ToolBudget {
  tool_name: string
  priority: 1 | 2 | 3
  token_budget: number
}

/**
 * Returns tools with token_budget values adjusted downward if the planned
 * total exceeds the available envelope. Never increases a budget above its
 * input value. Never reduces a priority-1 tool below
 * `config.min_tokens_per_tool` (priority-1 tools that arrive already below the
 * floor are passed through unchanged).
 */
export function arbitrateBudgets(
  tools: ToolBudget[],
  config: BudgetArbiterConfig,
): ToolBudget[] {
  const available =
    Math.floor(config.synthesis_model_max_context * config.safety_margin) -
    config.system_prompt_reserve -
    config.synthesis_guidance_reserve

  const plannedTotal = tools.reduce((s, t) => s + t.token_budget, 0)
  if (plannedTotal <= available) return tools

  const out = tools.map((t) => ({ ...t }))
  let deficit = plannedTotal - available

  // p3 first, then p2: floor = 0, can be trimmed away entirely.
  for (const pri of [3, 2] as const) {
    if (deficit <= 0) break
    const idxs: number[] = []
    for (let i = 0; i < out.length; i++) {
      if (out[i].priority === pri) idxs.push(i)
    }
    const groupTotal = idxs.reduce((s, i) => s + out[i].token_budget, 0)
    if (groupTotal <= 0) continue

    if (deficit >= groupTotal) {
      for (const i of idxs) out[i].token_budget = 0
      deficit -= groupTotal
    } else {
      const ratio = (groupTotal - deficit) / groupTotal
      for (const i of idxs) {
        out[i].token_budget = Math.floor(out[i].token_budget * ratio)
      }
      deficit = 0
    }
  }

  // p1: trim only the headroom above min_tokens_per_tool, proportionally.
  if (deficit > 0) {
    const idxs: number[] = []
    for (let i = 0; i < out.length; i++) {
      if (out[i].priority === 1 && out[i].token_budget > config.min_tokens_per_tool) {
        idxs.push(i)
      }
    }
    const headroomTotal = idxs.reduce(
      (s, i) => s + (out[i].token_budget - config.min_tokens_per_tool),
      0,
    )
    if (headroomTotal > 0) {
      const trim = Math.min(deficit, headroomTotal)
      const ratio = (headroomTotal - trim) / headroomTotal
      for (const i of idxs) {
        const above = out[i].token_budget - config.min_tokens_per_tool
        out[i].token_budget = config.min_tokens_per_tool + Math.floor(above * ratio)
      }
    }
  }

  return out
}
