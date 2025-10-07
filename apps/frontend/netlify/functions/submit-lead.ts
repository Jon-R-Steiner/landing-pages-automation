import type { Handler, HandlerEvent } from '@netlify/functions';
import { z } from 'zod';

// Inline schemas to avoid workspace import issues in Netlify Functions
const CompleteFormSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
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
  tcpaConsent: z.literal(true),
  recaptchaToken: z.string().min(1),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  referrer: z.string().optional(),
  landingPageUrl: z.string().url(),
});

type CompleteFormData = z.infer<typeof CompleteFormSchema>;

// Inline Airtable service
async function createAirtableLead(formData: CompleteFormData): Promise<string> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = 'tbl7V4S7GZ25PXLo9';

  if (!apiKey || !baseId) {
    throw new Error('Airtable credentials not configured');
  }

  const record = {
    fields: {
      'Full Name': formData.fullName,
      'Email': formData.email,
      'Phone': formData.phone,
      'ZIP Code': formData.zipCode,
      'Project Type': formData.projectType,
      'Timeframe': formData.timeframe,
      'Budget': formData.budget,
      'Property Type': formData.propertyType,
      'Own or Rent': formData.ownRent,
      'TCPA Consent': formData.tcpaConsent,
      'UTM Source': formData.utmSource || '',
      'UTM Medium': formData.utmMedium || '',
      'UTM Campaign': formData.utmCampaign || '',
      'GCLID': formData.gclid || '',
      'FBCLID': formData.fbclid || '',
      'Landing Page URL': formData.landingPageUrl,
      'Submission Date': new Date().toISOString(),
      'Status': 'Pending',
    },
  };

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }

  const result = await response.json();
  return result.id;
}

// Inline duplicate detection
async function checkDuplicate(formData: CompleteFormData): Promise<boolean> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = 'tbl7V4S7GZ25PXLo9';

  if (!apiKey || !baseId) {
    return false; // Skip duplicate check if not configured
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const filterFormula = `AND(
    OR({Email} = '${formData.email}', {Phone} = '${formData.phone}'),
    IS_AFTER({Submission Date}, '${twentyFourHoursAgo}')
  )`;

  const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${encodeURIComponent(filterFormula)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('Duplicate check failed:', await response.text());
      return false; // Don't block submission on duplicate check failure
    }

    const result = await response.json();
    return result.records && result.records.length > 0;
  } catch (error) {
    console.error('Duplicate check error:', error);
    return false; // Don't block submission on error
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const formData = JSON.parse(event.body || '{}');

    // Validate form data with Zod
    const validatedData = CompleteFormSchema.parse(formData);

    // Check for duplicates
    const isDuplicate = await checkDuplicate(validatedData);
    if (isDuplicate) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'We already have your recent submission. We will contact you shortly!',
        }),
      };
    }

    // Submit to Airtable
    const submissionId = await createAirtableLead(validatedData);

    console.log('Form submission successful:', submissionId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you! We will contact you shortly.',
        submissionId,
      }),
    };
  } catch (error: any) {
    console.error('Form submission error:', error);

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error.message || 'An error occurred processing your submission',
      }),
    };
  }
};
