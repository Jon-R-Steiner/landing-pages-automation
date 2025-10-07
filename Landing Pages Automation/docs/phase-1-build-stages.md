# Phase 1 Build Stage Definitions

## Purpose

This document defines the complete 6-stage build workflow for Phase 1 (Landing Pages Automation) autonomous execution by dev-agent. Each stage has objective entry criteria, measurable deliverables, testable exit criteria, and specific success metrics to enable validation gates and autonomous progress tracking.

This workflow follows BMAD methodology with sequential stage progression (Stage N cannot start until Stage N-1 exit criteria are met), providing checkpoint validation for the estimated 30-hour Phase 1 build timeline.

---

## Build Stage Overview

| Stage | Name | Primary Focus | Estimated Duration | Dependencies |
|-------|------|---------------|-------------------|--------------|
| 1 | Project Setup | Monorepo initialization, dependencies, placeholder library | 3-4 hours | Phase 0 complete |
| 2 | Frontend Foundation | Next.js App Router, routing, layouts, styling | 5-6 hours | Stage 1 complete |
| 3 | Multi-Step Form | React Hook Form, Zod validation, reCAPTCHA, TCPA | 6-7 hours | Stage 2 complete |
| 4 | Airtable Integration | Serverless functions, Airtable SDK, duplicate detection | 5-6 hours | Stage 3 complete |
| 5 | Make.com Automation | Content generation, PMax assets, deployment hooks | 4-5 hours | Stage 4 complete |
| 6 | Deployment & Testing | Netlify deployment, E2E tests, Core Web Vitals | 5-6 hours | Stage 5 complete |
| **Total** | - | - | **28-34 hours** | - |

---

## Stage Dependency Flow

```
Phase 0 Complete
    ↓
Stage 1: Project Setup
    ↓
Stage 2: Frontend Foundation
    ↓
Stage 3: Multi-Step Form
    ↓
Stage 4: Airtable Integration
    ↓
Stage 5: Make.com Automation
    ↓
Stage 6: Deployment & Testing
    ↓
Phase 1 Complete (Ready for Production)
```

**Critical Rule**: Each stage MUST meet all exit criteria before the next stage begins. No parallel execution or criteria shortcuts permitted.

---

## Stage 1: Project Setup

### Purpose
Initialize monorepo structure with npm workspaces, install all dependencies, create shared TypeScript types package, and implement placeholder image library for hero images.

### Architecture Alignment
- **Monorepo Layout** (architecture.md § Monorepo Layout)
- **npm workspaces** configuration
- **packages/shared** types structure
- **lib/placeholders.ts** (8 hero image categories)

### Entry Criteria
1. ✅ Phase 0 validation complete (Story 1.2.6)
2. ✅ Architecture document available (`docs/architecture.md`)
3. ✅ PRD document available (`docs/prd.md`)
4. ✅ MCP integration patterns available (`docs/mcp-integration-patterns.md`)
5. ✅ Environment variables configured (at minimum `NODE_ENV=development`)
6. ✅ Git repository initialized
7. ✅ Node.js 20+ and npm 10+ installed

### Primary Deliverables

#### 1.1 Monorepo Structure
```
landing-pages-automation/
├── apps/
│   └── frontend/                       # Next.js application
├── packages/
│   └── shared/                         # Shared TypeScript types
│       ├── src/
│       │   ├── types/
│       │   │   ├── landing-page.ts
│       │   │   ├── form-submission.ts
│       │   │   ├── form-session.ts
│       │   │   └── index.ts
│       │   └── validation/
│       │       ├── form-schemas.ts
│       │       └── index.ts
│       ├── tsconfig.json
│       └── package.json
├── docs/
├── .gitignore
├── package.json                        # Root workspace config
├── tsconfig.json                       # Root TypeScript config
└── README.md
```

#### 1.2 Dependencies Installed
**Frontend (`apps/frontend/package.json`)**:
- next@15.5+ (App Router framework)
- react@18.3+, react-dom@18.3+
- typescript@5.6+
- @types/node, @types/react, @types/react-dom
- tailwindcss@3.4+, autoprefixer, postcss
- @radix-ui/react-* (form components)
- react-hook-form@7.53+
- zod@3.23+
- airtable@0.12+
- react-google-recaptcha-v3

**Shared (`packages/shared/package.json`)**:
- typescript@5.6+
- zod@3.23+

**Dev Dependencies (Root `package.json`)**:
- vitest@2.1+
- playwright@1.48+
- eslint@9+, prettier@3.3+

#### 1.3 Configuration Files
- `next.config.js` (Turbopack, image optimization)
- `tailwind.config.js` (design system tokens)
- `tsconfig.json` (path aliases: `"@/*": ["./*"]`)
- `.gitignore` (node_modules, .next, .env*)
- `netlify.toml` (build commands, redirects)

#### 1.4 Placeholder Image Library
**File**: `apps/frontend/lib/placeholders.ts`

