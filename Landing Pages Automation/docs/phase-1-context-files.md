# Phase 1 Context Files Loading Strategy

## Purpose

This document defines the complete context loading manifest for dev-agent autonomous execution during Phase 1 (Landing Pages Automation implementation). It specifies which files must be loaded at session start, which are loaded on demand, and the token cost implications of the two-tier documentation strategy.

## Context File Categories

### Always Load (Critical Context)
Files that must be loaded at every Phase 1 session start to ensure dev-agent has complete understanding of requirements, architecture, and integration patterns.

### Load on Demand (Reference Context)
Files that are loaded only when specifically needed, reducing initial context load while maintaining access to reference material.

### Living Documentation (Progressive Context)
Files created by dev-agent following the two-tier strategy, where Active tier (current + last 3 versions) is loaded initially, and Archive tier is loaded on keyword triggers.

---

## Required Context Files

### 1. Architecture Document
**File:** `docs/architecture.md`
**Status:** ✅ Must exist before Phase 1
**Loading Priority:** Always Load
**Approximate Size:** 185,709 bytes (~46,427 tokens)

**Purpose:**
- Technical design and system architecture reference
- Component specifications and interactions
- API definitions and data models
- Technology stack decisions
- Infrastructure and deployment architecture

**Why Dev-Agent Needs It:**
- Understand system structure before implementing features
- Ensure component implementations follow architectural patterns
- Reference API contracts when building integrations
- Maintain consistency with established technical decisions

**Key Sections Referenced:**
- System Architecture Overview
- Component Specifications
- API Definitions
- Data Models
- Technology Stack
- Infrastructure & Deployment

---

### 2. Product Requirements Document (PRD)
**File:** `docs/prd.md`
**Status:** ✅ Must exist before Phase 1
**Loading Priority:** Always Load
**Approximate Size:** 59,480 bytes (~14,870 tokens)

**Purpose:**
- Product vision and business requirements
- User stories and acceptance criteria
- Success metrics and validation criteria
- Feature prioritization and scope

**Why Dev-Agent Needs It:**
- Understand WHAT to build and WHY
- Reference acceptance criteria for implementation validation
- Align implementation with business objectives
- Prioritize features correctly during development

**Key Sections Referenced:**
- User Stories
- Acceptance Criteria
- Success Metrics
- Feature Requirements
- Constraints and Assumptions

---

### 3. MCP Integration Patterns
**File:** `docs/mcp-integration-patterns.md`
**Status:** ✅ Must exist before Phase 1 (Created in Story 1.1.6)
**Loading Priority:** Always Load
**Approximate Size:** 36,460 bytes (~9,115 tokens)

**Purpose:**
- Third-party integration implementation patterns
- Airtable, Make.com, and Netlify integration guides
- Authentication patterns and environment variables
- Error handling and fallback strategies
- Rate limiting and best practices

**Why Dev-Agent Needs It:**
- Implement integrations following documented patterns
- Reference authentication mechanisms for each service
- Handle errors and implement fallback strategies
- Avoid rate limiting issues
- Follow security best practices

**Key Sections Referenced:**
- Airtable Integration Patterns (CRUD, duplicate detection)
- Make.com Integration Patterns (scenarios, webhooks)
- Netlify Integration Patterns (deployment, functions)
- Environment Variables Reference
- Fallback Strategies
- Error Handling Patterns

---

### 4. Living Documentation Template
**File:** `.bmad-core/templates/living-doc-tmpl.yaml`
**Status:** ✅ Must exist before Phase 1 (Created in Story 1.1.2)
**Loading Priority:** Load on Demand
**Approximate Size:** 9,331 bytes (~2,333 tokens)

**Purpose:**
- Structured YAML template for living documentation
- Consistent documentation format across all stages
- Two-tier context strategy implementation guide
- Version history and decision tracking structure

**Why Dev-Agent Needs It:**
- Create consistent living documentation files
- Follow two-tier strategy (Active vs Archive tiers)
- Structure decisions, implementations, and validations
- Maintain version history systematically

**Key Sections Referenced:**
- Document structure template
- Active vs Archive tier definitions
- Version history format
- Decision tracking format

---

