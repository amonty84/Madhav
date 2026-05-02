'use client'

// Placeholder scaffold — S1.13 will wire real budget data once O.3 lands.
// Exported now so S1.13 can slot it into the dashboard layout without an
// additional component-creation session.

export interface BudgetUtilizationChartProps {
  // Intentionally empty until O.3 (S3.1 budget rules schema + API) lands.
  // S1.13 will extend this signature when wiring.
}

export function BudgetUtilizationChart(_props: BudgetUtilizationChartProps = {}) {
  return (
    <div
      data-testid="budget-utilization-placeholder"
      className="flex h-72 w-full items-center justify-center rounded border border-dashed text-sm text-muted-foreground"
    >
      Budget rules not yet configured
    </div>
  )
}
