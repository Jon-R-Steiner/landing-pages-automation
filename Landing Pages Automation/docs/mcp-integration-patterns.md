# MCP Integration Patterns for Phase 1 Development

## Purpose

This document provides comprehensive integration patterns for the three primary third-party services used in the Landing Page Automation project: **Airtable**, **Make.com**, and **Netlify**. These patterns are based on MCP research findings and serve as the primary reference for Phase 1 dev-agent implementation.

**Target Audience:** Phase 1 dev-agent (autonomous development agent)
**Document Version:** 1.0
**Last Updated:** 2025-10-07

## Overview

### Integration Strategy

**Primary Approach:** Use official MCP servers where available for AI-native integration
**Fallback Strategy:** HTTP/REST API or CLI alternatives when MCP unavailable

### Service Status Summary

| Service | MCP Available | Status | Primary Method | Fallback Method |
|---------|---------------|--------|----------------|-----------------|
| **Airtable** | ✅ Yes (Community) | Multiple implementations | MCP Server | REST API |
| **Make.com** | ✅ Yes (Official) | Production-ready | MCP Server | REST API / Webhooks |
| **Netlify** | ✅ Yes (Official) | Production-ready | MCP Server | REST API / CLI |

---

## 1. Airtable Integration Patterns

### 1.1 MCP Server Overview

**Status:** ✅ Community MCP Servers Available

**Recommended Implementation:** `domdomegg/airtable-mcp-server`
- **Repository:** https://github.com/domdomegg/airtable-mcp-server
- **Features:** Read and write access, schema inspection, record CRUD operations
- **Installation:** `npx -y airtable-mcp-server`

**Alternative:** `felores/airtable-mcp`
- **Repository:** https://github.com/felores/airtable-mcp
- **Features:** Comprehensive base/table/field/record management, staged table building
- **Strengths:** Specialized implementation leveraging Claude's agentic capabilities

### 1.2 Authentication

**Method:** Personal Access Token (recommended as of Feb 2024)

**Deprecated:** API Keys (fully deprecated February 2024)

**Setup Process:**
1. Navigate to Airtable Account Settings → Developer Hub
2. Create Personal Access Token
3. Configure token scopes:
   - `data.records:read` - Read records
   - `data.records:write` - Create/update records
   - `schema.bases:read` - Read base schema
4. Limit token to specific bases for security
5. Store token securely in environment variables

**Authentication Header Format:**
```
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

**Environment Variable:**
```bash
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX  # Personal Access Token format
```

### 1.3 MCP Server Configuration

**Claude Desktop Configuration:**
```json
{
  "mcpServers": {
    "airtable": {
      "command": "npx",
      "args": ["-y", "airtable-mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "${AIRTABLE_API_KEY}"
      }
    }
  }
}
```

### 1.4 Common Operations (MCP)

#### 1.4.1 Read Records (Query)

**Agent Prompt:**
```
"Query the Form Submissions base for all records submitted in the last 24 hours"
```

**MCP Workflow:**
Agent invokes Airtable MCP → Server queries base → Returns structured records

**Expected Response Structure:**
```json
{
  "records": [
    {
      "id": "rec123abc",
      "fields": {
        "Email": "user@example.com",
        "Name": "John Doe",
        "Submitted At": "2025-10-07T14:00:00.000Z"
      },
      "createdTime": "2025-10-07T14:00:00.000Z"
    }
  ]
}
```

#### 1.4.2 Create Record

**Agent Prompt:**
```
"Create a new form submission record in Airtable with email 'test@example.com' and name 'Test User'"
```

**MCP Workflow:**
Agent invokes Airtable MCP → Server creates record → Returns created record ID

#### 1.4.3 Update Record

**Agent Prompt:**
```
"Update record rec123abc in Form Submissions to mark status as 'Processed'"
```

**MCP Workflow:**
Agent invokes Airtable MCP → Server updates record → Confirms update

#### 1.4.4 Duplicate Detection (5-Minute Window)

**Agent Prompt:**
```
"Check if an email 'user@example.com' was submitted to Form Submissions in the last 5 minutes before creating new record"
```

**MCP Workflow:**
1. Agent invokes Airtable MCP: Query recent records (last 5 min)
2. Filter by email field
3. If match found: Return existing record, skip creation
4. If no match: Create new record

### 1.5 REST API Fallback

**Base URL:** `https://api.airtable.com/v0/{baseId}/{tableName}`
**Documentation:** https://airtable.com/developers/web/api/introduction

#### 1.5.1 List Records

**Method:** GET
**Endpoint:** `/v0/{baseId}/{tableName}`

