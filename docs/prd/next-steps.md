# Next Steps

## UX Expert Prompt

**Phase 0 has no UI requirements** - UX/UI work deferred to Phase 1.

Phase 0 deliverables are infrastructure-only (agent definitions, documentation systems, MCP research, session configuration). No user interfaces, dashboards, or visual components are in scope for Phase 0.

**UX Expert engagement begins in Phase 1** when building the actual landing pages automation system with Airtable interfaces, preview systems, and approval workflows.

## Architect Prompt

**Create Phase 0 Architecture using this PRD as foundation.**

**Key Architecture Focus Areas:**

1. **Living Documentation System Design** (FR2-FR4)
   - Two-tier context management: Active (current + 3 versions) vs Archive (keyword-triggered)
   - Token optimization achieving ≥30% reduction vs monolithic approach
   - Keyword detection mechanism for archive loading

2. **Agent Architecture & MCP Integration** (FR9-FR14)
   - Three new agents: `integration_specialist`, `content_strategist`, `workflow_automations`
   - Agent-to-MCP mapping strategy (agent-mcp-mappings.md)
   - Fallback patterns for Make.com/Netlify MCP unavailability

3. **Session Starter Configuration** (FR17-FR18)
   - YAML config structure enabling autonomous 30-hour Phase 1 execution
   - Success criteria for all 5 Phase 1 build stages
   - Context file loading strategy and workflow state management

4. **BMAD Integration Architecture**
   - Leverage existing BMAD Orchestrator for agent coordination (`*agent {name}`)
   - Use BMAD workflow-management for state tracking and artifact passing
   - Configure BMAD's checkpoint/resume capabilities for Phase 1 autonomy

**High Priority Architecture Investigations** (from Checklist):
- Runtime model clarity: When do agents activate? How are they orchestrated during Phase 1?
- Validation automation: How to automate BMAD schema validation (NFR1)?
- BMAD template specification: Extend existing BMAD template system or create separate structure?
- Risk 11 mitigation: How to validate BMAD supports 30-hour autonomous execution at this scale?

**Technical Assumptions to Review** (see Technical Assumptions section):
- BMAD Orchestrator capabilities for extended autonomous execution
- MCP server availability and API stability
- Validation automation requirements
- Timeline assumptions (33-44 actual hours vs 32 claimed)

**Reference Documents:**
- Project Brief: `Landing Pages Automation/docs/brief.md`
- BMAD Orchestrator: `.bmad-core/agents/bmad-orchestrator.md`
- BMAD Workflow Management: `.bmad-core/utils/workflow-management.md`
- PM Checklist Results: See Checklist Results Report section above
