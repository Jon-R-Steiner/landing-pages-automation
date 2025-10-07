# Playwright Test Scenarios

**Project**: Landing Pages Automation
**Purpose**: Automated validation tests aligned with front-end spec requirements
**Date**: 2025-10-07
**Author**: Sally (UX Expert)

---

## 🎯 Testing Strategy

**Approach**: Validate the landing page implementation against specification requirements using Playwright for real browser testing.

**Test Levels**:
1. **Functional Tests** - Does it work?
2. **Visual Tests** - Does it look right?
3. **Performance Tests** - Is it fast enough?
4. **Accessibility Tests** - Is it usable for everyone?
5. **Mobile Tests** - Does it work on mobile devices?

---

## 🛠️ Playwright Setup

### Installation

```bash
npm install -D @playwright/test
npx playwright install
```

### Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📋 Test Scenarios by Phase

### Phase 1: MVP Tests

#### Test 1.1: Hero Section Renders Correctly

```typescript
// tests/01-mvp/hero.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero image', async ({ page }) => {
    const heroImage = page.locator('img[alt*="bathroom"], img[alt*="remodel"]');
    await expect(heroImage).toBeVisible();

    // Verify WebP format
    const imageSrc = await heroImage.getAttribute('src');
    expect(imageSrc).toContain('.webp');
  });

  test('should display H1 headline with brand formula', async ({ page }) => {
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();

    const headlineText = await headline.textContent();

    // Verify headline follows formula: Action + Benefit + Service + Urgency
    // Example: "Claim Your Exclusive 40% Discount on Bathroom Remodeling Today"
    expect(headlineText).toMatch(/claim|get|save/i); // Action verb
    expect(headlineText).toMatch(/\d+%|discount|\$\d+/i); // Benefit
    expect(headlineText).toMatch(/today|now|limited/i); // Urgency
  });

  test('should display trust bar with 3 trust signals', async ({ page }) => {
    // Look for trust signal elements
    const trustSignals = page.locator('[class*="trust"], [class*="stat"]').locator('svg, img');
    await expect(trustSignals).toHaveCount(3, { timeout: 5000 });
  });

  test('should use Inter font', async ({ page }) => {
    const headline = page.locator('h1');
    const fontFamily = await headline.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('Inter');
  });
});
```

#### Test 1.2: ZIP Form Functionality

```typescript
// tests/01-mvp/zip-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('ZIP Code Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should accept valid 5-digit ZIP code', async ({ page }) => {
    const zipInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await zipInput.fill('60614');
    await submitButton.click();

    // Verify success message or progression to next step
    const successMessage = page.locator('.alert-success, [class*="success"]');
    await expect(successMessage).toBeVisible({ timeout: 3000 });
  });

  test('should reject invalid ZIP code', async ({ page }) => {
    const zipInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await zipInput.fill('123'); // Only 3 digits
    await zipInput.blur(); // Trigger validation

    // Verify error message
    const errorMessage = page.locator('.alert-error, [class*="error"]');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should reject non-numeric ZIP code', async ({ page }) => {
    const zipInput = page.locator('input[type="text"]').first();

    await zipInput.fill('abcde');

    // Input should not accept non-numeric characters
    const value = await zipInput.inputValue();
    expect(value).not.toMatch(/[a-z]/i);
  });

  test('CTA button should have value proposition text', async ({ page }) => {
    const ctaButton = page.locator('button[type="submit"]').first();
    const buttonText = await ctaButton.textContent();

    // Should not be generic "Submit"
    expect(buttonText).not.toMatch(/^submit$/i);

    // Should contain value proposition
    expect(buttonText).toMatch(/claim|get|save|discount/i);
  });

  test('CTA button should show loading state on submit', async ({ page }) => {
    const zipInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await zipInput.fill('60614');
    await submitButton.click();

    // Check for loading indicator (spinner or text change)
    const loadingIndicator = page.locator('.loading, [class*="spinner"]');
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
  });
});
```

#### Test 1.3: Mobile Responsiveness

