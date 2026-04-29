import { test, expect } from '@playwright/test'

/**
 * Portal Redesign R1 — Roster smoke tests.
 * Require SMOKE_SESSION_COOKIE (same env contract as stage1-smoke).
 * SMOKE_CHART_ID is optional; used to assert per-chart actions.
 */

const SESSION_COOKIE = process.env.SMOKE_SESSION_COOKIE
const SKIP = !SESSION_COOKIE

test.describe('Roster — R1 features', () => {
  test.skip(SKIP, 'SMOKE_SESSION_COOKIE not set; skipping authenticated smoke tests')

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'session', value: SESSION_COOKIE!, domain: 'localhost', path: '/' },
    ])
  })

  test('stats ribbon is visible', async ({ page }) => {
    await page.goto('/dashboard')
    const ribbon = page.locator('text=charts')
    await expect(ribbon).toBeVisible()
  })

  test('search filter narrows chart list', async ({ page }) => {
    await page.goto('/dashboard')
    const input = page.getByPlaceholder('Search name or place…')
    await expect(input).toBeVisible()
    await input.fill('zzz_no_match_xyz')
    await expect(page.locator('text=No charts match')).toBeVisible()
  })

  test('grid/table toggle switches view', async ({ page }) => {
    await page.goto('/dashboard')
    const group = page.getByRole('group', { name: 'View mode' })
    await expect(group).toBeVisible()
    await group.getByText('table').click()
    await expect(page.locator('table')).toBeVisible()
    await group.getByText('grid').click()
    await expect(page.locator('table')).not.toBeVisible()
  })

  test('table view persists across page reload', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('group', { name: 'View mode' }).getByText('table').click()
    await page.reload()
    // localStorage is preserved; table should still show
    await expect(page.locator('table')).toBeVisible()
  })

  test('URL reflects filter query param', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByPlaceholder('Search name or place…').fill('test')
    await expect(page).toHaveURL(/q=test/)
  })

  test('deep-link with query params pre-fills filters', async ({ page }) => {
    await page.goto('/dashboard?q=Abhisek')
    const input = page.getByPlaceholder('Search name or place…')
    await expect(input).toHaveValue('Abhisek')
  })

  test('empty filter match shows no-results message', async ({ page }) => {
    await page.goto('/dashboard?q=zzz_no_match_xyz')
    await expect(page.locator('text=No charts match')).toBeVisible()
  })
})
