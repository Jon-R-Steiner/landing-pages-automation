import type { CompleteFormData } from '@shared/validation/form-schemas';
import type { SubmissionResponse } from '@shared/types';

interface AirtableRecord {
  fields: {
    'Full Name': string;
    'Email': string;
    'Phone': string;
    'ZIP Code': string;
    'Project Type': string;
    'Timeframe': string;
    'Budget': string;
    'Property Type': string;
    'Own or Rent': string;
    'TCPA Consent': boolean;
    'UTM Source'?: string;
    'UTM Medium'?: string;
    'UTM Campaign'?: string;
    'GCLID'?: string;
    'FBCLID'?: string;
    'Landing Page URL': string;
    'Submission Date': string;
    'Status': string;
  };
}

export class AirtableService {
  private apiKey: string;
  private baseId: string;
  private tableId: string = 'tbl7V4S7GZ25PXLo9'; // From user-provided Airtable URL

  constructor(apiKey: string, baseId: string) {
    this.apiKey = apiKey;
    this.baseId = baseId;
  }

  async createLead(formData: CompleteFormData): Promise<string> {
    const record: AirtableRecord = {
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
        'Landing Page URL': formData.landingPageUrl,
        'Submission Date': new Date().toISOString(),
        'Status': 'Pending',
      },
    };

    // Add optional marketing fields
    if (formData.utmSource) record.fields['UTM Source'] = formData.utmSource;
    if (formData.utmMedium) record.fields['UTM Medium'] = formData.utmMedium;
    if (formData.utmCampaign) record.fields['UTM Campaign'] = formData.utmCampaign;
    if (formData.gclid) record.fields['GCLID'] = formData.gclid;
    if (formData.fbclid) record.fields['FBCLID'] = formData.fbclid;

    const url = `https://api.airtable.com/v0/${this.baseId}/${this.tableId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Airtable API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.id;
  }

  async checkDuplicateByEmail(email: string, withinHours: number = 24): Promise<boolean> {
    const cutoffTime = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString();

    const formula = `AND({Email} = '${email}', IS_AFTER({Submission Date}, '${cutoffTime}'))`;
    const url = `https://api.airtable.com/v0/${this.baseId}/${this.tableId}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('Airtable duplicate check failed:', await response.text());
      return false; // Fail open - allow submission if check fails
    }

    const result = await response.json();
    return result.records && result.records.length > 0;
  }
}
