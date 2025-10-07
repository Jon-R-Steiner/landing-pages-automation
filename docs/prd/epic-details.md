# Epic Details

## Epic 1: Foundation Infrastructure

**Epic Goal:** Establish living documentation system and MCP integration research foundation to enable dev-agent Phase 1 execution with comprehensive context.

### Story 0.1: Initialize Phase 0 Project Structure

**As a** Phase 0 developer,
**I want** a properly initialized project structure with necessary directories and Git configuration,
**so that** all subsequent Phase 0 work has the correct foundation to build upon.

**Acceptance Criteria:**

1. Verify Git repository exists in `web-bundles` workspace root (if not, initialize with `git init`)
2. Create Phase 0 directory structure if it doesn't exist:
   - `Landing Pages Automation/docs/` (root documentation folder)
   - `Landing Pages Automation/docs/mcp-research/` (for MCP research findings)
   - `.bmad-core/templates/` (for living documentation template)
3. Verify `.gitignore` file exists and includes standard exclusions: `.env*`, `node_modules/`, `.DS_Store`, `*.log`, `.claude/local-*`
4. Create `Landing Pages Automation/docs/README.md` with Phase 0 project overview and deliverables list
5. Verify directory structure with `tree` command or manual inspection showing all folders created
6. Initial commit created if any new directories added with message: `chore: initialize Phase 0 project structure`
7. Document structure validation in `Landing Pages Automation/docs/phase-0-validation-log.md`

---

### Story 1.0: Install and Validate Required MCP Servers

**As a** Phase 0 developer,
**I want** all required MCP servers installed and validated before beginning research,
**so that** MCP-dependent stories (1.4, 1.5) can execute without installation blockers.

**Acceptance Criteria:**

1. Verify Tavily MCP is installed in Claude Code environment (check available MCP servers list)
2. If Tavily MCP not installed, install following official installation instructions
3. Obtain Tavily API key from https://app.tavily.com and store in environment variable `TAVILY_API_KEY`
4. Test Tavily MCP with simple search query: "test MCP integration" - verify results returned without errors
5. Verify Context7 MCP is available in Claude Code environment (check MCP servers list)
6. If Context7 not available, document alternative approach for Story 1.6 (manual documentation lookup)
7. Create `Landing Pages Automation/docs/mcp-setup-instructions.md` documenting:
   - MCP installation steps performed
   - Environment variables required (with placeholder values, NO actual secrets)
   - MCP activation commands
   - Troubleshooting notes
8. Document environment variables in `Landing Pages Automation/docs/phase-0-env-vars.md`: `TAVILY_API_KEY` (required), others TBD
9. Installation validation logged in `Landing Pages Automation/docs/phase-0-validation-log.md` with:
   - Timestamp of installation
   - MCP versions (if available)
   - Test query results
   - Any warnings or issues encountered
10. MCP setup committed to Git with message: `chore: install and configure required MCP servers for Phase 0`

---

### Story 1.1: Create Pre-Core Development Checklist

**As a** Phase 0 developer,
**I want** a comprehensive checklist with sequenced tasks and dependencies,
**so that** I can track Phase 0 progress systematically and ensure nothing is missed.

**Acceptance Criteria:**

1. Checklist document created in `Landing Pages Automation/docs/phase-0-checklist.md`
2. All FR1-FR12 requirements mapped to checklist items with clear pass/fail criteria
3. Dependencies between checklist items explicitly documented, including:
   - Story 0.1 (Project Structure) must complete before all other stories
   - Story 1.0 (MCP Installation) must complete before Stories 1.4, 1.5 (MCP Research)
   - MCP Research (Stories 1.4-1.6) must complete before Session Config (Epic 2)
4. Exit criteria for Phase 0 completion clearly defined and measurable
5. Checklist references Risk mitigation strategies from Risks & Mitigation section for high-impact items
6. Document committed to Git with message: `docs: create Phase 0 Pre-Core Development checklist`

---

### Story 1.2: Design Living Documentation Template

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

### Story 1.3: Implement Two-Tier Documentation Context Strategy

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

