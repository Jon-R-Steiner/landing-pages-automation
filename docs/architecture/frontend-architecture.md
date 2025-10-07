# Frontend Architecture

This section defines the Next.js 15.5 frontend architecture, including App Router structure, component patterns, multi-step form implementation, state management, and routing strategy.

## Next.js App Router Structure

**Directory Layout**:
```
apps/frontend/
├── app/
│   ├── layout.tsx                    # Root layout with GTM, global styles
│   ├── page.tsx                      # Homepage (optional - not MVP scope)
│   ├── [slug]/
│   │   └── page.tsx                  # Dynamic landing page route
│   ├── thank-you/
│   │   └── page.tsx                  # Static thank you confirmation
│   └── api/
│       ├── submit-form/
│       │   └── route.ts              # Form submission handler (POST)
│       ├── validate-recaptcha/
│       │   └── route.ts              # reCAPTCHA validation (POST)
│       └── webhook-make-com/
│           └── route.ts              # Make.com webhook receiver (POST)
├── components/
│   ├── LandingPageHero.tsx           # Hero section with image
│   ├── MultiStepForm/                # Multi-step form module
│   │   ├── MultiStepForm.tsx         # Form orchestrator
│   │   ├── Step1BasicInfo.tsx        # Name, email, phone, zip
│   │   ├── Step2ProjectDetails.tsx   # Job type, source, comments
│   │   ├── Step3TCPAConsent.tsx      # TCPA + reCAPTCHA
│   │   └── FormProgressBar.tsx       # Step indicator (1/3, 2/3, 3/3)
│   ├── FormField.tsx                 # Reusable input with validation
│   ├── RecaptchaBadge.tsx            # reCAPTCHA v3 badge
│   ├── GoogleTagManager.tsx          # GTM script injection
│   └── ErrorBoundary.tsx             # Error handling wrapper
├── contexts/
│   ├── FormContext.tsx               # Multi-step form state
│   └── MarketingContext.tsx          # UTM + click ID tracking
├── lib/
│   ├── airtable.ts                   # Airtable client wrapper
│   ├── recaptcha.ts                  # reCAPTCHA v3 helper
│   ├── placeholders.ts               # Centralized placeholder image library (see § Image Asset Strategy)
│   └── validation.ts                 # Zod schema exports
├── styles/
│   └── globals.css                   # Tailwind + custom styles
├── public/
│   └── images/                       # See § Monorepo Layout for complete structure
│       └── [8 categories]            # heroes, testimonials, badges, before-after, process, team, portfolio, icons, logos
└── next.config.js                    # Next.js configuration
```

**Route Generation Strategy**:
- **Dynamic Routes**: `[slug]` parameter fetches landing page from Airtable by slug
- **Static Routes**: Thank you page is static (no data fetching)
- **Build Time**: SSG (Static Site Generation) with `getStaticPaths` for all published landing pages
- **Incremental Static Regeneration (ISR)**: Not used in Phase 1 (full rebuild on Airtable changes)

---

## Component Architecture

### Page Components

**`app/[slug]/page.tsx` - Dynamic Landing Page**
```typescript
import { Metadata } from 'next';
import { LandingPageHero } from '@/components/LandingPageHero';
import { MultiStepForm } from '@/components/MultiStepForm';
import { notFound } from 'next/navigation';
import { fetchLandingPageBySlug } from '@/lib/airtable';

export async function generateStaticParams() {
  // Fetch all published landing pages from Airtable
  const pages = await fetchPublishedLandingPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await fetchLandingPageBySlug(params.slug);
  if (!page) return {};

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    openGraph: {
      title: page.metadata.ogTitle || page.metadata.title,
      description: page.metadata.ogDescription || page.metadata.description,
      images: [page.heroImage],
    },
  };
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const page = await fetchLandingPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <main>
      <LandingPageHero
        title={page.title}
        heroImage={page.heroImage}
        heroImageAlt={page.heroImageAlt}
      />
      <section dangerouslySetInnerHTML={{ __html: page.generatedContent }} />
      <MultiStepForm landingPageId={page.id} />
    </main>
  );
}
```

**`app/thank-you/page.tsx` - Static Thank You Page**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You | YourBrand',
  description: 'We have received your submission.',
  robots: 'noindex, nofollow', // Prevent indexing
};

