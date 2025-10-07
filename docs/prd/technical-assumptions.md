# Technical Assumptions

## Repository Structure: **Monorepo**

The project exists within the `web-bundles` workspace with shared `.bmad-core/` framework accessible to all sub-projects. The Landing Pages Automation project resides in `Landing Pages Automation/` directory with complete project structure (docs, src, tests).

**Rationale:** Monorepo supports shared BMAD framework assets (agents, tasks, templates) across multiple projects while maintaining project isolation. Phase 0 outputs (agents, templates) are stored in shared `.bmad-core/` for reusability across future projects.

## Service Architecture: **Defined in architecture.md**

Phase 0 delivers comprehensive architecture document (`docs/architecture.md` v1.5+) defining complete service architecture, component specifications, API contracts, data models, and implementation guidance. dev-agent will consume this architecture as primary context during Phase 1 execution.

**Rationale:** Architecture-first approach provides dev-agent with complete technical specification, eliminating ambiguity and enabling autonomous implementation. Architecture document serves as "single source of truth" for all technical decisions.

## Testing Requirements: **Manual Validation for Phase 0 Outputs**

Phase 0 deliverables require manual validation rather than automated testing:

- **Architecture Completeness Validation:** Manual verification that architecture.md contains all required sections for dev-agent implementation (data models, API specs, component definitions, deployment architecture)
- **MCP Pattern Validation:** Manual verification that MCP integration patterns document provides sufficient implementation guidance
- **Documentation Token Reduction:** Manual measurement comparing token counts between two-tier system vs. monolithic documentation
- **Session Config Loading:** Manual test loading `claude-session-config.yaml` in Claude Code to verify no errors

**Rationale:** Phase 0 produces documentation artifacts, not application code. Automated testing infrastructure is overkill for validating 1 architecture document, 1 template, 1 config file, and research documents. Phase 1 will implement comprehensive testing (unit, integration, e2e) for the actual landing pages application.

## Additional Technical Assumptions and Requests

**BMAD Framework Assumptions:**

- **.bmad-core structure is stable:** Template directory structure and format will not change during Phase 0-Phase 1 transition
- **YAML template parsing:** Claude Code can parse YAML template files for metadata and structure extraction

**MCP Integration Assumptions:**

- **Tavily MCP availability:** Tavily MCP is installed, configured, and functional for conducting MCP research in FR5-FR6
- **Context7 MCP for patterns:** Context7 MCP can provide BMAD framework patterns and examples for agent creation
- **Serena MCP for session management:** `/sc:save` and `/sc:load` commands function correctly for Phase 0 context preservation and Phase 1 handoff

**Claude Code Environment Assumptions:**

- **30-hour session capability:** Claude Code supports autonomous execution for 30+ hours without manual intervention (required for Phase 1)
- **File system access:** Full read/write access to workspace directory structure for creating agent files, templates, and documentation
- **Environment variable support:** Session configuration can reference environment variables for credentials (e.g., `${AIRTABLE_API_KEY}`)

**Documentation System Assumptions:**

- **Markdown compatibility:** All documentation (agents, templates, research notes) uses standard Markdown with no rendering issues
- **Token counting:** Reliable method exists to measure token usage for validating NFR2 (30% token reduction target)
- **Keyword detection feasibility:** Simple pattern matching can detect archive loading keywords ("history", "why built", "past errors") without semantic search infrastructure

**Phase 1 Handoff Assumptions:**

- **Context preservation:** `/sc:save` at end of Phase 0 captures sufficient context for dev-agent to begin Phase 1 execution without human re-explanation
- **Living documentation effectiveness:** dev-agent can follow living documentation patterns established in Phase 0 template
- **Architecture completeness:** architecture.md v1.5+ provides sufficient detail for dev-agent autonomous implementation without requiring additional clarification
- **dev-agent capability:** dev-agent can execute 30-hour autonomous build following architecture specifications with validation gates at each stage

**Timeline and Resource Assumptions:**

- **Solo developer availability:** 4 consecutive days available for Phase 0 work without major interruptions
- **Learning curve minimal:** Existing BMAD familiarity means minimal time spent understanding framework patterns
- **MCP research efficiency:** Tavily can surface relevant information about Make.com and Netlify MCPs within 2-4 hours per service
