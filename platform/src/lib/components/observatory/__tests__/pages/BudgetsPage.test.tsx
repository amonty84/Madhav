import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('server-only', () => ({}))
import { vi } from 'vitest'

// Import the real page module — it's pure JSX with no data dependencies.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import BudgetsPage from '../../../../../app/(super-admin)/observatory/budgets/page'

describe('Observatory Budgets page (O.3 placeholder)', () => {
  it('renders the placeholder text inside an alert region', () => {
    render(<BudgetsPage />)
    const placeholder = screen.getByTestId('observatory-budgets-placeholder')
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toHaveAttribute('role', 'status')
    expect(placeholder).toHaveTextContent(/Phase O\.3/i)
  })
})
