'use client'

// One card per budget rule. Owns its own confirmation state but delegates the
// actual DELETE+refresh to the parent via onDeactivate so the page can keep
// the API-call surface in one place.

import { useState } from 'react'

import type {
  BudgetEvaluationResult,
  BudgetRuleRow,
} from '@/lib/observatory/budget/types'

import { BudgetStatusChip } from './BudgetStatusChip'

const PROGRESS_BAR_BG_BY_STATUS: Record<string, string> = {
  ok: 'bg-green-500',
  warning: 'bg-amber-500',
  alert: 'bg-red-500',
  exceeded: 'bg-red-600',
}

function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

function alertThresholdsLabel(rule: BudgetRuleRow): string {
  const thresholds = Array.isArray(rule.alert_thresholds)
    ? (rule.alert_thresholds as Array<{ pct: number }>)
    : []
  if (thresholds.length === 0) return 'No alert thresholds configured'
  const pcts = thresholds.map((t) => `${t.pct}%`).join(', ')
  return `Alert at ${pcts}`
}

export interface BudgetRuleCardProps {
  rule: BudgetRuleRow
  /** undefined while evaluation is loading. */
  evaluation?: BudgetEvaluationResult
  /** Parent issues DELETE + refreshes the rules list. */
  onDeactivate: () => void
}

export function BudgetRuleCard({
  rule,
  evaluation,
  onDeactivate,
}: BudgetRuleCardProps) {
  const [confirming, setConfirming] = useState(false)

  const scopeLabel =
    rule.scope === 'total'
      ? 'global (total)'
      : `${rule.scope}: ${rule.scope_value ?? '—'}`

  return (
    <div
      data-testid={`budget-rule-card-${rule.budget_rule_id}`}
      data-rule-id={rule.budget_rule_id}
      className="rounded border bg-background p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground">{rule.name}</div>
          <div className="text-xs text-muted-foreground">
            {scopeLabel} — {rule.period}
          </div>
        </div>
        {evaluation ? (
          <BudgetStatusChip
            status={evaluation.status}
            pct_used={evaluation.pct_used}
          />
        ) : null}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Threshold: {formatUsd(rule.amount_usd)} / {rule.period.replace(/ly$/, '')}
      </div>

      {evaluation ? (
        <>
          <div
            data-testid={`budget-rule-progress-${rule.budget_rule_id}`}
            className="mt-2 h-2 w-full overflow-hidden rounded bg-muted"
            role="progressbar"
            aria-valuenow={Math.min(100, Math.round(evaluation.pct_used))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full ${PROGRESS_BAR_BG_BY_STATUS[evaluation.status] ?? 'bg-gray-400'}`}
              style={{
                width: `${Math.min(100, Math.max(0, evaluation.pct_used))}%`,
              }}
            />
          </div>
          <div
            data-testid={`budget-rule-spend-${rule.budget_rule_id}`}
            className="mt-1 text-xs tabular-nums"
          >
            {formatUsd(evaluation.current_spend_usd)} of{' '}
            {formatUsd(evaluation.amount_usd)}
          </div>
        </>
      ) : (
        <div
          data-testid={`budget-rule-skeleton-${rule.budget_rule_id}`}
          role="status"
          aria-live="polite"
          className="mt-2 h-2 w-full animate-pulse rounded bg-muted"
        />
      )}

      <div className="mt-2 text-xs text-muted-foreground">
        {alertThresholdsLabel(rule)}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {confirming ? (
          <>
            <span className="text-xs">Deactivate this rule?</span>
            <button
              type="button"
              data-testid={`budget-rule-confirm-${rule.budget_rule_id}`}
              onClick={() => {
                setConfirming(false)
                onDeactivate()
              }}
              className="rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded border px-2 py-1 text-xs hover:bg-muted"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            data-testid={`budget-rule-deactivate-${rule.budget_rule_id}`}
            onClick={() => setConfirming(true)}
            className="rounded border px-2 py-1 text-xs hover:bg-muted"
          >
            Deactivate
          </button>
        )}
      </div>
    </div>
  )
}
