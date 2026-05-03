'use client'

// Triggers a POST against the scheduled-run endpoint
// (`/api/admin/observatory/budget-rules/evaluate/run`), which both evaluates
// every active rule against current spend AND dispatches alerts for any rule
// whose status is not 'ok'. Wired by USTAD_S3_4 — closes S3.3 AC.6 (the S3.3
// version called the GET /evaluate read-only endpoint, which evaluated but
// never dispatched).

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DispatchOutcome {
  success: boolean
  channel?: string
  error?: string
}

interface DispatchResult {
  rule_id: string
  outcomes: DispatchOutcome[]
}

interface RunResponse {
  evaluated_count: number
  alerts_fired_count: number
  dispatch_results: DispatchResult[]
  evaluated_at: string
}

async function postRunEvaluation(): Promise<RunResponse> {
  const response = await fetch(
    '/api/admin/observatory/budget-rules/evaluate/run',
    {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    },
  )
  if (!response.ok) {
    let message = `Run failed (${response.status})`
    try {
      const body = (await response.json()) as { error?: string; message?: string }
      if (body.message) message = body.message
      else if (body.error) message = body.error
    } catch {
      // body wasn't JSON; keep the status-line default
    }
    throw new Error(message)
  }
  return (await response.json()) as RunResponse
}

function countDispatchErrors(dispatchResults: DispatchResult[]): number {
  let n = 0
  for (const dr of dispatchResults) {
    for (const outcome of dr.outcomes) {
      if (!outcome.success) n += 1
    }
  }
  return n
}

export function RunEvaluationButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorLine, setErrorLine] = useState<string | null>(null)

  async function run() {
    setPending(true)
    setFeedback(null)
    setErrorLine(null)
    try {
      const data = await postRunEvaluation()
      const ruleNoun = data.evaluated_count === 1 ? 'rule' : 'rules'
      const alertNoun = data.alerts_fired_count === 1 ? 'alert' : 'alerts'
      setFeedback(
        `Evaluated ${data.evaluated_count} ${ruleNoun} — ` +
          `${data.alerts_fired_count} ${alertNoun} fired`,
      )
      const errorCount = countDispatchErrors(data.dispatch_results)
      if (errorCount > 0) {
        const errNoun = errorCount === 1 ? 'error' : 'errors'
        setErrorLine(`${errorCount} dispatch ${errNoun} — check logs`)
      }
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
    <div className="flex flex-col items-end gap-1">
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
      {errorLine ? (
        <span
          role="alert"
          data-testid="budgets-run-dispatch-errors"
          className="text-xs text-destructive"
        >
          {errorLine}
        </span>
      ) : null}
    </div>
  )
}
