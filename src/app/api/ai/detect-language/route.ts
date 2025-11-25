import { NextRequest, NextResponse } from 'next/server';
import { googleAI, GEMINI_MODEL, generateContentWithRetry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Use Gemini 3 to detect language
    const prompt = `You are a language detection expert. Analyze the provided text and identify its language.
Respond with ONLY the ISO 639-1 language code (2 letters) in lowercase. Examples:
- en (English)
- es (Spanish)
- pl (Polish)
- fr (French)
- de (German)
- it (Italian)
- pt (Portuguese)

If you cannot determine the language with confidence, respond with "en".

Text to analyze:
"${text.substring(0, 1000)}"`;

    const response = await generateContentWithRetry({
      model: GEMINI_MODEL,
      contents: [{
        parts: [{ text: prompt }]
      }],
      config: {
        temperature: 0.1,
        maxOutputTokens: 10,
      }
    });
    
    const language = response.text?.trim().toLowerCase() || 'en';

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
