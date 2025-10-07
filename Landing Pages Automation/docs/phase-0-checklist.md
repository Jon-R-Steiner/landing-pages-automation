# Phase 0 Pre-Core Development Checklist

## Purpose

This checklist provides systematic tracking for all Phase 0 deliverables with clear pass/fail criteria, documented dependencies, and measurable exit criteria. Use this checklist to ensure nothing is missed before beginning Phase 1 core development.

**Status:** In Progress
**Last Updated:** 2025-10-07
**Owner:** Dev Agent (James)

---

## Story Dependencies

### Dependency Map

```
Story 1.0.1 (Project Structure)
    ↓
    ├→ Story 1.1.0 (MCP Installation) ────→ Story 1.1.4 (Make.com Research)
    ├→ Story 1.1.1 (This Checklist)   ────→ Story 1.1.5 (Netlify Research)
    ├→ Story 1.1.2 (Living Doc Template)
    └→ Story 1.1.3 (Two-Tier Documentation)
                                           ↓
                        Stories 1.1.4, 1.1.5, 1.1.6 (MCP Research Complete)
                                           ↓
                ┌──────────────────────────┴──────────────────────────┐
                ↓                                                      ↓
    Story 1.2.1 (Identify Context Files)              Story 1.2.4 (Success Criteria)
    Story 1.2.2 (Build Stage Definitions)
    Story 1.2.3 (Session Configuration)
    Story 1.2.5 (Validate Config Loading)
                ↓
    Story 1.2.6 (Phase 0 Completion Validation)
```

### Critical Path

1. **Must Complete First:** Story 1.0.1 (Project Structure) - blocks all other stories
2. **Must Complete Before MCP Research:** Story 1.1.0 (MCP Installation) - blocks Stories 1.1.4, 1.1.5
3. **Must Complete Before Epic 2:** Stories 1.1.4, 1.1.5, 1.1.6 (MCP Research) - blocks all Epic 2 stories

---

## FR1-FR12 Requirements Checklist

### Planning Phase

#### ☑ FR1: Pre-Core Development Checklist

**Status:** ✅ COMPLETE

**Requirements:**
- [x] Checklist created with sequenced tasks
- [x] Dependencies identified and mapped
- [x] Exit criteria defined for Phase 0 completion

**Pass/Fail Criteria:**
- ✅ PASS: All FR1-FR12 requirements have corresponding checklist items
- ✅ PASS: Dependencies explicitly documented with visual diagram
- ✅ PASS: Exit criteria section included with measurable criteria
- ✅ PASS: Document committed to Git

**Verification:**
```bash
# Check file exists
ls -la "Landing Pages Automation/docs/phase-0-checklist.md"

# Verify in Git
git log --oneline --all -- "Landing Pages Automation/docs/phase-0-checklist.md"
```

**Risk Reference:** None - foundational planning document

---

### Foundation Phase (Parallel Execution)

#### ☐ FR2: Living Documentation Template

**Status:** NOT STARTED

**Requirements:**
- [ ] Create `living-doc-tmpl.yaml` in `.bmad-core/templates/`
- [ ] Include three structured sections:
  - [ ] Prescriptive (before implementation)
  - [ ] Reflective (after testing)
  - [ ] Evolution History
- [ ] Template follows BMAD YAML structure

**Pass/Fail Criteria:**
- ✅ PASS: File exists at `.bmad-core/templates/living-doc-tmpl.yaml`
- ✅ PASS: Contains all three required sections
- ✅ PASS: Matches existing BMAD template patterns
- ❌ FAIL: Missing any required section or invalid YAML

**Verification:**
```bash
# Check file exists
ls -la ".bmad-core/templates/living-doc-tmpl.yaml"

# Validate YAML syntax
# (Use YAML validator or attempt to parse)

# Verify sections present
grep -i "prescriptive\|reflective\|evolution" ".bmad-core/templates/living-doc-tmpl.yaml"
```

**Dependencies:** Story 1.0.1 (requires `.bmad-core/templates/` directory)

**Risk Reference:** Risk #3 (BMAD Template Specification Gap) - use existing agents as examples

---

#### ☐ FR3: Two-Tier Context Strategy

