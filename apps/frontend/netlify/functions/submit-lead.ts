import type { Handler, HandlerEvent } from '@netlify/functions';
import { CompleteFormSchema } from '@shared/validation/form-schemas';
import { AirtableService } from '../../services/AirtableService';
import { RecaptchaService } from '../../services/RecaptchaService';
import { DuplicateDetectionService } from '../../services/DuplicateDetectionService';

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const formData = JSON.parse(event.body || '{}');

    // Validate form data with Zod
    const validatedData = CompleteFormSchema.parse(formData);

    // Verify reCAPTCHA token (optional - only if secret key is configured)
    if (process.env.RECAPTCHA_SECRET_KEY && validatedData.recaptchaToken !== 'placeholder-token') {
      const recaptchaService = new RecaptchaService(process.env.RECAPTCHA_SECRET_KEY);
      const isHuman = await recaptchaService.verify(validatedData.recaptchaToken);
      if (!isHuman) {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, message: 'reCAPTCHA verification failed' }),
        };
      }
    }

    // Check for duplicates
    const duplicateService = new DuplicateDetectionService(
      process.env.AIRTABLE_API_KEY!,
      process.env.AIRTABLE_BASE_ID!
    );
    const isDuplicate = await duplicateService.checkDuplicate(validatedData);
    if (isDuplicate) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          success: false,
          message: 'We already have your recent submission. We will contact you shortly!',
        }),
      };
    }

    // Submit to Airtable
    const airtableService = new AirtableService(
      process.env.AIRTABLE_API_KEY!,
      process.env.AIRTABLE_BASE_ID!
    );
    const submissionId = await airtableService.createLead(validatedData);

    console.log('Form submission successful:', submissionId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Thank you! We will contact you shortly.',
        submissionId,
      }),
    };
  } catch (error: any) {
    console.error('Form submission error:', error);

    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: error.message || 'An error occurred processing your submission',
        errors: error.errors || [],
      }),
    };
  }
};
