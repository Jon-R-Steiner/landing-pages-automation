# Next.js 15.5 Netlify Deployment - Comprehensive Research Guide

**Research Date**: October 7, 2025
**Focus**: Next.js 15.5 deployment to Netlify with App Router, serverless functions, environment variables, and build configuration

---

## Executive Summary

Netlify provides **zero-configuration** deployment for Next.js 15.5 via the OpenNext adapter, which they actively maintain and test with every stable Next.js release. The platform supports all major Next.js features including:

- ✅ App Router with Server Components, Streaming, Server Actions
- ✅ Automatic conversion of Next.js API routes to Netlify Functions
- ✅ Edge Functions for Next.js Middleware (running at CDN edge)
- ✅ On-demand and time-based revalidation (ISR)
- ✅ Netlify Image CDN integration with `next/image`
- ✅ Full Route Cache and Data Cache via Netlify's fine-grained caching

**Confidence Level**: High (9/10) - Based on official Netlify documentation, recent blog posts, and community troubleshooting

---

## 1. Deployment Methods

### Method 1: Git-Based Deployment (Recommended)

**Steps**:
1. Push Next.js project to Git provider (GitHub, GitLab, Bitbucket)
2. Connect repository via Netlify Dashboard
3. Netlify auto-detects Next.js and configures build settings
4. Deploy triggers automatically on git push

**Benefits**:
- Zero manual configuration required
- Auto-upgrades to latest @netlify/plugin-nextjs
- Preview deployments for pull requests
- Automatic rollback capabilities

### Method 2: Netlify CLI Manual Deployment

**Steps**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build locally
npm run build

# Deploy
netlify deploy --prod
```

**Use Cases**:
- Testing builds before pushing to Git
- Deploying from CI/CD pipelines
- Advanced deployment workflows

### Method 3: Starter Template (Fastest)

Deploy pre-configured Next.js 15 starter:
- https://www.netlify.com/with/nextjs/
- One-click deployment to Netlify account
- Fully functional example with best practices

---

## 2. Build Configuration

### Zero-Configuration Approach (Recommended)

Netlify automatically detects Next.js projects and applies optimal settings:

- **Build Command**: `next build` (auto-detected)
- **Publish Directory**: `.next` (auto-configured)
- **Node.js Version**: 20.x (default for Next.js 15+)
- **Plugin**: `@netlify/plugin-nextjs` (auto-installed)

**No `netlify.toml` required** for standard Next.js deployments.

### Manual Configuration (Optional)

Create `netlify.toml` in project root for custom settings:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

**Key Configuration Options**:

```toml
# Custom build command
[build]
  command = "npm run build:custom"

# Environment variables (alternative to UI)
[build.environment]
  NEXT_PUBLIC_API_URL = "https://api.example.com"
  # WARNING: Don't put secrets here - use Netlify UI

# Redirects (if needed beyond Next.js routing)
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

**Important Notes**:
- Netlify recommends **NOT** pinning `@netlify/plugin-nextjs` version
- Auto-upgrades provide critical fixes and performance improvements
- Manual installation: `npm install -D @netlify/plugin-nextjs`

---

## 3. App Router Configuration

### Full Support Out-of-the-Box

Netlify fully supports Next.js App Router (Next.js 13.5+):

- ✅ **Server Components**: Automatic SSR via Netlify Functions
- ✅ **Streaming**: Progressive rendering with React Suspense
- ✅ **Server Actions**: POST requests to server-side mutations
- ✅ **Route Groups**: Organizational folders with parentheses
- ✅ **Parallel Routes**: Multiple route segments rendered simultaneously
- ✅ **Intercepting Routes**: Modal-like UX patterns

### How It Works

**Build-Time Processing**:
1. Next.js generates static pages during `next build`
2. OpenNext adapter analyzes App Router structure
3. Dynamic routes → Netlify Functions
4. Static routes → Pre-rendered HTML (cached at CDN edge)