**Status:** NOT STARTED

**Requirements:**
- [ ] Implement Active tier: current + last 3 versions always loaded
- [ ] Implement Archive tier: full history loaded on keyword detection
- [ ] Document tier switching mechanism

**Pass/Fail Criteria:**
- ✅ PASS: Living documentation template defines Active/Archive tiers
- ✅ PASS: Loading strategy clearly documented
- ✅ PASS: Token reduction ≥30% measured and documented (NFR1)
- ❌ FAIL: Token reduction <30% or not measured

**Verification:**
```bash
# Check template includes tier definitions
grep -i "active\|archive\|tier" ".bmad-core/templates/living-doc-tmpl.yaml"

# Verify token reduction measurement documented
grep -i "token\|reduction" "Landing Pages Automation/docs/"*.md
```

**Dependencies:** FR2 (Living Documentation Template)

**Risk Reference:** Risk #5 (Token Reduction Baseline Undefined) - measure baseline before/after

---

#### ☐ FR4: Keyword Detection Mechanism

**Status:** NOT STARTED

**Requirements:**
- [ ] Define archive trigger keywords:
  - "why was this built"
  - "history"
  - "past errors"
  - "previous versions"
- [ ] Document keyword detection logic
- [ ] Explain how archive loading is triggered

**Pass/Fail Criteria:**
- ✅ PASS: All four keywords documented in template
- ✅ PASS: Archive loading mechanism explained
- ❌ FAIL: Missing keywords or unclear loading mechanism

**Verification:**
```bash
# Check keywords present in template
grep -i "why was this built\|history\|past errors\|previous versions" ".bmad-core/templates/living-doc-tmpl.yaml"
```

**Dependencies:** FR3 (Two-Tier Context Strategy)

**Risk Reference:** None

---

#### ☐ FR5: Make.com MCP Research

**Status:** NOT STARTED

**Requirements:**
- [ ] Research Make.com MCP availability using Tavily search
- [ ] Document MCP capabilities
- [ ] Document API coverage
- [ ] Create research document in `Landing Pages Automation/docs/mcp-research/make-com-mcp-research.md`

**Pass/Fail Criteria:**
- ✅ PASS: Research document created
- ✅ PASS: MCP availability status documented (available/not available)
- ✅ PASS: If available: capabilities and API coverage documented
- ✅ PASS: If unavailable: fallback strategy documented
- ✅ PASS: Research completed within 2-4 hours (NFR2)
- ❌ FAIL: Incomplete research or missing fallback strategy

**Verification:**
```bash
# Check research file exists
ls -la "Landing Pages Automation/docs/mcp-research/make-com-mcp-research.md"

# Verify content completeness
grep -i "availability\|capability\|api\|fallback" "Landing Pages Automation/docs/mcp-research/make-com-mcp-research.md"
```

**Dependencies:** Story 1.1.0 (requires Tavily MCP functional)

**Risk Reference:** Risk #4 (Environment Variable Specification Missing) - document `MAKE_API_KEY` if needed

---

#### ☐ FR6: Netlify MCP Research

**Status:** NOT STARTED

**Requirements:**
- [ ] Research Netlify MCP availability using Tavily search
- [ ] Document MCP capabilities
- [ ] Document API coverage
- [ ] Create research document in `Landing Pages Automation/docs/mcp-research/netlify-mcp-research.md`

**Pass/Fail Criteria:**
- ✅ PASS: Research document created
- ✅ PASS: MCP availability status documented (available/not available)
- ✅ PASS: If available: capabilities and API coverage documented
- ✅ PASS: If unavailable: fallback strategy documented
- ✅ PASS: Research completed within 2-4 hours (NFR2)
- ❌ FAIL: Incomplete research or missing fallback strategy

**Verification:**
```bash
# Check research file exists
ls -la "Landing Pages Automation/docs/mcp-research/netlify-mcp-research.md"

# Verify content completeness
grep -i "availability\|capability\|api\|fallback" "Landing Pages Automation/docs/mcp-research/netlify-mcp-research.md"
```

**Dependencies:** Story 1.1.0 (requires Tavily MCP functional)

**Risk Reference:** Risk #4 (Environment Variable Specification Missing) - document `NETLIFY_API_TOKEN` if needed

