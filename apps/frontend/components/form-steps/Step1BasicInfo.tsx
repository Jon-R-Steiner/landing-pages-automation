'use client';

import { useState } from 'react';
import { Step1Schema } from '@shared/validation/form-schemas';
import type { FormData } from '@shared/types';
import { z } from 'zod';

interface Step1Props {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
}

export default function Step1BasicInfo({ formData, updateFormData, nextStep }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formValues = {
      fullName: (form.elements.namedItem('fullName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      zipCode: (form.elements.namedItem('zipCode') as HTMLInputElement).value,
    };

    try {
      Step1Schema.parse(formValues);
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
      <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
      <p className="text-gray-600">Let us know how to reach you for your free quote.</p>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          defaultValue={formData.fullName || ''}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.fullName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={formData.email || ''}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={formData.phone || ''}
          placeholder="(555) 123-4567"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.phone
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* ZIP Code */}
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          ZIP Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          defaultValue={formData.zipCode || ''}
          placeholder="12345"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            errors.zipCode
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-brand-primary'
          }`}
          required
        />
        {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-lg bg-brand-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-primary/50"
      >
        Continue to Project Details
      </button>
    </form>
  );
}