**Runtime Execution**:
- **Static Routes**: Served directly from CDN (instant)
- **Dynamic Routes**: Netlify Function invoked (`___netlify-handler`)
- **ISR Routes**: Cached with revalidation timers

### App Router Best Practices for Netlify

```typescript
// app/page.tsx - Static generation (default)
export default function HomePage() {
  return <div>Static content - served from CDN</div>
}

// app/products/[id]/page.tsx - Dynamic with ISR
export const revalidate = 3600 // Revalidate every hour

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id)
  return <div>{product.name}</div>
}

// app/dashboard/page.tsx - Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser() // Runs on every request
  return <div>Welcome, {user.name}</div>
}
```

**Caching Strategy**:
- Static pages: Cached indefinitely until redeployment
- ISR pages: Cached with time-based revalidation
- Dynamic pages: No caching (function runs per request)

---

## 4. Serverless Functions Integration

### Next.js API Routes → Netlify Functions

**Automatic Conversion**:
- All Next.js API routes (`app/api/*` or `pages/api/*`) → Netlify Functions
- Deployed as Edge Functions by default (closer to users)
- Can opt into standard serverless functions if needed

**Example Next.js API Route**:

```typescript
// app/api/submit-form/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Process form submission
  const result = await saveToAirtable(body)

  return NextResponse.json({ success: true, id: result.id })
}
```

**Deployed As**:
- Function Name: `___netlify-handler` (internal wrapper)
- Endpoint: `https://yoursite.netlify.app/api/submit-form`
- Runtime: Node.js 20 (serverless)
- Timeout: 10 seconds (default), up to 26 seconds (configurable)

### Architecture Overview

**Three Netlify Functions Created**:
1. **`___netlify-handler`**: Handles SSR pages and API routes
2. **`___netlify-odb-handler`**: On-Demand Builders (ISR)
3. **Custom Edge Functions**: For Next.js Middleware

### Function Configuration

**Timeout Adjustment** (if needed):

```toml
# netlify.toml
[functions]
  node_bundler = "esbuild"

[[functions."___netlify-handler"]]
  timeout = 15
```

**Size Limits**:
- Unzipped bundle: 250 MB max
- Dependencies causing oversized bundles: exclude in `netlify.toml`

```toml
[functions]
  excluded_node_modules = ["electron", "chromium", "puppeteer"]
```

### Best Practices

**✅ Recommended**:
- Use Next.js API routes over standalone Netlify Functions
- Leverage shared types via monorepo structure
- Keep function bundles small (exclude heavy dependencies)

**❌ Avoid**:
- Mixing Next.js API routes with separate `netlify/functions/` directory
- Large dependencies in serverless functions (optimize bundle size)
- Long-running processes (use async workflows instead)

---

## 5. Environment Variables

### Setting Environment Variables

**Via Netlify UI** (Recommended):
1. Project Settings → Environment Variables
2. Add key-value pairs
3. Set scopes: **Functions** + **Builds** (required for SSR)
4. Deploy to apply changes

**Via Netlify CLI**:
```bash
# Set single variable
netlify env:set API_KEY "your-secret-key"

# Import from .env file
netlify env:import .env
```

**Via `netlify.toml`** (Not recommended for secrets):
```toml
[build.environment]
  NEXT_PUBLIC_SITE_URL = "https://example.com"
```

### Next.js Environment Variable Conventions

**Client-Side (Browser-Accessible)**:
```bash
# .env.local (for local development only)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
```

**Server-Side (Functions-Only)**:
```bash
# .env.local
AIRTABLE_API_KEY=patXYZ123...
RECAPTCHA_SECRET_KEY=6Lc...
DATABASE_URL=postgresql://...
```

**Critical Rules**:
- ✅ `NEXT_PUBLIC_*` prefix → Exposed to browser (bundled into client-side JS)
- ✅ No prefix → Server-side only (safe for secrets)
- ❌ Never commit `.env.local` to Git
- ❌ Never put secrets in `netlify.toml` (tracked in Git)

### SSR/ISR Considerations