---

#### ☐ FR7: MCP Integration Patterns Document

**Status:** NOT STARTED

**Requirements:**
- [ ] Create `Landing Pages Automation/docs/mcp-integration-patterns.md`
- [ ] Document Airtable integration patterns
- [ ] Document Make.com integration patterns
- [ ] Document Netlify integration patterns
- [ ] Provide implementation guidance for dev-agent

**Pass/Fail Criteria:**
- ✅ PASS: Document created with all three integration patterns
- ✅ PASS: Each pattern includes code examples or HTTP/REST call patterns
- ✅ PASS: Patterns reference MCP research findings from FR5, FR6
- ❌ FAIL: Missing integration patterns or insufficient detail

**Verification:**
```bash
# Check document exists
ls -la "Landing Pages Automation/docs/mcp-integration-patterns.md"

# Verify all integrations covered
grep -i "airtable\|make.com\|netlify" "Landing Pages Automation/docs/mcp-integration-patterns.md"
```

**Dependencies:** FR5, FR6 (MCP Research Complete)

**Risk Reference:** Risk #4 (Environment Variable Specification Missing) - compile all required env vars

---

#### ☐ FR8: MCP Fallback Strategies

**Status:** NOT STARTED

**Requirements:**
- [ ] Define fallback strategy for Make.com MCP unavailability
- [ ] Define fallback strategy for Netlify MCP unavailability
- [ ] Include HTTP/REST call patterns with examples
- [ ] Document in MCP Integration Patterns document

**Pass/Fail Criteria:**
- ✅ PASS: Fallback strategies documented for Make.com and Netlify
- ✅ PASS: HTTP/REST patterns include example requests/responses
- ✅ PASS: Fallback strategies viable for Phase 1 implementation
- ❌ FAIL: Missing fallback or insufficient detail

**Verification:**
```bash
# Check fallback strategies present
grep -i "fallback\|http\|rest\|alternative" "Landing Pages Automation/docs/mcp-integration-patterns.md"
```

**Dependencies:** FR7 (MCP Integration Patterns Document)

**Risk Reference:** None

---

### Integration Phase (Sequential After Foundation)

#### ☐ FR9: Identify Phase 1 Context Files

**Status:** NOT STARTED

**Requirements:**
- [ ] List all Phase 1 context files to be loaded by session configuration:
  - [ ] architecture.md (or sharded architecture documents)
  - [ ] PRD (prd.md or sharded PRD documents)
  - [ ] MCP research documents (from FR5, FR6, FR7)
  - [ ] Living documentation template (from FR2)
  - [ ] technical-preferences.yaml
- [ ] Document file paths and loading order

**Pass/Fail Criteria:**
- ✅ PASS: All required context files identified
- ✅ PASS: File paths documented
- ✅ PASS: Loading order specified
- ❌ FAIL: Missing critical context files

**Verification:**
```bash
# Verify all identified files exist
ls -la docs/architecture/*.md
ls -la docs/prd/*.md
ls -la "Landing Pages Automation/docs/mcp-research/"*.md
ls -la ".bmad-core/templates/living-doc-tmpl.yaml"
```

**Dependencies:** FR2-FR8 (Foundation Phase Complete)

**Risk Reference:** Risk #11 (Architecture Document Completeness) - verify architecture.md sufficient for dev-agent

---

#### ☐ FR10: Phase 1 Build Stage Definitions

**Status:** NOT STARTED

**Requirements:**
- [ ] Document all 6 Phase 1 build stages:
  1. [ ] Project Setup
  2. [ ] Frontend Foundation
  3. [ ] Multi-Step Form
  4. [ ] Airtable Integration
  5. [ ] Make.com Automation
  6. [ ] Deployment & Testing
- [ ] Define entry criteria for each stage
- [ ] Define exit criteria for each stage
- [ ] Define success metrics for each stage
- [ ] Create document in `Landing Pages Automation/docs/phase-1-build-stages.md`

**Pass/Fail Criteria:**
- ✅ PASS: Document created with all 6 stages
- ✅ PASS: Each stage has entry criteria, exit criteria, and success metrics
- ✅ PASS: Stages align with architecture.md implementation plan
- ❌ FAIL: Missing stage definitions or incomplete criteria

