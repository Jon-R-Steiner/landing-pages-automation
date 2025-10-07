# Landing Pages Automation Fullstack Architecture Document

**Version**: 1.4
**Date**: 2025-10-07
**Author**: Winston (Architect Agent)

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-07 | 1.4 | Added comprehensive URL Structure & Routing section: Single subdomain strategy with geographic and non-geographic URL patterns, Google Ads optimization guidelines, Next.js dual routing implementation (`[slug]` and `[location]/[slug]`), UTM parameter handling, SEO/canonical URL policy, Airtable schema additions (`geo_targeting`, `location_slug`, `service_slug`, `full_path` formula), Netlify trailing slash redirect configuration, URL validation rules, and reserved path patterns. Updated Monorepo Layout with new `[location]/[slug]` route structure and `middleware.ts` for URL normalization. Rationale: URL structure is critical for Google Ads Quality Score, ad relevance, and cost-per-click optimization - explicit specification ensures dev-agent implements Google Ads best practices | Winston (Architect Agent) |
| 2025-10-07 | 1.3 | Removed GitHub Actions/CI dependencies: Eliminated `.github/workflows/` from Monorepo Layout, updated Tech Stack CI/CD to "Netlify Built-in", simplified High Level Architecture diagram (Git Push → Netlify direct), removed GitHub Actions workflow specifications, updated deployment process to Netlify-native only. Rationale: Netlify handles all CI/CD natively with automatic builds on Git push, preview deployments for PRs, and built-in testing capabilities - separate GitHub Actions adds unnecessary complexity | Winston (Architect Agent) |
| 2025-10-07 | 1.2 | Monorepo Layout completeness review: Fixed TypeScript path alias (`"@/*": ["./*"]`), added next.config.js specification with Turbopack and image optimization, added tailwind.config.js with design system tokens from front-end-spec, added globals.css with Tailwind directives and custom styles, added .gitignore specification, clarified hero image strategy (Phase 1 placeholder URLs, Phase 2 physical files) | Winston (Architect Agent) |
| 2025-10-07 | 1.1 | Aligned with front-end-spec.md v1.3: Added Content Generation Strategy, Frontend Implementation Documents references, Visual Design Authority clarification, Image Asset Strategy (placeholder images), Document Dependencies matrix; Updated Core Web Vitals from FID to INP (Google March 2024 standard) | Winston (Architect Agent) |
| 2025-10-07 | 1.0 | Initial architecture document creation | Winston (Architect Agent) |

---

## Introduction

This document outlines the complete fullstack architecture for **Landing Pages Automation**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**N/A - Greenfield Framework Development**

This is greenfield infrastructure development within an existing monorepo. The project extends the established `.bmad-core/` framework with:
- New agent definitions in `.bmad-core/agents/`
- New templates in `.bmad-core/templates/`
- New documentation patterns in `Landing Pages Automation/docs/`

The existing BMAD framework (Orchestrator, workflow management, slash command routing) is the "platform" being extended, not replaced.

### Architecture Context

**Phase 0 Scope Revision**: Following BMad Method principles ("Dev Agents Must Be Lean"), this architecture supports **dev-agent** as the sole development agent consuming this document as context, rather than creating specialized agents that would violate BMad's lean agent philosophy.

Phase 0 deliverables:
1. ✅ **This Architecture Document** (dev-agent implementation guide)
2. ✅ **Living Documentation Template** (reusable across projects)
3. ✅ **MCP Research Documents** (context for dev-agent)
4. ✅ **Session Starter Configuration** (references dev-agent + context)

---

## High Level Architecture

### Technical Summary

The **Landing Pages Automation** system is a **Jamstack serverless architecture** that automates the creation, deployment, and management of marketing landing pages through AI-driven content generation and low-code workflow orchestration.

**Frontend**: Next.js 15.5 (App Router) with TypeScript, deployed to Netlify, provides the landing page templates with server-side rendering for SEO optimization and multi-step form submission handling.

**Backend**: Netlify serverless functions (Node.js 20 runtime) handle form submissions, TCPA compliance validation, reCAPTCHA v3 verification, and webhook integrations with Make.com workflow automation platform.

**Data Layer**: Airtable serves as the primary database, storing landing page configurations, content templates, form submissions, and approval workflows—enabling non-technical stakeholders to manage content through familiar spreadsheet interfaces.

**Integration Layer**: Make.com orchestrates workflows between Airtable (content source), Claude API (AI content generation), and Netlify (deployment triggers via deploy hooks), creating a fully automated pipeline from content brief to deployed landing page.

**Development Approach**: Monorepo structure using npm workspaces enables shared TypeScript types between frontend and serverless functions, with dev-agent as the sole development agent consuming MCP integration guides and this architecture as context.

This architecture achieves the PRD's goal of eliminating human coordination overhead by providing dev-agent with complete implementation guidance, leveraging existing BMad framework patterns rather than creating specialized agents.

### Platform and Infrastructure Choice

**Platform**: **Netlify + Airtable + Make.com**

**Key Services**:
- **Netlify**: Hosting, serverless functions, deployment automation, form handling
- **Airtable**: Database, content management, approval workflows
- **Make.com**: Workflow automation and orchestration (3,000+ integrations, AI Agents)
- **Claude API**: AI content generation (Sonnet 4.5)
- **GitHub**: Version control and deployment triggers

**Deployment Host and Regions**:
- Netlify Global Edge Network (automatic CDN distribution)
- Primary region: US-East (configurable per landing page target audience)

### Repository Structure

**Structure**: Monorepo (single repository with multiple packages)

**Monorepo Tool**: npm workspaces (lightweight, no additional tooling needed)

**Package Organization**:
```
apps/
  web/          # Next.js frontend application
  functions/    # Netlify serverless functions
packages/
  shared/       # Shared TypeScript types and utilities
  config/       # Shared configuration (ESLint, TypeScript, etc.)
```

**Rationale**: Monorepo enables type sharing between frontend and serverless functions (critical for form schemas, Airtable models), while npm workspaces provides sufficient capability without Turborepo/Nx complexity for this project size.

### High Level Architecture Diagram

```mermaid
graph TB
    User[User/Visitor] --> Web[Next.js 15.5 Landing Pages<br/>Netlify Edge]

    Stakeholder[Content Stakeholder] --> Airtable[(Airtable Database<br/>Content + Config + TCPA Rules)]

    Web -->|Form Submission| Functions[Netlify Functions<br/>Node.js Runtime]
    Functions -->|Validate| Airtable
    Functions -->|TCPA Check| Airtable
    Functions -->|Store| Airtable

    Airtable -->|Status=Pending| Make[Make.com AI Agents<br/>Workflow Automation]
    Make -->|Generate Content| Claude[Claude Sonnet 4.5<br/>Model: claude-sonnet-4-5]
    Claude -->|Content| Make
    Make -->|Status=Generated| Airtable

    Airtable -->|Status=Approved| Make
    Make -->|Netlify Deploy Hook| Netlify[Netlify Build<br/>Turbopack]
    Netlify -->|Deploy| Web

    Make -.->|Build Failed| Airtable
    Make -.->|Content Gen Failed| Airtable

    Dev[dev-agent] -->|Git Push| Netlify
    Netlify -->|Auto Build & Deploy| Web

    style Web fill:#4A90E2
    style Functions fill:#50C878
    style Airtable fill:#F7B731
    style Make fill:#6C5CE7
    style Claude fill:#FF6B6B
    style Netlify fill:#00C7B7
```

### Architectural Patterns

- **Jamstack Architecture**: Static site generation with serverless APIs for dynamic functionality - _Rationale: Optimal performance, SEO, and scalability for content-focused landing pages_

- **Headless CMS Pattern**: Airtable as content source, Next.js as presentation layer - _Rationale: Non-technical content management with developer-friendly build integration_

- **Serverless Functions**: Event-driven compute for form processing and webhooks - _Rationale: Zero maintenance, automatic scaling, pay-per-use cost model_

- **API Gateway Pattern**: Netlify Functions as single entry point for all backend logic - _Rationale: Built-in rate limiting, HTTPS, and edge distribution_

- **Workflow Orchestration**: Make.com coordinates multi-step automation flows - _Rationale: Visual workflow builder enables non-developers to modify automation logic_

- **Git-Driven Deployment**: Code commits trigger automatic builds and deploys - _Rationale: Version control for all changes, rollback capability, preview environments_

- **Shared Types Pattern**: TypeScript interfaces defined once in `packages/shared` - _Rationale: Single source of truth for data structures across frontend and backend_

- **Multi-Step Form Pattern**: Progressive disclosure with client-side state management - _Rationale: Higher conversion rates, better data quality, abandonment analytics_

---

## Tech Stack

This is the **DEFINITIVE** technology selection for the entire project. All development must use these exact versions.

### Framework Decision: Next.js 15.5 vs Astro

**Decision**: Next.js 15.5 (App Router with Turbopack)

**Rationale**:

While the original specification recommended Astro for static site generation, Next.js 15.5 provides superior capabilities for this project's requirements:

**Next.js Advantages for Landing Pages Automation**:

1. **Integrated Serverless Functions**:
   - Form submission handlers, webhook receivers, reCAPTCHA validation co-located with pages
   - Netlify Functions seamlessly deploy from Next.js API routes
   - No separate serverless function setup required (Astro requires external configuration)

2. **Superior Developer Experience**:
   - TypeScript-first with excellent type inference
   - Instant HMR with Turbopack (10x faster than Webpack)
   - Mature debugging tools and error messages
   - Extensive ecosystem and community support

3. **Image Optimization Built-In**:
   - Next.js Image component: automatic WebP conversion, responsive sizing, lazy loading
   - Critical for hero images and Core Web Vitals performance
   - Astro's image optimization is less mature

4. **React Ecosystem Access**:
   - Radix UI for accessible form components
   - React Hook Form for multi-step form state management
   - Official reCAPTCHA v3 React integration
   - React Testing Library + Playwright for comprehensive testing

5. **Monorepo Support**:
   - Seamless npm workspaces integration
   - Shared TypeScript types between frontend and serverless functions
   - Single source of truth for data models

6. **Future Scalability**:
   - Supports SSG (like Astro) but also ISR (Incremental Static Regeneration)
   - Can add dynamic routes without refactoring
   - Better suited for Phase 2 enhancements (offer variations, A/B testing)

7. **Production-Ready at Scale**:
   - Battle-tested by Vercel, Netflix, TikTok, Uber
   - Superior performance monitoring and debugging
   - Extensive Netlify integration documentation

**Trade-off Accepted**:
- Next.js ships ~80KB React runtime (Astro ships zero JavaScript by default)
- Worth the trade-off for developer experience, integrated serverless functions, and superior image optimization

**Performance Parity**:
- Both achieve Core Web Vitals targets (LCP <2.5s, CLS <0.1, INP <200ms)
- Next.js 15.5 with Turbopack matches Astro build speeds for this project size
- Static generation produces similar output performance

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.6+ | Type-safe frontend development | Industry standard for large-scale React apps, catch errors at compile time |
| **Frontend Framework** | Next.js | 15.5 | React framework with SSR/SSG | Latest stable (Aug 2025) with Turbopack builds, App Router, optimal for SEO-critical landing pages |
| **UI Component Library** | Radix UI | 1.1+ | Unstyled accessible primitives | Headless components for forms, dialogs, dropdowns—fully accessible, works perfectly with Tailwind |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first styling | Fast iteration, consistent design system, no CSS files, perfect for landing page variants |
| **Bot Protection** | Google reCAPTCHA v3 | v3 | Spam and bot prevention for forms | Score-based risk assessment (0.0-1.0), no user friction, required for TCPA compliance validation |
| **Tag Management** | Google Tag Manager | Latest (Cloud) | Dynamic script and tracking management | Deploy analytics, pixels, tracking scripts without code changes—stakeholders can add tools independently |
| **State Management** | React Context + Hooks | Built-in | Local state management | Sufficient for landing pages (no complex global state), reduces dependencies |
| **Backend Language** | TypeScript | 5.6+ | Type-safe serverless functions | Shared types with frontend via monorepo packages |
| **Backend Framework** | Netlify Functions | Node.js 20 | Serverless compute | Zero ops, auto-scaling, stable Node.js runtime (as of Next.js 15.2), integrated with Netlify deployment |
| **API Style** | REST | HTTP/JSON | Form submissions and webhooks | Simple REST endpoints sufficient for form POST and webhook receivers |
| **Database** | Airtable | REST API v2 | Content management and data storage | Non-technical stakeholder access, spreadsheet UI, built-in approval workflows |
| **Cache** | Netlify Edge | CDN | Static asset caching | Automatic global CDN distribution, no configuration needed |
| **File Storage** | Netlify | Built-in | Static assets and builds | Images, fonts, build artifacts stored in Netlify infrastructure |
| **Authentication** | N/A (Phase 1) | - | Not required for public landing pages | Public landing pages only, stakeholders use Airtable directly |
| **Form Validation** | Zod | 3.23+ | Runtime schema validation | Type-safe validation, shared schemas between frontend and backend |
| **Frontend Testing** | Vitest | 2.1+ | Unit and component tests | Fast, Vite-native, compatible with Next.js 15.5 |
| **Backend Testing** | Vitest | 2.1+ | Serverless function tests | Same test framework as frontend for consistency |
| **E2E Testing** | Playwright | 1.48+ | Browser automation | Official Microsoft tool, excellent MCP integration for Claude Code |
| **Build Tool** | Turbopack | Beta (Next.js 15.5) | Next.js production builds | 10x faster than Webpack, use `next build --turbopack` |
| **Bundler** | Built-in | Next.js/Turbopack | Module bundling | Next.js handles bundling internally |
| **IaC Tool** | N/A | - | No infrastructure as code | Netlify is platform-managed, no Terraform/CDK needed |
| **CI/CD** | Netlify | Built-in | Automated builds and deployments | Git push triggers automatic builds, preview deployments for PRs, no separate CI needed |
| **Monitoring** | Netlify Analytics | Built-in | Traffic and performance metrics | Basic analytics included |
| **Logging** | Console + Netlify Logs | Built-in | Function execution logs | Netlify captures all console output, searchable in dashboard |
| **Automation Platform** | Make.com | Latest (Oct 2025) | Workflow orchestration | 3,000+ integrations, Make AI Agents (April 2025), visual workflow builder |
| **AI Content Generation** | Claude Sonnet 4.5 | claude-sonnet-4-5 | Landing page content generation | Best coding model (Sep 2025), $3/$15 per million tokens, 1-hour prompt caching |
| **Package Manager** | npm | 10+ | Dependency management and workspaces | Built-in workspaces for monorepo, no additional tooling |
| **Code Formatting** | Prettier | 3.3+ | Consistent code style | Standard formatter, integrates with ESLint |
| **Linting** | ESLint | 9+ | Code quality enforcement | Next.js built-in config, TypeScript rules |

### Future Improvements Backlog

Not included in Phase 1, deferred for future iterations:
- **Cloudinary**: Advanced image optimization beyond Next.js built-in
- **SendGrid/Resend**: Email notification service for form submissions
- **Sentry**: Error tracking and monitoring
- **Admin Portal**: Web-based admin dashboard with authentication (if needed)

---

## Content Generation Strategy

AI-generated landing page content must adhere to the comprehensive **Brand Voice & Content Strategy** documented in `front-end-spec.md` (Version 1.1+).

### Key Content Requirements

**Reading Level & Structure**:
- **Target Reading Level**: 3rd grade (Flesch-Kincaid score)
- **Sentence Length**: Average 12-15 words
- **Paragraph Length**: 2-3 sentences maximum
- **Active Voice**: 90%+ of sentences

