# Database Schema

This section defines the complete Airtable database schema with all tables, fields, formulas, and relationships.

## Airtable Base Structure

**Base Name**: Landing Pages Automation
**Tables**: 5 tables (Landing Pages, Form Submissions, Templates, TCPA Rules, Form Sessions)

---

## Table 1: Landing Pages

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

## Table 2: Form Submissions

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

## Table 3: Templates

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

## Table 4: TCPA Rules

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

## Table 5: Form Sessions

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

## Table 6: Offers (Phase 2 - Future Enhancement)

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

## Relationships

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

## Views (Airtable)

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

## Airtable Automation (Native)

**Automation 1: Status Change Notification**
- Trigger: When status changes to "Generated"
- Action: Send email to approver with review link

**Automation 2: Error Notification**
- Trigger: When error_message is not empty
- Action: Send email to admin with error details

**Note**: Primary automation is handled by Make.com, these are supplementary notifications.

---
