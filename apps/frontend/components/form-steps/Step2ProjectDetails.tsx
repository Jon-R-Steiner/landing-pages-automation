'use client';

import { useState } from 'react';
import { Step2Schema } from '@/lib/validation';
import type { FormData } from '@/types';
import { z } from 'zod';

interface Step2Props {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step2ProjectDetails({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: Step2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formValues = {
      projectType: formData.projectType || ('full-bathroom-remodel' as any),
      timeframe: (form.elements.namedItem('timeframe') as HTMLSelectElement).value as any,
      budget: (form.elements.namedItem('budget') as HTMLSelectElement).value as any,
      propertyType: (form.elements.namedItem('propertyType') as HTMLSelectElement).value as any,
      ownRent: (form.elements.namedItem('ownRent') as HTMLSelectElement).value as any,
    };

    try {
      Step2Schema.parse(formValues);
      updateFormData(formValues);
      setErrors({});
      nextStep();
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
      <p className="text-gray-600">Help us understand your bathroom renovation needs.</p>

      {/* Project Timeline */}
      <div>
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
          When do you want to start? <span className="text-red-500">*</span>
        </label>
        <select
          id="timeframe"
          name="timeframe"
          defaultValue={formData.timeframe || ''}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.timeframe
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        >
          <option value="">Select timeline</option>
          <option value="immediate">Immediately (Within 2 weeks)</option>
          <option value="1-3-months">1-3 months</option>
          <option value="3-6-months">3-6 months</option>
          <option value="6-12-months">6-12 months</option>
          <option value="just-exploring">Just researching</option>
        </select>
        {errors.timeframe && <p className="mt-1 text-sm text-red-500">{errors.timeframe}</p>}
      </div>

      {/* Budget Range */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Estimated Budget <span className="text-red-500">*</span>
        </label>
        <select
          id="budget"
          name="budget"
          defaultValue={formData.budget || ''}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.budget
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        >
          <option value="">Select budget range</option>
          <option value="under-5k">Under $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-20k">$10,000 - $20,000</option>
          <option value="20k-50k">$20,000 - $50,000</option>
          <option value="over-50k">Over $50,000</option>
        </select>
        {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
      </div>

      {/* Property Type */}
      <div>
        <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          id="propertyType"
          name="propertyType"
          defaultValue={formData.propertyType || ''}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.propertyType
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        >
          <option value="">Select property type</option>
          <option value="single-family">Single Family Home</option>
          <option value="condo">Condo</option>
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
          <option value="mobile-home">Mobile Home</option>
        </select>
        {errors.propertyType && <p className="mt-1 text-sm text-red-500">{errors.propertyType}</p>}
      </div>

      {/* Own or Rent */}
      <div>
        <label htmlFor="ownRent" className="block text-sm font-medium text-gray-700">
          Do you own or rent? <span className="text-red-500">*</span>
        </label>
        <select
          id="ownRent"
          name="ownRent"
          defaultValue={formData.ownRent || ''}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.ownRent
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        >
          <option value="">Select ownership type</option>
          <option value="own">I own this property</option>
          <option value="rent">I rent this property</option>
        </select>
        {errors.ownRent && <p className="mt-1 text-sm text-red-500">{errors.ownRent}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/2 rounded-lg bg-brand-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-primary/50"
        >
          Continue to Consent
        </button>
      </div>
    </form>
  );
}