**Core Voice Attributes**:
1. **Trustworthy**: Established, reliable, proven results with specific numbers
2. **Approachable**: Friendly but professional, conversational without slang
3. **Value-Focused**: Emphasize savings and ROI, lead with benefits not features
4. **Action-Oriented**: Clear next steps, urgency without pressure
5. **Expert**: Knowledgeable without being condescending

**Content Structure Formulas**:

**H1 Headline Formula**:
```
[Action Verb] + [Benefit] + [Product/Service] + [Urgency]
```
Example: "Claim Your Exclusive 40% Discount on Bathroom Remodeling Today"

**Page Title Formula**:
```
[Offer] + [Product/Service] + [Territory] | [Brand] Deals
```
Example: "Save 40% on Bathroom Remodeling in Boston | HomeServices Deals"

**Introduction Paragraph (4-Sentence Structure)**:
1. Problem Statement (one sentence acknowledging user need)
2. Solution Bridge (how we solve it)
3. Value Statement (what they save/gain)
4. Trust Signal (why choose us)

**CTA Button Text Standards**:
- ❌ Never use: "Submit", "Click here"
- ✅ Always use descriptive action language:
  - "Claim Your [X]% Discount" (percentage offers)
  - "Get My Free Quote" (free quote offers)
  - "Start Saving Now" (generic savings)
  - "See My Savings" (ZIP code entry step)
  - "Get Your Deal" (final submission)

**Territory Customization Requirements**:
- Greeting: "Serving [territory] homeowners since [year]"
- Trust Signal: "Trusted by [X] [territory] families"
- Local Proof: "[X] projects completed in [city]"
- Regional Phone: Display territory-specific phone number

**Required Trust Signals** (include 2-3 per page):
- "Trusted by [X] homeowners"
- "[X] years serving [territory] homeowners"
- "[X]% customer satisfaction rate"
- "Money-back satisfaction guarantee"
- "Licensed and insured contractors"
- "No hidden fees or surprises"
- "Free project quotes"

**Prohibited Content** (never use):
- ❌ Superlatives without proof ("best", "greatest", "#1")
- ❌ Fake urgency or false scarcity
- ❌ Misleading comparisons or competitor bashing
- ❌ Complex industry jargon without explanation
- ❌ Passive voice constructions
- ❌ Sentences over 20 words
- ❌ Paragraphs over 3 sentences
- ❌ Multiple exclamation points or ALL CAPS text

### Content Quality Validation Checklist

Before publishing any AI-generated content, verify:
- [ ] Reading level is 3rd grade or below (use readability tool)
- [ ] All claims have specific numbers or proof points
- [ ] CTAs clearly state what happens next (no "Submit")
- [ ] No grammar or spelling errors
- [ ] Territory is correctly referenced throughout
- [ ] Offer details match source data (Airtable)
- [ ] 2-3 trust signals included and prominently placed
- [ ] Urgency is genuine (not false scarcity)
- [ ] Benefits outweigh features at 3:1 ratio minimum
- [ ] Customer problem is addressed in opening paragraph
- [ ] Every section has clear next step or CTA
- [ ] Mobile text is minimum 16px (prevents iOS zoom)

**Reference Document**: `docs/front-end-spec.md` Section: "Brand Voice & Content Strategy"

---

## Frontend Implementation Documents

Dev-agent must reference these four implementation guides during frontend development:

1. **Component Shopping List** (`docs/component-shopping-list.md`)
   - Pre-built component sources with URLs and code snippets
   - Sources: DaisyUI, HyperUI, Tailblocks
   - Exact components for buttons, forms, hero sections, testimonials

2. **Component Customization Guide** (`docs/component-customization-guide.md`)
   - Adaptation patterns for brand guidelines compliance
   - How to modify pre-built components to match design system
   - Color, typography, and spacing overrides

3. **Build Order & Acceptance Criteria** (`docs/build-order-and-acceptance-criteria.md`)
   - Phased implementation sequence with completion gates
   - Clear acceptance criteria for each build phase
   - Dependency management and testing requirements

4. **Playwright Test Scenarios** (`docs/playwright-test-scenarios.md`)
   - Automated validation tests for spec compliance
   - E2E test scenarios for form flows and user journeys
   - Accessibility and performance validation tests

**Implementation Path**: Component Shopping List → Customization Guide → Build Order → Playwright Validation

---

## Visual Design Authority

The **authoritative source** for visual design specifications is `docs/front-end-spec.md`.

This architecture document provides **technical implementation guidance**. For exact visual specifications, reference:

- **Color hex codes and usage rationale** → `front-end-spec.md` § Branding & Style Guide
- **Typography scale, weights, and line heights** → `front-end-spec.md` § Typography
- **Animation specifications, durations, and easing** → `front-end-spec.md` § Animation & Micro-interactions
- **Component styling details and variants** → `front-end-spec.md` § Component Library / Design System
- **Spacing scale and layout principles** → `front-end-spec.md` § Spacing & Layout
- **Iconography library and usage guidelines** → `front-end-spec.md` § Iconography

**Design System Approach**: Custom component library using Radix UI primitives + Tailwind CSS

**Component Storage**: `/apps/web/components/` (PascalCase naming convention)

---

## Image Asset Strategy

### Phase 1: Placeholder Images

**Decision**: Use placeholder images during initial development and testing to avoid premature asset selection and licensing costs.

**Placeholder Service**: Use **placehold.co** (modern, fast, customizable)

**Hero Image Placeholders**:
```typescript
// Hero images by page type (all 1200x800px WebP format)
const placeholderHeroImages = {
  'walk-in-shower': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Walk-In+Shower',
  'full-bathroom-remodel': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Bathroom+Remodel',
  'hvac-services': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=HVAC+Services',
  'roofing-services': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Roofing+Services',
};
```

**Trust Badge Placeholders**:
```typescript
// Trust badges (200x100px)
const placeholderBadges = {
  'bbb-logo': 'https://placehold.co/200x100/F7B731/0F172A/webp?text=BBB+A%2B',
  'license-badge': 'https://placehold.co/200x100/059669/FFFFFF/webp?text=Licensed',
  'insurance-badge': 'https://placehold.co/200x100/059669/FFFFFF/webp?text=Insured',
};
```

**Implementation Requirements**:
- All placeholder images use Next.js `<Image>` component
- Include proper `alt` text for accessibility
- Use `priority` prop for hero images (LCP optimization)
- Maintain exact aspect ratios for production asset replacement

**Production Asset Migration Plan** (Phase 2):
1. Source high-quality stock photos or commission photography
2. Optimize images with Next.js Image component (automatic WebP conversion)
3. Replace placeholder URLs with `/public/images/heroes/` paths
4. Verify no performance regression (LCP should remain <2.0s)

**Rationale**: Placeholder images allow:
- Immediate development start without asset procurement delays
- Testing of image loading performance and Core Web Vitals
- Validation of responsive image behavior across breakpoints
- Easy production asset swapping via simple URL updates

---

## Document Dependencies

| Document | Version | Relationship | Last Sync Date |
|----------|---------|--------------|----------------|
| `architecture.md` | 1.3 | Primary implementation guide | 2025-10-07 |
| `front-end-spec.md` | 1.3 | Visual design authority | 2025-10-07 |
| `component-shopping-list.md` | 1.0 | Component sources | 2025-10-07 |
| `component-customization-guide.md` | 1.0 | Styling guidance | 2025-10-07 |
| `build-order-and-acceptance-criteria.md` | 1.0 | Implementation sequence | 2025-10-07 |
| `playwright-test-scenarios.md` | 1.0 | Validation tests | 2025-10-07 |

**Sync Policy**: When `front-end-spec.md` is updated, review this architecture document for alignment within 48 hours.

---

## Data Models

Core data models shared between frontend and backend, stored in Airtable and represented as TypeScript interfaces in `packages/shared/src/types/`.

### Landing Page Model

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

#### TypeScript Interface

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

#### Relationships
- **One-to-Many**: Landing Page → Form Submissions
- **Many-to-One**: Landing Page → Template

---

### Form Submission Model

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

#### TypeScript Interface

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

#### Relationships
- **Many-to-One**: Form Submission → Landing Page

---

### Template Model

**Purpose**: Defines reusable landing page templates with Tailwind styling configurations for consistent design.

**Key Attributes:**
- `id`: string - Unique identifier
- `name`: string - Template display name (e.g., "Lead Generation", "Product Launch")
- `description`: string - Template purpose description
- `layout`: enum - Page layout type (SingleColumn | TwoColumn | Hero | LongForm)
- `colorScheme`: object - Tailwind color configuration
- `components`: array - Available component types
- `isActive`: boolean - Whether template is available

#### TypeScript Interface

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

#### Relationships
- **One-to-Many**: Template → Landing Pages

---

### TCPA Rules Model

**Purpose**: Stores TCPA compliance validation rules for form submissions.

**Key Attributes:**
- `id`: string - Unique identifier
- `industry`: string - Industry category
- `requiresConsent`: boolean - Whether explicit TCPA checkbox required
- `consentText`: string - Required legal disclaimer text
- `minimumRecaptchaScore`: number - Minimum score threshold (0.0-1.0)
- `blockedCountries`: array - ISO country codes where forms disabled

#### TypeScript Interface

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

### Form Session Model

**Purpose**: Track partial form completion and prevent duplicate submissions.

**Key Attributes:**
- `sessionId`: string - Unique browser session identifier (UUID)
- `landingPageId`: string - Which landing page the form is on
- `currentStep`: number - Current step in form (1-3)
- `startedAt`: Date - When user began filling form
- `lastActivityAt`: Date - Last interaction timestamp
- `isCompleted`: boolean - Whether form was successfully submitted

#### TypeScript Interface

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

### Thank You Page

**Purpose**: Static confirmation page shown after successful form submission.

**Implementation**: No data model needed - static Next.js page at `/thank-you` route.

**Duplicate Prevention**: Backend duplicate detection (5-minute window on email+phone) handles resubmissions if user hits back button.

---

## API Specification

**API Style**: REST (HTTP/JSON)

Netlify serverless functions handle form submissions, webhook receivers, and validation endpoints.

### Endpoints

#### POST /api/submit-form

**Purpose**: Submit complete multi-step form (final step)

**Request Body**:
```json
{
  "gclid": "CjwKCAiA...",
  "fbclid": null,
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "spring_2025",
  "utmTerm": "bathroom remodel",
  "utmContent": "ad_variant_a",
  "referrer": "https://google.com",
  "pageUrl": "https://example.com/bathroom-remodel",
  "fullName": "Judith Curtis",
  "email": "seabee1912@aol.com",
  "phoneNumber": "7409368043",
  "zipCode": "43021",
  "jobType": "Full bathroom remodel",
  "howDidYouHear": "Online Search",
  "commentsOrQuestions": "Looking for a quote",
  "tcpaConsent": true,
  "recaptchaToken": "03AGdBq27...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "landingPageId": "rec123456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "submissionId": "recABC123",
  "message": "Form submitted successfully"
}
```

**Error Responses**:
- `400`: Validation error (missing fields, invalid format)
- `429`: Duplicate submission detected (same email+phone within 5 minutes)
- `500`: Server error

---

#### POST /api/validate-recaptcha

**Purpose**: Server-side reCAPTCHA v3 validation (Step 3)

**Request Body**:
```json
{
  "token": "03AGdBq27...",
  "action": "submit_form"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "score": 0.9,
  "action": "submit_form"
}
```

---

#### POST /api/webhook/make-com

**Purpose**: Webhook receiver for Make.com automation

**Request Body**:
```json
{
  "event": "content_approved",
  "landingPageId": "rec123456",
  "data": {
    "approvedBy": "john@example.com",
    "approvedAt": "2025-10-07T10:30:00Z"
  }
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

#### POST /api/webhook/netlify-deploy

**Purpose**: Webhook receiver for Netlify deployment notifications

**Request Body**:
```json
{
  "state": "ready",
  "context": "production",
  "deploy_id": "abc123",
  "site_id": "xyz789"
}
```

**Success Response (200)**:
```json
{
  "success": true
}
```

---

### Security

- **reCAPTCHA validation**: Always server-side, token never trusted from client
- **Webhook signatures**: HMAC authentication for webhook endpoints
- **Rate limiting**: Netlify edge enforces 5 req/sec default
- **CORS**: Configured to allow only approved domains
- **Duplicate detection**: 5-minute window on email+phone prevents spam

---

## Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
NEXT_PUBLIC_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### Backend (Netlify Environment)

```bash
RECAPTCHA_SECRET_KEY=your_secret_key
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
MAKE_WEBHOOK_SECRET=your_webhook_secret
NETLIFY_DEPLOY_HOOK_URL=your_deploy_hook_url
```

---

## Asset Management Strategy

### Hero Image Approach

**Strategy**: Pre-selected hero images mapped to specific page types. Each landing page type (e.g., "Walk In Shower", "Full Bathroom Remodel") has a dedicated hero image.

**Important**: NO AI-generated images. All hero images are pre-selected, high-quality photos stored in the project.

### Asset Folder Structure

```
apps/web/public/images/
├── heroes/
│   ├── walk-in-shower.webp
│   ├── full-bathroom-remodel.webp
│   ├── kitchen-remodel.webp
│   ├── flooring-installation.webp
│   ├── tile-work.webp
│   ├── countertop-installation.webp
│   ├── plumbing-services.webp
│   ├── general-contractor.webp
│   └── default.webp
│
├── icons/
│   ├── save-money.svg
│   ├── clock-fast.svg
│   ├── shield-check.svg
│   ├── chart-growth.svg
│   └── [other feature icons]
│
└── trust/
    ├── guarantee-badge.svg
    ├── bbb-accredited.svg
    └── 5-star-rating.svg
```

### Hero Image Mapping Logic

**Airtable Formula** (in Landing Pages table):

```javascript
// hero_image field (Formula type)
SWITCH({page_type},
  "Walk In Shower", "/images/heroes/walk-in-shower.webp",
  "Full Bathroom Remodel", "/images/heroes/full-bathroom-remodel.webp",
  "Kitchen Remodel", "/images/heroes/kitchen-remodel.webp",
  "Flooring Installation", "/images/heroes/flooring-installation.webp",
  "Tile Work", "/images/heroes/tile-work.webp",
  "Countertop Installation", "/images/heroes/countertop-installation.webp",
  "Plumbing Services", "/images/heroes/plumbing-services.webp",
  "General Contractor", "/images/heroes/general-contractor.webp",
  "/images/heroes/default.webp"  // fallback
)

// hero_image_alt field (Formula type)
CONCATENATE({page_type}, " - Professional Services")
```

### Hero Image Component Pattern

```typescript
// components/LandingPageHero.tsx

import Image from 'next/image';

interface HeroProps {
  pageType: string;
  heroImage: string;
  heroImageAlt: string;
  title: string;
}

