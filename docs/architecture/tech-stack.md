# Tech Stack

This is the **DEFINITIVE** technology selection for the entire project. All development must use these exact versions.

## Framework Decision: Next.js 15.5 vs Astro

**Decision**: Next.js 15.5 (App Router with Turbopack)

**Rationale**:

While the original specification recommended Astro for static site generation, Next.js 15.5 provides superior capabilities for this project's requirements:

**Next.js Advantages for Landing Pages Automation**:

1. **Integrated Serverless Functions**:
   - Form submission handlers, webhook receivers, reCAPTCHA validation co-located with pages
   - Netlify Functions seamlessly deploy from Next.js API routes
   - No separate serverless function setup required (Astro requires external configuration)

2. **Superior Developer Experience**:
   - TypeScript-first with excellent type inference
   - Instant HMR with Turbopack (10x faster than Webpack)
   - Mature debugging tools and error messages
   - Extensive ecosystem and community support

3. **Image Optimization Built-In**:
   - Next.js Image component: automatic WebP conversion, responsive sizing, lazy loading
   - Critical for hero images and Core Web Vitals performance
   - Astro's image optimization is less mature

4. **React Ecosystem Access**:
   - Radix UI for accessible form components
   - React Hook Form for multi-step form state management
   - Official reCAPTCHA v3 React integration
   - React Testing Library + Playwright for comprehensive testing

5. **Monorepo Support**:
   - Seamless npm workspaces integration
   - Shared TypeScript types between frontend and serverless functions
   - Single source of truth for data models

6. **Future Scalability**:
   - Supports SSG (like Astro) but also ISR (Incremental Static Regeneration)
   - Can add dynamic routes without refactoring
   - Better suited for Phase 2 enhancements (offer variations, A/B testing)

7. **Production-Ready at Scale**:
   - Battle-tested by Vercel, Netflix, TikTok, Uber
   - Superior performance monitoring and debugging
   - Extensive Netlify integration documentation

**Trade-off Accepted**:
- Next.js ships ~80KB React runtime (Astro ships zero JavaScript by default)
- Worth the trade-off for developer experience, integrated serverless functions, and superior image optimization

**Performance Parity**:
- Both achieve Core Web Vitals targets (LCP <2.5s, CLS <0.1, INP <200ms)
- Next.js 15.5 with Turbopack matches Astro build speeds for this project size
- Static generation produces similar output performance

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.6+ | Type-safe frontend development | Industry standard for large-scale React apps, catch errors at compile time |
| **Frontend Framework** | Next.js | 15.5 | React framework with SSR/SSG | Latest stable (Aug 2025) with Turbopack builds, App Router, optimal for SEO-critical landing pages |
| **UI Component Library** | Radix UI | 1.1+ | Unstyled accessible primitives | Headless components for forms, dialogs, dropdowns—fully accessible, works perfectly with Tailwind |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first styling | Fast iteration, consistent design system, no CSS files, perfect for landing page variants |
| **Bot Protection** | Google reCAPTCHA v3 | v3 | Spam and bot prevention for forms | Score-based risk assessment (0.0-1.0), no user friction, required for TCPA compliance validation |
| **Tag Management** | Google Tag Manager | Latest (Cloud) | Dynamic script and tracking management | Deploy analytics, pixels, tracking scripts without code changes—stakeholders can add tools independently |
| **State Management** | React Context + Hooks | Built-in | Local state management | Sufficient for landing pages (no complex global state), reduces dependencies |
| **Backend Language** | TypeScript | 5.6+ | Type-safe serverless functions | Shared types with frontend via monorepo packages |
| **Backend Framework** | Netlify Functions | Node.js 20 | Serverless compute | Zero ops, auto-scaling, stable Node.js runtime (as of Next.js 15.2), integrated with Netlify deployment |
| **API Style** | REST | HTTP/JSON | Form submissions and webhooks | Simple REST endpoints sufficient for form POST and webhook receivers |
| **Database** | Airtable | REST API v2 | Content management and data storage | Non-technical stakeholder access, spreadsheet UI, built-in approval workflows |
| **Cache** | Netlify Edge | CDN | Static asset caching | Automatic global CDN distribution, no configuration needed |
| **File Storage** | Netlify | Built-in | Static assets and builds | Images, fonts, build artifacts stored in Netlify infrastructure |
| **Authentication** | N/A (Phase 1) | - | Not required for public landing pages | Public landing pages only, stakeholders use Airtable directly |
| **Form Validation** | Zod | 3.23+ | Runtime schema validation | Type-safe validation, shared schemas between frontend and backend |
| **Frontend Testing** | Vitest | 2.1+ | Unit and component tests | Fast, Vite-native, compatible with Next.js 15.5 |
| **Backend Testing** | Vitest | 2.1+ | Serverless function tests | Same test framework as frontend for consistency |
| **E2E Testing** | Playwright | 1.48+ | Browser automation | Official Microsoft tool, excellent MCP integration for Claude Code |
| **Build Tool** | Turbopack | Beta (Next.js 15.5) | Next.js production builds | 10x faster than Webpack, use `next build --turbopack` |
| **Bundler** | Built-in | Next.js/Turbopack | Module bundling | Next.js handles bundling internally |
| **IaC Tool** | N/A | - | No infrastructure as code | Netlify is platform-managed, no Terraform/CDK needed |
| **CI/CD** | Netlify | Built-in | Automated builds and deployments | Git push triggers automatic builds, preview deployments for PRs, no separate CI needed |
| **Monitoring** | Netlify Analytics | Built-in | Traffic and performance metrics | Basic analytics included |
| **Logging** | Console + Netlify Logs | Built-in | Function execution logs | Netlify captures all console output, searchable in dashboard |
| **Automation Platform** | Make.com | Latest (Oct 2025) | Workflow orchestration | 3,000+ integrations, Make AI Agents (April 2025), visual workflow builder |
| **AI Content Generation** | Claude Sonnet 4.5 | claude-sonnet-4-5 | Landing page content generation | Best coding model (Sep 2025), $3/$15 per million tokens, 1-hour prompt caching |
| **Package Manager** | npm | 10+ | Dependency management and workspaces | Built-in workspaces for monorepo, no additional tooling |
| **Code Formatting** | Prettier | 3.3+ | Consistent code style | Standard formatter, integrates with ESLint |
| **Linting** | ESLint | 9+ | Code quality enforcement | Next.js built-in config, TypeScript rules |

## Future Improvements Backlog

Not included in Phase 1, deferred for future iterations:
- **Cloudinary**: Advanced image optimization beyond Next.js built-in
- **SendGrid/Resend**: Email notification service for form submissions
- **Sentry**: Error tracking and monitoring
- **Admin Portal**: Web-based admin dashboard with authentication (if needed)

---
