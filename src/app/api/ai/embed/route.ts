import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000), // Limit text length
    });

    return NextResponse.json({
      embedding: response.data[0].embedding,
    });
  } catch (error: any) {
    console.error('Embedding error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate embedding' }, { status: 500 });
  }
}