### Story 1.4: Research Make.com MCP Availability

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

### Story 1.5: Research Netlify MCP Availability

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

### Story 1.6: Create MCP Integration Patterns Document

**As a** dev-agent (Phase 1),
**I want** documented MCP integration patterns for Airtable, Make.com, and Netlify,
**so that** I can implement third-party integrations following best practices with fallback strategies.

**Acceptance Criteria:**

1. Integration patterns document created at `docs/mcp-integration-patterns.md`
2. Document provides implementation guidance for each MCP based on research findings:
   - Airtable MCP: CRUD operations, authentication patterns, error handling
   - Make.com: MCP usage if available OR HTTP/REST fallback with example API calls
   - Netlify: MCP usage if available OR HTTP/REST fallback with deployment patterns
3. For each integration, document: authentication requirements, common operations (with code examples), error handling patterns, rate limiting considerations
4. Include environment variable reference: `AIRTABLE_API_KEY`, `MAKE_API_KEY` (if used), `NETLIFY_API_TOKEN` (if used)
5. Include fallback strategies for scenarios where MCPs are unavailable or rate-limited
6. Document committed to Git with message: `docs: create MCP integration patterns for dev-agent reference`

---

## Epic 2: Session Configuration & Phase 1 Preparation

**Epic Goal:** Configure session starter for dev-agent with Phase 1 workflow definition and comprehensive context files, enabling autonomous 30-hour Phase 1 execution and complete Phase 0 handoff.

**Purpose:** Enables dev-agent to load complete project context (architecture.md, PRD, MCP research, living docs) and execute Phase 1 build autonomously with validation gates at each stage.

### Story 2.1: Identify Phase 1 Context Files

**As a** Phase 0 developer,
**I want** a documented list of context files Phase 1 must load,
**so that** session configuration references all necessary files for autonomous Phase 1 execution.

**Acceptance Criteria:**

1. Context files list documented in `docs/phase-1-context-files.md`
2. List includes: `docs/architecture.md` (exists from Phase 0), `docs/prd.md` (this document), `docs/mcp-integration-patterns.md` (Story 1.6), `.bmad-core/templates/living-doc-tmpl.yaml` (Story 1.2), `.bmad-core/data/technical-preferences.yaml`
3. For each context file, document: purpose (why dev-agent needs it), loading priority (always load vs. load on demand), approximate token cost
4. Include living documentation files dev-agent will create following two-tier strategy (Active tier files only for initial load)
5. Explicitly mark files as "must exist before Phase 1" vs. "dev-agent will create" with expected structure notes
6. Context files list committed to Git with message: `docs: define Phase 1 context file loading strategy`

---

### Story 2.2: Document Phase 1 Build Stage Definitions

**As a** Phase 0 developer,
**I want** explicit definitions for all 6 Phase 1 build stages with success criteria,
**so that** dev-agent workflow configuration has measurable validation gates for autonomous progress tracking.

**Purpose:** This story creates workflow stage definitions that dev-agent will use for stage transitions, artifact tracking (what each stage produces), and resumption (restart from last completed stage).

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

### Story 2.3: Create Session Starter Configuration

**As a** Phase 0 developer,
**I want** a session configuration file that Claude Code can load to start Phase 1 autonomously,
**so that** Phase 1 begins with all context, credentials, and validation gates pre-configured for dev-agent execution.

**Purpose:** Session config enables dev-agent activation with complete project context, checkpoint/resume capabilities, and workflow state tracking for Phase 1-specific execution.

**Acceptance Criteria:**

1. Configuration file created at `Landing Pages Automation/claude-session-config.yaml`
2. Configuration includes `context_files` section listing all files from Story 3.1 with loading priorities
3. Configuration includes `credentials` section template with environment variable references: `${TAVILY_API_KEY}`, `${AIRTABLE_API_KEY}`, etc. (NO hardcoded secrets - validated via grep or security scan)
4. Configuration includes `checkpoint_triggers` section defining: time-based checkpoints (every 30 minutes), error-triggered checkpoints (on exception/failure), phase-completion checkpoints (after each stage)
5. Configuration includes `workflow_reference` pointing to Phase 1 build stage definitions (Story 3.2) for BMAD Orchestrator stage management
6. YAML structure is valid and parseable (validated with YAML linter or manual parse test - either method acceptable)
7. Session config committed to Git with message: `feat: create Phase 1 session starter configuration for BMAD Orchestrator`

