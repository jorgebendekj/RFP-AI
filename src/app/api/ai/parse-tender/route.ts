import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import { googleAI, GEMINI_MODEL, generateContentWithRetry } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenderId } = body;

    if (!tenderId) {
      return NextResponse.json({ error: 'Tender ID is required' }, { status: 400 });
    }

    // Get tender and related documents
    const tenderResult = await adminDB.query({
      tenders: {
        $: { where: { id: tenderId } },
      },
    });

    if (!tenderResult.tenders || tenderResult.tenders.length === 0) {
      return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    }

    const tender = tenderResult.tenders[0];
    const documentIds = JSON.parse(tender.relatedDocumentIds || '[]');

    // Get tender documents
    const docsResult = await adminDB.query({
      documents: {
        $: { where: { id: { in: documentIds } } },
      },
    });

    const documents = docsResult.documents || [];
    const combinedText = documents
      .map((doc: any) => doc.textExtracted)
      .join('\n\n');

    // Parse tender using Gemini 3
    // Increased context limit for Gemini 3 (1M tokens capacity)
    const prompt = `You are an expert at analyzing government tender documents. 
Analyze the following tender document and extract key information in JSON format.

Tender Document:
${combinedText.substring(0, 500000)}

Extract the following information and return as JSON:
{
  "requirements": [list of mandatory requirements],
  "scopeOfWork": "detailed scope description",
  "evaluationCriteria": [list of evaluation criteria with weights if mentioned],
  "billOfQuantities": [
    {
      "item": "item description",
      "unit": "unit of measurement",
      "quantity": number,
      "estimatedPrice": number (if mentioned)
    }
  ],
  "technicalSpecifications": [list of technical specs],
  "submissionDeadline": "deadline if mentioned",
  "eligibilityCriteria": [list of eligibility requirements],
  "documentationRequired": [list of required documents]
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
    // Cleanup if model returns markdown blocks
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedRequirements = JSON.parse(jsonString);

    // Update tender with parsed requirements
    await adminDB.transact([
      adminDB.tx.tenders[tenderId].update({
        parsedRequirements: JSON.stringify(parsedRequirements),
      }),
    ]);

    return NextResponse.json({
      parsedRequirements,
    });
  } catch (error: any) {
    console.error('Parse tender error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse tender' }, { status: 500 });
  }
}
