/clear# Landing Pages Automation Product Requirements Document (PRD)

## Goals and Background Context

### Goals

1. **Create 3 specialized BMAD agents** (`integration_specialist`, `content_strategist`, `workflow_automations`) with MCP integration patterns documented
2. **Implement living documentation system** achieving ≥30% token reduction vs. monolithic approach through two-tier context management
3. **Research and map MCP landscape** for Airtable, Make.com, Netlify with integration patterns and fallback strategies documented
4. **Design session starter configuration** enabling autonomous 30-hour Phase 1 execution with success criteria for all 5 build stages
5. **Complete Phase 0 in ≤4 days** with all deliverables validated against success criteria and context saved for Phase 1 handoff

### Background Context

Autonomous AI-assisted development faces a critical bottleneck: **human coordination overhead**. Manual orchestration of multi-agent workflows creates massive inefficiency—even with AI coding assistants, developers spend 50%+ of session time coordinating handoffs rather than creating value. For a solo developer, this coordination tax makes complex multi-stage projects mathematically impossible within realistic timeframes.

**Landing Pages Automation** serves as proof-of-concept for eliminating this bottleneck through autonomous multi-agent coordination. However, before autonomous build execution can begin, foundational infrastructure must exist. **This PRD defines Phase 0: Pre-Core Development**—creating specialized BMAD agents, living documentation systems, MCP integration patterns, and session configurations that enable truly autonomous coordination. Phase 0 deliverables become reusable framework assets for all future agent-orchestrated development projects, not just this landing pages system.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-07 | 1.1 | Updated Phase 1 build stages to align with architecture.md v1.5: Changed from 5 generic stages to 6 specific implementation stages (Project Setup, Frontend Foundation, Multi-Step Form, Airtable Integration, Make.com Automation, Deployment & Testing). Updated FR16, FR18, Story 3.2 AC2+AC6, Story 3.4 AC1-8 with architecture-specific components and success criteria. Added explicit mappings to monorepo layout, Next.js routing ([slug]/[location]/[slug]), FormContext/MarketingContext, AirtableService/RecaptchaService, Make.com scenarios, Netlify Functions, and Playwright E2E tests. Rationale: PRD references must match actual architecture implementation for dev-agent Phase 1 execution | Winston (Architect Agent) |
| 2025-10-06 | 1.0 | Initial PRD creation | PM Agent |

## Requirements

### Functional Requirements

**PLANNING PHASE**

**FR1**: System shall create Pre-Core Development checklist with sequenced tasks, dependencies identified, and exit criteria defined for Phase 0 completion

**FOUNDATION PHASE (Parallel Execution)**

**FR2**: System shall create living documentation template (`living-doc-tmpl.yaml`) with three structured sections: Prescriptive (before implementation), Reflective (after testing), and Evolution History

**FR3**: Living documentation system shall implement two-tier context strategy: Active tier (current + last 3 versions always loaded) and Archive tier (full history loaded on keyword detection)

**FR4**: System shall provide keyword detection mechanism triggering archive loading for terms: "why was this built", "history", "past errors", "previous versions"

**FR5**: System shall research and document Make.com MCP availability, capabilities, and API coverage using Tavily search

**FR6**: System shall research and document Netlify MCP availability, capabilities, and API coverage using Tavily search

**FR7**: System shall create agent-to-MCP mapping document specifying which agents use which MCPs for specific tasks

**FR8**: System shall define fallback strategies for scenarios where Make.com or Netlify MCPs are unavailable, including HTTP/REST call patterns with examples

**AGENT CREATION PHASE (Sequential after Foundation)**

**FR9**: System shall create three new BMAD agent definition files (`integration_specialist.md`, `content_strategist.md`, `workflow_automations.md`) following BMAD template structure with YAML frontmatter

**FR10**: Each agent definition shall include: agent metadata (name, id, title, icon), persona definition, activation instructions, commands list (≥5 commands per agent), and dependencies mapping

**FR11**: Integration Specialist agent shall document MCP integration patterns for Airtable, Make.com (or HTTP fallback), and Netlify (or HTTP fallback)

**FR12**: Content Strategist agent shall define commands for Claude prompt engineering, brand voice management, and content template generation

**FR13**: Workflow Automations agent shall define commands for GitHub Actions setup, deployment pipeline configuration, and testing automation

**FR14**: Each agent definition shall be activation-tested via slash command (`/BMad:agents:{agent_id}`) before Phase 0 completion

**INTEGRATION PHASE (Sequential after Agents Complete)**

**FR15**: System shall identify Phase 1 context files to be loaded by session configuration (architecture.md, technical-preferences.yaml, agent definitions, living documentation)

**FR16**: System shall document Phase 1 build stage definitions with entry criteria, exit criteria, and success metrics for all 6 stages (Project Setup, Frontend Foundation, Multi-Step Form, Airtable Integration, Make.com Automation, Deployment & Testing)

**FR17**: System shall create session starter configuration file (`claude-session-config.yaml`) with context files list, credentials structure template (environment variables), and checkpoint trigger definitions

**FR18**: Session configuration shall define success criteria for all 6 Phase 1 build stages referencing the stage definitions from FR16

### Non-Functional Requirements

**NFR1**: All agent definitions must pass BMAD schema validation and successfully activate via slash command (`/BMad:agents:{agent_id}`)

**NFR2**: Living documentation two-tier system must achieve ≥30% token reduction compared to loading full documentation history

**NFR3**: MCP research must be completed using Tavily MCP within 2-4 hours per service (Make.com, Netlify)

**NFR4**: Session starter configuration must be loadable by Claude Code without errors and support 30-hour autonomous execution capability

**NFR5**: All Phase 0 deliverables must be completable within 4 calendar days by solo developer

**NFR6**: Documentation must follow existing BMAD framework patterns and maintain backward compatibility with current agents

**NFR7**: All agent files must be stored in `.bmad-core/agents/` directory following naming convention `{agent_id}.md`

**NFR8**: Living documentation template must be stored in `.bmad-core/templates/` directory as `living-doc-tmpl.yaml`

**NFR9**: Session configuration must use environment variables for credentials management (never hardcoded secrets)

**NFR10**: All deliverables must be version-controlled via Git with meaningful commit messages following project conventions

**NFR11**: Pre-Core Development Checklist (FR1) must have executable pass/fail criteria for each item

## Technical Assumptions

### Repository Structure: **Monorepo**