export default function ThankYouPage() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-xl mb-8">
        We have received your submission and will contact you shortly.
      </p>
      <p className="text-gray-600">
        A confirmation email has been sent to your email address.
      </p>
    </main>
  );
}
```

**`app/layout.tsx` - Root Layout**
```typescript
import { Inter } from 'next/font/google';
import { GoogleTagManager } from '@/components/GoogleTagManager';
import { MarketingProvider } from '@/contexts/MarketingContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <MarketingProvider>
            {children}
          </MarketingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

### Multi-Step Form Implementation

**`components/MultiStepForm/MultiStepForm.tsx` - Form Orchestrator**
```typescript
'use client';

import { useState } from 'react';
import { FormProvider } from '@/contexts/FormContext';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2ProjectDetails } from './Step2ProjectDetails';
import { Step3TCPAConsent } from './Step3TCPAConsent';
import { FormProgressBar } from './FormProgressBar';

interface MultiStepFormProps {
  landingPageId: string;
}

export function MultiStepForm({ landingPageId }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <FormProvider landingPageId={landingPageId}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <FormProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {currentStep === 1 && <Step1BasicInfo onNext={handleNextStep} />}
        {currentStep === 2 && (
          <Step2ProjectDetails onNext={handleNextStep} onBack={handlePrevStep} />
        )}
        {currentStep === 3 && (
          <Step3TCPAConsent onBack={handlePrevStep} />
        )}
      </div>
    </FormProvider>
  );
}
```

**`components/MultiStepForm/Step1BasicInfo.tsx` - Step 1**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '@/lib/validation';
import { FormField } from '@/components/FormField';
import { useFormContext } from '@/contexts/FormContext';

interface Step1Data {
  fullName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
}

export function Step1BasicInfo({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useFormContext();
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  });

  const onSubmit = (data: Step1Data) => {
    updateFormData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Get Your Free Quote</h2>

      <FormField
        label="Full Name"
        name="fullName"
        type="text"
        register={register}
        error={errors.fullName}
        placeholder="John Smith"
      />

      <FormField
        label="Email Address"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        placeholder="john@example.com"
      />

      <FormField
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        register={register}
        error={errors.phoneNumber}
        placeholder="(555) 123-4567"
      />

      <FormField
        label="ZIP Code"
        name="zipCode"
        type="text"
        register={register}
        error={errors.zipCode}
        placeholder="12345"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Next Step →
      </button>
    </form>
  );
}
```

**`components/MultiStepForm/Step3TCPAConsent.tsx` - Step 3 with reCAPTCHA**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '@/lib/validation';
import { useFormContext } from '@/contexts/FormContext';
import { useMarketingContext } from '@/contexts/MarketingContext';
import { RecaptchaBadge } from '@/components/RecaptchaBadge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Step3TCPAConsent({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { formData } = useFormContext();
  const { getMarketingData } = useMarketingContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step3Schema),
  });

  const onSubmit = async (data: { tcpaConsent: boolean }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Execute reCAPTCHA v3
      const recaptchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'submit_form' }
      );

      // Combine all form data
      const completeFormData = {
        ...formData,
        ...data,
        ...getMarketingData(),
        recaptchaToken,
      };

      // Submit to backend
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      // Redirect to thank you page
      router.push('/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Final Step</h2>

      <div className="bg-gray-50 p-6 rounded-lg">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('tcpaConsent')}
            className="mt-1 h-5 w-5 text-blue-600"
          />
          <span className="text-sm text-gray-700">
            By checking this box and clicking Submit, I consent to receive autodialed and/or
            pre-recorded telemarketing calls and/or text messages from YourBrand or its
            partners at the telephone number provided above. I understand that consent is not
            a condition of purchase.
          </span>
        </label>
        {errors.tcpaConsent && (
          <p className="text-red-600 text-sm mt-2">{errors.tcpaConsent.message as string}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <RecaptchaBadge />

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
```

---

## State Management

### FormContext - Multi-Step Form State

**`contexts/FormContext.tsx`**
```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  jobType: string;
  howDidYouHear: string;
  commentsOrQuestions: string;
}

interface FormContextType {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  landingPageId: string;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children, landingPageId }: { children: ReactNode; landingPageId: string }) {
  const [formData, setFormData] = useState<Partial<FormData>>({});

  // Persist form data to sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem(`form_${landingPageId}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [landingPageId]);

  const updateFormData = (data: Partial<FormData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    sessionStorage.setItem(`form_${landingPageId}`, JSON.stringify(updatedData));
  };

  const resetForm = () => {
    setFormData({});
    sessionStorage.removeItem(`form_${landingPageId}`);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm, landingPageId }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
}
```

### MarketingContext - UTM and Click ID Tracking

**`contexts/MarketingContext.tsx`**
```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MarketingData {
  gclid: string | null;
  fbclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  referrer: string | null;
  pageUrl: string;
}

