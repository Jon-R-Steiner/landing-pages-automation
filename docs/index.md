# Documentation Index

Complete index of all documentation for the Landing Pages Automation project.

## Root Documents

### [Front-End Specification](./front-end-spec.md)

Comprehensive UI/UX specification defining user experience goals, information architecture, user flows, visual design, brand voice, and content strategy. Includes responsive design requirements, accessibility standards, and performance targets.

### [Build Order & Acceptance Criteria](./build-order-and-acceptance-criteria.md)

Phased implementation plan with four progressive phases: MVP proof of concept, multi-step form, trust signals and thank you page, and performance optimization. Each phase includes detailed acceptance criteria and go/no-go decision points.

### [Component Shopping List](./component-shopping-list.md)

Exact component sources from DaisyUI, HyperUI, and Tailblocks with direct URLs and implementation code. Includes setup instructions, mobile-first implementation notes, and estimated time savings.

### [Component Customization Guide](./component-customization-guide.md)

Detailed guide for adapting pre-built components to match brand guidelines. Covers global customizations (DaisyUI theme, typography, touch targets), component-specific adaptations, and mobile responsiveness patterns.

### [Playwright Test Scenarios](./playwright-test-scenarios.md)

Automated validation tests aligned with specification requirements. Includes 37 test scenarios across functional, visual, performance, accessibility, and mobile testing categories. Provides complete Playwright setup and CI/CD integration.

## Architecture

Landing Pages Automation fullstack architecture documentation with comprehensive technical specifications.

### [Architecture Index](./architecture/index.md)

Complete architecture documentation table of contents with links to all subsections covering introduction, tech stack, data models, APIs, deployment, and coding standards.

### [Change Log](./architecture/change-log.md)

Version history tracking all changes, updates, and enhancements to the architecture documentation.

### [Introduction](./architecture/introduction.md)

Project overview, architecture context, and starter template selection decisions.

### [High Level Architecture](./architecture/high-level-architecture.md)

Technical summary, platform/infrastructure choices, repository structure, architecture diagrams, and architectural patterns.

### [Tech Stack](./architecture/tech-stack.md)

Framework decision analysis (Next.js 15.5 vs Astro), complete technology stack table, and future improvements backlog.

### [Content Generation Strategy](./architecture/content-generation-strategy.md)

Key content requirements and content quality validation checklist for automated landing page generation.

### [Frontend Implementation Documents](./architecture/frontend-implementation-documents.md)

References and links to frontend-specific implementation guides and specifications.

### [Visual Design Authority](./architecture/visual-design-authority.md)

Design system authority, component library guidelines, and visual design standards.

### [Image Asset Strategy](./architecture/image-asset-strategy.md)

Two-phase asset strategy: placeholder images for development and production asset migration approach.

### [Document Dependencies](./architecture/document-dependencies.md)

Dependencies and relationships between architecture documents and external specifications.

### [Data Models](./architecture/data-models.md)

TypeScript interfaces for Landing Page, Form Submission, Template, TCPA Rules, Form Session, and Thank You Page models with relationships.

### [API Specification](./architecture/api-specification.md)

Complete API endpoint definitions for form submission, reCAPTCHA validation, webhooks, and security requirements.

### [Environment Variables](./architecture/environment-variables.md)

Frontend (.env.local) and backend (Netlify) environment variable configuration.

### [Asset Management Strategy](./architecture/asset-management-strategy.md)

Hero image approach, asset folder structure, image mapping logic, component patterns, and optimization specifications.

### [Notes for dev-agent](./architecture/notes-for-dev-agent.md)

Special instructions and considerations for AI-powered development agents.

### [Components](./architecture/components.md)

Frontend components, backend Netlify functions, integration components, and architecture rationale.

### [External APIs](./architecture/external-apis.md)

Integration specifications for Airtable, Make.com, Netlify, Google reCAPTCHA, Google Tag Manager, and Claude API.

### [Database Schema](./architecture/database-schema.md)

Airtable base structure with detailed table definitions for Landing Pages, Form Submissions, Templates, TCPA Rules, Form Sessions, and future Offers table.

### [Frontend Architecture](./architecture/frontend-architecture.md)

Next.js App Router structure, component architecture, state management, validation, routing strategy, performance optimizations, and accessibility implementation.

### [Backend Architecture](./architecture/backend-architecture.md)

Serverless functions overview, API route handlers, service layer (Airtable, reCAPTCHA, duplicate detection), error handling, and monitoring.

### [Project Structure](./architecture/project-structure.md)

URL structure and routing patterns, monorepo layout, workspace configuration, TypeScript setup, and file naming conventions.

### [Development Workflow](./architecture/development-workflow.md)

Initial setup instructions, development commands, pre-commit workflow, adding new landing page types, and debugging tips.

### [Deployment Architecture](./architecture/deployment-architecture.md)

Netlify configuration, deployment environments, deployment workflow, environment variable management, and deployment checklist.

### [Security and Performance](./architecture/security-and-performance.md)

Security requirements (reCAPTCHA, HTTPS, TCPA compliance) and performance requirements (Core Web Vitals targets).

### [Testing Strategy](./architecture/testing-strategy.md)

Unit testing with Vitest, integration testing with React Testing Library, E2E testing with Playwright, and test commands.

### [Coding Standards](./architecture/coding-standards.md)

TypeScript standards, React standards, file organization, naming conventions, and code commenting guidelines.

### [Error Handling Strategy](./architecture/error-handling-strategy.md)

Frontend error handling patterns, backend error handling approaches, and error logging strategy.

### [Monitoring and Observability](./architecture/monitoring-and-observability.md)

Phase 1 monitoring approach, metrics to track, and Phase 2 observability enhancements including offer variations, SEO optimization, and conversion optimization.

## PRD

Product Requirements Document for Landing Pages Automation broken down into focused sections.

### [PRD Index](./prd/index.md)

Table of contents for the complete PRD with links to all subsections.

### [Goals and Background Context](./prd/goals-and-background-context.md)

Business objectives, problem statement, target audience, and strategic context for the project.

### [Requirements](./prd/requirements.md)

Functional and non-functional requirements defining what the system must accomplish.

### [Technical Assumptions](./prd/technical-assumptions.md)

Technical constraints, platform choices, and architectural assumptions guiding development decisions.

### [Risks & Mitigation Strategies](./prd/risks-mitigation-strategies.md)

Identified project risks with corresponding mitigation and contingency plans.

### [Epic List](./prd/epic-list.md)

High-level epic breakdown showing major feature areas and development phases.

### [Epic Details](./prd/epic-details.md)

Detailed descriptions of each epic including user stories, acceptance criteria, and implementation notes.

### [Checklist Results Report](./prd/checklist-results-report.md)

Product readiness assessment results showing completion status against quality gates.

### [Next Steps](./prd/next-steps.md)

Immediate actions, upcoming milestones, and roadmap for project progression.

---

**Last Updated**: 2025-10-07

**Total Files Indexed**: 41 files across 3 major sections (root, architecture, prd)

**Index Maintenance**: This index is automatically updated when documentation structure changes.
