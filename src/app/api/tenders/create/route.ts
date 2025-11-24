import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { adminDB } from '@/lib/instantdb-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      companyId, 
      title, 
      clientName, 
      tenderCode, 
      country, 
      deadline, 
      relatedDocumentIds, // Tender documents from government
      companyDocumentIds, // Company data documents
      rfpSampleIds // RFP proposal samples
    } = body;

    if (!companyId || !title || !clientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenderId = uuidv4();
    await adminDB.transact([
      adminDB.tx.tenders[tenderId].update({
        companyId,
        title,
        clientName,
        tenderCode: tenderCode || '',
        country: country || '',
        relatedDocumentIds: JSON.stringify(relatedDocumentIds || []), // Tender documents
        companyDocumentIds: JSON.stringify(companyDocumentIds || []), // Company data
        rfpSampleIds: JSON.stringify(rfpSampleIds || []), // RFP samples
        parsedRequirements: JSON.stringify({}),
        deadline: deadline || Date.now() + 30 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
      }),
    ]);

    console.log(`✅ Created tender ${tenderId} with:`);
    console.log(`   - Tender Documents: ${(relatedDocumentIds || []).length}`);
    console.log(`   - Company Documents: ${(companyDocumentIds || []).length}`);
    console.log(`   - RFP Samples: ${(rfpSampleIds || []).length}`);

    return NextResponse.json({
      tenderId,
      message: 'Tender created successfully',
    });
  } catch (error: any) {
    console.error('Create tender error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create tender' }, { status: 500 });
  }
}

