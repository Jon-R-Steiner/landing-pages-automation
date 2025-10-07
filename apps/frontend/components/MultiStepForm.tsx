'use client';

import { useState } from 'react';
import Step1BasicInfo from './form-steps/Step1BasicInfo';
import Step2ProjectDetails from './form-steps/Step2ProjectDetails';
import Step3TCPAConsent from './form-steps/Step3TCPAConsent';
import type { FormData } from '@shared/types';

interface MultiStepFormProps {
  pageType: string;
  location?: string;
}

export default function MultiStepForm({ pageType, location }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    projectType: pageType as any,
    landingPageUrl: typeof window !== 'undefined' ? window.location.href : '',
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Submit to Netlify Function
      const response = await fetch('/.netlify/functions/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || 'Thank you! We will contact you shortly.');
        // Reset form after successful submission
        setFormData({
          projectType: pageType as any,
          landingPageUrl: typeof window !== 'undefined' ? window.location.href : '',
        });
        setCurrentStep(1);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      alert(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step <= currentStep
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-20 ${
                    step < currentStep ? 'bg-brand-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className={currentStep === 1 ? 'font-semibold' : 'text-gray-600'}>
            Contact Info
          </span>
          <span className={currentStep === 2 ? 'font-semibold' : 'text-gray-600'}>
            Project Details
          </span>
          <span className={currentStep === 3 ? 'font-semibold' : 'text-gray-600'}>
            Consent
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <Step1BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        {currentStep === 2 && (
          <Step2ProjectDetails
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3TCPAConsent
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
