interface MakeScenario {
  id: number;
  name: string;
  isActive: boolean;
}

interface MakeWebhookResponse {
  success: boolean;
  executionId?: string;
  message?: string;
}

export class MakeService {
  private apiKey: string;
  private organizationId: string;
  private baseUrl: string = 'https://us1.make.com/api/v2';

  constructor(apiKey: string, organizationId?: string) {
    this.apiKey = apiKey;
    this.organizationId = organizationId || '';
  }

  /**
   * Trigger a Make.com scenario via webhook
   * This is the primary method for content generation
   */
  async triggerScenario(webhookUrl: string, data: any): Promise<MakeWebhookResponse> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Make.com webhook failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        executionId: result.executionId,
        message: 'Scenario triggered successfully',
      };
    } catch (error: any) {
      console.error('Make.com trigger error:', error);
      return {
        success: false,
        message: error.message || 'Failed to trigger scenario',
      };
    }
  }

  /**
   * List all scenarios in the organization
   */
  async listScenarios(): Promise<MakeScenario[]> {
    try {
      const response = await fetch(`${this.baseUrl}/scenarios`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Make.com API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.scenarios || [];
    } catch (error) {
      console.error('Make.com list scenarios error:', error);
      return [];
    }
  }

  /**
   * Get scenario details
   */
  async getScenario(scenarioId: number): Promise<MakeScenario | null> {
    try {
      const response = await fetch(`${this.baseUrl}/scenarios/${scenarioId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Make.com API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Make.com get scenario error:', error);
      return null;
    }
  }

  /**
   * Run a scenario manually (alternative to webhook)
   */
  async runScenario(scenarioId: number, data?: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/scenarios/${scenarioId}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      return response.ok;
    } catch (error) {
      console.error('Make.com run scenario error:', error);
      return false;
    }
  }
}
