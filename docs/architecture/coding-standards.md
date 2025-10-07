# Coding Standards

## TypeScript Standards

**Type Safety**: Strict mode enabled (`strict: true` in tsconfig)
- No `any` types (use `unknown` if type is truly unknown)
- Explicit return types for functions
- Interface over type for object shapes
- Prefer `const` over `let`, avoid `var`

**Example**:
```typescript
// ✅ Good
interface FormData {
  fullName: string;
  email: string;
}

function submitForm(data: FormData): Promise<string> {
  return apiCall(data);
}

// ❌ Bad
function submitForm(data: any): any {
  return apiCall(data);
}
```

---

## React Standards

**Component Structure**:
- Functional components with hooks (no class components)
- Props interfaces defined above component
- Destructure props in function signature
- Use `children` prop for composition

**Example**:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

---

## File Organization Standards

**Import Order**:
1. React/Next.js imports
2. Third-party library imports
3. Internal imports (components, lib, services)
4. Types imports
5. Styles imports

**Example**:
```typescript
import { useState } from 'react';
import { NextRequest, NextResponse } from 'next/server';

import { AirtableService } from '@/services/AirtableService';
import { RecaptchaService } from '@/services/RecaptchaService';

import { LandingPage } from '@shared/types';
import { completeFormSchema } from '@shared/validation';

import styles from './FormField.module.css';
```

---

## Naming Conventions

**Components**: PascalCase (`MultiStepForm`, `FormField`)
**Functions**: camelCase (`submitForm`, `validateInput`)
**Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
**Interfaces**: PascalCase with `I` prefix optional (`FormData` or `IFormData`)
**Types**: PascalCase (`LandingPageStatus`)
**Files**: Match export name (`MultiStepForm.tsx`, `airtable.ts`)

---

## Code Comments

**When to Comment**:
- Complex business logic requiring explanation
- Non-obvious performance optimizations
- Workarounds for third-party library bugs
- TODO comments for Phase 2 enhancements

**When NOT to Comment**:
- Self-explanatory code (good naming is better)
- What the code does (should be obvious from reading)

**Example**:
```typescript
// ✅ Good - Explains why
// reCAPTCHA v3 requires 0.5 minimum score to balance security and UX
if (recaptchaScore < 0.5) {
  return error;
}

// ❌ Bad - Explains what (obvious)
// Check if score is less than 0.5
if (recaptchaScore < 0.5) {
  return error;
}
```

---