```bash
curl "https://api.airtable.com/v0/appXXXXXXX/Form%20Submissions" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `filterByFormula`: Airtable formula for filtering (e.g., `{Email}='user@example.com'`)
- `maxRecords`: Limit results (e.g., `100`)
- `sort[0][field]`: Sort field (e.g., `Submitted At`)
- `sort[0][direction]`: Sort direction (`asc` or `desc`)

**Example with Filter:**
```bash
curl "https://api.airtable.com/v0/appXXXXXXX/Form%20Submissions?filterByFormula={Email}='user@example.com'" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 1.5.2 Create Record

**Method:** POST
**Endpoint:** `/v0/{baseId}/{tableName}`

```bash
curl -X POST "https://api.airtable.com/v0/appXXXXXXX/Form%20Submissions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "Email": "test@example.com",
      "Name": "Test User",
      "Submitted At": "2025-10-07T14:00:00.000Z"
    }
  }'
```

#### 1.5.3 Update Record

**Method:** PATCH (partial update) or PUT (full replace)**
**Endpoint:** `/v0/{baseId}/{tableName}/{recordId}`

```bash
# PATCH - Updates only specified fields
curl -X PATCH "https://api.airtable.com/v0/appXXXXXXX/Form%20Submissions/rec123abc" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "Status": "Processed"
    }
  }'
```

**PATCH vs PUT:**
- **PATCH:** Keeps fields not provided in request (recommended for partial updates)
- **PUT:** Replaces all data, clears fields not provided (use with caution)

#### 1.5.4 Delete Record

**Method:** DELETE
**Endpoint:** `/v0/{baseId}/{tableName}/{recordId}`

```bash
curl -X DELETE "https://api.airtable.com/v0/appXXXXXXX/Form%20Submissions/rec123abc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 1.6 Error Handling

**Common Errors:**

| Status Code | Error | Handling Strategy |
|-------------|-------|-------------------|
| 401 | `UNAUTHORIZED` | Check token validity, regenerate if expired |
| 403 | `FORBIDDEN` | Verify token scopes include required permissions |
| 404 | `NOT_FOUND` | Check base ID, table name, record ID spelling |
| 422 | `INVALID_REQUEST` | Validate field names and data types against schema |
| 429 | `RATE_LIMIT_EXCEEDED` | Implement exponential backoff, retry after delay |
| 503 | `SERVICE_UNAVAILABLE` | Temporary outage, retry with exponential backoff |

**Error Handling Pattern:**
```javascript
try {
  // Airtable operation
} catch (error) {
  if (error.statusCode === 429) {
    // Rate limit - wait and retry
    await sleep(error.retryAfter || 30000);
    return retryOperation();
  } else if (error.statusCode === 503) {
    // Service unavailable - exponential backoff
    return retryWithBackoff(operation, maxRetries=3);
  } else if (error.statusCode === 422) {
    // Invalid request - log details and fail gracefully
    console.error('Invalid Airtable request:', error.message);
    throw new Error('Data validation failed');
  } else {
    // Other errors - log and propagate
    console.error('Airtable error:', error);
    throw error;
  }
}
```

### 1.7 Rate Limiting

**Airtable Rate Limits:**
- **API Requests:** 5 requests per second per base
- **Burst Allowance:** Short bursts above limit tolerated
- **Recommendation:** Batch operations when possible, implement request queuing

**Rate Limit Management:**
```javascript
// Request queue implementation
const requestQueue = [];
const REQUESTS_PER_SECOND = 4; // Buffer below limit
const REQUEST_INTERVAL = 1000 / REQUESTS_PER_SECOND;

async function queuedAirtableRequest(operation) {
  requestQueue.push(operation);
  return processQueue();
}

async function processQueue() {
  const operation = requestQueue.shift();
  if (!operation) return;

  const result = await operation();
  await sleep(REQUEST_INTERVAL);

  if (requestQueue.length > 0) {
    processQueue(); // Continue processing
  }

  return result;
}
```

### 1.8 Best Practices

1. **Use Personal Access Tokens** with minimal required scopes
2. **Limit tokens to specific bases** for security
3. **Implement duplicate detection** using filterByFormula before creating records
4. **Batch operations** where possible to reduce API calls
5. **Cache base schemas** to avoid repeated schema queries
6. **Use PATCH for updates** to preserve unmodified fields
7. **Implement exponential backoff** for rate limit and service errors
8. **Log all operations** for debugging and audit trails

---

## 2. Make.com Integration Patterns

### 2.1 MCP Server Overview

**Status:** ✅ Official Make.com MCP Server Available

**Details:**
- **Repository:** https://github.com/integromat/make-mcp-server
- **Documentation:** https://developers.make.com/mcp-server
- **Type:** Cloud-based (no local installation required)
- **Protocol:** Server-Sent Events (SSE) and Streamable HTTP
- **Installation:** `npx -y @integromat/mcp-server` (for local testing)

**Key Capabilities:**
- Automatic scenario discovery for AI agents
- Scenario execution with parameter parsing
- Structured JSON output via scenario outputs feature
- Native Anthropic Claude integration (3.7 Sonnet, 3.5 Haiku, 3 Opus)
- 3,000+ app integrations

### 2.2 Authentication

**Method:** MCP Token (generated in Make.com user profile)

**Setup Process:**
1. Log in to Make.com account (make.com)
2. Navigate to User Profile → API/MCP Access section
3. Click "Add MCP Token"
4. Copy token URL provided (format: `https://mcp.make.com/{token}`)
5. Configure AI agent with token URL
6. Agent automatically discovers available scenarios

