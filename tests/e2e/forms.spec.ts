/**
 * E2E Tests for Forms
 * Validates booking form functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Booking Form', () => {
  test('booking page loads', async ({ page }) => {
    await page.goto('/book');
    
    // Check page loaded
    await expect(page).toHaveTitle(/Book|Schedule|Appointment/i);
    
    // Check form exists
    await expect(page.locator('form')).toBeVisible();
  });

  test('contact page form exists', async ({ page }) => {
    await page.goto('/contact');
    
    // Check form elements exist
    await expect(page.locator('input[type="text"], input[type="email"], input[name="name"]').first()).toBeVisible();
  });
});

test.describe('CTA Buttons', () => {
  test('phone CTA links have correct tel: format', async ({ page }) => {
    await page.goto('/');
    
    // Find call buttons/links
    const phoneLinks = page.locator('a[href^="tel:"]');
    const count = await phoneLinks.count();
    
    // Should have at least one phone link
    expect(count).toBeGreaterThan(0);
    
    // Check format of first phone link
    const href = await phoneLinks.first().getAttribute('href');
    expect(href).toMatch(/^tel:\d+$/);
  });

  test('booking CTAs link to /book', async ({ page }) => {
    await page.goto('/');
    
    // Find book/schedule buttons
    const bookLinks = page.locator('a[href="/book"]');
    const count = await bookLinks.count();
    
    // Should have booking links on homepage
    expect(count).toBeGreaterThan(0);
  });
});