**For Server-Side Rendering**:
- Environment variables MUST be set via **Netlify UI/CLI/API**
- `.env` files are **NOT** read during Netlify builds
- Scope must include **Functions** (runtime access)

**Variable Precedence**:
1. Netlify UI/CLI/API (highest priority)
2. `netlify.toml` (overrides UI if present)
3. `.env` files (local development only)

### Security Best Practices

**✅ Do**:
- Store secrets in Netlify UI (encrypted at rest)
- Use `NEXT_PUBLIC_*` only for truly public values
- Import `.env` to Netlify via CLI: `netlify env:import`
- Keep `.env.local` in `.gitignore`

**❌ Don't**:
- Commit secrets to Git
- Use `NEXT_PUBLIC_*` for API keys or secrets
- Inject sensitive values via build scripts or snippet injection

**Example Setup**:

```bash
# Local development (.env.local - NOT committed)
AIRTABLE_API_KEY=patXYZ123...
AIRTABLE_BASE_ID=appABC456...
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcPublic...
RECAPTCHA_SECRET_KEY=6LcSecret...

# Netlify UI (for production)
# Same variables, but set via:
# Settings → Environment Variables → Add Variables
```

**Rebuild After Changes**:
- Environment variable changes require **rebuild + redeploy**
- Trigger: Deploys → Trigger deploy → Clear cache and redeploy

---

## 6. Edge Functions vs Serverless Functions

### Netlify Edge Functions

**Characteristics**:
- **Runtime**: Deno-based (TypeScript/JavaScript)
- **Execution**: CDN edge locations (closest to user)
- **Latency**: <50ms (ultra-low latency)
- **Timeout**: 50ms max execution time
- **Use Cases**: Middleware, A/B testing, auth checks, redirects, localization

**Next.js Integration**:
- **Next.js Middleware** → Automatically deployed as Edge Functions
- Runs before request reaches origin server
- Can modify requests/responses, rewrite URLs, set headers

