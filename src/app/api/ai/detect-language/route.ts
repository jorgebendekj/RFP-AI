import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Use OpenAI to detect language
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a language detection expert. Analyze the provided text and identify its language. 
          
Respond with ONLY the ISO 639-1 language code (2 letters) in lowercase. Examples:
- en (English)
- es (Spanish)
- pl (Polish)
- fr (French)
- de (German)
- it (Italian)
- pt (Portuguese)

If you cannot determine the language with confidence, respond with "en".`,
        },
        {
          role: 'user',
          content: text.substring(0, 1000), // Use first 1000 characters
        },
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    const language = completion.choices[0].message.content?.trim().toLowerCase() || 'en';

    // Validate it's a reasonable language code (2-3 letters)
    const validLanguage = /^[a-z]{2,3}$/.test(language) ? language : 'en';

    return NextResponse.json({ 
      language: validLanguage,
      confidence: 'high'
    });
  } catch (error: any) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { error: error.message || 'Language detection failed', language: 'en' },
      { status: 500 }
    );
  }
}