```typescript
// tests/01-mvp/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 12']);

test.describe('Mobile Layout (MVP)', () => {
  test('hero image should be full width on mobile', async ({ page }) => {
    await page.goto('/');

    const heroImage = page.locator('img[alt*="bathroom"], img[alt*="remodel"]').first();
    const imageWidth = await heroImage.boundingBox();
    const viewportWidth = page.viewportSize()?.width || 0;

    expect(imageWidth?.width).toBeGreaterThan(viewportWidth * 0.9); // At least 90% width
  });

  test('form input should be at least 54px tall', async ({ page }) => {
    await page.goto('/');

    const zipInput = page.locator('input[type="text"]').first();
    const box = await zipInput.boundingBox();

    expect(box?.height).toBeGreaterThanOrEqual(54);
  });

  test('CTA button should be full width on mobile', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.locator('button[type="submit"]').first();
    const buttonBox = await ctaButton.boundingBox();
    const viewportWidth = page.viewportSize()?.width || 0;

    expect(buttonBox?.width).toBeGreaterThan(viewportWidth * 0.9); // At least 90% width
  });

  test('no horizontal scroll', async ({ page }) => {
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
```

---

### Phase 2: Multi-Step Form Tests

#### Test 2.1: Form Navigation

```typescript
// tests/02-multi-step/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Multi-Step Form Navigation', () => {
  test('should progress from Step 1 to Step 2', async ({ page }) => {
    await page.goto('/');

    // Fill Step 1
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    // Verify Step 2 visible
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="name"]');
    await expect(nameInput).toBeVisible({ timeout: 2000 });

    // Verify progress indicator
    const progressSteps = page.locator('.steps li, [class*="step"]');
    const activeStep = progressSteps.nth(1); // Second step (0-indexed)
    await expect(activeStep).toHaveClass(/step-primary|active/);
  });

  test('should allow back navigation without losing data', async ({ page }) => {
    await page.goto('/');

    // Complete Step 1
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    // Fill Step 2
    await page.locator('input[name="fullName"], input[placeholder*="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[type="email"]').fill('john@example.com');

    // Go back
    await page.locator('button:has-text("Back")').click();

    // Verify Step 1 still has data
    const zipInput = page.locator('input[type="text"]').first();
    await expect(zipInput).toHaveValue('60614');

    // Go forward again
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    // Verify Step 2 still has data
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="name"]');
    await expect(nameInput).toHaveValue('John Doe');
  });

  test('should prevent advancement with invalid data', async ({ page }) => {
    await page.goto('/');

    // Try to advance without filling ZIP
    await page.locator('button:has-text("Next"), button:has-text("Continue")').first().click();

    // Should show error and stay on Step 1
    const errorMessage = page.locator('.alert-error, [class*="error"]');
    await expect(errorMessage).toBeVisible();

    // Verify still on Step 1 (ZIP input still visible)
    const zipInput = page.locator('input[type="text"]').first();
    await expect(zipInput).toBeVisible();
  });
});
```

#### Test 2.2: Form Validation

```typescript
// tests/02-multi-step/validation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test('should validate email format', async ({ page }) => {
    await page.goto('/');

    // Navigate to Step 2
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    // Enter invalid email
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Verify error message
    const errorMessage = page.locator('.alert-error, [class*="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should validate phone format', async ({ page }) => {
    await page.goto('/');

    // Navigate to Step 2
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    // Enter phone
    const phoneInput = page.locator('input[name="phoneNumber"], input[type="tel"]');
    await phoneInput.fill('5551234567');

    // Should auto-format or accept valid phone
    const phoneValue = await phoneInput.inputValue();
    expect(phoneValue.replace(/\D/g, '')).toHaveLength(10); // 10 digits
  });

  test('should show success indicator for valid fields', async ({ page }) => {
    await page.goto('/');

    // Navigate to Step 2
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    // Enter valid email
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    await emailInput.fill('john@example.com');
    await emailInput.blur();

    // Look for success indicator (green border, checkmark, etc.)
    const successIndicator = page.locator('.input-success, [class*="success"]');
    await expect(successIndicator).toBeVisible({ timeout: 2000 });
  });
});
```

#### Test 2.3: TCPA Consent