**Example Next.js Middleware**:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // A/B testing redirect
  const bucket = Math.random() < 0.5 ? 'variant-a' : 'variant-b'

  if (request.nextUrl.pathname === '/landing') {
    return NextResponse.rewrite(new URL(`/landing-${bucket}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/landing',
}
```

**Pricing**: Free on all Netlify plans (Starter, Pro, Business, Enterprise)

### Netlify Functions (Serverless Functions)

**Characteristics**:
- **Runtime**: Node.js 20 (AWS Lambda under the hood)
- **Execution**: Regional data centers
- **Latency**: ~100-500ms (depends on region)
- **Timeout**: 10s (default), up to 26s (configurable)
- **Use Cases**: API routes, SSR pages, database queries, third-party API calls

**Next.js Integration**:
- **Next.js API Routes** (`app/api/*`) → Netlify Functions
- **Server Components** → Netlify Functions
- **Server Actions** → Netlify Functions

**Pricing**: Included in Netlify plans (125k requests/month on Starter)

### When to Use Each

| Feature | Edge Functions | Serverless Functions |
|---------|----------------|---------------------|
| **Next.js Middleware** | ✅ Default | ❌ Not applicable |
| **API Routes** | ✅ Supported | ✅ Default |
| **SSR Pages** | ❌ Too slow | ✅ Default |
| **A/B Testing** | ✅ Ideal | ❌ Slower |
| **Auth Checks** | ✅ Fast | ⚠️ Acceptable |
| **Database Queries** | ❌ Timeout risk | ✅ Ideal |
| **Heavy Computation** | ❌ 50ms limit | ✅ Up to 26s |

**Recommendation**:
- Use **Edge Functions** for middleware (automatic with Next.js)
- Use **Serverless Functions** for API routes and SSR (default)
- Don't overthink it - Netlify handles routing automatically

---

## 7. Common Deployment Issues & Solutions

### Issue 1: Unresolved Module Paths (Next.js 15)

**Symptom**:
- Build works locally but fails on Netlify
- Error: "Cannot find module..." or "Module not found"

**Causes**:
- Multiple lock files (e.g., `package-lock.json` + `pnpm-lock.yaml`)
- TypeScript path aliases not resolved

**Solutions**:
```bash
# Remove conflicting lock files
rm package-lock.json  # Keep only one

# Ensure tsconfig.json paths are configured
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./packages/shared/*"]
    }
  }
}

# Update next.config.js if using monorepo
const nextConfig = {
  transpilePackages: ['@shared'],
}
```

### Issue 2: Function Bundle Size Exceeds 250 MB

**Symptom**:
- Error: "Function bundle size exceeds limit"

**Causes**:
- Large dependencies (electron, chromium, puppeteer)
- Too many pre-rendered pages

**Solutions**:

```toml
# netlify.toml - Exclude heavy dependencies
[functions]
  excluded_node_modules = ["electron", "chromium"]

# Use ISR instead of SSG for large datasets
# app/products/[id]/page.tsx
export async function generateStaticParams() {
  return [] // Don't pre-render any pages
}

export const dynamic = 'force-dynamic'
// OR
export const revalidate = 3600 // ISR with 1-hour cache
```

### Issue 3: 404 Errors on App Router Pages

**Symptom**:
- Index page loads, but dynamic routes return 404
- Build succeeds but routes don't work

**Causes**:
- i18n config conflicts with App Router
- Incorrect publish directory
- Runtime version incompatibility

**Solutions**:

```javascript
// next.config.js - Remove i18n for App Router
const nextConfig = {
  // ❌ Remove this for App Router
  // i18n: {
  //   locales: ['en', 'fr'],
  //   defaultLocale: 'en',
  // },
}

// ✅ Use App Router i18n instead
// app/[locale]/layout.tsx
```

```toml
# netlify.toml - Verify publish directory
[build]
  publish = ".next"  # Correct for Next.js
  # NOT: publish = "."
```

**Clear cache and redeploy**:
- Netlify Dashboard → Deploys → Trigger deploy → Clear cache and redeploy

### Issue 4: Environment Variables Not Available

**Symptom**:
- `process.env.VARIABLE_NAME` is `undefined` in API routes or SSR pages

**Causes**:
- Variables not scoped to **Functions**
- `.env` files not imported to Netlify
- Trying to access server-side vars on client

**Solutions**:

1. **Set scope in Netlify UI**:
   - Environment Variables → Edit → Scopes: **Builds** + **Functions**

2. **Import .env to Netlify**:
   ```bash
   netlify env:import .env
   ```

3. **Verify access pattern**:
   ```typescript
   // ✅ Server Component or API Route
   export default async function Page() {
     const apiKey = process.env.AIRTABLE_API_KEY // Works
   }

   // ❌ Client Component
   'use client'
   export default function Page() {
     const apiKey = process.env.AIRTABLE_API_KEY // undefined
     // Use NEXT_PUBLIC_* instead
   }
   ```

4. **Rebuild after setting variables**:
   - Trigger new deploy after adding/changing environment variables

### Issue 5: Build Warnings Treated as Errors

**Symptom**:
- Build fails with "Treating warnings as errors"

**Cause**:
- Netlify CI mode treats warnings as errors by default

**Solution**:

```toml
# netlify.toml
[build.environment]
  CI = "false"  # Don't treat warnings as errors
```

**Better approach**: Fix warnings instead of suppressing them

### Issue 6: Peer Dependency Conflicts

**Symptom**:
- "Could not resolve dependency" during npm install

**Causes**:
- npm 8.6.0-8.12.1 behavior with React 17+ on Node 16.5.1+

**Solutions**:

```toml
# netlify.toml
[build.environment]
  NPM_FLAGS = "--legacy-peer-deps"
  # OR
  NPM_FLAGS = "--force"
```

**Better approach**: Update dependencies to compatible versions

### Issue 7: Case-Sensitive File System Errors

**Symptom**:
- Build works on Windows/macOS but fails on Netlify

**Cause**:
- Netlify uses case-sensitive Linux file system
- Local dev uses case-insensitive file system

**Solution**:

```typescript
// ❌ Import doesn't match file name
import Button from './button'  // File: Button.tsx

// ✅ Match exact case
import Button from './Button'  // File: Button.tsx
```

**Prevention**: Use consistent naming conventions (PascalCase for components)

---

## 8. Troubleshooting Checklist

### Pre-Deployment Checklist

- [ ] Build works locally: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Environment variables documented (which are needed)
- [ ] `.env.local` added to `.gitignore`
- [ ] Dependencies up to date (Next.js 15.5+)
- [ ] Single package manager (one lock file)

### Post-Deployment Checklist

- [ ] Build succeeded in Netlify logs
- [ ] Environment variables set with correct scopes
- [ ] Functions appear in Netlify UI (Functions tab)
- [ ] Routes accessible (test all pages)
- [ ] API routes working (test with curl/Postman)
- [ ] Images optimized via Netlify Image CDN

### Debug Steps

1. **Check Build Logs**:
   - Netlify Dashboard → Deploys → Latest Deploy → View Logs
   - Look for errors in "Building Next.js app" phase

2. **Verify Function Logs**:
   - Netlify Dashboard → Functions → Select function → Logs
   - Check for runtime errors

3. **Test Locally with Netlify Dev**:
   ```bash
   netlify dev
   # Simulates Netlify environment locally
   ```

4. **Clear Build Cache**:
   - Deploys → Trigger deploy → Clear cache and redeploy
   - Fixes cached dependency issues

5. **Check Runtime Version**:
   ```toml
   # netlify.toml
   [build.environment]
     NODE_VERSION = "20"
   ```

6. **Enable Debug Logging**:
   ```toml
   [build.environment]
     NEXT_DEBUG = "1"
   ```

---

## 9. Performance Optimization

### Next.js Image Optimization

**Automatic Netlify Image CDN Integration**:

```typescript
// app/page.tsx
import Image from 'next/image'

export default function HomePage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority  // Preload critical images
    />
  )
}
```

**What Happens**:
- Next.js Image component → Netlify Image CDN
- Automatic WebP conversion
- Responsive image sizes
- Lazy loading (except `priority` images)
- No additional configuration needed

### Caching Strategy

**Static Pages** (App Router):
```typescript
// app/about/page.tsx
// Cached indefinitely at CDN edge
export default function AboutPage() {
  return <div>Static content</div>
}
```

**ISR Pages** (Incremental Static Regeneration):
```typescript
// app/products/page.tsx
export const revalidate = 3600  // Revalidate every hour

export default async function ProductsPage() {
  const products = await fetchProducts()
  return <ProductList products={products} />
}
```

**On-Demand Revalidation**:
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { path, tag } = await request.json()

  if (path) {
    revalidatePath(path)
  }

  if (tag) {
    revalidateTag(tag)
  }

  return NextResponse.json({ revalidated: true })
}
```

### Build Performance

**Turbopack** (Next.js 15.5):
```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build"
  }
}
```

**Note**: Turbopack dev server is stable, but production builds still use Webpack (as of Next.js 15.5)

---

## 10. Production Deployment Workflow

### Recommended Git Workflow

```bash
# 1. Develop locally
git checkout -b feature/new-landing-page
npm run dev

