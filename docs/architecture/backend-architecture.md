# Backend Architecture

This section defines the Netlify serverless functions architecture, including API handlers, service layer, validation, and integration patterns.

## Serverless Functions Overview

**Runtime**: Node.js 20 (Netlify Functions runtime)
**Framework**: Next.js API Routes (deployed as Netlify Functions)
**Location**: `apps/frontend/app/api/` (Next.js App Router convention)

**Netlify Functions Deployment**:
- Next.js API routes automatically convert to Netlify Functions
- Each route handler becomes a separate serverless function
- Function names match route paths (e.g., `/api/submit-form` → `submit-form.js`)
- Environment variables managed via Netlify dashboard

---

## API Route Handlers

### POST /api/submit-form

**Purpose**: Process complete form submission with validation, duplicate detection, and Airtable storage.

**`apps/frontend/app/api/submit-form/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { completeFormSchema } from '@shared/validation';
import { AirtableService } from '@/services/AirtableService';
import { RecaptchaService } from '@/services/RecaptchaService';
import { DuplicateDetectionService } from '@/services/DuplicateDetectionService';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate form data with Zod
    const validationResult = completeFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Verify reCAPTCHA v3 token
    const recaptchaScore = await RecaptchaService.verifyToken(
      body.recaptchaToken,
      request.headers.get('x-forwarded-for') || request.ip
    );

    if (recaptchaScore < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Check for duplicate submission (5-minute window)
    const isDuplicate = await DuplicateDetectionService.checkDuplicate(
      formData.email,
      formData.phoneNumber
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'Duplicate submission detected. You have already submitted this form recently.' },
        { status: 429 }
      );
    }

    // Create submission in Airtable
    const submissionId = await AirtableService.createFormSubmission({
      ...formData,
      recaptchaScore,
      ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      submittedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, submissionId, message: 'Form submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your submission. Please try again.' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Disable caching for form submissions
```

---

### POST /api/validate-recaptcha

**Purpose**: Server-side reCAPTCHA v3 validation endpoint (optional - can be merged into submit-form).

**`apps/frontend/app/api/validate-recaptcha/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { RecaptchaService } from '@/services/RecaptchaService';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing reCAPTCHA token' }, { status: 400 });
    }

    const score = await RecaptchaService.verifyToken(
      token,
      request.headers.get('x-forwarded-for') || request.ip
    );

    return NextResponse.json({ success: true, score }, { status: 200 });

  } catch (error) {
    console.error('reCAPTCHA validation error:', error);
    return NextResponse.json(
      { error: 'reCAPTCHA verification failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

---

### POST /api/webhook-make-com

**Purpose**: Receive deployment notifications and status updates from Make.com automation.

**`apps/frontend/app/api/webhook-make-com/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';

interface MakeComWebhookPayload {
  event: 'deployment.success' | 'deployment.failure' | 'generation.complete';
  landingPageId: string;
  publishedUrl?: string;
  errorMessage?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('x-webhook-signature');
    const expectedSignature = process.env.MAKE_COM_WEBHOOK_SECRET;

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload: MakeComWebhookPayload = await request.json();

    // Log webhook event for debugging
    console.log('Make.com webhook received:', payload);

