import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { adminDB } from '@/lib/instantdb-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, title, clientName, tenderCode, country, deadline, relatedDocumentIds } = body;

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
        relatedDocumentIds: JSON.stringify(relatedDocumentIds || []),
        parsedRequirements: JSON.stringify({}),
        deadline: deadline || Date.now() + 30 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
      }),
    ]);

    return NextResponse.json({
      tenderId,
      message: 'Tender created successfully',
    });
  } catch (error: any) {
    console.error('Create tender error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create tender' }, { status: 500 });
  }
}