export function LandingPageHero({ pageType, heroImage, heroImageAlt, title }: HeroProps) {
  return (
    <div className="relative h-[60vh] min-h-[400px]">
      <Image
        src={heroImage}
        alt={heroImageAlt}
        fill
        priority
        quality={85}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30">
        <div className="container mx-auto h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl mb-8">Professional {pageType} Services</p>
            {/* Multi-step form component here */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Image Optimization Specifications

```yaml
hero_images:
  format: WebP (Next.js auto-generates)
  dimensions: 1920x1080
  quality: 85
  loading: priority (above-fold)
  optimization: Next.js Image component (automatic)

icons:
  format: SVG
  dimensions: 24x24 base
  optimization: SVGO compressed

trust_badges:
  format: SVG or WebP
  dimensions: 120x40
  placement: Above fold, near form
```

### Workflow

1. **Stakeholder creates landing page** in Airtable
2. **Sets `page_type`** to "Walk In Shower"
3. **Airtable formula auto-populates `hero_image`** = "/images/heroes/walk-in-shower.webp"
4. **Make.com triggers** content generation
5. **Claude generates page copy** (NO image generation)
6. **Next.js renders page** using pre-assigned hero image via Image component

### Benefits

- ✅ **Predictable**: Same page type always uses same hero image
- ✅ **Brand Consistent**: Professional, high-quality photos
- ✅ **No AI Randomness**: Human-selected images only
- ✅ **SEO Optimized**: Consistent alt text per page type
- ✅ **Fast Loading**: Next.js auto-optimizes (WebP, responsive, lazy load)
- ✅ **Easy Management**: Add page type = add one image + Airtable option

---

## Notes for dev-agent

**Implementation Priority:**
1. Set up monorepo structure with npm workspaces
2. Create shared TypeScript types in `packages/shared` (include pageType, heroImage, heroImageAlt)
3. Set up asset folder structure with hero images, icons, trust badges
4. Implement Next.js 15.5 frontend with Tailwind CSS
5. Build multi-step form with client-side state management (React Context)
6. Implement hero image component using Next.js Image (automatic WebP optimization)
7. Implement Netlify Functions for form submission and validation
8. Configure reCAPTCHA v3 (frontend + backend validation)
9. Set up Google Tag Manager integration
10. Implement Airtable integration with hero image formulas
11. Configure Make.com webhooks for automation (content only, no image generation)
12. Connect Git repository to Netlify for automatic deployments

**Critical Requirements:**
- Use Turbopack for builds: `next build --turbopack`
- Implement duplicate submission prevention (5-minute window on email+phone)
- All form validation must use Zod schemas (shared between frontend/backend)
- Multi-step form must preserve state in sessionStorage
- Thank you page is static (no token validation)
- Marketing attribution captured on page load (Step 1)
- reCAPTCHA executed only on final step (Step 3)
- **NO AI-generated images** - Only use pre-selected hero images mapped by page_type
- Hero images must use Next.js Image component for automatic optimization
- All hero images stored in `apps/web/public/images/heroes/`
- Airtable formulas auto-populate hero_image based on page_type

**SEO Requirements (Phase 1)**:
- Every landing page must have unique title (30-60 chars) and meta description (120-160 chars)
- Self-referencing canonical URL: `<link rel="canonical" href="https://example.com/[slug]/">`
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- **No internal cross-linking** between landing pages (conversion-focused isolation)
- Footer links only: Privacy Policy, Terms of Service (both nofollow)
- Next.js metadata API for all meta tags
- Mobile-responsive design (Tailwind handles this)

**Testing Strategy:**
- Vitest for unit tests (frontend + backend)
- Playwright for E2E multi-step form testing
- Test duplicate submission prevention (5-minute window)
- Test reCAPTCHA validation flow
- Test static thank you page redirect

---

## Components

This section defines the component architecture for frontend, backend, and integration layers.

### Frontend Components

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

### Backend Components (Netlify Functions)

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

### Integration Components

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

### Component Architecture Rationale

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

## External APIs

This section documents all external API integrations required for the Landing Pages Automation system.

### Airtable REST API

**Version**: REST API v2 (January 2025)
**Purpose**: Primary database for landing pages, form submissions, templates, TCPA rules
**Authentication**: API Key (Bearer token)

**Base URL**: `https://api.airtable.com/v0/{BASE_ID}`

**Key Endpoints Used**:

```typescript
// Create form submission
POST /v0/{BASE_ID}/Form%20Submissions
Headers: Authorization: Bearer {API_KEY}
Body: {
  "fields": {
    "landing_page_id": "recXXX",
    "full_name": "Judith Curtis",
    "email": "seabee1912@aol.com",
    // ... all form fields
  }
}

// Fetch landing page by slug
GET /v0/{BASE_ID}/Landing%20Pages?filterByFormula={slug}="bathroom-remodel"
Headers: Authorization: Bearer {API_KEY}

// Update landing page status
PATCH /v0/{BASE_ID}/Landing%20Pages/{RECORD_ID}
Headers: Authorization: Bearer {API_KEY}
Body: {
  "fields": {
    "status": "published",
    "published_url": "https://example.com/bathroom-remodel"
  }
}

// Check duplicate submissions
GET /v0/{BASE_ID}/Form%20Submissions?filterByFormula=AND({email}="...", {phone}="...")
Headers: Authorization: Bearer {API_KEY}
```

**Rate Limits**: 5 requests per second per base
**Error Handling**: 429 (rate limit), 401 (auth), 404 (record not found)

**Field Type Mapping**:
- `Single line text` → TypeScript `string`
- `Long text` → TypeScript `string`
- `Single select` → TypeScript `enum`
- `Multiple select` → TypeScript `string[]`
- `Date` → TypeScript `Date` (ISO 8601 format)
- `Checkbox` → TypeScript `boolean`
- `Number` → TypeScript `number`
- `Link to another record` → TypeScript `string[]` (record IDs)

**Environment Variables**:
```bash
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

---

### Make.com API

**Version**: Latest (October 2025 - 3,000+ integrations, AI Agents)
**Purpose**: Workflow automation orchestration
**Authentication**: Webhook URLs (no API key needed for incoming webhooks)

**Webhook Patterns**:

**Incoming Webhooks** (Make.com → Our System):
```typescript
// Netlify deployment trigger
POST https://api.netlify.com/build_hooks/{BUILD_HOOK_ID}
Headers: (none required)
Body: {} (empty POST triggers build)

// Error notification webhook
POST https://our-domain.netlify.app/api/webhook/make-com
Headers: X-Make-Signature: {HMAC_SHA256}
Body: {
  "event": "deployment_failed",
  "landing_page_id": "recXXX",
  "error_details": "Build failed: missing environment variable"
}
```

**Outgoing Webhooks** (Our System → Make.com):
```typescript
// Form submission notification (future enhancement)
POST https://hook.us1.make.com/XXXXXXXXXX
Headers: Content-Type: application/json
Body: {
  "submission_id": "recABC123",
  "email": "user@example.com",
  "landing_page": "Bathroom Remodel"
}
```

### Automation Approach: Make.com vs Airtable Native

**Decision**: Make.com with polling (1-5 minute intervals)

**Comparison Analysis**:

| Factor | Airtable Native Automations | Make.com (Polling) | Hybrid (Airtable Webhooks + Make.com) |
|--------|----------------------------|-------------------|---------------------------------------|
| **Cost** | Free (included in Pro plan) | $9-29/month | $9-29/month + Airtable Pro webhooks |
| **Latency** | Instant | 1-15 min polling | Instant |
| **Ease of Use** | Code-based (JavaScript) | Visual drag-and-drop | Visual drag-and-drop |
| **Debugging** | Limited (logs in Airtable UI) | Excellent (execution history, step-by-step) | Excellent |
| **Flexibility** | Limited (30-second timeout) | High (unlimited modules) | Highest |
| **Error Handling** | Basic (try/catch in code) | Advanced (retry logic, fallback paths) | Advanced |
| **Non-Dev Friendly** | No (requires coding) | Yes (visual workflows) | Yes |
| **Dependencies** | Airtable only | +Make.com | +Make.com + Webhooks setup |
| **Scalability** | Limited (script timeouts) | Good (parallel processing) | Best (instant + parallel) |
| **PMax Integration** | Manual (custom code) | Built-in Google Ads integration | Built-in |

**Rationale for Make.com**:

1. **Visual Workflow Builder**: Non-developers can modify automation logic without code changes
2. **Advanced Error Handling**: Built-in retry logic, conditional fallback paths, email notifications on failure
3. **Superior Debugging**: Execution history with step-by-step logs for every scenario run
4. **Google Ads Integration**: Native support for PMax asset export (Phase 1 requirement)
5. **Lead Routing Capability**: Can route form submissions by quality score (reCAPTCHA-based)
6. **Acceptable Latency**: 1-5 minute polling is sufficient for content generation (not time-critical)
7. **Cost Justification**: $29/month is negligible vs. Claude API budget ($500/month) and developer time savings

**When to Consider Hybrid Approach**:
- Need instant content generation (<1 minute from "pending" to "generated")
- Already have Airtable Pro plan with webhooks enabled
- Expect very high volume (>1000 pages/day requiring instant processing)

**Make.com Scenarios Configuration**:

**Scenario 1 - Content Generation + PMax Assets**:
- Module 1: Airtable → Watch Records (trigger on status = "pending")
- Module 2: HTTP → Make a Request (POST to Claude API for landing page content)
- Module 3: HTTP → Make a Request (POST to Claude API for PMax assets)
- Module 4: Airtable → Update Record (set generatedContent, pmaxHeadlines, pmaxDescriptions, pmaxSitelinks, status = "generated")
- Module 5: Error Handler → Update Record (status = "error", error_message with details)

**Scenario 2 - Deployment**:
- Module 1: Airtable → Watch Records (trigger on status = "approved")
- Module 2: HTTP → Make a Request (POST to Netlify deploy hook)
- Module 3: Tools → Sleep (wait 60 seconds for build)
- Module 4: Airtable → Update Record (set published_url, status = "published")

**Scenario 3 - Lead Routing (Future Enhancement)**:
- Module 1: Webhook → Receive form submission
- Module 2: Router → Route by lead quality
  - Route A (High): recaptcha_score >= 0.8 → Immediate sales notification
  - Route B (Medium): recaptcha_score 0.5-0.8 → Standard CRM workflow
  - Route C (Low): recaptcha_score < 0.5 → Review queue
- Module 3: Airtable → Create/Update contact with quality tier
- Module 4: CRM Integration → Trigger appropriate follow-up sequence

**Error Handling**: Built-in error handlers in Make.com scenarios
**Rate Limits**: 10,000 operations/month (free tier), unlimited (paid)

**Environment Variables**: None (webhook URLs configured in Make.com platform)

---

### Netlify API

**Version**: Latest (Node.js 20 runtime, March 2025 billing changes)
**Purpose**: Hosting, serverless functions, deployment automation
**Authentication**: Deploy hooks (no auth), Build hooks (token-based)

**Deploy Hooks**:
```bash
# Trigger production deployment
POST https://api.netlify.com/build_hooks/{HOOK_ID}
# Returns: {"id": "abc123", "created_at": "2025-10-07T..."}
```

**Functions Runtime**:
- **Runtime**: Node.js 20.x
- **Timeout**: 10 seconds (default), 26 seconds (max)
- **Memory**: 1024 MB (default)
- **Cold Start**: ~50-200ms

**Function Handler Pattern**:
```typescript
// apps/functions/submit-form.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // event.body contains POST data
  // event.headers contains HTTP headers
  // event.queryStringParameters contains URL params

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
};
```

**Environment Variables** (set in Netlify dashboard):
```bash
RECAPTCHA_SECRET_KEY=...
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
MAKE_WEBHOOK_SECRET=...
```

**Deployment Webhooks** (Netlify → Make.com):
```typescript
// Netlify sends on deploy success/failure
POST {MAKE_WEBHOOK_URL}
Body: {
  "state": "ready" | "error",
  "deploy_id": "abc123",
  "site_id": "xyz789",
  "context": "production",
  "error_message": "..." // if state = error
}
```

**Rate Limits**: 5 requests/second per function (edge rate limiting)

---

### Google reCAPTCHA v3 API

**Version**: v3 (latest, no v4 exists as of Oct 2025)
**Purpose**: Bot protection and spam prevention
**Authentication**: Site key (public) + Secret key (server)

**Client-Side Integration**:
```html
<!-- Load reCAPTCHA script -->
<script src="https://www.google.com/recaptcha/api.js?render={SITE_KEY}"></script>

<script>
// Execute on form submission (Step 3)
grecaptcha.ready(() => {
  grecaptcha.execute('{SITE_KEY}', { action: 'submit_form' })
    .then(token => {
      // Send token to backend for verification
    });
});
</script>
```

**Server-Side Verification**:
```typescript
// Backend validation
POST https://www.google.com/recaptcha/api/siteverify
Body: {
  secret: process.env.RECAPTCHA_SECRET_KEY,
  response: token_from_client,
  remoteip: user_ip_address // optional
}

Response: {
  success: true | false,
  score: 0.9, // 0.0 (bot) to 1.0 (human)
  action: "submit_form",
  challenge_ts: "2025-10-07T...",
  hostname: "example.com"
}
```

**Score Interpretation**:
- `0.9 - 1.0`: Very likely human (accept)
- `0.7 - 0.9`: Likely human (accept)
- `0.5 - 0.7`: Neutral (review manually or accept with caution)
- `0.3 - 0.5`: Likely bot (reject or challenge)
- `0.0 - 0.3`: Very likely bot (reject)

**Minimum Score Threshold**: `0.5` (configurable in TCPA Rules)

**Error Handling**:
- `missing-input-secret`: Server configuration error
- `invalid-input-secret`: Invalid secret key
- `missing-input-response`: Client didn't send token
- `invalid-input-response`: Token expired or invalid
- `timeout-or-duplicate`: Token already used (tokens expire after 2 minutes)

**Environment Variables**:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Rate Limits**: 1,000 verifications per second (Google's limit, sufficient for this use case)

---

### Google Tag Manager API

**Version**: Latest (Cloud-based, April 2025 server-side updates)
**Purpose**: Dynamic script and tracking management
**Authentication**: None (client-side script injection)

**Client-Side Integration**:
```html
<!-- GTM Container Script (in <head>) -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{GTM_ID}');</script>

<!-- GTM NoScript (in <body>) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

**DataLayer Events** (custom tracking):
```typescript
// Push form submission event
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'form_submission',
  'formType': 'lead_generation',
  'landingPage': 'bathroom-remodel',
  'submissionId': 'recABC123'
});

// Push form step progression
window.dataLayer.push({
  'event': 'form_step_completed',
  'step': 2,
  'stepName': 'Project Details'
});
```

**Next.js Integration Pattern**:
```typescript
// components/GoogleTagManager.tsx
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){...GTM script...})(window,document,'script','dataLayer','${gtmId}');`
        }}
      />
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} />
      </noscript>
    </>
  );
}
```

**Environment Variables**:
```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Configuration**: All tracking tags, pixels, and scripts configured in GTM web interface (https://tagmanager.google.com/)

---

### Claude API (Anthropic)

**Version**: Claude Sonnet 4.5 (claude-sonnet-4-5, September 2025)
**Purpose**: AI-powered landing page content generation
**Authentication**: API Key (X-API-Key header)

**Content Generation Request**:
```typescript
POST https://api.anthropic.com/v1/messages
Headers: {
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "content-type": "application/json"
}
Body: {
  "model": "claude-sonnet-4-5",
  "max_tokens": 4096,
  "messages": [{
    "role": "user",
    "content": `Generate landing page content for: ${contentBrief}

    Template: ${templateName}
    Page Type: ${pageType}
    Target Audience: ${targetAudience}

    Generate HTML content with Tailwind CSS classes.`
  }]
}

Response: {
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [{
    "type": "text",
    "text": "<div class='container'>...</div>"
  }],
  "usage": {
    "input_tokens": 150,
    "output_tokens": 2500
  }
}
```

**Pricing** (as of October 2025):
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens
- Prompt caching: 90% discount on cached tokens (1 hour cache)

**Rate Limits**:
- 50 requests per minute
- 100,000 tokens per minute

**Error Handling**:
- `429`: Rate limit exceeded (retry with exponential backoff)
- `401`: Invalid API key
- `400`: Invalid request format
- `529`: Overloaded (retry after delay)

**Environment Variables** (configured in Make.com scenario):
```bash
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Note**: Claude API calls are made from **Make.com scenarios**, not directly from our codebase.

**PMax Asset Generation** (Phase 1):

Make.com Scenario 1 makes **two Claude API calls** per landing page:

**Call 1: Landing Page Content**
```typescript
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 4096,
  "messages": [{
    "role": "user",
    "content": `Generate landing page content for: ${contentBrief}

    Template: ${templateName}
    Page Type: ${pageType}
    Target Audience: ${targetAudience}

    Generate HTML content with Tailwind CSS classes.`
  }]
}
```

**Call 2: PMax Assets**
```typescript
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 2048,
  "messages": [{
    "role": "user",
    "content": `Generate Google Ads Performance Max assets for: ${contentBrief}

    Page Type: ${pageType}
    Service: ${serviceName}

    Requirements:
    1. Headlines: Generate 15 unique headlines (30 characters max each)
       - Focus on value propositions, urgency, and service benefits
       - Include variations with and without location
       - Examples: "Expert Bathroom Remodel", "Save on Shower Install"

    2. Long Headlines: Generate 5 unique long headlines (90 characters max each)
       - More descriptive, include benefits and features
       - Example: "Professional Bathroom Remodeling Services - Free Consultation & Quote"

    3. Descriptions: Generate 4 unique descriptions (90 characters max each)
       - Clear call-to-action and value proposition
       - Example: "Transform your bathroom with expert remodeling. Licensed contractors. Call today!"

    4. Sitelinks: Generate 4-10 sitelinks with:
       - Title (25 characters max): "Free Consultation", "Our Services", "Gallery"
       - Description (35 characters max): "Get expert advice at no cost"
       - URL: Link to landing page sections (e.g., "#services", "#gallery")

    Output as JSON:
    {
      "headlines": ["...", "...", ...],
      "longHeadlines": ["...", "...", ...],
      "descriptions": ["...", "...", ...],
      "sitelinks": [
        {"title": "...", "description": "...", "url": "..."},
        ...
      ]
    }`
  }]
}
```

**Cost Estimation**:
- Landing page content: ~150 input tokens + ~2500 output tokens = ~$0.04
- PMax assets: ~300 input tokens + ~1500 output tokens = ~$0.025
- **Total per page**: ~$0.065 Claude API cost (well under $0.30 target)

---

### API Integration Summary

| API | Purpose | Auth Method | Rate Limit | Used By |
|-----|---------|-------------|------------|---------|
| Airtable REST API v2 | Database CRUD | Bearer token | 5 req/sec | Backend functions |
| Make.com Webhooks | Workflow automation | HMAC signature | 10K ops/month | Make.com scenarios |
| Netlify Deploy Hooks | Trigger builds | None | Unlimited | Make.com |
| Netlify Functions | Serverless compute | N/A (runtime) | 5 req/sec | Backend logic |
| reCAPTCHA v3 | Bot protection | Site/Secret keys | 1K req/sec | Frontend + Backend |
| Google Tag Manager | Script management | None (client) | N/A | Frontend |
| Claude API | Content generation | API Key | 50 req/min | Make.com |

---

## Database Schema

This section defines the complete Airtable database schema with all tables, fields, formulas, and relationships.

### Airtable Base Structure

**Base Name**: Landing Pages Automation
**Tables**: 5 tables (Landing Pages, Form Submissions, Templates, TCPA Rules, Form Sessions)

---

### Table 1: Landing Pages

**Purpose**: Store landing page configurations, content briefs, and generated content

**Fields**:

| Field Name | Type | Description | Formula/Options |
|------------|------|-------------|-----------------|
| `id` | Auto Number | Primary key (Airtable record ID) | Auto-generated |
| `geo_targeting` | Checkbox | Whether page has geographic targeting | Default: false |
| `location_slug` | Single line text | Location portion of URL (e.g., "chicago") | Conditional: required if geo_targeting=true |
| `service_slug` | Single line text | Service portion of URL (e.g., "bathroom-remodel") | Required, unique within location |
| `full_path` | Formula | Complete URL path | See formula below |
| `slug` | Single line text | **DEPRECATED** - Use service_slug instead | Legacy field for backward compatibility |
| `title` | Single line text | Page meta title for SEO | Required |
| `status` | Single select | Workflow state | Options: Draft, Pending, Generated, Approved, Published, Archived |
| `page_type` | Single select | Service/product category | Options: Walk In Shower, Full Bathroom Remodel, Kitchen Remodel, Flooring Installation, Tile Work, Countertop Installation, Plumbing Services, General Contractor |
| `content_brief` | Long text | Stakeholder input describing desired content | Required |
| `generated_content` | Long text | Claude-generated HTML/Markdown content | Nullable |
| `template_id` | Link to Templates | Reference to template configuration | Required |
| `hero_image` | Formula | Auto-selected hero image path | See formula below |
| `hero_image_alt` | Formula | SEO alt text for hero image | See formula below |
| `meta_description` | Long text | SEO meta description | Max 160 chars |
| `meta_keywords` | Long text | SEO keywords (comma-separated) | Optional |
| `og_image` | URL | Open Graph image URL | Optional |
| `og_title` | Single line text | Open Graph title | Optional |
| `og_description` | Long text | Open Graph description | Optional |
| `twitter_card` | Single select | Twitter card type | Options: summary, summary_large_image |
| `published_url` | URL | Live Netlify URL | Nullable until published |
| `created_at` | Created time | Creation timestamp | Auto-generated |
| `updated_at` | Last modified time | Last modification timestamp | Auto-generated |
| `created_by` | Single line text | Stakeholder email/name | Required |
| `approved_by` | Single line text | Approver email/name | Nullable |
| `approved_at` | Date | Approval timestamp | Nullable |
| `error_message` | Long text | Build/generation error details | Nullable |
| `form_submissions` | Link to Form Submissions | Related submissions (reverse link) | Auto-populated |
| `canonical_url` | URL | Self-referencing canonical (Phase 2 SEO) | Nullable |
| `structured_data` | Long text | JSON-LD schema markup (Phase 2 SEO) | Nullable |
| `urgency_message` | Single line text | Scarcity/urgency text (Phase 2) | Nullable |
| `trust_signals` | Multiple select | Trust badges to display (Phase 2) | Options: BBB, Money Back Guarantee, 5 Star Rating, Secure Payment |
| `pmax_headlines` | Long text | Google Ads headlines (JSON array, Phase 1) | 15 headlines, 30 chars each |
| `pmax_long_headlines` | Long text | Google Ads long headlines (JSON array, Phase 1) | 5 headlines, 90 chars each |
| `pmax_descriptions` | Long text | Google Ads descriptions (JSON array, Phase 1) | 4 descriptions, 90 chars each |
| `pmax_sitelinks` | Long text | Google Ads sitelinks (JSON array, Phase 1) | 4-10 sitelinks with titles/descriptions |

**Full Path Formula**:
```javascript
IF(
  {geo_targeting},
  CONCATENATE("/", {location_slug}, "/", {service_slug}),
  CONCATENATE("/", {service_slug})
)
```

**Hero Image Formula**:
```javascript
SWITCH({page_type},
  "Walk In Shower", "/images/heroes/walk-in-shower.webp",
  "Full Bathroom Remodel", "/images/heroes/full-bathroom-remodel.webp",
  "Kitchen Remodel", "/images/heroes/kitchen-remodel.webp",
  "Flooring Installation", "/images/heroes/flooring-installation.webp",
  "Tile Work", "/images/heroes/tile-work.webp",
  "Countertop Installation", "/images/heroes/countertop-installation.webp",
  "Plumbing Services", "/images/heroes/plumbing-services.webp",
  "General Contractor", "/images/heroes/general-contractor.webp",
  "/images/heroes/default.webp"
)
```

**Hero Image Alt Formula**:
```javascript
CONCATENATE({page_type}, " - Professional Services")
```

**Primary Key**: `id` (Airtable record ID)
**Unique Constraints**:
- `service_slug` must be unique within same `location_slug` (for geo-targeted pages)
- `service_slug` must be unique globally (for non-geo pages)
- Compound uniqueness: `(location_slug, service_slug)` or `(null, service_slug)`

**Indexes**: Status field (for Make.com triggers)

**Example Records**:
```
Record 1 (Geographic):
- geo_targeting: ✓
- location_slug: "chicago"
- service_slug: "bathroom-remodel"
- full_path: "/chicago/bathroom-remodel"
- published_url: "https://remodeling.example.com/chicago/bathroom-remodel"