The project exists within the `web-bundles` workspace with shared `.bmad-core/` framework accessible to all sub-projects. The Landing Pages Automation project resides in `Landing Pages Automation/` directory with complete project structure (docs, src, tests).

**Rationale:** Monorepo supports shared BMAD framework assets (agents, tasks, templates) across multiple projects while maintaining project isolation. Phase 0 outputs (agents, templates) are stored in shared `.bmad-core/` for reusability across future projects.

### Service Architecture: **N/A - Infrastructure Phase**

Phase 0 does not implement service architecture. This is foundational infrastructure development (agent definitions, documentation templates, configuration files). Service architecture for the Landing Pages Automation application will be defined in Phase 1 by the Architect agent using these Phase 0 deliverables.

**Rationale:** Premature architectural decisions at this stage would constrain the Architect. Phase 0 provides the tools (agents, documentation systems) that Phase 1 uses to make architectural decisions.

### Testing Requirements: **Manual Validation for Phase 0 Outputs**

Phase 0 deliverables require manual validation rather than automated testing:

- **Agent Activation Testing:** Manual test via slash command (`/BMad:agents:{agent_id}`) to verify agent loads successfully
- **BMAD Schema Validation:** Manual verification that agent files follow BMAD template structure (YAML frontmatter, required sections)
- **Documentation Token Reduction:** Manual measurement comparing token counts between two-tier system vs. monolithic documentation
- **Session Config Loading:** Manual test loading `claude-session-config.yaml` in Claude Code to verify no errors

**Rationale:** Phase 0 produces framework artifacts, not application code. Automated testing infrastructure is overkill for validating 3 agent files, 1 template, 1 config file, and research documents. Phase 1 will implement comprehensive testing (unit, integration, e2e) for the actual landing pages application.

### Additional Technical Assumptions and Requests

**BMAD Framework Assumptions:**

- **BMAD Orchestrator provides multi-agent coordination:** BMAD Orchestrator (`.bmad-core/agents/bmad-orchestrator.md`) handles agent selection/transformation (`*agent {name}`), context passing between agents (workflow artifacts), state management (workflow_state tracking), and stage transitions - Phase 0 configures BMAD for Phase 1, not inventing orchestration patterns
- **BMAD workflow management exists:** BMAD provides workflow state tracking, checkpoint/resume capabilities, artifact passing, and stage transition logic (`.bmad-core/utils/workflow-management.md`) - Phase 0 defines Phase 1-specific workflow within BMAD's existing system
- **.bmad-core structure is stable:** Agent directory structure, template format, and slash command activation patterns will not change during Phase 0-Phase 1 transition
- **YAML frontmatter parsing:** Claude Code can parse YAML frontmatter in agent definition files for metadata extraction
- **Slash command routing:** `/BMad:agents:{agent_id}` pattern correctly routes to agent definition files in `.bmad-core/agents/` directory

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

- **Context preservation:** `/sc:save` at end of Phase 0 captures sufficient context for Phase 1 agents to resume work without human re-explanation
- **Living documentation effectiveness:** Phase 1 agents can follow Prescriptive documentation from living docs to guide implementation
- **Agent coordination patterns:** Phase 1 agents understand how to trigger other agents based on session configuration event patterns

**Timeline and Resource Assumptions:**

- **Solo developer availability:** 4 consecutive days available for Phase 0 work without major interruptions
- **Learning curve minimal:** Existing BMAD familiarity means minimal time spent understanding framework patterns
- **MCP research efficiency:** Tavily can surface relevant information about Make.com and Netlify MCPs within 2-4 hours per service

## Risks & Mitigation Strategies

### **Risk 1: Runtime Model Ambiguity**

**Concern:** Technical Assumptions state "N/A - Infrastructure Phase" for service architecture without clarifying the runtime model for agent execution.

**Impact:** Architect may be unclear about what they're designing Phase 1 architecture for, leading to misalignment.

**Mitigation:**
- **Clarify during execution:** Agent files are prompt templates with YAML metadata, activated via Claude Code slash commands (`/BMad:agents:{agent_id}`)
- **Runtime environment:** Claude Code interpreter parses YAML frontmatter and follows agent instructions
- **No compilation/build step:** Agents are documentation-driven, not executable binaries

**Owner:** Architect agent during Phase 0 execution

---

### **Risk 2: Validation Automation Absent**

**Concern:** Manual validation (NFR1-NFR4) doesn't scale and creates quality gaps that will cascade into Phase 1.

**Impact:** HIGH - Broken agent files, invalid configurations, or incorrect documentation structure won't be caught until Phase 1 failures occur.

**Mitigation:**
- **Consider lightweight validation scripts:**
  - `agent-validator.js`: Check YAML frontmatter structure for required fields
  - `token-counter.js`: Measure documentation token counts objectively
  - `config-loader-test.js`: Attempt to load session configuration and report errors
- **Trade-off decision:** Balance automation effort (adds scope to Phase 0) vs. manual validation risk
- **Defer if needed:** Can be added during Phase 0 if time permits, or addressed in Phase 1 when issues surface

**Owner:** Developer during Phase 0 execution (evaluate during Day 2-3)

---

### **Risk 3: BMAD Template Specification Gap**

**Concern:** Requirements reference "BMAD template structure" but don't provide schema definition or annotated example.

**Impact:** MEDIUM - Developer wastes time guessing required fields, leading to rework cycles.

**Mitigation:**
- **Reference existing agents:** Use `.bmad-core/agents/*.md` files as examples during Phase 0
- **Context7 MCP:** Query for BMAD agent patterns and framework documentation
- **Iterative validation:** Create first agent, validate with existing patterns, then apply learning to remaining agents

**Owner:** Developer during Phase 0 execution (Day 2)

---

### **Risk 4: Environment Variable Specification Missing**

**Concern:** NFR9 requires environment variables for credentials but doesn't specify which variables are needed or where they're configured.

**Impact:** MEDIUM - Implementation blocker for FR17 (session configuration creation).

**Mitigation:**
- **Document during execution:** As agents are created and MCPs researched, compile list of required variables:
  - `TAVILY_API_KEY` (for MCP research)
  - `AIRTABLE_API_KEY` (for Integration Specialist agent)
  - `MAKE_API_KEY` (if Make.com integration used)
  - `NETLIFY_API_TOKEN` (if Netlify integration used)
- **Configuration location:** Document in session config whether to use `.env` file, system variables, or Claude Code settings
- **Defaults for development:** Identify which can use test/mock values vs. requiring real credentials

