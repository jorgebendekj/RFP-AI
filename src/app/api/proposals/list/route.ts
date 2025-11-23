import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const result = await adminDB.query({
      proposals: {
        $: { where: { companyId } },
      },
    });

    return NextResponse.json({
      proposals: result.proposals || [],
    });
  } catch (error: any) {
    console.error('List proposals error:', error);
    return NextResponse.json({ error: error.message || 'Failed to list proposals' }, { status: 500 });
  }
}