Record 2 (Non-Geographic):
- geo_targeting: ☐
- location_slug: (empty)
- service_slug: "walk-in-shower-installation"
- full_path: "/walk-in-shower-installation"
- published_url: "https://remodeling.example.com/walk-in-shower-installation"

Record 3 (Same service, different location):
- geo_targeting: ✓
- location_slug: "denver"
- service_slug: "bathroom-remodel"
- full_path: "/denver/bathroom-remodel"
- published_url: "https://remodeling.example.com/denver/bathroom-remodel"
```

---

### Table 2: Form Submissions

**Purpose**: Store user form submissions with marketing attribution and TCPA compliance

**Fields**:

| Field Name | Type | Description | Formula/Options |
|------------|------|-------------|-----------------|
| `id` | Auto Number | Primary key | Auto-generated |
| `session_id` | Single line text | Links to Form Session | UUID format |
| `landing_page_id` | Link to Landing Pages | Foreign key to landing page | Required |
| `submitted_at` | Date | Submission timestamp | Auto-set on creation |
| `status` | Single select | Processing state | Options: Pending, Verified, Contacted, Spam |
| `completion_time_seconds` | Number | Time from start to submit | Calculated by frontend |
| `gclid` | Single line text | Google Ads Click ID | Nullable |
| `fbclid` | Single line text | Facebook Ads Click ID | Nullable |
| `utm_source` | Single line text | Traffic source | Nullable |
| `utm_medium` | Single line text | Marketing medium | Nullable |
| `utm_campaign` | Single line text | Campaign name | Nullable |
| `utm_term` | Single line text | Paid search keyword | Nullable |
| `utm_content` | Single line text | Ad variation identifier | Nullable |
| `referrer` | URL | HTTP referrer URL | Nullable |
| `page_url` | URL | Landing page URL | Required |
| `full_name` | Single line text | User's full name | Required |
| `phone_number` | Phone number | User's phone (10-digit US format) | Required |
| `email` | Email | User's email address | Required |
| `zip_code` | Single line text | User's ZIP code (5-digit US) | Required |
| `job_type` | Single line text | Type of service/project | Required |
| `how_did_you_hear` | Single select | Discovery channel | Options: Online Search, Social Media, Referral, Advertisement, Other |
| `comments_or_questions` | Long text | Additional user message | Nullable |
| `tcpa_consent` | Checkbox | TCPA agreement checkbox | Required (must be true) |
| `recaptcha_score` | Number | reCAPTCHA v3 score (0.0-1.0) | Required |
| `ip_address` | Single line text | User's IP for fraud detection | Required |
| `user_agent` | Long text | Browser user agent | Required |
| `duplicate_check` | Formula | Email+Phone combination | See formula below |
| `offer_id` | Single line text | Promotional offer identifier (Phase 2) | Nullable |
| `page_variant` | Single line text | A/B test variant identifier (Phase 2) | Nullable |
| `territory` | Single line text | Geographic market (Phase 2) | Nullable |
| `conversion_path` | Long text | Multi-touch attribution data (Phase 2) | Nullable |

**Duplicate Check Formula**:
```javascript
CONCATENATE({email}, "|", {phone_number})
```

**Primary Key**: `id`
**Indexes**: `email`, `phone_number`, `submitted_at`, `duplicate_check`
**Validation Rules**:
- `phone_number`: Must match regex `^\d{10}$`
- `zip_code`: Must match regex `^\d{5}$`
- `recaptcha_score`: Must be >= 0.5 (configurable in TCPA Rules)
- `tcpa_consent`: Must be `true`

---

### Table 3: Templates

**Purpose**: Define reusable landing page templates with styling configurations

**Fields**:

| Field Name | Type | Description | Formula/Options |
|------------|------|-------------|-----------------|
| `id` | Auto Number | Primary key | Auto-generated |
| `name` | Single line text | Template display name | Required, unique |
| `description` | Long text | Template purpose description | Required |
| `layout` | Single select | Page layout type | Options: Single Column, Two Column, Hero, Long Form |
| `color_primary` | Single line text | Tailwind primary color class | e.g., "blue-600" |
| `color_secondary` | Single line text | Tailwind secondary color class | e.g., "gray-800" |
| `color_accent` | Single line text | Tailwind accent color class | e.g., "green-500" |
| `color_background` | Single line text | Tailwind background color class | e.g., "white" |
| `color_text` | Single line text | Tailwind text color class | e.g., "gray-900" |
| `components` | Multiple select | Available component types | Options: hero, form, features, testimonials, cta, footer, trust_badges, benefits |
| `is_active` | Checkbox | Whether template is available | Default: true |
| `created_at` | Created time | Creation timestamp | Auto-generated |
| `landing_pages` | Link to Landing Pages | Pages using this template | Auto-populated |

**Primary Key**: `id`
**Unique Constraints**: `name` must be unique

**Sample Records**:
```
Template 1:
- name: "Lead Generation - Service Provider"
- layout: "Hero"
- components: [hero, form, features, trust_badges, footer]
- color_primary: "blue-600"

