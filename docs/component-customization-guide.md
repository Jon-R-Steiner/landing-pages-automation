# Component Customization Guide

**Project**: Landing Pages Automation
**Purpose**: How to adapt pre-built components to match brand guidelines
**Date**: 2025-10-07
**Author**: Sally (UX Expert)

---

## 🎨 Customization Philosophy

**Goal**: Use pre-built components as foundation, customize systematically for brand consistency

**Approach**:
1. **Start with component HTML** (from shopping list)
2. **Apply brand colors** (via DaisyUI theme)
3. **Adjust typography** (Tailwind utility classes)
4. **Refine spacing** (Tailwind spacing scale)
5. **Add brand voice** (content from brand guidelines)

---

## 🎯 Global Customizations (Apply Once)

### 1. DaisyUI Theme Configuration

Already configured in `component-shopping-list.md`, but here's the theme object again:

```javascript
// tailwind.config.js
daisyui: {
  themes: [
    {
      landingpages: {
        "primary": "#1e40af",      // Trust blue (CTAs, links)
        "secondary": "#ea580c",    // Urgency orange (badges)
        "accent": "#fb923c",       // Orange light (hover states)
        "success": "#059669",      // Validation green
        "error": "#dc2626",        // Error red
        "neutral": "#0f172a",      // Text gray-900
        "base-100": "#ffffff",     // White background
        "base-200": "#f8fafc",     // Gray-50 background
      },
    },
  ],
}
```

**Effect**: All DaisyUI components (`btn-primary`, `alert-success`, etc.) automatically use your brand colors.

---

### 2. Typography Overrides

Add to your global CSS (`globals.css` or `tailwind.css`):

```css
@layer base {
  /* Body text - Inter font */
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #0f172a; /* neutral gray-900 */
  }

  /* Headings - Inter Bold */
  h1, h2, h3 {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 700;
    color: #0f172a;
  }

  h1 {
    font-size: 2.25rem; /* 36px */
    line-height: 2.5rem;
    font-weight: 800;
  }

  h2 {
    font-size: 1.875rem; /* 30px */
    line-height: 2.25rem;
  }

  h3 {
    font-size: 1.5rem; /* 24px */
    line-height: 2rem;
    font-weight: 600;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    h1 {
      font-size: 1.875rem; /* 30px on mobile */
      line-height: 2.25rem;
    }
  }
}
```

**Effect**: All text automatically uses Inter font with correct sizes and weights from your spec.

---

### 3. Mobile Touch Target Override

```css
@layer components {
  /* Override DaisyUI default 44px to 54px */
  .btn,
  .input,
  .select,
  .textarea,
  .checkbox {
    min-height: 54px;
  }

  /* Checkbox needs special handling (visual size) */
  .checkbox {
    width: 24px;
    height: 24px;
    min-height: auto; /* Don't stretch checkbox itself */
  }

  /* But the label wrapper should be 54px */
  .form-control .label {
    min-height: 54px;
    display: flex;
    align-items: center;
  }
}
```

**Effect**: All interactive elements meet your 54px minimum touch target requirement.

---

## 🔧 Component-Specific Customizations

### Hero Section

**Base Component**: HyperUI Hero (already styled)

**Customizations Needed**:

#### 1. Hero Image
```jsx
// Use Next.js Image for optimization
import Image from 'next/image';

<Image
  src="/images/hero-bathroom-remodel.webp"
  alt="Modern bathroom remodel"
  width={800}
  height={600}
  priority // LCP optimization
  className="rounded-lg shadow-xl"
/>
```

#### 2. Headline (H1)
```jsx
// Follow brand formula: [Action] + [Benefit] + [Service] + [Urgency]
<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
  Claim Your Exclusive 40% Discount on Bathroom Remodeling Today
</h1>
```

**Brand Formula Application**:
- Action: "Claim"
- Benefit: "40% Discount"
- Service: "Bathroom Remodeling"
- Urgency: "Today"

