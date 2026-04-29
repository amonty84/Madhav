import { test, expect } from '@playwright/test'

/**
 * Portal Redesign R4 — Consume polish E2E smoke tests.
 * Requires SMOKE_SESSION_COOKIE (super_admin) + SMOKE_CHART_ID.
 */

const SESSION_COOKIE = process.env.SMOKE_SESSION_COOKIE
const CHART_ID = process.env.SMOKE_CHART_ID
const SKIP = !SESSION_COOKIE || !CHART_ID

test.describe('Consume polish (R4)', () => {
  test.skip(SKIP, 'SMOKE_SESSION_COOKIE or SMOKE_CHART_ID not set; skipping')

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'session', value: SESSION_COOKIE!, domain: 'localhost', path: '/' },
    ])
  })

  test('consume page renders report gallery by default', async ({ page }) => {
    await page.goto(`/clients/${CHART_ID}/consume`)
    // Gallery cards should be visible (grid layout)
    const cards = page.locator('[class*="grid"] button')
    await expect(cards.first()).toBeVisible()
  })

  test('TierPicker visible to super_admin', async ({ page }) => {
    await page.goto(`/clients/${CHART_ID}/consume`)
    const tierGroup = page.getByRole('group', { name: /audience tier/i })
    await expect(tierGroup).toBeVisible()
    await expect(tierGroup.getByText('Client')).toBeVisible()
    await expect(tierGroup.getByText('Admin')).toBeVisible()
    await expect(tierGroup.getByText('Super')).toBeVisible()
  })

  test('TierPicker persists tier to URL', async ({ page }) => {
    await page.goto(`/clients/${CHART_ID}/consume`)
    const tierGroup = page.getByRole('group', { name: /audience tier/i })
    await tierGroup.getByText('Admin').click()
    await expect(page).toHaveURL(/tier=admin/)
  })

  test('Trace button opens drawer (not inline panel)', async ({ page }) => {
    await page.goto(`/clients/${CHART_ID}/consume`)
    const traceBtn = page.getByRole('button', { name: /trace/i })
    await expect(traceBtn).toBeVisible()
    await traceBtn.click()
    // Drawer sheet should appear
    const sheet = page.locator('[data-slot="sheet-content"]')
    await expect(sheet).toBeVisible()
    await expect(sheet).toContainText('Query Trace')
  })

  test('Trace drawer closes when dismissed', async ({ page }) => {
    await page.goto(`/clients/${CHART_ID}/consume`)
    await page.getByRole('button', { name: /trace/i }).click()
    const sheet = page.locator('[data-slot="sheet-content"]')
    await expect(sheet).toBeVisible()
    // Close via the X button inside the sheet
    await page.locator('[data-slot="sheet-close"]').click()
    await expect(sheet).not.toBeVisible()
  })
})
