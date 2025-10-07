import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API route working',
    env_check: {
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasClaudeKey: !!process.env.CLAUDE_API_KEY,
    }
  });
}
