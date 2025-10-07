import Anthropic from '@anthropic-ai/sdk';
import type { PageType } from '@shared/types';

interface ContentGenerationRequest {
  pageType: PageType;
  location?: string;
  targetKeywords?: string[];
  competitorUrls?: string[];
}

interface GeneratedContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  benefits: string[];
  testimonials: Array<{
    name: string;
    location: string;
    text: string;
    rating: number;
  }>;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  ctaHeadline: string;
  ctaSubheadline: string;
}

export class ClaudeService {
  private client: Anthropic;
  private model: string = 'claude-3-5-sonnet-20241022';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateLandingPageContent(
    request: ContentGenerationRequest
  ): Promise<GeneratedContent> {
    const prompt = this.buildContentPrompt(request);

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return this.parseGeneratedContent(content.text);
    } catch (error: any) {
      console.error('Claude API error:', error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  private buildContentPrompt(request: ContentGenerationRequest): string {
    const { pageType, location, targetKeywords, competitorUrls } = request;

    const pageTypeLabel = pageType
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const locationContext = location
      ? `in ${location.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
      : '';

    return `You are an expert SEO copywriter for bathroom remodeling services. Generate compelling, conversion-optimized content for a landing page.

**Page Type**: ${pageTypeLabel} ${locationContext}
**Target Keywords**: ${targetKeywords?.join(', ') || 'bathroom remodeling, professional installation'}
${competitorUrls ? `**Competitor Research**: ${competitorUrls.join(', ')}` : ''}

Generate content in JSON format with the following structure:

{
  "heroHeadline": "Compelling headline (60-80 chars, include main keyword)",
  "heroSubheadline": "Supporting text (120-160 chars, emphasize benefits)",
  "heroCtaText": "Action-oriented CTA button text (3-5 words)",
  "benefits": [
    "Benefit 1 (focus on outcomes, not features)",
    "Benefit 2",
    "Benefit 3",
    "Benefit 4",
    "Benefit 5"
  ],
  "testimonials": [
    {
      "name": "First name + Last initial",
      "location": "City, State",
      "text": "Authentic-sounding testimonial (150-200 chars)",
      "rating": 5
    },
    {
      "name": "First name + Last initial",
      "location": "City, State",
      "text": "Authentic-sounding testimonial (150-200 chars)",
      "rating": 5
    },
    {
      "name": "First name + Last initial",
      "location": "City, State",
      "text": "Authentic-sounding testimonial (150-200 chars)",
      "rating": 5
    }
  ],
  "faqItems": [
    {
      "question": "Common customer question about ${pageTypeLabel}?",
      "answer": "Detailed answer (200-300 chars, include keywords naturally)"
    },
    {
      "question": "Question about cost/pricing?",
      "answer": "Answer addressing budget concerns"
    },
    {
      "question": "Question about timeline?",
      "answer": "Answer about project duration"
    },
    {
      "question": "Question about warranty/guarantee?",
      "answer": "Answer building trust"
    },
    {
      "question": "Question about process?",
      "answer": "Answer explaining workflow"
    }
  ],
  "ctaHeadline": "Final compelling headline for bottom CTA",
  "ctaSubheadline": "Urgency or value proposition for final CTA"
}

**Content Guidelines**:
- Use natural, conversational language
- Focus on benefits and outcomes, not just features
- Include location-specific references ${location ? 'for ' + locationContext : 'when relevant'}
- Maintain professional yet approachable tone
- Address common pain points and objections
- Use action-oriented language
- Ensure all content is original and avoids clichés

Return ONLY the JSON object, no additional text.`;
  }

  private parseGeneratedContent(text: string): GeneratedContent {
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Failed to parse Claude response:', text);
      throw new Error('Invalid JSON response from Claude');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Respond with "OK" if you can receive this message.',
          },
        ],
      });

      return message.content.length > 0;
    } catch (error) {
      console.error('Claude connection test failed:', error);
      return false;
    }
  }
}
