# Make.com Scenario Setup Guide

This guide explains how to set up Make.com scenarios for automated landing page content generation.

## Prerequisites

- Make.com account (Free or paid plan)
- API Token: Your Make.com API key
- Claude API Key: Your Anthropic API key
- Airtable credentials already configured

## Scenario 1: New Lead → Content Generation

**Purpose**: When a new lead is submitted to Airtable, automatically generate landing page content

### Modules Setup

1. **Trigger: Airtable - Watch Records**
   - Base: `appuQovLbKR3llD82`
   - Table: `tbl7V4S7GZ25PXLo9`
   - Trigger field: `Status`
   - Trigger value: `Pending`

2. **HTTP: Make an API Request to Claude**
   - URL: `https://api.anthropic.com/v1/messages`
   - Method: `POST`
   - Headers:
     ```
     x-api-key: YOUR_CLAUDE_API_KEY
     anthropic-version: 2023-06-01
     Content-Type: application/json
     ```
   - Body:
     ```json
     {
       "model": "claude-3-5-sonnet-20241022",
       "max_tokens": 4096,
       "temperature": 0.7,
       "messages": [
         {
           "role": "user",
           "content": "{{prompt from Airtable or generated}}"
         }
       ]
     }
     ```

3. **Airtable: Update Record**
   - Record ID: `{{1.id}}` (from trigger)
   - Fields:
     - Status: `Generated`
     - Generated Content: `{{2.content[0].text}}`
     - Generated Date: `{{now}}`

4. **Router: Split Flow**
   - Path A: Create new landing page
   - Path B: Send notification email

### Webhook Alternative

Instead of watching Airtable, you can use a webhook trigger:

1. **Trigger: Webhooks - Custom Webhook**
   - Create webhook and copy URL
   - Use this URL in the `generate-content` Netlify Function

2. **Parse JSON**
   - Parse incoming webhook data

3. **Continue with HTTP request to Claude (step 2 above)**

## Scenario 2: Scheduled Content Generation

**Purpose**: Generate content for pending landing pages on a schedule

### Modules Setup

1. **Trigger: Schedule**
   - Frequency: Every 1 hour (or as needed)

2. **Airtable: Search Records**
   - Base: `appuQovLbKR3llD82`
   - Table: `tbl7V4S7GZ25PXLo9`
   - Filter: `AND({Status} = 'Pending', {Generated Content} = BLANK())`
   - Max results: 10

3. **Iterator**
   - Array: `{{2.array}}`

4. **HTTP: Claude API Request**
   - (Same as Scenario 1, step 2)

5. **Airtable: Update Record**
   - (Same as Scenario 1, step 3)

## Scenario 3: Deployment Trigger

**Purpose**: When content is approved, trigger Netlify deployment

### Modules Setup

1. **Trigger: Airtable - Watch Records**
   - Table: `tbl7V4S7GZ25PXLo9`
   - Trigger field: `Status`
   - Trigger value: `Approved`

2. **HTTP: Trigger Netlify Build Hook**
   - URL: Your Netlify build hook URL (get from Netlify site settings)
   - Method: `POST`
   - Body: `{}`

3. **Airtable: Update Record**
   - Record ID: `{{1.id}}`
   - Fields:
     - Status: `Published`
     - Published Date: `{{now}}`

## Environment Variables for Netlify

Add these to your Netlify site:

```bash
MAKE_API_KEY=your_make_api_key
CLAUDE_API_KEY=your_claude_api_key
AIRTABLE_API_KEY=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_airtable_base_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=(optional - for backend verification)
NEXT_PUBLIC_GTM_CONTAINER_ID=(optional - when GTM is configured)
```

## Testing the Integration

### Test Direct Claude API Call

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "pageType": "walk-in-shower",
    "location": "phoenix",
    "targetKeywords": ["walk-in shower installation", "Phoenix bathroom remodeling"]
  }'
```

### Test Make.com Webhook

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "pageType": "walk-in-shower",
    "location": "phoenix",
    "useMake": true,
    "makeWebhookUrl": "https://hook.us1.make.com/YOUR_WEBHOOK_ID"
  }'
```

## Cost Estimates

### Claude API
- Model: Claude 3.5 Sonnet
- Input: ~500 tokens per request
- Output: ~2000 tokens per response
- Cost per page: ~$0.03-$0.05
- $200/month limit = ~4,000-6,000 pages

### Make.com
- Free tier: 1,000 operations/month
- Paid plans: Start at $9/month for 10,000 operations
- Each content generation = 3-5 operations

## Troubleshooting

### Claude API Errors
- **401 Unauthorized**: Check API key is correct
- **429 Rate Limit**: Reduce request frequency or upgrade plan
- **400 Bad Request**: Verify JSON format in prompt

### Make.com Errors
- **Webhook not triggering**: Check webhook URL is correct
- **Module failures**: Review execution logs in Make.com
- **API key issues**: Verify token has correct scopes

### Airtable Errors
- **Record not found**: Check base ID and table ID
- **Permission denied**: Verify API key has write access
- **Field mismatch**: Ensure field names match exactly

## Recommended Workflow

1. **Manual Generation** (for testing):
   - Call `generate-content` Netlify Function directly
   - Review generated content in response
   - Manually create Airtable records if satisfied

2. **Semi-Automated** (recommended):
   - New lead triggers Make.com scenario
   - Content generated and saved to Airtable
   - Manual review and approval before publishing
   - Approved content triggers deployment

3. **Fully Automated** (advanced):
   - New lead → auto-generate content
   - Content quality checks via additional Claude calls
   - Auto-approve if quality score > threshold
   - Auto-deploy to Netlify

## Next Steps

1. Create Make.com account and scenarios
2. Configure webhooks in Make.com
3. Add webhook URLs to Netlify Functions
4. Test end-to-end flow
5. Monitor and optimize based on results
