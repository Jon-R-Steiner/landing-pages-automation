// Local types to replace @shared workspace imports
// This avoids bundling issues in Netlify deployment

export type PageType =
  | 'walk-in-shower'
  | 'full-bathroom-remodel'
  | 'bathtub-installation'
  | 'shower-installation'
  | 'accessibility-bathroom'
  | 'luxury-bathroom'
  | 'small-bathroom'
  | 'master-bathroom';

export interface FormData {
  // Step 1: Basic Info
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;

  // Step 2: Project Details
  projectType: PageType;
  timeframe: 'immediate' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-exploring';
  budget: 'under-5k' | '5k-10k' | '10k-20k' | '20k-50k' | 'over-50k';
  propertyType: 'single-family' | 'condo' | 'apartment' | 'townhouse' | 'mobile-home';
  ownRent: 'own' | 'rent';

  // Step 3: TCPA Consent
  tcpaConsent: boolean;
  recaptchaToken: string;

  // Marketing tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPageUrl: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  errors?: any[];
}
