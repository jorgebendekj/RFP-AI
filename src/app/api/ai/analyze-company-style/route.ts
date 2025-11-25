import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import { googleAI, GEMINI_MODEL, generateContentWithRetry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get model RFP documents
    const docsResult = await adminDB.query({
      documents: {
        $: { where: { companyId, type: 'model_rfp' } },
      },
    });

    const documents = docsResult.documents || [];

    if (documents.length === 0) {
      return NextResponse.json({ error: 'No model RFP documents found' }, { status: 404 });
    }

    // Sample text from documents - Increased limit for Gemini 3
    const sampleTexts = documents
      .slice(0, 10) // Analyze up to 10 docs if available
      .map((doc: any) => doc.textExtracted.substring(0, 100000)) // 100k chars per doc
      .join('\n\n---\n\n');

    // Analyze company style using AI
    const prompt = `You are an expert at analyzing proposal writing styles. 
Analyze the following sample proposal documents from a company and identify their writing style, structure, and patterns.

Sample Proposals:
${sampleTexts}

Extract and return the following information as JSON:
{
  "typicalSections": [
    {
      "name": "section name",
      "order": number,
      "description": "typical content"
    }
  ],
  "toneOfVoice": "description of writing tone (formal, technical, persuasive, etc.)",
  "writingPatterns": [list of observed patterns],
  "commonPhrases": [list of frequently used phrases or expressions],
  "structuralElements": [list of structural patterns like headings, lists, tables],
  "technicalDepth": "assessment of technical detail level",
  "visualElements": [list of typical visual elements mentioned]
}

Return only valid JSON, no other text.`;

    const response = await generateContentWithRetry({
      model: GEMINI_MODEL,
      contents: [{
        parts: [{ text: prompt }]
      }],
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    });

    let jsonString = response.text || '{}';
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const companyStyle = JSON.parse(jsonString);

    return NextResponse.json({
      companyStyle,
    });
  } catch (error: any) {
    console.error('Analyze company style error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze company style' }, { status: 500 });
  }
}
