'use client'

// New-budget-rule form. Scope vocabulary aligns to the migration-038 DB CHECK
// (total | provider | model | pipeline_stage) — the S3.3 brief listed the
// older `global | stage | user | conversation` set but the S3.1 types.ts
// already noted user/conversation are out of v1 scope until a migration bump.
// "Global" is the friendly label for `total`.

import { useState, type FormEvent } from 'react'

import { createBudgetRule } from '@/lib/api-clients/observatory'
import {
  PIPELINE_STAGE_OPTIONS,
  PROVIDER_OPTIONS,
} from '@/lib/components/observatory/filters/types'
import type {
  AlertThreshold,
  BudgetPeriod,
  BudgetRuleInput,
  BudgetScope,
} from '@/lib/observatory/budget/types'

const SCOPES: ReadonlyArray<{ value: BudgetScope; label: string }> = [
  { value: 'total', label: 'Global (total)' },
  { value: 'provider', label: 'Provider' },
  { value: 'pipeline_stage', label: 'Pipeline stage' },
  { value: 'model', label: 'Model' },
]

const PERIODS: ReadonlyArray<BudgetPeriod> = ['daily', 'weekly', 'monthly']

const CHANNELS = ['log', 'webhook', 'email'] as const
type Channel = (typeof CHANNELS)[number]

interface ThresholdRow {
  pct: number
  channel: Channel
  /** Local-only: webhook URL. Not submitted until backend supports it. */
  channel_target: string
}

const DEFAULT_THRESHOLDS: ThresholdRow[] = [
  { pct: 80, channel: 'log', channel_target: '' },
  { pct: 95, channel: 'email', channel_target: '' },
]

export interface CreateBudgetRuleFormProps {
  onCreated: () => void
}

export function CreateBudgetRuleForm({ onCreated }: CreateBudgetRuleFormProps) {
  const [name, setName] = useState('')
  const [scope, setScope] = useState<BudgetScope>('total')
  const [scopeValue, setScopeValue] = useState('')
  const [period, setPeriod] = useState<BudgetPeriod>('monthly')
  const [amount, setAmount] = useState<number>(100)
  const [thresholds, setThresholds] = useState<ThresholdRow[]>(DEFAULT_THRESHOLDS)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setScope('total')
    setScopeValue('')
    setPeriod('monthly')
    setAmount(100)
    setThresholds(DEFAULT_THRESHOLDS)
    setError(null)
  }

  function updateThreshold(idx: number, patch: Partial<ThresholdRow>) {
    setThresholds((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)),
    )
  }

  function addThreshold() {
    if (thresholds.length >= 3) return
    setThresholds((prev) => [
      ...prev,
      { pct: 100, channel: 'log', channel_target: '' },
    ])
  }

  function removeThreshold(idx: number) {
    setThresholds((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload: BudgetRuleInput = {
        name: name.trim() || `${scope} ${period} budget`,
        scope,
        scope_value: scope === 'total' ? null : scopeValue.trim() || null,
        period,
        amount_usd: amount,
        alert_thresholds: thresholds.map<AlertThreshold>((t) => ({
          pct: t.pct,
          channel: t.channel,
        })),
        active: true,
      }
      await createBudgetRule(payload)
      reset()
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      data-testid="create-budget-rule-form"
      onSubmit={handleSubmit}
      className="space-y-3 rounded border bg-background p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-xs">
          Name
          <input
            data-testid="create-budget-rule-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monthly Anthropic cap"
            className="mt-1 block w-full rounded border px-2 py-1 text-sm"
          />
        </label>

        <label className="block text-xs">
          Scope
          <select
            data-testid="create-budget-rule-scope"
            value={scope}
            onChange={(e) => {
              setScope(e.target.value as BudgetScope)
              setScopeValue('')
            }}
            className="mt-1 block w-full rounded border px-2 py-1 text-sm"
          >
            {SCOPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        {scope !== 'total' ? (
          <label className="block text-xs">
            Scope value
            {scope === 'provider' ? (
              <select
                data-testid="create-budget-rule-scope-value"
                data-scope-value-type="provider"
                value={scopeValue}
                onChange={(e) => setScopeValue(e.target.value)}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
              >
                <option value="">Select provider…</option>
                {PROVIDER_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            ) : scope === 'pipeline_stage' ? (
              <select
                data-testid="create-budget-rule-scope-value"
                data-scope-value-type="pipeline_stage"
                value={scopeValue}
                onChange={(e) => setScopeValue(e.target.value)}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
              >
                <option value="">Select stage…</option>
                {PIPELINE_STAGE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <input
                data-testid="create-budget-rule-scope-value"
                data-scope-value-type="text"
                type="text"
                value={scopeValue}
                onChange={(e) => setScopeValue(e.target.value)}
                placeholder={scope === 'model' ? 'e.g. claude-sonnet-4-6' : ''}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
              />
            )}
          </label>
        ) : null}

        <label className="block text-xs">
          Period
          <select
            data-testid="create-budget-rule-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as BudgetPeriod)}
            className="mt-1 block w-full rounded border px-2 py-1 text-sm"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs">
          Threshold (USD)
          <input
            data-testid="create-budget-rule-amount"
            type="number"
            min={0.01}
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 block w-full rounded border px-2 py-1 text-sm tabular-nums"
          />
        </label>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium">Alert at</div>
        {thresholds.map((row, idx) => (
          <div
            key={idx}
            data-testid={`create-budget-rule-threshold-${idx}`}
            className="flex flex-wrap items-center gap-2"
          >
            <input
              data-testid={`create-budget-rule-threshold-pct-${idx}`}
              type="number"
              min={0}
              max={200}
              step={1}
              value={row.pct}
              onChange={(e) =>
                updateThreshold(idx, { pct: Number(e.target.value) })
              }
              className="w-20 rounded border px-2 py-1 text-sm tabular-nums"
            />
            <span className="text-xs">%</span>
            <select
              data-testid={`create-budget-rule-threshold-channel-${idx}`}
              value={row.channel}
              onChange={(e) =>
                updateThreshold(idx, { channel: e.target.value as Channel })
              }
              className="rounded border px-2 py-1 text-sm"
            >
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {row.channel === 'webhook' ? (
              <input
                data-testid={`create-budget-rule-threshold-url-${idx}`}
                type="url"
                value={row.channel_target}
                onChange={(e) =>
                  updateThreshold(idx, { channel_target: e.target.value })
                }
                placeholder="https://example.com/hook"
                className="min-w-[14rem] flex-1 rounded border px-2 py-1 text-sm"
              />
            ) : null}
            {thresholds.length > 1 ? (
              <button
                type="button"
                onClick={() => removeThreshold(idx)}
                className="rounded border px-2 py-1 text-xs hover:bg-muted"
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}
        {thresholds.length < 3 ? (
          <button
            type="button"
            data-testid="create-budget-rule-add-threshold"
            onClick={addThreshold}
            className="rounded border px-2 py-1 text-xs hover:bg-muted"
          >
            + Add threshold
          </button>
        ) : null}
      </div>

      {error ? (
        <div role="alert" className="text-xs text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          data-testid="create-budget-rule-submit"
          disabled={submitting}
          className="rounded border bg-foreground px-3 py-1 text-xs text-background hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create budget rule'}
        </button>
      </div>
    </form>
  )
}