8 hero image categories with placeholder URLs:
1. Walk-in Shower
2. Full Bathroom Remodel
3. Kitchen Remodel
4. Flooring Installation
5. Tile Work
6. Countertop Installation
7. Plumbing Services
8. General Contractor

Each placeholder returns a typed object:
```typescript
interface PlaceholderImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}
```

### Exit Criteria
1. ✅ `npm install` completes without errors in root, apps/frontend, packages/shared
2. ✅ TypeScript compilation succeeds: `npx tsc --noEmit` passes in all packages
3. ✅ All configuration files valid and properly formatted
4. ✅ Placeholder library exports 8 image categories correctly
5. ✅ Next.js dev server starts: `npm run dev` launches without errors
6. ✅ Git commit created with all setup files

### Success Metrics
```bash
# Validation Commands
cd landing-pages-automation
npm install                              # Should complete without errors
npm run build                            # Should build all workspace packages
npx tsc --noEmit                         # TypeScript check passes
cd apps/frontend && npm run dev          # Next.js starts on http://localhost:3000
```

**Expected Output**:
- All packages install successfully
- TypeScript compilation: 0 errors
- Next.js dev server running
- Placeholder library tested: `import { getWalkInShowerPlaceholder } from '@/lib/placeholders'`

---

## Stage 2: Frontend Foundation

### Purpose
Implement Next.js App Router structure with dual routing ([slug] and [location]/[slug]), root layout with GTM integration, placeholder landing page components, and Tailwind CSS styling system.

### Architecture Alignment
- **App Router Routes** (architecture.md § URL Structure & Routing)
- **[slug]/page.tsx** (non-geographic routes)
- **[location]/[slug]/page.tsx** (geographic routes)
- **Root Layout** with GTM
- **Tailwind Design System** (globals.css)

### Entry Criteria
1. ✅ Stage 1 exit criteria met
2. ✅ Monorepo structure established
3. ✅ Dependencies installed
4. ✅ TypeScript configuration working
5. ✅ Placeholder library functional

### Primary Deliverables

#### 2.1 App Router Structure
```
apps/frontend/app/
├── layout.tsx                          # Root layout (GTM, metadata)
├── page.tsx                            # Homepage (optional)
├── [slug]/
│   └── page.tsx                        # Non-geographic routes (/bathroom-remodel)
├── [location]/
│   └── [slug]/
│       └── page.tsx                    # Geographic routes (/chicago/bathroom-remodel)
├── thank-you/
│   └── page.tsx                        # Thank you page
└── api/                                # Serverless function routes (empty stubs)
    ├── submit-form/
    │   └── route.ts
    ├── validate-recaptcha/
    │   └── route.ts
    └── webhook-make-com/
        └── route.ts
```

#### 2.2 Root Layout Component
**File**: `apps/frontend/app/layout.tsx`

- HTML5 document structure
- Google Tag Manager integration (GTM-XXXXX placeholder)
- Font loading (system font stack)
- Metadata (title, description)
- Error boundary wrapper

#### 2.3 Landing Page Components
**File**: `apps/frontend/components/LandingPageHero.tsx`

- Hero section with placeholder image integration
- Headline and subheadline display
- CTA button (placeholder, links to form section)
- Responsive layout (mobile-first)

**File**: `apps/frontend/app/[slug]/page.tsx`

- Dynamic route handler
- Fetch landing page config from placeholder data
- Render hero component
- Placeholder content sections

**File**: `apps/frontend/app/[location]/[slug]/page.tsx`

- Geographic dynamic route handler
- Same structure as [slug] route
- Extract location and slug params
- Render location-specific content

#### 2.4 Styling System
**File**: `apps/frontend/styles/globals.css`

- Tailwind directives (@tailwind base, components, utilities)
- CSS custom properties (design tokens)
- Typography system
- Responsive utilities

**File**: `apps/frontend/tailwind.config.js`

- Color palette (primary, secondary, neutral)
- Typography scale (font sizes, line heights)
- Spacing scale
- Breakpoints (mobile-first)

#### 2.5 Middleware
**File**: `apps/frontend/middleware.ts`

- URL normalization (remove trailing slashes)
- Redirect `/path/` → `/path`
- Preserve query parameters

### Exit Criteria
1. ✅ `npm run build` succeeds (Next.js production build completes)
2. ✅ Both route patterns accessible:
   - `/bathroom-remodel` renders correctly
   - `/chicago/bathroom-remodel` renders correctly
3. ✅ Placeholder images load and display in hero component
4. ✅ Google Tag Manager script injected in HTML (GTM container ID present)
5. ✅ Tailwind styling applied (verified with browser DevTools)
6. ✅ Middleware removes trailing slashes (test: `/test/` → `/test`)
7. ✅ TypeScript compilation passes with 0 errors
8. ✅ No console errors in browser (development mode)