**Environment Variable:**
```bash
MAKE_MCP_TOKEN_URL=https://mcp.make.com/your-token-here
```

**Security Notes:**
- MCP token grants access to execute scenarios marked "on demand"
- Scenarios must be explicitly set to "active" and "on demand" mode
- Token rotation recommended quarterly
- Use team-level tokens for collaborative projects

### 2.3 MCP Server Configuration

**Claude Desktop Configuration:**
```json
{
  "mcpServers": {
    "make": {
      "url": "https://mcp.make.com/your-token-url",
      "type": "sse"
    }
  }
}
```

**Scenario Requirements:**
1. Scenario status: **Active**
2. Execution mode: **On Demand** (MCP-triggered)
3. Scenario outputs: Defined for structured JSON responses

### 2.4 Common Operations (MCP)

#### 2.4.1 Content Generation Scenario

**Make.com Scenario Setup:**
```yaml
Scenario Name: "Generate Landing Page Content"
Trigger: On Demand (MCP)
Modules:
  1. Input Parser
     Parameters:
       - industry: text
       - target_audience: text
       - content_type: text

  2. Anthropic Claude Module
     Model: Claude 3.7 Sonnet
     System Prompt: "Generate landing page content based on inputs"
     Input: {{1.industry}}, {{1.target_audience}}, {{1.content_type}}

  3. Scenario Output
     Output Structure:
       headline: {{2.headline}}
       description: {{2.description}}
       keywords: {{2.keywords}}
       status: "success"
```

**Agent Prompt:**
```
"Generate landing page content for the real estate industry targeting first-time home buyers using Make.com scenario"
```

**MCP Workflow:**
1. Agent invokes Make MCP: "Generate Landing Page Content" tool discovered
2. Agent provides parameters: `{industry: "real estate", target_audience: "first-time home buyers", content_type: "landing page"}`
3. Make MCP triggers scenario execution
4. Scenario runs Claude module for content generation
5. Scenario returns structured JSON output
6. Agent receives generated content

**Expected Response:**
```json
{
  "headline": "Find Your Dream Home Today",
  "description": "Expert guidance for first-time buyers with personalized support...",
  "keywords": ["first home", "mortgage help", "buyer guide", "real estate"],
  "status": "success"
}
```

#### 2.4.2 Netlify Deployment Trigger Scenario

**Make.com Scenario Setup:**
```yaml
Scenario Name: "Trigger Netlify Deploy"
Trigger: On Demand (MCP)
Modules:
  1. Input Parser
     Parameters:
       - site_id: text
       - branch: text (default: main)

  2. HTTP Module - Netlify Build Hook
     Method: POST
     URL: https://api.netlify.com/build_hooks/{hook_id}
     Body: { "trigger_branch": "{{1.branch}}" }

  3. HTTP Module - Check Deploy Status
     Method: GET
     URL: https://api.netlify.com/api/v1/sites/{{1.site_id}}/deploys
     Headers: Authorization: Bearer {{env.NETLIFY_TOKEN}}

  4. Scenario Output
     Output Structure:
       deploy_id: {{3.id}}
       status: {{3.state}}
       deploy_url: {{3.deploy_url}}
```

**Agent Prompt:**
```
"Trigger Netlify deployment for site 'my-landing-page' on the production branch using Make.com"
```

**MCP Workflow:**
1. Agent invokes Make MCP: "Trigger Netlify Deploy"
2. Provides parameters: `{site_id: "my-landing-page", branch: "main"}`
3. Make scenario triggers Netlify build hook
4. Make scenario polls deployment status
5. Returns deployment information

**Expected Response:**
```json
{
  "deploy_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "status": "building",
  "deploy_url": "https://deploy-id--my-landing-page.netlify.app"
}
```

