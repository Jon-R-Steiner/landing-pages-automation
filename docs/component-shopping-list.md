# Component Shopping List

**Project**: Landing Pages Automation
**Purpose**: Exact component sources for dev-agent implementation
**Date**: 2025-10-07
**Author**: Sally (UX Expert)

---

## 🎯 Implementation Strategy

**Approach**: Use pre-built Tailwind components to accelerate development
**Primary Sources**: DaisyUI (forms), HyperUI (marketing sections), Tailblocks (backup)
**Integration**: Copy HTML/JSX, customize with brand colors and content

---

## 📦 Required Setup

### 1. Install DaisyUI

```bash
npm install -D daisyui@latest
```

### 2. Configure Tailwind (`tailwind.config.js`)

```javascript
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        landingpages: {
          "primary": "#1e40af",      // Trust blue
          "secondary": "#ea580c",    // Urgency orange
          "accent": "#fb923c",       // Orange light
          "success": "#059669",      // Validation green
          "error": "#dc2626",        // Error red
          "neutral": "#0f172a",      // Text gray-900
          "base-100": "#ffffff",     // White background
          "base-200": "#f8fafc",     // Gray-50 background
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
```

---

## 🛒 Component Inventory by Page Section

### **Hero Section (Landing Page Entry Point)**

#### Component: Hero with Form Integration
- **Source**: HyperUI Marketing Heroes
- **Direct URL**: https://www.hyperui.dev/components/marketing/heroes
- **Specific Component**: "Hero with vertical split" or "Hero with form"
- **Why**: Clean layout, mobile-first, perfect for image + form combination

**What to Copy**:
```html
<!-- Full hero section HTML from HyperUI -->
<!-- Will need customization for: -->
<!-- - Hero image (WebP format) -->
<!-- - Headline text (use H1 formula from brand guidelines) -->
<!-- - Trust bar integration -->
```

**Customizations Needed**:
- Replace placeholder image with WebP hero image
- Update headline to follow brand formula: `[Action] + [Benefit] + [Service] + [Urgency]`
- Add trust signals bar below headline
- Integrate Form Step 1 (ZIP entry)

---

### **Form Components (Multi-Step Form)**

#### Component: Text Input (ZIP Code, Email, Phone, Name)
- **Source**: DaisyUI Input
- **Direct URL**: https://daisyui.com/components/input/
- **Variants Needed**:
  - Standard input (name, email)
  - Tel input (phone)
  - Text input with pattern validation (ZIP code)

**Copy This HTML**:
```html
<input
  type="text"
  placeholder="Enter ZIP Code"
  className="input input-bordered input-primary w-full"
  required
/>
```

**Customizations**:
- Add real-time validation (Zod schema)
- Error state: `input-error` class
- Success state: `input-success` class
- Mobile: Always full width
- Font size: 16px minimum (prevents iOS zoom)
- Touch target: 54px minimum height

---

#### Component: CTA Button (Primary Actions)
- **Source**: DaisyUI Button
- **Direct URL**: https://daisyui.com/components/button/
- **Variants Needed**: Primary (most CTAs), Loading state (during submission)

**Copy This HTML**:
```html
<button className="btn btn-primary w-full">
  Claim Your 40% Discount
</button>

<!-- Loading state -->
<button className="btn btn-primary w-full" disabled>
  <span className="loading loading-spinner"></span>
  Processing...
</button>
```

**Customizations**:
- Text must follow CTA standards from brand guidelines
- Mobile: Full width (`w-full`)
- Desktop: Can be inline or full width based on context
- Loading spinner during form submission
- Disabled state during validation

---

#### Component: Progress Indicator (3-Step Visual)
- **Source**: DaisyUI Steps
- **Direct URL**: https://daisyui.com/components/steps/
- **Variant**: Horizontal steps with checkmarks

**Copy This HTML**:
```html
<ul className="steps w-full">
  <li className="step step-primary">ZIP Code</li>
  <li className="step">Contact Details</li>
  <li className="step">Confirmation</li>
</ul>
```

**Customizations**:
- Update classes dynamically based on current step
- Step 1 active: `step step-primary`
- Step completed: `step step-primary` (stays primary)
- Step pending: `step` (default gray)
- Mobile: Stack vertically or use compact horizontal
- Position: Top of form, always visible

---

#### Component: Checkbox (TCPA Consent)
- **Source**: DaisyUI Checkbox
- **Direct URL**: https://daisyui.com/components/checkbox/
- **Variant**: Standard checkbox with custom label

**Copy This HTML**:
```html
<div className="form-control">
  <label className="label cursor-pointer justify-start gap-4">
    <input
      type="checkbox"
      className="checkbox checkbox-primary"
      required
    />
    <span className="label-text text-sm">
      I agree to receive calls and texts about my project.
      <a href="/privacy" className="link">Privacy Policy</a>
    </span>
  </label>
</div>
```

**Customizations**:
- Must be checked before form submission
- Clear, non-scary TCPA language
- Link to privacy policy (opens new tab)
- Touch target: 54px minimum (including label)
- Error state if not checked on submit attempt

