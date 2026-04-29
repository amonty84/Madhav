/**
 * R7 — Accessibility smoke tests.
 * Verifies no gross a11y regressions on redesign surfaces.
 * Full Lighthouse a11y scores require a running dev server + authenticated session;
 * these tests check structural a11y invariants that can run in CI without auth.
 *
 * To run Lighthouse a11y scores manually:
 *   npx lighthouse http://localhost:3000/dashboard --only-categories=accessibility --output=json
 *   (requires SMOKE_SESSION_COOKIE env var for authenticated routes)
 *
 * Target: ≥ 95 Lighthouse a11y score on every surface.
 */

import { test, expect } from '@playwright/test'

// Structural a11y checks (no auth required — just checks page HTML shape).
// These are skipped in CI until a dev server is wired up with fixture auth.
test.describe('a11y structural invariants', () => {
  test.skip(
    !process.env.SMOKE_SESSION_COOKIE,
    'requires SMOKE_SESSION_COOKIE for authenticated routes'
  )

  const CHART_ID = process.env.SMOKE_CHART_ID ?? 'fixture-chart-id'
  const BASE = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'

  const surfaces = [
    { name: 'Roster', path: '/dashboard' },
    { name: 'Chart Profile', path: `/clients/${CHART_ID}` },
    { name: 'Consume', path: `/clients/${CHART_ID}/consume` },
    { name: 'Timeline', path: `/clients/${CHART_ID}/timeline` },
    { name: 'Cockpit', path: '/cockpit' },
  ]

  for (const { name, path } of surfaces) {
    test(`${name}: breadcrumb nav has aria-label`, async ({ page }) => {
      await page.goto(`${BASE}${path}`)
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
      await expect(breadcrumb).toBeVisible()
    })

    test(`${name}: AppShell rail has aria-label on desktop`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
      const page = await ctx.newPage()
      await page.goto(`${BASE}${path}`)
      const rail = page.locator('nav[aria-label="Primary navigation"]')
      await expect(rail).toBeVisible()
      await ctx.close()
    })

    test(`${name}: sortable table headers use button elements (Roster only)`, async ({ page }) => {
      if (name !== 'Roster') return
      await page.goto(`${BASE}${path}`)
      // Switch to table view if needed
      const tableToggle = page.getByRole('button', { name: /table/i })
      if (await tableToggle.isVisible()) await tableToggle.click()
      // Sortable columns must use <button> not onClick on <th>
      const sortButtons = page.locator('th button')
      await expect(sortButtons).toHaveCount(3) // Name, Build%, Last activity
    })
  }

  test('Login: Mandala is aria-hidden', async ({ page }) => {
    await page.goto(`${process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'}/login`)
    const mandala = page.locator('svg[aria-hidden="true"]').first()
    await expect(mandala).toBeAttached()
  })

  test('Chart Profile: RasiChartSVG has role=img and aria-label', async ({ page }) => {
    const BASE = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'
    const CHART_ID = process.env.SMOKE_CHART_ID ?? 'fixture-chart-id'
    await page.goto(`${BASE}/clients/${CHART_ID}`)
    const chart = page.locator('svg[role="img"]').first()
    await expect(chart).toHaveAttribute('aria-label', /Rasi chart/)
  })
})
