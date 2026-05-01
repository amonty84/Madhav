/**
 * R7 — Mobile viewport tests.
 * Emulates iPhone SE (375×667), iPhone 14 Pro (414×896), iPad portrait (768×1024).
 * Verifies no overflow and that mobile nav trigger is present on small screens.
 *
 * These tests require a running dev server + authenticated session.
 * Set SMOKE_SESSION_COOKIE and SMOKE_CHART_ID env vars to run.
 *
 * Screenshots are saved to tests/screenshots/r7-mobile/ for manual review.
 */

import { test, expect } from '@playwright/test'
import * as path from 'path'

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14-pro', width: 414, height: 896 },
  { name: 'ipad-portrait', width: 768, height: 1024 },
]

const SCREENSHOT_DIR = path.join(__dirname, '../../screenshots/r7-mobile')

test.describe('mobile responsive', () => {
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

  for (const vp of VIEWPORTS) {
    for (const { name, path: pagePath } of surfaces) {
      test(`${name} at ${vp.name} (${vp.width}×${vp.height}) — no overflow`, async ({ browser }) => {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        })
        const page = await ctx.newPage()
        await page.goto(`${BASE}${pagePath}`)

        // Take screenshot for manual review
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${name.toLowerCase().replace(/ /g, '-')}-${vp.name}.png`),
          fullPage: false,
        })

        // Body should not overflow horizontally
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        expect(bodyWidth).toBeLessThanOrEqual(vp.width + 1) // +1 for sub-pixel rounding

        await ctx.close()
      })
    }

    test(`mobile nav trigger visible at ${vp.name}`, async ({ browser }) => {
      if (vp.width >= 768) return // iPad — rail is visible, no hamburger needed
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      })
      const page = await ctx.newPage()
      await page.goto(`${BASE}/dashboard`)
      const trigger = page.locator('button[aria-label="Open navigation menu"]')
      await expect(trigger).toBeVisible()
      await ctx.close()
    })
  }

  test('RasiChartSVG does not overflow at 375px', async ({ browser }) => {
    const CHART_ID = process.env.SMOKE_CHART_ID ?? 'fixture-chart-id'
    const BASE = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/clients/${CHART_ID}`)
    const svg = page.locator('svg[role="img"]').first()
    const box = await svg.boundingBox()
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375)
    }
    await ctx.close()
  })
})
