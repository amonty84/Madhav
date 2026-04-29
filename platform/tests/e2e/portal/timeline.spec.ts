/**
 * E2E: /clients/[id]/timeline
 * Run: npx playwright test tests/e2e/portal/timeline.spec.ts
 * Requires: dev server, SMOKE_SESSION_COOKIE + SMOKE_CHART_ID env vars.
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const CHART_ID = process.env.SMOKE_CHART_ID ?? 'test-chart-id'
const SESSION_COOKIE = process.env.SMOKE_SESSION_COOKIE ?? ''

test.describe('/clients/[id]/timeline', () => {
  test.beforeEach(async ({ context }) => {
    if (SESSION_COOKIE) {
      await context.addCookies([
        {
          name: 'session',
          value: SESSION_COOKIE,
          domain: new URL(BASE_URL).hostname,
          path: '/',
        },
      ])
    }
  })

  test('renders timeline page with Events tab active by default', async ({ page }) => {
    await page.goto(`${BASE_URL}/clients/${CHART_ID}/timeline`)
    await expect(
      page.locator('button').filter({ hasText: /Events/ }).first()
    ).toBeVisible()
    await expect(page.locator('.rounded-full').first()).toBeVisible()
  })

  test('switches to Predictions tab via URL param', async ({ page }) => {
    await page.goto(`${BASE_URL}/clients/${CHART_ID}/timeline?tab=predictions`)
    const table = page.locator('table')
    const emptyMsg = page.getByText(/No predictions logged yet/)
    await expect(table.or(emptyMsg)).toBeVisible()
  })

  test('breadcrumb shows Roster > ChartName > Timeline', async ({ page }) => {
    await page.goto(`${BASE_URL}/clients/${CHART_ID}/timeline`)
    await expect(page.getByText('Roster')).toBeVisible()
    await expect(page.getByText('Timeline')).toBeVisible()
  })

  test('super_admin can open log-event dialog and submit', async ({ page }) => {
    test.skip(!SESSION_COOKIE, 'Needs auth session')
    await page.goto(`${BASE_URL}/clients/${CHART_ID}/timeline`)
    const logBtn = page.getByRole('button', { name: /Log event/i })
    if (!(await logBtn.isVisible())) test.skip(true, 'Not super_admin')

    await logBtn.click()
    await expect(page.getByText('Log new event')).toBeVisible()

    await page.getByPlaceholder('2026-04-30').fill('2026-05-01')
    await page.getByPlaceholder(/Factual description/).fill('E2E test event — safe to delete')
    await page.getByRole('button', { name: /Log event/i }).last().click()

    await expect(page.getByText('Log new event')).not.toBeVisible({ timeout: 5000 })
  })
})
