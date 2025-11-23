import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const type = searchParams.get('type');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    let query: any = {
      documents: {
        $: {
          where: { companyId },
        },
      },
    };

    if (type) {
      query.documents.$.where.type = type;
    }

    const result = await adminDB.query(query);

    return NextResponse.json({
      documents: result.documents || [],
    });
  } catch (error: any) {
    console.error('List documents error:', error);
    return NextResponse.json({ error: error.message || 'Failed to list documents' }, { status: 500 });
  }
}

