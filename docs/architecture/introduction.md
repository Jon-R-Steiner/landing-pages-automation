# Introduction

This document outlines the complete fullstack architecture for **Landing Pages Automation**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

## Starter Template or Existing Project

**N/A - Greenfield Framework Development**

This is greenfield infrastructure development within an existing monorepo. The project extends the established `.bmad-core/` framework with:
- New agent definitions in `.bmad-core/agents/`
- New templates in `.bmad-core/templates/`
- New documentation patterns in `Landing Pages Automation/docs/`

The existing BMAD framework (Orchestrator, workflow management, slash command routing) is the "platform" being extended, not replaced.

## Architecture Context

**Phase 0 Scope Revision**: Following BMad Method principles ("Dev Agents Must Be Lean"), this architecture supports **dev-agent** as the sole development agent consuming this document as context, rather than creating specialized agents that would violate BMad's lean agent philosophy.

Phase 0 deliverables:
1. ✅ **This Architecture Document** (dev-agent implementation guide)
2. ✅ **Living Documentation Template** (reusable across projects)
3. ✅ **MCP Research Documents** (context for dev-agent)
4. ✅ **Session Starter Configuration** (references dev-agent + context)

---
