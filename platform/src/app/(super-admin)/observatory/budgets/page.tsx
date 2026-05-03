// Observatory Budgets page (O.3 — S3.3). Server component. Reads from the
// frozen S3.1 backend loaders (listBudgetRules, evaluateAllRules) — semantic
// equivalent of the API client's fetchBudgetRules + evaluateBudgets, but
// usable from RSC without absolute-URL gymnastics. AuthGate is enforced by
// the parent layout.

import {
  BudgetsRulesList,
  CreateBudgetRuleSection,
  RunEvaluationButton,
} from '@/lib/components/observatory/budget'
import { BudgetUtilizationChart } from '@/lib/components/observatory/charts/BudgetUtilizationChart'
import { evaluateAllRules } from '@/lib/observatory/budget/evaluate'
import { listBudgetRules } from '@/lib/observatory/budget/persist'

export const dynamic = 'force-dynamic'

export default async function ObservatoryBudgetsPage() {
  const [rules, evaluations] = await Promise.all([
    listBudgetRules('active'),
    evaluateAllRules(),
  ])

  return (
    <div data-testid="observatory-budgets-page" className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Budget Rules</h1>
        <RunEvaluationButton />
      </div>

      <section aria-label="Utilisation summary">
        <BudgetUtilizationChart results={evaluations} />
      </section>

      <section aria-label="Active rules" className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Active rules</h2>
        <BudgetsRulesList rules={rules} evaluations={evaluations} />
      </section>

      <section aria-label="Add budget rule" className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Add budget rule</h2>
        <CreateBudgetRuleSection />
      </section>
    </div>
  )
}