#### 2.4.3 Content Validation Scenario

**Make.com Scenario Setup:**
```yaml
Scenario Name: "Validate Content Quality"
Trigger: On Demand (MCP)
Modules:
  1. Input Parser
     Parameters:
       - content: text
       - validation_rules: array

  2. Anthropic Claude Module - Validation
     Model: Claude 3.7 Sonnet
     System Prompt: "Validate content against rules: {{1.validation_rules}}"
     Input: {{1.content}}

  3. Router (Conditional)
     Route 1: Validation passed → Set status "approved"
     Route 2: Validation failed → Set status "review_required"

  4. Scenario Output
     Output Structure:
       validation_passed: {{validation_result}}
       issues: {{issues_array}}
       suggestions: {{suggestions_array}}
       confidence_score: {{confidence}}
```

**Agent Prompt:**
```
"Validate the generated landing page content for brand consistency and SEO optimization using Make.com"
```

### 2.5 HTTP/REST API Fallback

**Base URL:** `https://www.make.com/api/v2`
**Documentation:** https://developers.make.com/api-documentation

**Note:** Make.com MCP Server is recommended primary method. REST API serves as fallback when MCP unavailable.

#### 2.5.1 Execute Scenario via Webhook

**Method:** POST
**Endpoint:** Scenario-specific webhook URL (on-demand scenarios)

```bash
curl -X POST \
  "https://hook.eu2.make.com/your-webhook-id" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "real estate",
    "target_audience": "first-time buyers",
    "content_type": "landing page"
  }'
```

**Setup Webhook in Make.com:**
1. Add "Webhook" module to scenario as trigger
2. Set webhook to "Custom" with JSON body
3. Configure "Respond to webhook" module for synchronous response
4. Copy webhook URL for API calls

**Response Handling:**
- Webhooks can return synchronous responses via "Respond to webhook" module
- Use scenario outputs to structure webhook responses
- Timeout: 40 seconds maximum execution time

#### 2.5.2 List Scenarios (API Token Required)

**Method:** GET
**Endpoint:** `/api/v2/scenarios?teamId={teamId}`

```bash
curl -H "Authorization: Token YOUR_API_TOKEN" \
     "https://eu2.make.com/api/v2/scenarios?teamId=12345"
```

**Response:**
```json
[
  {
    "id": 123456,
    "name": "Generate Landing Page Content",
    "isActive": true,
    "isLinked": true,
    "teamId": 12345
  }
]
```

### 2.6 Error Handling

**Common Errors:**

| Error | Scenario | Handling Strategy |
|-------|----------|-------------------|
| MCP Token Invalid | MCP server connection fails | Regenerate token in Make.com profile, update configuration |
| Scenario Timeout | Execution exceeds 40 seconds | Optimize scenario steps, break into smaller scenarios |
| Module Error | Specific module fails (API error, invalid data) | Add error handlers to scenarios, implement retry logic |
| Rate Limit | Too many operations per month | Monitor usage, upgrade plan if needed, implement queuing |
| Webhook Timeout | Webhook response not received | Increase timeout, use asynchronous webhooks with status polling |

**Error Handling in Scenarios:**
1. **Error Handler Routes:** Add error handlers to each module
2. **Rollback Logic:** Implement compensating actions for failed operations
3. **Notification:** Send error notifications (email, Slack) for critical failures
4. **Logging:** Store error details in Data Store or external logging service
5. **Retry Logic:** Configure automatic retries with exponential backoff

### 2.7 Rate Limiting

**Make.com Account Limits:**
- **Operations:** Varies by plan (Free: 1,000 ops/month, Core: 10,000, Pro: 40,000)
- **Execution Time:** 40 minutes maximum per scenario run
- **Concurrent Scenarios:** Varies by plan
- **MCP Token Requests:** No documented limit (cloud-based architecture)

**Best Practices:**
- Monitor operations usage in Make.com dashboard
- Set up usage alerts at 80% threshold
- Optimize scenarios for efficiency (minimize operations)
- Use data stores to cache intermediate results
- Implement operation counting in scenarios for budget tracking

### 2.8 Best Practices

1. **Use MCP Server as Primary Method** for AI agent integration
2. **Structure Scenario Outputs** with clear JSON schemas for consistent responses
3. **Implement Error Handlers** on all modules for graceful failure handling
4. **Set Realistic Timeouts** (scenarios should complete in <5 minutes for responsiveness)
5. **Use Data Stores** for state management across scenario runs
6. **Test Scenarios Thoroughly** before setting to "on demand" for MCP access
7. **Monitor Operations Usage** to avoid exceeding plan limits
8. **Version Scenarios** by cloning before major changes (enable rollback)