#### 3. Trust Bar (Below Headline)
```jsx
<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
  <div className="flex items-center gap-2">
    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
    <span>Licensed & Insured in {territory}</span>
  </div>
  <div className="flex items-center gap-2">
    <StarIcon className="w-5 h-5 text-yellow-500" />
    <span>4.9/5 Rating ({reviewCount} reviews)</span>
  </div>
  <div className="flex items-center gap-2">
    <CheckCircleIcon className="w-5 h-5 text-green-600" />
    <span>Free Consultation</span>
  </div>
</div>
```

**Territory Customization**: Replace `{territory}` with dynamic value from Airtable.

---

### Form Inputs

**Base Component**: DaisyUI Input

**Customizations**:

#### 1. ZIP Code Input (Step 1)
```jsx
<div className="form-control w-full">
  <label className="label">
    <span className="label-text font-semibold">Enter Your ZIP Code</span>
  </label>
  <input
    type="text"
    placeholder="12345"
    className="input input-bordered input-primary w-full text-lg"
    pattern="[0-9]{5}"
    maxLength={5}
    required
    aria-label="ZIP Code"
  />
  <label className="label">
    <span className="label-text-alt text-gray-500">
      We serve your area
    </span>
  </label>
</div>
```

**Customizations Applied**:
- ✅ Pattern validation (5 digits)
- ✅ `text-lg` for better mobile readability (16px+)
- ✅ Helper text below input
- ✅ Accessible label

#### 2. Phone Input (Step 2)
```jsx
<div className="form-control w-full">
  <label className="label">
    <span className="label-text font-semibold">Phone Number</span>
  </label>
  <input
    type="tel"
    placeholder="(555) 123-4567"
    className="input input-bordered input-primary w-full text-lg"
    required
    aria-label="Phone Number"
  />
  <label className="label">
    <span className="label-text-alt text-gray-500">
      📞 We'll never share your number
    </span>
  </label>
</div>
```

**Trust Building**: Helper text reassures about privacy.

---

### CTA Buttons

**Base Component**: DaisyUI Button

**Customizations by Context**:

#### 1. Primary CTA (Form Submission)
```jsx
<button
  type="submit"
  className="btn btn-primary w-full text-lg font-semibold shadow-lg hover:shadow-xl"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <span className="loading loading-spinner"></span>
      Processing...
    </>
  ) : (
    `Claim Your ${discountPercent}% Discount` // Dynamic from Airtable
  )}
</button>
```

**Brand Voice Applied**:
- ✅ Value proposition in button text ("Claim Your 40% Discount")
- ✅ Loading state with spinner
- ✅ Shadow for depth (conversion-focused)

#### 2. Secondary CTA (Step Navigation)
```jsx
<button
  type="button"
  className="btn btn-outline btn-primary w-full sm:w-auto"
  onClick={handleBack}
>
  ← Back
</button>
```

**Mobile-First**: Full width on mobile, inline on desktop (`sm:w-auto`).

---

### Progress Indicator

**Base Component**: DaisyUI Steps

**Dynamic State Management**:

```jsx
<ul className="steps w-full mb-8">
  <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>
    ZIP Code
  </li>
  <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>
    Contact Details
  </li>
  <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>
    Confirmation
  </li>
</ul>
```

**Logic**:
- Step 1 active: `step-primary` on first item
- Step 2 active: `step-primary` on first and second items
- Step 3 active: `step-primary` on all items

**Customization**: Steps remain highlighted after completion (shows progress).

---

### TCPA Checkbox

**Base Component**: DaisyUI Checkbox

**Brand Voice Applied**:

```jsx
<div className="form-control">
  <label className="label cursor-pointer justify-start gap-4 bg-gray-50 p-4 rounded-lg">
    <input
      type="checkbox"
      className="checkbox checkbox-primary"
      required
      aria-required="true"
    />
    <span className="label-text text-sm leading-relaxed">
      I agree to receive calls, texts, and emails about my {jobType} project.
      By checking this box, I consent to be contacted by {brandName} and
      its partners. Message and data rates may apply.
      <a
        href="/privacy"
        target="_blank"
        className="link link-primary ml-1"
      >
        Privacy Policy
      </a>
    </span>
  </label>
</div>
```

