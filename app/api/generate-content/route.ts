import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface ContentGenerationRequest {
  pageType: string;
  location?: string;
  targetKeywords?: string[];
  useMake?: boolean;
  makeWebhookUrl?: string;
}

interface GeneratedContent {
  heroTitle: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  benefits: string[];
  processSteps: string[];
  faq: Array<{ question: string; answer: string }>;
  cta: string;
}

function buildPrompt(request: ContentGenerationRequest): string {
  const location = request.location || 'your area';
  const keywords = request.targetKeywords?.join(', ') || request.pageType;

  return `Generate SEO-optimized landing page content for a bathroom remodeling service.

Project Type: ${request.pageType}
Location: ${location}
Target Keywords: ${keywords}

Generate the following content in JSON format:
{
  "heroTitle": "Compelling hero headline with primary keyword",
  "heroSubtitle": "Supporting subtitle that addresses customer pain points",
  "metaTitle": "SEO-optimized title tag (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)",
  "h1": "Primary H1 heading with keyword",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
  "processSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "faq": [
    {"question": "Question 1?", "answer": "Answer 1"},
    {"question": "Question 2?", "answer": "Answer 2"},
    {"question": "Question 3?", "answer": "Answer 3"}
  ],
  "cta": "Call-to-action text"
}

Requirements:
- Use ${location} naturally in the content
- Include ${keywords} in meta and H1
- Benefits should focus on value, not features
- Process steps should be simple and clear
- FAQ answers should be 2-3 sentences
- CTA should create urgency

Return ONLY valid JSON, no markdown or additional text.`;
}

async function generateWithClaude(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('Claude API key not configured');
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildPrompt(request);

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse the JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function triggerMakeScenario(webhookUrl: string, data: any): Promise<any> {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Make.com webhook failed: ${response.statusText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const requestData: ContentGenerationRequest = await request.json();

    if (!requestData.pageType) {
      return NextResponse.json(
        {
          success: false,
          message: 'pageType is required',
        },
        { status: 400 }
      );
    }

    // If Make.com webhook is provided, trigger it
    if (requestData.useMake && requestData.makeWebhookUrl) {
      const makeResponse = await triggerMakeScenario(requestData.makeWebhookUrl, requestData);
      return NextResponse.json(
        {
          success: true,
          message: 'Content generation triggered via Make.com',
          makeResponse,
        },
        { status: 200 }
      );
    }

    // Otherwise, generate directly with Claude
    const content = await generateWithClaude(requestData);

    return NextResponse.json(
      {
        success: true,
        content,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Content generation error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Content generation failed',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