---

## 3. Netlify Integration Patterns

### 3.1 MCP Server Overview

**Status:** ✅ Official Netlify MCP Server Available

**Details:**
- **Repository:** https://github.com/netlify/netlify-mcp
- **Documentation:** https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/
- **Type:** NPX-based (no local installation required)
- **Installation:** `npx -y @netlify/mcp`
- **Compatibility:** Claude Desktop, Windsurf, Cursor, VSCode Copilot

**Key Capabilities:**
- Deploy with full visibility into branches, logs, and configuration
- Create and manage Netlify projects
- Install and configure extensions (Auth0, Supabase, etc.)
- Manage environment variables and app state
- Full Netlify API and CLI access through natural language

### 3.2 Authentication

**Method:** Personal Access Token

**Setup Process:**
1. Log in to Netlify account (app.netlify.com)
2. Navigate to User Settings → Applications → Personal Access Tokens
3. Click "New access token"
4. Provide descriptive name (e.g., "MCP Server Token")
5. Generate and securely copy token
6. Configure AI agent with token (environment variable)

**Environment Variable:**
```bash
NETLIFY_AUTH_TOKEN=nfp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Security Notes:**
- Personal Access Tokens grant full account access
- Store tokens in secure environment variables (never commit to Git)
- Rotate tokens periodically (quarterly recommended)
- Use team-specific tokens for collaborative projects
- Revoke compromised tokens immediately in Netlify UI

### 3.3 MCP Server Configuration

**Claude Desktop Configuration:**
```json
{
  "mcpServers": {
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp"],
      "env": {
        "NETLIFY_AUTH_TOKEN": "${NETLIFY_AUTH_TOKEN}"
      }
    }
  }
}
```

### 3.4 Common Operations (MCP)

#### 3.4.1 Deploy Landing Page Project

**Agent Prompt:**
```
"Deploy the current landing page project to Netlify. Use the production branch and enable automatic deployments from Git."
```

**MCP Workflow:**
1. Agent analyzes project structure (detects build command, publish directory, framework)
2. Agent invokes Netlify MCP
3. MCP creates new Netlify site (if needed)
4. MCP links to Git repository
5. MCP configures build settings automatically
6. MCP triggers initial deployment
7. MCP monitors build logs
8. Returns deployment URL and status

**Expected Response:**
```
✅ Site deployed successfully!
URL: https://amazing-landing-page-abc123.netlify.app
Deploy ID: 65f1a2b3c4d5e6f7g8h9i0j1
Build time: 45 seconds
Auto-deploy: Enabled for main branch
```

#### 3.4.2 Configure Environment Variables

**Agent Prompt:**
```
"Configure environment variables for the Netlify site:
- AIRTABLE_API_KEY for production
- RECAPTCHA_SECRET_KEY for form validation
- Make them secret so they don't appear in build logs"
```

**MCP Workflow:**
1. Agent invokes Netlify MCP
2. MCP accesses environment variable management
3. MCP creates environment variables with secret flag
4. MCP confirms configuration
5. Optionally triggers redeploy to apply changes

**Expected Response:**
```
✅ Environment variables configured:
- AIRTABLE_API_KEY: ******** (secret, production context)
- RECAPTCHA_SECRET_KEY: ******** (secret, production context)

Note: Redeploy required to apply changes to live site.
Would you like me to trigger a redeploy now?
```

#### 3.4.3 Install Auth0 Extension

**Agent Prompt:**
```
"Add Auth0 authentication to my Netlify site using the default configuration"
```

**MCP Workflow:**
1. Agent invokes Netlify MCP
2. MCP accesses extension marketplace
3. MCP configures Auth0 with safe defaults
4. MCP sets up Auth0 environment variables
5. MCP configures redirect URLs
6. MCP triggers redeployment with Auth0 integration
7. Returns configuration details

**Expected Response:**
```
✅ Auth0 authentication installed!
Configuration:
- Auth0 Domain: your-tenant.us.auth0.com
- Client ID: (automatically generated)
- Redirect URIs: configured for https://your-site.netlify.app

Next steps:
1. Customize login UI in Auth0 dashboard
2. Add user roles and permissions
3. Test login flow at: https://your-site.netlify.app/login
```

#### 3.4.4 Monitor Deployment Status

**Agent Prompt:**
```
"Show me the status of the latest deployment for my landing page site"
```

**MCP Workflow:**
1. Agent invokes Netlify MCP
2. MCP queries site deployments
3. MCP retrieves latest deploy status and logs
4. Returns comprehensive deployment information

**Expected Response:**
```
📊 Latest Deployment Status

