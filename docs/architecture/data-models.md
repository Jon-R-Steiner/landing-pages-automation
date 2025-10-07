# Data Models

Core data models shared between frontend and backend, stored in Airtable and represented as TypeScript interfaces in `packages/shared/src/types/`.

## Landing Page Model

**Purpose**: Represents a single landing page configuration including content, styling, and metadata for AI-driven generation and deployment.

**Key Attributes:**
- `id`: string - Unique identifier (Airtable record ID)
- `slug`: string - URL-friendly identifier (e.g., "free-consultation")
- `title`: string - Page meta title for SEO
- `status`: enum - Workflow state (Draft | Pending | Generated | Approved | Published | Archived)
- `contentBrief`: string - Stakeholder input describing desired content
- `generatedContent`: string - Claude-generated HTML/Markdown content
- `templateId`: string - Reference to template configuration
- `metadata`: object - SEO meta tags (description, keywords, og:image)
- `publishedUrl`: string - Live Netlify URL (null until published)
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last modification timestamp
- `createdBy`: string - Stakeholder email/name
- `approvedBy`: string - Approver email/name (null until approved)

### TypeScript Interface

```typescript
// packages/shared/src/types/landing-page.ts

export enum LandingPageStatus {
  Draft = 'draft',
  Pending = 'pending',           // Awaiting AI generation
  Generated = 'generated',        // Content created, awaiting review
  Approved = 'approved',          // Ready for deployment
  Published = 'published',        // Live on Netlify
  Archived = 'archived'
}

export interface LandingPageMetadata {
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export interface PMaxSitelink {
  title: string;           // 25 chars max
  description: string;     // 35 chars max
  url: string;            // Landing page URL or anchor link
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  status: LandingPageStatus;
  contentBrief: string;
  generatedContent: string | null;
  templateId: string;

  // Hero image fields (pre-mapped by page type)
  pageType: string;                   // e.g., "Walk In Shower", "Full Bathroom Remodel"
  heroImage: string;                  // Path to hero image (auto-selected based on pageType)
  heroImageAlt: string;              // Alt text for SEO

  metadata: LandingPageMetadata;
  publishedUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy: string | null;

  // Future enhancement fields (Phase 2 - SEO Optimization)
  canonicalUrl?: string | null;      // Self-referencing canonical URL
  structuredData?: object | null;    // JSON-LD schema markup (Product, FAQ, etc.)
  ogImage?: string | null;           // Open Graph image override
  twitterCard?: string | null;       // Twitter card type

  // PMax asset generation (Phase 1)
  pmaxHeadlines?: string[];          // 15 headlines (30 chars each)
  pmaxLongHeadlines?: string[];      // 5 long headlines (90 chars each)
  pmaxDescriptions?: string[];       // 4 descriptions (90 chars each)
  pmaxSitelinks?: PMaxSitelink[];    // 4-10 sitelinks with titles and descriptions
}
```

### Relationships
- **One-to-Many**: Landing Page → Form Submissions
- **Many-to-One**: Landing Page → Template

---

## Form Submission Model

**Purpose**: Stores user form submissions with complete marketing attribution tracking (UTM parameters, click IDs), multi-step form analytics, and TCPA compliance.

**Multi-Step Form Flow (Phase 1 - 3 Steps)**:
```
Step 1: Basic Info (fullName, email, phoneNumber, zipCode)
  ↓
Step 2: Project Details (jobType, howDidYouHear, commentsOrQuestions)
  ↓
Step 3: TCPA Consent + reCAPTCHA validation
  ↓
Submit to Backend
  ↓
Thank You Page (static redirect)
```

**Note**: Phase 2 conversion optimization explores 2-step flow (ZIP first → Full details) for 35-45% improvement in completion rate. Phase 1 uses balanced 3-step approach.

**Key Attributes:**

**System Fields:**
- `id`: string - Unique identifier
- `sessionId`: string - Links to FormSession for analytics
- `landingPageId`: string - Foreign key to Landing Page
- `submittedAt`: Date - Submission timestamp
- `status`: enum - Processing state (Pending | Verified | Contacted | Spam)
- `completionTimeSeconds`: number - Time from start to submit

**Marketing Attribution (captured on page load):**
- `gclid`: string | null - Google Ads Click ID
- `fbclid`: string | null - Facebook Ads Click ID
- `utmSource`: string | null - Traffic source
- `utmMedium`: string | null - Marketing medium
- `utmCampaign`: string | null - Campaign name
- `utmTerm`: string | null - Paid search keyword
- `utmContent`: string | null - Ad variation identifier
- `referrer`: string | null - HTTP referrer URL
- `pageUrl`: string - Landing page URL

**User Information (Step 1):**
- `fullName`: string - User's full name
- `phoneNumber`: string - User's phone number (10-digit US format)
- `email`: string - User's email address
- `zipCode`: string - User's ZIP code (5-digit US format)

**Project Details (Step 2):**
- `jobType`: string - Type of service/project requested
- `howDidYouHear`: string - Discovery channel
- `commentsOrQuestions`: string | null - Additional user message

**Validation & Security (Step 3):**
- `tcpaConsent`: boolean - TCPA agreement checkbox
- `recaptchaScore`: number - reCAPTCHA v3 score (0.0-1.0)
- `ipAddress`: string - User's IP for fraud detection
- `userAgent`: string - Browser user agent

