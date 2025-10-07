import type { Handler, HandlerEvent } from '@netlify/functions';
import { ClaudeService } from '../../services/ClaudeService';
import { MakeService } from '../../services/MakeService';
import type { PageType } from '@shared/types';

interface GenerateContentRequest {
  pageType: PageType;
  location?: string;
  targetKeywords?: string[];
  competitorUrls?: string[];
  useMake?: boolean; // If true, trigger Make.com scenario instead of direct Claude
  makeWebhookUrl?: string;
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const request: GenerateContentRequest = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!request.pageType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'pageType is required' }),
      };
    }

    // Option 1: Trigger Make.com scenario (recommended for complex workflows)
    if (request.useMake && request.makeWebhookUrl) {
      const makeService = new MakeService(process.env.MAKE_API_KEY!);

      const result = await makeService.triggerScenario(request.makeWebhookUrl, {
        pageType: request.pageType,
        location: request.location,
        targetKeywords: request.targetKeywords,
        competitorUrls: request.competitorUrls,
      });

      return {
        statusCode: result.success ? 200 : 500,
        body: JSON.stringify(result),
      };
    }

    // Option 2: Direct Claude API call (faster, simpler)
    const claudeService = new ClaudeService(process.env.CLAUDE_API_KEY!);

    const content = await claudeService.generateLandingPageContent({
      pageType: request.pageType,
      location: request.location,
      targetKeywords: request.targetKeywords,
      competitorUrls: request.competitorUrls,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        content,
        message: 'Content generated successfully',
      }),
    };
  } catch (error: any) {
    console.error('Content generation error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message || 'Failed to generate content',
      }),
    };
  }
};