Deploy ID: 65f1a2b3c4d5e6f7g8h9i0j1
Status: ✅ Published
URL: https://my-landing-page.netlify.app
Branch: main
Commit: abc1234 - "Add new hero section"
Build Time: 1 minute 23 seconds
Published: 2 minutes ago

Build Log Summary:
✅ Dependencies installed (12s)
✅ Build command executed (45s)
✅ Deploy uploaded (8s)
✅ Post-processing complete (18s)
```

### 3.5 REST API Fallback

**Base URL:** `https://api.netlify.com/api/v1`
**Documentation:** https://docs.netlify.com/api/get-started/
**OpenAPI Spec:** https://open-api.netlify.com/

#### 3.5.1 List Sites

**Method:** GET
**Endpoint:** `/api/v1/sites`

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.netlify.com/api/v1/sites
```

**Response:**
```json
[
  {
    "id": "abc123-def456-ghi789",
    "name": "my-landing-page",
    "url": "https://my-landing-page.netlify.app",
    "admin_url": "https://app.netlify.com/sites/my-landing-page",
    "build_settings": {
      "cmd": "npm run build",
      "dir": "dist"
    },
    "published_deploy": {
      "id": "deploy-id-123",
      "state": "ready"
    }
  }
]
```

#### 3.5.2 Create Site

**Method:** POST
**Endpoint:** `/api/v1/sites`

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "new-landing-page",
    "custom_domain": "example.com"
  }' \
  https://api.netlify.com/api/v1/sites
```

#### 3.5.3 Deploy Site (Manual Deploy via ZIP)

**Method:** POST
**Endpoint:** `/api/v1/sites/{site_id}/deploys`

```bash
# Create ZIP of build directory
zip -r deploy.zip dist/

# Upload deployment
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @deploy.zip \
  https://api.netlify.com/api/v1/sites/{site_id}/deploys
```

**Response:**
```json
{
  "id": "deploy-id-123",
  "state": "processing",
  "deploy_url": "https://deploy-id-123--my-site.netlify.app",
  "deploy_ssl_url": "https://deploy-id-123--my-site.netlify.app"
}
```

#### 3.5.4 Trigger Build Hook

**Method:** POST
**Endpoint:** Build Hook URL (site-specific, created in Netlify UI)

```bash
curl -X POST "https://api.netlify.com/build_hooks/YOUR_HOOK_ID?trigger_branch=main&clear_cache=true"
```

**Query Parameters:**
- `trigger_branch`: Branch to build (optional, uses default if omitted)
- `trigger_title`: Custom build title for reference (optional)
- `clear_cache`: Set to `true` to clear cache before build (optional)

#### 3.5.5 Get Deploy Status

**Method:** GET
**Endpoint:** `/api/v1/sites/{site_id}/deploys/{deploy_id}`

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.netlify.com/api/v1/sites/{site_id}/deploys/{deploy_id}
```

**Response:**
```json
{
  "id": "deploy-id-123",
  "state": "ready",
  "deploy_url": "https://deploy-id-123--my-site.netlify.app",
  "published_at": "2025-10-07T15:00:00.000Z",
  "deploy_time": 83,
  "error_message": null,
  "branch": "main",
  "commit_ref": "abc1234567890"
}
```

**Deploy States:**
- `new`: Deploy created but not started
- `processing`: Build in progress
- `ready`: Successfully deployed
- `error`: Build or deploy failed

#### 3.5.6 Update Environment Variables

**Method:** PATCH
**Endpoint:** `/api/v1/accounts/{account_id}/env`

```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "site_id": "your-site-id",
    "context": "production",
    "key": "API_KEY",
    "values": [
      {
        "value": "your-api-key-value",
        "context": "production"
      }
    ]
  }' \
  https://api.netlify.com/api/v1/accounts/{account_id}/env
```

### 3.6 Netlify CLI Alternative

**Installation:**
```bash
npm install -g netlify-cli
```

**Authentication:**
```bash
netlify login  # Opens browser for OAuth authentication
```

**Common Commands:**
```bash
# Initialize new site
netlify init

# Deploy to production
netlify deploy --prod

# Deploy specific directory
netlify deploy --prod --dir=dist

# List sites
netlify sites:list

# Set environment variable
netlify env:set API_KEY "value" --context production

# Get environment variable
netlify env:get API_KEY

# Trigger build
netlify build

# Open site in browser
netlify open:site

# Link existing site
netlify link

