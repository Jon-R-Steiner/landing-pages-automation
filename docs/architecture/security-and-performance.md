# Security and Performance

## Security Requirements

**HTTPS Only**: All traffic served over HTTPS via Netlify (automatic SSL)

**Security Headers** (configured in `netlify.toml`):
- `X-Frame-Options: DENY` - Prevent clickjacking on API routes
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS filtering
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info

**Input Validation**:
- Client-side validation with Zod schemas (user feedback)
- Server-side validation with same Zod schemas (security)
- Never trust client input - always validate on server

**API Security**:
- reCAPTCHA v3 on all form submissions (min score 0.5)
- Webhook signature verification (Make.com secret)
- Environment variables for all secrets (never hardcode)
- IP address logging for fraud detection

**Data Protection**:
- No sensitive data stored in localStorage/sessionStorage (only form progress)
- TCPA consent required before form submission
- User data transmitted over HTTPS only
- Airtable API key stored server-side only

**Phase 2 Enhancements**:
- Rate limiting per IP address (10 submissions/hour)
- CSRF token for form submissions
- Content Security Policy (CSP) headers
- Subresource Integrity (SRI) for external scripts

---

## Performance Requirements

**Core Web Vitals Targets**:
- **LCP (Largest Contentful Paint)**: <2.5s (hero image optimization critical)
- **INP (Interaction to Next Paint)**: <200ms (minimal JavaScript blocking, optimized interactions)
- **CLS (Cumulative Layout Shift)**: <0.1 (fixed image dimensions)

**Page Speed Targets**:
- Time to Interactive (TTI): <3.5s
- First Contentful Paint (FCP): <1.5s
- Speed Index: <3.0s

**Optimization Strategies**:
- **Static Site Generation (SSG)**: Pre-render all landing pages at build time
- **Next.js Image Optimization**: Automatic WebP conversion, responsive sizing, lazy loading
- **CDN Caching**: Netlify Edge Network caches static assets globally
- **Code Splitting**: Automatic route-based splitting with Next.js App Router
- **Tree Shaking**: Remove unused code with Turbopack
- **Minimal JavaScript**: Server Components reduce client-side JS

**Bundle Size Targets**:
- Initial page load: <200KB gzipped
- React runtime: ~80KB (acceptable for interactivity needs)
- Form components: ~30KB (React Hook Form + validation)

**Monitoring**:
- Netlify Analytics for real-world performance data
- PageSpeed Insights for Core Web Vitals validation
- Lighthouse audits (manual or via Netlify Build Plugins)

---