**Verification:**
```bash
# Check document exists
ls -la "Landing Pages Automation/docs/phase-1-build-stages.md"

# Verify all stages present
grep -i "project setup\|frontend foundation\|multi-step form\|airtable\|make.com\|deployment" "Landing Pages Automation/docs/phase-1-build-stages.md"

# Verify criteria present
grep -i "entry criteria\|exit criteria\|success metrics" "Landing Pages Automation/docs/phase-1-build-stages.md"
```

**Dependencies:** FR9 (Context Files Identified)

**Risk Reference:** Risk #7 (Integration Testing Gaps) - verify build stages align with architecture.md

---

#### ☐ FR11: Session Starter Configuration

**Status:** NOT STARTED

**Requirements:**
- [ ] Create `claude-session-config.yaml` in `Landing Pages Automation/docs/`
- [ ] Include context files list (from FR9)
- [ ] Include credentials structure template (environment variables)
- [ ] Define checkpoint trigger definitions
- [ ] Reference build stage workflow (from FR10)

**Pass/Fail Criteria:**
- ✅ PASS: Configuration file created with valid YAML
- ✅ PASS: All context files from FR9 listed
- ✅ PASS: Environment variables documented (no hardcoded secrets - NFR6)
- ✅ PASS: Checkpoint triggers defined
- ✅ PASS: Build stage workflow referenced
- ✅ PASS: Configuration loadable by Claude Code without errors (NFR3)
- ❌ FAIL: Invalid YAML or missing required sections

**Verification:**
```bash
# Check file exists
ls -la "Landing Pages Automation/docs/claude-session-config.yaml"

# Validate YAML syntax
# (Use YAML validator or attempt to parse)

# Verify no hardcoded secrets
grep -i "api_key\|password\|token\|secret" "Landing Pages Automation/docs/claude-session-config.yaml"
# Should only find placeholder values or environment variable references
```

**Dependencies:** FR9, FR10 (Context Files and Build Stages Defined)

**Risk Reference:** Risk #4 (Environment Variable Specification Missing), Risk #6 (30-Hour Session Capability Unproven)

---

#### ☐ FR12: Build Stage Success Criteria

**Status:** NOT STARTED

**Requirements:**
- [ ] Define success criteria for all 6 Phase 1 build stages
- [ ] Reference stage definitions from FR10
- [ ] Include in session configuration (FR11) or build stage document (FR10)
- [ ] Ensure criteria are measurable and objective

**Pass/Fail Criteria:**
- ✅ PASS: Success criteria documented for all 6 stages
- ✅ PASS: Criteria are measurable and objective (NFR8)
- ✅ PASS: Criteria reference FR10 stage definitions
- ❌ FAIL: Missing criteria or subjective/unmeasurable criteria

**Verification:**
```bash
# Check criteria present in build stage document or session config
grep -i "success criteria\|measurable\|objective" "Landing Pages Automation/docs/phase-1-build-stages.md" "Landing Pages Automation/docs/claude-session-config.yaml"
```

**Dependencies:** FR10, FR11 (Build Stages and Session Config)

**Risk Reference:** None

---

## Phase 0 Exit Criteria

### All Functional Requirements Complete

- [ ] FR1: Pre-Core Development Checklist ✅ COMPLETE
- [ ] FR2: Living Documentation Template
- [ ] FR3: Two-Tier Context Strategy
- [ ] FR4: Keyword Detection Mechanism
- [ ] FR5: Make.com MCP Research
- [ ] FR6: Netlify MCP Research
- [ ] FR7: MCP Integration Patterns Document
- [ ] FR8: MCP Fallback Strategies
- [ ] FR9: Identify Phase 1 Context Files
- [ ] FR10: Phase 1 Build Stage Definitions
- [ ] FR11: Session Starter Configuration
- [ ] FR12: Build Stage Success Criteria

### All Stories Complete