# Watch and deploy on changes (dev workflow)
netlify dev
```

### 3.7 Error Handling

**Common Errors:**

| Error | Scenario | Handling Strategy |
|-------|----------|-------------------|
| Build Failed | Compilation error, missing dependencies | Check build logs, fix errors, redeploy |
| Deploy Timeout | Build exceeds time limit | Optimize build process, reduce bundle size |
| 401 Unauthorized | Invalid or expired token | Regenerate Personal Access Token, update config |
| 403 Forbidden | Token lacks required permissions | Check token was generated for correct account |
| 429 Rate Limited | Too many API requests | Implement exponential backoff, batch operations |
| 404 Not Found | Site ID incorrect | Verify site ID, check site exists |

**Error Handling Pattern:**
```javascript
try {
  // Netlify operation
  const result = await deployToNetlify(siteId, files);
} catch (error) {
  if (error.statusCode === 429) {
    // Rate limit - exponential backoff
    await sleep(30000);
    return retryDeployment();
  } else if (error.message.includes('build failed')) {
    // Build error - parse logs and report
    const buildLogs = await getDeployLogs(deployId);
    throw new Error(`Build failed: ${parseBuildError(buildLogs)}`);
  } else if (error.statusCode === 401 || error.statusCode === 403) {
    // Authentication error - cannot auto-recover
    throw new Error('Netlify authentication failed. Check Personal Access Token.');
  } else {
    // Other errors - log and propagate
    console.error('Netlify deployment error:', error);
    throw error;
  }
}
```

### 3.8 Rate Limiting

**Netlify Rate Limits:**
- **API Requests:** 500 requests per minute per account
- **Deployments:** 3 deploys per minute, 100 deploys per day (via API)
- **Build Minutes:** Varies by plan (Free: 300 min/month, Pro: 1000 min/month)
- **Concurrent Builds:** 1 (Free), 3+ (paid plans)

**Best Practices:**
- Use build hooks for efficient deployments (better than manual API uploads)
- Batch API requests when querying multiple sites
- Cache deployment status to avoid repeated polling
- Use webhooks from Git providers instead of API-triggered builds
- Monitor build minutes usage to avoid plan overages

### 3.9 Best Practices

1. **Use MCP Server for AI Agents** (natural language, context-aware)
2. **Use Build Hooks for Automation** (more efficient than manual deploys)
3. **Configure Environment Variables Correctly** (use appropriate contexts: production, branch-specific)
4. **Implement Build Caching** to reduce build times and minutes usage
5. **Use Deploy Previews** for testing before production deployment
6. **Monitor Build Logs** for early detection of issues
7. **Set Up Notifications** (Slack, email) for deployment status
8. **Use Netlify Functions** for serverless backend logic (form handling, API routes)

---

## 4. Environment Variables Reference

### 4.1 Required Environment Variables

**Airtable:**
```bash
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX  # Personal Access Token
```

**Make.com:**
```bash
MAKE_MCP_TOKEN_URL=https://mcp.make.com/your-token-here  # For MCP Server
# OR
MAKE_API_TOKEN=YOUR_API_TOKEN  # For REST API fallback
```

**Netlify:**
```bash
NETLIFY_AUTH_TOKEN=nfp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  # Personal Access Token
```

### 4.2 Environment Variable Security

**Best Practices:**
1. **Never commit to Git** - Add `.env` files to `.gitignore`
2. **Use placeholder values in documentation** - Never share actual tokens
3. **Rotate tokens periodically** - Quarterly rotation recommended
4. **Use minimum required scopes** - Limit token permissions
5. **Store securely** - Use secret management services (AWS Secrets Manager, etc.)
6. **Separate by environment** - Different tokens for dev, staging, production
7. **Audit token usage** - Monitor and log API calls for security

### 4.3 Environment Variable Setup

**Development (.env file):**
```bash
# Landing Page Automation - Development Environment
AIRTABLE_API_KEY=patDevXXXXXXXXXXXXXX
MAKE_MCP_TOKEN_URL=https://mcp.make.com/dev-token
NETLIFY_AUTH_TOKEN=nfp_DevXXXXXXXXXXXXXX
```

**Production (Netlify Environment Variables):**
Set in Netlify UI: Site Settings → Build & Deploy → Environment Variables

**CI/CD (GitHub Actions example):**
```yaml
env:
  AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
  NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

---

## 5. Fallback Strategies

### 5.1 Fallback Decision Matrix

| Service | Primary | Fallback 1 | Fallback 2 | Fallback 3 |
|---------|---------|------------|------------|------------|
| **Airtable** | MCP Server | REST API | Manual CSV Export | N/A |
| **Make.com** | MCP Server | Webhooks | REST API | Manual Execution |
| **Netlify** | MCP Server | REST API | CLI | Git Push Deploy |

### 5.2 Fallback Triggers