### Success Metrics
```bash
# Validation Commands
cd apps/frontend
npm run build                            # Next.js build succeeds
npm run dev                              # Start dev server

# Manual Validation in Browser
# Visit: http://localhost:3000/bathroom-remodel
# Expect: Hero with placeholder image, headline, CTA button
# Visit: http://localhost:3000/chicago/bathroom-remodel
# Expect: Geographic landing page renders
# DevTools: Check for GTM script in <head>
# DevTools: Verify Tailwind classes applied (.text-4xl, .font-bold, etc.)
```

**Expected Output**:
- Build completes without errors
- Routes render placeholder landing pages
- Images load from placeholder library
- GTM script present in HTML
- Tailwind styles applied correctly
- No runtime errors in console

---

## Stage 3: Multi-Step Form

### Purpose
Implement 3-step multi-step form with React Hook Form orchestration, Zod validation schemas, reCAPTCHA v3 integration, TCPA consent capture, and Form/Marketing context providers.

### Architecture Alignment
- **Multi-Step Form Pattern** (architecture.md § Frontend Implementation)
- **FormContext** + **MarketingContext**
- **Zod schemas** in packages/shared
- **reCAPTCHA v3** integration
- **TCPA Consent** requirement

### Entry Criteria
1. ✅ Stage 2 exit criteria met
2. ✅ Landing page routes functional
3. ✅ Styling system working
4. ✅ Component structure established

### Primary Deliverables

#### 3.1 Context Providers
**File**: `apps/frontend/contexts/FormContext.tsx`

- React Context for form state
- Form data persistence
- Step navigation logic (next, previous)
- Form submission status
- Error handling state

**File**: `apps/frontend/contexts/MarketingContext.tsx`

- UTM parameter capture (utm_source, utm_medium, utm_campaign)
- Referrer tracking
- Session ID generation
- Landing page ID tracking
- Page URL capture

#### 3.2 Validation Schemas
**File**: `packages/shared/src/validation/form-schemas.ts`

Three Zod schemas exported:
1. **Step1Schema**: Basic info (name, email, phone, zip code)
2. **Step2Schema**: Project details (service type, project scope, timeline, budget range)
3. **Step3Schema**: TCPA consent (boolean, required: true)

**Full form schema**: Combines all three steps for backend validation

#### 3.3 Form Components
**File**: `apps/frontend/components/MultiStepForm/MultiStepForm.tsx`

- Multi-step orchestrator component
- React Hook Form integration
- Step progression UI
- Progress bar display
- Submit handler (calls API route)

**File**: `apps/frontend/components/MultiStepForm/Step1BasicInfo.tsx`

- Name input (text, required)
- Email input (email validation)
- Phone input (US phone format: (XXX) XXX-XXXX)
- ZIP code input (5-digit validation)

**File**: `apps/frontend/components/MultiStepForm/Step2ProjectDetails.tsx`

- Service type select dropdown (8 categories)
- Project scope textarea
- Timeline select (ASAP, 1-3 months, 3-6 months, 6+ months)
- Budget range select (predefined ranges)

**File**: `apps/frontend/components/MultiStepForm/Step3TCPAConsent.tsx`

- TCPA consent checkbox (required)
- TCPA disclosure text (legal language)
- Privacy policy link
- reCAPTCHA badge display

**File**: `apps/frontend/components/MultiStepForm/FormProgressBar.tsx`

- Visual progress indicator (1 of 3, 2 of 3, 3 of 3)
- Current step highlight
- Completed steps checkmark

#### 3.4 reCAPTCHA v3 Integration
**File**: `apps/frontend/components/RecaptchaBadge.tsx`

- Google reCAPTCHA v3 provider wrapper
- Site key configuration (environment variable)
- Token generation on form submit
- Badge display (bottom-right corner)

**File**: `apps/frontend/lib/recaptcha.ts`

- Token validation utility
- Score threshold checking (≥0.5 required)
- Error handling for reCAPTCHA failures

#### 3.5 Form Field Components
**File**: `apps/frontend/components/FormField.tsx`

- Reusable form field wrapper
- Label + Input + Error message
- Radix UI integration (accessible inputs)
- Validation state styling (error, success)

### Exit Criteria
1. ✅ Form renders on landing pages with all 3 steps
2. ✅ Step 1 → Step 2 → Step 3 navigation works (Next/Previous buttons)
3. ✅ Zod validation blocks invalid input (displays error messages)
4. ✅ reCAPTCHA v3 token generated on submit
5. ✅ TCPA consent required to submit (checkbox must be checked)
6. ✅ FormContext captures all form data across steps
7. ✅ MarketingContext captures UTM parameters and referrer
8. ✅ Form submission handler calls API route (stub returns 200 OK)
9. ✅ TypeScript compilation passes with 0 errors
10. ✅ Vitest unit tests pass for form components

