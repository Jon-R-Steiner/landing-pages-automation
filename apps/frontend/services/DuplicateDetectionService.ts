import type { CompleteFormData } from '@shared/validation/form-schemas';
import { AirtableService } from './AirtableService';

export class DuplicateDetectionService {
  private airtableService: AirtableService;
  private duplicateWindowHours: number = 24;

  constructor(apiKey: string, baseId: string) {
    this.airtableService = new AirtableService(apiKey, baseId);
  }

  async checkDuplicate(formData: CompleteFormData): Promise<boolean> {
    // Check for duplicate by email within the configured time window
    const isDuplicateEmail = await this.airtableService.checkDuplicateByEmail(
      formData.email,
      this.duplicateWindowHours
    );

    if (isDuplicateEmail) {
      console.log(`Duplicate submission detected for email: ${formData.email}`);
      return true;
    }

    // Additional duplicate checks can be added here:
    // - Check by phone number
    // - Check by email + ZIP code combination
    // - Check by IP address (if tracked)

    return false;
  }

  setDuplicateWindow(hours: number): void {
    if (hours <= 0) {
      throw new Error('Duplicate window must be greater than 0');
    }
    this.duplicateWindowHours = hours;
  }

  /**
   * Check if this is a recent duplicate (within configured window)
   * vs an older submission that should be allowed
   */
  async isRecentDuplicate(email: string): Promise<boolean> {
    return await this.airtableService.checkDuplicateByEmail(email, this.duplicateWindowHours);
  }
}
