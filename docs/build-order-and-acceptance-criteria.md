# Build Order & Acceptance Criteria

**Project**: Landing Pages Automation
**Purpose**: Phased implementation plan with clear completion criteria
**Date**: 2025-10-07
**Author**: Sally (UX Expert)

---

## 🎯 Implementation Philosophy

**Approach**: Progressive enhancement - build MVP first, validate, iterate

**Phases**:
1. **Phase 1: MVP** - Hero + ZIP form (testable proof of concept)
2. **Phase 2: Core Form** - Multi-step form completion
3. **Phase 3: Polish** - Trust signals, thank you page, validation
4. **Phase 4: Optimization** - Performance, accessibility, conversion testing

**Goal**: Each phase produces a testable, deployable increment

---

## 🚀 Phase 1: MVP (Proof of Concept)

**Timeline**: 2-4 hours
**Goal**: Single-page hero with ZIP code entry form

### Components to Build

1. **Hero Section** (HyperUI base)
   - Hero image (WebP format)
   - H1 headline (brand formula applied)
   - Trust bar (3 trust signals)
   - Form Step 1 container

2. **Form Step 1: ZIP Entry**
   - Single text input (ZIP code)
   - Primary CTA button
   - Basic client-side validation (5 digits, numeric only)
   - Success/error alert display

3. **Basic Layout**
   - Responsive container
   - Mobile-first grid
   - Next.js page structure

### Build Order

```
1. Setup project structure
   └─ Create /components directory
   └─ Install DaisyUI
   └─ Configure Tailwind theme

2. Build Hero component
   └─ Add hero image
   └─ Add H1 headline
   └─ Add trust bar

3. Build ZIPForm component
   └─ Input field with validation
   └─ CTA button
   └─ State management (React useState)

4. Integrate on homepage
   └─ app/page.tsx
   └─ Test mobile layout
```

### Acceptance Criteria

**Visual**:
- [ ] Hero image displays correctly (WebP format)
- [ ] Headline uses brand formula and Inter font
- [ ] Trust bar shows 3 trust signals with icons
- [ ] Form input has 54px touch target on mobile
- [ ] CTA button full width on mobile, brand blue color
- [ ] Layout responsive (mobile, tablet, desktop)

**Functional**:
- [ ] ZIP input accepts only 5 numeric digits
- [ ] Form validates on blur (field loses focus)
- [ ] Success message displays for valid ZIP
- [ ] Error message displays for invalid ZIP
- [ ] CTA button shows loading state on submit
- [ ] Form submission console logs ZIP code (no backend yet)

**Performance**:
- [ ] Hero image loads with `priority` flag (LCP optimization)
- [ ] No console errors
- [ ] Page loads in <2 seconds (local dev)

