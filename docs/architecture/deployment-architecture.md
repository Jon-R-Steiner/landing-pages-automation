# Deployment Architecture

## Netlify Configuration

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

## Deployment Environments

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

## Netlify Deployment Workflow
1. Push to `main` branch
2. Netlify detects change via webhook
3. Runs `npm run build` command
4. Deploys to production URL
5. Invalidates CDN cache
6. Sends deploy notification

---

## Deployment Process

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

## Environment Variable Management

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

## Build Performance

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

## Deployment Checklist

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
