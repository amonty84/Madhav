'use client'

// Triggers a fresh evaluation against current spend and refreshes the page so
// the SSR-rendered cards + chart pick up the new pct_used. The S3.1 backend
// has only GET /budget-rules/evaluate (no POST /run); calling GET still fully
// re-evaluates against current spend, which is the user-visible intent.

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { evaluateBudgets } from '@/lib/api-clients/observatory'

export function RunEvaluationButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function run() {
    setPending(true)
    setFeedback(null)
    try {
      const { results } = await evaluateBudgets()
      const exceeded = results.filter((r) => r.status === 'exceeded').length
      const alerting = results.filter((r) => r.status === 'alert').length
      setFeedback(
        `Evaluated ${results.length} rule${results.length === 1 ? '' : 's'}` +
          (exceeded > 0 ? ` — ${exceeded} exceeded` : '') +
          (alerting > 0 ? ` — ${alerting} alerting` : ''),
      )
      router.refresh()
    } catch (err) {
      setFeedback(
        err instanceof Error ? `Failed: ${err.message}` : 'Evaluation failed',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        data-testid="budgets-run-evaluation"
        onClick={run}
        disabled={pending}
        className="rounded border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50"
      >
        {pending ? 'Evaluating…' : 'Run evaluation now'}
      </button>
      {feedback ? (
        <span
          role="status"
          aria-live="polite"
          data-testid="budgets-run-feedback"
          className="text-xs text-muted-foreground"
        >
          {feedback}
        </span>
      ) : null}
    </div>
  )
}
