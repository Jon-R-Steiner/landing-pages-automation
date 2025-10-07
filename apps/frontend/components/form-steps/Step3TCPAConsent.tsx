'use client';

import { useState } from 'react';
import { Step3Schema } from '@/lib/validation';
import type { FormData } from '@/types';
import { z } from 'zod';

interface Step3Props {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  prevStep: () => void;
  handleSubmit: () => Promise<void>;
}

export default function Step3TCPAConsent({
  formData,
  updateFormData,
  prevStep,
  handleSubmit,
}: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formValues = {
      tcpaConsent: (form.elements.namedItem('tcpaConsent') as HTMLInputElement).checked,
    };

    try {
      // Validate TCPA consent
      if (!formValues.tcpaConsent) {
        setErrors({ tcpaConsent: 'You must agree to receive communications' });
        return;
      }

      setIsSubmitting(true);

      // Execute reCAPTCHA Enterprise
      const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdOtuErAAAAAD1Dg7n5UqezgTewr1369I1chAAE';

      if (typeof window !== 'undefined' && (window as any).grecaptcha?.enterprise) {
        await (window as any).grecaptcha.enterprise.ready(async () => {
          try {
            const token = await (window as any).grecaptcha.enterprise.execute(recaptchaSiteKey, {
              action: 'SUBMIT_LEAD_FORM'
            });

            updateFormData({ ...formValues, recaptchaToken: token });
            setErrors({});
            await handleSubmit();
          } catch (error) {
            console.error('reCAPTCHA error:', error);
            setErrors({ tcpaConsent: 'reCAPTCHA verification failed. Please try again.' });
          } finally {
            setIsSubmitting(false);
          }
        });
      } else {
        // Fallback if reCAPTCHA not loaded
        console.warn('reCAPTCHA not available, using placeholder token');
        updateFormData({ ...formValues, recaptchaToken: 'placeholder-token' });
        await handleSubmit();
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errorMap[err.path[0] as string] = err.message;
          }
        });
        setErrors(errorMap);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Almost Done!</h2>
      <p className="text-gray-600">Please review and accept our terms to receive your free quote.</p>

      {/* TCPA Consent */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="tcpaConsent"
            name="tcpaConsent"
            defaultChecked={formData.tcpaConsent || false}
            className={`mt-1 h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-2 focus:ring-brand-primary ${
              errors.tcpaConsent ? 'border-red-500' : ''
            }`}
            required
          />
          <label htmlFor="tcpaConsent" className="text-sm text-gray-700">
            <span className="font-semibold">I agree to receive communications</span>
            <br />
            By checking this box and clicking "Get My Free Quote", I provide my express written
            consent to receive marketing communications via telephone calls, text messages (SMS),
            and emails from this company and its affiliates regarding bathroom remodeling services,
            promotions, and special offers. I understand that:
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>
                Consent is not a condition of purchase and I may opt-out at any time by replying
                STOP to text messages or clicking unsubscribe in emails
              </li>
              <li>Message and data rates may apply for SMS communications</li>
              <li>I may receive automated calls or texts at the number provided</li>
              <li>
                My information will be handled according to the{' '}
                <a href="/privacy" className="text-brand-primary underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </label>
        </div>
        {errors.tcpaConsent && <p className="mt-2 text-sm text-red-500">{errors.tcpaConsent}</p>}
      </div>

      {/* Privacy Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Your Privacy Matters:</strong> We respect your privacy and will never sell your
          information. You can opt-out of communications at any time. See our{' '}
          <a href="/privacy" className="font-semibold underline">
            Privacy Policy
          </a>{' '}
          for details.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="w-1/2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-1/2 rounded-lg bg-brand-accent px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-brand-accent/90 focus:outline-none focus:ring-4 focus:ring-brand-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
        </button>
      </div>
    </form>
  );
}