**When to Use Fallback:**
1. **MCP Server Unavailable** - Service outage, network issues
2. **Rate Limit Exceeded** - Too many MCP requests
3. **Authentication Failure** - Token invalid or expired
4. **Operation Not Supported** - MCP doesn't support specific operation
5. **Performance Requirements** - Direct API faster for specific use case
6. **Batch Operations** - REST API more efficient for bulk actions

### 5.3 Fallback Implementation Pattern

```javascript
async function executeWithFallback(operation, service) {
  try {
    // Attempt primary method (MCP)
    return await operation.executeMCP();
  } catch (mcpError) {
    console.warn(`MCP failed for ${service}:`, mcpError.message);

    try {
      // Fallback to REST API
      return await operation.executeREST();
    } catch (restError) {
      console.error(`REST API failed for ${service}:`, restError.message);

      if (service === 'netlify') {
        // Fallback to CLI
        return await operation.executeCLI();
      }

      // All fallbacks exhausted
      throw new Error(`All ${service} integration methods failed`);
    }
  }
}
```

### 5.4 Graceful Degradation

**Principles:**
1. **Fail Gracefully** - Don't crash entire workflow on single service failure
2. **Provide Feedback** - Log fallback usage for debugging
3. **Maintain Functionality** - Core features work even with fallbacks
4. **Monitor Fallback Usage** - Track when fallbacks triggered (indicates issues)

**Example:**
```javascript
// Deployment with graceful degradation
async function deployLandingPage(content) {
  let deployUrl;

  try {
    // Primary: Netlify MCP Server
    deployUrl = await netlifyMCP.deploy(content);
  } catch (error) {
    console.warn('Netlify MCP failed, using build hook fallback');
    try {
      // Fallback: Netlify Build Hook
      deployUrl = await triggerBuildHook(siteId);
    } catch (hookError) {
      console.error('Build hook failed, using CLI fallback');
      // Fallback: Netlify CLI
      deployUrl = await netlifyCLI.deploy(content);
    }
  }

  return deployUrl;
}
```

---

## 6. Quick Reference

### 6.1 Authentication Summary

| Service | Method | Token Format | Location |
|---------|--------|--------------|----------|
| **Airtable** | Personal Access Token | `patXXXXXXXXXXXXXXXX` | Account → Developer Hub |
| **Make.com** | MCP Token URL | `https://mcp.make.com/{token}` | Profile → API/MCP Access |
| **Netlify** | Personal Access Token | `nfp_XXXXXXXXXXXXXXXX` | Settings → Applications |

### 6.2 Rate Limits Summary

| Service | Rate Limit | Recommendation |
|---------|------------|----------------|
| **Airtable** | 5 req/sec per base | Queue requests, batch operations |
| **Make.com** | Varies by plan (operations/month) | Monitor usage, optimize scenarios |
| **Netlify** | 500 req/min, 3 deploys/min | Use build hooks, cache status |

### 6.3 Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Unauthorized | Check token validity, regenerate if needed |
| 403 | Forbidden | Verify token scopes/permissions |
| 404 | Not Found | Check resource IDs, verify spelling |
| 422 | Invalid Request | Validate data format and field names |
| 429 | Rate Limit Exceeded | Implement exponential backoff, retry |
| 503 | Service Unavailable | Temporary outage, retry with backoff |

---

## 7. Phase 1 Implementation Checklist

### 7.1 Pre-Implementation

- [ ] Generate all required tokens (Airtable, Make.com, Netlify)
- [ ] Store tokens securely in environment variables
- [ ] Configure MCP servers in AI agent configuration
- [ ] Test MCP server connections (verify agent discovers tools)
- [ ] Review integration patterns documentation
- [ ] Identify scenarios requiring fallback strategies

### 7.2 Implementation

- [ ] Implement Airtable CRUD operations with duplicate detection
- [ ] Create Make.com scenarios for content generation and deployment
- [ ] Configure Netlify deployment automation
- [ ] Implement error handling for all integrations
- [ ] Add rate limit management (request queuing, backoff)
- [ ] Test end-to-end workflows (content → generation → deployment)

### 7.3 Post-Implementation

- [ ] Monitor integration usage and error rates
- [ ] Optimize scenarios for efficiency (reduce operations)
- [ ] Document any custom patterns discovered
- [ ] Set up alerting for integration failures
- [ ] Review and rotate tokens as needed
- [ ] Update patterns documentation with lessons learned

---

**Document Status:** ✅ Complete
**Research Sources:** Stories 1.4, 1.5 research documents + Airtable MCP research
**Ready for Phase 1:** ✅ Yes
**Last Updated:** 2025-10-07
**Author:** Dev Agent (James)