**Customizations**:
- ✅ Light gray background for emphasis
- ✅ Clear, non-scary language
- ✅ Dynamic job type and brand name
- ✅ Privacy policy link
- ✅ Legal compliance (message rates disclosure)

---

### Validation Messages (Alerts)

**Base Component**: DaisyUI Alert

**Customized States**:

#### Success Alert
```jsx
{isValid && (
  <div className="alert alert-success shadow-lg mb-4 animate-fade-in">
    <svg className="stroke-current flex-shrink-0 w-6 h-6">
      <CheckCircleIcon />
    </svg>
    <span>Great! We serve your area.</span>
  </div>
)}
```

#### Error Alert
```jsx
{error && (
  <div className="alert alert-error shadow-lg mb-4">
    <svg className="stroke-current flex-shrink-0 w-6 h-6">
      <XCircleIcon />
    </svg>
    <span>{error}</span>
  </div>
)}
```

**Animation**: Add fade-in utility:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 200ms ease-out;
}
```

---

### Trust Signals (Stats Block)

**Base Component**: HyperUI Stats

**Territory-Specific Customization**:

```jsx
<div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full">
  <div className="stat place-items-center">
    <div className="stat-figure text-primary">
      <UsersIcon className="w-12 h-12" />
    </div>
    <div className="stat-title">Homeowners Served</div>
    <div className="stat-value text-primary">{homeownersServed}+</div>
    <div className="stat-desc">In {territory} since {yearEstablished}</div>
  </div>

  <div className="stat place-items-center">
    <div className="stat-figure text-secondary">
      <StarIcon className="w-12 h-12" />
    </div>
    <div className="stat-title">Customer Rating</div>
    <div className="stat-value text-secondary">{rating}/5</div>
    <div className="stat-desc">{reviewCount} verified reviews</div>
  </div>

  <div className="stat place-items-center">
    <div className="stat-figure text-success">
      <ShieldCheckIcon className="w-12 h-12" />
    </div>
    <div className="stat-title">Satisfaction Rate</div>
    <div className="stat-value text-success">{satisfactionRate}%</div>
    <div className="stat-desc">Money-back guarantee</div>
  </div>
</div>
```

**Dynamic Values**: All numeric values from Airtable (territory-specific).

---

## 📱 Mobile Responsiveness Patterns

### Stack on Mobile, Grid on Desktop

```jsx
// Hero section layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <div className="order-2 lg:order-1">
    {/* Content: headline, trust bar, form */}
  </div>
  <div className="order-1 lg:order-2">
    {/* Hero image */}
  </div>
</div>
```

**Effect**: Image on top on mobile, right side on desktop.

---

### Full Width Buttons on Mobile

```jsx
<button className="btn btn-primary w-full sm:w-auto">
  {/* Full width on mobile, auto width on small screens and up */}
</button>
```

---

### Horizontal to Vertical Steps

DaisyUI Steps automatically stack vertically on mobile, but you can force it:

```jsx
<ul className="steps steps-vertical lg:steps-horizontal w-full">
  {/* Vertical on all sizes, horizontal on large */}
</ul>
```

---

## 🎨 Brand Voice in Components

### CTA Button Text Formulas

From brand guidelines, apply these patterns:

#### Percentage Discount Offers
```jsx
<button className="btn btn-primary w-full">
  Claim Your {discountPercent}% Discount
</button>
```

#### Dollar Amount Offers
```jsx
<button className="btn btn-primary w-full">
  Get ${dollarAmount} Off Your Project
</button>
```

#### Free Quote Offers
```jsx
<button className="btn btn-primary w-full">
  Get My Free Quote
