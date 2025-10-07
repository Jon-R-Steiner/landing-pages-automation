# External APIs

This section documents all external API integrations required for the Landing Pages Automation system.

## Airtable REST API

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

## Make.com API

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

## Automation Approach: Make.com vs Airtable Native

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

## Netlify API

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

## Google reCAPTCHA v3 API

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

## Google Tag Manager API

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

## Claude API (Anthropic)

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

## API Integration Summary

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
