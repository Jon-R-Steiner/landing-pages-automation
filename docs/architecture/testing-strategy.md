# Testing Strategy

## Unit Tests (Vitest)

**Test Coverage**: Component rendering, validation schemas, utility functions

**Example Tests**:
```typescript
// components/FormField.test.tsx
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and input', () => {
    render(<FormField label="Email" name="email" type="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    const error = { message: 'Invalid email' };
    render(<FormField label="Email" name="email" error={error} />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});
```

```typescript
// validation/form-schemas.test.ts
import { step1Schema } from './form-schemas';

describe('step1Schema', () => {
  it('validates correct data', () => {
    const data = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '5551234567',
      zipCode: '12345',
    };
    expect(step1Schema.safeParse(data).success).toBe(true);
  });

  it('rejects invalid phone number', () => {
    const data = { phoneNumber: '123' };
    const result = step1Schema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
```

---

## Integration Tests (React Testing Library)

**Test Coverage**: Multi-step form flow, API integration with mocks, context state management

**Example Tests**:
```typescript
// MultiStepForm.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MultiStepForm } from './MultiStepForm';

describe('MultiStepForm Integration', () => {
  it('completes full form submission flow', async () => {
    render(<MultiStepForm landingPageId="test-page" />);

    // Step 1
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '5551234567' } });
    fireEvent.change(screen.getByLabelText('ZIP'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('Next Step'));

    // Step 2
    await waitFor(() => screen.getByText('Project Details'));
    fireEvent.change(screen.getByLabelText('Job Type'), { target: { value: 'Bathroom' } });
    fireEvent.click(screen.getByText('Next Step'));

    // Step 3
    await waitFor(() => screen.getByText('TCPA Consent'));
    fireEvent.click(screen.getByLabelText(/I consent/));
    fireEvent.click(screen.getByText('Submit'));

    // Verify submission
    await waitFor(() => expect(mockApiCall).toHaveBeenCalled());
  });
});
```

---

## E2E Tests (Playwright)

**Test Coverage**: Complete user journeys, reCAPTCHA integration, thank you page redirect, mobile responsiveness

**Example Tests**:
```typescript
// e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test';

test('complete form submission flow', async ({ page }) => {
  await page.goto('/bathroom-remodel');

  // Step 1
  await page.fill('[name="fullName"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  await page.fill('[name="phoneNumber"]', '5551234567');
  await page.fill('[name="zipCode"]', '12345');
  await page.click('text=Next Step');

  // Step 2
  await page.selectOption('[name="jobType"]', 'Full Bathroom Remodel');
  await page.selectOption('[name="howDidYouHear"]', 'Online Search');
  await page.click('text=Next Step');

  // Step 3
  await page.check('[name="tcpaConsent"]');
  await page.click('text=Submit');

  // Verify redirect to thank you page
  await expect(page).toHaveURL('/thank-you');
  await expect(page.locator('h1')).toContainText('Thank You');
});

test('mobile form submission', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto('/bathroom-remodel');

  // Test touch targets and mobile layout
  const nameInput = page.locator('[name="fullName"]');
  await expect(nameInput).toHaveCSS('min-height', '54px'); // Touch target size
  await expect(nameInput).toHaveCSS('font-size', '16px'); // Prevent iOS zoom
});
```

---

## Test Commands

**Run All Tests**:
```bash
npm test
```

**Run Unit Tests Only**:
```bash
npm test:unit
```

**Run E2E Tests**:
```bash
npm test:e2e
```

**Test Coverage Report**:
```bash
npm test:coverage
```

**Watch Mode** (development):
```bash
npm test:watch
```

---
