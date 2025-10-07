# Components

This section defines the component architecture for frontend, backend, and integration layers.

## Frontend Components

**Page Components** (Next.js App Router):
- `app/[slug]/page.tsx` - Dynamic landing page route (fetches from Airtable by slug)
- `app/thank-you/page.tsx` - Static thank you confirmation page
- `app/layout.tsx` - Root layout with GTM integration and global styles

**Feature Components**:
- `components/LandingPageHero.tsx` - Hero section with pre-mapped hero image
- `components/MultiStepForm/` - Multi-step form module
  - `MultiStepForm.tsx` - Main form orchestrator with step management
  - `Step1BasicInfo.tsx` - Full name, email, phone, zip code fields
  - `Step2ProjectDetails.tsx` - Job type, how they heard, comments
  - `Step3TCPAConsent.tsx` - TCPA checkbox + reCAPTCHA v3 validation
  - `FormProgressBar.tsx` - Visual step indicator (1/3, 2/3, 3/3)
- `components/FormField.tsx` - Reusable input component with validation display
- `components/RecaptchaBadge.tsx` - reCAPTCHA v3 badge component

**Context Providers**:
- `contexts/FormContext.tsx` - Multi-step form state management (with sessionStorage persistence)
- `contexts/MarketingContext.tsx` - UTM parameter and click ID tracking (captured once on page load)

**Utility Components**:
- `components/GoogleTagManager.tsx` - GTM script injection in layout
- `components/ErrorBoundary.tsx` - Error handling wrapper for graceful failures

---

## Backend Components (Netlify Functions)

**API Handlers** (`apps/functions/`):
- `submit-form.ts` - Form submission processing with validation and storage
- `validate-recaptcha.ts` - Server-side reCAPTCHA v3 verification
- `webhook-make-com.ts` - Make.com webhook receiver for automation events
- `webhook-netlify-deploy.ts` - Deployment notification handler

**Service Layer** (`apps/functions/services/`):
- `AirtableService.ts` - Airtable CRUD operations (create submissions, fetch pages, update status)
- `RecaptchaService.ts` - reCAPTCHA v3 score verification (minimum threshold enforcement)
- `DuplicateDetectionService.ts` - Email+phone duplicate checking (5-minute window)

**Shared Validation** (`packages/shared/src/validation/`):
- `form-schemas.ts` - Zod validation schemas (used by both frontend and backend)
- `step1-schema.ts` - Basic info validation rules
- `step2-schema.ts` - Project details validation rules
- `step3-schema.ts` - TCPA consent validation rules

---

## Integration Components

**Make.com Scenarios** (configured in Make.com platform, not in codebase):

**Scenario 1: Content Generation Flow**
- **Trigger**: Airtable watch for status = "pending"
- **Actions**:
  1. Fetch landing page record from Airtable
  2. Call Claude API with content brief + template
  3. Store generated content in Airtable `generatedContent` field
  4. Update status to "generated"
  5. Error handling: Update status to "error" on failure

**Scenario 2: Deployment Flow**
- **Trigger**: Airtable watch for status = "approved"
- **Actions**:
  1. Trigger Netlify deploy hook (rebuilds Next.js site)
  2. Wait for deployment completion
  3. Update Airtable `publishedUrl` with live URL
  4. Update status to "published"
  5. Error handling: Send error notification webhook

**Scenario 3: Error Notification Flow**
- **Trigger**: Webhook from Netlify (deployment failure)
- **Actions**:
  1. Parse deployment error details
  2. Update Airtable landing page status to "error"
  3. Log error details in Airtable notes field
  4. (Future enhancement: Send email notification)

---

## Component Architecture Rationale

**Frontend Organization:**
- **Co-location pattern**: Multi-step form components grouped in `/MultiStepForm/` directory
- **Separation of concerns**: Context (state) separate from presentation (components)
- **Reusability**: Generic `FormField` component used across all form steps
- **Type safety**: All components use shared TypeScript interfaces from `packages/shared`

**Backend Organization:**
- **Service layer pattern**: Business logic encapsulated in services (testable, reusable)
- **Thin handlers**: API handlers are thin wrappers around services
- **Shared validation**: Zod schemas used by both frontend (client validation) and backend (server validation)
- **Error handling**: Centralized error responses and logging

**Integration Strategy:**
- **Event-driven**: Airtable status changes trigger Make.com scenarios
- **Loosely coupled**: Make.com handles orchestration, not hardcoded in codebase
- **Visibility**: Non-technical stakeholders can view/modify Make.com scenarios
- **Resilience**: Error handling scenarios prevent silent failures

**Simplified Duplicate Prevention:**
- **No token system**: Eliminated unnecessary complexity
- **Backend enforcement**: 5-minute duplicate window on email+phone combination
- **User experience**: Static thank you page, duplicate attempts return 429 error

---
