# Notes for dev-agent

**Implementation Priority:**
1. Set up monorepo structure with npm workspaces
2. Create shared TypeScript types in `packages/shared` (include pageType, heroImage, heroImageAlt)
3. Set up asset folder structure with hero images, icons, trust badges
4. Implement Next.js 15.5 frontend with Tailwind CSS
5. Build multi-step form with client-side state management (React Context)
6. Implement hero image component using Next.js Image (automatic WebP optimization)
7. Implement Netlify Functions for form submission and validation
8. Configure reCAPTCHA v3 (frontend + backend validation)
9. Set up Google Tag Manager integration
10. Implement Airtable integration with hero image formulas
11. Configure Make.com webhooks for automation (content only, no image generation)
12. Connect Git repository to Netlify for automatic deployments

**Critical Requirements:**
- Use Turbopack for builds: `next build --turbopack`
- Implement duplicate submission prevention (5-minute window on email+phone)
- All form validation must use Zod schemas (shared between frontend/backend)
- Multi-step form must preserve state in sessionStorage
- Thank you page is static (no token validation)
- Marketing attribution captured on page load (Step 1)
- reCAPTCHA executed only on final step (Step 3)
- **NO AI-generated images** - Only use pre-selected hero images mapped by page_type
- Hero images must use Next.js Image component for automatic optimization
- All hero images stored in `apps/web/public/images/heroes/`
- Airtable formulas auto-populate hero_image based on page_type

**SEO Requirements (Phase 1)**:
- Every landing page must have unique title (30-60 chars) and meta description (120-160 chars)
- Self-referencing canonical URL: `<link rel="canonical" href="https://example.com/[slug]/">`
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- **No internal cross-linking** between landing pages (conversion-focused isolation)
- Footer links only: Privacy Policy, Terms of Service (both nofollow)
- Next.js metadata API for all meta tags
- Mobile-responsive design (Tailwind handles this)

**Testing Strategy:**
- Vitest for unit tests (frontend + backend)
- Playwright for E2E multi-step form testing
- Test duplicate submission prevention (5-minute window)
- Test reCAPTCHA validation flow
- Test static thank you page redirect

---
