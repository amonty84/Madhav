import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReportGallery } from '@/components/consume/ReportGallery'
import type { Report } from '@/lib/db/types'

const makeReport = (id: string, domain: string, updatedAt: string): Report => ({
  id,
  domain,
  title: `${domain} Report`,
  updated_at: updatedAt,
  chart_id: 'chart1',
  content: '',
  created_at: updatedAt,
})

const REPORTS: Report[] = [
  makeReport('r1', 'career',        new Date(Date.now() - 5 * 86_400_000).toISOString()),   // 5d ago — green
  makeReport('r2', 'finance',       new Date(Date.now() - 20 * 86_400_000).toISOString()),  // 20d ago — amber
  makeReport('r3', 'relationships', new Date(Date.now() - 90 * 86_400_000).toISOString()),  // 90d ago — red
]

describe('ReportGallery', () => {
  it('renders a card for each report', () => {
    render(<ReportGallery reports={REPORTS} selectedDomain={null} onSelect={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('shows domain labels and titles', () => {
    render(<ReportGallery reports={REPORTS} selectedDomain={null} onSelect={() => {}} />)
    expect(screen.getByText('career Report')).toBeDefined()
    expect(screen.getByText('finance Report')).toBeDefined()
  })

  it('calls onSelect with domain when card clicked', async () => {
    const onSelect = vi.fn()
    render(<ReportGallery reports={REPORTS} selectedDomain={null} onSelect={onSelect} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(onSelect).toHaveBeenCalledWith('career')
  })

  it('renders empty state when no reports', () => {
    render(<ReportGallery reports={[]} selectedDomain={null} onSelect={() => {}} />)
    expect(screen.getByText(/No reports yet/)).toBeDefined()
  })

  it('applies freshness chip colors based on age', () => {
    const { container } = render(
      <ReportGallery reports={REPORTS} selectedDomain={null} onSelect={() => {}} />
    )
    const chips = container.querySelectorAll('[class*="rounded border"]')
    // Green chip for <14d
    expect(chips[0].className).toContain('emerald')
    // Amber chip for 14–60d
    expect(chips[1].className).toContain('amber')
    // Red chip for >60d
    expect(chips[2].className).toContain('red')
  })
})