Template 2:
- name: "Long Form - Detailed Service"
- layout: "Long Form"
- components: [hero, form, features, testimonials, benefits, cta, footer]
- color_primary: "green-600"
```

---

### Table 4: TCPA Rules

**Purpose**: Store TCPA compliance validation rules for form submissions

**Fields**:

| Field Name | Type | Description | Formula/Options |
|------------|------|-------------|-----------------|
| `id` | Auto Number | Primary key | Auto-generated |
| `industry` | Single select | Industry category | Options: Home Services, Healthcare, Finance, Legal, Real Estate, Other |
| `requires_consent` | Checkbox | Whether explicit TCPA checkbox required | Default: true |
| `consent_text` | Long text | Required legal disclaimer text | Required |
| `minimum_recaptcha_score` | Number | Minimum score threshold (0.0-1.0) | Default: 0.5 |
| `blocked_countries` | Multiple select | ISO country codes where forms disabled | Options: US, CA, MX, etc. |
| `is_active` | Checkbox | Whether rule is active | Default: true |
| `created_at` | Created time | Creation timestamp | Auto-generated |

**Primary Key**: `id`

**Sample Record**:
```
TCPA Rule for Home Services:
- industry: "Home Services"
- requires_consent: true
- consent_text: "By checking this box and providing my contact information, I consent to receive calls, texts, and emails from [Company] and its partners regarding home improvement services. I understand that consent is not required to purchase services. Message and data rates may apply."
- minimum_recaptcha_score: 0.5
- blocked_countries: [] (allow all)
```

---

### Table 5: Form Sessions

**Purpose**: Track partial form completion and prevent duplicate submissions

**Fields**:

| Field Name | Type | Description | Formula/Options |
|------------|------|-------------|-----------------|
| `session_id` | Single line text | Primary key (UUID) | Required, unique |
| `landing_page_id` | Link to Landing Pages | Which landing page the form is on | Required |
| `current_step` | Number | Current step in form (1-3) | Default: 1 |
| `started_at` | Created time | When user began filling form | Auto-generated |
| `last_activity_at` | Last modified time | Last interaction timestamp | Auto-updated |
| `is_completed` | Checkbox | Whether form was successfully submitted | Default: false |
| `ip_address` | Single line text | User's IP address | Required |
| `form_data_step1` | Long text | JSON of step 1 data (for recovery) | Nullable |
| `form_data_step2` | Long text | JSON of step 2 data (for recovery) | Nullable |

**Primary Key**: `session_id`
**Indexes**: `landing_page_id`, `started_at`, `is_completed`

**Note**: This table is optional for MVP. Can be used for analytics and abandoned form recovery in future iterations.

---

### Table 6: Offers (Phase 2 - Future Enhancement)

**Purpose**: Store promotional offer configurations for landing page variations

**Fields**:

| Field Name | Type | Description | Formula/Options |
|------------|------|-------------|-----------------|
| `id` | Auto Number | Primary key | Auto-generated |
| `offer_code` | Single line text | Unique offer identifier | Required, unique |
| `offer_type` | Single select | Type of promotion | Options: Dollar Off, Percentage Off, BOGO, Free Service |
| `offer_value` | Number | Discount amount or percentage | Required |
| `headline` | Single line text | Main offer headline | Required |
| `description` | Long text | Offer details and value prop | Required |
| `cta_text` | Single line text | Call-to-action button text | Required |
| `qualifying_details` | Long text | Terms and conditions | Required |
| `urgency_message` | Single line text | Scarcity/urgency text | Optional |
| `slug_suffix` | Single line text | URL slug addition | e.g., "3000-off" |
| `utm_content` | Single line text | UTM content parameter | e.g., "offer-3000" |
| `priority` | Number | Display priority (1=highest) | Default: 10 |
| `is_active` | Checkbox | Whether offer is currently running | Default: true |
| `start_date` | Date | Offer start date | Optional |
| `end_date` | Date | Offer expiration date | Optional |
| `max_redemptions` | Number | Maximum number of uses | Optional |
| `current_redemptions` | Rollup | Count of form submissions | Counts from Form Submissions |

**Primary Key**: `id`
**Unique Constraints**: `offer_code` must be unique

**Sample Record**:
```
Offer Example:
- offer_code: "3000_bathroom_full"
- offer_type: "Dollar Off"
- offer_value: 3000
- headline: "Save $3,000 on Your Full Bathroom Remodel"
- description: "$3000 off complete bathroom renovation"
- cta_text: "Claim Your $3,000 Savings"
- qualifying_details: "Applies to full bathroom remodels only. Minimum project value $15,000"
- urgency_message: "Limited to first 10 homeowners this month"
- slug_suffix: "3000-off"
- utm_content: "offer-3000"
```

**Note**: This table enables offer variation testing in Phase 2. Not required for MVP.

---

### Relationships

**Phase 1 (MVP)**:
```
Landing Pages (1) ──< (Many) Form Submissions
Templates (1) ──< (Many) Landing Pages
Landing Pages (1) ──< (Many) Form Sessions (optional)
```

**Phase 2 (With Offer Variations)**:
```
Landing Pages (1) ──< (Many) Form Submissions
Templates (1) ──< (Many) Landing Pages
Landing Pages (1) ──< (Many) Form Sessions
Offers (1) ──< (Many) Form Submissions (via offer_id)
Landing Pages (Many) ──< (Many) Offers (many-to-many via junction table or offer_ids field)
```

**Visual Schema (Phase 1 MVP)**:
```
┌─────────────────┐
│   Templates     │
│  - id           │
│  - name         │
│  - layout       │
└────────┬────────┘
         │ 1
         │
         │ Many
┌────────▼────────┐         ┌──────────────────┐
│ Landing Pages   │         │   TCPA Rules     │
│  - id           │         │  - id            │
│  - slug         │         │  - industry      │
│  - page_type    │         │  - consent_text  │
│  - hero_image   │         └──────────────────┘
│  - status       │
└────────┬────────┘
         │ 1
         │
         │ Many
┌────────▼────────────┐
│ Form Submissions    │
│  - id               │
│  - landing_page_id  │
│  - full_name        │
│  - email            │
│  - phone_number     │
│  - recaptcha_score  │
│  - offer_id (Phase2)│
└─────────────────────┘

┌─────────────────┐         ┌─────────────────┐
│ Form Sessions   │         │ Offers (Phase2) │
│  - session_id   │         │  - offer_code   │
│  - current_step │         │  - offer_type   │
│  - is_completed │         │  - headline     │
└─────────────────┘         └─────────────────┘
```

---

### Views (Airtable)

**Landing Pages Views**:
- **All Pages**: Default view, all records
- **Pending Generation**: Status = "Pending" (for stakeholder monitoring)
- **Awaiting Approval**: Status = "Generated" (for content review)
- **Published**: Status = "Published" (live pages)
- **Errors**: Status = "Archived" OR error_message is not empty

**Form Submissions Views**:
- **All Submissions**: Default view, all records
- **Recent**: Last 7 days
- **High Quality Leads**: recaptcha_score >= 0.7
- **Needs Review**: recaptcha_score < 0.7 AND status = "Pending"
- **By Landing Page**: Grouped by landing_page_id

---

### Airtable Automation (Native)

**Automation 1: Status Change Notification**
- Trigger: When status changes to "Generated"
- Action: Send email to approver with review link

**Automation 2: Error Notification**
- Trigger: When error_message is not empty
- Action: Send email to admin with error details

**Note**: Primary automation is handled by Make.com, these are supplementary notifications.

---

## Frontend Architecture

This section defines the Next.js 15.5 frontend architecture, including App Router structure, component patterns, multi-step form implementation, state management, and routing strategy.

### Next.js App Router Structure

**Directory Layout**:
```
apps/frontend/
├── app/
│   ├── layout.tsx                    # Root layout with GTM, global styles
│   ├── page.tsx                      # Homepage (optional - not MVP scope)
│   ├── [slug]/
│   │   └── page.tsx                  # Dynamic landing page route
│   ├── thank-you/
│   │   └── page.tsx                  # Static thank you confirmation
│   └── api/
│       ├── submit-form/
│       │   └── route.ts              # Form submission handler (POST)
│       ├── validate-recaptcha/
│       │   └── route.ts              # reCAPTCHA validation (POST)
│       └── webhook-make-com/
│           └── route.ts              # Make.com webhook receiver (POST)
├── components/
│   ├── LandingPageHero.tsx           # Hero section with image
│   ├── MultiStepForm/                # Multi-step form module
│   │   ├── MultiStepForm.tsx         # Form orchestrator
│   │   ├── Step1BasicInfo.tsx        # Name, email, phone, zip
│   │   ├── Step2ProjectDetails.tsx   # Job type, source, comments
│   │   ├── Step3TCPAConsent.tsx      # TCPA + reCAPTCHA
│   │   └── FormProgressBar.tsx       # Step indicator (1/3, 2/3, 3/3)
│   ├── FormField.tsx                 # Reusable input with validation
│   ├── RecaptchaBadge.tsx            # reCAPTCHA v3 badge
│   ├── GoogleTagManager.tsx          # GTM script injection
│   └── ErrorBoundary.tsx             # Error handling wrapper
├── contexts/
│   ├── FormContext.tsx               # Multi-step form state
│   └── MarketingContext.tsx          # UTM + click ID tracking
├── lib/
│   ├── airtable.ts                   # Airtable client wrapper
│   ├── recaptcha.ts                  # reCAPTCHA v3 helper
│   └── validation.ts                 # Zod schema exports
├── styles/
│   └── globals.css                   # Tailwind + custom styles
├── public/
│   └── images/
│       └── heroes/                   # Pre-optimized hero images
│           ├── walk-in-shower.webp
│           ├── full-bathroom-remodel.webp
│           └── [other service types].webp
└── next.config.js                    # Next.js configuration
```

**Route Generation Strategy**:
- **Dynamic Routes**: `[slug]` parameter fetches landing page from Airtable by slug
- **Static Routes**: Thank you page is static (no data fetching)
- **Build Time**: SSG (Static Site Generation) with `getStaticPaths` for all published landing pages
- **Incremental Static Regeneration (ISR)**: Not used in Phase 1 (full rebuild on Airtable changes)

---

### Component Architecture

#### Page Components

**`app/[slug]/page.tsx` - Dynamic Landing Page**
```typescript
import { Metadata } from 'next';
import { LandingPageHero } from '@/components/LandingPageHero';
import { MultiStepForm } from '@/components/MultiStepForm';
import { notFound } from 'next/navigation';
import { fetchLandingPageBySlug } from '@/lib/airtable';

export async function generateStaticParams() {
  // Fetch all published landing pages from Airtable
  const pages = await fetchPublishedLandingPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await fetchLandingPageBySlug(params.slug);
  if (!page) return {};

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    openGraph: {
      title: page.metadata.ogTitle || page.metadata.title,
      description: page.metadata.ogDescription || page.metadata.description,
      images: [page.heroImage],
    },
  };
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const page = await fetchLandingPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <main>
      <LandingPageHero
        title={page.title}
        heroImage={page.heroImage}
        heroImageAlt={page.heroImageAlt}
      />
      <section dangerouslySetInnerHTML={{ __html: page.generatedContent }} />
      <MultiStepForm landingPageId={page.id} />
    </main>
  );
}
```

**`app/thank-you/page.tsx` - Static Thank You Page**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You | YourBrand',
  description: 'We have received your submission.',
  robots: 'noindex, nofollow', // Prevent indexing
};

export default function ThankYouPage() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-xl mb-8">
        We have received your submission and will contact you shortly.
      </p>
      <p className="text-gray-600">
        A confirmation email has been sent to your email address.
      </p>
    </main>
  );
}
```

**`app/layout.tsx` - Root Layout**
```typescript
import { Inter } from 'next/font/google';
import { GoogleTagManager } from '@/components/GoogleTagManager';
import { MarketingProvider } from '@/contexts/MarketingContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <MarketingProvider>
            {children}
          </MarketingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

#### Multi-Step Form Implementation

**`components/MultiStepForm/MultiStepForm.tsx` - Form Orchestrator**
```typescript
'use client';

import { useState } from 'react';
import { FormProvider } from '@/contexts/FormContext';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2ProjectDetails } from './Step2ProjectDetails';
import { Step3TCPAConsent } from './Step3TCPAConsent';
import { FormProgressBar } from './FormProgressBar';

interface MultiStepFormProps {
  landingPageId: string;
}

export function MultiStepForm({ landingPageId }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <FormProvider landingPageId={landingPageId}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <FormProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {currentStep === 1 && <Step1BasicInfo onNext={handleNextStep} />}
        {currentStep === 2 && (
          <Step2ProjectDetails onNext={handleNextStep} onBack={handlePrevStep} />
        )}
        {currentStep === 3 && (
          <Step3TCPAConsent onBack={handlePrevStep} />
        )}
      </div>
    </FormProvider>
  );
}
```

**`components/MultiStepForm/Step1BasicInfo.tsx` - Step 1**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '@/lib/validation';
import { FormField } from '@/components/FormField';
import { useFormContext } from '@/contexts/FormContext';

interface Step1Data {
  fullName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
}

export function Step1BasicInfo({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useFormContext();
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  });

  const onSubmit = (data: Step1Data) => {
    updateFormData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Get Your Free Quote</h2>

      <FormField
        label="Full Name"
        name="fullName"
        type="text"
        register={register}
        error={errors.fullName}
        placeholder="John Smith"
      />

      <FormField
        label="Email Address"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        placeholder="john@example.com"
      />

      <FormField
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        register={register}
        error={errors.phoneNumber}
        placeholder="(555) 123-4567"
      />

      <FormField
        label="ZIP Code"
        name="zipCode"
        type="text"
        register={register}
        error={errors.zipCode}
        placeholder="12345"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Next Step →
      </button>
    </form>
  );
}
```

**`components/MultiStepForm/Step3TCPAConsent.tsx` - Step 3 with reCAPTCHA**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '@/lib/validation';
import { useFormContext } from '@/contexts/FormContext';
import { useMarketingContext } from '@/contexts/MarketingContext';
import { RecaptchaBadge } from '@/components/RecaptchaBadge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Step3TCPAConsent({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { formData } = useFormContext();
  const { getMarketingData } = useMarketingContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step3Schema),
  });

  const onSubmit = async (data: { tcpaConsent: boolean }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Execute reCAPTCHA v3
      const recaptchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'submit_form' }
      );

      // Combine all form data
      const completeFormData = {
        ...formData,
        ...data,
        ...getMarketingData(),
        recaptchaToken,
      };

      // Submit to backend
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      // Redirect to thank you page
      router.push('/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Final Step</h2>

      <div className="bg-gray-50 p-6 rounded-lg">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('tcpaConsent')}
            className="mt-1 h-5 w-5 text-blue-600"
          />
          <span className="text-sm text-gray-700">
            By checking this box and clicking Submit, I consent to receive autodialed and/or
            pre-recorded telemarketing calls and/or text messages from YourBrand or its
            partners at the telephone number provided above. I understand that consent is not
            a condition of purchase.
          </span>
        </label>
        {errors.tcpaConsent && (
          <p className="text-red-600 text-sm mt-2">{errors.tcpaConsent.message as string}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <RecaptchaBadge />

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
```

---

### State Management

#### FormContext - Multi-Step Form State

**`contexts/FormContext.tsx`**
```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  jobType: string;
  howDidYouHear: string;
  commentsOrQuestions: string;
}

interface FormContextType {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  landingPageId: string;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children, landingPageId }: { children: ReactNode; landingPageId: string }) {
  const [formData, setFormData] = useState<Partial<FormData>>({});

  // Persist form data to sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem(`form_${landingPageId}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [landingPageId]);

  const updateFormData = (data: Partial<FormData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    sessionStorage.setItem(`form_${landingPageId}`, JSON.stringify(updatedData));
  };

  const resetForm = () => {
    setFormData({});
    sessionStorage.removeItem(`form_${landingPageId}`);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm, landingPageId }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
}
```

#### MarketingContext - UTM and Click ID Tracking

**`contexts/MarketingContext.tsx`**
```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MarketingData {
  gclid: string | null;
  fbclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  referrer: string | null;
  pageUrl: string;
}

const MarketingContext = createContext<{ getMarketingData: () => MarketingData } | undefined>(undefined);

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);

  useEffect(() => {
    // Capture marketing parameters once on page load
    const urlParams = new URLSearchParams(window.location.search);

    const data: MarketingData = {
      gclid: urlParams.get('gclid'),
      fbclid: urlParams.get('fbclid'),
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
      utmTerm: urlParams.get('utm_term'),
      utmContent: urlParams.get('utm_content'),
      referrer: document.referrer || null,
      pageUrl: window.location.href,
    };

    setMarketingData(data);

    // Store in sessionStorage for persistence across form steps
    sessionStorage.setItem('marketing_data', JSON.stringify(data));
  }, []);

  const getMarketingData = (): MarketingData => {
    if (marketingData) return marketingData;

    // Fallback to sessionStorage if context not initialized
    const stored = sessionStorage.getItem('marketing_data');
    return stored ? JSON.parse(stored) : {
      gclid: null,
      fbclid: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      referrer: null,
      pageUrl: window.location.href,
    };
  };

  return (
    <MarketingContext.Provider value={{ getMarketingData }}>
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketingContext() {
  const context = useContext(MarketingContext);
  if (!context) throw new Error('useMarketingContext must be used within MarketingProvider');
  return context;
}
```

---

### Client-Side Validation

**Validation Strategy**: Dual validation with Zod schemas shared between frontend and backend.

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

export const completeFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);
```

**Frontend Usage**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '@/lib/validation';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(step1Schema),
});
```

**Backend Usage**:
```typescript
import { completeFormSchema } from '@shared/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const result = completeFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.errors }, { status: 400 });
  }

  // Process validated data...
}
```

---

### Image Optimization

**Next.js Image Component Strategy**:

```typescript
import Image from 'next/image';

