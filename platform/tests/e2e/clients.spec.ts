import { test, expect } from '@playwright/test'

test('astrologer can create a client and lands on build page', async ({ page }) => {
  await page.goto('/clients/new')
  await page.fill('[id="name"]', 'Test Client')
  await page.fill('[id="client_email"]', 'testclient@example.com')
  await page.fill('[id="birth_date"]', '1990-01-15')
  await page.fill('[id="birth_time"]', '08:30')
  await page.fill('[id="birth_place"]', 'Mumbai, India')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/clients\/[a-f0-9-]+\/build/)
})
