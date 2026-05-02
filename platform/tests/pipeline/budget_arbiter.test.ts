import { describe, it, expect } from 'vitest'
import {
  arbitrateBudgets,
  type BudgetArbiterConfig,
  type ToolBudget,
} from '@/lib/pipeline/budget_arbiter'

// Token-count helper per W3-UQE-CLEANUP hard constraint (Math.ceil(str.length / 4)).
const tokens = (s: string): number => Math.ceil(s.length / 4)

// available = floor(4000 * 0.85) - 800 - 200 = 3400 - 1000 = 2400
const tightConfig: BudgetArbiterConfig = {
  synthesis_model_max_context: 4000,
  system_prompt_reserve: 800,
  synthesis_guidance_reserve: 200,
  safety_margin: 0.85,
  min_tokens_per_tool: 200,
}
const TIGHT_AVAILABLE = 2400

describe('budget_arbiter — arbitrateBudgets()', () => {
  it('returns tools unchanged when planned_total ≤ available', () => {
    const tools: ToolBudget[] = [
      { tool_name: 'a', priority: 1, token_budget: tokens('x'.repeat(1600)) }, // 400
      { tool_name: 'b', priority: 2, token_budget: tokens('y'.repeat(1600)) }, // 400
      { tool_name: 'c', priority: 3, token_budget: tokens('z'.repeat(1600)) }, // 400
    ]
    const planned = tools.reduce((s, t) => s + t.token_budget, 0)
    expect(planned).toBeLessThanOrEqual(TIGHT_AVAILABLE)

    const result = arbitrateBudgets(tools, tightConfig)
    expect(result).toEqual(tools)
  })

  it('trims priority-3 tools only; p1/p2 untouched', () => {
    const tools: ToolBudget[] = [
      { tool_name: 'p1a', priority: 1, token_budget: tokens('a'.repeat(3200)) }, // 800
      { tool_name: 'p2a', priority: 2, token_budget: tokens('b'.repeat(3200)) }, // 800
      { tool_name: 'p3a', priority: 3, token_budget: tokens('c'.repeat(2400)) }, // 600
      { tool_name: 'p3b', priority: 3, token_budget: tokens('d'.repeat(2400)) }, // 600
    ]
    // total = 800 + 800 + 1200 = 2800; available = 2400; deficit = 400
    // p3 group total = 1200; ratio = 800/1200 = 2/3; each new = floor(600*2/3) = 400
    const result = arbitrateBudgets(tools, tightConfig)
    expect(result[0]).toEqual(tools[0])
    expect(result[1]).toEqual(tools[1])
    expect(result[2].token_budget).toBe(400)
    expect(result[3].token_budget).toBe(400)
    const sum = result.reduce((s, t) => s + t.token_budget, 0)
    expect(sum).toBeLessThanOrEqual(TIGHT_AVAILABLE)
  })

  it('trims priority-3 fully then proportionally trims priority-2', () => {
    const tools: ToolBudget[] = [
      { tool_name: 'p1a', priority: 1, token_budget: tokens('a'.repeat(4000)) }, // 1000
      { tool_name: 'p2a', priority: 2, token_budget: tokens('b'.repeat(3200)) }, // 800
      { tool_name: 'p2b', priority: 2, token_budget: tokens('c'.repeat(3200)) }, // 800
      { tool_name: 'p3a', priority: 3, token_budget: tokens('d'.repeat(1200)) }, // 300
      { tool_name: 'p3b', priority: 3, token_budget: tokens('e'.repeat(1200)) }, // 300
    ]
    // total = 1000 + 1600 + 600 = 3200; deficit = 800
    // p3 total = 600 < deficit → fully trim p3 to 0; deficit = 200
    // p2 total = 1600; ratio = 1400/1600 = 7/8; each new = floor(800 * 7/8) = 700
    const result = arbitrateBudgets(tools, tightConfig)
    expect(result[0].token_budget).toBe(1000) // p1 untouched
    expect(result[1].token_budget).toBe(700)
    expect(result[2].token_budget).toBe(700)
    expect(result[3].token_budget).toBe(0)
    expect(result[4].token_budget).toBe(0)
    const sum = result.reduce((s, t) => s + t.token_budget, 0)
    expect(sum).toBeLessThanOrEqual(TIGHT_AVAILABLE)
  })

  it('respects the priority-1 floor — never reduces a p1 tool below min_tokens_per_tool', () => {
    // Tighter config so the floor binds: available = floor(2000*0.85) - 800 - 200 = 1700 - 1000 = 700
    const cfg: BudgetArbiterConfig = {
      synthesis_model_max_context: 2000,
      system_prompt_reserve: 800,
      synthesis_guidance_reserve: 200,
      safety_margin: 0.85,
      min_tokens_per_tool: 200,
    }
    const tools: ToolBudget[] = [
      { tool_name: 'p1a', priority: 1, token_budget: tokens('a'.repeat(4000)) }, // 1000
      { tool_name: 'p1b', priority: 1, token_budget: tokens('b'.repeat(4000)) }, // 1000
      { tool_name: 'p1c', priority: 1, token_budget: tokens('c'.repeat(4000)) }, // 1000
    ]
    // total = 3000; deficit = 2300; headroom each = 800; total headroom = 2400
    // ratio = 100/2400; new each = 200 + floor(800*100/2400) = 200 + 33 = 233
    const result = arbitrateBudgets(tools, cfg)
    for (const t of result) {
      expect(t.priority).toBe(1)
      expect(t.token_budget).toBeGreaterThanOrEqual(cfg.min_tokens_per_tool)
      expect(t.token_budget).toBeLessThanOrEqual(1000) // never increased
    }
    const sum = result.reduce((s, t) => s + t.token_budget, 0)
    expect(sum).toBeLessThanOrEqual(700)
  })

  it('total after arbitration ≤ available across 10 random inputs (invariant)', () => {
    // Deterministic LCG so failures are reproducible.
    let seed = 0x12345678
    const rand = (): number => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed / 0x100000000
    }

    for (let trial = 0; trial < 10; trial++) {
      const n = 1 + Math.floor(rand() * 8) // 1..8 tools
      const inputs: ToolBudget[] = []
      for (let j = 0; j < n; j++) {
        const priority = (1 + Math.floor(rand() * 3)) as 1 | 2 | 3
        // Sample text whose Math.ceil(str.length/4) lands in [200, 2000].
        const tokenTarget = 200 + Math.floor(rand() * 1801)
        const sampleText = 'x'.repeat(tokenTarget * 4)
        inputs.push({
          tool_name: `t${trial}_${j}`,
          priority,
          token_budget: tokens(sampleText),
        })
      }
      const result = arbitrateBudgets(inputs, tightConfig)
      const sum = result.reduce((s, t) => s + t.token_budget, 0)
      expect(sum).toBeLessThanOrEqual(TIGHT_AVAILABLE)
      // No budget ever increased above its input value.
      for (let j = 0; j < n; j++) {
        expect(result[j].token_budget).toBeLessThanOrEqual(inputs[j].token_budget)
      }
      // Floor honoured for every p1 tool that started above the floor.
      for (let j = 0; j < n; j++) {
        if (inputs[j].priority === 1 && inputs[j].token_budget >= tightConfig.min_tokens_per_tool) {
          expect(result[j].token_budget).toBeGreaterThanOrEqual(tightConfig.min_tokens_per_tool)
        }
      }
    }
  })
})