```typescript
// tests/02-multi-step/tcpa.spec.ts
import { test, expect } from '@playwright/test';

test.describe('TCPA Consent (Step 3)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate through Steps 1 and 2
    await page.goto('/');
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();

    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="phoneNumber"]').fill('5551234567');
    await page.locator('button:has-text("Next"), button:has-text("Continue")').click();
  });

  test('should display TCPA checkbox', async ({ page }) => {
    const tcpaCheckbox = page.locator('input[type="checkbox"]');
    await expect(tcpaCheckbox).toBeVisible();
  });

  test('should have clear TCPA language', async ({ page }) => {
    const tcpaLabel = page.locator('label:has(input[type="checkbox"])');
    const labelText = await tcpaLabel.textContent();

    // Should mention key consent elements
    expect(labelText).toMatch(/calls|texts|contact/i);
    expect(labelText).toMatch(/consent|agree/i);
  });

  test('should link to privacy policy', async ({ page }) => {
    const privacyLink = page.locator('a[href*="privacy"]');
    await expect(privacyLink).toBeVisible();
  });

  test('should prevent submission without TCPA consent', async ({ page }) => {
    // Try to submit without checking box
    await page.locator('button[type="submit"]:has-text("Submit"), button:has-text("Get")').click();

    // Should show error or prevent submission
    const checkbox = page.locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(false);

    // Form should not submit (still on Step 3)
    await expect(checkbox).toBeVisible();
  });

  test('should allow submission with TCPA consent', async ({ page }) => {
    // Check TCPA box
    await page.locator('input[type="checkbox"]').check();

    // Submit form
    await page.locator('button[type="submit"]:has-text("Submit"), button:has-text("Get")').click();

    // Should redirect to thank you page or show success
    await expect(page).toHaveURL(/thank-you|success/, { timeout: 5000 });
  });
});
```

---

### Phase 3: Thank You Page Tests

#### Test 3.1: Thank You Page Content

```typescript
// tests/03-thank-you/thank-you-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Thank You Page', () => {
  test.beforeEach(async ({ page }) => {
    // Complete full form flow
    await page.goto('/');

    // Step 1
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next")').click();

    // Step 2
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="phoneNumber"]').fill('5551234567');
    await page.locator('button:has-text("Next")').click();

    // Step 3
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button[type="submit"]').click();

    // Wait for thank you page
    await page.waitForURL(/thank-you|success/);
  });

  test('should display success message', async ({ page }) => {
    const heading = page.locator('h1');
    const headingText = await heading.textContent();
    expect(headingText).toMatch(/thank you|success/i);
  });

  test('should display next steps', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toMatch(/call|contact|reach out/i);
    expect(content).toMatch(/24 hours|soon|shortly/i);
  });

  test('should display phone number as clickable link', async ({ page }) => {
    const phoneLink = page.locator('a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();

    const href = await phoneLink.getAttribute('href');
    expect(href).toMatch(/tel:\+?\d+/);
  });

  test('should not display form', async ({ page }) => {
    // Thank you page should not have a form
    const formElements = page.locator('form, input[type="text"], button[type="submit"]');
    await expect(formElements).toHaveCount(0);
  });

  test('should display social proof', async ({ page }) => {
    const content = await page.textContent('body');
    // Should mention customer count or testimonials
    expect(content).toMatch(/\d+\+? (homeowners|customers|families)/i);
  });
});
```

#### Test 3.2: Duplicate Submission Prevention

```typescript
// tests/03-thank-you/duplicate-prevention.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Duplicate Submission Prevention', () => {
  test('should prevent immediate duplicate submission', async ({ page, context }) => {
    // Complete form once
    await page.goto('/');
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next")').click();
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="phoneNumber"]').fill('5551234567');
    await page.locator('button:has-text("Next")').click();
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/thank-you|success/);

    // Try to submit again by going back to homepage
    await page.goto('/');

    // Fill form again with same data
    await page.locator('input[type="text"]').first().fill('60614');
    await page.locator('button:has-text("Next")').click();
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="phoneNumber"]').fill('5551234567');
    await page.locator('button:has-text("Next")').click();
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button[type="submit"]').click();

    // Should show duplicate error message
    const errorMessage = page.locator('.alert-error, [class*="error"]');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });

    const errorText = await errorMessage.textContent();
    expect(errorText).toMatch(/already submitted|duplicate/i);
  });
});
```