### Success Metrics
```bash
# Validation Commands
cd apps/frontend
npm run test                             # Vitest tests pass
npm run dev                              # Start dev server

# Manual Validation in Browser
# Visit: http://localhost:3000/bathroom-remodel
# Fill Step 1: name, email, phone, zip → Click Next
# Expect: Step 2 displays, no validation errors
# Fill Step 2: service, scope, timeline, budget → Click Next
# Expect: Step 3 displays with TCPA consent
# Try Submit without TCPA → Expect: Error "TCPA consent required"
# Check TCPA → Click Submit
# Expect: reCAPTCHA token generated, API call to /api/submit-form
# DevTools Network Tab: Verify POST to /api/submit-form with form data + reCAPTCHA token
```

**Expected Output**:
- Form advances through all 3 steps
- Validation blocks invalid input (red error messages)
- TCPA consent enforced
- reCAPTCHA token included in submission
- Network request shows complete form data + UTM params + reCAPTCHA token

---

## Stage 4: Airtable Integration

### Purpose
Implement Netlify serverless functions for form submission, reCAPTCHA validation, and Make.com webhooks. Create Airtable services for CRUD operations, duplicate detection (5-minute window), and data persistence.

### Architecture Alignment
- **Netlify Functions** (architecture.md § Backend Framework)
- **AirtableService** CRUD operations
- **RecaptchaService** validation
- **DuplicateDetectionService** (5-min window)
- **Serverless API routes** (submit-form, validate-recaptcha, webhook-make-com)

### Entry Criteria
1. ✅ Stage 3 exit criteria met
2. ✅ Form submission flow working (frontend)
3. ✅ reCAPTCHA token generation working
4. ✅ Environment variables configured:
   - `AIRTABLE_API_KEY` (Personal Access Token)
   - `AIRTABLE_BASE_ID`
   - `RECAPTCHA_SECRET_KEY`
   - `MAKE_WEBHOOK_SECRET` (optional security token)

### Primary Deliverables

#### 4.1 Airtable Service
**File**: `apps/frontend/services/AirtableService.ts`

Methods:
- `createSubmission(data: FormSubmission): Promise<AirtableRecord>` - Create new submission
- `getSubmission(id: string): Promise<AirtableRecord>` - Read submission by ID
- `updateSubmission(id: string, data: Partial<FormSubmission>): Promise<AirtableRecord>` - Update submission
- `findDuplicateSubmissions(email: string, phone: string, withinMinutes: number): Promise<AirtableRecord[]>` - Find duplicates
- `listSubmissions(filters?: AirtableFilters): Promise<AirtableRecord[]>` - List with filters

#### 4.2 Recaptcha Service
**File**: `apps/frontend/services/RecaptchaService.ts`

Methods:
- `validateToken(token: string): Promise<RecaptchaValidation>` - Validate reCAPTCHA token with Google API
- `checkScore(score: number): boolean` - Check if score meets threshold (≥0.5)

Return type:
```typescript
interface RecaptchaValidation {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
}
```

#### 4.3 Duplicate Detection Service
**File**: `apps/frontend/services/DuplicateDetectionService.ts`

Methods:
- `isDuplicate(email: string, phone: string): Promise<boolean>` - Check for duplicates in 5-min window
- `markAsProcessed(submissionId: string): Promise<void>` - Mark submission as processed

Logic:
- Search Airtable for submissions with matching email OR phone
- Filter by `created_time` within last 5 minutes
- Return true if any matches found

#### 4.4 Serverless Functions
**File**: `apps/frontend/app/api/submit-form/route.ts`

POST handler:
1. Parse request body (form data + reCAPTCHA token)
2. Validate reCAPTCHA token with RecaptchaService
3. If score <0.5, return 400 Bad Request
4. Validate form data with Zod schema
5. Check for duplicates with DuplicateDetectionService
6. If duplicate found, return 409 Conflict
7. Create submission in Airtable with AirtableService
8. Set status = "Pending" (triggers Make.com workflow)
9. Return 201 Created with submission ID

**File**: `apps/frontend/app/api/validate-recaptcha/route.ts`

POST handler:
1. Parse request body (token)
2. Validate token with RecaptchaService
3. Return validation result (success, score)

**File**: `apps/frontend/app/api/webhook-make-com/route.ts`

POST handler:
1. Verify webhook secret (optional security)
2. Parse webhook payload from Make.com
3. Update Airtable submission status based on payload
4. Return 200 OK acknowledgment

#### 4.5 Error Handling
**File**: `apps/frontend/lib/errors.ts`

Custom error classes:
- `AirtableError` - Airtable API errors
- `RecaptchaError` - reCAPTCHA validation errors
- `DuplicateSubmissionError` - Duplicate detection errors
- `ValidationError` - Zod validation errors