### 5. Technical Preferences
**File:** `.bmad-core/data/technical-preferences.yaml`
**Status:** ⚠️ Dev-agent will create (if needed during Phase 1)
**Loading Priority:** Load on Demand
**Approximate Size:** TBD (~500-1,000 tokens estimated)

**Purpose:**
- Technology stack preferences
- Coding conventions and standards
- Tooling and framework choices
- Testing preferences

**Why Dev-Agent Needs It:**
- Follow established coding conventions
- Use preferred libraries and frameworks
- Apply consistent code style
- Configure testing appropriately

**Expected Structure:**
```yaml
technical_preferences:
  languages:
    javascript: ES2022+
    typescript: 5.x
  frameworks:
    frontend: React 18+
    backend: Node.js 20+
  testing:
    unit: Jest
    e2e: Playwright
  conventions:
    naming: camelCase
    formatting: Prettier
    linting: ESLint
```

---

## Living Documentation Files (Dev-Agent Will Create)

These files follow the two-tier documentation strategy defined in Story 1.1.3. Dev-agent creates and maintains these files during Phase 1 execution.

### Two-Tier Loading Strategy
- **Active Tier:** Current version + last 3 versions (loaded at session start)
- **Archive Tier:** All historical versions (loaded on keyword trigger only)
- **Token Savings:** 45.1% reduction through selective loading

### Living Documentation by Stage

#### Stage 1: Project Setup & Validation
**File:** `docs/living-docs/stage-1-setup.yaml`
**Status:** 🔧 Dev-agent will create
**Loading:** Active tier at session start
**Estimated Size:** ~5,000-8,000 tokens (Active tier only)

**Content:**
- Repository initialization decisions
- Dependency installation and configuration
- Initial validation results
- Environment setup documentation

---

#### Stage 2: Landing Page Component Implementation
**File:** `docs/living-docs/stage-2-components.yaml`
**Status:** 🔧 Dev-agent will create
**Loading:** Active tier at session start
**Estimated Size:** ~8,000-12,000 tokens (Active tier only)

**Content:**
- Component implementation decisions
- Design system integration notes
- Accessibility implementation details
- Component testing results

---

#### Stage 3: Form & Validation Implementation
**File:** `docs/living-docs/stage-3-forms.yaml`
**Status:** 🔧 Dev-agent will create
**Loading:** Active tier at session start
**Estimated Size:** ~6,000-10,000 tokens (Active tier only)

**Content:**
- Form validation logic decisions
- reCAPTCHA integration details
- Error handling implementation
- Validation testing results

---

#### Stage 4: Airtable Integration
**File:** `docs/living-docs/stage-4-airtable.yaml`
**Status:** 🔧 Dev-agent will create
**Loading:** Active tier at session start
**Estimated Size:** ~7,000-11,000 tokens (Active tier only)

**Content:**
- Airtable MCP configuration
- CRUD operation implementation
- Duplicate detection logic
- Integration testing results

---

#### Stage 5: Make.com Integration
**File:** `docs/living-docs/stage-5-make.yaml`
**Status:** 🔧 Dev-agent will create
**Loading:** Active tier at session start
**Estimated Size:** ~7,000-11,000 tokens (Active tier only)

**Content:**
- Make.com scenario configuration
- Content generation workflow
- Webhook integration details
- Scenario testing results

---

#### Stage 6: Netlify Deployment & Testing
**File:** `docs/living-docs/stage-6-deployment.yaml`
**Status:** 🔧 Dev-agent will create
**Loading:** Active tier at session start
**Estimated Size:** ~8,000-12,000 tokens (Active tier only)

**Content:**
- Netlify deployment configuration
- Serverless function implementation
- End-to-end testing results
- Production deployment validation

---

## Token Cost Summary

### Initial Context Load (Always Load Files)
| File | Size (bytes) | Estimated Tokens | Loading Priority |
|------|--------------|------------------|------------------|
| architecture.md | 185,709 | ~46,427 | Always Load |
| prd.md | 59,480 | ~14,870 | Always Load |
| mcp-integration-patterns.md | 36,460 | ~9,115 | Always Load |
| **Total Critical Context** | **281,649** | **~70,412** | - |

