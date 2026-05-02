'use client'

interface Props {
  inputTokens: number
  outputTokens: number
  cacheTokens: number
}

/** Three-segment proportional bar (input / output / cache). Pure presentational. */
export function TokenSplitBar({ inputTokens, outputTokens, cacheTokens }: Props) {
  const total = Math.max(0, inputTokens) + Math.max(0, outputTokens) + Math.max(0, cacheTokens)
  if (total <= 0) {
    return (
      <div data-testid="token-split-empty" className="h-1.5 w-full rounded-full bg-muted" />
    )
  }
  const inPct = (inputTokens / total) * 100
  const outPct = (outputTokens / total) * 100
  const cachePct = 100 - inPct - outPct
  return (
    <div
      data-testid="token-split"
      title={`Input ${inputTokens.toLocaleString()} · Output ${outputTokens.toLocaleString()} · Cache ${cacheTokens.toLocaleString()}`}
      className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <span
        data-testid="token-split-input"
        style={{ width: `${inPct}%` }}
        className="block bg-sky-500"
      />
      <span
        data-testid="token-split-output"
        style={{ width: `${outPct}%` }}
        className="block bg-violet-500"
      />
      <span
        data-testid="token-split-cache"
        style={{ width: `${cachePct}%` }}
        className="block bg-emerald-500"
      />
    </div>
  )
}
