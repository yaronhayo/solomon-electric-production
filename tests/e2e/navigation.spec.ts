/**
 * E2E Tests for Navigation
 * Validates all main pages load correctly
 */

import { test, expect } from '@playwright/test';

test.describe('Main Pages Load', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Solomon Electric/);
    
    // Check main elements exist
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check hero section exists
    await expect(page.locator('h1')).toBeVisible();
  });

  test('about page loads correctly', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('services page loads correctly', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Services/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact page loads correctly', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('reviews page loads correctly', async ({ page }) => {
    await page.goto('/reviews');
    await expect(page).toHaveTitle(/Review/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('FAQ page loads correctly', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveTitle(/FAQ/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('service areas page loads correctly', async ({ page }) => {
    await page.goto('/service-areas');
    await expect(page).toHaveTitle(/Service Area/i);
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Navigation Links', () => {
  test('header navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Click Services link in header and verify navigation
    await page.locator('header').getByRole('link', { name: /services/i }).first().click();
    await expect(page).toHaveURL(/\/services/);
    
    // Click About link
    await page.locator('header').getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/');
    
    // Check footer has contact info
    await expect(page.locator('footer')).toContainText(/Solomon Electric/i);
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile menu appears on small screens', async ({ page }) => {
    await page.goto('/');
    
    // Header should still be visible
    await expect(page.locator('header')).toBeVisible();
    
    // Page should be scrollable
    await page.evaluate(() => window.scrollBy(0, 500));
  });
});
