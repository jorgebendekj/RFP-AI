import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const documentId = searchParams.get('documentId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    let query: any = {
      documents: {
        $: {
          where: { companyId, status: 'processed' },
        },
      },
    };

    if (documentId) {
      query.documents.$.where.id = documentId;
    }

    const result = await adminDB.query(query);
    const documents = result.documents || [];

    // Return documents with their full extracted text
    const documentsWithContent = documents.map((doc: any) => ({
      id: doc.id,
      fileName: doc.fileName,
      type: doc.type,
      hasTables: doc.hasTables,
      detectedLanguage: doc.detectedLanguage,
      textExtracted: doc.textExtracted,
      metadata: JSON.parse(doc.metadata || '{}'),
      uploadedAt: doc.uploadedAt,
    }));

    return NextResponse.json({
      documents: documentsWithContent,
      totalDocuments: documentsWithContent.length,
    });
  } catch (error: any) {
    console.error('Analyze documents error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze documents' }, { status: 500 });
  }
}