Error response format:
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}
```

### Exit Criteria
1. ✅ Form submission creates Airtable record successfully
2. ✅ Duplicate detection works (5-minute window):
   - Submit form with email: test@example.com
   - Submit again within 5 minutes with same email
   - Expect: 409 Conflict response
3. ✅ reCAPTCHA validation enforced:
   - Submit form with invalid token
   - Expect: 400 Bad Request
4. ✅ Serverless functions deploy to Netlify (functions accessible via /.netlify/functions/)
5. ✅ Airtable CRUD operations tested (create, read, update)
6. ✅ Environment variables configured in Netlify dashboard
7. ✅ Webhook receiver responds to Make.com test payload
8. ✅ Vitest tests pass for all services
9. ✅ TypeScript compilation passes with 0 errors

### Success Metrics
```bash
# Validation Commands
cd apps/frontend
npm run test                             # Vitest tests for services pass

# Deploy to Netlify (or test locally with Netlify CLI)
netlify dev                              # Start local Netlify environment

# Manual Validation
# 1. Submit form via UI
curl -X POST http://localhost:8888/.netlify/functions/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {...},
    "recaptchaToken": "test-token",
    "utmParams": {...}
  }'
# Expect: 201 Created, Airtable record created

# 2. Test duplicate detection
# Submit same email/phone within 5 minutes
# Expect: 409 Conflict

# 3. Test reCAPTCHA validation
curl -X POST http://localhost:8888/.netlify/functions/validate-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"token": "test-token"}'
# Expect: { "success": true, "score": 0.9 }

# 4. Verify Airtable record
# Check Airtable base for new submission record
# Verify all fields populated correctly
```

**Expected Output**:
- Form submission creates Airtable record
- Duplicate detection prevents duplicate submissions
- reCAPTCHA validation enforced
- Serverless functions respond correctly
- Airtable records have correct schema and data

---

## Stage 5: Make.com Automation

### Purpose
Configure Make.com scenarios for content generation (Claude API integration), PMax asset export, and Netlify deployment triggering via webhooks.

### Architecture Alignment
- **Make.com Scenarios** (architecture.md § Make.com Integration)
- **Scenario 1**: Content Generation (Airtable → Claude API → Airtable)
- **Scenario 2**: Deployment Trigger (Airtable → Netlify Deploy Hook)
- **Claude API Integration** (claude-sonnet-4-5 model)
- **PMax Asset Generation** (15 headlines, 5 long headlines, 4 descriptions)

### Entry Criteria
1. ✅ Stage 4 exit criteria met
2. ✅ Airtable integration working
3. ✅ Submissions creating in Airtable with status="Pending"
4. ✅ Environment variables configured:
   - `ANTHROPIC_API_KEY` (Claude API key)
   - `NETLIFY_BUILD_HOOK_URL`
5. ✅ Make.com account created
6. ✅ Make.com MCP server configured (optional, for testing)

### Primary Deliverables

#### 5.1 Make.com Scenario 1: Content Generation
**Name**: "Landing Page Content Generation"

**Trigger**: Airtable Watch Records (status changes to "Pending")

**Steps**:
1. **Airtable: Watch Records**
   - Base: Landing Pages Automation
   - Table: Form Submissions
   - Filter: `status = "Pending"`
   - Trigger on new records or status change

2. **Claude API: Generate Content**
   - Model: `claude-sonnet-4-5`
   - Prompt Template:
     ```
     Generate landing page content for:
     Service: {{service_type}}
     Location: {{location}} (if geographic)
     Project Scope: {{project_scope}}

     Output format (JSON):
     {
       "headline": "...",
       "subheadline": "...",
       "hero_cta": "...",
       "pmax_headlines": [...], // 15 headlines, 30 chars each
       "pmax_long_headlines": [...], // 5 long headlines, 90 chars each
       "pmax_descriptions": [...], // 4 descriptions, 90 chars each
       "pmax_sitelinks": [...] // 4-10 sitelinks with titles/descriptions
     }
     ```
   - Max tokens: 4096
   - Temperature: 0.7

3. **Airtable: Update Record**
   - Record ID: {{trigger.record_id}}
   - Fields to update:
     - `generated_headline`: {{claude.content.headline}}
     - `generated_subheadline`: {{claude.content.subheadline}}
     - `pmax_headlines`: {{claude.content.pmax_headlines}}
     - `pmax_long_headlines`: {{claude.content.pmax_long_headlines}}
     - `pmax_descriptions`: {{claude.content.pmax_descriptions}}
     - `pmax_sitelinks`: {{claude.content.pmax_sitelinks}}
     - `status`: "Generated"
     - `generated_at`: {{NOW()}}

4. **Error Handler**:
   - If Claude API fails:
     - Update record: `status` = "Error", `error_message` = {{error}}
   - If Airtable update fails:
     - Retry 3 times with 1-minute delay

#### 5.2 Make.com Scenario 2: Deployment Trigger
**Name**: "Netlify Deployment Trigger"

**Trigger**: Airtable Watch Records (status changes to "Approved")

**Steps**:
1. **Airtable: Watch Records**
   - Base: Landing Pages Automation
   - Table: Form Submissions
   - Filter: `status = "Approved"`
   - Trigger on status change only

2. **HTTP: POST to Netlify Build Hook**
   - URL: {{NETLIFY_BUILD_HOOK_URL}}
   - Method: POST
   - Headers: None required
   - Body: Empty (trigger only)

3. **Airtable: Update Record**
   - Record ID: {{trigger.record_id}}
   - Fields to update:
     - `deployed_at`: {{NOW()}}
     - `deployment_triggered`: true

4. **Error Handler**:
   - If Netlify webhook fails:
     - Update record: `error_message` = "Deployment trigger failed: {{error}}"
     - Retry 3 times with 5-minute delay

#### 5.3 PMax Asset Export Function
**File**: `apps/frontend/lib/pmax.ts`

Utility to format Claude-generated content for Google Ads PMax:

```typescript
interface PMaxAssets {
  headlines: string[];           // 15 headlines, ≤30 chars
  longHeadlines: string[];       // 5 long headlines, ≤90 chars
  descriptions: string[];        // 4 descriptions, ≤90 chars
  sitelinks: SiteLink[];         // 4-10 sitelinks
}