</button>
```

**Rule**: Button text always includes value proposition (discount/benefit).

---

### Headline Formulas

#### Page Title (Meta)
```jsx
<title>{offerType} {service} in {territory} | {brandName} Deals</title>
```

Example: "Save 40% on Bathroom Remodeling in Boston | HomeServices Deals"

#### H1 Headline
```jsx
<h1>{action} {benefit} on {service} {urgency}</h1>
```

Example: "Claim Your Exclusive 40% Discount on Bathroom Remodeling Today"

---

### Introduction Paragraph (4-Sentence Formula)

```jsx
<p className="text-lg text-gray-700 mb-6">
  {/* 1. Problem Statement */}
  Looking for affordable {service} that delivers quality?
  {/* 2. Solution Bridge */}
  We've negotiated exclusive deals that save homeowners like you an average of {discountPercent}% on premium {service} services.
  {/* 3. Value Statement */}
  Join {customerCount}+ satisfied customers who trust us for home services savings.
  {/* 4. Trust Signal */}
  Your perfect {service} deal is just one click away.
</p>
```

---

## 🔧 Utility Class Patterns

### Common Tailwind Combinations

#### Card/Section Styling
```html
<section className="bg-white py-16 px-4">
  <div className="container mx-auto max-w-6xl">
    <!-- Content -->
  </div>
</section>
```

#### Form Container
```html
<div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-md mx-auto">
  <!-- Form fields -->
</div>
```

#### Button Hover Effects
```html
<button className="btn btn-primary hover:scale-105 transition-transform duration-200">
  <!-- Slight scale on hover -->
</button>
```

---

## ✅ Customization Checklist

For each component you implement, verify:

### Visual Compliance
- [ ] Brand colors applied (primary blue, secondary orange)
- [ ] Typography uses Inter font
- [ ] Spacing follows Tailwind scale
- [ ] Mobile: 54px touch targets
- [ ] Mobile: 16px font size minimum

### Brand Voice Compliance
- [ ] CTA text includes value proposition
- [ ] Headlines follow formula (Action + Benefit + Service + Urgency)
- [ ] Trust signals include specific numbers
- [ ] Urgency messaging is genuine (no false scarcity)
- [ ] Territory-specific customization applied

### Accessibility
- [ ] Semantic HTML (button, input, label)
- [ ] ARIA labels where needed
- [ ] Color contrast ≥4.5:1 for text
- [ ] Keyboard navigation works
- [ ] Form validation messages clear

### Mobile-First
- [ ] Stack vertically on mobile
- [ ] Full-width elements on mobile
- [ ] Touch targets ≥54px
- [ ] No horizontal scroll
- [ ] Thumb-zone CTA placement

---

## 🚀 Quick Reference: Common Customizations

**Add to any DaisyUI button**:
```jsx
className="btn btn-primary shadow-lg hover:shadow-xl transition-all"
```

**Add to any input**:
```jsx
className="input input-bordered input-primary text-lg focus:ring-2 focus:ring-primary"
```

**Add to any section**:
```jsx
className="container mx-auto max-w-6xl px-4 py-16"
```

**Add to any card/panel**:
```jsx
className="bg-white rounded-lg shadow-xl p-6"
```

---

## 📊 Before/After Example

### Before (Raw DaisyUI)
```jsx
<button className="btn btn-primary">
  Submit
</button>
```

### After (Brand Customized)
```jsx
<button
  type="submit"
  className="btn btn-primary w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <span className="loading loading-spinner"></span>
      Processing...
    </>
  ) : (
    `Claim Your ${discountPercent}% Discount`
  )}
</button>
```

**Improvements**:
- ✅ Full width for mobile
- ✅ Larger text (16px+)
- ✅ Shadow for depth
- ✅ Loading state
- ✅ Dynamic, value-focused text
- ✅ Transition effects

---

## 🎯 Next Steps

1. ✅ **You're here**: Understand how to customize components
2. ⏭️ **Next**: Build Order & Acceptance Criteria (what to build first, in what order)
3. ⏭️ **Then**: Playwright Test Scenarios (validation after build)
