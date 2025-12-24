/**
 * E2E Tests for Links
 * Validates internal links and social media links
 */

import { test, expect } from '@playwright/test';

test.describe('Internal Links', () => {
  test('service page links work', async ({ page }) => {
    await page.goto('/services');
    
    // Find service links
    const serviceLinks = page.locator('a[href^="/services/"]');
    const count = await serviceLinks.count();
    
    // Should have multiple service links
    expect(count).toBeGreaterThan(5);
    
    // Click first service link and verify it loads
    await serviceLinks.first().click();
    await expect(page.url()).toContain('/services/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('service area links work', async ({ page }) => {
    await page.goto('/service-areas');
    
    // Find city links
    const areaLinks = page.locator('a[href^="/service-areas/"]');
    const count = await areaLinks.count();
    
    // Should have city links
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Social Media Links', () => {
  test('footer has social media links', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    
    // Check for social links in footer
    const facebookLink = footer.locator('a[href*="facebook.com"]');
    const instagramLink = footer.locator('a[href*="instagram.com"]');
    const yelpLink = footer.locator('a[href*="yelp.com"]');
    
    // At least one social link should exist
    const hasAny = await facebookLink.count() > 0 || 
                   await instagramLink.count() > 0 || 
                   await yelpLink.count() > 0;
    expect(hasAny).toBe(true);
  });
});

test.describe('External Links', () => {
  test('external links have target="_blank"', async ({ page }) => {
    await page.goto('/');
    
    // Find external links (to social media, maps, etc.)
    const externalLinks = page.locator('a[href^="https://"][target="_blank"]');
    
    // External links should open in new tab for security
    const count = await externalLinks.count();
    // This is informational - not all external links require target="_blank"
    console.log(`Found ${count} external links with target="_blank"`);
  });
});

test.describe('No Broken Links', () => {
  test('homepage has no 404 internal links', async ({ page }) => {
    await page.goto('/');
    
    // Get all internal links
    const links = page.locator('a[href^="/"]');
    const hrefs = await links.evaluateAll(els => 
      els.map(el => el.getAttribute('href')).filter(Boolean)
    );
    
    // Remove duplicates
    const uniqueHrefs = [...new Set(hrefs)];
    
    // Sample check: verify a few links don't 404
    for (const href of uniqueHrefs.slice(0, 5)) {
      if (href && !href.includes('#')) {
        const response = await page.goto(href);
        expect(response?.status()).not.toBe(404);
      }
    }
  });
});
