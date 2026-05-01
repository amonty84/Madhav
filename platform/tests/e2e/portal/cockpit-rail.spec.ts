import { test, expect } from '@playwright/test'

/**
 * Portal Redesign R6 — Cockpit rail promotion smoke tests.
 * Requires an authenticated super_admin session cookie.
 * Skipped in CI unless SMOKE_SESSION_COOKIE is set.
 */

const SESSION_COOKIE = process.env.SMOKE_SESSION_COOKIE
const SKIP = !SESSION_COOKIE

test.describe('R6 — Cockpit rail + ActiveChartsWidget', () => {
  test.skip(SKIP, 'SMOKE_SESSION_COOKIE not set; skipping authenticated smoke tests')

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'session', value: SESSION_COOKIE!, domain: 'localhost', path: '/' },
    ])
  })

  test('rail order: Roster before Cockpit before Admin', async ({ page }) => {
    await page.goto('/dashboard')
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    const links = nav.getByRole('link')
    const hrefs: string[] = []
    for (const link of await links.all()) {
      const href = await link.getAttribute('href')
      if (href) hrefs.push(href)
    }
    const rosterIdx = hrefs.findIndex((h) => h === '/dashboard')
    const cockpitIdx = hrefs.findIndex((h) => h === '/cockpit')
    const adminIdx = hrefs.findIndex((h) => h === '/admin')
    expect(rosterIdx).toBeGreaterThanOrEqual(0)
    expect(cockpitIdx).toBeGreaterThan(rosterIdx)
    expect(adminIdx).toBeGreaterThan(cockpitIdx)
  })

  test('super_admin: Cockpit rail link navigates to /cockpit', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: 'Cockpit' }).click()
    await expect(page).toHaveURL('/cockpit')
  })

  test('Cockpit page shows ActiveChartsWidget section', async ({ page }) => {
    await page.goto('/cockpit')
    await expect(page.getByText('Active charts')).toBeVisible()
  })

  test('Sigil on /cockpit links back to /dashboard', async ({ page }) => {
    await page.goto('/cockpit')
    await page.getByRole('link', { name: /MARSYS-JIS/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})
