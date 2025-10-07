# Project Structure

This section defines the monorepo structure using npm workspaces for the Landing Pages Automation system.

## URL Structure & Routing

**Production Domain**: Single subdomain strategy
```
https://[subdomain].[client-domain].com
```
*Example: `https://remodeling.example.com`*

---

### Landing Page URL Patterns

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

### URL Examples by Service Type

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

### Google Ads Optimization

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

### Next.js Routing Implementation

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

### UTM Parameter Handling

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

### SEO & Canonical URL Policy

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

### Airtable Schema Additions

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

### Netlify Configuration

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

### URL Validation Rules

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

## Monorepo Layout

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
│       │   ├── placeholders.ts              # Centralized placeholder image library
│       │   └── errors.ts
│       ├── services/
│       │   ├── AirtableService.ts
│       │   ├── RecaptchaService.ts
│       │   └── DuplicateDetectionService.ts
│       ├── middleware.ts                    # URL normalization (remove trailing slashes)
│       ├── styles/
│       │   └── globals.css
│       ├── public/
│       │   └── images/
│       │       # Note: Phase 1 uses placehold.co URLs via lib/placeholders.ts
│       │       # Phase 2 structure (physical WebP files):
│       │       ├── heroes/                   # Hero images (1200x800px)
│       │       │   ├── walk-in-shower.webp
│       │       │   ├── full-bathroom-remodel.webp
│       │       │   ├── kitchen-remodel.webp
│       │       │   ├── hvac-services.webp
│       │       │   ├── roofing-services.webp
│       │       │   ├── flooring-installation.webp
│       │       │   ├── tile-work.webp
│       │       │   ├── countertop-installation.webp
│       │       │   └── default.webp
│       │       ├── testimonials/             # Customer photos (400x400px)
│       │       │   ├── customer-1.webp
│       │       │   ├── customer-2.webp
│       │       │   ├── customer-3.webp
│       │       │   ├── customer-4.webp
│       │       │   ├── customer-5.webp
│       │       │   └── default.webp
│       │       ├── badges/                   # Trust badges (200x100px)
│       │       │   ├── bbb-accredited.webp
│       │       │   ├── licensed.webp
│       │       │   ├── insured.webp
│       │       │   ├── warranty.webp
│       │       │   ├── certified.webp
│       │       │   ├── award.webp
│       │       │   └── default.webp
│       │       ├── before-after/             # Before/after photos (600x400px)
│       │       │   ├── bathroom-before.webp
│       │       │   ├── bathroom-after.webp
│       │       │   ├── kitchen-before.webp
│       │       │   ├── kitchen-after.webp
│       │       │   ├── generic-before.webp
│       │       │   └── generic-after.webp
│       │       ├── process/                  # Process steps (800x600px)
│       │       │   ├── consultation.webp
│       │       │   ├── design.webp
│       │       │   ├── installation.webp
│       │       │   ├── completion.webp
│       │       │   ├── step-1.webp
│       │       │   ├── step-2.webp
│       │       │   ├── step-3.webp
│       │       │   └── step-4.webp
│       │       ├── team/                     # Team photos (300x400px)
│       │       │   ├── team-member-1.webp
│       │       │   ├── team-member-2.webp
│       │       │   ├── team-member-3.webp
│       │       │   ├── team-member-4.webp
│       │       │   └── default.webp
│       │       ├── portfolio/                # Gallery (800x600px)
│       │       │   ├── project-1.webp
│       │       │   ├── project-2.webp
│       │       │   ├── project-3.webp
│       │       │   ├── project-4.webp
│       │       │   ├── project-5.webp
│       │       │   ├── project-6.webp
│       │       │   └── default.webp
│       │       ├── icons/                    # Icons (100x100px)
│       │       │   ├── feature-1.webp
│       │       │   ├── feature-2.webp
│       │       │   ├── feature-3.webp
│       │       │   ├── feature-4.webp
│       │       │   ├── checkmark.webp
│       │       │   ├── star.webp
│       │       │   └── default.webp
│       │       └── logos/                    # Logos (300x100px)
│       │           ├── company-logo.webp
│       │           ├── partner-logo-1.webp
│       │           ├── partner-logo-2.webp
│       │           └── partner-logo-3.webp
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

## Workspace Configuration

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

## TypeScript Configuration

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

## Next.js Configuration

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

## Tailwind CSS Configuration

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

## Global Styles

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

## Git Ignore Configuration

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

## File Naming Conventions

**React Components**: PascalCase (e.g., `MultiStepForm.tsx`, `FormField.tsx`)
**Utility Files**: camelCase (e.g., `airtable.ts`, `validation.ts`)
**Services**: PascalCase (e.g., `AirtableService.ts`, `RecaptchaService.ts`)
**Contexts**: PascalCase with suffix (e.g., `FormContext.tsx`, `MarketingContext.tsx`)
**API Routes**: kebab-case directories (e.g., `submit-form/route.ts`, `validate-recaptcha/route.ts`)
**Types**: kebab-case files (e.g., `landing-page.ts`, `form-submission.ts`)

---

## Import Path Aliases

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

## Environment Files

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

## Git Ignore Configuration

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

## Project Structure Rationale

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