---

#### Component: Select Dropdown (Job Type, How Did You Hear)
- **Source**: DaisyUI Select
- **Direct URL**: https://daisyui.com/components/select/
- **Variant**: Standard select with options

**Copy This HTML**:
```html
<select className="select select-bordered select-primary w-full">
  <option disabled selected>Select job type</option>
  <option>Bathroom Remodel</option>
  <option>HVAC Installation</option>
  <option>Roofing</option>
  <option>Other</option>
</select>
```

**Customizations**:
- Dynamic options based on offer type
- Default placeholder option disabled
- Full width on mobile
- Match input height (54px minimum)

---

#### Component: Textarea (Comments/Questions)
- **Source**: DaisyUI Textarea
- **Direct URL**: https://daisyui.com/components/textarea/
- **Variant**: Optional field for additional details

**Copy This HTML**:
```html
<textarea
  className="textarea textarea-bordered textarea-primary w-full"
  placeholder="Tell us about your project (optional)"
  rows="3"
></textarea>
```

**Customizations**:
- Optional field (no `required` attribute)
- 3 rows minimum
- Auto-resize on mobile if needed
- Character limit: 500 characters

---

#### Component: Alert/Validation Messages
- **Source**: DaisyUI Alert
- **Direct URL**: https://daisyui.com/components/alert/
- **Variants Needed**: Success, Error, Info

**Copy This HTML**:
```html
<!-- Success -->
<div className="alert alert-success">
  <svg><!-- checkmark icon --></svg>
  <span>ZIP code validated! We serve your area.</span>
</div>

<!-- Error -->
<div className="alert alert-error">
  <svg><!-- error icon --></svg>
  <span>Please enter a valid 5-digit ZIP code.</span>
</div>

<!-- Info -->
<div className="alert alert-info">
  <svg><!-- info icon --></svg>
  <span>Checking availability in your area...</span>
</div>
```

**Customizations**:
- Display inline below form fields
- 200ms fade-in animation
- Auto-dismiss success messages after 3 seconds
- Keep error messages until corrected
- Use Heroicons for icons

---

### **Trust Signals & Social Proof**

#### Component: Stats Block (Trust Signals)
- **Source**: HyperUI Marketing Stats
- **Direct URL**: https://www.hyperui.dev/components/marketing/stats
- **Specific Component**: Any stats grid layout

**What to Copy**:
```html
<!-- Stats grid showing trust signals -->
<!-- Customize with: -->
<!-- - "10,000+ Homeowners Served" -->
<!-- - "15 Years Experience" -->
<!-- - "4.9/5 Rating" -->
```

**Customizations**:
- Place below hero headline or above form
- Mobile: Stack vertically
- Desktop: 3-column grid
- Icons: Use Heroicons (shield, star, checkmark)
- Territory-specific numbers when available

---

#### Component: Trust Badge Row
- **Source**: Custom (Tailblocks Feature as base)
- **Base URL**: https://tailblocks.cc/ → Feature sections
- **Variant**: Icon + text horizontal row

**Create Custom Component**:
```html
<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5"><!-- shield icon --></svg>
    <span>Licensed & Insured</span>
  </div>
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5"><!-- star icon --></svg>
    <span>4.9/5 Rating (2,500+ reviews)</span>
  </div>
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5"><!-- checkmark icon --></svg>
    <span>Free Consultation</span>
  </div>
</div>
```

**Placement**: Immediately below H1 headline, above form

---

### **Thank You Page**

#### Component: CTA Section with Success Message
- **Source**: HyperUI Marketing CTA
- **Direct URL**: https://www.hyperui.dev/components/marketing/ctas
- **Specific Component**: Centered CTA with heading

**What to Copy**:
```html
<!-- Success message layout -->
<!-- Customize with: -->
<!-- - Success icon/illustration -->
<!-- - "Thank You!" headline -->
<!-- - Next steps messaging -->
<!-- - Secondary CTA (call, email) -->
```

**Customizations**:
- Success green color scheme
- Clear next steps ("A contractor will call within 24 hours")
- Phone number prominently displayed
- Email confirmation mention
- Social proof ("Join 10,000+ satisfied homeowners")

---

## 🔄 Optional/Advanced Components (Phase 2+)

### Component: Modal (Error Recovery)
- **Source**: DaisyUI Modal
- **URL**: https://daisyui.com/components/modal/
- **Use Case**: Show errors that require user attention (duplicate submission, invalid ZIP not served)

### Component: Tooltip (Form Hints)
- **Source**: DaisyUI Tooltip
- **URL**: https://daisyui.com/components/tooltip/
- **Use Case**: Explain TCPA consent, why we need phone number

### Component: Loading Spinner
- **Source**: DaisyUI Loading
- **URL**: https://daisyui.com/components/loading/
- **Use Case**: Form submission, reCAPTCHA validation

---

## 📱 Mobile-First Implementation Notes

**Critical Mobile Adjustments**:

1. **Touch Targets**: All DaisyUI components default to 44px, override to 54px:
   ```css
   .btn, .input, .select, .checkbox {
     min-height: 54px;
   }
   ```

2. **Font Size**: Override DaisyUI defaults to 16px minimum:
   ```css
   .input, .select, .textarea {
     font-size: 16px; /* Prevents iOS zoom */
   }
   ```

3. **Full Width on Mobile**: All form elements and buttons:
   ```html
   <input className="input input-bordered w-full" />
   <button className="btn btn-primary w-full sm:w-auto">Submit</button>
   ```

---

## 🎨 Brand Color Integration

**DaisyUI Theme Variable Mapping**:

| Spec Color | DaisyUI Variable | Hex Code | Usage |
|------------|------------------|----------|-------|
| Primary Blue | `primary` | #1e40af | CTA buttons, links, active states |
| Accent Orange | `secondary` | #ea580c | Savings badges, urgency elements |
| Success Green | `success` | #059669 | Validation success, checkmarks |
| Error Red | `error` | #dc2626 | Validation errors, warnings |
| Neutral Gray | `neutral` | #0f172a | Body text, headings |
| Background White | `base-100` | #ffffff | Page background |
| Background Gray | `base-200` | #f8fafc | Alternate sections |

**Usage in Components**:
- Primary button: `btn-primary` (applies primary color)
- Error input: `input-error` (applies error color)
- Success alert: `alert-success` (applies success color)

---

## ✅ Component Checklist (Dev-Agent Reference)

Use this checklist when implementing:

### Hero Section
- [ ] Copy HyperUI hero HTML
- [ ] Replace hero image with WebP format
- [ ] Update headline with brand formula
- [ ] Add trust signals bar
- [ ] Integrate Form Step 1 (ZIP entry)
- [ ] Test mobile layout

### Form Step 1 (ZIP Entry)
- [ ] Copy DaisyUI input component
- [ ] Add ZIP validation (5 digits, numeric only)
- [ ] Copy DaisyUI button for CTA
- [ ] Update CTA text per brand guidelines
- [ ] Add real-time validation feedback
- [ ] Test 54px touch targets on mobile

### Form Step 2 (Contact Details)
- [ ] Copy DaisyUI inputs (name, email, phone)
- [ ] Copy DaisyUI select (job type, how did you hear)
- [ ] Copy DaisyUI textarea (comments)
- [ ] Add validation for all fields
- [ ] Update progress indicator to step 2
- [ ] Test form field tabbing order

### Form Step 3 (TCPA Consent)
- [ ] Copy DaisyUI checkbox
- [ ] Write clear TCPA consent text
- [ ] Link to privacy policy
- [ ] Add reCAPTCHA integration
- [ ] Update progress indicator to step 3
- [ ] Show submission loading state

### Progress Indicator
- [ ] Copy DaisyUI steps component
- [ ] Configure 3 steps (ZIP, Contact, Consent)
- [ ] Update active/completed states dynamically
- [ ] Test mobile horizontal layout
- [ ] Ensure always visible during form flow

### Thank You Page
- [ ] Copy HyperUI CTA section
- [ ] Add success messaging
- [ ] Display next steps clearly
- [ ] Show phone number prominently
- [ ] Add secondary CTAs (call, email)

### Trust Signals
- [ ] Copy HyperUI stats component
- [ ] Populate with real trust numbers
- [ ] Add Heroicons for visual interest
- [ ] Make territory-specific when possible
- [ ] Test mobile stacking

---

## 🔗 Quick Reference Links

**Primary Sources**:
- DaisyUI Components: https://daisyui.com/components/
- HyperUI Marketing: https://www.hyperui.dev/components/marketing
- Tailblocks (backup): https://tailblocks.cc/
- Heroicons: https://heroicons.com/

**Documentation**:
- DaisyUI Theme Config: https://daisyui.com/docs/themes/
- Tailwind CSS Docs: https://tailwindcss.com/docs
- Next.js Image Optimization: https://nextjs.org/docs/app/api-reference/components/image

---

## 📊 Estimated Time Savings

Using pre-built components vs. building from scratch:

| Component | Build from Scratch | Using DaisyUI/HyperUI | Time Saved |
|-----------|-------------------|----------------------|------------|
| Form inputs with validation | 4 hours | 30 minutes | 3.5 hours |
| Multi-step progress | 2 hours | 15 minutes | 1.75 hours |
| Hero section | 3 hours | 30 minutes | 2.5 hours |
| Trust signals | 2 hours | 20 minutes | 1.67 hours |
| Thank you page | 1.5 hours | 20 minutes | 1.25 hours |
| **Total** | **12.5 hours** | **1.9 hours** | **10.6 hours** |

**Expected Savings**: ~85% faster implementation using pre-built components

---

## 🚀 Next Steps

1. ✅ **You're here**: Review component sources
2. ⏭️ **Next**: Component Customization Guide (how to adapt each component)
3. ⏭️ **Then**: Build Order & Acceptance Criteria (what to build first)
4. ⏭️ **Finally**: Playwright Test Scenarios (validation checklist)
