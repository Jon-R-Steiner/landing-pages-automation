# Requirements

## Functional Requirements

**PLANNING PHASE**

**FR1**: System shall create Pre-Core Development checklist with sequenced tasks, dependencies identified, and exit criteria defined for Phase 0 completion

**FOUNDATION PHASE (Parallel Execution)**

**FR2**: System shall create living documentation template (`living-doc-tmpl.yaml`) with three structured sections: Prescriptive (before implementation), Reflective (after testing), and Evolution History

**FR3**: Living documentation system shall implement two-tier context strategy: Active tier (current + last 3 versions always loaded) and Archive tier (full history loaded on keyword detection)

**FR4**: System shall provide keyword detection mechanism triggering archive loading for terms: "why was this built", "history", "past errors", "previous versions"

**FR5**: System shall research and document Make.com MCP availability, capabilities, and API coverage using Tavily search

**FR6**: System shall research and document Netlify MCP availability, capabilities, and API coverage using Tavily search

**FR7**: System shall create MCP integration patterns document providing implementation guidance for Airtable, Make.com, and Netlify integrations for dev-agent reference

**FR8**: System shall define fallback strategies for scenarios where Make.com or Netlify MCPs are unavailable, including HTTP/REST call patterns with examples

**INTEGRATION PHASE (Sequential after Foundation)**

**FR9**: System shall identify Phase 1 context files to be loaded by session configuration (architecture.md, PRD, MCP research documents, living documentation template, technical-preferences.yaml)

**FR10**: System shall document Phase 1 build stage definitions with entry criteria, exit criteria, and success metrics for all 6 stages (Project Setup, Frontend Foundation, Multi-Step Form, Airtable Integration, Make.com Automation, Deployment & Testing)

**FR11**: System shall create session starter configuration file (`claude-session-config.yaml`) for dev-agent activation with context files list, credentials structure template (environment variables), checkpoint trigger definitions, and build stage workflow reference

**FR12**: Session configuration shall define success criteria for all 6 Phase 1 build stages referencing the stage definitions from FR10

## Non-Functional Requirements

**NFR1**: Living documentation two-tier system must achieve ≥30% token reduction compared to loading full documentation history

**NFR2**: MCP research must be completed using Tavily MCP within 2-4 hours per service (Make.com, Netlify)

**NFR3**: Session starter configuration must be loadable by Claude Code without errors and support 30-hour dev-agent autonomous execution capability

**NFR4**: All Phase 0 deliverables must be completable within 4 calendar days by solo developer

**NFR5**: Living documentation template must be stored in `.bmad-core/templates/` directory as `living-doc-tmpl.yaml`

**NFR6**: Session configuration must use environment variables for credentials management (never hardcoded secrets)

**NFR7**: All deliverables must be version-controlled via Git with meaningful commit messages following project conventions

**NFR8**: Pre-Core Development Checklist (FR1) must have executable pass/fail criteria for each item

**NFR9**: Architecture document (architecture.md) must contain sufficient detail for dev-agent autonomous implementation without requiring human clarification
