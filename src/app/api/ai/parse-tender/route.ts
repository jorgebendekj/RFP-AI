import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Parse tender using AI
    const prompt = `You are an expert at analyzing government tender documents. 
Analyze the following tender document and extract key information in JSON format.

Tender Document:
${combinedText.substring(0, 15000)}

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const parsedRequirements = JSON.parse(completion.choices[0].message.content || '{}');

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


