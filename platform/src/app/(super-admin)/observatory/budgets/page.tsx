// Observatory Budgets page — placeholder until Phase O.3 (S3.3) wires the
// real budget-rules UI. AuthGate is enforced by the parent layout.

export const dynamic = 'force-dynamic'

export default function ObservatoryBudgetsPage() {
  return (
    <div
      data-testid="observatory-budgets-placeholder"
      role="status"
      className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground"
    >
      Budget rules — available in Phase O.3
    </div>
  )
}