export function LandingPageHero({ title, heroImage, heroImageAlt }: {
  title: string;
  heroImage: string;
  heroImageAlt: string;
}) {
  return (
    <section className="relative h-[500px] w-full">
      <Image
        src={heroImage}
        alt={heroImageAlt}
        fill
        priority // Load hero image immediately (LCP optimization)
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white text-center">
          {title}
        </h1>
      </div>
    </section>
  );
}
```

**Image Optimization Benefits**:
- Automatic WebP conversion (modern browsers)
- Responsive image sizes with `sizes` attribute
- Lazy loading by default (except `priority` images)
- Automatic `width` and `height` attributes for CLS prevention
- CDN integration (Netlify Image CDN)

**Pre-Optimized Hero Images**:
- Stored in `public/images/heroes/` as WebP format
- Dimensions: 1920x1080 (16:9 aspect ratio)
- Optimized with 85% quality for balance of file size and quality
- Named by service type (e.g., `walk-in-shower.webp`)

---

### Routing Strategy

**Static Generation (SSG)**:
```typescript
// Generate static paths at build time for all published landing pages
export async function generateStaticParams() {
  const pages = await fetchPublishedLandingPages(); // Fetch from Airtable
  return pages.map((page) => ({ slug: page.slug }));
}
```

**Build Triggers**:
1. Manual build trigger in Netlify dashboard
2. Make.com automation triggers Netlify deploy hook when landing page status = "approved"
3. Full site rebuild regenerates all static pages

**404 Handling**:
- Unpublished or deleted landing pages return Next.js 404 page
- Custom 404 page with branded messaging (future enhancement)

**Redirects**: Not needed in Phase 1 (no URL changes or migrations)

---

### Performance Optimizations

**Core Web Vitals Targets**:
- **LCP (Largest Contentful Paint)**: <2.5s
  - Hero image loaded with `priority` flag
  - Minimal blocking JavaScript
  - Pre-optimized WebP images

- **CLS (Cumulative Layout Shift)**: <0.1
  - Fixed dimensions for all images
  - No layout shifts during form step transitions
  - Skeleton loaders for any delayed content

- **INP (Interaction to Next Paint)**: <200ms
  - Minimal JavaScript on initial page load
  - React hydration optimized with App Router
  - Optimized event handlers and interaction responsiveness
  - Form validation deferred until user interaction

**Bundle Optimization**:
- Turbopack for fast builds (Next.js 15.5)
- Tree shaking for unused code elimination
- Code splitting by route (automatic with App Router)
- Client components only where interactivity needed

**Caching Strategy**:
- Static pages cached indefinitely by Netlify CDN
- API routes marked as non-cacheable
- Browser cache: 1 year for images, 1 hour for HTML

---

### Accessibility (a11y)

**WCAG 2.1 AA Compliance**:
- Semantic HTML5 elements (`<main>`, `<section>`, `<form>`)
- ARIA labels for form fields and buttons
- Keyboard navigation support (tab order, Enter to submit)
- Focus indicators on interactive elements
- Color contrast ratio ≥4.5:1 for text

**Form Accessibility**:
```typescript
<label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
  Full Name <span className="text-red-500">*</span>
</label>
<input
  id="fullName"
  type="text"
  aria-required="true"
  aria-invalid={!!errors.fullName}
  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
  {...register('fullName')}
/>
{errors.fullName && (
  <p id="fullName-error" role="alert" className="text-red-600 text-sm mt-1">
    {errors.fullName.message}
  </p>
)}
```

**Error Handling**:
- Inline validation errors announced to screen readers (`role="alert"`)
- Form-level errors displayed above submit button
- Success messages announced after submission

---

### SEO Implementation

**Metadata Strategy**:
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await fetchLandingPageBySlug(params.slug);

  return {
    title: page.metadata.title, // "Professional Bathroom Remodel Services | YourBrand"
    description: page.metadata.description, // 150-160 chars
    robots: page.status === 'published' ? 'index, follow' : 'noindex, nofollow',
    openGraph: {
      type: 'website',
      title: page.metadata.ogTitle || page.metadata.title,
      description: page.metadata.ogDescription || page.metadata.description,
      images: [{ url: page.heroImage, width: 1920, height: 1080 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metadata.ogTitle || page.metadata.title,
      description: page.metadata.ogDescription || page.metadata.description,
      images: [page.heroImage],
    },
  };
}
```

**Canonical URLs** (Phase 2):
- Self-referencing canonical tags prevent duplicate content issues
- Format: `<link rel="canonical" href="https://example.com/bathroom-remodel/" />`

**Structured Data** (Phase 2):
- Service schema for service type pages
- FAQ schema for common questions
- LocalBusiness schema for location-based services

---

### Error Handling

**Error Boundary**:
```typescript
'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Phase 2)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">We're sorry for the inconvenience.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**API Error Responses**:
- 400: Validation errors with specific field messages
- 429: Duplicate submission detected (5-minute window)
- 500: Server errors with generic message (no sensitive details)

---

### Testing Strategy (Frontend)

**Unit Tests** (Vitest):
- Component rendering tests
- Form validation tests
- Context state management tests

**Integration Tests** (React Testing Library):
- Multi-step form flow
- Form submission with mock API
- Error handling scenarios

**E2E Tests** (Playwright):
- Complete user journey (form submission)
- reCAPTCHA integration
- Thank you page redirect
- Mobile responsiveness

---

### Frontend Architecture Rationale

**Why Next.js App Router**:
- Server Components reduce client-side JavaScript
- Simplified data fetching with `async` components
- Improved performance with streaming and suspense
- Better SEO with server-side rendering
- File-based routing reduces boilerplate

**Why Multi-Step Form**:
- Improved conversion rates (35-45% higher completion)
- Reduced cognitive load per step
- Better mobile user experience
- Progress tracking increases commitment
- Easier validation per step

**Why React Hook Form + Zod**:
- Minimal re-renders (better performance)
- Built-in validation with Zod schemas
- Type-safe form data with TypeScript
- Easy integration with Next.js
- Shared validation logic with backend

**Why Context API (not Redux)**:
- Simpler setup for small state needs
- No external dependencies
- Built into React
- Sufficient for multi-step form state
- Avoids over-engineering for MVP

---

## Backend Architecture

This section defines the Netlify serverless functions architecture, including API handlers, service layer, validation, and integration patterns.

### Serverless Functions Overview

**Runtime**: Node.js 20 (Netlify Functions runtime)
**Framework**: Next.js API Routes (deployed as Netlify Functions)
**Location**: `apps/frontend/app/api/` (Next.js App Router convention)

**Netlify Functions Deployment**:
- Next.js API routes automatically convert to Netlify Functions
- Each route handler becomes a separate serverless function
- Function names match route paths (e.g., `/api/submit-form` → `submit-form.js`)
- Environment variables managed via Netlify dashboard

---

### API Route Handlers

#### POST /api/submit-form

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

#### POST /api/validate-recaptcha

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

#### POST /api/webhook-make-com

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

### Service Layer

#### AirtableService - Database Operations

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

#### RecaptchaService - reCAPTCHA v3 Verification

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

#### DuplicateDetectionService - Submission Deduplication

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

### Shared Validation Layer

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

### Error Handling Strategy

#### Centralized Error Response

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

### Environment Variables

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

### Authentication & Authorization

**Phase 1**: No authentication required (public forms)

**Phase 2 Considerations**:
- Admin dashboard for viewing submissions
- Role-based access control (RBAC)
- OAuth integration for stakeholder access
- API key authentication for webhook endpoints

---

### Rate Limiting

**Phase 1**: No rate limiting (reCAPTCHA provides spam protection)

**Phase 2 Considerations**:
- IP-based rate limiting (e.g., 10 submissions per hour)
- Email/phone-based rate limiting
- API endpoint throttling
- DDoS protection via Netlify

---

### Logging and Monitoring

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

### Serverless Function Configuration

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

### Backend Architecture Rationale

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

## Project Structure

This section defines the monorepo structure using npm workspaces for the Landing Pages Automation system.

### URL Structure & Routing

**Production Domain**: Single subdomain strategy
```
https://[subdomain].[client-domain].com
```
*Example: `https://remodeling.example.com`*

---

#### Landing Page URL Patterns

**Non-Geographic Landing Pages**:
```
https://[subdomain].[domain].com/[service-slug]
```

**Geographic Landing Pages**:
```
https://[subdomain].[domain].com/[location-slug]/[service-slug]
```

**URL Structure Rules**:
1. **Slug Format**: Kebab-case, lowercase, SEO-optimized
2. **Trailing Slashes**: NO trailing slashes (enforced via Next.js middleware)
3. **URL Length**: 3-5 words max (optimal for Google Ads display)
4. **Character Rules**: Letters, numbers, hyphens only (no underscores or special chars)
5. **Reserved Paths**: `/thank-you`, `/api/*`, `/privacy-policy`, `/terms-of-service`
6. **Location First**: Geographic URLs always place location before service

---

#### URL Examples by Service Type

**Non-Geographic URLs** (National/No Location Targeting):
```
Walk-In Shower          → /walk-in-shower-installation
Full Bathroom Remodel   → /bathroom-remodel
Kitchen Remodel         → /kitchen-remodeling
HVAC Services           → /hvac-repair
Roofing Services        → /roofing-contractor
Flooring Installation   → /flooring-installation
Tile Work               → /tile-installation
Countertop Installation → /countertop-installation
```

**Geographic URLs** (Location-Specific Targeting):
```
Chicago Bathroom        → /chicago/bathroom-remodel
Denver HVAC             → /denver/hvac-repair
Austin Kitchen          → /austin/kitchen-remodeling
Seattle Roofing         → /seattle/roofing-contractor
Miami Walk-In Shower    → /miami/walk-in-shower-installation
```

---

#### Google Ads Optimization

**Slug Best Practices**:
- **Keyword Priority**: Lead with primary keyword (e.g., `bathroom-remodel` not `remodel-bathroom`)
- **Length**: 2-4 words optimal (15-35 characters total)
- **Readability**: Avoid abbreviations (e.g., `hvac-repair` not `hvac-rpr`)
- **Match Type**: Slug matches primary ad keyword exactly

**Display URL Examples** (Google Ads):
```
Ad Headline: "Professional Bathroom Remodel"
Display URL: remodeling.example.com/bathroom-remodel

Ad Headline: "Chicago HVAC Repair Services"
Display URL: remodeling.example.com/chicago/hvac-repair
```

**Character Count Guidelines**:
| Component | Optimal Length | Max Length |
|-----------|---------------|------------|
| Location slug | 8-15 chars | 20 chars |
| Service slug | 15-25 chars | 35 chars |
| Total path | 20-35 chars | 50 chars |

---

#### Next.js Routing Implementation

**Dynamic Route Structure**:
```
app/
├── [slug]/
│   └── page.tsx                    # Non-geographic: /bathroom-remodel
├── [location]/
│   └── [slug]/
│       └── page.tsx                # Geographic: /chicago/bathroom-remodel
└── thank-you/
    └── page.tsx                    # Static: /thank-you
```

**Route Resolution Priority**:
1. Static routes (`/thank-you`, `/privacy-policy`)
2. Geographic dynamic routes (`/[location]/[slug]`)
3. Non-geographic dynamic routes (`/[slug]`)
4. 404 fallback

**Route Handler Logic**:
```typescript
// app/[location]/[slug]/page.tsx
export async function generateStaticParams() {
  const pages = await fetchPublishedLandingPages();
  return pages
    .filter(page => page.geoTargeting) // Has location
    .map(page => ({
      location: page.locationSlug,
      slug: page.serviceSlug
    }));
}

// app/[slug]/page.tsx
export async function generateStaticParams() {
  const pages = await fetchPublishedLandingPages();
  return pages
    .filter(page => !page.geoTargeting) // No location
    .map(page => ({ slug: page.serviceSlug }));
}
```

---

#### UTM Parameter Handling

**Query Parameter Preservation**:
```
https://[subdomain].[domain].com/[location]/[service]?utm_source=google&utm_medium=cpc&utm_campaign=bathroom-remodel&utm_term=walk-in-shower&utm_content=ad_variant_a
```

**Parameter Capture Flow**:
1. User clicks Google Ad → Lands on page with UTM params
2. `MarketingContext` captures params on initial page load
3. UTM data persists through multi-step form
4. Submitted to Airtable with form data

**Next.js Middleware** (UTM normalization):
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Remove trailing slash
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}
```

---

#### SEO & Canonical URL Policy

**Canonical Tag Format**:
```html
<!-- Non-geographic page -->
<link rel="canonical" href="https://remodeling.example.com/bathroom-remodel" />

<!-- Geographic page -->
<link rel="canonical" href="https://remodeling.example.com/chicago/bathroom-remodel" />
```

**Canonical Rules**:
- Self-referencing canonical for each landing page
- Always absolute URLs (include protocol and domain)
- NO trailing slashes (consistency with URL policy)
- No cross-canonicalization between geo/non-geo variants
- Query parameters excluded from canonical URLs

**robots.txt Configuration**:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you

Sitemap: https://remodeling.example.com/sitemap.xml
```

---

#### Airtable Schema Additions

**Landing Pages Table - New Fields**:
| Field Name | Type | Description |
|------------|------|-------------|
| `geo_targeting` | Checkbox | Whether page has geographic targeting |
| `location_slug` | Single line text | Location portion of URL (e.g., "chicago") |
| `service_slug` | Single line text | Service portion of URL (e.g., "bathroom-remodel") |
| `full_path` | Formula | Complete URL path |

**Full Path Formula**:
```javascript
IF(
  {geo_targeting},
  CONCATENATE("/", {location_slug}, "/", {service_slug}),
  CONCATENATE("/", {service_slug})
)
```

**Example Records**:
```
Record 1:
- geo_targeting: ✓ (checked)
- location_slug: "chicago"
- service_slug: "bathroom-remodel"
- full_path: "/chicago/bathroom-remodel"

Record 2:
- geo_targeting: ☐ (unchecked)
- location_slug: (empty)
- service_slug: "walk-in-shower-installation"
- full_path: "/walk-in-shower-installation"
```

---

#### Netlify Configuration

**Domain Configuration** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*/"
  to = "/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Custom Domain Setup**:
1. Add custom domain in Netlify dashboard
2. Configure DNS CNAME record: `[subdomain]` → `[netlify-site].netlify.app`
3. Enable HTTPS (automatic Let's Encrypt certificate)
4. Enforce HTTPS redirects (automatic)

**Branch Deploy URLs** (for testing):
- Production: `https://[subdomain].[domain].com`
- Preview: `https://deploy-preview-[pr-number]--[site-name].netlify.app`
- Branch: `https://[branch]--[site-name].netlify.app`

---

#### URL Validation Rules

**Server-Side Validation** (API route handlers):
```typescript
// Slug validation regex
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCATION_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateUrlStructure(location: string | null, slug: string): boolean {
  // Service slug validation
  if (!SLUG_PATTERN.test(slug)) return false;
  if (slug.length < 5 || slug.length > 50) return false;

  // Location slug validation (if present)
  if (location) {
    if (!LOCATION_PATTERN.test(location)) return false;
    if (location.length < 3 || location.length > 25) return false;
  }

  return true;
}
```

**Reserved URL Patterns** (cannot be used as slugs):
- `api`
- `thank-you`
- `privacy-policy`
- `terms-of-service`
- `admin`
- `login`
- `dashboard`

---

### Monorepo Layout

```
landing-pages-automation/
├── apps/
│   └── frontend/                       # Next.js application
│       ├── app/
│       │   ├── layout.tsx              # Root layout
│       │   ├── page.tsx                # Homepage (optional)
│       │   ├── [slug]/
│       │   │   └── page.tsx            # Non-geographic dynamic routes (/bathroom-remodel)
│       │   ├── [location]/
│       │   │   └── [slug]/
│       │   │       └── page.tsx        # Geographic dynamic routes (/chicago/bathroom-remodel)
│       │   ├── thank-you/
│       │   │   └── page.tsx            # Thank you page
│       │   └── api/
│       │       ├── submit-form/
│       │       │   └── route.ts        # Form submission handler
│       │       ├── validate-recaptcha/
│       │       │   └── route.ts        # reCAPTCHA validation
│       │       └── webhook-make-com/
│       │           └── route.ts        # Webhook receiver
│       ├── components/
│       │   ├── LandingPageHero.tsx
│       │   ├── MultiStepForm/
│       │   │   ├── MultiStepForm.tsx
│       │   │   ├── Step1BasicInfo.tsx
│       │   │   ├── Step2ProjectDetails.tsx
│       │   │   ├── Step3TCPAConsent.tsx
│       │   │   └── FormProgressBar.tsx
│       │   ├── FormField.tsx
│       │   ├── RecaptchaBadge.tsx
│       │   ├── GoogleTagManager.tsx
│       │   └── ErrorBoundary.tsx
│       ├── contexts/
│       │   ├── FormContext.tsx
│       │   └── MarketingContext.tsx
│       ├── lib/
│       │   ├── airtable.ts
│       │   ├── recaptcha.ts
│       │   ├── validation.ts
│       │   └── errors.ts
│       ├── services/
│       │   ├── AirtableService.ts
│       │   ├── RecaptchaService.ts
│       │   └── DuplicateDetectionService.ts
│       ├── middleware.ts                    # URL normalization (remove trailing slashes)
│       ├── styles/
│       │   └── globals.css
│       ├── 
/
│       │       └── heroes/
│       │           # Note: Phase 1 uses placeholder image URLs (see § Image Asset Strategy)
│       │           # Phase 2 will replace with physical WebP files:
│       │           ├── walk-in-shower.webp
│       │           ├── full-bathroom-remodel.webp
│       │           ├── kitchen-remodel.webp
│       │           ├── flooring-installation.webp
│       │           ├── tile-work.webp
│       │           ├── countertop-installation.webp
│       │           ├── plumbing-services.webp
│       │           └── general-contractor.webp
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   └── shared/                         # Shared code across apps
│       ├── src/
│       │   ├── types/
│       │   │   ├── landing-page.ts     # Landing page interfaces
│       │   │   ├── form-submission.ts  # Form submission interfaces
│       │   │   ├── form-session.ts     # Form session interfaces
│       │   │   └── index.ts            # Barrel export
│       │   └── validation/
│       │       ├── form-schemas.ts     # Zod validation schemas
│       │       └── index.ts            # Barrel export
│       ├── tsconfig.json
│       └── package.json
├── docs/
│   ├── architecture.md                 # This document
│   ├── prd.md                          # Product requirements
│   └── deployment.md                   # Deployment guide
├── .gitignore
├── netlify.toml                        # Netlify configuration
├── package.json                        # Root package.json (workspace)
├── tsconfig.json                       # Root TypeScript config
└── README.md
```

### Workspace Configuration

**Root `package.json`**:
```json
{
  "name": "landing-pages-automation",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/frontend",
    "build": "npm run build --workspace=apps/frontend",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "type-check": "npm run type-check --workspaces"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3"
  }
}
```

**Frontend `package.json`**:
```json
{
  "name": "@landing-pages/frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "airtable": "^0.12.2",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.3",
    "@landing-pages/shared": "*"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

**Shared `package.json`**:
```json
{
  "name": "@landing-pages/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./validation": "./src/validation/index.ts"
  },
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

---

### TypeScript Configuration

**Root `tsconfig.json`**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

**Frontend `tsconfig.json`**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Note**: Path alias `"@/*": ["./*"]` maps to `apps/frontend/` root since components are at `apps/frontend/components/` not in a `src/` subdirectory.

**Shared `tsconfig.json`**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Next.js Configuration

**`apps/frontend/next.config.js`**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use Turbopack for faster builds (Next.js 15.5+)
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow placeholder images from placehold.co
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },

  // Disable X-Powered-By header for security
  poweredByHeader: false,

  // Optimize production builds
  compress: true,
  productionBrowserSourceMaps: false,

  // Redirect trailing slashes
  trailingSlash: false,

  // Netlify-specific optimizations
  output: 'standalone',
};

module.exports = nextConfig;
```

---

### Tailwind CSS Configuration

**`apps/frontend/tailwind.config.js`**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from front-end-spec.md
        primary: {
          DEFAULT: '#1e40af',
          light: '#3b82f6',
        },
        accent: {
          DEFAULT: '#ea580c',
          light: '#fb923c',
        },
        success: '#059669',
        error: '#dc2626',
        warning: '#dc2626',
        neutral: {
          50: '#f8fafc',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography scale from front-end-spec.md
        'heading-1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],
        'heading-2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'heading-3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      spacing: {
        // Tailwind default scale (multiples of 0.25rem)
      },
    },
  },
  plugins: [],
};
```

---

### Global Styles

**`apps/frontend/styles/globals.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    @apply antialiased;
  }

  body {
    @apply bg-neutral-50 text-neutral-900;
  }

  /* Ensure minimum 16px font on mobile (prevent iOS zoom) */
  input,
  textarea,
  select {
    @apply text-base;
  }
}

/* Custom component styles */
@layer components {
  /* Form field focus styles */
  .form-input:focus {
    @apply outline-none ring-2 ring-primary ring-offset-2;
  }

  /* CTA button styles */
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg font-semibold;
    @apply hover:bg-primary-light transition-colors duration-150;
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  }

  /* Form validation styles */
  .form-error {
    @apply border-error text-error;
  }

  .form-success {
    @apply border-success;
  }
}

/* Custom utilities */
@layer utilities {
  /* Accessibility: Skip to main content */
  .skip-to-main:focus {
    @apply fixed top-0 left-0 z-50 bg-primary text-white px-4 py-2;
  }
}
```

---

### Git Ignore Configuration

**`.gitignore`** (project root):
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/
*.test.js.snap

# Next.js
.next/
out/
build/
dist/
.vercel/

# Environment variables
.env
.env*.local
!.env.example

# Production
build/
dist/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Local development
.DS_Store
*.local
.vscode/
.idea/

# Turbo
.turbo

# Netlify
.netlify/
```

---

### File Naming Conventions

**React Components**: PascalCase (e.g., `MultiStepForm.tsx`, `FormField.tsx`)
**Utility Files**: camelCase (e.g., `airtable.ts`, `validation.ts`)
**Services**: PascalCase (e.g., `AirtableService.ts`, `RecaptchaService.ts`)
**Contexts**: PascalCase with suffix (e.g., `FormContext.tsx`, `MarketingContext.tsx`)
**API Routes**: kebab-case directories (e.g., `submit-form/route.ts`, `validate-recaptcha/route.ts`)
**Types**: kebab-case files (e.g., `landing-page.ts`, `form-submission.ts`)

---

### Import Path Aliases

**Frontend Imports**:
```typescript
// Local imports (within frontend)
import { LandingPageHero } from '@/components/LandingPageHero';
import { AirtableService } from '@/services/AirtableService';

// Shared package imports
import { LandingPage } from '@shared/types';
import { completeFormSchema } from '@shared/validation';
```

**Shared Package Imports**:
```typescript
// From packages/shared/src/index.ts
export * from './types';
export * from './validation';
```

---

### Environment Files

**`.env.local`** (local development, gitignored):
```bash
# Airtable
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Make.com Webhook
MAKE_COM_WEBHOOK_SECRET=your-webhook-secret-here

# Optional
DUPLICATE_CHECK_WINDOW_MINUTES=5
```

**`.env.example`** (committed to repo):
```bash
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=your_gtm_id

# Make.com Webhook
MAKE_COM_WEBHOOK_SECRET=your_webhook_secret

# Optional Configuration
DUPLICATE_CHECK_WINDOW_MINUTES=5
```

---

### Git Ignore Configuration

**`.gitignore`**:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Environment Variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS Files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Netlify
.netlify/
```

---

### Project Structure Rationale

**Why Monorepo**:
- **Shared types** between frontend and backend (no duplication)
- **Shared validation** schemas (Zod) used on both client and server
- **Single source of truth** for data models
- **Atomic commits** - changes to types and consumers in one PR
- **Simplified dependency management** - one `node_modules` at root

**Why npm workspaces (not Turborepo/Nx)**:
- **Simpler setup** - built into npm (no external tools)
- **Sufficient for MVP** - only 2 workspaces (frontend + shared)
- **No build orchestration needed** - Next.js handles frontend build
- **Phase 2 consideration** - migrate to Turborepo if adding more apps

**Why co-located API routes**:
- **Next.js convention** - API routes live in `app/api/`
- **Automatic serverless function deployment** via Netlify
- **Shared context** with frontend (same TypeScript config, imports)
- **Type safety** across frontend/backend boundary

**Why separate services directory**:
- **Testable business logic** - services can be unit tested without HTTP
- **Reusable across API routes** - AirtableService used by multiple endpoints
- **Clear separation of concerns** - thin handlers, fat services
- **Easier to refactor** - extract to separate package if needed

---

## Development Workflow

### Initial Setup

**1. Clone Repository**:
```bash
git clone <repository-url>
cd landing-pages-automation
```

**2. Install Dependencies**:
```bash
npm install
```
This installs dependencies for all workspaces (root, frontend, shared).

**3. Configure Environment Variables**:
```bash
cp .env.example apps/frontend/.env.local
# Edit .env.local with your API keys
```

**4. Start Development Server**:
```bash
npm run dev
```
Opens `http://localhost:3000`

---

### Development Commands

**Run Frontend Dev Server**:
```bash
npm run dev
# or
npm run dev --workspace=apps/frontend
```

**Build for Production**:
```bash
npm run build
```

**Type Check**:
```bash
npm run type-check
```

**Lint**:
```bash
npm run lint
```

**Run Tests**:
```bash
npm test
```

---

### Pre-commit Workflow

**Recommended Workflow**:
1. Make changes in feature branch
2. Run `npm run type-check` to verify TypeScript
3. Run `npm run lint` to check code style
4. Run `npm test` to verify tests pass
5. Commit with descriptive message
6. Push to remote for PR review

**Git Hooks** (optional - Phase 2):
- Husky for pre-commit hooks
- lint-staged for staged files only
- commitlint for commit message format

---

### Adding New Landing Page Types

**1. Add Hero Image**:
```bash
# Add to apps/frontend/public/images/heroes/
cp new-service.webp apps/frontend/public/images/heroes/
```

**2. Update Page Type Enum**:
```typescript
// packages/shared/src/types/landing-page.ts
export enum PageType {
  WalkInShower = "Walk In Shower",
  FullBathroomRemodel = "Full Bathroom Remodel",
  KitchenRemodel = "Kitchen Remodel",
  NewService = "New Service", // Add here
}
```

**3. Update Airtable Page Type Dropdown**:
- Go to Landing Pages table
- Edit `page_type` field options
- Add new service type

**4. Create Landing Page Record in Airtable**:
- Fill in content brief
- Select new page type
- Status = "pending"
- Make.com will generate content

---

### Debugging Tips

**Next.js Dev Server Issues**:
```bash
# Clear Next.js cache
rm -rf apps/frontend/.next
npm run dev
```

**TypeScript Errors**:
```bash
# Rebuild TypeScript types
npm run type-check
```

**Environment Variable Not Loading**:
- Restart dev server (env vars only loaded on start)
- Verify variable name starts with `NEXT_PUBLIC_` for client-side
- Check `.env.local` file location (`apps/frontend/.env.local`)

**Airtable Connection Issues**:
- Verify `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are correct
- Check Airtable API key has read/write permissions
- Test connection with simple fetch in API route

**Form Submission Not Working**:
- Check browser console for errors
- Verify reCAPTCHA site key is correct
- Check Netlify function logs for backend errors
- Verify Airtable table names match exactly (case-sensitive)

---

## Deployment Architecture

### Netlify Configuration

**Deployment Strategy**: Continuous deployment from Git repository

**Build Settings**:
```toml
# netlify.toml (project root)

[build]
  command = "npm run build"
  publish = ".next"
  functions = ".netlify/functions"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["airtable"]
  included_files = ["apps/frontend/public/**"]

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/api/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

---

### Deployment Environments

**Production Environment**:
- **URL**: `https://your-domain.com`
- **Branch**: `main`
- **Auto-deploy**: On push to main
- **Environment Variables**: Configured in Netlify dashboard

**Preview Environments** (optional - Phase 2):
- **URL**: `https://deploy-preview-{PR#}--your-site.netlify.app`
- **Branch**: Pull request branches
- **Auto-deploy**: On PR creation/update
- **Environment Variables**: Inherit from production + overrides

---

### Netlify Deployment Workflow
1. Push to `main` branch
2. Netlify detects change via webhook
3. Runs `npm run build` command
4. Deploys to production URL
5. Invalidates CDN cache
6. Sends deploy notification

---

### Deployment Process

**Manual Deployment** (via Netlify Dashboard):
1. Log into Netlify dashboard
2. Navigate to Deploys tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait for build to complete (~2-3 minutes)
5. Verify deployment at production URL

**Automated Deployment** (via Git):
1. Merge PR to `main` branch
2. Netlify auto-deploys within 2-3 minutes
3. Check deploy status in Netlify dashboard
4. Verify changes at production URL

**Rollback Process**:
1. Go to Netlify dashboard → Deploys
2. Find previous successful deploy
3. Click "Publish deploy" on old version
4. Site reverts to previous state instantly

---

### Environment Variable Management

**Setting Environment Variables in Netlify**:
1. Netlify dashboard → Site settings → Environment variables
2. Add variables with exact names from `.env.example`
3. Mark sensitive variables as "Secret" (redacted in UI)
4. Variables apply to all builds automatically

