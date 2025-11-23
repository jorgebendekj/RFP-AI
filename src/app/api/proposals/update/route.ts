import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, editorState, status, userId } = body;

    if (!proposalId) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (editorState) {
      updates.editorState = JSON.stringify(editorState);
    }

    if (status) {
      updates.status = status;
    }

    if (userId) {
      updates.lastEditedByUserId = userId;
    }

    await adminDB.transact([
      adminDB.tx.proposals[proposalId].update(updates),
    ]);

    return NextResponse.json({
      message: 'Proposal updated successfully',
    });
  } catch (error: any) {
    console.error('Update proposal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update proposal' }, { status: 500 });
  }
}