### TypeScript Interface

```typescript
// packages/shared/src/types/form-submission.ts

export enum SubmissionStatus {
  Pending = 'pending',
  Verified = 'verified',
  Contacted = 'contacted',
  Spam = 'spam'
}

export interface MarketingAttribution {
  gclid?: string | null;
  fbclid?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  pageUrl: string;
}

export interface FormSubmission {
  // System fields
  id: string;
  sessionId: string;
  landingPageId: string;
  submittedAt: Date;
  status: SubmissionStatus;
  completionTimeSeconds: number;

  // Marketing attribution
  gclid: string | null;
  fbclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  referrer: string | null;
  pageUrl: string;

  // User information
  fullName: string;
  phoneNumber: string;
  email: string;
  zipCode: string;

  // Project details
  jobType: string;
  howDidYouHear: string;
  commentsOrQuestions: string | null;

  // Validation & security
  tcpaConsent: boolean;
  recaptchaScore: number;
  ipAddress: string;
  userAgent: string;

  // Future enhancement fields (Phase 2 - Offer Variations)
  offerId?: string | null;           // If running promotional offers
  pageVariant?: string | null;       // For A/B testing variants
  territory?: string | null;         // Geographic market targeting
  conversionPath?: string | null;    // Multi-touch attribution tracking
}

// Zod schema for runtime validation
import { z } from 'zod';

export const FormSubmissionSchema = z.object({
  // Marketing attribution (all optional)
  gclid: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  utmTerm: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  referrer: z.string().url().optional().nullable(),
  pageUrl: z.string().url(),

  // User information (all required)
  fullName: z.string().min(2).max(100),
  phoneNumber: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  zipCode: z.string().regex(/^\d{5}$/),

  // Project details
  jobType: z.string().min(1).max(200),
  howDidYouHear: z.string().min(1).max(100),
  commentsOrQuestions: z.string().max(2000).optional().nullable(),

  // Required validation fields
  landingPageId: z.string().min(1),
  tcpaConsent: z.boolean().refine((val) => val === true, {
    message: 'TCPA consent is required'
  }),
  recaptchaToken: z.string().min(1)
});

export type FormSubmissionInput = z.infer<typeof FormSubmissionSchema>;
```

### Relationships
- **Many-to-One**: Form Submission → Landing Page

---

## Template Model

**Purpose**: Defines reusable landing page templates with Tailwind styling configurations for consistent design.

**Key Attributes:**
- `id`: string - Unique identifier
- `name`: string - Template display name (e.g., "Lead Generation", "Product Launch")
- `description`: string - Template purpose description
- `layout`: enum - Page layout type (SingleColumn | TwoColumn | Hero | LongForm)
- `colorScheme`: object - Tailwind color configuration
- `components`: array - Available component types
- `isActive`: boolean - Whether template is available

### TypeScript Interface

```typescript
// packages/shared/src/types/template.ts

export enum TemplateLayout {
  SingleColumn = 'single-column',
  TwoColumn = 'two-column',
  Hero = 'hero',
  LongForm = 'long-form'
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateComponent {
  type: 'hero' | 'form' | 'features' | 'testimonials' | 'cta' | 'footer';
  enabled: boolean;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  layout: TemplateLayout;
  colorScheme: ColorScheme;
  components: TemplateComponent[];
  isActive: boolean;
}
```

### Relationships
- **One-to-Many**: Template → Landing Pages

---

## TCPA Rules Model

**Purpose**: Stores TCPA compliance validation rules for form submissions.

**Key Attributes:**
- `id`: string - Unique identifier
- `industry`: string - Industry category
- `requiresConsent`: boolean - Whether explicit TCPA checkbox required
- `consentText`: string - Required legal disclaimer text
- `minimumRecaptchaScore`: number - Minimum score threshold (0.0-1.0)
- `blockedCountries`: array - ISO country codes where forms disabled

### TypeScript Interface

```typescript
// packages/shared/src/types/tcpa-rules.ts

export interface TCPARules {
  id: string;
  industry: string;
  requiresConsent: boolean;
  consentText: string;
  minimumRecaptchaScore: number;
  blockedCountries: string[];
}
```

---

## Form Session Model

**Purpose**: Track partial form completion and prevent duplicate submissions.

**Key Attributes:**
- `sessionId`: string - Unique browser session identifier (UUID)
- `landingPageId`: string - Which landing page the form is on
- `currentStep`: number - Current step in form (1-3)
- `startedAt`: Date - When user began filling form
- `lastActivityAt`: Date - Last interaction timestamp
- `isCompleted`: boolean - Whether form was successfully submitted

### TypeScript Interface

```typescript
// packages/shared/src/types/form-session.ts

export interface FormSession {
  sessionId: string;
  landingPageId: string;
  currentStep: number;
  startedAt: Date;
  lastActivityAt: Date;
  isCompleted: boolean;
  ipAddress: string;
}
```

---

## Thank You Page

**Purpose**: Static confirmation page shown after successful form submission.

**Implementation**: No data model needed - static Next.js page at `/thank-you` route.

**Duplicate Prevention**: Backend duplicate detection (5-minute window on email+phone) handles resubmissions if user hits back button.

---
