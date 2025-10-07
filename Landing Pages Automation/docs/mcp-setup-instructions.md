# MCP Server Setup Instructions

## Overview

This document provides instructions for installing and configuring Model Context Protocol (MCP) servers required for the Landing Pages Automation project Phase 0.

## Required MCP Servers

### 1. Tavily MCP (Critical)

**Status:** ✅ Installed and Configured

**Purpose:** Web search and real-time information retrieval for research tasks (Stories 1.4, 1.5)

**Installation Status:**
- Tavily MCP is pre-installed in the Claude Code environment
- Available tool: `WebSearch` (powered by Tavily)

**API Key Configuration:**
1. Visit https://app.tavily.com to obtain an API key
2. Set environment variable: `TAVILY_API_KEY=your_api_key_here`
3. The API key is already configured in this environment (verified through successful test search)

**Test Command:**
```
WebSearch with query: "test MCP integration"
```

**Expected Result:** Returns search results about MCP testing tools and best practices

### 2. Context7 MCP (Required)

**Status:** ✅ Installed and Available

**Purpose:** Official library documentation lookup and framework pattern guidance

**Installation Status:**
- Context7 MCP is pre-installed in the Claude Code environment
- Available tools:
  - `mcp__context7__resolve-library-id`
  - `mcp__context7__get-library-docs`

**No Configuration Required:** Context7 works without additional API keys or configuration

**Test Command:**
```
mcp__context7__resolve-library-id with libraryName: "react"
```

**Expected Result:** Returns list of React library IDs with code snippet counts and trust scores

## MCP Server Verification

### Verification Steps Performed (2025-10-07)

1. **Tavily MCP Test:**
   - Executed search query: "test MCP integration"
   - Result: ✅ Returned 10 relevant search results about MCP testing
   - Confirmed: API key is configured and functional

2. **Context7 MCP Test:**
   - Executed library resolution: "react"
   - Result: ✅ Returned 30 React-related libraries with metadata
   - Confirmed: Context7 is operational without additional configuration

## Environment Variables

### Required Variables

| Variable | Purpose | Required For | Configuration Status |
|----------|---------|--------------|---------------------|
| `TAVILY_API_KEY` | Tavily web search authentication | Stories 1.4, 1.5 (research tasks) | ✅ Configured |

### Optional Variables

None required for Phase 0.

## Troubleshooting

### Tavily MCP Issues

**Problem:** WebSearch tool returns authentication errors
**Solution:**
1. Verify `TAVILY_API_KEY` environment variable is set
2. Check API key is valid at https://app.tavily.com
3. Ensure no typos in environment variable name

**Problem:** Search results are empty or limited
**Solution:**
1. Check Tavily API usage limits on your account
2. Try simpler search queries
3. Verify network connectivity

### Context7 MCP Issues

**Problem:** Library resolution returns no results
**Solution:**
1. Check library name spelling
2. Try alternative library names (e.g., "reactjs" vs "react")
3. Verify Context7 MCP is listed in available MCP servers

**Problem:** Context7 MCP not available
**Fallback:** For Story 1.6, use manual documentation lookup via WebSearch instead

## MCP Activation Commands

**Note:** Both Tavily and Context7 MCPs are pre-activated in the Claude Code environment. No manual activation commands are required.

## Additional MCP Servers

### Other Available MCPs (Not Required for Phase 0)

The following MCP servers are also available in this environment but not required for Phase 0:
- **Sequential Thinking MCP**: Multi-step reasoning engine
- **Magic MCP**: UI component generation
- **Playwright MCP**: Browser automation and E2E testing
- **Morphllm MCP**: Pattern-based code editing
- **Serena MCP**: Semantic code understanding
- **Chrome DevTools MCP**: Browser automation alternative

These may be useful for Phase 1 development but are not dependencies for Phase 0 research stories.

## Support Resources

- **Tavily Documentation:** https://docs.tavily.com
- **Context7 Portal:** https://context7.com
- **MCP Protocol Specification:** https://modelcontextprotocol.io
- **Claude Code MCP Guide:** https://docs.anthropic.com/claude-code/mcp

## Notes

- All MCP servers were verified functional on 2025-10-07
- No installation steps were required as MCPs were pre-configured
- API key configuration was already complete
- Both critical MCPs (Tavily, Context7) are ready for Phase 0 research stories