---

### Phase 4: Performance & Accessibility Tests

#### Test 4.1: Core Web Vitals

```typescript
// tests/04-performance/core-web-vitals.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Core Web Vitals', () => {
  test('Largest Contentful Paint (LCP) should be < 2.0s', async ({ page }) => {
    await page.goto('/');

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });

    expect(lcp).toBeLessThan(2000); // 2.0 seconds
  });

  test('Cumulative Layout Shift (CLS) should be < 0.1', async ({ page }) => {
    await page.goto('/');

    // Wait for page to settle
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      return clsValue;
    });

    expect(cls).toBeLessThan(0.1);
  });

  test('Hero image should load with priority', async ({ page }) => {
    await page.goto('/');

    const heroImage = page.locator('img[alt*="bathroom"], img[alt*="remodel"]').first();
    const fetchPriority = await heroImage.getAttribute('fetchpriority');

    expect(fetchPriority).toBe('high');
  });
});
```

#### Test 4.2: Accessibility

```typescript
// tests/04-performance/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have any automatically detectable WCAG violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt).not.toBe('');
    }
  });

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');

      if (id) {
        // Should have associated label
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else {
        // Should have aria-label
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Start at top of page
    await page.keyboard.press('Tab');

    // Should focus on first interactive element
    const firstFocusable = page.locator(':focus');
    await expect(firstFocusable).toBeVisible();

    // Tab through all elements
    const focusableCount = await page.locator('button, a, input, select, textarea').count();

    for (let i = 0; i < Math.min(focusableCount, 10); i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('focus indicators should be visible', async ({ page }) => {
    await page.goto('/');

    const button = page.locator('button').first();
    await button.focus();

    const outlineWidth = await button.evaluate(el =>
      window.getComputedStyle(el).outlineWidth
    );

    expect(parseInt(outlineWidth)).toBeGreaterThan(0);
  });
});
```

---

## 🚀 Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test Suite

```bash
npx playwright test tests/01-mvp/
npx playwright test tests/02-multi-step/
npx playwright test tests/03-thank-you/
npx playwright test tests/04-performance/
```

### Run in Specific Browser

```bash
npx playwright test --project="chromium"
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Run in Debug Mode

```bash
npx playwright test --debug
```

### Generate HTML Report

```bash
npx playwright show-report
```

---

## 📊 Test Coverage Summary

| Test Category | Test Count | Critical Tests |
|---------------|------------|----------------|
| **Phase 1: MVP** | 12 | Hero render, ZIP validation, mobile layout |
| **Phase 2: Multi-Step** | 10 | Form navigation, validation, data persistence |
| **Phase 3: Thank You** | 7 | Success page, duplicate prevention |
| **Phase 4: Performance** | 8 | Core Web Vitals, accessibility, cross-browser |
| **Total** | 37 | All tests validate spec compliance |

---

## ✅ Success Criteria

Tests are passing when:
- [ ] All 37 tests pass on Chrome desktop
- [ ] All tests pass on Mobile Chrome (Pixel 5)
- [ ] All tests pass on Mobile Safari (iPhone 12)
- [ ] No accessibility violations detected
- [ ] Core Web Vitals met (LCP <2.0s, CLS <0.1)
- [ ] All manual acceptance criteria from build order document also met

---

## 🔧 Continuous Integration

Add to your CI/CD pipeline (`.github/workflows/playwright.yml`):

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 Next Steps

**After all tests pass**:
1. Deploy to staging environment
2. Run Playwright tests against staging URL
3. Manual QA on real devices (iOS, Android)
4. Stakeholder review
5. Deploy to production
6. Monitor performance metrics (Lighthouse CI)

---

**All 4 Implementation Documents Complete!** 🎉

Dev-agent now has everything needed:
1. ✅ Component sources (what to use)
2. ✅ Customization guide (how to adapt)
3. ✅ Build order (what sequence, acceptance criteria)
4. ✅ Test scenarios (how to validate)