function exportPMaxAssets(airtableRecord: AirtableRecord): PMaxAssets
function validatePMaxAssets(assets: PMaxAssets): ValidationResult
```

### Exit Criteria
1. ✅ Scenario 1 triggers when Airtable status changes to "Pending"
2. ✅ Claude API generates content successfully:
   - Headline, subheadline, CTA
   - 15 PMax headlines (≤30 chars each)
   - 5 PMax long headlines (≤90 chars each)
   - 4 PMax descriptions (≤90 chars each)
   - 4-10 PMax sitelinks
3. ✅ Generated content updates Airtable record
4. ✅ Airtable status changes to "Generated"
5. ✅ Scenario 2 triggers when status changes to "Approved"
6. ✅ Netlify build hook receives POST request
7. ✅ Netlify starts new build automatically
8. ✅ Airtable record updated with `deployed_at` timestamp
9. ✅ Error handling works (test by breaking API key)

### Success Metrics
```bash
# Validation Steps (Manual Testing in Make.com)

# 1. Test Scenario 1: Content Generation
# In Airtable:
# - Create test submission record
# - Set status = "Pending"
# - Wait 1-2 minutes for Make.com trigger

# In Make.com Dashboard:
# - Verify Scenario 1 executed successfully
# - Check execution logs for Claude API response
# - Verify Airtable record updated with generated content

# In Airtable:
# - Verify record has:
#   - generated_headline (populated)
#   - generated_subheadline (populated)
#   - pmax_headlines (JSON array, 15 items)
#   - pmax_long_headlines (JSON array, 5 items)
#   - pmax_descriptions (JSON array, 4 items)
#   - status = "Generated"
#   - generated_at (timestamp)

# 2. Test Scenario 2: Deployment Trigger
# In Airtable:
# - Change test record status = "Approved"
# - Wait 1-2 minutes for Make.com trigger

# In Make.com Dashboard:
# - Verify Scenario 2 executed successfully
# - Check HTTP module shows 200 OK from Netlify

# In Netlify Dashboard:
# - Verify new build started (check builds list)
# - Verify build triggered by "Deploy Hook"

# In Airtable:
# - Verify record has:
#   - deployed_at (timestamp)
#   - deployment_triggered = true

# 3. Test Error Handling
# Break Claude API key in Make.com Scenario 1
# Trigger scenario
# Expect: Airtable record status = "Error", error_message populated
```

**Expected Output**:
- Make.com scenarios trigger automatically
- Claude API generates content (validated format)
- Airtable records update correctly
- Netlify build hook triggers deployment
- Error handling captures and logs failures

---

## Stage 6: Deployment & Testing

### Purpose
Deploy complete application to Netlify production, implement Playwright E2E test suite, validate Core Web Vitals performance targets, and achieve Lighthouse score ≥90.

### Architecture Alignment
- **Netlify Deployment** (architecture.md § Deployment Host)
- **Playwright E2E Tests** (architecture.md § E2E Testing)
- **Core Web Vitals** (architecture.md § Performance Requirements)
  - LCP <2.5s (Largest Contentful Paint)
  - INP <200ms (Interaction to Next Paint)
  - CLS <0.1 (Cumulative Layout Shift)
- **Lighthouse CI** (Accessibility, Performance, SEO ≥90)

### Entry Criteria
1. ✅ Stage 5 exit criteria met
2. ✅ Make.com scenarios working
3. ✅ Content generation pipeline complete
4. ✅ Netlify deploy hook tested
5. ✅ Environment variables configured in Netlify:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `RECAPTCHA_SECRET_KEY`
   - `RECAPTCHA_SITE_KEY`
   - `ANTHROPIC_API_KEY`
   - `MAKE_WEBHOOK_SECRET`
6. ✅ DNS configured (if custom domain)
7. ✅ SSL certificate active (Netlify auto-provision)

### Primary Deliverables

#### 6.1 Production Deployment Configuration
**File**: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "apps/frontend/.next"
  functions = "apps/frontend/.netlify/functions"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*/  "
  to = "/:splat"
  status = 301
  force = true

[functions]
  node_bundler = "esbuild"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### 6.2 Playwright E2E Test Suite
**File**: `playwright.config.ts`

Configuration:
- Base URL: `https://your-site.netlify.app`
- Browsers: Chromium, Firefox, WebKit
- Retries: 2
- Parallel execution: 3 workers