    // Process webhook based on event type
    switch (payload.event) {
      case 'deployment.success':
        console.log(`Deployment successful for page ${payload.landingPageId}`);
        // Additional processing if needed
        break;

      case 'deployment.failure':
        console.error(`Deployment failed for page ${payload.landingPageId}: ${payload.errorMessage}`);
        // Send error notification (Phase 2)
        break;

      case 'generation.complete':
        console.log(`Content generation complete for page ${payload.landingPageId}`);
        break;

      default:
        console.warn('Unknown webhook event:', payload.event);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

---

## Service Layer

### AirtableService - Database Operations

**`apps/frontend/services/AirtableService.ts`**
```typescript
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

export class AirtableService {
  /**
   * Create form submission record
   */
  static async createFormSubmission(data: any): Promise<string> {
    const record = await base('Form Submissions').create({
      landing_page_id: [data.landingPageId], // Link to Landing Pages table
      session_id: data.sessionId,
      submitted_at: data.submittedAt.toISOString(),
      status: 'Pending',
      completion_time_seconds: data.completionTimeSeconds || 0,
      gclid: data.gclid,
      fbclid: data.fbclid,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      utm_term: data.utmTerm,
      utm_content: data.utmContent,
      referrer: data.referrer,
      page_url: data.pageUrl,
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      email: data.email,
      zip_code: data.zipCode,
      job_type: data.jobType,
      how_did_you_hear: data.howDidYouHear,
      comments_or_questions: data.commentsOrQuestions,
      tcpa_consent: data.tcpaConsent,
      recaptcha_score: data.recaptchaScore,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    });

    return record.id;
  }

  /**
   * Fetch landing page by slug
   */
  static async fetchLandingPageBySlug(slug: string): Promise<any | null> {
    const records = await base('Landing Pages')
      .select({
        filterByFormula: `AND({slug} = "${slug}", {status} = "published")`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      slug: record.get('slug'),
      title: record.get('title'),
      heroImage: record.get('hero_image'),
      heroImageAlt: record.get('hero_image_alt'),
      generatedContent: record.get('generated_content'),
      metadata: {
        title: record.get('meta_title'),
        description: record.get('meta_description'),
        ogTitle: record.get('og_title'),
        ogDescription: record.get('og_description'),
      },
    };
  }

  /**
   * Fetch all published landing pages (for static generation)
   */
  static async fetchPublishedLandingPages(): Promise<Array<{ slug: string }>> {
    const records = await base('Landing Pages')
      .select({
        filterByFormula: `{status} = "published"`,
        fields: ['slug'],
      })
      .all();

    return records.map(record => ({ slug: record.get('slug') as string }));
  }

  /**
   * Check for duplicate submissions (5-minute window)
   */
  static async checkDuplicateSubmission(email: string, phoneNumber: string): Promise<boolean> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const records = await base('Form Submissions')
      .select({
        filterByFormula: `AND(
          {email} = "${email}",
          {phone_number} = "${phoneNumber}",
          IS_AFTER({submitted_at}, "${fiveMinutesAgo}")
        )`,
        maxRecords: 1,
      })
      .firstPage();

    return records.length > 0;
  }
}
```

---

### RecaptchaService - reCAPTCHA v3 Verification

**`apps/frontend/services/RecaptchaService.ts`**
```typescript
export class RecaptchaService {
  /**
   * Verify reCAPTCHA v3 token and return score
   */
  static async verifyToken(token: string, ipAddress: string | null): Promise<number> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      throw new Error('RECAPTCHA_SECRET_KEY is not configured');
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: ipAddress || '',
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error('reCAPTCHA verification failed');
    }

    // Return score (0.0 to 1.0, higher is more likely human)
    return data.score;
  }

  /**
   * Get minimum required score from TCPA Rules (default 0.5)
   */
  static async getMinimumScore(): Promise<number> {
    // TODO: Fetch from Airtable TCPA Rules table (Phase 2)
    return 0.5;
  }
}
```

---

### DuplicateDetectionService - Submission Deduplication

**`apps/frontend/services/DuplicateDetectionService.ts`**
```typescript
import { AirtableService } from './AirtableService';

export class DuplicateDetectionService {
  /**
   * Check for duplicate submission within 5-minute window
   */
  static async checkDuplicate(email: string, phoneNumber: string): Promise<boolean> {
    return await AirtableService.checkDuplicateSubmission(email, phoneNumber);
  }

  /**
   * Get duplicate check window in minutes (configurable)
   */
  static getDuplicateWindow(): number {
    return parseInt(process.env.DUPLICATE_CHECK_WINDOW_MINUTES || '5', 10);
  }
}
```

---

## Shared Validation Layer

**Location**: `packages/shared/src/validation/`

**Purpose**: Share validation schemas between frontend and backend to ensure consistency.

**`packages/shared/src/validation/form-schemas.ts`**
```typescript
import { z } from 'zod';

export const step1Schema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
});

export const step2Schema = z.object({
  jobType: z.string().min(1, 'Job type is required'),
  howDidYouHear: z.enum(['Online Search', 'Social Media', 'Referral', 'Advertisement', 'Other']),
  commentsOrQuestions: z.string().max(1000).optional(),
});

export const step3Schema = z.object({
  tcpaConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to receive communications' }),
  }),
});

export const marketingDataSchema = z.object({
  gclid: z.string().nullable(),
  fbclid: z.string().nullable(),
  utmSource: z.string().nullable(),
  utmMedium: z.string().nullable(),
  utmCampaign: z.string().nullable(),
  utmTerm: z.string().nullable(),
  utmContent: z.string().nullable(),
  referrer: z.string().nullable(),
  pageUrl: z.string().url(),
});

export const completeFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(marketingDataSchema)
  .extend({
    sessionId: z.string().uuid(),
    landingPageId: z.string(),
    recaptchaToken: z.string(),
  });
```

---

## Error Handling Strategy

### Centralized Error Response

**`apps/frontend/lib/errors.ts`**
```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

export class DuplicateSubmissionError extends AppError {
  constructor() {
    super(429, 'Duplicate submission detected. You have already submitted this form recently.');
    this.name = 'DuplicateSubmissionError';
  }
}

export class RecaptchaError extends AppError {
  constructor() {
    super(400, 'reCAPTCHA verification failed. Please try again.');
    this.name = 'RecaptchaError';
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled error:', error);
  return NextResponse.json(
    { error: 'An unexpected error occurred. Please try again.' },
    { status: 500 }
  );
}
```

---

## Environment Variables

**Required Environment Variables** (configured in Netlify):

```bash
# Airtable Configuration
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Make.com Webhook
MAKE_COM_WEBHOOK_SECRET=your-webhook-secret-here

# Optional Configuration
DUPLICATE_CHECK_WINDOW_MINUTES=5
```

**Environment Variable Access**:
- `NEXT_PUBLIC_*` variables are exposed to browser (client-side)
- Non-prefixed variables are server-side only (secure)
- Managed via Netlify dashboard (Environment Variables section)

---

## Authentication & Authorization

**Phase 1**: No authentication required (public forms)

**Phase 2 Considerations**:
- Admin dashboard for viewing submissions
- Role-based access control (RBAC)
- OAuth integration for stakeholder access
- API key authentication for webhook endpoints

---

## Rate Limiting

**Phase 1**: No rate limiting (reCAPTCHA provides spam protection)

**Phase 2 Considerations**:
- IP-based rate limiting (e.g., 10 submissions per hour)
- Email/phone-based rate limiting
- API endpoint throttling
- DDoS protection via Netlify

---

## Logging and Monitoring

**Console Logging**:
```typescript
// Structured logging for debugging
console.log('[FORM_SUBMISSION]', {
  submissionId: record.id,
  email: formData.email,
  recaptchaScore: recaptchaScore,
  timestamp: new Date().toISOString(),
});

// Error logging with stack traces
console.error('[ERROR]', {
  error: error.message,
  stack: error.stack,
  context: 'form-submission',
});
```

**Netlify Function Logs**:
- Automatically captured in Netlify dashboard (Functions → Logs)
- Real-time log streaming available
- 7-day log retention (free tier)

**Phase 2 Enhancements**:
- Structured logging with Datadog or LogRocket
- Error tracking with Sentry
- Performance monitoring with Netlify Analytics
- Custom metrics and dashboards

---

## Serverless Function Configuration

**`netlify.toml`** (project root):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["airtable"]

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/api/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Function Timeout**: 10 seconds (Netlify default, sufficient for form submissions)

**Function Memory**: 1024 MB (Netlify default)

**Cold Start Optimization**:
- Minimal dependencies (only Airtable SDK)
- Tree shaking with esbuild
- Connection pooling for Airtable API
- Lazy loading of services

---

## Backend Architecture Rationale

**Why Netlify Functions (not AWS Lambda)**:
- Seamless Next.js integration (automatic deployment)
- Zero-configuration setup (no manual Lambda configuration)
- Unified deployment (frontend + backend in one deploy)
- Built-in environment variable management
- Generous free tier (125K function invocations/month)

**Why Service Layer Pattern**:
- Separation of concerns (API handlers vs business logic)
- Testable services (unit tests without HTTP layer)
- Reusable services across multiple API routes
- Easier refactoring and maintenance
- Clear dependency injection points

**Why Shared Validation**:
- Single source of truth for validation rules
- Consistent error messages on client and server
- TypeScript type safety from validation schemas
- No duplication between frontend and backend
- Easy to update validation rules in one place

**Why No Database Connection Pooling (Phase 1)**:
- Airtable REST API handles connection management
- Serverless functions are stateless (no persistent connections)
- Simple HTTP requests via Airtable SDK
- Phase 2 consideration if migrating to PostgreSQL

---