**Owner:** Integration Specialist agent during agent creation (Day 2)

---

### **Risk 5: Token Reduction Baseline Undefined**

**Concern:** NFR2 claims "≥30% token reduction" but no baseline measurement exists to validate against.

**Impact:** MEDIUM - Key performance claim is unverifiable without objective measurement.

**Mitigation:**
- **Measure baseline during Phase 0:**
  - Step 1: Measure current documentation token count (full history load)
  - Step 2: Implement two-tier system
  - Step 3: Measure archive-only load token count
  - Step 4: Calculate percentage reduction
- **Tool selection:** Identify token counting utility (OpenAI tiktoken, Anthropic token counter, or approximation method)
- **Document actual reduction:** Report real percentage achieved vs. 30% target in Phase 0 completion report

**Owner:** Developer during living documentation implementation (Day 1)

---

### **Risk 6: 30-Hour Session Capability Unproven**

**Concern:** Entire Phase 1 plan depends on Claude Code supporting 30-hour autonomous sessions, but this capability has never been validated.

**Impact:** CRITICAL - If 30-hour sessions aren't feasible, Phase 1 plan fails and Phase 0 infrastructure is built for impossible use case.

**Mitigation:**
- **Consider validation experiment:** Run 4-hour autonomous test during Phase 0 with checkpoints every 30 minutes
  - Validate: Context preservation across checkpoints
  - Validate: Checkpoint/resume functionality
  - Validate: Autonomous execution without human intervention
- **Early validation advantages:**
  - Proves concept before investing in full Phase 1
  - Identifies session management issues early
  - Provides confidence in Phase 0 deliverable viability
- **Trade-off:** Adds 4-6 hours to Phase 0 timeline (extends to 5 days instead of 4)
- **Defer decision:** Can be evaluated during Day 3 after session config creation

**Owner:** PM agent decision during Phase 0 (Day 3 checkpoint)

---

### **Risk 7: Integration Testing Gaps**

**Concern:** Requirements validate individual components (agents, templates, configs) but don't test how they work together.

**Impact:** HIGH - Components may be individually valid but collectively broken (e.g., agents reference wrong template, session config loads wrong agents).

**Mitigation:**
- **Manual integration testing checklist:**
  - Test 1: Activate each agent and verify living doc template usage
  - Test 2: Load session config and verify all 3 agents referenced correctly
  - Test 3: Cross-check agent MCP mappings against research document findings
  - Test 4: Validate agent commands don't conflict with existing BMAD agents
- **Add to Phase 0 completion criteria:** Integration tests must pass before Phase 0 marked complete
- **Low overhead:** Manual testing, no automation needed for 3 agents + 1 config

**Owner:** QA validation during Phase 0 Day 4

---

### **Risk 8: Timeline Breakdown Absent**

**Concern:** NFR5 requires "4 calendar days" completion but provides no day-by-day deliverable targets.

**Impact:** MEDIUM - Developer can't self-assess progress or identify delays early.

**Mitigation:**
- **Proposed timeline breakdown:**
  - **Day 1:** MCP Research (FR5-FR8) + Living Doc Template (FR2-FR4)
  - **Day 2:** Agent Creation (FR9-FR13) + Activation Testing (FR14)
  - **Day 3:** Session Config (FR15-FR18) + Integration Testing
  - **Day 4:** Full validation + Context save (`/sc:save`) + Handoff documentation
- **Checkpoints:** End-of-day review against deliverable targets
- **Slack built-in:** Foundation phase (FR2-FR8) can run in parallel, provides buffer

**Owner:** Developer self-management during Phase 0 execution

---

### **Risk 9: Git Workflow Undefined**

**Concern:** NFR10 requires "meaningful commit messages following project conventions" but conventions aren't specified.

**Impact:** LOW - Creates inconsistency but doesn't block progress.

**Mitigation:**
- **Adopt Conventional Commits:** Use `feat:`, `docs:`, `chore:` prefixes
- **Commit frequency:** After each major deliverable (agent file, template, config)
- **Branch strategy:** Work on feature branch `feature/phase-0-foundation`, merge to main after validation
- **No sign-off required:** Solo developer, async work, lightweight process

**Owner:** Developer during Phase 0 execution (establish on Day 1)

---

### **Risk 10: Failure Recovery Procedures Missing**

**Concern:** No documented procedure for validation failures or Phase 1 discovery that Phase 0 outputs are unusable.

**Impact:** MEDIUM - Delays and confusion when issues arise.

