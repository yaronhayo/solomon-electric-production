import { test, expect } from '@playwright/test';

/**
 * Live Site Form Submission Test
 * Targets the production URL to verify real-world email delivery and API functionality.
 */

const LIVE_URL = 'https://www.247electricianmiami.com';

test.describe('Live Site Form Submission', () => {
  // Use a longer timeout for live site tests due to network latency and actual API processing
  test.setTimeout(60000);

  test('should submit live booking form successfully', async ({ page }) => {
    // Add console listener for debugging
    page.on('console', msg => console.log(`LIVE BROWSER LOG [${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.log('LIVE BROWSER ERROR:', err.message));

    // 1. Navigate to live site
    console.log(`Navigating to ${LIVE_URL}/book`);
    await page.goto(`${LIVE_URL}/book`);
    await page.waitForSelector('#booking-serviceType', { state: 'visible' });
    
    // Trigger interaction to ensure scripts load (hover/focus)
    await page.hover('#booking-serviceType');
    await page.focus('#booking-serviceType');
    
    // --- Step 1 ---
    console.log('Filling Step 1 (Live)');
    await page.selectOption('#booking-serviceType', 'electrical_repair');
    await page.waitForTimeout(1000);
    
    console.log('Clicking Continue on Step 1');
    const nextBtn1 = page.locator('.form-step.active .next-step-btn');
    await nextBtn1.click();
    
    // --- Step 2 ---
    console.log('Waiting for Step 2');
    await page.waitForSelector('#booking-address', { state: 'visible', timeout: 15000 });
    await page.fill('#booking-address', '123 Test St, Miami, FL');
    await page.waitForTimeout(1000);
    await page.selectOption('#booking-urgency', 'ASAP');
    await page.waitForTimeout(1000);
    
    console.log('Clicking Continue on Step 2');
    const nextBtn2 = page.locator('.form-step.active .next-step-btn');
    await nextBtn2.click();
    
    // --- Step 3 ---
    console.log('Waiting for Step 3');
    await page.waitForSelector('#booking-name', { state: 'visible', timeout: 15000 });
    await page.fill('#booking-name', 'Live E2E Test User');
    await page.fill('#booking-phone', '3055550123');
    
    const smsConsent = page.locator('#booking-smsConsent');
    await smsConsent.check();
    
    await page.waitForTimeout(1000);
    
    // 2. Submit and verify redirection
    console.log('Submitting live booking form...');
    
    // Trigger submission and wait for redirection
    // We don't mock the API here - this is a real submission!
    const submitPromise = page.waitForURL(/\/thank-you/, { timeout: 30000 });
    await page.click('#booking-bookingForm button[type="submit"]');
    await submitPromise;
    
    console.log('Live booking form submitted successfully!');
  });

  test('should submit live contact form successfully', async ({ page }) => {
    // 1. Navigate to live site contact page
    console.log(`Navigating to ${LIVE_URL}/contact`);
    await page.goto(`${LIVE_URL}/contact`);
    await page.waitForSelector('#name', { state: 'visible' });
    
    // Trigger interaction
    await page.hover('#name');
    
    // 2. Fill form
    await page.fill('#name', 'Live Contact Test');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '3055551234');
    await page.fill('#message', 'This is a LIVE E2E Smoke Test of the contact form. Please ignore if received.');
    await page.check('#smsConsent');
    await page.waitForTimeout(1000);
    
    // 3. Submit and verify redirection
    console.log('Submitting live contact form...');
    const submitPromise = page.waitForURL(/\/thank-you/, { timeout: 30000 });
    await page.click('#submit-btn');
    await submitPromise;
    
    console.log('Live contact form submitted successfully!');
  });
});
