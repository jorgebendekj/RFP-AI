import { NextRequest, NextResponse } from 'next/server';
import { googleAI, embedContentWithRetry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Use Gemini for embeddings
    // text-embedding-004 is the latest stable embedding model
    const response = await embedContentWithRetry({
      model: 'text-embedding-004',
      contents: [{
        parts: [{ text: text.substring(0, 10000) }]
      }]
    });

    // response.embeddings should contain the embeddings when 'contents' (plural) is used
    // We expect a single embedding for the single content part
    const embedding = response.embeddings?.[0]?.values || [];

    return NextResponse.json({
      embedding: embedding,
    });
  } catch (error: any) {
    console.error('Embedding error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate embedding' }, { status: 500 });
  }
}