# 2. Test build locally
npm run build
npm start

# 3. Commit and push
git add .
git commit -m "feat: add new landing page"
git push origin feature/new-landing-page

# 4. Create PR → Netlify creates preview deployment
# URL: https://deploy-preview-123--yoursite.netlify.app

# 5. Review preview deployment, merge PR

# 6. Netlify auto-deploys to production
# URL: https://yoursite.netlify.app
```

### Environment-Specific Variables

**Branch Deploys**:
- Production (main branch): Use production env vars
- Preview deploys (PRs): Use staging env vars

**Configure in Netlify UI**:
- Settings → Environment Variables → Add scoped variables
- Scopes: Production, Deploy Previews, Branch deploys

### Rollback Strategy

**Instant Rollback**:
1. Netlify Dashboard → Deploys
2. Find previous successful deploy
3. Click "Publish deploy"
4. Site reverts instantly (no rebuild)

**Git Rollback**:
```bash
git revert <commit-hash>
git push origin main
# Triggers new deployment with reverted changes
```

---

## 11. Key Resources

### Official Documentation
- **Netlify Next.js Docs**: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- **Next.js Deployment Docs**: https://nextjs.org/docs/app/getting-started/deploying
- **Netlify Next.js Blog (15 Support)**: https://www.netlify.com/blog/deploy-nextjs-15/
- **Next.js 15.5 Release Notes**: https://nextjs.org/blog/next-15-5

### Community Resources
- **Netlify Support Forums**: https://answers.netlify.com/
- **Next.js Discord**: https://nextjs.org/discord
- **OpenNext GitHub**: https://github.com/opennextjs/opennextjs-netlify

### Tools
- **Netlify CLI**: https://docs.netlify.com/cli/get-started/
- **Next.js CLI**: `npx create-next-app@latest`

---

## 12. Confidence & Evidence

### Source Credibility

| Source | Type | Credibility | Date |
|--------|------|-------------|------|
| Netlify Official Docs | Documentation | ⭐⭐⭐⭐⭐ (Tier 1) | Current (2025) |
| Netlify Blog (Next.js 15) | Official Blog | ⭐⭐⭐⭐⭐ (Tier 1) | Recent (2024-2025) |
| Next.js Official Docs | Documentation | ⭐⭐⭐⭐⭐ (Tier 1) | Current (2025) |
| Stack Overflow | Community | ⭐⭐⭐ (Tier 3) | Varied |
| Netlify Support Forums | Community | ⭐⭐⭐⭐ (Tier 2) | Recent |

### Confidence Assessment

**Overall Confidence**: 9/10 (High)

**High Confidence Areas** (9-10/10):
- ✅ Basic deployment process (official docs)
- ✅ Environment variable configuration (official docs)
- ✅ App Router support (official confirmation)
- ✅ Serverless functions integration (official docs)
- ✅ Image optimization (official docs)

**Medium Confidence Areas** (7-8/10):
- ⚠️ Next.js 15.5 specific quirks (limited production reports)
- ⚠️ Edge Functions performance characteristics (limited benchmarks)
- ⚠️ Large-scale deployment edge cases (community-reported)

**Lower Confidence Areas** (5-6/10):
- ⚠️ Turbopack production builds (still experimental in 15.5)
- ⚠️ Advanced middleware patterns (limited documentation)

### Evidence Gaps

**Areas Requiring Additional Investigation**:
1. Performance benchmarks for Edge vs Serverless Functions
2. Next.js 15.5 Turbopack production build stability
3. Large monorepo deployment patterns
4. Advanced ISR patterns with Netlify caching

---

## 13. Conclusion

Netlify provides **excellent support** for Next.js 15.5 with minimal configuration required. The platform's OpenNext adapter automatically handles:

- App Router with Server Components
- API routes → Serverless Functions
- Middleware → Edge Functions
- ISR with on-demand revalidation
- Image optimization via Netlify Image CDN

**For your landing pages automation project**:

✅ **Recommended**: Git-based deployment with zero configuration
✅ **Environment Variables**: Set via Netlify UI with Functions + Builds scopes
✅ **API Routes**: Use Next.js API routes (auto-converted to Netlify Functions)
✅ **Build Config**: No `netlify.toml` needed for standard setup
✅ **Caching**: Use ISR with `revalidate` for content freshness

**Next Steps**:
1. Connect Git repository to Netlify
2. Set environment variables (Airtable, reCAPTCHA keys)
3. Deploy and test preview deployment
4. Configure custom domain (if needed)
5. Monitor function logs and performance

---

**Research Completed**: October 7, 2025
**Document Version**: 1.0
