import { z } from 'zod';

// Step 1: Basic Info Schema
export const Step1Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, 'Invalid phone number'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
});

export type Step1Data = z.infer<typeof Step1Schema>;

// Step 2: Project Details Schema
export const Step2Schema = z.object({
  projectType: z.enum([
    'walk-in-shower',
    'full-bathroom-remodel',
    'bathtub-installation',
    'shower-installation',
    'accessibility-bathroom',
    'luxury-bathroom',
    'small-bathroom',
    'master-bathroom',
  ]),
  timeframe: z.enum(['immediate', '1-3-months', '3-6-months', '6-12-months', 'just-exploring']),
  budget: z.enum(['under-5k', '5k-10k', '10k-20k', '20k-50k', 'over-50k']),
  propertyType: z.enum(['single-family', 'condo', 'apartment', 'townhouse', 'mobile-home']),
  ownRent: z.enum(['own', 'rent']),
});

export type Step2Data = z.infer<typeof Step2Schema>;

// Step 3: TCPA Consent Schema
export const Step3Schema = z.object({
  tcpaConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to receive communications' }),
  }),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required'),
});

export type Step3Data = z.infer<typeof Step3Schema>;

// Complete Form Schema
export const CompleteFormSchema = Step1Schema.merge(Step2Schema).merge(Step3Schema).extend({
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  referrer: z.string().optional(),
  landingPageUrl: z.string().url(),
});

export type CompleteFormData = z.infer<typeof CompleteFormSchema>;
