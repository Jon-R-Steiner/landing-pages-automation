# Phase 0 Environment Variables

## Overview

This document lists all environment variables required for Phase 0 of the Landing Pages Automation project.

**Security Note:** This document contains placeholder values only. Never commit actual secrets or API keys to version control.

## Required Environment Variables

### TAVILY_API_KEY

**Purpose:** Authentication for Tavily MCP web search functionality

**Required For:**
- Story 1.1.4: Research Make.com MCP Availability
- Story 1.1.5: Research Netlify MCP Availability
- Any story requiring web search or real-time information retrieval

**How to Obtain:**
1. Visit https://app.tavily.com
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Generate or copy your API key

**Configuration:**

**Windows (Command Prompt):**
```cmd
set TAVILY_API_KEY=your_actual_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:TAVILY_API_KEY="your_actual_api_key_here"
```

**Linux/Mac (Bash):**
```bash
export TAVILY_API_KEY=your_actual_api_key_here
```

**Permanent Configuration:**

To persist the environment variable across sessions, add it to:
- **Windows:** System Environment Variables via System Properties
- **Linux/Mac:** `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`

**Verification:**

**Windows (Command Prompt):**
```cmd
echo %TAVILY_API_KEY%
```

**Windows (PowerShell):**
```powershell
echo $env:TAVILY_API_KEY
```

**Linux/Mac (Bash):**
```bash
echo $TAVILY_API_KEY
```

**Status:** ✅ Configured (verified 2025-10-07)

## Optional Environment Variables

### Context7 Configuration

**No environment variables required.** Context7 MCP works without additional configuration.

## Future Environment Variables (TBD)

The following environment variables may be required in Phase 1:

### For Development Environment
- `NODE_ENV` - Node.js environment (development, production, test)
- `PORT` - Local development server port

### For Netlify Deployment
- `NETLIFY_AUTH_TOKEN` - Netlify API authentication (if using deployment automation)
- `NETLIFY_SITE_ID` - Target Netlify site identifier

### For Airtable Integration
- `AIRTABLE_API_KEY` - Airtable API authentication
- `AIRTABLE_BASE_ID` - Airtable base identifier
- `AIRTABLE_TABLE_NAME` - Target table name

### For reCAPTCHA
- `RECAPTCHA_SITE_KEY` - Public site key (safe to commit)
- `RECAPTCHA_SECRET_KEY` - Private secret key (never commit)

### For Google Tag Manager
- `GTM_CONTAINER_ID` - Google Tag Manager container ID (safe to commit)

**Note:** These Phase 1 variables will be documented when their respective stories are implemented.

## Environment Variable Security Best Practices

### DO:
✅ Store actual values in environment variables, not code
✅ Use placeholder values in documentation
✅ Add `.env*` to `.gitignore` (already configured)
✅ Use different API keys for development and production
✅ Rotate API keys regularly

### DON'T:
❌ Commit `.env` files to version control
❌ Hardcode secrets in source code
❌ Share API keys in chat, email, or documentation
❌ Use production keys in development environment
❌ Store secrets in browser localStorage or cookies

## Validation Checklist

- [x] `TAVILY_API_KEY` is set in environment
- [x] `TAVILY_API_KEY` is functional (tested with WebSearch)
- [x] `.gitignore` includes `.env*` pattern
- [ ] Phase 1 variables documented when needed (TBD)

## Support

If you encounter issues with environment variable configuration:

1. Verify spelling and format of variable name
2. Check that variable is set in correct shell/terminal session
3. Restart Claude Code or terminal after setting variables
4. Consult MCP-specific documentation:
   - Tavily: https://docs.tavily.com

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-10-07 | Initial documentation of Phase 0 environment variables | Dev Agent (James) |