**Brand Compliance**:
- [ ] Colors match spec (blue #1e40af, orange accents)
- [ ] Typography uses Inter font
- [ ] CTA text includes value proposition ("Claim Your X% Discount")
- [ ] Trust signals use specific numbers (not generic)

### Definition of Done

**MVP is complete when**:
- All acceptance criteria checked
- Deployed to dev environment (Netlify branch deploy)
- Viewable on mobile device
- Screenshot shared for stakeholder review

---

## 🔧 Phase 2: Multi-Step Form

**Timeline**: 4-6 hours
**Goal**: Complete 3-step form with progress indicator

### Components to Build

1. **Progress Indicator** (DaisyUI Steps)
   - Visual 3-step tracker
   - Dynamic state management
   - Always visible during form

2. **Form Step 2: Contact Details**
   - Name input (text)
   - Email input (email type with validation)
   - Phone input (tel type with formatting)
   - Job type select (dropdown)
   - How did you hear (dropdown)
   - Comments textarea (optional)
   - Back/Next navigation buttons

3. **Form Step 3: TCPA Consent**
   - TCPA checkbox with clear language
   - Privacy policy link
   - reCAPTCHA integration (invisible v3)
   - Back/Submit buttons
   - Loading state during submission

4. **Form Context** (React Context or state management)
   - Store form data across steps
   - Validation state tracking
   - Step navigation logic

### Build Order

```
1. Create ProgressIndicator component
   └─ DaisyUI steps HTML
   └─ Props: currentStep (1-3)

2. Create FormStep2 component
   └─ 6 input fields (name, email, phone, jobType, howDidYouHear, comments)
   └─ Validation rules (Zod schema)
   └─ Back/Next buttons

3. Create FormStep3 component
   └─ TCPA checkbox
   └─ reCAPTCHA widget
   └─ Back/Submit buttons
   └─ Submission handler

4. Create FormContext
   └─ Store formData state
   └─ Navigation functions (nextStep, prevStep)
   └─ Validation functions

5. Refactor ZIPForm (Step 1)
   └─ Integrate with FormContext
   └─ Add Next button navigation

6. Create MultiStepForm orchestrator
   └─ Conditional rendering based on currentStep
   └─ Progress indicator at top
   └─ Step components below
```

### Acceptance Criteria

**Visual**:
- [ ] Progress indicator shows current step highlighted
- [ ] Completed steps remain highlighted (show progress)
- [ ] All form fields 54px touch target on mobile
- [ ] Form fields stack vertically on mobile
- [ ] Back/Next buttons appropriate sizing
- [ ] TCPA checkbox readable with clear language

**Functional**:
- [ ] Step 1 → Step 2 navigation works
- [ ] Back button returns to previous step (preserves data)
- [ ] Next button validates current step before advancing
- [ ] Email validation (proper email format)
- [ ] Phone formatting (auto-formats as user types)
- [ ] ZIP validation prevents Step 2 if invalid
- [ ] TCPA checkbox required (cannot submit unchecked)
- [ ] reCAPTCHA validates before submission
- [ ] Form data persists across step navigation
- [ ] Submit button shows loading spinner during submission

**Validation**:
- [ ] Real-time validation on blur (field loses focus)
- [ ] Error messages display below fields
- [ ] Success indicators (green checkmark) for valid fields
- [ ] Required fields marked visually
- [ ] Form cannot advance with invalid data

**Accessibility**:
- [ ] All inputs have labels
- [ ] Error messages linked to fields (aria-describedby)
- [ ] Tab order logical (top to bottom)
- [ ] Focus visible on all interactive elements
- [ ] TCPA checkbox has accessible label
- [ ] Skip to main content link (if header added)

### Definition of Done

**Phase 2 is complete when**:
- All acceptance criteria checked
- Form completes all 3 steps without errors
- Data submitted to console (or test endpoint)
- Mobile flow tested on real device
- Deployed to dev environment

---

## 🎨 Phase 3: Trust Signals & Thank You Page

**Timeline**: 2-3 hours
**Goal**: Add conversion elements and success page

### Components to Build

1. **Stats Block** (HyperUI base)
   - 3 stat cards (homeowners served, rating, satisfaction rate)
   - Territory-specific numbers
   - Icons (Heroicons)
   - Mobile-responsive grid

2. **Thank You Page** (`/thank-you`)
   - Success message with icon
   - Next steps copy ("A contractor will call within 24 hours")
   - Phone number display (large, tappable)
   - Email confirmation mention
   - Social proof element
   - No form (success state only)

3. **Enhanced Validation**
   - Duplicate submission check (5-minute window)
   - ZIP code service area validation (mock for now)
   - Network error handling
   - Timeout handling

### Build Order

```
1. Create StatsBlock component
   └─ 3 stat cards with icons
   └─ Dynamic data props (territory-specific)
   └─ Responsive grid layout

2. Integrate StatsBlock on homepage
   └─ Position: below hero, above form OR
   └─ Position: between form steps (encouragement)

3. Create ThankYouPage component
   └─ app/thank-you/page.tsx
   └─ Success messaging
   └─ Next steps copy
   └─ Phone/email display
   └─ Social proof

4. Integrate navigation to thank-you
   └─ After successful form submission
   └─ Use Next.js router.push('/thank-you')

5. Add enhanced validation
   └─ Duplicate check (localStorage + timestamp)
   └─ Service area check (ZIP validation against list)
   └─ Error recovery UI
```

### Acceptance Criteria

**Stats Block**:
- [ ] 3 stats display with icons
- [ ] Numbers are dynamic (props-driven)
- [ ] Territory name displayed
- [ ] Mobile: stacks vertically
- [ ] Desktop: 3-column grid
- [ ] Icons use brand colors

**Thank You Page**:
- [ ] Success icon/illustration displays
- [ ] Headline: "Thank You!"
- [ ] Next steps clearly stated
- [ ] Phone number large and tappable (href="tel:...")
- [ ] Email mentioned
- [ ] Social proof included ("Join 10,000+ homeowners")
- [ ] No way to re-submit form (form not present)

**Validation**:
- [ ] Duplicate submission blocked with user-friendly message
- [ ] Invalid service area ZIP shows clear error
- [ ] Network errors show retry option
- [ ] Timeout errors show retry option
- [ ] All errors logged to console for debugging

### Definition of Done

**Phase 3 is complete when**:
- Stats block displays on homepage
- Form submission redirects to thank you page
- Thank you page renders correctly
- Duplicate submissions prevented
- All validation edge cases handled
- User cannot break the flow

---

## ⚡ Phase 4: Performance & Optimization

**Timeline**: 2-4 hours
**Goal**: Meet Core Web Vitals targets and optimize conversion

### Optimization Tasks

1. **Performance**
   - [ ] Hero image optimized (WebP, correct sizes)
   - [ ] Fonts preloaded (Inter via next/font)
   - [ ] Unused CSS purged (Tailwind purge config)
   - [ ] JavaScript code-split (Next.js automatic)
   - [ ] Form lazy-loaded if below fold

2. **Core Web Vitals**
   - [ ] LCP < 2.0s (hero image with priority flag)
   - [ ] INP < 200ms (test button interactions)
   - [ ] CLS < 0.1 (reserve space for form, images)

3. **Accessibility**
   - [ ] Run Lighthouse accessibility audit (score ≥90)
   - [ ] Test with keyboard only (all functionality accessible)
   - [ ] Test with screen reader (NVDA or VoiceOver)
   - [ ] Color contrast checked (all text ≥4.5:1)
   - [ ] Focus indicators visible on all interactive elements

4. **Conversion Optimization**
   - [ ] A/B test headline variations (optional, Phase 5)
   - [ ] Add urgency element (countdown timer, limited slots)
   - [ ] Add social proof (testimonial snippet)
   - [ ] Optimize CTA placement (sticky mobile CTA)

5. **Mobile Polish**
   - [ ] Test on iOS Safari (form zoom issues)
   - [ ] Test on Android Chrome (form behavior)
   - [ ] Verify 54px touch targets with inspector
   - [ ] Test landscape orientation
   - [ ] Test on small devices (iPhone SE, Galaxy S)

### Build Order

```
1. Performance audit
   └─ Run Lighthouse report
   └─ Note LCP, INP, CLS scores

2. Image optimization
   └─ Compress hero images
   └─ Generate WebP versions
   └─ Configure next/image properly

3. Font optimization
   └─ Use next/font for Inter
   └─ Preload font files

4. Accessibility audit
   └─ Run axe DevTools
   └─ Fix identified issues
   └─ Test keyboard navigation

5. Mobile device testing
   └─ Test on real iOS device
   └─ Test on real Android device
   └─ Fix any discovered issues

6. Final validation
   └─ Run all Playwright tests (Phase 4 deliverable)
   └─ Verify all acceptance criteria from Phases 1-3
```

### Acceptance Criteria

**Performance**:
- [ ] Lighthouse Performance score ≥90
- [ ] LCP < 2.0s (measured)
- [ ] INP < 200ms (measured)
- [ ] CLS < 0.1 (measured)
- [ ] Time to Interactive < 2.5s

**Accessibility**:
- [ ] Lighthouse Accessibility score ≥90
- [ ] All interactive elements keyboard accessible
- [ ] All images have alt text
- [ ] Color contrast ≥4.5:1 for text
- [ ] Form labels properly associated
- [ ] Error messages announced to screen readers

**Mobile**:
- [ ] No horizontal scroll on any screen size
- [ ] All touch targets ≥54px
- [ ] Text readable without zoom (16px minimum)
- [ ] Forms work on iOS Safari (no zoom on focus)
- [ ] Buttons full width on mobile

**Cross-Browser**:
- [ ] Tested on Chrome (desktop + mobile)
- [ ] Tested on Safari (desktop + mobile)
- [ ] Tested on Firefox (desktop)
- [ ] No console errors on any browser

### Definition of Done

**Phase 4 is complete when**:
- All Core Web Vitals targets met
- Lighthouse scores ≥90 (Performance, Accessibility, Best Practices)
- Tested on real mobile devices (iOS + Android)
- All Playwright tests passing
- Ready for production deployment

---

## 🧪 Testing Strategy by Phase

### Phase 1 Testing (Manual)
- Visual inspection (does it look right?)
- Form interaction (does ZIP validation work?)
- Mobile responsiveness (Chrome DevTools mobile view)
- Console check (no errors?)

### Phase 2 Testing (Manual + Automated)
- Full form flow (can complete all 3 steps?)
- Back/forward navigation (data preserved?)
- Validation (all fields validated correctly?)
- reCAPTCHA (verifies human?)
- Manual test on real mobile device

### Phase 3 Testing (Manual)
- Stats display correctly (dynamic data works?)
- Thank you page accessible (route works?)
- Duplicate submission blocked (localStorage works?)
- Error handling (network failure scenarios)

### Phase 4 Testing (Automated with Playwright)
- Run full Playwright test suite (Document 4)
- Performance testing with Lighthouse CI
- Accessibility testing with axe
- Visual regression testing (optional)
- Cross-browser testing

---

## 📊 Progress Tracking

Use this checklist to track implementation progress:

### Phase 1: MVP ✅
- [ ] Project setup complete
- [ ] Hero section built
- [ ] ZIP form functional
- [ ] Mobile responsive
- [ ] Deployed to dev

### Phase 2: Multi-Step Form ✅
- [ ] Progress indicator working
- [ ] Form Step 2 built
- [ ] Form Step 3 built
- [ ] Form context implemented
- [ ] All steps navigable
- [ ] Validation working
- [ ] Deployed to dev

### Phase 3: Trust & Thank You ✅
- [ ] Stats block integrated
- [ ] Thank you page created
- [ ] Navigation working
- [ ] Enhanced validation added
- [ ] Deployed to dev

### Phase 4: Optimization ✅
- [ ] Performance optimized
- [ ] Core Web Vitals met
- [ ] Accessibility validated
- [ ] Mobile devices tested
- [ ] Playwright tests passing
- [ ] Ready for production

---

## 🚦 Go/No-Go Criteria by Phase

### Phase 1 → Phase 2
**✅ GO if**:
- Hero displays correctly
- ZIP form validates
- No console errors
- Mobile layout works

**🛑 STOP if**:
- Hero image won't load
- Form validation broken
- Major mobile layout issues

### Phase 2 → Phase 3
**✅ GO if**:
- All 3 form steps work
- Data persists across steps
- Validation prevents bad data
- Mobile flow tested

**🛑 STOP if**:
- Steps don't navigate
- Data lost between steps
- Validation not working
- reCAPTCHA failing

### Phase 3 → Phase 4
**✅ GO if**:
- Thank you page accessible
- Stats display correctly
- Error handling works
- Full flow tested end-to-end

**🛑 STOP if**:
- Can't reach thank you page
- Duplicate submissions not blocked
- Critical validation missing

### Phase 4 → Production
**✅ GO if**:
- Core Web Vitals met
- Lighthouse scores ≥90
- Playwright tests passing
- Tested on real devices
- No critical bugs

**🛑 STOP if**:
- Performance below targets
- Accessibility issues present
- Playwright tests failing
- Critical functionality broken

---

## 📋 Pre-Deployment Checklist

Before deploying to production, verify:

**Functionality**:
- [ ] Complete form flow works end-to-end
- [ ] All validation rules enforced
- [ ] Error handling covers edge cases
- [ ] Thank you page accessible
- [ ] No console errors

**Performance**:
- [ ] LCP < 2.0s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance ≥90

**Accessibility**:
- [ ] Lighthouse Accessibility ≥90
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast ≥4.5:1

**Mobile**:
- [ ] Tested on iOS Safari
- [ ] Tested on Android Chrome
- [ ] Touch targets ≥54px
- [ ] No horizontal scroll
- [ ] Text readable without zoom

**Security**:
- [ ] reCAPTCHA v3 enabled
- [ ] Form data sanitized
- [ ] HTTPS enabled (Netlify default)
- [ ] Privacy policy linked

**Content**:
- [ ] Brand voice applied
- [ ] Territory-specific data
- [ ] CTA text follows guidelines
- [ ] Trust signals accurate
- [ ] Legal compliance (TCPA)

---

## 🎯 Success Metrics (Post-Launch)

Track these metrics to validate success:

**Conversion Metrics**:
- Form start rate (% of visitors who enter ZIP)
- Form completion rate (% who complete all 3 steps)
- Target: >40% completion rate

**Performance Metrics**:
- LCP average (target <2.0s)
- INP average (target <200ms)
- CLS average (target <0.1)
- Time to Interactive (target <2.5s)

**Quality Metrics**:
- Form validation error rate
- Duplicate submission rate
- reCAPTCHA failure rate
- Network error rate

**Business Metrics**:
- Cost per lead (target: 25-35% reduction)
- Lead quality score (target: 20-30% increase)
- Conversion rate improvement (target: 40-60%)

---

## 🚀 Next Steps

1. ✅ **You're here**: Understand build order and what "done" means
2. ⏭️ **Next**: Playwright Test Scenarios (automated validation after each phase)
3. ⏭️ **Then**: Hand off to dev-agent with all 4 documents