**Mitigation:**
- **Validation failure procedure:**
  - Document specific issue in Git commit message
  - Fix in place (don't delete and restart)
  - Re-validate after fix
  - Continue if fix verified
- **Git revert strategy:** Tag commits before each major deliverable for rollback points
- **Phase 1 rollback option:** Define minimum viable Phase 0 (core agents only, defer optional features)
- **Escalation path:** If validation repeatedly fails, reassess requirements or timeline

**Owner:** PM agent during Phase 0 execution oversight

---

### **Risk 11: BMAD Workflow Extended Execution Capability**

**Concern:** Assumption that BMAD Orchestrator and workflow management system support 30-hour autonomous execution without human intervention has not been validated at this scale.

**Impact:** CRITICAL - If BMAD workflow system cannot manage 30-hour sessions autonomously, Phase 1 execution model fails and Phase 0 infrastructure is built for impossible use case.

**Mitigation:**
- **Validate BMAD capabilities:** During Story 3.5 (Session Config Loading), review BMAD Orchestrator and workflow-management documentation for any session duration limits or checkpoint/resume constraints
- **Consider validation experiment:** Run 4-hour test of BMAD workflow execution during Phase 0 with checkpoints every 30 minutes to validate:
  - Workflow state persistence across checkpoints
  - Checkpoint/resume functionality maintains context
  - Artifact passing survives interruption/resumption cycles
  - BMAD Orchestrator can manage autonomous agent transitions without human approval
- **Trade-off:** Adds 4-6 hours to Phase 0 timeline (extends to 5 days instead of 4)
- **Defer decision:** Can be evaluated during Day 3 after session config creation - if BMAD documentation confirms capability, skip experiment; if unclear, run validation test

**Owner:** PM agent decision during Phase 0 (Day 3 checkpoint)

## Epic List

### Epic 1: Foundation Infrastructure

**Goal:** Establish living documentation system and MCP integration research foundation to enable subsequent agent development and session configuration. Leverages BMAD's existing documentation patterns and extends them with two-tier context management.

**Key Deliverables:**
- Pre-Core Development Checklist
- Living Documentation Template with two-tier strategy
- MCP Research (Make.com, Netlify, Airtable)
- Agent-to-MCP Mapping Document

**BMAD Integration:** Uses existing BMAD template structure (`.bmad-core/templates/*.yaml` patterns) and extends with token optimization strategy.

---

### Epic 2: Agent Creation & Validation

**Goal:** Create three specialized BMAD agents (Integration Specialist, Content Strategist, Workflow Automations) with complete MCP integration patterns and successful activation testing. These agents will be orchestrated by BMAD Orchestrator during Phase 1 execution.

**Key Deliverables:**
- Three agent definition files following BMAD agent template structure
- Agent activation testing validation
- Agent-MCP integration consistency verification

**BMAD Integration:** Agents created in `.bmad-core/agents/` directory will be discoverable and activatable by BMAD Orchestrator via `*agent {name}` command. Orchestrator handles multi-agent coordination, context passing, and workflow state management automatically.

---

### Epic 3: Session Configuration & Phase 1 Preparation

**Goal:** Configure BMAD Orchestrator with Phase 1 workflow definition and session starter configuration, enabling autonomous 30-hour Phase 1 execution. Leverages BMAD's existing workflow management system (workflow state tracking, stage transitions, artifact passing, resumption capabilities).

**Key Deliverables:**
- Phase 1 Context Files List
- Phase 1 Build Stage Definitions (BMAD workflow format)
- Session Starter Configuration
- Phase 0 Completion Validation

**BMAD Integration:** Phase 1 workflow will use BMAD workflow-management patterns (`/workflow-start`, `/workflow-status`, `/workflow-next`). Session config maps to BMAD Orchestrator's workflow execution model with artifact tracking and checkpoint/resume functionality.

## Epic Details

### Epic 1: Foundation Infrastructure

**Epic Goal:** Establish living documentation system and MCP integration research foundation to enable subsequent agent development and session configuration. This epic delivers the research insights and documentation infrastructure that Phase 0 agents will use and reference.

#### Story 1.1: Create Pre-Core Development Checklist

**As a** Phase 0 developer,
**I want** a comprehensive checklist with sequenced tasks and dependencies,
**so that** I can track Phase 0 progress systematically and ensure nothing is missed.

**Acceptance Criteria:**

1. Checklist document created in `Landing Pages Automation/docs/phase-0-checklist.md`
2. All FR1-FR18 requirements mapped to checklist items with clear pass/fail criteria
3. Dependencies between checklist items explicitly documented (e.g., "MCP Research must complete before Agent Creation")
4. Exit criteria for Phase 0 completion clearly defined and measurable
5. Checklist references Risk mitigation strategies from Risks & Mitigation section for high-impact items
6. Document committed to Git with message: `docs: create Phase 0 Pre-Core Development checklist`

---

#### Story 1.2: Design Living Documentation Template

**As a** Phase 0 developer,
**I want** a living documentation template with structured sections,
**so that** Phase 1 agents can use documentation-as-code patterns with prescriptive and reflective sections.

**BMAD Context:** Extends existing BMAD template patterns (`.bmad-core/templates/*.yaml`) with two-tier context management for token optimization.

**Acceptance Criteria:**

1. Template file created at `.bmad-core/templates/living-doc-tmpl.yaml`
2. Template includes three required sections: Prescriptive (before implementation), Reflective (after testing), Evolution History
3. YAML structure follows existing BMAD template patterns (validated against `.bmad-core/templates/*.yaml` examples)
4. Template includes metadata fields: id, name, version, output format, filename pattern
5. Template structure documented with placeholder examples (detailed usage examples deferred until first agent uses template)
6. Template committed to Git with message: `feat: add living documentation template for agent workflows`

---

#### Story 1.3: Implement Two-Tier Documentation Context Strategy

**As a** Phase 0 developer,
**I want** a two-tier documentation loading strategy,
**so that** token usage is reduced by ≥30% while maintaining access to historical context when needed.

**Acceptance Criteria:**

1. Living documentation template (from Story 1.2) implements Active tier structure: current version + last 3 versions always loaded
2. Archive tier structure defined: full history stored separately, loaded only on keyword detection
3. Keyword detection mechanism specified for triggers: "why was this built", "history", "past errors", "previous versions"
4. Documentation in `docs/living-docs-strategy.md` explaining Active vs Archive tiers with loading logic
5. Token baseline measurement documented: measure current full-history documentation load (use Anthropic token counter or approximation: 4 chars ≈ 1 token if counter unavailable)
6. Two-tier strategy committed to Git with message: `feat: implement two-tier documentation context strategy`

---

#### Story 1.4: Research Make.com MCP Availability

**As an** Integration Specialist agent (future),
**I want** detailed research on Make.com MCP capabilities,
**so that** I can integrate Make.com workflows with documented patterns or HTTP fallbacks.

**Acceptance Criteria:**

1. Tavily MCP used to search for Make.com MCP information (API, GitHub repos, documentation)
2. Research document created at `docs/mcp-research/make-com-mcp.md` with findings
3. Document includes: MCP existence determination (exists/doesn't exist/unstable), API coverage assessment, authentication patterns
4. If MCP exists: Document installation instructions, basic usage patterns, agent integration examples
5. If MCP doesn't exist: Document HTTP/REST fallback strategy with example API calls for common Make.com operations
6. Research completed within 2-4 hours (NFR3 requirement), findings committed to Git with message: `docs: research Make.com MCP integration options`

---

#### Story 1.5: Research Netlify MCP Availability

**As an** Integration Specialist agent (future),
**I want** detailed research on Netlify MCP capabilities,
**so that** I can integrate Netlify deployments with documented patterns or HTTP fallbacks.

**Acceptance Criteria:**

1. Tavily MCP used to search for Netlify MCP information (API, GitHub repos, documentation)
2. Research document created at `docs/mcp-research/netlify-mcp.md` with findings
3. Document includes: MCP existence determination (exists/doesn't exist/unstable), API coverage assessment (deployment, site management, build hooks), authentication patterns
4. If MCP exists: Document installation instructions, basic usage patterns, agent integration examples
5. If MCP doesn't exist: Document HTTP/REST fallback strategy with example API calls for Netlify CLI alternative commands
6. Research completed within 2-4 hours (NFR3 requirement), findings committed to Git with message: `docs: research Netlify MCP integration options`

---

#### Story 1.6: Create Agent-to-MCP Mapping Document

**As a** Phase 0 developer,
**I want** a centralized mapping of which agents use which MCPs for specific tasks,
**so that** agent creation (Epic 2) has clear integration patterns to follow.

**Acceptance Criteria:**

1. Mapping document created at `docs/agent-mcp-mappings.md`
2. Document maps each of the 3 agents (Integration Specialist, Content Strategist, Workflow Automations) to their anticipated MCP usage patterns based on research findings
3. For each agent-MCP pairing, document: specific tasks that trigger MCP usage, MCP tool/function to invoke, expected inputs/outputs
4. Include mappings for confirmed MCPs: Airtable MCP (Integration Specialist), Context7 MCP (all agents), Tavily MCP (Content Strategist for research)
5. Include fallback strategies for Make.com and Netlify based on Story 1.4 and 1.5 research findings
6. Note: Actual agent implementation (Epic 2) may refine these anticipated mappings based on design decisions
7. Document committed to Git with message: `docs: create agent-to-MCP mapping reference`

---

### Epic 2: Agent Creation & Validation

**Epic Goal:** Create three specialized BMAD agents (Integration Specialist, Content Strategist, Workflow Automations) with complete MCP integration patterns and successful activation testing. This epic delivers the agent capabilities that Phase 1 will use for autonomous development under BMAD Orchestrator coordination.

**BMAD Orchestration Context:** These agents will be managed by BMAD Orchestrator, which handles: agent selection and transformation (`*agent {name}`), context passing between agents (workflow artifacts), state management (workflow_state tracking), stage transitions (mark complete → check conditions → load next agent).

#### Story 2.1: Create Integration Specialist Agent Definition

**As a** Phase 0 developer,
**I want** an Integration Specialist agent that handles Airtable, Make.com, and Netlify integrations,
**so that** Phase 1 has an agent specializing in third-party service integrations with MCP patterns.

**BMAD Integration:** Agent will be activated by BMAD Orchestrator via `*agent integration_specialist` command. Orchestrator handles passing workflow context and artifacts to agent automatically.

**Acceptance Criteria:**

1. Agent file created at `.bmad-core/agents/integration_specialist.md` following BMAD template structure (reference existing agents in `.bmad-core/agents/*.md`)
2. YAML frontmatter includes: agent metadata (name: "Integration Specialist", id: "integration_specialist", title, icon), persona definition (role, style, identity, focus per BMAD pattern), activation instructions
3. Commands section defines ≥5 commands including: `*integrate-airtable`, `*integrate-make`, `*integrate-netlify`, `*test-integration`, `*troubleshoot-api`
4. Dependencies section references: MCP research documents (Story 1.4, 1.5), agent-MCP mappings (Story 1.6), living documentation template (Story 1.2)
5. MCP integration patterns documented per service: Airtable MCP usage, Make.com (MCP or HTTP fallback), Netlify (MCP or HTTP fallback) based on research findings
6. Agent file references environment variables for credentials: `AIRTABLE_API_KEY`, `MAKE_API_KEY` (if used), `NETLIFY_API_TOKEN` (if used)
7. Agent committed to Git with message: `feat: create Integration Specialist agent for third-party integrations`

---

#### Story 2.2: Create Content Strategist Agent Definition

**As a** Phase 0 developer,
**I want** a Content Strategist agent that handles Claude prompt engineering and content generation,
**so that** Phase 1 has an agent specializing in AI-driven content workflows and brand voice management.

**BMAD Integration:** Agent will be activated by BMAD Orchestrator via `*agent content_strategist` command with workflow context.

**Acceptance Criteria:**

1. Agent file created at `.bmad-core/agents/content_strategist.md` following BMAD template structure
2. YAML frontmatter includes: agent metadata (name: "Content Strategist", id: "content_strategist", title, icon), persona definition emphasizing prompt engineering expertise and brand consistency
3. Commands section defines ≥5 commands including: `*create-prompt-template`, `*generate-content`, `*review-brand-voice`, `*optimize-prompt`, `*research-content-patterns`
4. Dependencies section references: Context7 MCP (for content patterns), Tavily MCP (for content research), living documentation template (Story 1.2)
5. Persona includes focus on: systematic prompt iteration, brand voice consistency, content quality validation, A/B testing preparation
6. MCP integration patterns documented: Context7 for content framework patterns, Tavily for competitive content research
7. Agent committed to Git with message: `feat: create Content Strategist agent for AI content workflows`

---

#### Story 2.3: Create Workflow Automations Agent Definition

**As a** Phase 0 developer,
**I want** a Workflow Automations agent that handles GitHub Actions, deployment pipelines, and testing automation,
**so that** Phase 1 has an agent specializing in CI/CD setup and workflow orchestration.

**BMAD Integration:** Agent will be activated by BMAD Orchestrator via `*agent workflow_automations` command with workflow context.

**Acceptance Criteria:**

1. Agent file created at `.bmad-core/agents/workflow_automations.md` following BMAD template structure
2. YAML frontmatter includes: agent metadata (name: "Workflow Automations", id: "workflow_automations", title, icon), persona definition emphasizing DevOps and automation expertise
3. Commands section defines ≥5 commands including: `*create-github-action`, `*setup-deployment-pipeline`, `*configure-testing`, `*setup-ci-cd`, `*automate-workflow`
4. Dependencies section references: Playwright MCP (for browser testing automation), living documentation template (Story 1.2), GitHub Actions patterns
5. Persona includes focus on: reliable automation, idempotent scripts, error handling, rollback mechanisms, monitoring integration
6. MCP integration patterns documented: Playwright for E2E testing automation, potential integration with deployment MCPs (Netlify from Story 1.5)
7. Agent committed to Git with message: `feat: create Workflow Automations agent for CI/CD and testing`

---

#### Story 2.4: Perform Agent Activation Testing

**As a** Phase 0 developer,
**I want** to validate that all 3 agents activate successfully via slash commands,
**so that** I have confidence Phase 1 agents will load correctly without runtime errors and be accessible to BMAD Orchestrator.

**Acceptance Criteria:**

1. Integration Specialist agent activates successfully via `/BMad:agents:integration_specialist` without errors
2. Content Strategist agent activates successfully via `/BMad:agents:content_strategist` without errors
3. Workflow Automations agent activates successfully via `/BMad:agents:workflow_automations` without errors
4. Each agent activation displays: agent name, role/title, icon, available commands list (≥5 commands per agent)
5. YAML frontmatter parsing validated: no syntax errors, all required fields present (name, id, title, persona, commands)
6. Activation testing results documented in `docs/phase-0-validation-log.md` with screenshots or terminal output
7. If activation fails: troubleshoot YAML syntax, fix errors, re-test until all 3 agents activate successfully

---

#### Story 2.5: Validate Agent-MCP Integration Consistency

**As a** Phase 0 developer,
**I want** to verify agent definitions match MCP research findings and mapping documents,
**so that** Phase 1 agents use correct MCP patterns without integration failures.

**Acceptance Criteria:**

1. Cross-reference Integration Specialist agent MCP usage against `docs/agent-mcp-mappings.md` (Story 1.6) - verify: (a) all mapped MCPs documented in agent, (b) all MCPs used in agent documented in mappings, (c) usage patterns match
2. Cross-reference Content Strategist agent MCP usage against agent-MCP mappings - Context7 and Tavily patterns consistent
3. Cross-reference Workflow Automations agent MCP usage against agent-MCP mappings - Playwright patterns consistent
4. Validate fallback strategies in Integration Specialist match Make.com and Netlify MCP research findings (Stories 1.4, 1.5)
5. Validate environment variable references in agents match Risk 4 mitigation list: `TAVILY_API_KEY`, `AIRTABLE_API_KEY`, `MAKE_API_KEY`, `NETLIFY_API_TOKEN`
6. Integration validation documented in `docs/phase-0-validation-log.md` confirming consistency with zero discrepancies found

---

### Epic 3: Session Configuration & Phase 1 Preparation

**Epic Goal:** Configure BMAD Orchestrator with Phase 1 workflow definition and session starter configuration, enabling autonomous 30-hour Phase 1 execution and complete Phase 0 handoff. This epic maps Phase 1 requirements to BMAD's workflow management system.

**BMAD Workflow Context:** Phase 1 will execute using BMAD workflow management which provides: workflow state tracking (progress, artifacts, timestamps), stage transitions (auto-progression with condition checking), checkpoint/resume (interruption handling), context passing (artifacts between agents). Session config in this epic defines the Phase 1-specific workflow definition that BMAD Orchestrator will execute.

#### Story 3.1: Identify Phase 1 Context Files

**As a** Phase 0 developer,
**I want** a documented list of context files Phase 1 must load,
**so that** session configuration references all necessary files for autonomous Phase 1 execution.

**Acceptance Criteria:**

1. Context files list documented in `docs/phase-1-context-files.md`
2. List includes: `docs/architecture.md` (TO BE CREATED by Phase 1), `docs/prd.md` (this document), `.bmad-core/data/technical-preferences.yaml`, all 3 agent definitions (`.bmad-core/agents/*.md`)
3. For each context file, document: purpose (why Phase 1 needs it), loading priority (always load vs. load on demand), approximate token cost
4. Include living documentation files Phase 1 will create following two-tier strategy (Active tier files only for initial load)
5. Explicitly mark files as "must exist before Phase 1" vs. "Phase 1 will create" with expected structure notes
6. Context files list committed to Git with message: `docs: define Phase 1 context file loading strategy`

---

#### Story 3.2: Document Phase 1 Build Stage Definitions

**As a** Phase 0 developer,
**I want** explicit definitions for all 5 Phase 1 build stages with success criteria,
**so that** BMAD Orchestrator workflow configuration has measurable validation gates for autonomous progress tracking.

**BMAD Workflow Context:** This story creates workflow stage definitions in BMAD workflow format. BMAD Orchestrator will use these for stage transitions (mark complete → check conditions → load next agent), artifact tracking (what each stage produces), and resumption (restart from last completed stage).

**Acceptance Criteria:**

1. Build stage definitions document created at `docs/phase-1-build-stages.md`
2. All 6 stages defined in BMAD workflow format based on architecture.md v1.5:
   - Stage 1: Project Setup (Monorepo, dependencies, placeholder library)
   - Stage 2: Frontend Foundation (Next.js App Router, routing, layouts, styling)
   - Stage 3: Multi-Step Form (React Hook Form, Zod validation, reCAPTCHA, TCPA)
   - Stage 4: Airtable Integration (Serverless functions, Airtable SDK, duplicate detection)
   - Stage 5: Make.com Automation (Content generation, PMax asset export, deployment hooks)
   - Stage 6: Deployment & Testing (Netlify deployment, E2E tests, Core Web Vitals validation)
3. For each stage, document: entry criteria (what must be complete to start), primary deliverables/artifacts (what this stage produces), exit criteria (objective, testable success conditions), success metrics (specific validation checks)
4. Entry/exit criteria are objective and testable (e.g., "All tests pass" not "Code quality is good")
5. Dependencies between stages explicitly documented (Stage N cannot start until Stage N-1 exit criteria met)
6. Stage definitions map to architecture.md components: Stage 1 (monorepo layout), Stage 2 ([slug]/[location]/[slug] routes), Stage 3 (FormContext + MarketingContext), Stage 4 (AirtableService + RecaptchaService), Stage 5 (Make.com scenarios), Stage 6 (Netlify Functions + Playwright)
7. Build stages committed to Git with message: `docs: define Phase 1 autonomous build stage criteria based on architecture.md v1.5`

---

#### Story 3.3: Create Session Starter Configuration

**As a** Phase 0 developer,
**I want** a session configuration file that Claude Code can load to start Phase 1 autonomously,
**so that** Phase 1 begins with all context, credentials, and validation gates pre-configured for BMAD Orchestrator execution.

**BMAD Workflow Context:** Session config maps to BMAD Orchestrator workflow execution model. BMAD provides workflow state tracking, checkpoint/resume, and artifact passing - config specifies Phase 1-specific settings.

**Acceptance Criteria:**

1. Configuration file created at `Landing Pages Automation/claude-session-config.yaml`
2. Configuration includes `context_files` section listing all files from Story 3.1 with loading priorities
3. Configuration includes `credentials` section template with environment variable references: `${TAVILY_API_KEY}`, `${AIRTABLE_API_KEY}`, etc. (NO hardcoded secrets - validated via grep or security scan)
4. Configuration includes `checkpoint_triggers` section defining: time-based checkpoints (every 30 minutes), error-triggered checkpoints (on exception/failure), phase-completion checkpoints (after each stage)
5. Configuration includes `workflow_reference` pointing to Phase 1 build stage definitions (Story 3.2) for BMAD Orchestrator stage management
6. YAML structure is valid and parseable (validated with YAML linter or manual parse test - either method acceptable)
7. Session config committed to Git with message: `feat: create Phase 1 session starter configuration for BMAD Orchestrator`

---

#### Story 3.4: Define Success Criteria for All Build Stages

**As a** Phase 0 developer,
**I want** success criteria from build stage definitions integrated into session configuration,
**so that** BMAD Orchestrator has automated validation gates to detect when stages complete successfully during Phase 1 autonomous execution.

**Acceptance Criteria:**

1. Session configuration (Story 3.3) `success_criteria` section maps all 6 stage exit criteria from Story 3.2
2. Each stage criterion expressed as: validation command (e.g., `npm test`, `npm run build`, `git status`), expected output/exit code, failure handling instruction (retry, checkpoint, abort)
3. Stage 1 (Project Setup) success criteria include: Monorepo npm workspaces configured, packages/shared types created, lib/placeholders.ts implemented with 8 categories, next.config.js + tailwind.config.js + middleware.ts created, TypeScript compiles without errors
4. Stage 2 (Frontend Foundation) success criteria include: App Router structure created ([slug] + [location]/[slug] routes), Root layout with GTM implemented, globals.css with Tailwind configured, Next.js builds successfully, placeholder images loading correctly
5. Stage 3 (Multi-Step Form) success criteria include: MultiStepForm orchestrator component created, Step1BasicInfo + Step2ProjectDetails + Step3TCPAConsent components functional, FormContext + MarketingContext providers working, Zod validation schemas (step1-schema, step2-schema, step3-schema) in packages/shared, reCAPTCHA v3 integrated, form submission flow tested
6. Stage 4 (Airtable Integration) success criteria include: Netlify Functions deployed (submit-form, validate-recaptcha, webhook-make-com routes), AirtableService with CRUD operations functional, RecaptchaService with score validation working, DuplicateDetectionService (5-min window) tested, form submissions successfully writing to Airtable
7. Stage 5 (Make.com Automation) success criteria include: Make.com Scenario 1 (content generation) configured and tested, Make.com Scenario 2 (deployment trigger) configured and tested, Claude API integration functional (content + PMax assets), Netlify build hook triggering successfully
8. Stage 6 (Deployment & Testing) success criteria include: Netlify production deployment successful, DNS/domain configured, Playwright E2E tests pass (form submission, validation, thank-you page), Core Web Vitals validated (LCP <2.5s, INP <200ms, CLS <0.1), Lighthouse score ≥90

---

#### Story 3.5: Validate Session Configuration Loading

**As a** Phase 0 developer,
**I want** to test that session configuration loads without errors in Claude Code,
**so that** Phase 1 can start autonomously without configuration failures blocking progress.

**Acceptance Criteria:**

1. Attempt to load `claude-session-config.yaml` in Claude Code environment (manual test or via script if validator available)
2. YAML parsing successful: no syntax errors, all required sections present (context_files, credentials, checkpoint_triggers, success_criteria, workflow_reference)
3. Context file paths validated: all referenced files either exist or are documented as "Phase 1 will create"
4. Environment variable references validated: placeholders follow correct syntax `${VAR_NAME}`, no hardcoded secrets present (security scan confirms)
5. Checkpoint trigger logic validated: time intervals reasonable (30min not 30sec), error handling appropriate
6. If loading fails: document specific errors in `docs/phase-0-validation-log.md`, fix configuration, re-test until successful load
7. Successful configuration loading documented in validation log with timestamp and any warnings/notes
8. Add negative test cases: Test with missing environment variable (expect graceful error), Test with malformed YAML (expect parse error with line number), Test with invalid file path (expect clear file-not-found error)

---

#### Story 3.6: Perform Phase 0 Completion Validation

**As a** Phase 0 developer,
**I want** comprehensive validation that all Phase 0 deliverables meet requirements and integrate correctly,
**so that** Phase 1 handoff is smooth and Phase 0 is confidently marked complete.

**Acceptance Criteria:**

1. Pre-Core Development Checklist (Story 1.1) reviewed: all items marked complete with validation evidence
2. Integration testing checklist from Risk 7 mitigation executed: all 4 tests pass (agent activation with living docs, session config references agents, MCP mappings consistent, no command conflicts)
3. Token reduction validation from Risk 5 mitigation executed: baseline documented, two-tier system measured, ≥30% reduction achieved (or actual percentage documented if target not met with analysis)
4. Git history reviewed: all deliverables committed with meaningful messages following Conventional Commits (feat:, docs:, chore:)
5. Risk mitigation review: all HIGH and CRITICAL risks addressed or explicitly deferred with justification documented
6. BMAD Integration validation: Verify all 3 agents discoverable by BMAD Orchestrator, workflow stage definitions compatible with BMAD workflow-management format, session config maps correctly to BMAD execution model
7. Phase 0 completion report created at `docs/phase-0-completion-report.md` including: deliverables summary, validation results, known issues/limitations, lessons learned, Phase 1 readiness assessment, BMAD integration confirmation
8. Context saved via `/sc:save` command for Phase 1 handoff with session name: `phase-0-complete-handoff`

---

## Checklist Results Report

### PM Checklist Validation Summary

**Validation Date:** 2025-10-06
**Overall PRD Completeness:** 88% (HIGH QUALITY)
**MVP Scope Assessment:** ✅ Just Right
**Architecture Readiness:** ✅ Ready with Recommended Improvements

---

### Category Scores

| Category | Status | Score | Key Findings |
|----------|--------|-------|--------------|
| Problem Definition & Context | PARTIAL | 75% | Strong problem articulation, missing competitive analysis |
| MVP Scope Definition | PASS | 92% | Excellent in/out scope clarity, rationale documented |
| User Experience Requirements | N/A | N/A | Appropriately skipped (no UI in Phase 0) |
| Functional Requirements | PASS | 95% | 18 FRs properly sequenced by dependency |
| Non-Functional Requirements | PASS | 90% | 11 NFRs with measurable targets |
| Epic & Story Structure | PASS | 90% | 3 epics, 17 stories, BMAD integration clear |
| Technical Guidance | PASS | 85% | BMAD assumptions documented, minor AC ambiguity |
| Cross-Functional Requirements | PARTIAL | 70% | Integration strong, data/ops schemas light |
| Clarity & Communication | PASS | 92% | Well-structured, consistent terminology |

---

### Critical Findings

**🔴 Blockers:** None - PRD is ready for architecture phase

**🟡 High Priority Recommendations (Should Address):**

1. **Add Solo Developer Persona:** Define target user explicitly with skills, constraints, pain points
2. **Objectify Story 2.1-2.3 AC2:** Add persona quality checklist: "Persona includes: role (job title), style (communication approach), identity (key characteristics), focus (primary concern), ≥3 core principles"
3. **Define Story 2.5 Mismatch Criteria:** Specify validation failure: "Mismatch = (a) agent references MCP not in mappings, (b) mappings document MCP not used by agent, (c) usage pattern differs from documented pattern"
4. **Add Independent QA to Story 3.6:** Include AC: "Independent review by QA role or fresh perspective confirms evidence proves completion"

**🟢 Medium Priority Improvements (Would Enhance):**

5. **Add Competitive Analysis:** Why BMAD + Phase 0 vs. alternatives (manual coordination, other agent frameworks)
6. **Specify Token Counter Tool:** Story 1.3 AC5 needs explicit tool: "Use Anthropic token counter CLI if available, else 4 chars ≈ 1 token approximation"
7. **Add Data Schema Requirements:** FR20: "System shall define data schemas for research documents, agent-MCP mappings, and build stage definitions"
8. **Add Risk Summary Table:** Quick reference at top of Risks section with Risk #, Title, Impact, Owner

---

### MVP Scope Assessment

**✅ Appropriately Minimal:**
- 3 agents (not 10+)
- 6 Phase 1 stages (not granular task breakdown)
- Manual validation (not full automation infrastructure)
- Foundation-only (no premature Phase 1 implementation)

**Timeline Reality Check:**
- **Claimed:** 4 days (32 work hours at 8hr/day)
- **Detailed Estimate:** 33-44 hours based on story complexity analysis
- **Assessment:** TIGHT but achievable if focused
- **Risk:** Epic 2 (Agent Creation) may require 1.5 days instead of 1 day

**Optional Scope Reductions (If Timeline Pressure):**
- Story 1.1 (Checklist): Could use informal tracking (saves 2-3 hours)
- Story 2.5 (Validation): Could defer to Phase 1 discovery (saves 2 hours)
- Risk 11 Experiment: Could trust BMAD docs vs. validate (saves 4-6 hours)

---

### Technical Readiness

**✅ Strengths:**
- BMAD Orchestrator integration explicitly documented in Technical Assumptions
- BMAD workflow management patterns referenced throughout epics/stories
- Environment variables identified (TAVILY_API_KEY, AIRTABLE_API_KEY, MAKE_API_KEY, NETLIFY_API_TOKEN)
- 11 risks comprehensively documented with mitigation strategies
- Clear separation: Phase 0 configures BMAD, not inventing orchestration

**⚠️ Areas Needing Architect Investigation:**
1. **Risk 11 - BMAD Extended Execution:** Validate 30-hour autonomous sessions supported by BMAD workflow system
2. **Stories 1.4-1.5 - MCP Research:** Outcomes will significantly inform agent design (Make.com/Netlify availability)
3. **Story 1.3 - Token Counting:** Architect should identify specific tool or approve 4-char approximation
4. **Story 3.3 - Session Config Format:** Validate YAML structure maps to BMAD Orchestrator workflow execution model

---

### Key Strengths

1. **Requirements Organization:** FRs grouped by execution phase (Planning → Foundation → Agents → Session Config) with explicit dependencies
2. **BMAD Integration Clarity:** Every epic/story documents BMAD context (orchestrator role, workflow management capabilities)
3. **Risk Management:** 11 risks identified with specific mitigation strategies and ownership assignments
4. **Story Quality:** 17 stories with average 6-7 acceptance criteria each, mostly objective and testable
5. **Traceability:** Clear mapping from Goals → FRs → Stories → Acceptance Criteria

---

### Recommended Improvements

**Before Architect Handoff (1-2 hours):**

1. **Add to Background Context:**
   ```
   **Target User:** Solo developer with 10+ years experience building AI-powered agency tooling,
   needs to scale complex multi-stage projects without hiring team, proficient with BMAD framework.

   **Alternatives Considered:**
   - Manual AI prompting: Doesn't preserve context across sessions, requires constant human coordination
   - Traditional CI/CD: Lacks intelligence to adapt to errors, cannot handle evolving requirements
   - Other agent frameworks: No standardized coordination patterns, no living documentation system
   - BMAD + Phase 0 chosen because: Proven orchestration (BMAD Orchestrator), workflow management
     (state tracking, checkpoint/resume), and extensible framework (add agents without breaking existing)
   ```

2. **Enhance Story 2.1-2.3 AC2:**
   ```
   AC2: YAML frontmatter includes: agent metadata (name, id, title, icon), persona definition with
   required elements: role (job title), style (communication approach), identity (key characteristics),
   focus (primary concern), ≥3 core principles (following pattern from existing BMAD agents)
   ```

3. **Enhance Story 2.5 AC1:**
   ```
   AC1: Cross-reference Integration Specialist agent against agent-MCP mappings - zero mismatches where
   mismatch = (a) agent references MCP not documented in mappings, (b) mappings document MCP not used
   in agent, (c) usage pattern in agent differs from documented mapping pattern
   ```

4. **Enhance Story 3.6 AC2:**
   ```
   AC2: Integration testing checklist executed by QA role or independent reviewer (not original developer)
   - all 4 tests pass with evidence validation (screenshots/logs actually prove completion vs. claimed)
   ```

---

### Final Decision

**✅ READY FOR ARCHITECT** with recommended improvements

The PRD is comprehensive, properly structured, and ready for architectural design. The MVP scope appropriately focuses on Phase 0 infrastructure without premature Phase 1 decisions. BMAD integration is well-documented throughout all epics and stories.

**Confidence Level:** HIGH (88% completeness)

**Recommended Next Steps:**
1. Address 4 High Priority improvements (1-2 hours)
2. Hand off to Architect with this validation report
3. Architect reviews Technical Assumptions and begins Phase 0 architecture design

---

## Next Steps

### UX Expert Prompt

**Phase 0 has no UI requirements** - UX/UI work deferred to Phase 1.

Phase 0 deliverables are infrastructure-only (agent definitions, documentation systems, MCP research, session configuration). No user interfaces, dashboards, or visual components are in scope for Phase 0.

**UX Expert engagement begins in Phase 1** when building the actual landing pages automation system with Airtable interfaces, preview systems, and approval workflows.

### Architect Prompt

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