const MarketingContext = createContext<{ getMarketingData: () => MarketingData } | undefined>(undefined);

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);

  useEffect(() => {
    // Capture marketing parameters once on page load
    const urlParams = new URLSearchParams(window.location.search);

    const data: MarketingData = {
      gclid: urlParams.get('gclid'),
      fbclid: urlParams.get('fbclid'),
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
      utmTerm: urlParams.get('utm_term'),
      utmContent: urlParams.get('utm_content'),
      referrer: document.referrer || null,
      pageUrl: window.location.href,
    };

    setMarketingData(data);

    // Store in sessionStorage for persistence across form steps
    sessionStorage.setItem('marketing_data', JSON.stringify(data));
  }, []);

  const getMarketingData = (): MarketingData => {
    if (marketingData) return marketingData;

    // Fallback to sessionStorage if context not initialized
    const stored = sessionStorage.getItem('marketing_data');
    return stored ? JSON.parse(stored) : {
      gclid: null,
      fbclid: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      referrer: null,
      pageUrl: window.location.href,
    };
  };

  return (
    <MarketingContext.Provider value={{ getMarketingData }}>
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketingContext() {
  const context = useContext(MarketingContext);
  if (!context) throw new Error('useMarketingContext must be used within MarketingProvider');
  return context;
}
```

---

## Client-Side Validation

**Validation Strategy**: Dual validation with Zod schemas shared between frontend and backend.

**`packages/shared/src/validation/form-schemas.ts`**
```typescript
import { z } from 'zod';

export const step1Schema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
});

export const step2Schema = z.object({
  jobType: z.string().min(1, 'Job type is required'),
  howDidYouHear: z.enum(['Online Search', 'Social Media', 'Referral', 'Advertisement', 'Other']),
  commentsOrQuestions: z.string().max(1000).optional(),
});

export const step3Schema = z.object({
  tcpaConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to receive communications' }),
  }),
});

export const completeFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);
```

**Frontend Usage**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '@/lib/validation';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(step1Schema),
});
```

**Backend Usage**:
```typescript
import { completeFormSchema } from '@shared/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const result = completeFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.errors }, { status: 400 });
  }

  // Process validated data...
}
```

---

## Image Optimization

**Next.js Image Component Strategy**:

```typescript
import Image from 'next/image';

export function LandingPageHero({ title, heroImage, heroImageAlt }: {
  title: string;
  heroImage: string;
  heroImageAlt: string;
}) {
  return (
    <section className="relative h-[500px] w-full">
      <Image
        src={heroImage}
        alt={heroImageAlt}
        fill
        priority // Load hero image immediately (LCP optimization)
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white text-center">
          {title}
        </h1>
      </div>
    </section>
  );
}
```

**Image Optimization Benefits**:
- Automatic WebP conversion (modern browsers)
- Responsive image sizes with `sizes` attribute
- Lazy loading by default (except `priority` images)
- Automatic `width` and `height` attributes for CLS prevention
- CDN integration (Netlify Image CDN)

**Pre-Optimized Hero Images**:
- Stored in `public/images/heroes/` as WebP format
- Dimensions: 1920x1080 (16:9 aspect ratio)
- Optimized with 85% quality for balance of file size and quality
- Named by service type (e.g., `walk-in-shower.webp`)

---

## Routing Strategy

**Static Generation (SSG)**:
```typescript
// Generate static paths at build time for all published landing pages
export async function generateStaticParams() {
  const pages = await fetchPublishedLandingPages(); // Fetch from Airtable
  return pages.map((page) => ({ slug: page.slug }));
}
```

**Build Triggers**:
1. Manual build trigger in Netlify dashboard
2. Make.com automation triggers Netlify deploy hook when landing page status = "approved"
3. Full site rebuild regenerates all static pages

**404 Handling**:
- Unpublished or deleted landing pages return Next.js 404 page
- Custom 404 page with branded messaging (future enhancement)

**Redirects**: Not needed in Phase 1 (no URL changes or migrations)

---

## Performance Optimizations

**Core Web Vitals Targets**:
- **LCP (Largest Contentful Paint)**: <2.5s
  - Hero image loaded with `priority` flag
  - Minimal blocking JavaScript
  - Pre-optimized WebP images