**File**: `tests/e2e/landing-page.spec.ts`

Tests:
1. **Non-Geographic Route**:
   - Visit `/bathroom-remodel`
   - Verify hero image loads
   - Verify headline displays
   - Verify CTA button present

2. **Geographic Route**:
   - Visit `/chicago/bathroom-remodel`
   - Verify location in headline
   - Verify location-specific content

3. **Multi-Step Form Flow**:
   - Fill Step 1: name, email, phone, ZIP
   - Click "Next"
   - Fill Step 2: service, scope, timeline, budget
   - Click "Next"
   - Check TCPA consent
   - Click "Submit"
   - Verify API call made
   - Verify thank you page redirect

4. **Form Validation**:
   - Submit Step 1 with invalid email
   - Expect: Error message "Invalid email"
   - Submit Step 1 with invalid phone
   - Expect: Error message "Invalid phone format"
   - Submit Step 3 without TCPA
   - Expect: Error message "TCPA consent required"

5. **reCAPTCHA Integration**:
   - Verify reCAPTCHA badge displays
   - Submit form
   - Verify reCAPTCHA token included in API call

6. **Duplicate Detection**:
   - Submit form with email: test@example.com
   - Submit form again with same email within 5 minutes
   - Expect: Error message "Duplicate submission detected"

**File**: `tests/e2e/airtable-integration.spec.ts`

Tests:
1. **Form Submission Creates Airtable Record**:
   - Submit form via UI
   - Query Airtable API for submission
   - Verify record exists with correct data

2. **Make.com Content Generation Trigger**:
   - Create Airtable record with status="Pending"
   - Wait 2 minutes
   - Verify status changed to "Generated"
   - Verify generated content populated

**File**: `tests/e2e/performance.spec.ts`

Tests:
1. **Core Web Vitals Measurement**:
   - Visit landing page
   - Measure LCP (expect <2.5s)
   - Measure INP (expect <200ms)
   - Measure CLS (expect <0.1)

2. **Lighthouse Audit**:
   - Run Lighthouse on production URL
   - Verify Performance ≥90
   - Verify Accessibility ≥90
   - Verify SEO ≥90

#### 6.3 Performance Monitoring
**File**: `apps/frontend/lib/analytics.ts`

Web Vitals reporting:
```typescript
import { onCLS, onINP, onLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics or monitoring service
  console.log(metric);
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

#### 6.4 DNS & SSL Configuration
- Custom domain configured in Netlify (if applicable)
- SSL certificate auto-provisioned by Netlify
- DNS records verified (A/CNAME pointing to Netlify)

### Exit Criteria
1. ✅ Production site deployed to Netlify successfully
2. ✅ DNS configured (custom domain accessible or *.netlify.app URL working)
3. ✅ SSL certificate active (HTTPS working)
4. ✅ All Playwright E2E tests pass:
   - Landing page routes work
   - Multi-step form flow completes
   - Form validation enforced
   - reCAPTCHA integration working
   - Duplicate detection working
   - Airtable integration working
5. ✅ Core Web Vitals meet targets:
   - LCP <2.5s
   - INP <200ms
   - CLS <0.1
6. ✅ Lighthouse score ≥90 for:
   - Performance
   - Accessibility
   - SEO
7. ✅ Serverless functions deployed and accessible
8. ✅ Environment variables configured correctly
9. ✅ GTM script firing on page load
10. ✅ No console errors in production

### Success Metrics
```bash
# Validation Commands

# 1. Run E2E Tests Against Production
npx playwright test --config=playwright.config.ts
# Expect: All tests pass (0 failures)

# 2. Run Lighthouse Audit
npx lighthouse https://your-site.netlify.app --output=html --output-path=./lighthouse-report.html
# Expect: Performance ≥90, Accessibility ≥90, SEO ≥90

# 3. Measure Core Web Vitals
# Use Chrome DevTools → Performance tab
# Or use PageSpeed Insights: https://pagespeed.web.dev/
# Enter: https://your-site.netlify.app
# Expect:
#   LCP: <2.5s (green)
#   INP: <200ms (green)
#   CLS: <0.1 (green)

# 4. Verify Serverless Functions
curl -X POST https://your-site.netlify.app/.netlify/functions/submit-form \
  -H "Content-Type: application/json" \
  -d '{"formData": {...}, "recaptchaToken": "..."}'
