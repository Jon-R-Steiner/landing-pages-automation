interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export class RecaptchaService {
  private secretKey: string;
  private minimumScore: number = 0.5; // Enterprise reCAPTCHA score threshold

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async verify(token: string, expectedAction: string = 'SUBMIT_LEAD_FORM'): Promise<boolean> {
    try {
      const url = 'https://recaptchaenterprise.googleapis.com/v1/projects/YOUR_PROJECT_ID/assessments';

      // For reCAPTCHA Enterprise API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: {
            token,
            expectedAction,
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          },
        }),
      });

      if (!response.ok) {
        console.error('reCAPTCHA verification failed:', await response.text());
        return false;
      }

      const result = await response.json();

      // Check if action matches
      if (result.tokenProperties?.action !== expectedAction) {
        console.error('reCAPTCHA action mismatch');
        return false;
      }

      // Check validity
      if (!result.tokenProperties?.valid) {
        console.error('reCAPTCHA token invalid');
        return false;
      }

      // Check score (Enterprise reCAPTCHA)
      const score = result.riskAnalysis?.score || 0;
      if (score < this.minimumScore) {
        console.warn(`reCAPTCHA score too low: ${score}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }

  setMinimumScore(score: number): void {
    if (score < 0 || score > 1) {
      throw new Error('Minimum score must be between 0 and 1');
    }
    this.minimumScore = score;
  }
}