---

### Story 2.4: Define Success Criteria for All Build Stages

**As a** Phase 0 developer,
**I want** success criteria from build stage definitions integrated into session configuration,
**so that** dev-agent has automated validation gates to detect when stages complete successfully during Phase 1 autonomous execution.

**Acceptance Criteria:**

1. Session configuration (Story 2.3) `success_criteria` section maps all 6 stage exit criteria from Story 2.2
2. Each stage criterion expressed as: validation command (e.g., `npm test`, `npm run build`, `git status`), expected output/exit code, failure handling instruction (retry, checkpoint, abort)
3. Stage 1 (Project Setup) success criteria include: Monorepo npm workspaces configured, packages/shared types created, lib/placeholders.ts implemented with 8 categories, next.config.js + tailwind.config.js + middleware.ts created, TypeScript compiles without errors
4. Stage 2 (Frontend Foundation) success criteria include: App Router structure created ([slug] + [location]/[slug] routes), Root layout with GTM implemented, globals.css with Tailwind configured, Next.js builds successfully, placeholder images loading correctly
5. Stage 3 (Multi-Step Form) success criteria include: MultiStepForm orchestrator component created, Step1BasicInfo + Step2ProjectDetails + Step3TCPAConsent components functional, FormContext + MarketingContext providers working, Zod validation schemas (step1-schema, step2-schema, step3-schema) in packages/shared, reCAPTCHA v3 integrated, form submission flow tested
6. Stage 4 (Airtable Integration) success criteria include: Netlify Functions deployed (submit-form, validate-recaptcha, webhook-make-com routes), AirtableService with CRUD operations functional, RecaptchaService with score validation working, DuplicateDetectionService (5-min window) tested, form submissions successfully writing to Airtable
7. Stage 5 (Make.com Automation) success criteria include: Make.com Scenario 1 (content generation) configured and tested, Make.com Scenario 2 (deployment trigger) configured and tested, Claude API integration functional (content + PMax assets), Netlify build hook triggering successfully
8. Stage 6 (Deployment & Testing) success criteria include: Netlify production deployment successful, DNS/domain configured, Playwright E2E tests pass (form submission, validation, thank-you page), Core Web Vitals validated (LCP <2.5s, INP <200ms, CLS <0.1), Lighthouse score ≥90

---

### Story 2.5: Validate Session Configuration Loading

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

### Story 2.6: Perform Phase 0 Completion Validation

**As a** Phase 0 developer,
**I want** comprehensive validation that all Phase 0 deliverables meet requirements and integrate correctly,
**so that** Phase 1 handoff is smooth and Phase 0 is confidently marked complete.

**Acceptance Criteria:**

1. Pre-Core Development Checklist (Story 1.1) reviewed: all items marked complete with validation evidence
2. Integration testing checklist from Risk 7 mitigation executed: all tests pass (architecture.md references MCP patterns, session config context files complete, build stage definitions align with architecture)
3. Token reduction validation from Risk 5 mitigation executed: baseline documented, two-tier system measured, ≥30% reduction achieved (or actual percentage documented if target not met with analysis)
4. Git history reviewed: all deliverables committed with meaningful messages following Conventional Commits (feat:, docs:, chore:)
5. Risk mitigation review: all HIGH and CRITICAL risks addressed or explicitly deferred with justification documented
6. Architecture completeness validation: Verify architecture.md contains all required sections for dev-agent autonomous implementation (data models, API specs, component definitions, deployment architecture)
7. Phase 0 completion report created at `docs/phase-0-completion-report.md` including: deliverables summary, validation results, known issues/limitations, lessons learned, Phase 1 readiness assessment, architecture completeness confirmation
8. Context saved via `/sc:save` command for Phase 1 dev-agent handoff with session name: `phase-0-complete-handoff`

---