**Epic 1: Foundation Infrastructure**
- [x] Story 1.0.1: Initialize Phase 0 Project Structure
- [x] Story 1.1.0: Install and Validate MCP Servers
- [ ] Story 1.1.1: Create Pre-Core Development Checklist (This Story)
- [ ] Story 1.1.2: Design Living Documentation Template
- [ ] Story 1.1.3: Implement Two-Tier Documentation Strategy
- [ ] Story 1.1.4: Research Make.com MCP Availability
- [ ] Story 1.1.5: Research Netlify MCP Availability
- [ ] Story 1.1.6: Create MCP Integration Patterns Document

**Epic 2: Living Documentation**
- [ ] Story 1.2.1: Identify Phase 1 Context Files
- [ ] Story 1.2.2: Document Phase 1 Build Stage Definitions
- [ ] Story 1.2.3: Create Session Starter Configuration
- [ ] Story 1.2.4: Define Success Criteria for Build Stages
- [ ] Story 1.2.5: Validate Session Configuration Loading
- [ ] Story 1.2.6: Perform Phase 0 Completion Validation

### Non-Functional Requirements Met

- [ ] **NFR1:** Living documentation achieves ≥30% token reduction (measured)
- [ ] **NFR2:** MCP research completed within 2-4 hours per service
- [ ] **NFR3:** Session configuration loads without errors
- [ ] **NFR4:** Phase 0 completed within 4 calendar days
- [ ] **NFR5:** Living doc template in `.bmad-core/templates/living-doc-tmpl.yaml`
- [ ] **NFR6:** Environment variables used (no hardcoded secrets)
- [ ] **NFR7:** All deliverables committed to Git
- [ ] **NFR8:** Checklist has executable pass/fail criteria (This Checklist)
- [ ] **NFR9:** Architecture.md sufficient for dev-agent autonomous execution

### Integration Validation (Risk #7)

- [ ] **Test 1:** architecture.md references all MCP integration patterns
- [ ] **Test 2:** Session config includes all necessary Phase 1 documents
- [ ] **Test 3:** Build stage definitions align with architecture.md
- [ ] **Test 4:** Living doc template compatible with architecture patterns

### Risk Mitigation Verified

- [ ] **Risk #2:** Validation approach established (manual or automated)
- [ ] **Risk #3:** BMAD template follows existing agent patterns
- [ ] **Risk #4:** All environment variables documented
- [ ] **Risk #5:** Token reduction baseline measured
- [ ] **Risk #7:** Integration tests completed
- [ ] **Risk #11:** Architecture completeness validated

### Final Gate

- [ ] All checklist items marked complete
- [ ] Validation log updated with Phase 0 completion results
- [ ] Phase 0 handoff documentation created
- [ ] Ready to begin Phase 1 core development

---

## High-Impact Items Requiring Special Attention

### Critical Path Items

**Risk #6: 30-Hour Session Capability** (CRITICAL)
- Related Items: FR11 (Session Configuration), NFR3 (Session Loading)
- Mitigation: Consider 4-hour validation test during Phase 0
- Owner: PM agent decision during Day 3

**Risk #11: Architecture Document Completeness** (CRITICAL)
- Related Items: FR9 (Context Files), NFR9 (Architecture Sufficiency)
- Mitigation: Explicit architecture completeness checklist validation
- Owner: Product Owner during Phase 0 validation

### High-Impact Items

**Risk #2: Validation Automation** (HIGH)
- Related Items: All deliverables
- Mitigation: Evaluate lightweight validation scripts (Day 2-3)
- Owner: Developer during Phase 0 execution

**Risk #7: Integration Testing** (HIGH)
- Related Items: FR9-FR12 (Integration Phase)
- Mitigation: Manual integration validation checklist (Day 4)
- Owner: QA validation during Phase 0 Day 4

---

## Usage Instructions

1. **Update Status:** Change "NOT STARTED" to "IN PROGRESS" or "COMPLETE" as work progresses
2. **Mark Checkboxes:** Check off `[ ]` items as they're completed
3. **Verify Criteria:** Run verification commands to validate completion
4. **Track Dependencies:** Don't start dependent items until prerequisites complete
5. **Reference Risks:** Review risk mitigation strategies for high-impact items
6. **Final Validation:** Ensure all exit criteria met before marking Phase 0 complete

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-10-07 | Initial checklist creation | Dev Agent (James) |