# Expect: 201 Created

# 5. Verify DNS
nslookup your-custom-domain.com
# Expect: Resolves to Netlify IP

# 6. Verify SSL
curl -I https://your-custom-domain.com
# Expect: 200 OK with valid SSL certificate

# 7. End-to-End User Flow Test
# Manual:
# Visit: https://your-site.netlify.app/bathroom-remodel
# Complete form flow (3 steps)
# Submit form
# Verify redirect to thank-you page
# Check Airtable for submission record
# Change status to "Pending" in Airtable
# Wait 2 minutes for Make.com content generation
# Verify status changed to "Generated"
# Change status to "Approved"
# Wait 2 minutes for Netlify deploy hook
# Verify new build triggered in Netlify dashboard
```

**Expected Output**:
- Production site live and accessible
- All E2E tests pass
- Core Web Vitals meet targets
- Lighthouse scores ≥90
- Full user flow works end-to-end
- Airtable → Make.com → Netlify pipeline operational

---

## Stage Validation Workflow

### Pre-Stage Validation
Before starting any stage, dev-agent must verify:
1. ✅ All entry criteria met for the stage
2. ✅ Previous stage exit criteria validated
3. ✅ Required environment variables configured
4. ✅ Dependencies installed and updated

### During-Stage Validation
During stage execution, dev-agent must:
1. Run tests continuously (Vitest unit tests)
2. Validate TypeScript compilation after each file change
3. Check for console errors in development mode
4. Verify component rendering in browser

### Post-Stage Validation
After completing a stage, dev-agent must:
1. Run all validation commands listed in Success Metrics
2. Execute stage-specific tests (unit + integration)
3. Create living documentation update for the stage
4. Commit all stage deliverables to Git
5. Update Phase 1 validation log
6. Mark stage complete ONLY if all exit criteria met

### Validation Commands Reference
```bash
# TypeScript Validation
npx tsc --noEmit

# Linting
npm run lint

# Unit Tests
npm run test

# Build Validation
npm run build

# E2E Tests (Stage 6 only)
npx playwright test

# Lighthouse Audit (Stage 6 only)
npx lighthouse [url] --output=html
```

---

## Success Criteria Summary

### Stage 1 Success
- ✅ Monorepo structure created
- ✅ Dependencies installed
- ✅ TypeScript compiles
- ✅ Placeholder library functional

### Stage 2 Success
- ✅ Next.js builds successfully
- ✅ Routes accessible ([slug] and [location]/[slug])
- ✅ Placeholder images load
- ✅ GTM script present
- ✅ Tailwind styling applied

### Stage 3 Success
- ✅ Multi-step form functional (3 steps)
- ✅ Zod validation enforced
- ✅ reCAPTCHA v3 integrated
- ✅ TCPA consent required
- ✅ Form/Marketing context working

### Stage 4 Success
- ✅ Serverless functions deployed
- ✅ Airtable CRUD operations working
- ✅ Duplicate detection working (5-min window)
- ✅ reCAPTCHA validation enforced
- ✅ Form submissions persist in Airtable

### Stage 5 Success
- ✅ Make.com Scenario 1 working (content generation)
- ✅ Make.com Scenario 2 working (deployment trigger)
- ✅ Claude API generating content
- ✅ PMax assets formatted correctly
- ✅ Netlify build hook triggering

### Stage 6 Success
- ✅ Production site deployed
- ✅ All E2E tests pass
- ✅ Core Web Vitals meet targets (LCP <2.5s, INP <200ms, CLS <0.1)
- ✅ Lighthouse score ≥90 (Performance, Accessibility, SEO)
- ✅ Full user flow operational (form → Airtable → Make.com → Netlify)

---

## Phase 1 Completion Criteria

Phase 1 is complete when:
1. ✅ All 6 stages complete (all exit criteria met)
2. ✅ Production site deployed and accessible
3. ✅ Full automation pipeline operational:
   - User submits form → Airtable
   - Airtable status="Pending" → Make.com content generation
   - Airtable status="Approved" → Netlify deployment
4. ✅ All tests pass (unit, integration, E2E)
5. ✅ Core Web Vitals validated
6. ✅ Lighthouse scores ≥90
7. ✅ Living documentation complete for all stages
8. ✅ Phase 1 validation log updated
9. ✅ Ready for stakeholder review

**Estimated Total Time**: 28-34 hours
**Target**: Autonomous dev-agent execution with validation gates

---

## References

- **Architecture Document**: `docs/architecture.md` v1.5
- **PRD**: `docs/prd.md`
- **MCP Integration Patterns**: `docs/mcp-integration-patterns.md`
- **Context Files List**: `docs/phase-1-context-files.md`
- **Living Documentation Template**: `.bmad-core/templates/living-doc-tmpl.yaml`
- **Phase 0 Checklist**: `docs/phase-0-checklist.md`