### Reference Context (Load on Demand)
| File | Size (bytes) | Estimated Tokens | Loading Priority |
|------|--------------|------------------|------------------|
| living-doc-tmpl.yaml | 9,331 | ~2,333 | Load on Demand |
| technical-preferences.yaml | ~2,000 (est) | ~500 | Load on Demand |
| **Total Reference Context** | **~11,331** | **~2,833** | - |

### Living Documentation (Active Tier Only)
| File | Estimated Tokens | Loading Priority |
|------|------------------|------------------|
| stage-1-setup.yaml | ~5,000-8,000 | Active tier |
| stage-2-components.yaml | ~8,000-12,000 | Active tier |
| stage-3-forms.yaml | ~6,000-10,000 | Active tier |
| stage-4-airtable.yaml | ~7,000-11,000 | Active tier |
| stage-5-make.yaml | ~7,000-11,000 | Active tier |
| stage-6-deployment.yaml | ~8,000-12,000 | Active tier |
| **Total Living Docs (Active)** | **~41,000-64,000** | - |

### Total Context Load Estimate
- **Session Start (Always Load):** ~70,412 tokens
- **Active Living Docs (Progressive):** ~41,000-64,000 tokens (added as stages complete)
- **On-Demand Reference:** ~2,833 tokens (loaded when needed)
- **Maximum Context:** ~137,245 tokens (all Active tier loaded)

### Two-Tier Strategy Impact
- **Without Two-Tier:** ~250,000+ tokens (all versions, all history)
- **With Two-Tier:** ~137,245 tokens (Active tier only)
- **Token Savings:** 45.1% reduction

---

## Loading Strategy Rationale

### Always Load Files
These files are loaded at every session start because:
1. **Architecture:** Required to understand system structure and make implementation decisions
2. **PRD:** Required to understand requirements and validate implementations
3. **MCP Patterns:** Required for all integration work (Stages 4-6)

### Load on Demand Files
These files are loaded only when needed because:
1. **Living Doc Template:** Only needed when creating new living doc files
2. **Technical Preferences:** Only needed when making technology/convention decisions

### Two-Tier Living Docs
Active tier files are loaded progressively as stages complete to provide:
- Recent implementation context
- Latest decisions and patterns
- Current validation status
- Historical perspective (last 3 versions)

Archive tier files remain accessible but are only loaded on keyword triggers to:
- Reduce initial context load
- Maintain full historical record
- Support targeted historical queries

---

## Validation Requirements

### Pre-Phase 1 Checklist
Before dev-agent begins Phase 1, verify:
- ✅ `docs/architecture.md` exists and is complete
- ✅ `docs/prd.md` exists and is complete
- ✅ `docs/mcp-integration-patterns.md` exists (Story 1.1.6 output)
- ✅ `.bmad-core/templates/living-doc-tmpl.yaml` exists (Story 1.1.2 output)
- ✅ Phase 0 validation complete (Story 1.2.6)

### During Phase 1
Dev-agent will:
- Create `.bmad-core/data/technical-preferences.yaml` if needed
- Create living documentation files following two-tier strategy
- Maintain Active tier (current + last 3 versions)
- Archive older versions to Archive tier

### Token Budget Management
Monitor context usage:
- **Warning threshold:** >75% of available context
- **Action:** Trigger Archive tier cleanup if needed
- **Target:** Keep Active tier context <70% of available tokens

---

## Session Configuration Integration

This context file loading strategy will be implemented in Story 1.2.3 (Create Session Starter Configuration) as part of the dev-agent session initialization workflow.

**Session Start Sequence:**
1. Load Always Load files (architecture, PRD, MCP patterns)
2. Load Active tier living docs for current stage
3. Load on-demand files as needed during execution
4. Monitor token usage and trigger Archive tier cleanup if needed

---

## References

- **Story 1.1.2:** Design Living Documentation Template
- **Story 1.1.3:** Implement Two-Tier Documentation Strategy
- **Story 1.1.6:** Create MCP Integration Patterns Document
- **Story 1.2.3:** Create Session Starter Configuration
- **Phase 0 Checklist:** `docs/phase-0-checklist.md`