**Required Variables**:
- `AIRTABLE_API_KEY` (secret)
- `AIRTABLE_BASE_ID`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY` (secret)
- `NEXT_PUBLIC_GTM_ID`
- `MAKE_COM_WEBHOOK_SECRET` (secret)

---

### Build Performance

**Build Time Targets**:
- Cold build: <3 minutes
- Incremental build: <2 minutes

**Build Optimization**:
- Turbopack enabled (Next.js 15.5)
- Minimal dependencies (only Airtable SDK)
- Tree shaking with esbuild
- No unnecessary build steps

**Build Monitoring**:
- Netlify dashboard shows build duration
- Build logs available for debugging
- Deploy notifications via email/Slack

---

### Deployment Checklist

**Pre-Deployment**:
- [ ] All tests passing
- [ ] Type check passing
- [ ] Lint check passing
- [ ] Environment variables configured in Netlify
- [ ] Hero images uploaded to `public/images/heroes/`
- [ ] Airtable base configured with all tables
- [ ] Make.com scenarios activated
- [ ] reCAPTCHA keys configured (v3)
- [ ] GTM container created and configured

**Post-Deployment**:
- [ ] Verify homepage loads
- [ ] Test landing page route (e.g., `/bathroom-remodel`)
- [ ] Submit test form and verify in Airtable
- [ ] Check reCAPTCHA badge appears
- [ ] Verify GTM tag firing (use GTM Preview mode)
- [ ] Test thank you page redirect
- [ ] Check Netlify function logs for errors
- [ ] Verify Core Web Vitals in PageSpeed Insights

---

## Security and Performance

### Security Requirements

**HTTPS Only**: All traffic served over HTTPS via Netlify (automatic SSL)

**Security Headers** (configured in `netlify.toml`):
- `X-Frame-Options: DENY` - Prevent clickjacking on API routes
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS filtering
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info

**Input Validation**:
- Client-side validation with Zod schemas (user feedback)
- Server-side validation with same Zod schemas (security)
- Never trust client input - always validate on server

**API Security**:
- reCAPTCHA v3 on all form submissions (min score 0.5)
- Webhook signature verification (Make.com secret)
- Environment variables for all secrets (never hardcode)
- IP address logging for fraud detection

**Data Protection**:
- No sensitive data stored in localStorage/sessionStorage (only form progress)
- TCPA consent required before form submission
- User data transmitted over HTTPS only
- Airtable API key stored server-side only

**Phase 2 Enhancements**:
- Rate limiting per IP address (10 submissions/hour)
- CSRF token for form submissions
- Content Security Policy (CSP) headers
- Subresource Integrity (SRI) for external scripts

---

### Performance Requirements

**Core Web Vitals Targets**:
- **LCP (Largest Contentful Paint)**: <2.5s (hero image optimization critical)
- **INP (Interaction to Next Paint)**: <200ms (minimal JavaScript blocking, optimized interactions)
- **CLS (Cumulative Layout Shift)**: <0.1 (fixed image dimensions)

**Page Speed Targets**:
- Time to Interactive (TTI): <3.5s
- First Contentful Paint (FCP): <1.5s
- Speed Index: <3.0s

**Optimization Strategies**:
- **Static Site Generation (SSG)**: Pre-render all landing pages at build time
- **Next.js Image Optimization**: Automatic WebP conversion, responsive sizing, lazy loading
- **CDN Caching**: Netlify Edge Network caches static assets globally
- **Code Splitting**: Automatic route-based splitting with Next.js App Router
- **Tree Shaking**: Remove unused code with Turbopack
- **Minimal JavaScript**: Server Components reduce client-side JS

**Bundle Size Targets**:
- Initial page load: <200KB gzipped
- React runtime: ~80KB (acceptable for interactivity needs)
- Form components: ~30KB (React Hook Form + validation)

**Monitoring**:
- Netlify Analytics for real-world performance data
- PageSpeed Insights for Core Web Vitals validation
- Lighthouse audits (manual or via Netlify Build Plugins)

---

## Testing Strategy

### Unit Tests (Vitest)

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

### Integration Tests (React Testing Library)

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

### E2E Tests (Playwright)

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

### Test Commands

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

## Coding Standards

### TypeScript Standards

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

### React Standards

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

### File Organization Standards

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

### Naming Conventions

**Components**: PascalCase (`MultiStepForm`, `FormField`)
**Functions**: camelCase (`submitForm`, `validateInput`)
**Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
**Interfaces**: PascalCase with `I` prefix optional (`FormData` or `IFormData`)
**Types**: PascalCase (`LandingPageStatus`)
**Files**: Match export name (`MultiStepForm.tsx`, `airtable.ts`)

---

### Code Comments

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

## Error Handling Strategy

### Frontend Error Handling

**Error Boundary**: Catch React component errors gracefully
**Form Validation**: Show inline errors with clear messaging
**API Errors**: Display user-friendly error messages
**Network Errors**: Show retry button with explanation

**Example**:
```typescript
try {
  const response = await fetch('/api/submit-form', { /* ... */ });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Submission failed');
  }
} catch (error) {
  setError(error instanceof Error ? error.message : 'An unexpected error occurred');
}
```

---

### Backend Error Handling

**Validation Errors (400)**: Return specific field errors
**Duplicate Detection (429)**: Return friendly message about duplicate
**Server Errors (500)**: Generic message (no sensitive details exposed)
**Logging**: All errors logged with context for debugging

**Example**:
```typescript
export async function POST(request: NextRequest) {
  try {
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUBMIT_FORM_ERROR]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'An error occurred while processing your submission.' },
      { status: 500 }
    );
  }
}
```

---

### Error Logging

**Console Logging** (Phase 1):
- Structured JSON logs for parsing
- Include context (user email, timestamp, error type)
- Stack traces for server errors

**Phase 2 Enhancements**:
- Sentry integration for error tracking
- Error aggregation and alerting
- User session replay for debugging
- Error rate monitoring and alerts

---

## Monitoring and Observability

### Phase 1 Monitoring

**Netlify Dashboard**:
- Build status and duration
- Deploy logs and history
- Function invocation count and errors
- Bandwidth and request metrics

**Browser Console**:
- Client-side JavaScript errors
- Network request failures
- Validation errors

**Airtable**:
- Form submission count (monitor for drops)
- Error message field (track backend failures)
- Landing page status (track generation failures)

---

### Metrics to Monitor

**Performance Metrics**:
- Core Web Vitals (LCP, INP, CLS)
- Page load times
- Time to Interactive (TTI)
- First Contentful Paint (FCP)

**Business Metrics**:
- Form submission count (daily/weekly)
- Form completion rate (step 1 → submission)
- Form abandonment by step
- Average completion time

**Technical Metrics**:
- Build success rate
- Deployment frequency
- Function error rate
- API response times

---

### Phase 2 Observability Enhancements

**Error Tracking**: Sentry for frontend and backend errors
**APM**: Datadog or New Relic for application performance
**RUM**: Real User Monitoring with Netlify Analytics
**Logging**: Structured logs with LogRocket or Datadog
**Alerting**: PagerDuty or Opsgenie for critical issues
**Dashboards**: Grafana or Datadog for unified monitoring

---

### Phase 2 Enhancement: Offer Variations

**Purpose**: Enable multiple landing page variations per service type, each with different promotional offers for A/B testing and conversion optimization.

**URL Strategy**:
```
Base Pattern: /[base-slug]-[offer-suffix]/

Examples:
/bathroom-remodel/ (no offer - default)
/bathroom-remodel-3000-off/ (high-value offer)
/bathroom-remodel-50-percent/ (percentage offer)
```

**Implementation Requirements**:

1. **Offer Table**: Create Offers table (defined above) in Airtable
2. **Landing Pages Update**: Add `offer_id` field to Landing Pages table (link to Offers)
3. **Dynamic Slug Generation**: Update slug field to include offer suffix when offer is linked
4. **Form Tracking**: Populate `offer_id`, `page_variant` in Form Submissions
5. **Make.com Routing**: Add router module to route by offer value/type
6. **Content Prompting**: Modify Claude prompts to emphasize specific offers
7. **Analytics**: Track conversion rates by offer_id

**Benefits**:
- Test multiple value propositions per service
- Optimize conversion rates through A/B testing
- Better lead qualification via offer selection
- Price sensitivity analysis

**Complexity Added**:
- More landing pages to generate and manage
- More complex URL routing
- Canonical URL strategy (each variation self-referencing)
- Offer expiration/activation logic
- More complex analytics and attribution

**Decision**: Deferred to Phase 2 to prioritize MVP launch. Schema prepared for future implementation.

---

### Phase 2 Enhancement: SEO Optimization

**Purpose**: Comprehensive SEO optimization for higher organic rankings and better click-through rates.

**Meta Tags Strategy**:

**Page Title Formula**:
```
[Value Prop] + [Primary Keyword] + [Location?] + | [Brand]
Examples:
- "Professional Bathroom Remodel Services | YourBrand"
- "Walk-In Shower Installation in Chicago | YourBrand"
Length: 30-60 characters
```

**Meta Description Formula**:
```
[Value Prop] + [Keyword] + [Urgency] + [CTA]
Examples:
- "Expert bathroom remodeling with free consultation. Trusted by 1000+ homeowners. Get your quote today."
- "Transform your bathroom with professional remodeling. Licensed contractors. Call now for special pricing."
Length: 120-160 characters
```

**Structured Data (JSON-LD)**:

**Service Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Bathroom Remodel Services",
  "description": "Professional bathroom remodeling",
  "provider": {
    "@type": "LocalBusiness",
    "name": "YourBrand",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1200"
    }
  },
  "areaServed": "Chicago, IL",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://example.com/bathroom-remodel/"
  }
}
```

**FAQ Schema** (from common questions):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How long does a bathroom remodel take?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Most bathroom remodels take 2-4 weeks depending on scope."
    }
  }]
}
```

**Open Graph Tags**:
```html
<meta property="og:type" content="website">
<meta property="og:title" content="Professional Bathroom Remodel">
<meta property="og:description" content="Expert bathroom remodeling services">
<meta property="og:image" content="/images/heroes/bathroom-remodel-og.jpg">
<meta property="og:url" content="https://example.com/bathroom-remodel/">
```

**Canonical URL Strategy**:
- Self-referencing canonical for unique content
- Format: `<link rel="canonical" href="https://example.com/bathroom-remodel/">`
- Always use absolute URLs with trailing slash
- One canonical per page (no cross-linking between variations)

**No Internal Linking Policy** (Conversion Focused):
- Each landing page is **independent** (no cross-linking between service pages)
- Single-purpose conversion focus
- Only permitted links:
  - Privacy Policy (footer, nofollow)
  - Terms of Service (footer, nofollow)
  - Main website (header logo only)
- Benefits: Clean attribution, faster generation, better paid campaign Quality Score

**Trust Signals & Urgency Elements**:
- Customer testimonials with star ratings
- Trust badges (BBB, licensed/insured, money-back guarantee)
- Social proof ("1000+ happy customers")
- Scarcity messaging ("Limited availability this month")
- Countdown timers (for time-sensitive offers)

**Performance Targets** (Core Web Vitals):
- LCP (Largest Contentful Paint): <2.5s
- INP (Interaction to Next Paint): <200ms
- CLS (Cumulative Layout Shift): <0.1
- Time to Interactive: <3.8s

**Mobile Optimization**:
- Responsive design (Tailwind CSS handles this)
- Tap-friendly CTAs (min 44x44px)
- Readable font sizes (min 16px)
- No horizontal scrolling

**Implementation Requirements**:

1. **Landing Pages Table**: Add `canonical_url`, `structured_data`, `urgency_message`, `trust_signals` fields
2. **Meta Tags Component**: Create reusable Next.js metadata component
3. **Schema Generator**: Utility function to generate JSON-LD based on page type
4. **SEO Audit**: Validate all meta tags, structured data, and canonical URLs
5. **Performance Monitoring**: Track Core Web Vitals via Netlify Analytics

**Benefits**:
- Higher organic search rankings
- Better click-through rates from search results
- Rich snippets in Google search results
- Social media preview optimization
- Improved conversion through trust signals

**Complexity Added**:
- More metadata fields to manage
- Schema.org markup generation
- SEO validation and testing
- Performance optimization requirements

**Decision**: Core SEO (title, description, canonical) included in Phase 1. Advanced SEO (structured data, trust signals, urgency) deferred to Phase 2.

---

### Phase 2 Enhancement: Conversion Optimization

**Purpose**: Maximize form conversion rates through UX improvements, trust signals, and behavioral psychology.

**Multi-Step Form Strategy** (vs. Single-Page):

**Step 1 - Micro-Commitment** (ZIP code only):
```html
<!-- High-intent capture above fold -->
<div class="single-field-focus">
  <input type="text" name="zip_code"
         placeholder="Enter ZIP Code for Pricing"
         pattern="[0-9]{5}" required>
  <button type="submit">See My Pricing</button>
</div>
<div class="trust-indicators">
  🔒 Instant Quote • 📞 No Sales Calls • ⏱️ 2-Minute Process
</div>
```

**Step 2 - Momentum Completion** (Full contact details):
```html
<div class="progress-indicator">Step 2 of 2</div>
<div class="personalized-message">
  Your Custom Quote for [ZIP_CODE]
</div>
<!-- Full name, email, phone, project details -->
```

**Expected Impact**: 35-45% improvement in form completion rate

**Trust Signal Placement Hierarchy**:
1. **Header**: Licensed/Bonded/BBB Rating (institutional trust)
2. **Hero Section**: Customer count, years in business (social proof)
3. **Form Area**: Money-back guarantee, free consultation (risk reversal)
4. **Footer**: Testimonials with star ratings (peer validation)

**Mobile Conversion Optimizations**:
```css
@media (max-width: 768px) {
  .form-input {
    min-height: 54px;        /* Comfortable thumb target */
    font-size: 16px;         /* Prevent iOS zoom */
    padding: 1rem 1.25rem;
  }

  .cta-primary {
    width: 100%;
    min-height: 54px;        /* Minimum touch target */
    font-size: 1.25rem;
  }
}
```

**Urgency/Scarcity Elements**:
- Countdown timers ("Offer expires in 4d 23h 47m")
- Scarcity meters ("3 of 10 spots remaining this month")
- Real-time activity feed ("M.S. from Chicago claimed $3,000 savings 2 hours ago")
- Exit-intent popups (behavioral triggers)

**Color Psychology for Conversions**:
```css
:root {
  --primary-blue: #1e40af;      /* Trust and reliability */
  --accent-orange: #ea580c;     /* Urgency and savings */
  --success-green: #059669;     /* Positive reinforcement */
  --warning-red: #dc2626;       /* Urgency indicators */
}
```

**Dynamic CTA Optimization**:
- Offer-specific CTA text (not generic "Submit")
- "$3,000 OFF" offers: "Lock In My $3,000 Savings"
- "50% OFF" offers: "Get Half-Price Installation"
- Urgency messaging: "Only 3 spots left this month"

**Real-Time Form Enhancements**:
- Progressive validation with positive reinforcement (✓ checkmarks)
- Progress bars showing completion percentage
- Inline error messages (not after submit)
- Smart autofill suggestions
- Form recovery for abandonment scenarios

**A/B Testing Framework**:
- Hero image variants (luxury, family, modern)
- CTA text variations
- Form style (single, two-step, progressive)
- Urgency level (high, medium, low)
- Built-in variant assignment and tracking

**Performance Targets**:
- First Contentful Paint: <1.2s
- Largest Contentful Paint: <2.0s
- Time to Interactive: <2.5s
- Cumulative Layout Shift: <0.1

**Success Metrics & KPIs**:
- Form completion rate (Target: 25%+ improvement)
- Cost per lead (Target: 20%+ reduction)
- Lead quality score (Target: 15%+ improvement)
- Mobile conversion rate (Target: Match or exceed desktop)

**Expected Overall Impact**: 40-60% improvement in conversion rate, 25-35% reduction in cost per lead

**Implementation Requirements**:

1. **Multi-Step Form Component**: Build Step 1 (ZIP) → Step 2 (Full Details) flow
2. **Trust Signals Component**: Configurable trust badges, testimonials, credentials
3. **Urgency Components**: Countdown timers, scarcity meters, activity feeds
4. **Mobile Optimizations**: Touch-friendly inputs, sticky CTAs, keyboard handling
5. **Real-Time Validation**: Progressive validation with positive feedback
6. **A/B Testing Framework**: Variant assignment, tracking, analytics
7. **Conversion Analytics**: Micro-conversions, abandonment tracking, heat mapping

**Complexity Added**:
- More complex form state management
- Real-time validation logic
- A/B testing infrastructure
- Additional analytics tracking
- More sophisticated UI components

**Decision**: MVP uses 3-step form (Phase 1). Advanced conversion optimizations (2-step with ZIP first, urgency timers, A/B testing) deferred to Phase 2.

---

*Document Status: In Progress - Sections remaining: Frontend Architecture, Backend Architecture, Project Structure, Development Workflow, Deployment, Security & Performance, Testing Strategy, Coding Standards, Error Handling, Monitoring*
