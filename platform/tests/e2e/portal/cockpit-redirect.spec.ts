import { test, expect } from '@playwright/test'

/**
 * Portal Redesign R0 — /build → /cockpit permanent redirect smoke tests.
 * These do NOT require authentication; Next.js permanentRedirect fires before
 * the auth check in the cockpit layout.
 */

test.describe('/build → /cockpit redirects', () => {
  test('/build redirects to /cockpit', async ({ page }) => {
    const res = await page.goto('/build', { waitUntil: 'commit' })
    // 308 Permanent Redirect; after following, URL should contain /cockpit
    expect(page.url()).toContain('/cockpit')
    // Response chain includes a 3xx
    expect(res?.status()).toBeLessThan(400)
  })

  test('/build/activity redirects to /cockpit/activity', async ({ page }) => {
    const res = await page.goto('/build/activity', { waitUntil: 'commit' })
    expect(page.url()).toContain('/cockpit/activity')
    expect(res?.status()).toBeLessThan(400)
  })

  test('/build/health redirects to /cockpit/health', async ({ page }) => {
    const res = await page.goto('/build/health', { waitUntil: 'commit' })
    expect(page.url()).toContain('/cockpit/health')
    expect(res?.status()).toBeLessThan(400)
  })

  test('/build/plan redirects to /cockpit/plan', async ({ page }) => {
    const res = await page.goto('/build/plan', { waitUntil: 'commit' })
    expect(page.url()).toContain('/cockpit/plan')
    expect(res?.status()).toBeLessThan(400)
  })
})
