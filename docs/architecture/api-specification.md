# API Specification

**API Style**: REST (HTTP/JSON)

Netlify serverless functions handle form submissions, webhook receivers, and validation endpoints.

## Endpoints

### POST /api/submit-form

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

### POST /api/validate-recaptcha

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

### POST /api/webhook/make-com

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

### POST /api/webhook/netlify-deploy

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

## Security

- **reCAPTCHA validation**: Always server-side, token never trusted from client
- **Webhook signatures**: HMAC authentication for webhook endpoints
- **Rate limiting**: Netlify edge enforces 5 req/sec default
- **CORS**: Configured to allow only approved domains
- **Duplicate detection**: 5-minute window on email+phone prevents spam

---
