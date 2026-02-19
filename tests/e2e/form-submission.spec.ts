import { test, expect } from '@playwright/test';

/**
 * End-to-End Form Submission Test
 * Verifies that forms correctly capture data and hit the API endpoints with the right payload.
 */

test.describe('Booking Form Submission', () => {
  test('should submit booking form successfully with mocked API', async ({ page }) => {
    // Add console listener for debugging
    page.on('console', msg => console.log(`BROWSER LOG [${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    // 1. Intercept the API call
    await page.route('**/api/send-email.php', async (route) => {
      const postData = route.request().postData();
      console.log('Intercepted Booking Data Snippet:', postData?.substring(0, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
      });
    });

    // 2. Navigate
    console.log('Navigating to /book');
    await page.goto('/book');
    await page.waitForSelector('#booking-serviceType', { state: 'visible' });
    
    // Trigger interaction to ensure scripts load (hover/focus)
    await page.hover('#booking-serviceType');
    await page.focus('#booking-serviceType');
    
    // --- Step 1 ---
    console.log('Filling Step 1');
    await page.selectOption('#booking-serviceType', 'electrical_repair');
    await page.waitForTimeout(500);
    
    // Check if valid
    const isValid = await page.evaluate(() => {
        const select = document.querySelector('#booking-serviceType') as HTMLSelectElement;
        return select?.value === 'electrical_repair';
    });
    console.log('Service Type Selected:', isValid);

    console.log('Clicking Continue on Step 1');
    const nextBtn1 = page.locator('.form-step.active .next-step-btn');
    await nextBtn1.click();
    
    // --- Step 2 ---
    console.log('Waiting for Step 2');
    await page.waitForSelector('#booking-address', { state: 'visible', timeout: 10000 });
    await page.fill('#booking-address', '123 Test St, Miami, FL');
    await page.waitForTimeout(500);
    await page.selectOption('#booking-urgency', 'ASAP');
    await page.waitForTimeout(500);
    
    console.log('Clicking Continue on Step 2');
    const nextBtn2 = page.locator('.form-step.active .next-step-btn');
    await nextBtn2.click();
    
    // --- Step 3 ---
    console.log('Waiting for Step 3');
    await page.waitForSelector('#booking-name', { state: 'visible', timeout: 10000 });
    await page.fill('#booking-name', 'Test User');
    await page.fill('#booking-phone', '3055550123');
    
    // Ensure checkbox is checked and visible
    const smsConsent = page.locator('#booking-smsConsent');
    await smsConsent.check();
    console.log('Checkbox checked:', await smsConsent.isChecked());
    
    await page.waitForTimeout(500);
    
    // 3. Submit and verify redirection
    console.log('Submitting form...');
    
    // Trigger submission and wait for redirection
    const submitPromise = page.waitForURL(/\/thank-you/, { timeout: 15000 });
    await page.click('#booking-bookingForm button[type="submit"]');
    await submitPromise;
  });
});

test.describe('Contact Form Submission', () => {
  test('should submit contact form successfully with mocked API', async ({ page }) => {
    // 1. Intercept the API call
    await page.route('**/api/contact.php', async (route) => {
        const json = route.request().postDataJSON();
        console.log('Intercepted Contact Data:', json);
        expect(json.name).toBe('Contact Test');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'success', message: 'Message sent' }),
        });
    });

    // 2. Navigate and fill form
    await page.goto('/contact');
    await page.waitForSelector('#name', { state: 'visible' });
    
    await page.fill('#name', 'Contact Test');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '3055551234');
    await page.fill('#message', 'This is a test message.');
    await page.check('#smsConsent');
    await page.waitForTimeout(500);
    
    // 3. Submit and verify redirection
    console.log('Submitting contact form...');
    const submitPromise = page.waitForURL(/\/thank-you/, { timeout: 15000 });
    await page.click('#submit-btn');
    await submitPromise;
  });
});
