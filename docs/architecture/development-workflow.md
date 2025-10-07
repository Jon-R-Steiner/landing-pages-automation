# Development Workflow

## Initial Setup

**1. Clone Repository**:
```bash
git clone <repository-url>
cd landing-pages-automation
```

**2. Install Dependencies**:
```bash
npm install
```
This installs dependencies for all workspaces (root, frontend, shared).

**3. Configure Environment Variables**:
```bash
cp .env.example apps/frontend/.env.local
# Edit .env.local with your API keys
```

**4. Start Development Server**:
```bash
npm run dev
```
Opens `http://localhost:3000`

---

## Development Commands

**Run Frontend Dev Server**:
```bash
npm run dev
# or
npm run dev --workspace=apps/frontend
```

**Build for Production**:
```bash
npm run build
```

**Type Check**:
```bash
npm run type-check
```

**Lint**:
```bash
npm run lint
```

**Run Tests**:
```bash
npm test
```

---

## Pre-commit Workflow

**Recommended Workflow**:
1. Make changes in feature branch
2. Run `npm run type-check` to verify TypeScript
3. Run `npm run lint` to check code style
4. Run `npm test` to verify tests pass
5. Commit with descriptive message
6. Push to remote for PR review

**Git Hooks** (optional - Phase 2):
- Husky for pre-commit hooks
- lint-staged for staged files only
- commitlint for commit message format

---

## Adding New Landing Page Types

**1. Add Hero Image**:
```bash
# Add to apps/frontend/public/images/heroes/
cp new-service.webp apps/frontend/public/images/heroes/
```

**2. Update Page Type Enum**:
```typescript
// packages/shared/src/types/landing-page.ts
export enum PageType {
  WalkInShower = "Walk In Shower",
  FullBathroomRemodel = "Full Bathroom Remodel",
  KitchenRemodel = "Kitchen Remodel",
  NewService = "New Service", // Add here
}
```

**3. Update Airtable Page Type Dropdown**:
- Go to Landing Pages table
- Edit `page_type` field options
- Add new service type

**4. Create Landing Page Record in Airtable**:
- Fill in content brief
- Select new page type
- Status = "pending"
- Make.com will generate content

---

## Debugging Tips

**Next.js Dev Server Issues**:
```bash
# Clear Next.js cache
rm -rf apps/frontend/.next
npm run dev
```

**TypeScript Errors**:
```bash
# Rebuild TypeScript types
npm run type-check
```

**Environment Variable Not Loading**:
- Restart dev server (env vars only loaded on start)
- Verify variable name starts with `NEXT_PUBLIC_` for client-side
- Check `.env.local` file location (`apps/frontend/.env.local`)

**Airtable Connection Issues**:
- Verify `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are correct
- Check Airtable API key has read/write permissions
- Test connection with simple fetch in API route

**Form Submission Not Working**:
- Check browser console for errors
- Verify reCAPTCHA site key is correct
- Check Netlify function logs for backend errors
- Verify Airtable table names match exactly (case-sensitive)

---