- **CLS (Cumulative Layout Shift)**: <0.1
  - Fixed dimensions for all images
  - No layout shifts during form step transitions
  - Skeleton loaders for any delayed content

- **INP (Interaction to Next Paint)**: <200ms
  - Minimal JavaScript on initial page load
  - React hydration optimized with App Router
  - Optimized event handlers and interaction responsiveness
  - Form validation deferred until user interaction

**Bundle Optimization**:
- Turbopack for fast builds (Next.js 15.5)
- Tree shaking for unused code elimination
- Code splitting by route (automatic with App Router)
- Client components only where interactivity needed

**Caching Strategy**:
- Static pages cached indefinitely by Netlify CDN
- API routes marked as non-cacheable
- Browser cache: 1 year for images, 1 hour for HTML

---

## Accessibility (a11y)

**WCAG 2.1 AA Compliance**:
- Semantic HTML5 elements (`<main>`, `<section>`, `<form>`)
- ARIA labels for form fields and buttons
- Keyboard navigation support (tab order, Enter to submit)
- Focus indicators on interactive elements
- Color contrast ratio ≥4.5:1 for text

**Form Accessibility**:
```typescript
<label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
  Full Name <span className="text-red-500">*</span>
</label>
<input
  id="fullName"
  type="text"
  aria-required="true"
  aria-invalid={!!errors.fullName}
  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
  {...register('fullName')}
/>
{errors.fullName && (
  <p id="fullName-error" role="alert" className="text-red-600 text-sm mt-1">
    {errors.fullName.message}
  </p>
)}
```

**Error Handling**:
- Inline validation errors announced to screen readers (`role="alert"`)
- Form-level errors displayed above submit button
- Success messages announced after submission

---

## SEO Implementation

**Metadata Strategy**:
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await fetchLandingPageBySlug(params.slug);

  return {
    title: page.metadata.title, // "Professional Bathroom Remodel Services | YourBrand"
    description: page.metadata.description, // 150-160 chars
    robots: page.status === 'published' ? 'index, follow' : 'noindex, nofollow',
    openGraph: {
      type: 'website',
      title: page.metadata.ogTitle || page.metadata.title,
      description: page.metadata.ogDescription || page.metadata.description,
      images: [{ url: page.heroImage, width: 1920, height: 1080 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metadata.ogTitle || page.metadata.title,
      description: page.metadata.ogDescription || page.metadata.description,
      images: [page.heroImage],
    },
  };
}
```

**Canonical URLs** (Phase 2):
- Self-referencing canonical tags prevent duplicate content issues
- Format: `<link rel="canonical" href="https://example.com/bathroom-remodel/" />`

**Structured Data** (Phase 2):
- Service schema for service type pages
- FAQ schema for common questions
- LocalBusiness schema for location-based services

---

## Error Handling

**Error Boundary**:
```typescript
'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Phase 2)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">We're sorry for the inconvenience.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**API Error Responses**:
- 400: Validation errors with specific field messages
- 429: Duplicate submission detected (5-minute window)
- 500: Server errors with generic message (no sensitive details)

---

## Testing Strategy (Frontend)

**Unit Tests** (Vitest):
- Component rendering tests
- Form validation tests
- Context state management tests

**Integration Tests** (React Testing Library):
- Multi-step form flow
- Form submission with mock API
- Error handling scenarios

**E2E Tests** (Playwright):
- Complete user journey (form submission)
- reCAPTCHA integration
- Thank you page redirect
- Mobile responsiveness

---

## Frontend Architecture Rationale

**Why Next.js App Router**:
- Server Components reduce client-side JavaScript
- Simplified data fetching with `async` components
- Improved performance with streaming and suspense
- Better SEO with server-side rendering
- File-based routing reduces boilerplate

**Why Multi-Step Form**:
- Improved conversion rates (35-45% higher completion)
- Reduced cognitive load per step
- Better mobile user experience
- Progress tracking increases commitment
- Easier validation per step

**Why React Hook Form + Zod**:
- Minimal re-renders (better performance)
- Built-in validation with Zod schemas
- Type-safe form data with TypeScript
- Easy integration with Next.js
- Shared validation logic with backend

**Why Context API (not Redux)**:
- Simpler setup for small state needs
- No external dependencies
- Built into React
- Sufficient for multi-step form state
- Avoids over-engineering for MVP

---
